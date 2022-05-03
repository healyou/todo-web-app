/* токен авторизации пользователя */
import {ACCESS_TOKEN_USER_ID_VALUE_NAME, AUTH_DATA_ACCESS_TOKEN_VALUE_NAME} from "@/const/api";
import jwt_decode from "jwt-decode";

export const LS_AUTH_DATA_KEY = 'LS_AUTH_DATA'

export function getUserIdFormAccessToken() {
    const authData = JSON.parse(localStorage[LS_AUTH_DATA_KEY])
    const accessToken = authData[AUTH_DATA_ACCESS_TOKEN_VALUE_NAME]
    const tokenPayload = jwt_decode(accessToken);
    return tokenPayload[ACCESS_TOKEN_USER_ID_VALUE_NAME]
}