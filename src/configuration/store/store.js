import { createStore } from 'vuex'
import {SET_AUTH_DATA} from "@/configuration/store/mutation-types";

export default createStore({
    state () {
        return {
            authData: null
        }
    },
    getters: {
        authData: state => state.authData
    },
    mutations: {
        [SET_AUTH_DATA] (state, authData) {
            state.authData = authData
        }
    }
})