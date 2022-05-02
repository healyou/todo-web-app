import {mapMutations} from "vuex";
import {ADD_TOAST} from "@/configuration/store/mutation-types";
import {Toast} from "@/entity/toast";

export const showToastMixin = {
    methods: {
        ...mapMutations({
            addToast: ADD_TOAST
        }),
        showUnexpectedErrorToast(error) {
            const toast = new Toast("Непредвиденная ошибка", error.toString())
            this.addToast(toast)
        }
    }
}