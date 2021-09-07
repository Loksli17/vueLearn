import { Router, Request, Response } from "express";
import ErrorMessage                  from "../libs/error";
import Query                         from "../libs/query";


export default class SequelizeCrudController{

    private static router: Router = Router();


    public static getArticles(req: Request, res: Response){

        interface QueryData{
            skip: number,
            take: number,
        }

        let
            QueryData : QueryData              = req.body,
            dataErrors: Array<keyof QueryData> = [];

        dataErrors = Query.checkData(QueryData, ['skip', 'take']);
        
        if(dataErrors.length){
            res.status(400).send({error: ErrorMessage.dataNotSended(dataErrors[0])});
            return;
        }

        
    }


    public static routes(){

        // this.router.post(  '/',              this.getArticles);
        // this.router.post(  '/amount',        this.getAmountArticles);
        // this.router.get(   '/article-types', this.getTypes);
        // this.router.get(   '/:id',           this.getArticle);
        // this.router.delete('/:id/remove',    this.removeArticle);
        // this.router.put(   '/add',           this.addArticle);
        // this.router.put(   '/:id/edit',      this.editArticle);
        // this.router.post(  '/article-image', this.imageUpload);

        return this.router;
    }

}