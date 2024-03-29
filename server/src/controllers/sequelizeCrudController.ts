import e, { Router, Request, Response } from "express";
import ErrorMessage                     from "../libs/error";
import Query                            from "../libs/query";
import User                             from "../models/User";
import crypto                           from "crypto-js";
import {  ValidationErrorItem }         from 'sequelize/types';
import Animal                           from "../models/Animal";
import Role                             from "../models/Role";
import { FileArray, UploadedFile }      from "express-fileupload";
import Parser                           from "../libs/parser";
import Error                            from "../libs/error";
import { promises as fs }               from 'fs';


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
            users = await User.findAll({
                limit  : Number(QueryData.take), 
                offset : Number(QueryData.skip),
                include: [{model: Animal}],
                order  : [['id', 'DESC']]
            });
        } catch (error) {
            res.status(400).send({error: ErrorMessage.db()});
            console.error(error);
            return;
        }

        res.status(200).send({users: users});
    }


    public static async getAmountUsers(req: Request, res: Response) {

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
            id    : number = Number(req.params.id),
            buffer: Buffer,
            user  : User | null;

        if(id == undefined) {
            res.status(400).send({error: ErrorMessage.dataNotSended('id')});
            return;
        }

        try {
            user = await User.findOne({where: {id: id}, include: [{model: Animal}, {model: Role}]});
        } catch (error) {
            console.error(error);
            res.status(400).send({error: ErrorMessage.dataNotSended('id')});
            return;
        }
        
        if(user == null){
            res.status(404).send({error: ErrorMessage.dataNotSended('user')});
            return;
        }

        try {
            buffer = await fs.readFile(`public/seq/avatars/${user.getDataValue('avatar')}`);
        } catch (error) {
            console.error(error);
            res.status(400).send({error: 'Error with reading file'});
            return;
        }

        res.status(200).send({user: user, buffer: buffer});
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
                email   : string;
                login   : string;
                avatar  : string;
                animalId: number;
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

        //! think about another variant
        user.set('login', QueryData.user.login);
        user.set('email', QueryData.user.email);
        user.set('avatar', QueryData.user.avatar);
        user.set('animalId', Number(QueryData.user.animalId));

        try {
            await user.validate();
            await user.save();
        } catch (validationErr: any) {
            const errors: Record<string, string> = {};
            validationErr.errors.forEach((item: ValidationErrorItem) => { if(item.path) errors[item.path] = item.message });
            res.status(422).send({error: ErrorMessage.db(), validationErrors: errors});
            return;
        }

        res.status(200).send({msg: `User with id: ${id} successfully changed`});
        
    }


    public static async createUser(req: Request, res: Response) {

        interface QueryData{
            user: {
                email   : string;
                login   : string;
                password: string;
                avatar  : string;
                animalId: number;
            }
        }

        let
            user      : User                   = new User(),
            dataErrors: Array<keyof QueryData> = [],
            QueryData : QueryData              = req.body;

        dataErrors = Query.checkData(QueryData, ['user']);

        if(dataErrors.length){
            res.status(400).send(ErrorMessage.dataNotSended(dataErrors[0]));
            return;
        }

        user = User.build({
            refreshToken: '', 
            login       : QueryData.user.login,
            email       : QueryData.user.email,
            avatar      : QueryData.user.avatar,
            password    : QueryData.user.password,
            animalId    : Number(QueryData.user.animalId),
        });
        
        try {
            await user.validate();
            user.set('password', crypto.SHA512(QueryData.user.password).toString());
            await user.save();
        } catch (validationErr: any) {
            const errors: Record<string, string> = {};
            validationErr.errors.forEach((item: ValidationErrorItem) => { if(item.path) errors[item.path] = item.message });
            res.status(422).send({error: ErrorMessage.db(), validationErrors: errors});
        }
        
        res.status(200).send({msg: `User was created successfully. Id of User = ${user.id}`});
    }


    public static async uploadAvatar(req: Request, res: Response) {

        let
            filename  : string                 = "",
            files     : FileArray | undefined  = req.files,
            file      : UploadedFile;

        if(files == undefined){
            res.status(400).send(ErrorMessage.file());
            return;
        }

        file = files.image as UploadedFile;
        filename = Parser.createFileName(file.name);

        try {
            await file.mv(`public/seq/avatars/${filename}`);
            res.status(200).send({msg: 'Success', filename: filename});
        } catch (error) {
            res.status(400).send({error: Error.file()});
        }
    }


    public static async getAllAnimals(req: Request, res: Response) {

        let animals: Array<Animal> = [];

        try {
            animals = await Animal.findAll();
        } catch (error) {
            res.status(400).send({error: Error.db()});
        }
        
        res.status(200).send({animals: animals})
    }


    public static async getAnimalsPage(req: Request, res: Response){

        interface QueryData {
            take: number;
            skip: number;
        }

        let
            animals   : Array<Animal>          = [],
            QueryData : QueryData              = req.body as any,
            dataErrors: Array<keyof QueryData> = [];

        dataErrors = Query.checkData(QueryData, ['skip', 'take']);

        if(dataErrors.length){
            res.status(400).send({error: ErrorMessage.dataNotSended(dataErrors[0])});
            return;
        }

        try {
            animals = await Animal.findAll({ 
                limit: Number(QueryData.take), offset: Number(QueryData.skip),
                order: [['id', 'desc']],
            });
        } catch (error) {
            res.status(400).send({error: ErrorMessage.db()});
            console.error(error);
            return;
        }

        res.status(200).send({animals: animals});
    }


    public static async getAnimalsAmount(req: Request, res: Response){

        let amount: number = 0;
        
        try {
            amount = await Animal.count();
        } catch (error) {
            res.status(400).send({error: ErrorMessage.db()});
            console.error(error);
            return;
        }
        
        res.status(200).send({amount: amount});
    } 


    public static async removeAnimal(req: Request, res: Response){

        let 
            id      : number = Number(req.params.id),
            animalId: number;

        if(id == undefined) {
            res.status(400).send({error: ErrorMessage.dataNotSended('id')});
            return;
        }

        try {
            animalId = await Animal.destroy({where: {id: id}});
        } catch (error) {
            res.status(400).send({error: ErrorMessage.db()});
            console.error(error);
            return;
        }
        
        res.status(200).send({id: animalId});
    }


    public static async createAnimal(req: Request, res: Response){

        interface QueryData {
            animal: {
                name: string;
                type: string;
            }
        }

        let
            animal    : Animal                 = new Animal(),
            dataErrors: Array<keyof QueryData> = [],
            QueryData : QueryData              = req.body as any;

        dataErrors = Query.checkData(QueryData, ['animal']);

        if(dataErrors.length) {
            res.status(400).send({msg: ErrorMessage.dataNotSended(dataErrors[0])});
            return;
        }

        animal = Animal.build(QueryData.animal);

        console.log(animal);

        try {
            await animal.validate();
            await animal.save();
        } catch (validationErr: any) {
            const errors: Record<string, string> = {};
            validationErr.errors.forEach((item: ValidationErrorItem) => { if(item.path) errors[item.path] = item.message });
            res.status(422).send({error: ErrorMessage.db(), validationErrors: errors});
        }

        res.status(200).send({msg: `Animal was created successfully. Id of Animal = ${animal.id}`});

    }


    public static routes(){

        this.router.post(  '/',                  this.getUsers);
        this.router.post(  '/amount',            this.getAmountUsers);
        this.router.post(  '/animals',           this.getAllAnimals);
        this.router.post(  '/avatar',            this.uploadAvatar);
        this.router.post(  '/page-animals',      this.getAnimalsPage);
        this.router.post(  '/amount-animals',    this.getAnimalsAmount);
        this.router.put(   '/create-animal',     this.createAnimal);
        this.router.put(   '/add',               this.createUser);
        this.router.delete('/remove-animal/:id', this.removeAnimal);
        this.router.put(   '/:id/edit',          this.editUser);
        this.router.post(  '/:id',               this.getUser);
        this.router.delete('/:id/remove',        this.removeUser);        

        return this.router;
    }

}