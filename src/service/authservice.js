import {stringify} from "qs";
import {LS_AUTH_DATA_KEY} from "@/const/localstorage";
import axios from "axios";
import {
    AUTH_DATA_ACCESS_TOKEN_VALUE_NAME,
    AUTH_DATA_REFRESH_TOKEN_VALUE_NAME,
    WEB_API_BASE_URL,
    WEB_API_USERNAME_PARAM_NAME,
    WEB_API_LOGIN_PATH,
    WEB_API_LOGOUT_PATH,
    WEB_API_REGISTER_PATH,
    WEB_API_PASSWORD_PARAM_NAME,
    POST_METHOD_NAME,
    CONTENT_TYPE_FORM_URLENCODED,
    WEB_API_ACCESS_TOKEN_HEADER_CODE,
    WEB_API_REFRESH_TOKEN_HEADER_CODE,
    CONTENT_TYPE_HEADER_NAME, WEB_API_REFRESH_TOKEN_PATH
} from "@/const/api";

class AuthService {
    async login(username, password) {
        const formData = new FormData()
        formData.append(WEB_API_USERNAME_PARAM_NAME, username)
        formData.append(WEB_API_PASSWORD_PARAM_NAME, password)
        const loginUrl = WEB_API_BASE_URL + WEB_API_LOGIN_PATH
        const config = {
            method: POST_METHOD_NAME,
            url: loginUrl,
            headers: {
                [CONTENT_TYPE_HEADER_NAME]: CONTENT_TYPE_FORM_URLENCODED
            },
            data : formData
        };
        /* only 200 status */
        const response = await axios(config)
        if (response.data[AUTH_DATA_ACCESS_TOKEN_VALUE_NAME] && response.data[AUTH_DATA_REFRESH_TOKEN_VALUE_NAME]) {
            localStorage[LS_AUTH_DATA_KEY] = JSON.stringify(response.data)
        } else {
            throw new Error('Не получен токен авторизации');
        }
    }
    async refreshToken() {
        const authData = JSON.parse(localStorage[LS_AUTH_DATA_KEY])
        const refreshToken = authData[AUTH_DATA_REFRESH_TOKEN_VALUE_NAME]
        const refreshTokenUrl = WEB_API_BASE_URL + WEB_API_REFRESH_TOKEN_PATH

        const config = {
            method: POST_METHOD_NAME,
            url: refreshTokenUrl,
            headers: {
                [WEB_API_REFRESH_TOKEN_HEADER_CODE]: `${refreshToken}`
            }
        };

        const response = await axios(config)
        if (response.data[AUTH_DATA_ACCESS_TOKEN_VALUE_NAME] && response.data[AUTH_DATA_REFRESH_TOKEN_VALUE_NAME]) {
            localStorage[LS_AUTH_DATA_KEY] = JSON.stringify(response.data)
        } else {
            throw new Error('Не получен токен авторизации');
        }
    }
    async register(username, password) {
        const data = stringify({
            [WEB_API_USERNAME_PARAM_NAME]: `${username}`,
            [WEB_API_PASSWORD_PARAM_NAME]: `${password}`
        });
        const registerUrl = WEB_API_BASE_URL + WEB_API_REGISTER_PATH
        const config = {
            method: POST_METHOD_NAME,
            url: registerUrl,
            headers: {
                [CONTENT_TYPE_HEADER_NAME]: CONTENT_TYPE_FORM_URLENCODED
            },
            data : data
        }
        const response = await axios(config)
        return response.data
    }
    async logout() {
        /* Вначале удаляем куки */
        const authData = JSON.parse(localStorage[LS_AUTH_DATA_KEY])
        localStorage.removeItem(LS_AUTH_DATA_KEY)

        /* Затем выходим из rest */
        const logoutUrl = WEB_API_BASE_URL + WEB_API_LOGOUT_PATH
        const config = {
            method: POST_METHOD_NAME,
            url: logoutUrl,
            headers: {
                [WEB_API_ACCESS_TOKEN_HEADER_CODE]: `${authData[AUTH_DATA_ACCESS_TOKEN_VALUE_NAME]}`,
                [WEB_API_REFRESH_TOKEN_HEADER_CODE]: `${authData[AUTH_DATA_REFRESH_TOKEN_VALUE_NAME]}`
            }
        };
        await axios(config)
    }
}

export const authService = new AuthService()