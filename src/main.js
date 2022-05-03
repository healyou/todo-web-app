import { createApp } from 'vue'
import App from './App.vue'

import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap-icons/font/bootstrap-icons.css"
import "bootstrap"
import {router} from "@/configuration/router";
import store from "@/configuration/store/store";

const app = createApp(App)
app.use(router)
app.use(store)
app.mount('#app')