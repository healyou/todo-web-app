import axios from "axios";
import {LS_AUTH_DATA_KEY} from "@/const/localstorage";

export const axiosInstance = axios.create({
    baseURL: 'http://localhost:8080/todo-web-api',
    // timeout in ms - 15 секунд
    timeout: 15000
})

axiosInstance.interceptors.request.use(
    config => {
        const authData = localStorage[LS_AUTH_DATA_KEY]
        if (authData !== null) {
            config.headers['X-Access-Token'] = `${authData['access_token']}`
        }
        return config;
    },
    error => {
        Promise.reject(error)
    });

axiosInstance.interceptors.response.use((response) => {
    return response
}, async function (error) {
    // TODO при ошибке авторизации обновить токен и повторить запрос
    // const originalRequest = error.config;
    // if (error.response.status === 403 && !originalRequest._retry) {
    //     originalRequest._retry = true;
    //     const access_token = await refreshAccessToken();
    //     axios.defaults.headers.common['Authorization'] = 'Bearer ' + access_token;
    //     return axiosInstance(originalRequest);
    // }
    return Promise.reject(error);
});

// async function refreshAccessToken() {
//     const value = '{\n' +
//         '    "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwidXNlcl9pZCI6MSwicHJpdmlsZWdlcyI6WyJWSUVXX05PVEVfVkVSU0lPTl9ISVNUT1JZIiwiQ0hBTkdFX05PVEVfVkVSU0lPTiIsIkNSRUFURV9OT1RFIl0sImV4cCI6MTY1MDc0MDk0Mn0.a9X-mqrR-8lzixgi-ou6ZNIWDDkF5QawV-U-tgpaUMc",\n' +
//         '    "access_token_expired_time_utc": "04.23.2022 19:09:02 +0300",\n' +
//         '    "refresh_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwidXNlcl9pZCI6MSwicHJpdmlsZWdlcyI6WyJWSUVXX05PVEVfVkVSU0lPTl9ISVNUT1JZIiwiQ0hBTkdFX05PVEVfVkVSU0lPTiIsIkNSRUFURV9OT1RFIl0sInV1aWQiOiI5YmNhNDllZi1hYzMzLTQzMWUtODMyYS05M2Q3OTZkYmZiOTgiLCJleHAiOjE2NTA4MjU1NDJ9.TYgUVegJh34HLNcny2IObFRzWXf48FvSiE0m52YQRMs"\n' +
//         '}'
//     const keys = JSON.parse(value)
//     return keys.access_token
// }