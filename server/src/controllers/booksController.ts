import e, { Router, Request, Response } from "express";
import ErrorMessage                     from "../libs/error";
import Query                            from "../libs/query";
import Books                             from "../models/Books";
import crypto                           from "crypto-js";
import { ValidationError, ValidationErrorItem }              from 'sequelize/types';
import { strict } from "assert/strict";
import { get } from "http";


export default class BooksController {

    private static router: Router = Router();

    
    public static async getBooks(req: Request, res: Response){
        
        interface QueryData{
            skip: number,
            take: number,
        }

        let
            QueryData : QueryData              = req.body as any,
            books     : Array<Books>           = [],
            dataErrors: Array<keyof QueryData> = [];

        dataErrors = Query.checkData(QueryData, ['skip', 'take']);
        
        if(dataErrors.length){
            res.status(400).send({error: ErrorMessage.dataNotSended(dataErrors[0])});
            return;
        }

        try {
            books = await Books.findAll({limit: Number(QueryData.take), offset: Number(QueryData.skip)});
        } catch (error) {
            res.status(400).send({error: ErrorMessage.db()});
            console.error(error);
            return;
        }
        
        res.status(200).send({books: books});
    }


    public static async getBook(req: Request, res: Response){
        
        let 
            id : number = Number(req.params.id),
            book: Books | null; 
            
        if (id == undefined){
            res.status(400).send({error: ErrorMessage.dataNotSended('id')});
            return;
        } 
        
        try{
            book = await Books.findOne({where: {id: id}});
        }catch(error){
            console.error(error);
            res.status(400).send({error: ErrorMessage.dataNotSended('id')});
            return;
        }

        if(book == null){
            res.status(400).send({error: ErrorMessage.dataNotSended('book')});
            return;
        }
     
        res.status(200).send({book: book});
    }


    public static async getAmountBooks(req: Request, res: Response){
        
        let amount: number = 0; 

        try{
            amount = await Books.count();
        }catch(error){
            console.error(error);
            res.send(400).send({error: ErrorMessage.db()});
            return;
        }
        
        res.status(200).send({amount: amount});
    } 

    public static async removeBook(req: Request, res: Response){
        let 
            id : number = Number(req.body.id),
            bookId: number; 
        
        if (id == undefined){
            res.status(400).send({error: ErrorMessage.dataNotSended('id')});
            return;
        }   

        try {
            bookId = await Books.destroy({where: {id: id}});            
        } catch (error){
            res.status(400).send({error: ErrorMessage.db()});
            return;
        }

        res.status(200).send({id: bookId});

    }

    public static async CreateBook(req: Request, res: Response){

        interface QueryData{
            book: {
                title      : string,
                text       : string,
                isCompleted: boolean,
                writingDate: string,  
            }
        }

        let 
            book      : Books                  = new Books(),
            dataErrors: Array<keyof QueryData> = [],
            QueryData : QueryData              = req.body;  

        dataErrors = Query.checkData(QueryData, ['book']);    

        if(dataErrors.length){
            res.status(400).send(ErrorMessage.dataNotSended(dataErrors[0]));
            return;
        }

        book = Books.build({title: QueryData.book.title, text: QueryData.book.text, isCompleted: QueryData.book.isCompleted, writingDate: QueryData.book.writingDate});
        
        try {
            await book.validate();
            await book.save();

        } catch (validationErr: any){
            const errors: Record<string, string> = {};
            validationErr.errors.forEach((item: ValidationErrorItem) => { if(item.path) errors[item.path] = item.message });
            res.status(422).send({error: ErrorMessage.db(), validationErrors: errors});
            return
        }

        res.status(200).send({msg: `Book created id  =  ${book.id}` });
    }

    public static async editBook(req: Request, res: Response){
        interface QueryData{
            book: {
                title      : string,
                text       : string,
                isCompleted: boolean,
                writingDate: string,  
            }
        }

        let 
            id        : number                 = Number(req.params.id),
            QueryData : QueryData              = req.body as any,
            dataErrors: Array<keyof QueryData> = [],
            book      : Books | null;

        dataErrors = Query.checkData(QueryData, ['book']);
        
        if(dataErrors.length){
            res.status(400).send({error: ErrorMessage.dataNotSended(dataErrors[0])});
            return;
        }

        if (id == undefined){
            res.status(400).send({error: ErrorMessage.dataNotSended(dataErrors[0])});
            return;
        }

        try {
            book = await Books.findOne({where: {id: id}});
        } catch (error){
            console.error(error);
            res.status(400).send({error: ErrorMessage.dataNotSended('id')});
            return;
        }

        if (book == undefined){
            res.status(400).send({error: ErrorMessage.notFound(`book with id: ${id}`)});
            return;
        }

        book.set('title',       QueryData.book.title);
        book.set('text',        QueryData.book.text);
        book.set('isCompleted', QueryData.book.isCompleted);
        book.set('writingDate', QueryData.book.writingDate);

        try {
            await book.validate();
            await book.save();
        } catch (validationErr: any) {
            const errors: Record<string, string> = {};
            validationErr.errors.forEach((item: ValidationErrorItem) => { if(item.path) errors[item.path] = item.message });
            res.status(422).send({error: ErrorMessage.db(), validationErrors: errors});
            return;
        }

        res.status(200).send({msg: `Book with id: ${id} successfully changed`});
    }
   

    public static routes(){

        this.router.post(   '/',          this.getBooks);
        this.router.post(   '/amount',    this.getAmountBooks);
        this.router.post(   '/:id',       this.getBook);
        this.router.delete('/:id/remove', this.removeBook);
        this.router.put(    '/:id/edit',  this.editBook)
        this.router.put(    '/add',       this.CreateBook)

        return this.router;   
    }

}

