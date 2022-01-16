import { createStore } from 'vuex'
// 浏览器
import Bowser from 'bowser'
import api from './api'
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
      // 浏览器
      browser: browser,
      isPC: browser.platform.type !== 'mobile',
      // 收藏分类
      bookKind: 0,
      // 文章分类
      noteKind: 0,
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
      // 搜索引擎商店
      engineStore: null,
      // 用户
      user: null,
      // 默认用户
      userDefault: null,
      // 聊天记录
      chatHistory: null,
      // 墙外 读取本地存储
      GreatWallOut: window.localStorage.getItem('GreatWallOut') || false,
      // 标题
      title: '',
      // 拖动配置 https://zhuanlan.zhihu.com/p/84433257
      draggable: {
        disabled: true,
      },
      // 音乐
      song: null,
      songPlaying: false,
      // 微信绑定
      weixinUser: null,
    }
  },
  // 获取
  getters: {
    getUser(state: any) {
      return state.user
    },
    // 获取 uid
    getUserID(state) {
      const user = state.user
      if (user) {
        return user.id
      }
      return ''
    },
    // 获取名字
    getUserName(state: any) {
      const user = state.user
      if (user) {
        let nameDefault = `编号${user.id}`
        return user.name || nameDefault
      }
      return ''
    },
    // 获取头像
    getUserAvatar(state: any) {
      const user = state.user
      let avatar = import('../imgs/head.png')
      if (user && user.avatar) {
        avatar = user.avatar
      }
      return avatar
    },
  },
  // 同步更新
  mutations: {
    setUser(state: any, user) {
      state.user = user
    },
    setUserDefault(state: any, user) {
      state.userDefault = user
    },
  },
  // 异步更新
  actions: {
    // 获取搜索引擎商店
    async actionEngineStore({ commit, state }, refresh) {
      if (!refresh && state.engineStore) {
        return
      }
      let res
      res = await api.request({
        method: 'post',
        url: '/v3/engine.list',
      })
      // 登录成功
      if (res.ok) {
        state.engineStore = res.data
      }
    },
    // 设置 user
    async actionUser({ commit, state }, refresh) {
      if (!refresh && (state.user || state.userDefault)) {
        return
      }
      let res
      res = await api.request({ method: 'post', url: '/v3/user.get' })
      // 登录成功
      if (res.ok) {
        commit('setUser', res.data)
        commit('setUserDefault', null)
        return
      }
      // 默认用户
      res = await api.request({ method: 'post', url: '/v3/userDefault.get' })
      if (res.ok) {
        commit('setUser', null)
        commit('setUserDefault', res.data)
      }
    },
  },
  // 模块
  modules: {},
})
export default vuex
