import { createRouter, createWebHistory } from 'vue-router';

import HomePage from '../components/HomePage'
import LoginPage from '../components/LoginPage'
import {LS_AUTH_DATA_KEY} from "@/const/localstorage";

export const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            name: 'Home',
            component: HomePage },
        {
            path: '/login',
            name: 'Login',
            component: LoginPage,
            meta: {
                sidebar:false
            }
        }
    ]
});

router.beforeEach((to, from, next) => {
    const publicPages = ['/login']
    const authRequired = !publicPages.includes(to.path)
    const authData = localStorage[LS_AUTH_DATA_KEY]

    if (to.path === '/login' && authData) {
        return next('/')
    } else if (authRequired && !authData) {
        return next('/login');
    }

    next();
})