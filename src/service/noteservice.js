import {getUserIdFromAccessToken} from "@/const/localstorage";
import {axiosInstance} from "@/configuration/axios";
import {
    WEB_API_GET_ACTUAL_NOTE_PATH,
    WEB_API_GET_GET_LAST_USER_NOTE_MAIN_INFO_PATH, WEB_API_GET_NOTE_FILE_BODY_PATH,
    WEB_API_GRAPHQL_PATH, WEB_API_GUID_PARAM_NAME,
    WEB_API_MAX_COUNT_LIMIT_PARAM_NAME, WEB_API_NOTE_FILE_ID_PARAM_NAME, WEB_API_SAVE_NOTE_PATH,
    WEB_API_USER_ID_PARAM_NAME
} from "@/const/api";
import {SIDEBAR_MAX_COUNT_NOTES_COUNT} from "@/const/app";
import { v4 as uuidv4 } from 'uuid';

class NoteService {
    async getCurrentUserNotes() {
        const data = JSON.stringify({
            query: `query Query($userId: ID){
                        userNotes(userId: $userId){
                            id
                            prev_note_version_id
                            guid
                            version
                            title
                            text
                            user {
                                user_id
                            }
                            create_date
                            deleted
                            archive
                            actual
                            note_files {
                                id
                                note_id
                                guid
                                data
                                filename
                            }
                        }
                    }`,
            variables: {"userId": getUserIdFromAccessToken()}
        })

        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }

        const response = await axiosInstance.post(WEB_API_GRAPHQL_PATH, data, config)

        if (response.data === null || response.data.data === null) {
            throw new Error("Не получены сведения о заметках")
        }
        const graphqlData = response.data.data
        if (graphqlData.errors) {
            throw new Error("Ошибка загрузки списка заметок: " + response.errors)
        } else if (graphqlData.userNotes === null) {
            return []
        } else {
            return graphqlData.userNotes
        }
    }

    async getCurrentUserMainNotesInfo() {
        const formData = new FormData()
        formData.append(WEB_API_USER_ID_PARAM_NAME, getUserIdFromAccessToken())
        formData.append(WEB_API_MAX_COUNT_LIMIT_PARAM_NAME, SIDEBAR_MAX_COUNT_NOTES_COUNT.toString())
        const response = await axiosInstance.post(WEB_API_GET_GET_LAST_USER_NOTE_MAIN_INFO_PATH, formData)
        if (response.data === null) {
            return []
        } else {
            return response.data
        }
    }

    async getActualNote(noteGuid) {
        const formData = new FormData()
        formData.append(WEB_API_GUID_PARAM_NAME, noteGuid)
        const response = await axiosInstance.post(WEB_API_GET_ACTUAL_NOTE_PATH, formData)

        /* Установим пустой массив */
        const note = response.data
        if (note.note_files === null) {
            note.note_files = []
        }

        return note
    }

    copyNote(note) {
        const copyNote = Object.assign({}, note)
        copyNote.note_files = []
        for (let file of note.note_files) {
            copyNote.note_files.push(Object.assign({}, file))
        }
        return copyNote
    }

    async downloadNoteFile(noteFileId) {
        const formData = new FormData()
        formData.append(WEB_API_NOTE_FILE_ID_PARAM_NAME, noteFileId)
        const config = {
            responseType: 'blob'
        }

        const response = await axiosInstance.post(WEB_API_GET_NOTE_FILE_BODY_PATH, formData, config)
        return response.data
    }

    createNewNoteFile(noteId, filename, data) {
        return {
            filename: filename,
            data: data,
            id: null,
            note_id: noteId,
            guid: null
        }
    }

    createNewNote() {
        return {
            "id": null,
            "prev_note_version_id": null,
            "guid": uuidv4(),
            "version": null,
            "title": "",
            "text": "",
            "user_id": getUserIdFromAccessToken(),
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