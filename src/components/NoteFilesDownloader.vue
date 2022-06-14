<template>
  <div class="mb-3">
    <div class="mb-1">
      <label class="form-label me-3">Прикреплённые файлы</label>
      <button
          v-on:click="openAddFileModal()"
          :disabled="isDisabled"
          data-bs-target="#addFileModal"
          type="button"
          class="btn btn-outline-primary "
      >
        <i class="bi bi-plus-lg"></i>
      </button>
    </div>
    <div v-for="(file, index) in computedFileValues"
         v-bind:key="file.uuid"
         class="mb-1 d-flex flex-row"
    >
      <div>
        <a
            :disabled="file.id === null || isDisabled"
            v-bind:class="file.id === null ?
              'col-form-label btn form-control link-primary text-start disabled' :
              'btn form-control link-primary text-start'"
            v-on:click="downloadFile(file)">{{ file.filename }}</a>
      </div>
      <div>
        <button
            :disabled="isDisabled"
            v-on:click="removeFile(index)"
            class="btn btn-outline-danger"
        >
          <i class="bi bi-x-lg"></i>
        </button>
      </div>
    </div>
    <!-- Need save dialog on exit -->
    <div class="modal fade" id="addFileModal" tabindex="-1" aria-labelledby="addFileModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="addFileModalLabel">Добавление файла</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
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
            <button type="button" v-on:click="closeAddFileModalClick()" class="btn btn-secondary" data-bs-dismiss="modal">Отмена</button>
            <button
                v-on:click="saveAddFileModalClick()"
                :disabled="isDisabledSaveAddFileInModal"
                type="button"
                class="btn btn-primary"
            >Сохранить</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { v4 as uuidv4 } from 'uuid';
import {Modal} from "bootstrap";
import {MAX_UPLOAD_FILE_SIZE_BYTES} from "@/const/app";
import {showToastMixin} from "@/mixins/showToastMixin";
import {noteService} from "@/service/noteservice";

export default {
  name: "FilesDownloader",
  mixins: [
    showToastMixin
  ],
  props: {
    modelValue: {
      default: []
    },
    noteId: {
      default: null
    },
    isDisabled: {
      type: Boolean,
      default: false
    }
  },
  emits: ['update:modelValue'],
  data () {
    return {
      content: this.value,
      isValidateAddFileError: false,
      isFileAdded: false
    }
  },
  computed: {
    computedFileValues() {
      const computedFileValues = []
      for (let file of this.modelValue) {
        const computedFile = Object.assign(
            {}, file, { uuid: uuidv4() }
        )
        computedFileValues.push(computedFile)
      }
      return computedFileValues
    },
    isDisabledSaveAddFileInModal() {
      return this.isValidateAddFileError || !this.isFileAdded
    }
  },
  methods: {
    updateModelValue(value) {
      this.$emit('update:modelValue', value)
    },
    async downloadFile(file) {
      try {
        const data = await noteService.downloadNoteFile(file.id)
        this.uploadFileInBrowser(data, file.filename)
      } catch (e) {
        this.showUnexpectedErrorToast(e)
      }
    },
    uploadFileInBrowser(blobData, filename) {
      const url = window.URL.createObjectURL(new Blob([blobData]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', filename)
      document.body.appendChild(link)
      link.click()
    },
    removeFile(fileIndex) {
      const files = this.modelValue
      files.splice(fileIndex, 1)
      this.updateModelValue(files)
    },
    openAddFileModal() {
      const addFileModal = document.getElementById('addFileModal')
      const currentComponent = this
      addFileModal.addEventListener('hidden.bs.modal', function () {
        currentComponent.clearAddFileInput()
      })
      // по акрытию очищать ввод
      const modal = new Modal(addFileModal)
      modal.show()
    },
    handleInputFile() {
      const uploadFileSizeBytes = this.$refs.addFileInput.files[0].size
      this.isValidateAddFileError = uploadFileSizeBytes > MAX_UPLOAD_FILE_SIZE_BYTES
      this.isFileAdded = true
    },
    closeAddFileModalClick() {
      this.clearAddFileInput()
    },
    saveAddFileModalClick() {
      const currentComponent = this
      const file = this.$refs.addFileInput.files[0]
      const reader = new FileReader()
      // reader.readAsBinaryString(file)
      reader.readAsArrayBuffer(file)
      reader.onload = function(e) {
        const arrayBuffer = e.target.result
        const bytes = new Uint8Array(arrayBuffer)

        const noteFiles = currentComponent.modelValue
        const base64String = btoa(String.fromCharCode.apply(null, bytes));
        const noteFile = noteService.createNewNoteFile(currentComponent.noteId, file.name, base64String)
        noteFiles.push(noteFile)
        currentComponent.updateModelValue(noteFiles)

        currentComponent.hideAddFileModal()
      }
      reader.onerror = function(e) {
        currentComponent.hideAddFileModal()
        this.showUnexpectedErrorToast(e)
      }
      reader.read
    },
    clearAddFileInput() {
      this.$refs.addFileInput.value = null
      this.isFileAdded = false
      this.isValidateAddFileError = false
    },
    hideAddFileModal() {
      const addFileModal = document.getElementById('addFileModal')
      const modal = Modal.getOrCreateInstance(addFileModal)
      modal.hide()
    }
  }
}
</script>