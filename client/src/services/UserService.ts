import axios, { AxiosError, AxiosResponse } from 'axios';
import Filters                  from '@/libs/filters';
import { LoadingFile }          from '@/components/FileUpload/types';
import Service                  from '@/libs/Service';


const normalUser = (user: Record<string, any>): Record<string, any> => {
    user.animal = `id: ${user.Animal.id}; name: ${user.Animal.name}`;
    delete user.AnimalId; delete user.Animal; delete user.animalId;
    return user;
};

const decorators = {

    normalUser: () => {
        return Service.createDecoratorAfter(normalUser);
    },

    normalUsers: () => {
        return Service.createDecoratorAfter((users: Array<Record<string, any>>): Array<Record<string, any>> => {
            return users.map(normalUser);
        });
    }
}


export default class UserService extends Service{

    @decorators.normalUsers()
    public static async getAll(data: Record<string, any>): Promise<Array<Record<string, any>> | null>{

        const response: AxiosResponse | void = await axios.post('/seq', data)
        .catch((reason: AxiosError) => {
            if(reason.response == undefined) return;
            this.errorMessage(reason.response.status);
            console.error(reason);
        });

        if(response == undefined) { console.error('Bad response'); return null; }

        this.checkResponse(response, [200]);

        return response.data.users;
    }


    public static async getAmount(): Promise<number | null> {

        const response: AxiosResponse | void = await axios.post('/seq/amount')
        .catch((reason: AxiosError) => {
            if(reason.response == undefined) return;
            this.errorMessage(reason.response.status);
            console.error(reason);
        });

        if(response == undefined) { console.error('Bad response'); return null; }

        this.checkResponse(response, [200]);

        return response.data.amount;
    }

    @decorators.normalUser()
    public static async getOne(data: Record<string, any>): Promise<Record<string, any> | null> {
        
        const response: AxiosResponse | void = await axios.post(`/seq/${data.id}`)
        .catch((reason: AxiosError) => {
            if(reason.response == undefined) return;
            this.errorMessage(reason.response.status);
            console.error(reason);
        });

        if(response == undefined) { console.error('Bad response'); return null; }

        this.checkResponse(response, [200]);

        return response.data.user;
    }


    public static async removeOne(data: Record<string, any>): Promise<void | null> {

        const response: AxiosResponse | void = await axios.post(`/seq/${data.id}/remove`)
        .catch((reason: AxiosError) => {
            if(reason.response == undefined) return;
            this.errorMessage(reason.response.status);
            console.error(reason);
        });

        if(response == undefined) { console.error('Bad response'); return null; }

        this.checkResponse(response, [200]);

        return;
    }


    public static async editUser(data: Record<string, any>, id: number): Promise<AxiosResponse | null>{
        
        const response: AxiosResponse | void = await axios.put(`/seq/${id}/edit`, data)
        .catch((reason: AxiosError) => {
            if(reason.response == undefined) return;
            this.errorMessage(reason.response.status);
            console.error(reason);
        });

        if(response == undefined) { console.error('Bad response'); return null; }

        this.checkResponse(response, [200, 422]);

        return response;
    }


    public static async addUser(data: Record<string, any>): Promise<AxiosResponse | null> {
    
        const response: AxiosResponse | void = await axios.put(`/seq/add`, data)
        .catch((reason: AxiosError) => {
            if(reason.response == undefined) return;
            this.errorMessage(reason.response.status);
            console.log(reason.response.data);
        });

        if(response == undefined) { console.error('Bad response'); return null; }

        this.checkResponse(response, [200, 422]); //! name it checkStatusResponse !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

        return response;
    }
}