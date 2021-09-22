
import axios, { AxiosResponse } from 'axios';
import Filters                  from '@/libs/filters';
import { LoadingFile }          from '@/components/FileUpload/types';



class DecoratorFactory { 

    public static createDecoratorAfter(handler: (data: any) => any){

        return (target: Record<string, any>, propertyKey: string, descriptor: PropertyDescriptor) => {

            const method = descriptor.value;

            descriptor.value = async function(...args: any[]){
                const data = await method.apply(this, args);
                return handler(data);
            }

            return descriptor;
        }
    }


    public static createDecoratorBefore(handler: () => void){

        return (target: Record<string, any>, propertyKey: string, descriptor: PropertyDescriptor) => {

            const method = descriptor.value;

            descriptor.value = async function(...args: any[]){
                handler();
                const data = await method.apply(this, args);
                return data;
            }

            return descriptor;
        }
    }
}



const decorators = {

    normalArticles: () => {
        return DecoratorFactory.createDecoratorAfter((articles: Array<Record<string, any>>): Array<Record<string, any>> => {
            return articles.map((item: Record<string, any>) => {
                item.isReady = item.isReady ? 'Ready' : 'Not Ready';
                item.time    = Filters.timeToView('0000-01-01 ' + item.time as string);
                item.date    = Filters.dateToView(item.date as string);
                return item;
            });
        });
    },

    normalArticle: (param: string) => {
        return DecoratorFactory.createDecoratorAfter((article: Record<string, any>) => {
            article.date = param == "db" ? Filters.dateToDb(article.date as Date) : Filters.dateToView(article.date as Date);
                return article;
        })
    },

}



export default class ArticleService {


    @decorators.normalArticles()
    public static async getAll(data: Record<string, any>): Promise<Array<Record<string, unknown>> | null>{

        const response: AxiosResponse | void = await axios.post('/crud', data)
        .catch((reason) => {
            console.error(reason);
        });

        if(response == undefined) {console.error('Bad response'); return null;}

        return response.data.articles;
    }


    public static async getAmount(): Promise<number | null>{
        
        const response: AxiosResponse | void = await axios.post('/crud/amount')
        .catch((reason) => {
            console.error(reason);
        });

        if(response == undefined) { console.error('Bad response'); return null; }

        return response.data.amount;
    }


    private static async getOne(data: Record<string, any>): Promise<Record<string, any> | null>{

        const response: AxiosResponse | void = await axios.get(`/crud/${data.id}`, data)
        .catch((reason) => {
            console.error(reason);
        })

        if(response == undefined) { console.error('Bad response'); return null; }

        return response.data.article;
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
            console.error(reason);
        });

        if(response == undefined) { console.error('Bad response'); return null; }

        return;
    }

    
    public static async editOne(data: Record<string, any>): Promise<void | null>{

        const response: AxiosResponse | void = await axios.put(`/crud/${data.id}/edit`, data)
        .catch((reason) => {
            console.error(reason);
        });

        if(response == undefined) { console.error('Bad response'); return null; }

        return;
    }


    public static async addOne(data: Record<string, any>): Promise<void | null>{

        const response: AxiosResponse | void = await axios.put(`/crud/add`, data)
        .catch((reason) => {
            console.error(reason);
        });

        if(response == undefined) { console.error('Bad response'); return null; }

        return;
    }


    public static async fileUpload(data: FormData, loadingFile: LoadingFile): Promise<void | null>{
        
        const response: AxiosResponse | void = await axios.post(`/crud/article-image`, data, {
            onUploadProgress: (e) => {
                loadingFile.progress = Math.floor(e.loaded * 100 / e.total);
            }
        }).catch((reason) => {
            console.error(reason);
        });

        if(response == undefined) { console.error('Bad response'); return null; }

        return;
    }
}