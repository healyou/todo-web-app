<template>
  <div class="container-fluid">
    <div class="row flex-nowrap">

      <Sidebar v-if="isShowSidebar"/>
      <div class="col py-3">
        <router-view/>
      </div>

    </div>
  </div>
</template>

<script>
import Sidebar from "@/components/Sidebar";

export default {
  name: 'App',
  components: {
    Sidebar
  },
  computed:{
    isShowSidebar(){
      return this.$route.meta.sidebar !== false
    }
  }
}
</script>