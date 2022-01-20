import { createStore } from "vuex";
// 浏览器
import Bowser from "bowser";
const browser = Bowser.getParser(window.navigator.userAgent).getResult();
// 创建一个新的 store 实例
const vuex = createStore({
  state() {
    return {
      browser,
    };
  },
  // 获取
  getters: {},
  // 同步更新
  mutations: {},
  // 异步更新
  actions: {},
  // 模块
  modules: {},
});
export default vuex;
