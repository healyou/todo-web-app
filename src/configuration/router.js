import { createRouter, createWebHistory } from 'vue-router';

import LoginPage from '../components/LoginPage'
import {LS_AUTH_DATA_KEY} from "@/const/localstorage";
import NotesPage from "@/components/NotesPage";
import NotePage from "@/components/NotePage";
import {
    ROUTER_LOGIN_PAGE_NAME,
    ROUTER_NOTE_PAGE_NAME,
    ROUTER_NOTE_PAGE_UUID_PARAM_NAME,
    ROUTER_NOTES_PAGE_NAME
} from "@/const/app";

export const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            name: ROUTER_NOTES_PAGE_NAME,
            component: NotesPage
        },
        {
            path: '/note/:' + ROUTER_NOTE_PAGE_UUID_PARAM_NAME,
            name: ROUTER_NOTE_PAGE_NAME,
            component: NotePage
        },
        {
            path: '/login',
            name: ROUTER_LOGIN_PAGE_NAME,
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