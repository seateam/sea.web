import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import ElementPlus from 'element-plus'
import routes from 'virtual:generated-pages'
import pinia from '~/assets/js/pinia'
import vuex from '~/assets/js/vuex'
import App from '~/app.vue'

import '~/assets/css/element.scss'
import '~/assets/css/main.scss'

const router = createRouter({ history: createWebHistory(), routes })
const app = createApp(App)

app.use(router).use(pinia).use(vuex).use(ElementPlus).mount('#app')
