import Service                  from "@/libs/Service";
import axios, { AxiosResponse } from 'axios';
import { LoadingFile }          from "@/components/FileUpload/types";


const decorators = {

    normalVideos: () => {
        return Service.createDecoratorAfter((videos: Array<Record<string, any>>): Array<Record<string, any>> => {
            return videos.map((video: Record<string, any>) => {
                video.shortDescription = video.description.slice(0, 50);
                return video;
            })
        });
    }
}


export default class VideoService extends Service {

    @decorators.normalVideos()
    public static async getVideos() {

        const response: AxiosResponse | void = await axios.get('/video')
        .catch((reason) => {
            if(reason.response == undefined) return;
        });

        if(response == undefined) return;

        return response.data.videos;
    }


    public static async videoUpload(data: FormData, loadingFile: LoadingFile): Promise<string | null>{

        const response: AxiosResponse | void = await axios.post(`/video/upload`, data, {
            onUploadProgress: (e) => {
                loadingFile.progress = Math.floor(e.loaded * 100 / e.total);
            }
        }).catch((reason) => {
            this.errorMessage(reason.response.status);
            console.error(reason);
        });

        if(response == undefined) { console.error('Bad response'); return null; }

        this.checkResponse(response, [200]);

        return response.data.filename;
    }


    public static async removeVideo(id: number): Promise<AxiosResponse | null>{

        const response: AxiosResponse | void = await axios.delete(`/video/${id}/delete`, )
        .catch((reason) => {
            this.errorMessage(reason.response.status);
            console.error(reason);
        });

        if(response == undefined) { console.error('Bad response'); return null; }

        this.checkResponse(response, [200]);

        return response;
    } 
} 