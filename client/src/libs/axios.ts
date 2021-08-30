import axios, { AxiosPromise, AxiosResponse } from "axios";
import config                                 from '../config/config';
import {FlashMessagePlugin}                   from '@smartweb/vue-flash-message';
import FlashMessageData                       from '../libs/flashMessage';


interface AxiosData{
    url: string,
    status: number,
    errorHandler?: (...args: any[]) => void,
    handler: (...args: any[]) => void,
    data?: Record<string, unknown>,
    flashMessage: FlashMessagePlugin,
    successMessage?: {title: string, text: string},
    log?: boolean,
}

export interface FacadeAxiosSettings{
    autoErrorFlashMessage?: boolean;
    autoSuccessFlashMessage?: boolean;
    defaultStatus?: number;
}


class FacadeAxios{

    private static instance: FacadeAxios;
    private static settings_: FacadeAxiosSettings; 
    private readonly actions: {[index: string]: any} = {
        'get'   : (url: string, data: any) => axios.get   (url, data),
        'post'  : (url: string, data: any) => axios.post  (url, data),
        'put'   : (url: string, data: any) => axios.put   (url, data),
        'delete': (url: string, data: any) => axios.delete(url, data),
    }
    
    /**
     * Method for axios query
     * @param axiosData 
     * @param type 
     * @returns Promise<void>
     */
    private async query(axiosData: AxiosData, type: 'get' | 'post' | 'put' | 'delete'): Promise<void> {

        const promise: AxiosPromise = this.actions[type](axiosData.url, axiosData.data);

        const response: AxiosResponse | void = await promise!.catch(
            err => {
                axiosData.flashMessage.show(FlashMessageData.errorMessage('Error', 'Error with server. Please try to reload page. (You can press F5)'));
                
                if(axiosData.errorHandler == undefined) {
                    console.error(err); 
                    return;
                }

                axiosData.errorHandler(err);
            }
        );

        if(axiosData.log) console.log(response);

        if(response == undefined) throw new Error('Bad response');

        if(response.status !== axiosData.status){
            const message: string = 'Bad status';
            
            if(axiosData.errorHandler == undefined) {
                axiosData.flashMessage.show(FlashMessageData.errorMessage('Error', message));
                console.error(message); 
                return;
            }

            axiosData.errorHandler(message);
        }

        if(axiosData.successMessage != undefined) axiosData.flashMessage.show(FlashMessageData.successMessage(axiosData.successMessage.title, axiosData.successMessage.text));

        axiosData.handler(response);
    }

    
    public async get(data: AxiosData): Promise<void> { 
        await this.query(data, 'get');
    }

    public async post(data: AxiosData): Promise<void> {
        await this.query(data, 'post');
    }

    public async delete(data: AxiosData): Promise<void> {
        await this.query(data, 'delete');
    }

    public async put(data: AxiosData): Promise<void> {
        await this.query(data, 'put');
    }


    public set settings(settings: FacadeAxiosSettings){
        FacadeAxios.settings_ = settings;
    }

    private constructor() {
        axios.defaults.baseURL = config.serverPath;
    }

    public static getInstance(): FacadeAxios {
        return FacadeAxios.instance || new FacadeAxios();
    }
}


export default FacadeAxios.getInstance();