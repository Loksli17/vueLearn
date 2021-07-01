import { createApp }                      from 'vue';
import App                                from './App.vue';
import router                             from './router';
import filters                            from './libs/filters';
import flashMessage, {FlashMessagePlugin} from '@smartweb/vue-flash-message';
// import store                  from './store';


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

app.use(router).mount('#app');
