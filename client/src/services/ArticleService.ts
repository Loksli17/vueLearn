import axios, { AxiosResponse } from 'axios';
import Filters                  from '@/libs/filters';
import { LoadingFile }          from '@/components/FileUpload/types';
import Service                  from '@/libs/Service';
import filters from '@/libs/filters';


const decorators = {

    normalArticles: () => {
        return Service.createDecoratorAfter((articles: Array<Record<string, any>>): Array<Record<string, any>> => {
            return articles.map((item: Record<string, any>) => {
                item.isReady = item.isReady ? 'Ready' : 'Not Ready';
                item.time    = Filters.timeToView('0000-01-01 ' + item.time as string);
                item.date    = Filters.dateToView(item.date as string);
                return item;
            });
        });
    },

    normalArticle: (param: string) => {
        return Service.createDecoratorAfter((data: Record<string, any>) => {
            data.article.date = param == "db" ? Filters.dateToDb(data.article.date as Date) : Filters.dateToView(data.article.date as Date);
            return data;
        })
    },
}


export default class ArticleService extends Service {


    @decorators.normalArticles()
    public static async getAll(data: Record<string, any>): Promise<Array<Record<string, unknown>> | null>{

        const response: AxiosResponse | void = await axios.post('/crud', data)
        .catch((reason) => {
            this.errorMessage(reason.response.status);
            console.error(reason);
        });

        if(response == undefined) { console.error('Bad response'); return null; }

        this.checkResponse(response, [200]);

        return response.data.articles;
    }


    public static async getAmount(): Promise<number | null>{
        
        const response: AxiosResponse | void = await axios.post('/crud/amount')
        .catch((reason) => {
            this.errorMessage(reason.response.status);
            console.error(reason);
        });

        if(response == undefined) { console.error('Bad response'); return null; }

        this.checkResponse(response, [200]);

        return response.data.amount;
    }


    private static async getOne(data: Record<string, any>): Promise<Record<string, any> | null>{

        const response: AxiosResponse | void = await axios.get(`/crud/${data.id}`, data)
        .catch((reason) => {
            this.errorMessage(reason.response.status);
            console.error(reason);
        })

        if(response == undefined) { console.error('Bad response'); return null; }

        this.checkResponse(response, [200]);

        return response.data;
    }
    
    @decorators.normalArticle("view")
    public static async getOneView(data: Record<string, any>): Promise<Record<string, any> | null>{
        return await ArticleService.getOne(data);
    }

    @decorators.normalArticle("db")
    public static async getOneDb(data: Record<string, any>): Promise<Record<string, any> | null>{
        return await ArticleService.getOne(data);
    }

    
    public static async removeOne(data: Record<string, any>): Promise<void | null>{

        const response: AxiosResponse | void = await axios.delete(`/crud/${data.id}/remove`, data)
        .catch((reason) => {
            this.errorMessage(reason.response.status);
            console.error(reason);
        });

        if(response == undefined) { console.error('Bad response'); return null; }

        this.checkResponse(response, [200]);

        return;
    }

    
    public static async editOne(data: Record<string, any>): Promise<void | null>{

        const response: AxiosResponse | void = await axios.put(`/crud/${data.id}/edit`, data)
        .catch((reason) => {
            this.errorMessage(reason.response.status);
            console.error(reason);
        });

        if(response == undefined) { console.error('Bad response'); return null; }

        this.checkResponse(response, [200]);

        return;
    }


    public static async addOne(data: Record<string, any>): Promise<void | null>{

        const response: AxiosResponse | void = await axios.put(`/crud/add`, data)
        .catch((reason) => {
            this.errorMessage(reason.response.status);
            console.error(reason);
        });

        if(response == undefined) { console.error('Bad response'); return null; }

        this.checkResponse(response, [200]);

        return;
    }


    public static async fileUpload(data: FormData, loadingFile: LoadingFile): Promise<void | null> {
        
        const response: AxiosResponse | void = await axios.post(`/crud/article-image`, data, {
            onUploadProgress: (e) => {
                loadingFile.progress = Math.floor(e.loaded * 100 / e.total);
            }
        }).catch((reason) => {
            this.errorMessage(reason.response.status);
            console.error(reason);
        });

        if(response == undefined) { console.error('Bad response'); return null; }

        this.checkResponse(response, [200]);

        return;
    }


    public static async filesUpload(data: FormData, progressHandler: (e: any) => void): Promise<void | null> {
        
        const response: AxiosResponse | void = await axios.post(`/crud/article-image`, data, {
            onUploadProgress: progressHandler, 
        }).catch((reason) => {
            this.errorMessage(reason.response.status);
            console.error(reason);
        });

        if(response == undefined) { console.error('Bad response'); return null; }

        this.checkResponse(response, [200]);

        return;
    }
}