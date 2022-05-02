<template>
  <div class="toast-container position-absolute p-3 top-0 end-0">
    <div v-for="toast in toasts"
         v-bind:key="toast.uuid"
         class="toast" role="alert"
         v-bind:data-toast-uuid="toast.uuid"
    >
      <div class="toast-header">
        <strong class="me-auto">{{ toast.title }}</strong>
        <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Закрыть"></button>
      </div>
      <div class="toast-body">
        {{ toast.text }}
      </div>
    </div>
  </div>
</template>

<script>
import {Toast} from "bootstrap"
import {mapMutations, mapState} from 'vuex'
import {REMOVE_TOAST_BY_UUID} from "@/configuration/store/mutation-types";

export default {
  name: 'HelloWorld',
  updated: function() {
    /* После обновления разметки отображаем новые toast */
    this.showNewToasts()
  },
  computed: {
    ...mapState({
      toasts: (state) => state.toasts
    })
  },
  methods: {
    ...mapMutations({
      removeToastByUuid: REMOVE_TOAST_BY_UUID
    }),
    showNewToasts() {
      /* Все ещё не отображённые toast */
      const toastElList = [].slice.call(document.querySelectorAll('.toast:not(.hide):not(.show)'))
      /* Создаём js toast */
      const self = this
      const toastList = toastElList.map(function (toastEl) {
        toastEl.addEventListener('hidden.bs.toast', function () {
          const uuid = toastEl.getAttribute("data-toast-uuid")
          self.removeToastByUuid(uuid)
        })
        return new Toast(toastEl)
      })
      /* Отображаем toast */
      toastList.forEach(toast => toast.show())
    }
  }
}
</script>