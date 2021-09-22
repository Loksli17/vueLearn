import { createApp }                      from 'vue';
import App                                from './App.vue';
import router                             from './router';
import filters                            from './libs/filters';
import flashMessage, {FlashMessagePlugin} from '@smartweb/vue-flash-message';
import config                             from './config/config';
import store                              from './store';
import AuthService                        from './services/AuthService';
import directives                         from './libs/directives';
import axios, { AxiosResponse}            from 'axios';


config.axiosConfig();

declare module '@vue/runtime-core'{
    interface ComponentCustomProperties{
        $filters: typeof filters;
        $flashMessage: FlashMessagePlugin;
        $store: typeof store;
    }
}

const app = createApp(App);

app.use(flashMessage, config.flashMessage);


app.directive(directives.clickOutside.name, {
    mounted: directives.clickOutside.mounted,
    unmounted: directives.clickOutside.unmounted,
});


app.config.globalProperties.$filters = filters;


axios.interceptors.response.use(
    
    (res: AxiosResponse) => {
        return res
    },

    AuthService.interceptorsError,
);

app.use(store).use(router).mount('#app');
