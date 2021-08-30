import axios, { AxiosPromise, AxiosResponse } from "axios";
import config                                 from '../config/config';
import {FlashMessagePlugin}                   from '@smartweb/vue-flash-message';
import flashMessageData                       from '../libs/flashMessage';


axios.defaults.baseURL = config.serverPath;


interface AxiosData{
    url: string,
    status: number,
    error?: (...args: any[]) => void,
    handler: (...args: any[]) => void,
    data?: Record<string, unknown>,
    flashMessage: FlashMessagePlugin,
    successMessage?: {title: string, text: string},
    log?: boolean,
}



async function query(axiosData: AxiosData, type: 'get' | 'post' | 'put' | 'delete'){

    const 
        actions: {[index: string]: any} = {
            'get'   : (url: string, data: any) => axios.get(url, data),
            'post'  : (url: string, data: any) => axios.post(url, data),
            'put'   : (url: string, data: any) => axios.put(url, data),
            'delete': (url: string, data: any) => axios.delete(url, data),
        },
        promise: AxiosPromise = actions[type](axiosData.url, axiosData.data);

        
    const response: AxiosResponse | void = await promise!.catch(
        err => {
            axiosData.flashMessage.show(flashMessageData.errorMessage('Error', 'Error with server. Please try to reload page. (You can press F5)'));
            
            if(axiosData.error == undefined) {
                console.error(err); 
                return;
            }

            axiosData.error(err);
        }
    );

    if(axiosData.log) console.log(response);

    if(response == undefined) throw new Error('Bad response');

    if(response.status !== axiosData.status){
        const message: string = 'Bad status';
        axiosData.flashMessage.show(flashMessageData.errorMessage('Error', message));
        
        if(axiosData.error == undefined) {
            console.error(message); 
            return;
        }
        axiosData.error(message);
    }

    if(axiosData.successMessage != undefined) axiosData.flashMessage.show(flashMessageData.successMessage(axiosData.successMessage.title, axiosData.successMessage.text));

    axiosData.handler(response);
}


export default {

    post: async (axiosData: AxiosData) => {
        await query(axiosData, 'post');
    },

    get: async (axiosData: AxiosData) => {
        await query(axiosData, 'get');
    },

    delete: async (axiosData: AxiosData) => {
        await query(axiosData, 'delete');
    },

    put: async (axiosData: AxiosData) => {
        await query(axiosData, 'put');
    },
};