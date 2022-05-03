import {createStore} from 'vuex'
import {ADD_TOAST, REMOVE_TOAST_BY_UUID, SET_LOADING_USER_NOTES, SET_USER_NOTES} from "@/configuration/store/mutation-types";

export default createStore({
    state () {
        return {
            toasts: [],
            userNotes: [],
            isLoadingUserNotes: true
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
        }
    }
})