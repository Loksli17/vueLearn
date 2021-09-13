import { Router, Request, Response } from "express";
import ErrorMessage                  from "../libs/error";
import Query                         from "../libs/query";
import pool                          from '../config/database';
import { Pool }                      from "mysql2/promise";
import crypto                        from 'crypto-js';
import jwt                           from 'jsonwebtoken';
import config                        from "../config";


export default class AuthController{

    private static router: Router = Router();


    private static authentificateUser(req: Request, res: Response){

        interface QueryData{
            email   : string;
            password: string
        }

        let
            mysql       : Pool | undefined       = pool(),
            dataErrors  : Array<keyof QueryData> = [],
            refreshToken: string                 = '',
            accessToken : string                 = '',
            QueryData   : QueryData              = req.body,
            user        : any                    = {};

        dataErrors = Query.checkData(QueryData, ['email', 'password']);

        if(dataErrors.length) { res.status(400).send({error: ErrorMessage.dataNotSended(dataErrors[0])}); return }

        if(!mysql) { res.status(400).send({error: ErrorMessage.db()}); return }

        mysql.query(
            'select * from `user` where email = ?', [QueryData.email]
        ).then((value: any) => {
            
            user = value[0][0];
            
            if(user == undefined) { res.status(401).send({errors: {email: 'Uncorrect email'}}); return } 
            if(user.password !== crypto.SHA512(QueryData.password).toString()) { res.status(401).send({errors: {password: 'Uncorrect password'}}); return; }
            
            refreshToken = jwt.sign({id: user.id}, config.secret.jwt, {expiresIn: '24h'}), {maxAge: 1000 * 60 * 60 * 25, httpOnly: true};
            accessToken  = jwt.sign({id: user.id}, config.secret.jwt, {expiresIn: '15m'});

            res.cookie('refreshToken', refreshToken);
            res.status(200).send({accessToken: accessToken, user: user});

            return mysql!.query('update `user` set refreshToken = ?', [refreshToken]);
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