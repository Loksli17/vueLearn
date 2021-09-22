import axios, { AxiosResponse } from "axios";


export default class ArticleTypeService {

    public static async getAll(): Promise<Array<Record<string, any>> | null>{

        const response: AxiosResponse | void = await axios.get('/crud/article-types')
        .catch((reason) => {
            console.error(reason);
        });

        if(response == undefined) {console.error('Bad response'); return null;}

        return response.data.types;
    }
}