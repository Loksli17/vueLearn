import {Router as ExpressRouter} from 'express';

import crudController         from '../controllers/crudController';


export default class Router{
    private static router: ExpressRouter = ExpressRouter();

    public static get routes(){
        this.router.use('/crud', crudController.routes());

        return this.router;
    }

}
   