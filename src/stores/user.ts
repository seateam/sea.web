import { defineStore } from "pinia";
import api from "/src/assets/js/api";

// https://stackblitz.com/github/piniajs/example-vue-3-vite
const initUser = () => {
  return {
    name: "Eduardo",
  };
};

export const useUserStore = defineStore({
  id: "user",
  state() {
    return initUser();
  },
  actions: {
    exit() {
      this.$patch(initUser());
    },
    async login() {
      const res = await api.post("/v3/userDefault.get");
      if (res.ok) {
        this.$patch(res.data);
      }
    },
  },
});
