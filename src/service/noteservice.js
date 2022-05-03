import {getUserIdFormAccessToken} from "@/const/localstorage";
import {axiosInstance} from "@/configuration/axios";
import {WEB_API_GET_USER_NOTES_PATH, WEB_API_USER_ID_PARAM_NAME} from "@/const/api";

class NoteService {
    async getCurrentUserNotes() {
        const formData = new FormData()
        formData.append(WEB_API_USER_ID_PARAM_NAME, getUserIdFormAccessToken())
        const response = await axiosInstance.post(WEB_API_GET_USER_NOTES_PATH, formData)
        return response.data
    }
}

export const noteService = new NoteService()