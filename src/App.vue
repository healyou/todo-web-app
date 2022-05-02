<template>
  <div class="container-fluid">
    <div class="row flex-nowrap">

      <Sidebar v-if="isShowSidebar"/>
      <div class="col py-3">
        <router-view/>
      </div>
      <ToastContainer/>

    </div>
  </div>
</template>

<script>
import Sidebar from "@/components/Sidebar";
import ToastContainer from "@/components/ToastContainer";

export default {
  name: 'App',
  components: {
    Sidebar,
    ToastContainer
  },
  computed:{
    isShowSidebar(){
      return this.$route.meta.sidebar !== false
    }
  }
}
</script>