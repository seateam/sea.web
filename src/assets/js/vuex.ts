import { createStore } from "vuex";
// 浏览器
import Bowser from "bowser";
const browser = Bowser.getParser(window.navigator.userAgent).getResult();
// 创建一个新的 store 实例
const vuex = createStore({
  state() {
    return {
      // 首页 tab
      tabs: [
        {
          name: '探索',
          path: '/',
        },
        {
          name: '记录',
          path: '/note',
        },
      ],
      browser,
      // 搜索引擎下标
      engineIndex: 0,
      
      // 音乐
      song: null,
      songPlaying: false,
    };
  },
  // 获取
  getters: {
    getUser(state: any) {
      return state.user
    },
    // 获取头像
    getUserAvatar(state: any) {
      const user = state.user
      let avatar = '/assets/imgs/head.png'
      if (user && user.avatar) {
        avatar = user.avatar
      }
      return avatar
    },
  },
  // 同步更新
  mutations: {},
  // 异步更新
  actions: {},
  // 模块
  modules: {},
});
export default vuex;
