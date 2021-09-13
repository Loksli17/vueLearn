import { Router, Request, Response, NextFunction } from "express";
import ErrorMessage                  from "../libs/error";
import Query                         from "../libs/query";
import pool                          from '../config/database';
import { Pool }                      from "mysql2/promise";
import crypto                        from 'crypto-js';
import jwt                           from 'jsonwebtoken';
import config                        from "../config";


export default class AuthController{

    private static router: Router = Router();


    public static checkAccessToken(req: Request, res: Response, next: NextFunction){

        const
            authUrls: Array<string>      = ['/auth/login', '/auth/get-token'], 
            token   : string | undefined = req.headers.authorization;

        if(authUrls.includes(req.originalUrl)){next(); return}

        if(!token) { res.status(401).send({msg: ErrorMessage.notFound('token')}); return; }

        try{
            let kek = jwt.verify(token, config.secret.jwt);
            console.log(kek);
            next();
        }catch(error){
            console.log('token error', error);
            res.status(401).send({msg: error});
            return;
        }
    }


    private static createTokens(req: Request, res: Response){
        
    }


    private static loginUser(req: Request, res: Response){

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
            accessToken  = jwt.sign({id: user.id}, config.secret.jwt, {expiresIn: '1m'});

            res.cookie('refreshToken', refreshToken);
            res.status(200).send({accessToken: accessToken, user: user});

            return mysql!.query('update `user` set refreshToken = ?', [refreshToken]);
        }).catch(error => {
            console.error(error);
            res.status(400).send({error: ErrorMessage.db()});
        });
    }


    public static routes(): Router{
        this.router.post('/login', this.loginUser);
        this.router.post('/create-tokens', this.createTokens);
        
        return this.router;
    }
}