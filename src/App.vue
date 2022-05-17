<template>
  <div class="container-fluid">
    <div class="row flex-nowrap">

      <!-- Грузим Sidebar только тогда, когда он нужен -->
      <Suspense v-if="isShowSidebar">
        <template #default>
          <LazySidebar/>
        </template>
      </Suspense>
      <div class="col py-3">
        <router-view/>
      </div>
      <ToastContainer/>

    </div>
  </div>
</template>

<script>
import { defineAsyncComponent } from 'vue'
import ToastContainer from "@/components/ToastContainer";

const LazySidebar = defineAsyncComponent(() =>
    import("@/components/Sidebar")
)

export default {
  name: 'App',
  components: {
    LazySidebar,
    ToastContainer
  },
  computed:{
    isShowSidebar(){
      return this.$route.meta.sidebar !== false
    }
  }
}
</script>