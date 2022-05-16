<template>
  <div v-if="isLoadingNote" class="d-flex justify-content-center">
    <div class="spinner-border" role="status">
      <span class="visually-hidden">Загрузка...</span>
    </div>
  </div>
  <div v-else>
    <div class="row g-3 mb-3 align-items-center">
      <div class="col-4">
        <label for="lastUpdateDate" class="col-form-label">Дата последнего изменения</label>
      </div>
      <div class="col-4">
        <input
            v-model="note.create_date"
            readonly
            class="form-control"
            type="text"
            id="lastUpdateDate"
            aria-label="default input example"
        >
      </div>
      <div class="col-4">
        <button
            v-on:click="saveOrExitButtonClick()"
            :disabled="isSavingNote"
            type="button"
            class="btn btn-primary float-end"
        >
          <span
              v-if="isSavingNote"
              class="spinner-border spinner-border-sm"
              role="status"
              aria-hidden="true">
          </span>
          {{ getSaveOrExitButtonName }}
        </button>
        <button
            v-on:click="openNeedSaveModalIfExistsFormChanges()"
            :disabled="isSavingNote"
            type="button"
            class="btn btn-secondary float-end me-1"
            data-bs-target="#needSaveModal"
        >Назад</button>
      </div>
    </div>
    <div class="mb-3 row">
      <label for="inputTitle" class="col-sm-2 col-form-label">Название</label>
      <div class="col-sm-10">
        <input
            v-model="note.title"
            :disabled="isSavingNote"
            class="form-control"
            type="text"
            id="inputTitle"
            aria-label="default input example"
        >
      </div>
    </div>
    <div class="mb-3 row">
      <label for="inputText" class="form-label">Текст заметки</label>
      <div class="ml">
        <textarea
            v-model="note.text"
            :disabled="isSavingNote"
            class="form-control" id="inputText" rows="10"
        ></textarea>
      </div>
    </div>
    <FilesDownloader
        v-model:model-value="note.note_files"
        :isDisabled="isSavingNote"
        :noteId="note.id"
    ></FilesDownloader>
    <!-- Need save dialog on exit -->
    <div class="modal fade" id="needSaveModal" tabindex="-1" aria-labelledby="needSaveModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="needSaveModalLabel">Сохранение данных</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            Обнаружены изменения на форме. При выходе все несохранённые данные будут потеряны. Всё равно покинуть форму?
          </div>
          <div class="modal-footer">
            <button type="button" v-on:click="modalGoToHomePage()" class="btn btn-secondary" data-bs-dismiss="modal">Выйти</button>
            <button type="button" v-on:click="modalSaveAndGoToHomePage()" class="btn btn-primary" data-bs-dismiss="modal">Сохранить и выйти</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {mapMutations, mapState} from "vuex";
import {SET_LOADING_USER_NOTES, SET_USER_NOTES} from "@/configuration/store/mutation-types";
import {noteService} from "@/service/noteservice";
import {showToastMixin} from "@/components/mixins/showToastMixin";
import {ROUTER_NOTE_PAGE_NEW_NOTE_UUID_VALUE, ROUTER_NOTE_PAGE_UUID_PARAM_NAME} from "@/const/app";
import {Modal} from "bootstrap";
import FilesDownloader from "@/components/NoteFilesDownloader";

export default {
  name: 'HelloWorld',
  mixins: [
    showToastMixin
  ],
  components: {
    FilesDownloader
  },
  data: function () {
    return {
      initialNote: null,
      note: null,
      isLoadingNote: true,
      isSavingNote: false
    }
  },
  mounted() {
    this.$nextTick(function () {
      const uuidParamValue = this.$route.params[ROUTER_NOTE_PAGE_UUID_PARAM_NAME]
      this.loadOrCreateNewNote(uuidParamValue)
    })
  },
  async beforeRouteUpdate(to) {
    const uuidParamValue = to.params[ROUTER_NOTE_PAGE_UUID_PARAM_NAME]
    await this.loadOrCreateNewNote(uuidParamValue)
  },
  computed: {
    ...mapState({
      userNotes: state => state.userNotes,
      isLoadingNotes: (state) => state.isLoadingUserNotes
    }),
    getSaveOrExitButtonName() {
      if (this.isFormChanged()) {
        return "Сохранить и выйти"
      } else {
        return "Сохранить и выйти (изменений нет)"
      }
    }
  },
  methods: {
    ...mapMutations({
      setUserNotes: SET_USER_NOTES,
      setLoadingNotes: SET_LOADING_USER_NOTES
    }),
    async loadOrCreateNewNote(uuidParamValue) {
      if (uuidParamValue === ROUTER_NOTE_PAGE_NEW_NOTE_UUID_VALUE) {
        await this.createNewNote()
      } else {
        await this.loadUserNote(uuidParamValue)
      }
    },
    async createNewNote() {
      this.note = noteService.createNewNote()
      this.initialNote = Object.assign({}, this.note)
      this.isLoadingNote = false
    },
    async loadUserNote(currentNoteGuid) {
      try {
        this.isLoadingNote = true
        this.note = await noteService.getActualNote(currentNoteGuid)
        this.initialNote = Object.assign({}, this.note)
      } catch (e) {
        this.showUnexpectedErrorToast(e)
      } finally {
        this.isLoadingNote = false
      }
    },
    async goToHomePage() {
      await this.$router.push("/")
    },
    async modalGoToHomePage() {
      await this.goToHomePage()
    },
    async saveNote() {
      try {
        this.isSavingNote = true
        await noteService.saveNote(this.note)
        return true
      } catch (e) {
        this.showUnexpectedErrorToast(e)
        return false
      } finally {
        this.isSavingNote = false
      }
    },
    async modalSaveAndGoToHomePage() {
      await this.saveAndGoToHomePage()
    },
    async saveOrExitButtonClick() {
      if (this.isFormChanged()) {
        await this.saveAndGoToHomePage()
      } else {
        await this.goToHomePage()
      }
    },
    async saveAndGoToHomePage() {
      if (await this.saveNote()) {
        await this.goToHomePage()
      }
    },
    openNeedSaveModal() {
      const needSaveModal = document.getElementById('needSaveModal')
      const modal = new Modal(needSaveModal)
      modal.show()
    },
    openNeedSaveModalIfExistsFormChanges() {
      if (this.isFormChanged()) {
        this.openNeedSaveModal()
      } else {
        this.goToHomePage()
      }
    },
    isFormChanged() {
      return this.note.id === null || JSON.stringify(this.initialNote) !== JSON.stringify(this.note)
    }
  }
}
</script>