import {mapMutations} from "vuex";
import {ADD_TOAST} from "@/configuration/store/mutation-types";
import {Toast} from "@/entity/toast";

export const showToastMixin = {
    methods: {
        ...mapMutations({
            addToast: ADD_TOAST
        }),
        showUnexpectedErrorToast(error) {
            if (error.isAlreadyAddedToast) {
                console.log("В axios была получена и обработана ошибка", error)
                return
            }
            const toast = new Toast("Непредвиденная ошибка", error.toString())
            this.addToast(toast)
        }
    }
}