import {getUserIdFormAccessToken} from "@/const/localstorage";
import {axiosInstance} from "@/configuration/axios";
import {
    WEB_API_GET_ACTUAL_NOTE_PATH,
    WEB_API_GET_GET_LAST_USER_NOTE_MAIN_INFO_PATH,
    WEB_API_GET_USER_NOTES_PATH, WEB_API_GUID_PARAM_NAME,
    WEB_API_MAX_COUNT_LIMIT_PARAM_NAME, WEB_API_SAVE_NOTE_PATH,
    WEB_API_USER_ID_PARAM_NAME
} from "@/const/api";
import {SIDEBAR_MAX_COUNT_NOTES_COUNT} from "@/const/app";
import { v4 as uuidv4 } from 'uuid';

class NoteService {
    async getCurrentUserNotes() {
        const formData = new FormData()
        formData.append(WEB_API_USER_ID_PARAM_NAME, getUserIdFormAccessToken())
        const response = await axiosInstance.post(WEB_API_GET_USER_NOTES_PATH, formData)
        return response.data
    }

    async getCurrentUserMainNotesInfo() {
        const formData = new FormData()
        formData.append(WEB_API_USER_ID_PARAM_NAME, getUserIdFormAccessToken())
        formData.append(WEB_API_MAX_COUNT_LIMIT_PARAM_NAME, SIDEBAR_MAX_COUNT_NOTES_COUNT.toString())
        const response = await axiosInstance.post(WEB_API_GET_GET_LAST_USER_NOTE_MAIN_INFO_PATH, formData)
        return response.data
    }

    async getActualNote(noteGuid) {
        const formData = new FormData()
        formData.append(WEB_API_GUID_PARAM_NAME, noteGuid)
        const response = await axiosInstance.post(WEB_API_GET_ACTUAL_NOTE_PATH, formData)
        return response.data
    }

    createNewNote() {
        return {
            "id": null,
            "prev_note_version_id": null,
            "guid": uuidv4(),
            "version": null,
            "title": "",
            "text": "",
            "user_id": getUserIdFormAccessToken(),
            "create_date": new Date(),
            "deleted": false,
            "archive": false,
            "actual": true,
            "note_files": []
        }
    }

    async saveNote(note) {
        const data = JSON.stringify(note)
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }
        let response;
        try {
            response = await axiosInstance.post(WEB_API_SAVE_NOTE_PATH, data, config)
        } catch (e) {
            if (e.response.status === 500) {
                const errorText = e.response.data["error"]
                throw new Error(errorText)
            } else {
                throw e
            }
        }
        const result = response.data["result"]
        if (result !== true) {
            throw new Error('Ошибка сохранения note (result is false)');
        }
    }
}

export const noteService = new NoteService()