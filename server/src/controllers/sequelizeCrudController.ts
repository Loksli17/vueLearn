import { Router, Request, Response } from "express";
import ErrorMessage                  from "../libs/error";
import Query                         from "../libs/query";
import User                          from "../models/User";


export default class SequelizeCrudController{

    private static router: Router = Router();


    public static async getUsers(req: Request, res: Response){

        interface QueryData{
            skip: number,
            take: number,
        }

        let
            QueryData : QueryData              = req.body,
            users     : Array<User>            = [],
            dataErrors: Array<keyof QueryData> = [];

        dataErrors = Query.checkData(QueryData, ['skip', 'take']);
        
        if(dataErrors.length){
            res.status(400).send({error: ErrorMessage.dataNotSended(dataErrors[0])});
            return;
        }

        users = await User.findAll({limit: Number(QueryData.take), offset: Number(QueryData.skip)});

        res.status(200).send({users: users});
    }


    public static async getAmountUsers(req: Request, res: Response){

        res.status(200).send({amount: 10});
    }


    public static async getUser(req: Request, res: Response){

    }


    public static routes(){

        this.router.get('/',       this.getUsers);
        this.router.get('/amount', this.getAmountUsers);
        this.router.get('/:id',    this.getUser);

        return this.router;
    }

}