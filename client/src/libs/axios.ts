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
}


async function query(axiosData: AxiosData, type: string){

    let promise: AxiosPromise;

    switch(type){
        case 'get':
            promise = axios.get(axiosData.url, axiosData.data);
            break;
        case 'post':
            promise = axios.post(axiosData.url, axiosData.data);
            break;
        case 'put':
            promise = axios.put(axiosData.url, axiosData.data);
            break;
        case 'delete':
            promise = axios.delete(axiosData.url, axiosData.data);
            break;
    }

    const response: AxiosResponse | void = await promise!
    .catch(err => {
        axiosData.flashMessage.show(flashMessageData.errorMessage('Error', 'Error with server. Please try to reload page. (You can press F5)'));
        
        if(axiosData.error == undefined) {
            console.error(err); 
            return;
        }
        axiosData.error(err);
    });

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
        query(axiosData, 'post');
    },

    get: async (axiosData: AxiosData) => {
        query(axiosData, 'get');
    },

    delete: async (axiosData: AxiosData) => {
        query(axiosData, 'delete');
    },

    put: async (axiosData: AxiosData) => {
        query(axiosData, 'put');
    },
};