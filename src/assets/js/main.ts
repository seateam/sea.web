import { createApp } from "vue";
import { createPinia } from "pinia";
import { createRouter, createWebHistory } from "vue-router";
import routes from "virtual:generated-pages";

import App from "/src/app.vue";

import "/src/assets/css/main.scss";

const router = createRouter({ history: createWebHistory(), routes });
const app = createApp(App);

app.use(router).use(createPinia()).mount("#app");
