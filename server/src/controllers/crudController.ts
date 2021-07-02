import { Router, Request, Response } from "express";
import Error                         from "../libs/error";
import Query                          from "../libs/query";
import pool                          from '../config/database';


export default class CrudController{

    private static router: Router = Router();


    private static getArticles(req: Request, res: Response){

        interface QueryData{
            skip: number,
            take: number,
        }

        let
            mysql = pool(),
            QueryData : QueryData              = req.body,
            dataErrors: Array<keyof QueryData> = [];

        dataErrors = Query.checkData(QueryData, ['skip', 'take']);
        
        if(dataErrors.length){
            res.status(400).send({error: Error.dataNotSended(dataErrors[0])});
            return;
        }

        if(mysql == undefined){
            res.status(400).send({error: Error.db()});
            return;
        }

        mysql.query(
            'select `article`.id, `article`.views, `article`.`date`, `article`.`time`, `article`.isReady, `articleType`.`title` as `t_title`, `article`.title from `article` left join `articleType` on `articleType`.`id` = `article`.`articleTypeId` order by `article`.`id` desc limit ?, ? ', 
            [Number(QueryData.skip), Number(QueryData.take)]
        )
        .then(value => {
            res.status(200).send({articles: value[0]});
        })
        .catch(error => {
            console.error(error);
            res.status(400).send({error: Error.db()});
        });

    }


    private static getAmountArticles(req: Request, res: Response){

        let mysql = pool();

        if(mysql == undefined){
            res.status(400).send({error: Error.db()});
            return;
        }
        
        mysql.query('select count(*) from `article`')
        .then(value => {
            res.status(200).send({amount: (value[0] as any)[0]['count(*)']});
        })
        .catch(error => {
            console.error(error);
            res.status(400).send({error: Error.db()});
        });
    
    }


    private static getArticle(req: Request, res: Response){

        interface QueryData{
            id: number;
        }

        let
            mysql = pool(),
            QueryData : QueryData              = req.params as any,
            dataErrors: Array<keyof QueryData> = [];

        dataErrors = Query.checkData(QueryData, ['id']);
        
        if(dataErrors.length){
            res.status(400).send({error: Error.dataNotSended(dataErrors[0])});
            return;
        }

        if(mysql == undefined){
            res.status(400).send({error: Error.db()});
            return;
        }

        mysql.query(
            'select `article`.id, `article`.views, `article`.`date`, `article`.`time`, `article`.isReady, `articleType`.`title` as `t_title`, `article`.title, `article`.`text` from `article` left join `articleType` on `articleType`.`id` = `article`.`articleTypeId` where `article`.`id` = ?',
            [Number(QueryData.id)]
        )
        .then(value => {
            res.status(200).send({article: (value[0] as Array<object>)[0]});
        })
        .catch((reason: any) => {
            console.error(reason);
            res.status(400).send({error: Error.db()});
        });

    }


    private static removeArticle(req: Request, res: Response){

        interface QueryData{
            id: number;
        }

        let
            mysql = pool(),
            QueryData : QueryData              = req.params as any,
            dataErrors: Array<keyof QueryData> = [];

        dataErrors = Query.checkData(QueryData, ['id']);
        
        if(dataErrors.length){
            res.status(400).send({error: Error.dataNotSended(dataErrors[0])});
            return;
        }

        if(mysql == undefined){
            res.status(400).send({error: Error.db()});
            return;
        }

        mysql.query('delete from `article` where id = ?', [Number(QueryData.id)])
        .then(value => {
            res.status(200).send({msg: `Article with id: ${QueryData.id} was deleted successfully`});
        })
        .catch(error => {
            console.error(error);
            res.status(400).send({error: Error.db()})
        }); 
    }


    private static getTypes(req: Request, res: Response){
        
        let mysql = pool();

        if(mysql == undefined){
            res.status(400).send({error: Error.db()});
            return;
        }

        mysql.query('select * from articleType')
        .then(value => {
            res.status(200).send({types: value[0]});
        })
        .catch(error => {
            console.error(error);
            res.status(400).send({error: Error.db()});
        })
    }


    private static addArticle(req: Request, res: Response){
        
        interface QueryData{
            article: {
                title        : string;
                text         : string;
                isReady      : boolean;
                date         : Date;
                time         : string;
                articleTypeId: string;
                img          : string;
            };
        }

        let
            mysql = pool(),
            QueryData : QueryData              = req.params as any,
            dataErrors: Array<keyof QueryData> = [];

        dataErrors = Query.checkData(QueryData, ['article']);
        
        if(dataErrors.length){
            res.status(400).send({error: Error.dataNotSended(dataErrors[0])});
            return;
        }

        if(mysql == undefined){
            res.status(400).send({error: Error.db()});
            return;
        }
        
    }


    public static routes(){
        //* order of routes affects working
        this.router.post(  '/',           this.getArticles);
        this.router.post(  '/amount',     this.getAmountArticles);
        this.router.get(   '/types',      this.getTypes);
        this.router.get(   '/:id',        this.getArticle);
        this.router.delete('/:id/remove', this.removeArticle);
        this.router.put(   '/add',        this.addArticle);
        

        return this.router;
    }

}