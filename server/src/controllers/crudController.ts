import { Router, Request, Response } from "express";
import ErrorMessage                  from "../libs/error";
import Query                         from "../libs/query";
import pool                          from '../config/database';
import { FileArray }                 from "express-fileupload";
import fs                            from 'fs/promises';
import { contains } from "sequelize/types/lib/operators";


export default class CrudController {

    private static router: Router = Router();

    private static getArticles(req: Request, res: Response){

        interface QueryData{
            skip: number,
            take: number,
        }

        let
            mysql = pool,
            QueryData : QueryData              = req.body,
            dataErrors: Array<keyof QueryData> = [];

        dataErrors = Query.checkData(QueryData, ['skip', 'take']);
        
        if(dataErrors.length){
            res.status(400).send({error: ErrorMessage.dataNotSended(dataErrors[0])});
            return;
        }

        if(mysql == undefined){
            res.status(400).send({error: ErrorMessage.db()});
            return;
        }

        mysql.query(
            'select `article`.id, `article`.views, `article`.`date`, `article`.`time`, `article`.isReady, `articleType`.`title` as `t_title`, `article`.title from `article` left join `articleType` on `articleType`.`id` = `article`.`articleTypeId` order by `article`.`id` desc limit ?, ? ', 
            [Number(QueryData.skip), Number(QueryData.take)]
        )
        .then((value: any) => {
            res.status(200).send({articles: value[0]});
        })
        .catch((error: any) => {
            console.error(error);
            res.status(400).send({error: ErrorMessage.db()});
        });

    }


    private static async getAmountArticles(req: Request, res: Response){

        let mysql = pool;

        if(mysql == undefined){
            res.status(400).send({error: ErrorMessage.db()});
            return;
        }
        
        mysql.query('select count(*) from `article`')
        .then((value: any) => {
            res.status(200).send({amount: (value[0] as any)[0]['count(*)']});
        })
        .catch((error: any) => {
            console.error(error);
            res.status(400).send({error: ErrorMessage.db()});
        });
    }


    private static getArticle(req: Request, res: Response){

        interface QueryData{
            id: number;
        }

        let
            mysql = pool,
            QueryData : QueryData              = req.params as any,
            article   : Record<string, any>    = {},
            dataErrors: Array<keyof QueryData> = [];

        dataErrors = Query.checkData(QueryData, ['id']);
        
        if(dataErrors.length){
            res.status(400).send({error: ErrorMessage.dataNotSended(dataErrors[0])});
            return;
        }

        if(mysql == undefined){
            res.status(400).send({error: ErrorMessage.db()});
            return;
        }

        mysql.query(
            'select `article`.id, `article`.views, `article`.`date`, `article`.`time`, `article`.isReady, `article`.`img`, `articleType`.`title` as `t_title`, `articleType`.`id` as `articleTypeId`, `article`.title, `article`.`text` from `article` left join `articleType` on `articleType`.`id` = `article`.`articleTypeId` where `article`.`id` = ?',
            [Number(QueryData.id)]
        )
        .then((value: any) => {
            article = value[0][0];
            return fs.readFile(`public/crud/articles/${value[0][0].img}`);
        })
        .then((result: any) => {
            res.status(200).send({article: article, file: result});
        })
        .catch((reason: any) => {
            console.error(reason);
            res.status(400).send({error: ErrorMessage.db()});
        });

    }


    private static removeArticle(req: Request, res: Response){

        interface QueryData{
            id: number;
        }

        let
            mysql = pool,
            QueryData : QueryData              = req.params as any,
            dataErrors: Array<keyof QueryData> = [];

        dataErrors = Query.checkData(QueryData, ['id']);
        
        if(dataErrors.length){
            res.status(400).send({error: ErrorMessage.dataNotSended(dataErrors[0])});
            return;
        }

        if(mysql == undefined){
            res.status(400).send({error: ErrorMessage.db()});
            return;
        }

        mysql.query('delete from `article` where id = ?', [Number(QueryData.id)])
        .then((value: any) => {
            res.status(200).send({msg: `Article with id: ${QueryData.id} was deleted successfully`});
        })
        .catch((error: any) => {
            console.error(error);
            res.status(400).send({error: ErrorMessage.db()})
        }); 
    }


