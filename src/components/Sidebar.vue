<template>
  <div class="col-auto col-md-3 col-xl-2 px-sm-2 px-0 bg-dark">
    <div class="d-flex flex-column align-items-center align-items-sm-start px-3 pt-2 text-white min-vh-100">
      <a href="/" class="d-flex align-items-center pb-3 mb-md-0 me-md-auto text-white text-decoration-none">
        <span class="fs-5 d-none d-sm-inline">Меню</span>
      </a>
      <ul class="nav nav-pills flex-column mb-sm-auto mb-0 align-items-center align-items-sm-start" id="menu">
        <li class="nav-item">
          <router-link to="/" class="nav-link align-middle px-0">
            <i class="fs-4 bi-house"></i><span class="ms-1 d-none d-sm-inline">Главная</span>
          </router-link>
        </li>
        <li>
          <a href="#submenu3" data-bs-toggle="collapse" class="nav-link px-0 align-middle">
            <i class="fs-4 bi-grid"></i>
            <span class="ms-1 d-none d-sm-inline">Недавние заметки</span>
          </a>
          <ul class="collapse show nav flex-column ms-1" id="submenu3" data-bs-parent="#menu">
            <li v-if="isLoadingMainNotesInfo">
              <div class="d-flex justify-content-center">
                <div class="spinner-border" role="status">
                  <span class="visually-hidden">Loading...</span>
                </div>
              </div>
            </li>
            <li v-else
                v-for="note in computedUserMainNotesInfo"
                v-bind:key="note.id"
                class="w-100">
              <router-link v-bind:to="'/note/' + note.guid"
                 v-bind:class="note.selectedOnPage ? 'nav-link px-0 disabled' : 'nav-link px-0'"
              >
                <span class="d-none d-sm-inline">{{ note.title }}</span>
              </router-link>
            </li>
          </ul>
        </li>
      </ul>
      <hr>
      <div class="dropdown pb-4">
        <a href="#" class="d-flex align-items-center text-white text-decoration-none dropdown-toggle" id="dropdownUser1" data-bs-toggle="dropdown" aria-expanded="false">
          <img src="https://github.com/mdo.png" alt="hugenerd" width="30" height="30" class="rounded-circle">
          <span class="d-none d-sm-inline mx-1">loser</span>
        </a>
        <ul class="dropdown-menu dropdown-menu-dark text-small shadow" aria-labelledby="dropdownUser1">
          <li>
            <a class="dropdown-item"
               href="#"
               v-on:click.stop.prevent="logout()"
            >
              Выход
            </a>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import {authService} from "@/service/authservice";
import {mapMutations, mapState} from 'vuex'
import {SET_LOADING_MAIN_USER_NOTES_INFO, SET_MAIN_USER_NOTES_INFO} from "@/configuration/store/mutation-types";
import {showToastMixin} from "@/mixins/showToastMixin";
import {noteService} from "@/service/noteservice";
import {ROUTER_NOTE_PAGE_NAME, ROUTER_NOTE_PAGE_UUID_PARAM_NAME} from "@/const/app";

export default {
  name: 'HelloWorld',
  mixins: [
      showToastMixin
  ],
  data() {
    return {
      forceRecomputeUserNotesInfo: false,
    }
  },
  mounted() {
    this.$nextTick(function () {
      this.loadUserMainNotesInfo()
    })
  },
  watch: {
    $route(to) {
      const currentPageName = to.name
      if (currentPageName === ROUTER_NOTE_PAGE_NAME) {
        this.forceRecomputeUserNotesInfo = !this.forceRecomputeUserNotesInfo
      }
    }
  },
  computed: {
    ...mapState({
      userMainNotesInfo: state => state.userMainNotesInfo,
      isLoadingMainNotesInfo: (state) => state.isLoadingMainNotesInfo
    }),
    computedUserMainNotesInfo() {
      // для принудительного обновления свойства после изменения страницы
      this.forceRecomputeUserNotesInfo

      if (this.isLoadingMainNotesInfo) {
        return []
      }

      const computedNotesInfo = []
      for (let noteInfo of this.userMainNotesInfo) {
        const computedNoteInfo = Object.assign(
            {}, noteInfo, { selectedOnPage: this.isSelectedNotePage(noteInfo.guid)}
        )
        computedNotesInfo.push(computedNoteInfo)
      }
      return computedNotesInfo
    }
  },
  methods: {
    ...mapMutations({
      setMainUserNotes: SET_MAIN_USER_NOTES_INFO,
      setLoadingMainUserNotesInfo: SET_LOADING_MAIN_USER_NOTES_INFO
    }),
    async loadUserMainNotesInfo() {
      try {
        this.setLoadingMainUserNotesInfo(true)
        const notes = await noteService.getCurrentUserMainNotesInfo()
        this.setMainUserNotes(notes)
      } catch (e) {
        this.showUnexpectedErrorToast(e)
      } finally {
        this.setLoadingMainUserNotesInfo(false)
      }
    },
    async logout() {
      try {
        await authService.logout()
      } catch (e) {
        // TODO - загрузка списка заметок
        this.showUnexpectedErrorToast(e)
      } finally {
        /* Веб часть зависит от куки auth - она точно удаляется */
        await this.$router.push("/login")
      }
    },
    isSelectedNotePage(noteGuid) {
      const currentPageName = this.$route.name
      if (currentPageName === ROUTER_NOTE_PAGE_NAME) {
        const currentPageNoteUuid = this.$route.params[ROUTER_NOTE_PAGE_UUID_PARAM_NAME]
        return currentPageNoteUuid === noteGuid
      } else {
        return false
      }
    },
  }
}
</script>