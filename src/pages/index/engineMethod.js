import Pinyin from 'pinyin'
export default {
  data() {
    return {
      enginesFormat: [],
      enginesKeyword: '',
      enginesTags: [],
      enginesTagsIndex: 0,
    }
  },
  computed: {
    engineStore() {
      return this.$store.state.engineStore || []
    },
    user() {
      return this.$store.state.user || this.$store.state.userDefault
    },
    GreatWallOut() {
      return this.$store.state.GreatWallOut
    },
  },
  methods: {
    initPinyin(name, i) {
      const result = [
        {
          name: name,
          index: i,
        },
      ]
      // 拼音
      const pinyin = Pinyin(name, {
        style: Pinyin.STYLE_NORMAL, // 设置拼音风格
        heteronym: true, // 启用多音字
      })
      let arr = []
      arr = this.combine(pinyin)
      let arr2 = []
      for (const e of arr) {
        arr2.push(e.join(''))
        // 首字母组合
        arr2.push(e.map(e2 => e2[0]).join(''))
      }
      for (const e of arr2) {
        result.push({
          name: e.toLowerCase(),
          index: i,
        })
      }
      return result
    },
    initEngines() {
      // 初始化标签
      this.initEnginesTags()
      const engineStore = this.$store.state.engineStore || []
      const engines = engineStore || []
      const result = []
      for (let i = 0; i < engines.length; i++) {
        const engine = engines[i]
        const name = engine.name
        // 名称 拼音 + 中文 + 首字母
        const arr = this.initPinyin(name, i)
        result.push(...arr)
        // 标签 拼音 + 中文
        for (const tag of engine.tags || []) {
          const arr = this.initPinyin(tag, i)
          result.push(...arr)
        }
      }
      this.enginesFormat = result
    },
    initEnginesTags() {
      const engineStore = this.$store.state.engineStore || []
      const engines = engineStore || []
      const arr = []
      for (const engine of engines) {
        if (engine.tags) {
          for (const tag of engine.tags) {
            if (!arr.includes(tag)) {
              arr.push(tag)
            }
          }
        }
      }
      this.enginesTags = arr
    },
    // 排列组合算法
    combine(arr) {
      let count = arr.length - 1 //数组长度(从0开始)
      let temp = []
      // 总数组
      let totalArr = []
      // js 没有静态数据，为了避免和外部数据混淆，需要使用闭包的形式
      let combineCallback = function(arr, curr_index) {
        for (const val of arr[curr_index]) {
          // 以 curr_index 为索引，加入数组
          temp[curr_index] = val
          // 当前循环下标小于数组总长度，则需要继续调用方法
          if (curr_index < count) {
            // 继续调用
            combineCallback(arr, curr_index + 1)
          } else {
            // 直接给push进去，push进去的不是值，而是值的地址
            totalArr.push(temp)
          }

          // js 对象都是 地址引用(引用关系)，每次都需要重新初始化，否则 totalArr的数据都会是最后一次的 tmp 数据；
          const oldTemp = temp
          temp = []
          for (const index of oldTemp) {
            temp.push(index)
          }
        }
        return totalArr
      }
      // 从第一个开始
      return combineCallback(arr, 0)
    },
  },
}
