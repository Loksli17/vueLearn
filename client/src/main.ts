import { createApp }                      from 'vue';
import App                                from './App.vue';
import router                             from './router';
import filters                            from './libs/filters';
import flashMessage, {FlashMessagePlugin} from '@smartweb/vue-flash-message';
import axios                              from './libs/axios';


declare module '@vue/runtime-core'{
    interface ComponentCustomProperties{
        $filters: typeof filters;
        $flashMessage: FlashMessagePlugin;
        // $store: typeof store;
    }
}

const app = createApp(App);

app.use(flashMessage, {
    name    : 'flashMessage',
    tag     : 'FlashMessage',
    time    : 6000,
    strategy: 'single',
});

app.config.globalProperties.$filters = filters;

axios.settings = {
    defaultStatus              : 200,
    autoServerErrorFlashMessage: true,
    autoSuccessFlashMessage    : false,
    flashMessage               : app.config.globalProperties.$flashMessage
}

app.use(router).mount('#app');
