import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'

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
        path: '/crud/view',
        name: 'Crud-view',
        component: () => import('../views/crud/View.vue'),
    },
    {
        path: '/crud/Edit',
        name: 'Crud-view',
        component: () => import('../views/crud/Edit.vue'),
    },
];

const router = createRouter({
    history: createWebHashHistory(),
    routes
});

export default router
