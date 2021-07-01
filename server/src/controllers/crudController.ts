import { Router, Request, Response } from "express";
import Error                         from "../libs/error";
import Post                          from "../libs/post";
import pool                          from '../config/database';


export default class CrudController{

    private static router: Router = Router();


    private static getArticles(req: Request, res: Response){

        interface POST{
            skip: number,
            take: number,
        }

        let
            mysql = pool(),
            POST      : POST              = req.body,
            postErrors: Array<keyof POST> = [];

        postErrors = Post.checkData(POST, ['skip', 'take']);
        
        if(postErrors.length){
            res.status(400).send({error: Error.dataNotSended(postErrors[0])});
            return;
        }

        if(mysql == undefined){
            res.status(400).send({error: Error.db()});
            return;
        }

        mysql!.query('select * from `article` order by id desc limit ?, ? ', [Number(POST.skip), Number(POST.take)])
        .then((value) => {
            res.status(200).send({articles: value[0]});
        })
        .catch((reason: any) => {
            console.error(reason);
        });

    }


    private static getAmountArticles(req: Request, res: Response){

        let mysql = pool();

        if(mysql == undefined){
            res.status(400).send({error: Error.db()});
            return;
        }
        
        mysql!.query('select count(*) from `article`')
        .then((value) => {
            res.status(200).send({amount: (value[0] as any)[0]['count(*)']});
        })
        .catch((reason: any) => {
            console.error(reason);
        })
    
    }


    public static routes(){
        this.router.post('/',       this.getArticles);
        this.router.post('/amount', this.getAmountArticles);

        return this.router;
    }

}