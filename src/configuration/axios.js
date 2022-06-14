import axios from "axios";
import {LS_AUTH_DATA_KEY} from "@/const/localstorage";
import {AUTH_DATA_ACCESS_TOKEN_VALUE_NAME, WEB_API_ACCESS_TOKEN_HEADER_CODE, WEB_API_BASE_URL} from "@/const/api";
import {authService} from "@/service/authservice";
import {router} from "@/configuration/router";
import store from "@/configuration/store/store";
import {ADD_TOAST} from "@/configuration/store/mutation-types";
import {Toast} from "@/entity/toast";

export const axiosInstance = axios.create({
    baseURL: WEB_API_BASE_URL,
    // timeout in ms - 15 секунд
    timeout: 15000
})

axiosInstance.interceptors.request.use(
    config => {
        addTokenHeaderIfExists(config)
        return config;
    },
    error => {
        return Promise.reject(error)
    }
)

/* true - была вызвана функция обновления токена */
let isRefreshTokenCalled = false
let isLastRefreshTokenSuccess = false
let lastRefreshTokenError = null

axiosInstance.interceptors.response.use(
    (response) => {
        return response
    },
    async function (error) {
        if (isUnauthorizedError(error) && isRequestNotRetry(error)) {
            setRequestRetry(error)
            // TODO как работает многопоточка в js - безопасно ли выполнять проверку и замену значения в одной функции?
            if (!isRefreshTokenCalled) {
                /* Только 1 запрос с ошибкой 401 будет запрашивать токен */
                isRefreshTokenCalled = true
                return refreshTokenAndRetryRequest(error)
            } else {
                /* Функция вернёт резульат, как только отработает refreshTokenAndRetryRequest */
                return waitForRefreshingTokenAndRetryRequest(error)
            }
        }
        return Promise.reject(error);
    }
)

async function waitForRefreshingTokenAndRetryRequest(error) {
    return new Promise(function(resolve, reject) {
        let executeCheckTimes = 0
        const checkTokenMs = 1500
        const maxCheckTokenTimes = 10
        setTimeout(function checkRefreshingToken() {
            executeCheckTimes++
            if (!isRefreshTokenCalled) {
                if (isLastRefreshTokenSuccess) {
                    resolve()
                } else {
                    reject(lastRefreshTokenError)
                }
            } else {
                if (executeCheckTimes <= maxCheckTokenTimes) {
                    setTimeout(checkRefreshingToken, checkTokenMs)
                } else {
                    reject(error)
                }
            }
        }, checkTokenMs)
    }).then(() => {
        return axiosInstance(error.config);
    }).catch(err => {
        return Promise.reject(err);
    })
}

async function refreshTokenAndRetryRequest(error) {
    try {
        await authService.refreshToken()
        isLastRefreshTokenSuccess = true
        return axiosInstance(error.config)
    } catch (e) {
        /* Не выводим уведомлеия для n параллельных запросов с ошибкой 401 - выведем руками ниже 1 раз, вместо n */
        e.isAlreadyAddedToast = true
        addTokenExpiredErrorToast()

        lastRefreshTokenError = e
        isLastRefreshTokenSuccess = false
        await logout()
        return Promise.reject(e)
    } finally {
        isRefreshTokenCalled = false
    }
}

async function logout() {
    localStorage.removeItem(LS_AUTH_DATA_KEY)
    await router.push("/login")
}

function isUnauthorizedError(error) {
    return error.response.status === 401
}

function isRequestNotRetry(error) {
    return !error.config._retry
}

function setRequestRetry(error) {
    error.config._retry = true
}

function addTokenExpiredErrorToast() {
    const toast = new Toast(
        "Внимание",
        "Истёк срок действия сессии. Необходимо выполнить повторный вход."
    )
    store.commit(ADD_TOAST, toast)
}

function addTokenHeaderIfExists(config) {
    const authData = JSON.parse(localStorage[LS_AUTH_DATA_KEY])
    if (authData !== null) {
        config.headers[WEB_API_ACCESS_TOKEN_HEADER_CODE] = `${authData[AUTH_DATA_ACCESS_TOKEN_VALUE_NAME]}`
    }
}