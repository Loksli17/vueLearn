import {Router as ExpressRouter} from 'express';

import CrudController          from '../controllers/crudController';
import AuthController          from '../controllers/authController';
import SequelizeCrudController from '../controllers/sequelizeCrudController';
import BooksController         from '../controllers/booksController';
import VideoController         from '../controllers/videoController';


export default class Router{
    
    private static router: ExpressRouter = ExpressRouter();

    public static get routes(){
        this.router.use(AuthController.checkAccessToken);
        
        this.router.use('/crud',  CrudController.routes());
        this.router.use('/auth',  AuthController.routes());
        this.router.use('/seq',   SequelizeCrudController.routes());
        this.router.use('/books', BooksController.routes());
        this.router.use('/video', VideoController.routes());

        return this.router;
    }

}
   