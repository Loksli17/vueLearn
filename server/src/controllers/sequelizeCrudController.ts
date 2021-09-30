import e, { Router, Request, Response } from "express";
import ErrorMessage                  from "../libs/error";
import Query                         from "../libs/query";
import User                          from "../models/User";


//! ADD TRY CATCH STUPID ESSOL
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

        try {
            users = await User.findAll({limit: Number(QueryData.take), offset: Number(QueryData.skip)});
        } catch (error) {
            res.status(400).send({error: ErrorMessage.db()});
            console.error(error);
            return;
        }

        res.status(200).send({users: users});
    }


    public static async getAmountUsers(req: Request, res: Response){

        let amount: number = 0;
        
        try {
            amount = await User.count();
        } catch (error) {
            res.status(400).send({error: ErrorMessage.db()});
            console.error(error);
            return;
        }
        
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

        try {
            user = await User.findOne({where: {id: id}});
        } catch (error) {
            console.error(error);
            res.status(400).send({error: ErrorMessage.dataNotSended('id')});
            return;
        }
        
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

        try {
            userId = await User.destroy({where: {id: id}});
        } catch (error) {
            res.status(400).send({error: ErrorMessage.db()});
            console.error(error);
            return;
        }
        

        res.status(200).send({id: userId});
    }


    public static async editUser(req: Request, res: Response){

        interface QueryData{
            user: {
                email: string,
                login: string,
            }
        }

        let 
            id        : number                 = Number(req.params.id),
            QueryData : QueryData              = req.body as any,
            dataErrors: Array<keyof QueryData> = [],
            user      : User | null;

        dataErrors = Query.checkData(QueryData, ['user']);

        if(dataErrors.length){
            res.status(400).send({error: ErrorMessage.dataNotSended(dataErrors[0])});
            return;
        }

        if(id == undefined) {
            res.status(400).send({error: ErrorMessage.dataNotSended('id')});
            return;
        }

        try {
            user = await User.findOne({where: {id: id}});
        } catch (error) {
            console.error(error);
            res.status(400).send({error: ErrorMessage.dataNotSended('id')});
            return;
        }

        if(user == undefined){
            res.status(400).send({error: ErrorMessage.notFound(`user with id: ${id}`)});
            return;
        }

        user.set('login', QueryData.user.login);
        user.set('email', QueryData.user.email);

        try {
            await user.save();
        } catch (error) {
            console.error(error);
            res.status(400).send({error: ErrorMessage.db()});
            return;
        }

        res.status(200).send({msg: `User with id: ${id} successfully changed`});
        
    }


    public static routes(){

        this.router.post(  '/',           this.getUsers);
        this.router.post(  '/amount',     this.getAmountUsers);
        this.router.post(  '/:id',        this.getUser);
        this.router.delete('/:id/remove', this.removeUser);
        this.router.put(   '/:id/edit',   this.editUser);

        return this.router;
    }

}