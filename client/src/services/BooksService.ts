import axios, { AxiosError, AxiosResponse } from 'axios';
import Filters                              from '@/libs/filters';
import { LoadingFile }                      from '@/components/FileUpload/types';
import Service                              from '@/libs/Service';

const decorators = {
    normalBooks: () => {
        return Service.createDecoratorAfter((books: Array<Record<string,any>>):Array<Record<string,any>> => {
            return books.map((book: Record<string,any>) => {
                book.isCompleted = book.isCompleted ? 'Completed' : 'Not completed';
                book.writingDate = Filters.dateToView(book.writingDate);  
                return book;
            });
        });
    },

   normalBook: () => {
       return Service.createDecoratorAfter((book: Record<string,any>):Record<string,any> => {
            book.isCompleted = book.isCompleted ? 'Completed' : 'Not completed';
            book.writingDate = Filters.dateToView(book.writingDate);  
            return book;
       });
   }
}

export default class BooksService extends Service {
    
    @decorators.normalBooks()
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


    public static async getAmount(): Promise<number | null> {
        const response: AxiosResponse | void = await axios.post('/books/amount')
        .catch((reason: AxiosError) => {
            if(reason.response == undefined) return;
            this.errorMessage(reason.response.status);
            console.error(reason);
        });

        if(response == undefined) { console.error('Bad response'); return null; }

        this.checkResponse(response, [200]);

        return response.data.amount;
    }

    @decorators.normalBook()
    public static async getOne(data: Record<string, any>): Promise<Record<string, any> | null> {
        
        const response: AxiosResponse | void = await axios.post(`/books/${data.id}`)
        .catch((reason: AxiosError) => {
            if(reason.response == undefined) return;
            this.errorMessage(reason.response.status);
            console.error(reason);
        });

        if(response == undefined) { console.error('Bad response'); return null; }

        this.checkResponse(response, [200]);

        return response.data.book;
    }

    
    public static async removeOne(data: Record<string, any>): Promise<void | null> {

        const response: AxiosResponse | void = await axios.post(`/books/${data.id}/remove`)
        .catch((reason: AxiosError) => {
            if(reason.response == undefined) return;
            this.errorMessage(reason.response.status);
            console.error(reason);
        });

        if(response == undefined) { console.error('Bad response'); return null; }

        this.checkResponse(response, [200]);

        return;
    }

}