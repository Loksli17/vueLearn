import axios, { AxiosResponse }  from "axios";
import config from '../config/config';
import {FlashMessagePlugin} from '@smartweb/vue-flash-message';
import flashMessageData  from '../libs/flashMessage';


axios.defaults.baseURL = config.serverPath;


interface axiosData{
    url: string,
    status: number,
    error?: (...args: any[]) => void,
    handler: (...args: any[]) => void,
    data?: Record<string, unknown>,
    flashMessage: FlashMessagePlugin,
    successMessage?: {title: string, text: string},
}


axios.

export default {

    post: async (axiosData: axiosData) => {

        const response: AxiosResponse | void = await axios.post(axiosData.url, axiosData.data)
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
    },
};