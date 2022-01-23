import api from '../js/api'

export interface Engine {
  app: string
  color: string
  home_mobile: string
  home_pc: string
  icon: string
  id: number
  mobile: string
  name: string
  outwall: boolean
  pc: string
  tags: string[]
}
const engine = reactive({
  list: [] as Engine[],
})

api.post('/v3/engine.list').then((res) => {
  engine.list = res.data
})
export default {
  ...toRefs(engine),
}
