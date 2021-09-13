import { createApp }                      from 'vue';
import App                                from './App.vue';
import router                             from './router';
import filters                            from './libs/filters';
import flashMessage, {FlashMessagePlugin} from '@smartweb/vue-flash-message';
import axios                              from './libs/axios';
import config                             from './config/config';
import store                              from './store';
import axiosOrigin                        from 'axios';

// ! it is a bad way, but it is fun for now !!!!!!
axiosOrigin.defaults.headers.common['Authorization'] = store.getters.getJWT;
axiosOrigin.defaults.withCredentials = true;

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

app.use(store).use(router).mount('#app');
