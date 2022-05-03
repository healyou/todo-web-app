<template>
  <div class="col-auto col-md-3 col-xl-2 px-sm-2 px-0 bg-dark">
    <div class="d-flex flex-column align-items-center align-items-sm-start px-3 pt-2 text-white min-vh-100">
      <a href="/" class="d-flex align-items-center pb-3 mb-md-0 me-md-auto text-white text-decoration-none">
        <span class="fs-5 d-none d-sm-inline">Menu</span>
      </a>
      <ul class="nav nav-pills flex-column mb-sm-auto mb-0 align-items-center align-items-sm-start" id="menu">
        <li class="nav-item">
          <a href="#" class="nav-link align-middle px-0">
            <i class="fs-4 bi-house"></i><span class="ms-1 d-none d-sm-inline">Home</span>
          </a>
        </li>
        <li>
          <a href="#submenu3" data-bs-toggle="collapse" class="nav-link px-0 align-middle">
            <i class="fs-4 bi-grid"></i>
            <span class="ms-1 d-none d-sm-inline">Заметки</span>
          </a>
          <ul class="collapse show nav flex-column ms-1" id="submenu3" data-bs-parent="#menu">
            <li v-if="isLoadingNotes">
              <div class="d-flex justify-content-center">
                <div class="spinner-border" role="status">
                  <span class="visually-hidden">Loading...</span>
                </div>
              </div>
            </li>
            <li v-else
                v-for="note in userNotes"
                v-bind:key="note.id"
                class="w-100">
              <a href="#" class="nav-link px-0">
                <span class="d-none d-sm-inline">{{ note.title }}</span>
              </a>
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
  <!-- Modal -->
  <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLabel">Modal title</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          ...
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
          <button type="button" class="btn btn-primary">Save changes</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {authService} from "@/service/authservice";
import {mapMutations, mapState} from 'vuex'
import {ADD_TOAST} from "@/configuration/store/mutation-types";
import {showToastMixin} from "@/components/mixins/showToastMixin";

export default {
  name: 'HelloWorld',
  mixins: [
      showToastMixin
  ],
  computed: {
    ...mapState({
      userNotes: state => state.userNotes,
      isLoadingNotes: (state) => state.isLoadingUserNotes
    })
  },
  methods: {
    ...mapMutations({
      addToast: ADD_TOAST
    }),
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
    }
  }
}
</script>