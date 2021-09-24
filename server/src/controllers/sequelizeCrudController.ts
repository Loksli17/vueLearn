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
            QueryData : QueryData              = req.body as any,
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
        let amount: number = await User.count();
        res.status(200).send({amount: amount});
    }


    public static async getUser(req: Request, res: Response){

        let 
            id  : number = Number(req.params.id),
            user: User | null;

        if(id == undefined) {
            res.status(400).send({error: ErrorMessage.dataNotSended('id')});
            return;
        }

        user = await User.findOne({where: {id: id}});

        if(user == null){
            res.status(404).send({error: ErrorMessage.dataNotSended('user')});
            return;
        }

        res.status(200).send({user: user});
    }


    public static async removeUser(req: Request, res: Response){

        let 
            id    : number = Number(req.params.id),
            userId: number;

        if(id == undefined) {
            res.status(400).send({error: ErrorMessage.dataNotSended('id')});
            return;
        }

        userId = await User.destroy({where: {id: id}});

        res.status(200).send({id: userId});
    }


    public static routes(){

        this.router.post(  '/',           this.getUsers);
        this.router.post(  '/amount',     this.getAmountUsers);
        this.router.post(  '/:id',        this.getUser);
        this.router.delete('/:id/remove', this.removeUser);

        return this.router;
    }

}