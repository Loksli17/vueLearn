import { createApp }          from 'vue';
import App                    from './App.vue';
import router                 from './router';
import config                 from './config/config';
import axios, {AxiosInstance} from 'axios';
import moment                 from 'moment';
// import store                  from './store';

axios.defaults.baseURL = config.serverPath;


const filters = {
    upperFirst: function(str: string){
        return str[0].toUpperCase() + (str.slice(1, (str.length)));
    },
    datetimeToDb: function(date: Date | string){
        return moment(date).format('YYYY-MM-DD hh:mm:ss');
    },
    datetimeToView: function(date: Date | string){
        return moment(date).format('D.MM.YY h:mm a');
    },
    datetimeToViewMessage: function(date: Date | string){
        return moment(date).format('h:mm a D MMMM');
    },
    dateToDb: function(date: Date | string){
        return moment(date).format('YYYY-MM-DD');
    },
    dateToView: function(date: Date | string){
        return moment(date).format('MMMM Do YYYY');
    },
    timeToDb: function(date: Date | string){
        return moment(date).format('hh:mm:ss');
    },
    timeToView: function(date: Date | string){
        return moment(date).format('h:mm a');
    }
}


declare module '@vue/runtime-core'{
    interface ComponentCustomProperties{
        $filters: typeof filters;
        $axios: AxiosInstance;
        // $flashMessage: FlashMessagePlugin;
        // $store: typeof store;
    }
}

const app = createApp(App);

app.config.globalProperties.$filters = filters;
app.config.globalProperties.$axios   = axios;

app.use(router).mount('#app');
