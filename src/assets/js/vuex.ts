import { createStore } from 'vuex'
// 浏览器
import Bowser from 'bowser'
const browser = Bowser.getParser(window.navigator.userAgent).getResult()
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
      // 用户
      user: null,
      // 默认用户
      userDefault: null,
      // 搜索引擎
      engineArr: [
        {
          name: '大海',
          color: '#0F60AB',
          pc: 'https://www.sogou.com/web?query=#{keyword}',
          mobile: 'https://m.sogou.com/web/searchList.jsp?keyword=#{keyword}',
          id: 5,
          outwall: false,
          tags: ['综合'],
          icon: 'sea',
          app: '',
          home_pc: 'https://sogou.com/',
          home_mobile: 'https://m.sogou.com/',
        },
        {
          name: 'Google',
          color: '#4683ea',
          pc: 'https://www.google.com/search?q=#{keyword}',
          mobile: '',
          outwall: true,
          id: 1,
          tags: ['综合'],
          icon: 'google',
          app: '',
          home_pc: 'https://www.google.com/',
          home_mobile: '',
        },
        {
          name: '必应',
          color: '#409eff',
          pc: 'https://www.bing.com/search?q=#{keyword}&mkt=zh-CN',
          mobile: '',
          id: 2,
          outwall: false,
          tags: ['综合'],
          icon: 'biying',
          app: '',
          home_pc: 'https://www.bing.com/',
          home_mobile: '',
        },
      ],
      // 搜索引擎下标
      engineIndex: 0,
      // 标题
      title: '',
      // 拖动配置 https://zhuanlan.zhihu.com/p/84433257
      draggable: {
        disabled: true,
      },
      // 音乐
      song: null,
      songPlaying: false,
    }
  },
  // 获取
  getters: {
    getUser(state: any) {
      return state.user
    },
    // 获取头像
    getUserAvatar(state: any) {
      const user = state.user
      let avatar = '../img/head.png'
      if (user && user.avatar) {
        avatar = user.avatar
      }
      return avatar
    },
  },
  // 同步更新
  mutations: {
    setUser(state, user) {
      state.user = user
    },
    setUserDefault(state, user) {
      state.userDefault = user
    },
  },
  // 异步更新
  actions: {},
  // 模块
  modules: {},
})
export default vuex
