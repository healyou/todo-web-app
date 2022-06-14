/* токен авторизации пользователя */
import {
    ACCESS_TOKEN_PAYLOAD_USER_ID_VALUE_NAME,
    ACCESS_TOKEN_PAYLOAD_USERNAME_VALUE_NAME,
    AUTH_DATA_ACCESS_TOKEN_VALUE_NAME
} from "@/const/api";
import jwt_decode from "jwt-decode";

export const LS_AUTH_DATA_KEY = 'LS_AUTH_DATA'

export function getUserIdFromAccessToken() {
    return getPayloadValueFromAccessToken(ACCESS_TOKEN_PAYLOAD_USER_ID_VALUE_NAME)
}

export function getUsernameFromAccessToken() {
    return getPayloadValueFromAccessToken(ACCESS_TOKEN_PAYLOAD_USERNAME_VALUE_NAME)
}

function getPayloadValueFromAccessToken(valueName) {
    const authData = JSON.parse(localStorage[LS_AUTH_DATA_KEY])
    const accessToken = authData[AUTH_DATA_ACCESS_TOKEN_VALUE_NAME]
    const tokenPayload = jwt_decode(accessToken);
    return tokenPayload[valueName]
}