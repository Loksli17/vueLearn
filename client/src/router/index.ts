import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import store                                                  from '../store/';
import axios, { AxiosError, AxiosResponse }                                                  from 'axios';


const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        name: 'Home',
        component: () => import('../views/Home.vue')
    },
    {
        path: '/crud',
        name: 'Crud-index',
        component: () => import('../views/crud/Index.vue'),
    },
    {
        path: '/crud/create',
        name: 'Crud-create',
        component: () => import('../views/crud/Create.vue'),
    },
    {
        path: '/crud/:id/view',
        name: 'Crud-view',
        component: () => import('../views/crud/View.vue'),
    },
    {
        path: '/crud/:id/edit',
        name: 'Crud-edit',
        component: () => import('../views/crud/Edit.vue'),
    },
    {
        path: '/auth/login',
        name: 'Login',
        component: () => import('../views/Login.vue'),
    },
    {
        path     : "/:pathMatch(.*)*",
        name     : '404',
        component: () => import('../views/404.vue'),
    },
];


const router = createRouter({
    history: createWebHashHistory(),
    routes
});


router.beforeEach((to, from, next) => {

    const isAuth: boolean = store.getters.isAuth;

    if(to.name !== "Login" && !isAuth){
        next({name: 'Login'});
    }else if(to.name == "Login" && isAuth){
        next({name: '404'})
    }else if(to.path === '/logout'){
        store.commit('setUserIdentity', null);
        store.commit('setJWT', null);
        router.push('/login');
    }else{
        next();
    }
});


axios.interceptors.response.use(
    (res: AxiosResponse) => {
        return res
    },
    async (error: AxiosError) => {
        const request = error.config;
        console.log('req: ', request);

        if(error && error.response && error.response.status == 401){
            console.log('!!!!!!!!!');
            const res = await axios.post('/auth/create-tokens');

            if(res.status === 200){
                store.commit('setJWT', res.data.accessToken);
                console.log(res.data.accessToken);
                // return axios.request(request);
            }else{
                router.push({name: 'login'});
                return Promise.reject(error);
            }
        }
    }
)

export default router;
