import axios, { AxiosError, AxiosResponse } from 'axios';
import Filters                              from '@/libs/filters';
import { LoadingFile }                      from '@/components/FileUpload/types';
import Service                              from '@/libs/Service';


export default class BooksService extends Service {
    
    public static async getAll(data: Record<string, any>): Promise<Array<Record<string, any>> | null>{

        const response: AxiosResponse | void = await axios.post('/books', data)
        .catch((reason: AxiosError) => {
            if(reason.response == undefined) return;
            this.errorMessage(reason.response.status);
            console.error(reason);
        });

        if(response == undefined) { console.error('Bad response'); return null; }

        this.checkResponse(response, [200]);

        return response.data.books;
    }
}