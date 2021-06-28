import { Router, Request, Response } from "express";
import Error                         from "../libs/error";
import Post                          from "../libs/post";
import pool                          from '../config/database';
import { OkPacket, ResultSetHeader, RowDataPacket } from "mysql2";


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

        try {
            mysql!.query('select * from `article` limit ?, ?', [Number(POST.skip), Number(POST.take)])
            .then((value) => {
                res.status(200).send({articles: value[0]});
            })
        } catch (error) {
            console.error(error);
        }
    }


    public static routes(){
        this.router.post('/', this.getArticles);

        return this.router;
    }

}