    private static getTypes(req: Request, res: Response){
        
        let mysql = pool;

        if(mysql == undefined){
            res.status(400).send({error: ErrorMessage.db()});
            return;
        }

        mysql.query('select * from articleType')
        .then((value: any) => {
            res.status(200).send({types: value[0]});
        })
        .catch((error: any) => {
            console.error(error);
            res.status(400).send({error: ErrorMessage.db()});
        });
    }


    private static addArticle(req: Request, res: Response){
        
        interface QueryData{
            article: {
                title        : string;
                text         : string;
                isReady      : boolean;
                date         : Date;
                time         : string;
                articleTypeId: string;
                img          : string;
            };
        }

        let
            mysql = pool,
            QueryData : QueryData               = req.body as any,
            dataErrors: Array<keyof QueryData>  = [];

        dataErrors = Query.checkData(QueryData, ['article']);
        
        if(dataErrors.length){
            res.status(400).send({error: ErrorMessage.dataNotSended(dataErrors[0])});
            return;
        }

        if(mysql == undefined){
            res.status(400).send({error: ErrorMessage.db()});
            return;
        }

        
        mysql.query(
            'insert into `article` (`title`, `views`, `text`, `isReady`, `img`, `date`, `time`, `articleTypeId`)' + 
            'values (?, ?, ?, ?, ?, ?, ?, ?)',
            [
                QueryData.article.title, 0, QueryData.article.text, QueryData.article.isReady, 'default.jpg', QueryData.article.date,
                QueryData.article.time, QueryData.article.articleTypeId, 
            ]
        )
        .then((value: any) => {
            res.status(200).send({types: value[0]});
        })
        .catch((error: any) => {
            console.error(error);
            res.status(400).send({error: ErrorMessage.db()});
        });
        
    }


    private static editArticle(req: Request, res: Response){
   
        interface QueryData{
            article: {
                id           : number;
                title        : string;
                text         : string;
                isReady      : boolean;
                date         : Date;
                time         : string;
                articleTypeId: string;
                img          : string;
            };
        }

        let
            mysql = pool,
            QueryData : QueryData               = req.body as any,
            dataErrors: Array<keyof QueryData>  = [];

        dataErrors = Query.checkData(QueryData, ['article']);

        if(dataErrors.length){
            res.status(400).send({error: ErrorMessage.dataNotSended(dataErrors[0])});
            return;
        }

        if(mysql == undefined){
            res.status(400).send({error: ErrorMessage.db()});
            return;
        }

        mysql.query(
            'update `article` set title = ?,text = ?, isReady = ?, date = ?, time = ?, articleTypeId = ? where id = ?',
            [
                QueryData.article.title, QueryData.article.text, QueryData.article.isReady, QueryData.article.date,
                QueryData.article.time, QueryData.article.articleTypeId, QueryData.article.id,
            ]
        )
        .then((value: any) => {
            res.status(200).send({types: value[0]});
        })
        .catch((error: any) => {
            console.error(error);
            res.status(400).send({error: ErrorMessage.db()});
        });
    }


    private static imageUpload(req: Request, res: Response){

        let files: FileArray | undefined = req.files;

        console.log(files);

        res.status(200).send({msg: 'Success'});
    }


    public static routes(){
        //* order of routes affects working
        this.router.post(  '/',              this.getArticles);
        this.router.post(  '/amount',        this.getAmountArticles);
        this.router.get(   '/article-types', this.getTypes);
        this.router.get(   '/:id',           this.getArticle);
        this.router.delete('/:id/remove',    this.removeArticle);
        this.router.put(   '/add',           this.addArticle);
        this.router.put(   '/:id/edit',      this.editArticle);
        this.router.post(  '/article-image', this.imageUpload);
        

        return this.router;
    }

}