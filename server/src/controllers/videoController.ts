import { Request, Response, Router } from "express";
import Video                         from "../models/Video";
import ErrorMessage                   from "../libs/error";

export default class VideoController {

    private static router: Router;


    public static async getVideos(req: Request, res: Response){

        let videos: Array<Video> = [];

        try {
            videos = await Video.findAll();
        } catch (error) {
            res.status(400).send({msg: ErrorMessage.db()});
            console.error(error);
        }

        res.status(200).send({videos: videos});
    }

    
    public static routes(): Router{
        this.router.get('/', this.getVideos);

        return this.router;
    }
} 