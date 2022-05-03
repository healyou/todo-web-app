<template>
  <div v-if="isLoadingNote" class="d-flex justify-content-center">
    <div class="spinner-border" role="status">
      <span class="visually-hidden">Загрузка...</span>
    </div>
  </div>
  <div v-else>
    <div class="row">
      <span>{{ note }}</span>
    </div>
    <div class="album py-5 bg-light">
      <div class="container">
        <div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">
          <div v-for="note in userNotes"
               v-bind:key="note.id"
               class="col"
          >
            <div class="card shadow-sm">
              <div class="card-body">
                <p class="card-heading">{{ note.title }}</p>
                <p class="card-text">{{ note.text.substring(0, 100) }} ...</p>
                <div class="d-flex justify-content-between align-items-center">
                  <div class="btn-group">
                    <button v-on:click="openUserNotePage(note.id)" type="button" class="btn btn-sm btn-outline-secondary">Открыть</button>
                  </div>
                  <small class="text-muted">{{ note.create_date }}</small>
                </div>
              </div>
            </div>
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

export default {
  name: 'HelloWorld',
  mixins: [
    showToastMixin
  ],
  data: function () {
    return {
      note: null,
      isLoadingNote: true,
    }
  },
  mounted() {
    this.$nextTick(function () {
      this.loadUserNote()
    })
  },
  computed: {
    ...mapState({
      userNotes: state => state.userNotes,
      isLoadingNotes: (state) => state.isLoadingUserNotes
    })
  },
  methods: {
    ...mapMutations({
      setUserNotes: SET_USER_NOTES,
      setLoadingNotes: SET_LOADING_USER_NOTES
    }),
    async loadUserNote() {
      try {
        this.isLoadingNote = true
        const notes = await noteService.getCurrentUserNotes()
        this.setUserNotes(notes)
      } catch (e) {
        this.showUnexpectedErrorToast(e)
      } finally {
        this.isLoadingNote = false
      }
    },
    openUserNotePage(noteId) {
      console.log(noteId)
    },
    openNewNotePage() {
      console.log("Создание новой заметки")
    }
  }
}
</script>