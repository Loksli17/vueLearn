import axios, { AxiosPromise, AxiosRequestConfig, AxiosResponse } from "axios";
import config                                 from '../config/config';
import {FlashMessagePlugin}                   from '@smartweb/vue-flash-message';
import FlashMessageData                       from '../libs/flashMessage';


interface AxiosData{
    url: string;
    status?: number;
    errorHandler?: (...args: any[]) => void;
    handler: (...args: any[]) => void;
    data?: Record<string, unknown> | FormData;
    successFlashMessage?:  boolean | {title: string, text: string};
    errorStatusFlashMessage?: boolean | {title: string, text: string};
    errorServerFlashMessage?: boolean | {title: string, text: string};
    logResponce?: boolean;
    config?: AxiosRequestConfig;
}

export interface AxiosSettings{
    errorServerFlashMessage?: boolean | {title: string, text: string};
    successFlashMessage?: boolean | {title: string, text: string};
    errorStatusFlashMessage?: boolean | {title: string, text: string};
    defaultStatus: number;
    autoLogResponce?: boolean;
    flashMessage?: FlashMessagePlugin
}


class FacadeAxios{

    private static instance: FacadeAxios;
    private axiosData: AxiosData | null;
    private settings_: AxiosSettings;
    private errorServerMessage: string;
    private errorStatusMessage: string;

    private readonly actions: {[index: string]: any} = {
        'get'   : (url: string, data: any, config: AxiosRequestConfig) => axios.get   (url, data),
        'post'  : (url: string, data: any, config: AxiosRequestConfig) => axios.post  (url, data, config),
        'put'   : (url: string, data: any, config: AxiosRequestConfig) => axios.put   (url, data, config),
        'delete': (url: string, data: any, config: AxiosRequestConfig) => axios.delete(url, data),
    }
    

    /**
     * Method for axios query
     * @param type 
     * @returns Promise<void>
     */
    private async query(type: 'get' | 'post' | 'put' | 'delete'): Promise<void> {
        const response: AxiosResponse = await this.response(type);
        this.checkResponseStatus(response);
        this.showFlashMessage('success');
        this.axiosData!.handler(response);
    }


    /**
     * @param type 
     * @returns AxiosResponce
     */
    private async response(type: 'get' | 'post' | 'put' | 'delete'): Promise<AxiosResponse>{
        
        const promise: AxiosPromise = this.actions[type](this.axiosData!.url, this.axiosData!.data, this.axiosData!.config);

        // ! query to server are located here
        const response: AxiosResponse | void = await promise!.catch(
            err => {

                this.showFlashMessage('server');

                if(this.axiosData!.errorHandler == undefined) {
                    console.error(err); 
                    return;
                }

                this.axiosData!.errorHandler(err);
            }
        );

        if(this.settings_.autoLogResponce || this.axiosData!.logResponce) console.log(response);

        if(response == undefined) throw new Error('Bad response');

        return response;
    }

    /**
     * @param response: AxiosResponce
     * @returns void
     */
    private checkResponseStatus(response: AxiosResponse){

        const status: number | undefined = this.axiosData!.status || this.settings_.defaultStatus;

        if(response.status !== status){

            this.showFlashMessage('status');

            if(this.axiosData!.errorHandler == undefined) {
                console.error(this.errorStatusMessage); 
                return;
            }

            console.log('axios error ')

            this.axiosData!.errorHandler(response);
        }
    }

    /**
     * 
     * @param messageType 
     * @returns void
     */
    private showFlashMessage(messageType: 'server' | 'success' | 'status'){

        const
            adapterSettings: {[index: string]: keyof AxiosSettings} = {
                server : 'errorServerFlashMessage',
                success: 'successFlashMessage',
                status : 'errorStatusFlashMessage',
            },
            adapterData: {[index: string]: keyof AxiosData} = {
                server : 'errorServerFlashMessage',
                success: 'successFlashMessage',
                status : 'errorStatusFlashMessage'
            },
            messageData: any = this.axiosData![adapterData[messageType]] || this.settings_[adapterSettings[messageType]];
        
        if(this.axiosData![adapterData[messageType]] === false) return; // !think about this variant

        if(!messageData) return;

        const type: string = typeof messageData;

        if(type === "boolean"){
            if(messageType == "success") { 
                this.settings_.flashMessage!.show(FlashMessageData.successMessage('Responce', 'Good responce')); // !think about default message
            } else {
                this.settings_.flashMessage!.show(FlashMessageData.errorMessage('Error', 'Bad responce')); // !think about default message
            }  
        }else{
            if(messageType == "success") { 
                this.settings_.flashMessage!.show(FlashMessageData.successMessage(messageData.title, messageData.text));
            } else {
                this.settings_.flashMessage!.show(FlashMessageData.errorMessage(messageData.title, messageData.text));
            } 
        }
    }
    
    /**
     * @param data 
     */
    public async get(data: AxiosData): Promise<void> {
        this.axiosData = data;
        await this.query('get');
    }

    /**
     * @param data 
     */
    public async post(data: AxiosData): Promise<void> {
        this.axiosData = data;
        await this.query('post');
    }

    /**
     * @param data 
     */
    public async delete(data: AxiosData): Promise<void> {
        this.axiosData = data;
        await this.query('delete');
    }

    /**
     * @param data 
     */
    public async put(data: AxiosData): Promise<void> {
        this.axiosData = data;
        await this.query('put');
    }


    public set settings(settings: AxiosSettings){
        this.settings_ = settings;
    }

    private constructor() {
        axios.defaults.baseURL  = config.server.path;
        this.settings_          = {defaultStatus: 200}; // * TS demands it
        this.errorServerMessage = 'Error with server. Please, reload your page.';
        this.errorStatusMessage = 'Server sended wrong status.';
        this.axiosData          = null;
    }

    public static getInstance(): FacadeAxios {
        return FacadeAxios.instance || new FacadeAxios();
    }
}


export default FacadeAxios.getInstance();