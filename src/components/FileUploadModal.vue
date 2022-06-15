<template>
  <div class="modal fade" id="addFileModal" tabindex="-1" aria-labelledby="addFileModalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="addFileModalLabel">Добавление файла</h5>
          <button
              v-on:click="closeAddFileModal()"
              type="button"
              class="btn-close"
              aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <input
              ref="addFileInput"
              @input="handleInputFile()"
              v-bind:class="{'form-control':true, 'is-invalid' : isValidateAddFileError}"
              type="file"
          >
          <div class="invalid-feedback">Размер файла не может превышать 5 мб</div>
        </div>
        <div class="modal-footer">
          <button type="button" v-on:click="closeAddFileModal()" class="btn btn-secondary">Отмена</button>
          <button
              v-on:click="addFileModalClick()"
              :disabled="isDisabledSaveAddFileInModal"
              type="button"
              class="btn btn-primary"
          >Сохранить</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {Modal} from "bootstrap";
import {MAX_UPLOAD_FILE_SIZE_BYTES} from "@/const/app";

export default {
  name: 'FileUploadModal',
  props: {
    isVisibleUploadFileModal: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    isVisibleUploadFileModal(isVisible) {
      if (isVisible) {
        this.openAddFileModal()
      }
    }
  },
  data () {
    return {
      isValidateAddFileError: false,
      isFileAdded: false,
    }
  },
  computed: {
    isDisabledSaveAddFileInModal() {
      return this.isValidateAddFileError || !this.isFileAdded
    }
  },
  methods: {
    openAddFileModal() {
      const addFileModal = document.getElementById('addFileModal')
      const currentComponent = this
      addFileModal.addEventListener('hidden.bs.modal', function () {
        currentComponent.$emit('hideModal')
        currentComponent.clearAddFileInput()
      })
      // по акрытию очищать ввод
      const modal = new Modal(addFileModal)
      modal.show()
    },
    closeAddFileModal() {
      const addFileModal = document.getElementById('addFileModal')
      const modal = Modal.getOrCreateInstance(addFileModal)
      modal.hide()

      this.$emit('hideModal')
    },
    clearAddFileInput() {
      this.$refs.addFileInput.value = null
      this.isFileAdded = false
      this.isValidateAddFileError = false
    },
    addFileModalClick() {
      const file = this.$refs.addFileInput.files[0]
      this.$emit('addFile', file)
      this.closeAddFileModal()
    },
    handleInputFile() {
      const uploadFileSizeBytes = this.$refs.addFileInput.files[0].size
      this.isValidateAddFileError = uploadFileSizeBytes > MAX_UPLOAD_FILE_SIZE_BYTES
      this.isFileAdded = true
    }
  }
}
</script>