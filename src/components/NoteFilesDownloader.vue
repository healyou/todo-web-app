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
    <FileUploadModal
        :isVisibleUploadFileModal="isVisibleUploadFileModal"
        @hideModal="isVisibleUploadFileModal = false"
        @addFile="saveAddFileFromModal"
    ></FileUploadModal>
  </div>
</template>

<script>
import { v4 as uuidv4 } from 'uuid';
import {showToastMixin} from "@/mixins/showToastMixin";
import {noteService} from "@/service/noteservice";
import FileUploadModal from "@/components/FileUploadModal";

export default {
  name: "FilesDownloader",
  components: {FileUploadModal},
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
      isVisibleUploadFileModal: false,
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
      this.isVisibleUploadFileModal = true
    },
    saveAddFileFromModal(file) {
      const currentComponent = this

      const reader = new FileReader()
      reader.readAsArrayBuffer(file)
      reader.onload = function(e) {
        try {
          const arrayBuffer = e.target.result
          const bytes = new Uint8Array(arrayBuffer)

          const noteFiles = currentComponent.modelValue
          const base64String = btoa(String.fromCharCode.apply(null, bytes));
          const noteFile = noteService.createNewNoteFile(currentComponent.noteId, file.name, base64String)
          noteFiles.push(noteFile)
          currentComponent.updateModelValue(noteFiles)
        } catch (e) {
          this.showUnexpectedErrorToast(e)
        }
      }
      reader.onerror = function(e) {
        this.showUnexpectedErrorToast(e)
      }
      reader.read
    }
  }
}
</script>