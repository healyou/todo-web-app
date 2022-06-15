import {createStore} from 'vuex'
import {
    ADD_TOAST,
    REMOVE_TOAST_BY_UUID,
    SET_LOADING_MAIN_USER_NOTES_INFO,
    SET_LOADING_USER_NOTES,
    SET_MAIN_USER_NOTES_INFO, SET_NEED_RELOAD_USER_MAIN_NOTES_INFO,
    SET_USER_NOTES
} from "@/configuration/store/mutation-types";

export default createStore({
    state () {
        return {
            toasts: [],
            userNotes: [],
            isLoadingUserNotes: true,
            userMainNotesInfo: [],
            isLoadingMainNotesInfo: true,
            isNeedReloadUserMainNotesInfo: false
        }
    },
    mutations: {
        [ADD_TOAST] (state, toast) {
            state.toasts.push(toast)
        },
        [REMOVE_TOAST_BY_UUID] (state, uuid) {
            state.toasts = state.toasts.filter(function( it ) {
                return it.uuid !== uuid;
            });
        },
        [SET_USER_NOTES] (state, userNotes) {
            state.userNotes = userNotes
        },
        [SET_LOADING_USER_NOTES] (state, isLoadingNotes) {
            state.isLoadingUserNotes = isLoadingNotes
        },
        [SET_MAIN_USER_NOTES_INFO] (state, userMainNotesInfo) {
            state.userMainNotesInfo = userMainNotesInfo
        },
        [SET_LOADING_MAIN_USER_NOTES_INFO] (state, isLoadingMainNotesInfo) {
            state.isLoadingMainNotesInfo = isLoadingMainNotesInfo
        },
        [SET_NEED_RELOAD_USER_MAIN_NOTES_INFO] (state, isNeedReloadUserMainNotesInfo) {
            state.isNeedReloadUserMainNotesInfo = isNeedReloadUserMainNotesInfo
        }
    }
})