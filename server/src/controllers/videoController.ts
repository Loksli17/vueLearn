import { Request, Response, Router } from "express";
import Video                         from "../models/Video";
import ErrorMessage                  from "../libs/error";
import { FileArray, UploadedFile }   from "express-fileupload";
import Parser                        from "../libs/parser";
import Error                         from "../libs/error";


export default class VideoController {

    private static router: Router = Router();


    public static async getVideos(req: Request, res: Response){

        let videos: Array<Video> = [];

        try {
            videos = await Video.findAll({order: [['id', 'desc']]});
        } catch (error) {
            res.status(400).send({msg: ErrorMessage.db()});
            console.error(error);
        }

        res.status(200).send({videos: videos});
    }


    public static async upload(req: Request, res: Response) {

        let
            video     : Video,
            filename  : string                 = "",
            files     : FileArray | undefined  = req.files,
            file      : UploadedFile;

        if(files == undefined){
            res.status(400).send(ErrorMessage.file());
            return;
        }

        file     = files.image as UploadedFile;
        filename = Parser.createFileName(file.name);

        try {
            video = Video.build({name: file.name, description: 'college boys ahahahha', file: filename});
            video.save();
            await file.mv(`public/videos/${filename}`);
            res.status(200).send({msg: 'Success', filename: filename});
        } catch (error) {
            res.status(400).send({error: Error.file()});
        }
    }


    public static async removeOne(req: Request, res: Response){

        let
            id: number = Number(req.params.id);

        if(id == undefined){
            res.status(400).send({error: ErrorMessage.dataNotSended('id')});
            return;
        }

        try {
            await Video.destroy({where: {id: id}});
        } catch (error) {
             res.status(400).send({error: ErrorMessage.db()});
            return;
        }

        res.status(200).send({msg: `Video with id = ${id} was removed successfully`});
    }

    
    public static routes(): Router{
        this.router.get   ( '/',          this.getVideos);
        this.router.post  ('/upload',     this.upload);
        this.router.delete('/:id/delete', this.removeOne);

        return this.router;
    }
} 