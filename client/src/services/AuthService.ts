import axios, { AxiosError, AxiosResponse } from "axios";
import store                                from "@/store";
import router                               from "@/router";


export default class AuthService {

    public static async interceptorsError(error: AxiosError){
        const request = error.config;

        if(error && error.response && error.response.status == 401){

            const res = await axios.post('/auth/create-tokens');

            if(res.status === 200){

                if(res.data.msg !== "refreshToken expired"){
                    store.commit('setJWT', res.data.accessToken);
                    axios.defaults.headers.common['Authorization'] = res.data.accessToken;
                    request.headers['Authorization'] = res.data.accessToken;
                    return axios.request(request);
                }else{
                    store.commit('setUserIdentity', null);
                    store.commit('setJWT', null);
                    router.push({name: 'Login'});
                    return Promise.reject(error);
                }
            }else{
                return Promise.reject(error);
            }
        }
    }


    public static async login(formData: Record<string, any>){

        let response: AxiosResponse | void;

        try {
            response = await axios.post(`/auth/login`, formData)
        } catch (error: any) {
            console.error(error);
            return error.response;
        }

        if(response == undefined) { console.error('Bad response'); return null; }

        store.commit('setUserIdentity', response.data.user);
        store.commit('setJWT', response.data.accessToken);

        router.push({name: 'Home'});
        axios.defaults.headers.common['Authorization'] = store.getters.getJWT;

        return response;
    }
}