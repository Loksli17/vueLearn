import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import store                                                  from '../store/';


const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        name: 'Home',
        component: () => import('../views/Home.vue')
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

    // ! ---crud----
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


    // ! ---seqCrud---
    {
        path: '/seq',
        name: 'Seq-index',
        component: () => import('../views/seq/Index.vue'),
    },
    {
        path: '/seq/create',
        name: 'Seq-create',
        component: () => import('../views/seq/Create.vue'),
    },
    {
        path: '/seq/:id/view',
        name: 'Seq-view',
        component: () => import('../views/seq/View.vue'),
    },
    {
        path: '/seq/:id/edit',
        name: 'Seq-edit',
        component: () => import('../views/seq/Edit.vue'),
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
