import axios, { AxiosPromise, AxiosResponse } from "axios";
import config                                 from '../config/config';
import {FlashMessagePlugin}                   from '@smartweb/vue-flash-message';
import FlashMessageData                       from '../libs/flashMessage';


interface AxiosData{
    url: string,
    status?: number,
    errorHandler?: (...args: any[]) => void,
    handler: (...args: any[]) => void,
    data?: Record<string, unknown>,
    flashMessage: FlashMessagePlugin,
    successMessage?: {title: string, text: string},
    errorStatusMessage?: {title: string, text: string},
    log?: boolean,
}

export interface AxiosSettings{
    autoServerErrorFlashMessage?: boolean;
    autoSuccessFlashMessage?: boolean;
    defaultStatus: number;
    autoLogResponce?: boolean;
}


class FacadeAxios{

    private static instance: FacadeAxios;
    private axiosData: AxiosData | null;
    private settings_: AxiosSettings;
    private errorServerMessage: string;
    private errorStatusMessage: string;
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
    private async query(type: 'get' | 'post' | 'put' | 'delete'): Promise<void> {

        const response: AxiosResponse = await this.responce(type);

        this.checkResponseStatus(response);

        if(this.axiosData!.successMessage) this.axiosData!.flashMessage.show(FlashMessageData.successMessage(this.axiosData!.successMessage.title, this.axiosData!.successMessage.text));

        this.axiosData!.handler(response);
    }


    private async responce(type: 'get' | 'post' | 'put' | 'delete'): Promise<AxiosResponse>{
        
        const promise: AxiosPromise = this.actions[type](this.axiosData!.url, this.axiosData!.data);

        // ! query to server are located here
        const response: AxiosResponse | void = await promise!.catch(
            err => {
                if(this.settings_.autoServerErrorFlashMessage)
                    this.axiosData!.flashMessage.show(FlashMessageData.errorMessage('Error', this.errorServerMessage));
                
                if(this.axiosData!.errorHandler == undefined) {
                    console.error(err); 
                    return;
                }

                this.axiosData!.errorHandler(err);
            }
        );

        if(this.settings_.autoLogResponce || this.axiosData!.log) console.log(response);

        if(response == undefined) throw new Error('Bad response');

        return response;
    }


    private checkResponseStatus(response: AxiosResponse){

        const status: number | undefined = this.axiosData!.status || this.settings_.defaultStatus;

        if(response.status !== this.axiosData!.status){

            if(this.axiosData!.errorHandler == undefined) {
                this.axiosData!.flashMessage.show(FlashMessageData.errorMessage('Error', this.errorStatusMessage));
                console.error(this.errorStatusMessage); 
                return;
            }

            this.axiosData!.errorHandler(this.errorStatusMessage);
        }
    }

    
    public async get(data: AxiosData): Promise<void> {
        this.axiosData = data;
        await this.query('get');
    }

    public async post(data: AxiosData): Promise<void> {
        this.axiosData = data;
        await this.query('post');
    }

    public async delete(data: AxiosData): Promise<void> {
        this.axiosData = data;
        await this.query('delete');
    }

    public async put(data: AxiosData): Promise<void> {
        this.axiosData = data;
        await this.query('put');
    }


    public set settings(settings: AxiosSettings){
        this.settings_ = settings;
    }

    private constructor() {
        axios.defaults.baseURL  = config.server.path;
        this.settings_          = {defaultStatus: 200};
        this.errorServerMessage = config.server.errorMessage;
        this.errorStatusMessage = 'Bad status';
        this.axiosData          = null;
    }

    public static getInstance(): FacadeAxios {
        return FacadeAxios.instance || new FacadeAxios();
    }
}


export default FacadeAxios.getInstance();