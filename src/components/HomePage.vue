<template>
  <div v-if="isLoadingNotes" class="d-flex justify-content-center">
    <div class="spinner-border" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>
  </div>
  <div v-else>
    <h3>Left Sidebar with Submenus</h3>
    <p class="lead">
      An example 2-level sidebar with collasible menu items. The menu functions like an "accordion" where only a single
      menu is be open at a time. While the sidebar itself is not toggle-able, it does responsively shrink in width on smaller screens.</p>
    <ul class="list-unstyled">
      <li><h5>Responsive</h5> shrinks in width, hides text labels and collapses to icons only on mobile</li>
    </ul>
    <ul v-for="note in userNotes"
        v-bind:key="note.id"
        class="list-unstyled"
    >
      <li>{{ note }}</li>
    </ul>
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
  mounted() {
    this.$nextTick(function () {
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
    }
  }
}
</script>