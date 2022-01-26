import api from '../js/api'
import { Engine } from './engine'

interface Mark {
  color: string
  name: string
  url: string
}
interface MarkList {
  arr: Mark[]
  name: string
}
interface Note {
  id: 49
  title: string
}
interface NoteList {
  arr: Note[]
  name: string
}

const user = reactive({
  // token
  token: window.localStorage.getItem('token'),
  // 是否默认用户
  default: true,
  // 昵称
  name: '',
  // id
  id: 0,
  // 座右铭
  motto: false,
  // 历史任务
  taskHistory: [] as string[],
  // 当前任务
  taskList: [] as string[],
  // 头像
  avatar: '',
  // 书签
  markList: [] as MarkList[],
  // 搜索引擎
  engineList: [
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
  ] as Engine[],
  engineIndex: 0,
  // 墙外 读取本地存储
  GreatWallOut: window.localStorage.getItem('GreatWallOut') || false,
  // 标签页
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
  // 标题
  title: '',
  // 音乐
  song: '',
  songPlaying: false,
  // 笔记
  noteList: [] as NoteList[],
  // 微信
  wx: {
    name: '',
    openid: '',
  },
})
const initUser = (data: any) => {
  user.name = data.name
  user.id = data.id
  user.motto = data.motto
  user.taskHistory = data.task_history
  user.taskList = data.task_list
  user.avatar = data.avatar
  user.engineList = data.engine
  user.markList = data.book
  user.noteList = data.note
  user.wx.name = data.wx_name
  user.wx.openid = data.wx_openid
}
// 登录
const login = async (account: string, password: string) => {
  let res
  res = await api.post('/v3/user.login', {
    account,
    password,
  })
  user.token = res.token
  window.localStorage.setItem('token', res.token)
  res = await api.post('/v3/user.get', {
    token: user.token,
  })
  initUser(res.data)
}
// 初始化
const init = () => {
  if (user.token) {
    api
      .post('/v3/user.get')
      .then((res) => {
        user.default = false
        initUser(res.data)
      })
      .catch(() => {
        window.localStorage.removeItem('token')
        user.token = ''
        init()
      })
  } else {
    api.post('/v3/userDefault.get').then((res) => {
      initUser(res.data)
    })
  }
}
init()

export default {
  ...toRefs(user),
  login,
}
