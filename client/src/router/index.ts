import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import store                                              from '../store/';


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

    {
        path     : "/long",
        name     : "Long text",
        component: () => import('../views/LongPage.vue'),
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
        path: '/seq-crud',
        name: 'Seq-index',
        component: () => import('../views/seq/Index.vue'),
    },
    {
        path: '/seq-crud/create',
        name: 'Seq-create',
        component: () => import('../views/seq/Create.vue'),
    },
    {
        path: '/seq-crud/:id/view',
        name: 'Seq-view',
        component: () => import('../views/seq/View.vue'),
    },
    {
        path: '/seq-crud/:id/edit',
        name: 'Seq-edit',
        component: () => import('../views/seq/Edit.vue'),
    },


    // ! ---seqCrud animals---
    {
        path: '/animals',
        name: 'Animal',
        component: () => import('../views/animal/Index.vue'),
    },
    {
        path: '/animals/create',
        name: 'Animal-create',
        component: () => import('../views/animal/Create.vue'),
    },
    {
        path: '/animals/:id/edit',
        name: 'Animal-edit',
        component: () => import('../views/animal/Edit.vue'),
    },


    // ! ---Books---
    {
        path: '/books-crud',
        name: 'Book-index',
        component: () => import('../views/books/Index.vue'),
    },
    {
        path: '/books-crud/:id/view',
        name: 'Book-view',
        component: () => import('../views/books/View.vue'),
    },
    {
        path: '/books-crud/:id/edit',
        name: 'Book-edit',
        component: () => import('../views/books/Edit.vue'),
    },
    {
        path: '/books-crud/create',
        name: 'Book-create',
        component: () => import('../views/books/Create.vue'),
    },


    //! ---Video---
    {
        path: '/videos',
        name: 'Video',
        component: () => import('../views/video/Index.vue'),
    }

];


const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
});


router.beforeEach((to, from, next) => {

    const isAuth: boolean = store.getters.isAuth;

    if(to.name !== "Login" && !isAuth){
        next({name: 'Login'});
    }else if(to.path === '/logout'){
        store.commit('setUserIdentity', null);
        store.commit('setJWT', null);
        router.push('/login');
    }else if(to.name == "Login" && isAuth){
        next({name: '404'});
    }else{
        next();
    }
});


export default router;
