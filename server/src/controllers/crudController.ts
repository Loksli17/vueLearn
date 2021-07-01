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
            POST      : QueryData              = req.body,
            dataErrors: Array<keyof QueryData> = [];

        dataErrors = Query.checkData(POST, ['skip', 'take']);
        
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
            [Number(POST.skip), Number(POST.take)]
        )
        .then((value) => {
            res.status(200).send({articles: value[0]});
        })
        .catch((reason: any) => {
            console.error(reason);
            res.status(400).send({err: reason});
        });

    }


    private static getAmountArticles(req: Request, res: Response){

        let mysql = pool();

        if(mysql == undefined){
            res.status(400).send({error: Error.db()});
            return;
        }
        
        mysql.query('select count(*) from `article`')
        .then((value) => {
            res.status(200).send({amount: (value[0] as any)[0]['count(*)']});
        })
        .catch((reason: any) => {
            console.error(reason);
            res.status(400).send({err: reason});
        });
    
    }


    private static getArticle(req: Request, res: Response){

        interface QueryData{
            id: number;
        }

        let
            mysql = pool(),
            GET       : QueryData              = req.params as any,
            dataErrors: Array<keyof QueryData> = [];

        dataErrors = Query.checkData(GET, ['id']);
        
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
            [Number(GET.id)]
        )
        .then((value) => {
            res.status(200).send({article: (value[0] as Array<object>)[0]});
        })
        .catch((reason: any) => {
            console.error(reason);
            res.status(400).send({err: reason});
        });

    }


    public static routes(){
        this.router.post('/',       this.getArticles);
        this.router.post('/amount', this.getAmountArticles);
        this.router.get('/:id',     this.getArticle);

        return this.router;
    }

}