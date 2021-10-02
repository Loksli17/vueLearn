import e, { Router, Request, Response } from "express";
import ErrorMessage                     from "../libs/error";
import Query                            from "../libs/query";
import Books                             from "../models/Books";
import crypto                           from "crypto-js";
import { ValidationError, ValidationErrorItem }              from 'sequelize/types';
import { strict } from "assert/strict";


export default class BooksController {
    private static router: Router = Router();

    public static async getBooks(req: Request, res: Response){
        interface QueryData{
            skip: number,
            take: number,
        }

        let
            QueryData : QueryData              = req.body as any,
            books     : Array<Books>            = [],
            dataErrors: Array<keyof QueryData> = [];

        dataErrors = Query.checkData(QueryData, ['skip', 'take']);
        
        if(dataErrors.length){
            res.status(400).send({error: ErrorMessage.dataNotSended(dataErrors[0])});
            return;
        }

        try {
            books = await Books.findAll({limit:Number(QueryData.take), offset: Number(QueryData.skip)});
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
   
    public static routes(){
        this.router.post('/ ', this.getBooks);
        this.router.post('/amount', this.getAmountBooks);
        this.router.post('/:id', this.getBook);

        return this.router   
    }

}

