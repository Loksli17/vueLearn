
import axios, { AxiosResponse } from 'axios';
import Filters                  from '@/libs/filters';


const decorators = {

    normalArticles: () => {
        return (target: Record<string, any>, propertyKey: string, descriptor: PropertyDescriptor) => {

            const method = descriptor.value;

            descriptor.value = async function(...args: any[]){
                let articles = await method.apply(this, args);
                
                return articles = articles.map((item: Record<string, any>) => {
                    item.isReady = item.isReady ? 'Ready' : 'Not Ready';
                    item.time    = Filters.timeToView('0000-01-01 ' + item.time as string);
                    item.date    = Filters.dateToView(item.date as string);
                    return item;
                });
            }

            return descriptor;
        }
    },

    normalArticle: () => {
        return (target: Record<string, any>, propertyKey: string, descriptor: PropertyDescriptor) => {

            const method = descriptor.value;

            descriptor.value = async function(...args: any[]){
                const article = await method.apply(this, args);
                article.date = Filters.dateToView(article.date as Date);
                return article;
            }

            return descriptor;
        }
    }
}


export default class ArticleService{


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

    
    @decorators.normalArticle()
    public static async getOne(data: Record<string, any>): Promise<Record<string, any> | null>{

        const response: AxiosResponse | void = await axios.get(`/crud/${data.id}`, data)
        .catch((reason) => {
            console.error(reason);
        })

        if(response == undefined) { console.error('Bad response'); return null; }

        return response.data.article;
    }

    
    public static async removeOne(data: Record<string, any>): Promise<void | null>{

        const response: AxiosResponse | void = await axios.delete(`/crud/${data.id}/remove`, data)
        .catch((reason) => {
            console.error(reason);
        });

        if(response == undefined) { console.error('Bad response'); return null; }

        return;
    }
}