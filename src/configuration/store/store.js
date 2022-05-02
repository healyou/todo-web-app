import { createStore } from 'vuex'
import {ADD_TOAST, REMOVE_TOAST_BY_UUID} from "@/configuration/store/mutation-types";

export default createStore({
    state () {
        return {
            toasts: []
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
        }
    }
})