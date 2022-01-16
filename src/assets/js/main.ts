import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import routes from 'virtual:generated-pages'

import pinia from './pinia'
import vuex from './vuex'

import App from '../../app.vue'

import '../css/main.scss'

const router = createRouter({ history: createWebHistory(), routes })
const app = createApp(App)

app.use(router).use(pinia).use(vuex).mount('#app')
