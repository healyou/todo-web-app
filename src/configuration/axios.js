import axios from "axios";
import {LS_AUTH_DATA_KEY} from "@/const/localstorage";
import {AUTH_DATA_ACCESS_TOKEN_VALUE_NAME, WEB_API_ACCESS_TOKEN_HEADER_CODE} from "@/const/api";
import {authService} from "@/service/authservice";
import {router} from "@/configuration/router";
import store from "@/configuration/store/store";
import {ADD_TOAST} from "@/configuration/store/mutation-types";
import {Toast} from "@/entity/toast";

export const axiosInstance = axios.create({
    baseURL: 'http://localhost:8080/todo-web-api',
    // timeout in ms - 15 секунд
    timeout: 15000
})

axiosInstance.interceptors.request.use(
    config => {
        const authData = JSON.parse(localStorage[LS_AUTH_DATA_KEY])
        if (authData !== null) {
            config.headers[WEB_API_ACCESS_TOKEN_HEADER_CODE] = `${authData[AUTH_DATA_ACCESS_TOKEN_VALUE_NAME]}`
        }
        return config;
    },
    error => {
        return Promise.reject(error)
    });

axiosInstance.interceptors.response.use(
    (response) => {
        return response
    },
    async function (error) {
        const requestConfig = error.config
        if (error.response.status === 401 && !requestConfig._retry) {
            requestConfig._retry = true
            try {
                await authService.refreshToken()
            } catch (e) {
                addTokenExpiredErrorToast()
                error.isAlreadyAddedToast = true
                localStorage.removeItem(LS_AUTH_DATA_KEY)
                await router.push("/login")
                return Promise.resolve(error)
            }
            return axiosInstance(requestConfig)
        }
        return Promise.reject(error);
    }
);

function addTokenExpiredErrorToast() {
    const toast = new Toast(
        "Внимание",
        "Истёк срок действия сессии. Необходимо выполнить повторный вход."
    )
    store.commit(ADD_TOAST, toast)
}