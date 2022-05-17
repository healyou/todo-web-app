<template>
  <div v-if="isLoadingNotes" class="d-flex justify-content-center">
    <div class="spinner-border" role="status">
      <span class="visually-hidden">Загрузка...</span>
    </div>
  </div>
  <div v-else>
    <div class="row g-3 mb-3">
      <div>
        <button
            v-on:click="openNewNotePage()"
            type="button"
            class="btn btn-primary float-end"
        >Новая заметка</button>
      </div>
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
                    <button v-on:click="openUserNotePage(note.guid)" type="button" class="btn btn-sm btn-outline-secondary">Открыть</button>
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
import {showToastMixin} from "@/mixins/showToastMixin";
import {ROUTER_NOTE_PAGE_NEW_NOTE_UUID_VALUE} from "@/const/app";

export default {
  name: 'HelloWorld',
  mixins: [
    showToastMixin
  ],
  mounted() {
    this.$nextTick(function () {
      // TODO - если загружены - не надо снова грузить - только после изменения данных
      this.loadUserNotes()
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
    async loadUserNotes() {
      try {
        this.setLoadingNotes(true)
        const notes = await noteService.getCurrentUserNotes()
        this.setUserNotes(notes)
      } catch (e) {
        this.showUnexpectedErrorToast(e)
      } finally {
        this.setLoadingNotes(false)
      }
    },
    openUserNotePage(noteUuid) {
      this.$router.push('/note/' + noteUuid)
    },
    openNewNotePage() {
      this.$router.push('/note/' + ROUTER_NOTE_PAGE_NEW_NOTE_UUID_VALUE)
    }
  }
}
</script>