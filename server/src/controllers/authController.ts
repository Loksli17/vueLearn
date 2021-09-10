import e, { Router, Request, Response } from "express";
import ErrorMessage                  from "../libs/error";
import Query                         from "../libs/query";
import pool                          from '../config/database';
import { Pool }                      from "mysql2/promise";


export default class AuthController{

    private static router: Router = Router();


    private static authentificateUser(req: Request, res: Response){

        interface QueryData{
            email   : string;
            password: string
        }

        let
            mysql     : Pool | undefined        = pool(),
            dataErrors: Array<keyof QueryData>  = [],
            QueryData : QueryData               = req.body,
            user      : any                     = {};

        dataErrors = Query.checkData(QueryData, ['email', 'password']);

        if(dataErrors.length) { res.status(400).send({error: ErrorMessage.dataNotSended(dataErrors[0])}); return }

        if(!mysql) { res.status(400).send({error: ErrorMessage.db()}); return }

        mysql.query(
            'select * from `user` where email = ?', [QueryData.email]
        ).then(value => {
            user = value[0];
            
            res.status(200).send({user: user});
        }).catch(error => {
            console.error(error);
            res.status(400).send({error: ErrorMessage.db()});
        });

    }


    public static routes(): Router{
        this.router.post('/authentification', this.authentificateUser);
        
        return this.router;
    }
}