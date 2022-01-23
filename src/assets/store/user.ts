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

const user = reactive({
  token: window.localStorage.getItem('token'),
  default: false,
  // 昵称
  name: '',
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
  engineList: [] as Engine[],
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
}

if (!user.token) {
  api.post('/v3/userDefault.get').then((res) => {
    const data = res.data
    user.default = true
    initUser(data)
  })
}

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
export default {
  ...toRefs(user),
  login,
}
