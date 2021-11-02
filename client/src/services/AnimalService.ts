import Service                 from "@/libs/Service";
import axios, { AxiosResponse } from 'axios';


export default class AnimalService extends Service {

    public static async getAnimals(data: {take: number, skip: number}): Promise<Array<Record<string, unknown>> | null>{

        const response: AxiosResponse | void = await axios.post('/seq/page-animals', data)
        .catch((reason) => {
            if(reason.response == undefined) return;
            this.errorMessage(reason.response.status);
            console.error(reason);
        });

        if(response == undefined) { console.error('Bad response'); return null; }

        this.checkResponse(response, [200]);
        return response.data.animals;
    }


    public static async amount(){

        const response: AxiosResponse | void = await axios.post('/seq/amount-animals')
        .catch((reason) => {
            if(reason.response == undefined) return;
            this.errorMessage(reason.response.status);
            console.error(reason);
        });

        if(response == undefined) { console.error('Bad response'); return null; }

        this.checkResponse(response, [200]);
        return response.data.amount;
    }


    public static async removeOne(id: number){
        
        const response: AxiosResponse | void = await axios.delete(`/seq/remove-animal/${id}`)
        .catch((reason) => {
            if(reason.response == undefined) return;
            this.errorMessage(reason.response.status);
            console.error(reason);
        });

        if(response == undefined) { console.error('Bad response'); return null; }

        this.checkResponse(response, [200]);
        return response.data;
    }


    public static async addAnimal(data: {animal: Record<string, any>}): Promise<AxiosResponse | null>{

        const response: AxiosResponse | void = await axios.put('/seq/create-animal', data)
        .catch((reason) => {
            if(reason.response == undefined) return;
            this.errorMessage(reason.response.status);
            console.error(reason);
        });

        if(response == undefined) { console.error('Bad response'); return null; }

        this.checkResponse(response, [200, 422]);
        return response;
    }
}