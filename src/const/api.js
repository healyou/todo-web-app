export const WEB_API_BASE_URL = process.env.VUE_APP_WEB_API_URL + '/todo-web-api'
export const WEB_API_LOGIN_PATH='/auth-api/login'
export const WEB_API_REFRESH_TOKEN_PATH='/auth-api/refreshToken'
export const WEB_API_REGISTER_PATH='/users-api/users/register'
export const WEB_API_LOGOUT_PATH='/auth-api/logout'

export const WEB_API_GRAPHQL_PATH='/graphql'
export const WEB_API_GET_ACTUAL_NOTE_PATH='/notes-api/notes/getActualNote'
export const WEB_API_GET_NOTE_FILE_BODY_PATH='/notes-api/notes/getNoteFileBody'
export const WEB_API_SAVE_NOTE_PATH='/notes-api/notes/saveNote'
export const WEB_API_GET_GET_LAST_USER_NOTE_MAIN_INFO_PATH='/notes-api/notes/getLastUserNoteMainInfo'

export const ACCESS_TOKEN_PAYLOAD_USER_ID_VALUE_NAME='user_id'
export const ACCESS_TOKEN_PAYLOAD_USERNAME_VALUE_NAME = 'username'

export const WEB_API_USERNAME_PARAM_NAME='username'
export const WEB_API_PASSWORD_PARAM_NAME='password'
export const WEB_API_USER_ID_PARAM_NAME='user_id'
export const WEB_API_GUID_PARAM_NAME='guid'
export const WEB_API_MAX_COUNT_LIMIT_PARAM_NAME='max_count_limit'
export const WEB_API_NOTE_FILE_ID_PARAM_NAME='id'

export const WEB_API_ACCESS_TOKEN_HEADER_CODE='X-Access-Token'
export const WEB_API_REFRESH_TOKEN_HEADER_CODE='X-Refresh-Token'

export const AUTH_DATA_ACCESS_TOKEN_VALUE_NAME='access_token'
export const AUTH_DATA_REFRESH_TOKEN_VALUE_NAME='refresh_token'

export const POST_METHOD_NAME='post'
export const CONTENT_TYPE_HEADER_NAME='Content-Type'
export const CONTENT_TYPE_FORM_URLENCODED='application/x-www-form-urlencoded'