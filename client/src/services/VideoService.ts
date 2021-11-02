import Service                  from "@/libs/Service";
import axios, { AxiosResponse } from 'axios'


export default class VideoService extends Service {

    public static async getVideos() {

        const response: AxiosResponse | void = await axios.get('/video')
        .catch((reason) => {
            if(reason.response == undefined) return;
        });

        if(response == undefined) return;

        return response.data.videos;
    }
} 