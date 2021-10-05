import axios from 'axios';
import store from '../store';


export default {

    axiosConfig: () => {
        axios.defaults.baseURL                         = 'http://localhost:3000/',
        axios.defaults.headers.common['Authorization'] = store.getters.getJWT;
        axios.defaults.headers.common['Content-Type']  = 'application/json';
        axios.defaults.withCredentials                 = true;

        axios.defaults.validateStatus = (status) => {
            return status !== 401;
        }
    },

    flashMessage:  {
        name    : 'flashMessage',
        tag     : 'FlashMessage',
        time    : 6000,
        strategy: 'single',
    },
    
}