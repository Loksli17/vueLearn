import { createApp }                      from 'vue';
import App                                from './App.vue';
import router                             from './router';
import filters                            from './libs/filters';
import flashMessage, {FlashMessagePlugin} from '@smartweb/vue-flash-message';
import axios                              from './libs/axios';
import config                             from './config/config';
import store                              from './store';

import axiosOrigin, {AxiosError, AxiosResponse} from 'axios';


// ! it is a bad way, but it is fun for now !!!!!!
axiosOrigin.defaults.headers.common['Authorization'] = store.getters.getJWT;
axiosOrigin.defaults.withCredentials = true;

// axiosOrigin.defaults.validateStatus = (status) => {
//     return (status >= 200 && status < 300) || (status == 401);
// }

declare module '@vue/runtime-core'{
    interface ComponentCustomProperties{
        $filters: typeof filters;
        $flashMessage: FlashMessagePlugin;
        $store: typeof store;
    }
}

const app = createApp(App);

app.use(flashMessage, {
    name    : 'flashMessage',
    tag     : 'FlashMessage',
    time    : 6000,
    strategy: 'single',
});


// ! think about code it in another file
app.directive('click-outside', {

    mounted(el: any, binding: any) {
        el.clickOutsideEvent = function (e: any) {
            if (!(el == e.target || el.contains(e.target))){
                binding.value(e);
            }
        };
        document.body.addEventListener('click', el.clickOutsideEvent)
    },   

    unmounted(el: any) {
        document.body.removeEventListener('click', el.clickOutsideEvent)
    },
});


app.config.globalProperties.$filters = filters;

// ! think about replace it in config file 
axios.settings = {
    defaultStatus          : 200,
    errorServerFlashMessage: {title: 'Erorr', text: config.server.errorMessage},
    errorStatusFlashMessage: {title: 'Error', text: 'bad request'},
    flashMessage           : app.config.globalProperties.$flashMessage,
}

axiosOrigin.interceptors.response.use(
    
    (res: AxiosResponse) => {
        return res
    },

    async (error: AxiosError) => {
        const request = error.config;

        if(error && error.response && error.response.status == 401){

            const res = await axiosOrigin.post('/auth/create-tokens');

            if(res.status === 200){

                if(res.data.msg !== "token expired"){
                    store.commit('setJWT', res.data.accessToken);
                    axiosOrigin.defaults.headers.common['Authorization'] = res.data.accessToken;
                    request.headers['Authorization'] = res.data.accessToken;
                    return axiosOrigin.request(request);
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
)


app.use(store).use(router).mount('#app');
