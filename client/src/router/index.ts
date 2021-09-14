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


export default router;
