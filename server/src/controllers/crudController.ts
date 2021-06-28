import { Router, Request, Response } from "express";



export default class CrudController{

    private static router: Router = Router();

    private static getArticles(req: Request, res: Response){
        res.status(200).send({articles: []});
    }


    public static routes(){
        this.router.post('/', this.getArticles);

        return this.router;
    }

}