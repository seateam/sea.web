<template>
  <div id="Index">
    <div class="logo">
      <div
        class="btn left"
        @click="bindPrev"
        :style="{ visibility: engineIndex <= 0 ? 'hidden' : 'visible' }"
      >
        <icon name="back" />
      </div>
      <div
        @click="bindLogo"
        class="center"
        :class="{ outwall: engineNow.outwall && !GreatWallOut }"
      >
        <icon-app :name="engineNow.icon || 'shalou'" />
        <span>{{ engineNow.name }}</span>
      </div>
      <div
        class="btn right"
        @click="bindNext"
        :style="{ visibility: engineIndex >= engineArr.length - 1 ? 'hidden' : 'visible' }"
      >
        <icon name="next" />
      </div>
    </div>
    <div class="search">
      <div ref="sug"></div>
      <input
        ref="search"
        type="text"
        v-model="keyword"
        @keydown="bindKeyDown"
        @keyup="bindKeyUp"
        @input="bindInput"
        @focus="bindFocus"
        @blur="bindBlur"
        :class="{ active: inputFocus && sugArr.length }"
        :placeholder="engineNow.placeholder || ''"
        autofocus
      />
      <div class="clear" v-show="keyword || showSug" @mousedown.prevent="bindClear">
        <icon name="close" />
      </div>
      <div class="btn" @click="bindSearch(null)">
        <icon name="search" />
      </div>
    </div>
    <div class="sug" v-show="showSug" @mouseout="sugNow = null">
      <div
        @mouseover="sugNow = i"
        class="one"
        :class="{ active: sugNow === i }"
        v-for="(e, i) in sugArr"
        @mousedown.prevent="bindSearch(e)"
        :key="i"
      >
        {{ e }}
      </div>
    </div>
    <div class="user-engines">
      <div
        class="engine drag"
        :class="{ active: engineNow.id === engine.id }"
        :style="{ color: engineNow.id === engine.id ? engine.color : '' }"
        v-for="(engine, i) in engines"
        :key="engine.id"
        @click="bindEngine(i)"
      >
        <icon-app :name="engine.icon || 'shalou'" />
        <span>{{ engine.name }}</span>
      </div>
      <div class="engine add" @click="bindEngineAdd">+</div>
      <div class="engine empty"></div>
      <div class="engine empty"></div>
      <div class="engine empty"></div>
      <div class="engine empty"></div>
      <div class="engine empty"></div>
      <div class="engine empty"></div>
      <div class="cloud" v-if="user || userDefault" v-show="!showSug">
        <!-- <Task mode="task" /> -->
      </div>
    </div>
    <!-- <EngineStore v-if="user || userDefault" :show="engineStoreShow" @updateEngine="updateEngine" /> -->
  </div>
</template>

<script lang="ts">
import Sea from '../../assets/js/bigsea'
declare global {
  interface Window {
    sogou: any
  }
}
export default {
  name: 'Index',
  components: {
    // Task: () => import('@/pages/index/task.vue'),
    // EngineStore: () => import('@/pages/index/engineStore.vue'),
  },
  computed: {
    GreatWallOut() {
      return this.$store.state.GreatWallOut
    },
    showSug() {
      return this.inputFocus && this.sugArr.length
    },
    user() {
      return this.$store.state.user
    },
    userDefault() {
      return this.$store.state.userDefault
    },
    engineArr() {
      return this.$store.state.engineArr
    },
    engineNow() {
      return this.engineArr[this.engineIndex]
    },
    engineIndex() {
      return this.$store.state.engineIndex
    },
  },
  data() {
    return {
      inputFocus: false,
      sugArr: [],
      sugNow: null,
      keyword: '',
      // 禁用任务
      disabledTask: false,
      // 搜索引擎商店
      engineStoreShow: '',
      engines: this.$store.state.engineArr,
    }
  },
  methods: {
    bindUpdate() {
      this.contextMenuDragEnd()
      this.enginesSave()
    },
    bindEngine(index) {
      this.$store.state.engineArr = this.engines
      this.$store.state.engineIndex = index
    },
    bindEngineAdd() {
      // 检查登录
      // if (Sea.Vue.login()) return
      this.engineStoreShow = Date.now() + ',engineAdd'
    },
    // 上一个搜索引擎
    bindPrev() {
      this.$store.state.engineIndex = this.engineIndex - 1
    },
    // 下一个搜索引擎
    bindNext() {
      this.$store.state.engineIndex = this.engineIndex + 1
    },
    bindClear() {
      this.$store.state.keyword = ''
      this.keyword = ''
      this.sugArr = []
      this.sugNow = null
    },
    bindSearch(value) {
      let keyword = encodeURIComponent(value || this.keyword)
      const engine = this.engineNow
      let url = ''
      if (this.$store.state.isPC) {
        url = engine.pc
        // 有关键字
        if (keyword) {
          url = url.replace(Sea.re('#{keyword}'), keyword)
        } else {
          url = engine.home_pc || new URL(url).origin
        }
      } else {
        url = engine.mobile || engine.pc
        // 有关键字
        if (keyword) {
          url = url.replace(Sea.re('#{keyword}'), keyword)
        } else {
          url = engine.home_mobile || new URL(url).origin
        }
      }
      if (!engine.pc && engine.app) {
        this.$alert('该引擎只有APP端可用', '提示', {
          confirmButtonText: '确定',
        })
        return
      }
      Sea.open(url)
    },
    bindKeyDown(event) {
      // 解决光标bug
      if (event.keyCode === 38) {
        event.preventDefault()
      }
    },
    bindKeyUp(event) {
      let code = event.keyCode
      let now = this.sugNow === null ? -1 : this.sugNow
      let len = this.sugArr.length
      if (code === 13) {
        // 回车
        this.bindSearch()
      } else if (code === 38) {
        // 上
        this.sugNow = (now + len - 1) % len
        this.keyword = this.sugArr[this.sugNow]
        // 下
      } else if (code === 40) {
        this.sugNow = (now + len + 1) % len
        this.keyword = this.sugArr[this.sugNow]
      }
    },
    bindInput() {
      const value = this.keyword
      if (!value) {
        this.sugArr = []
        this.sugNow = null
        return
      }
      // 缓存关键字
      this.$store.state.keyword = value
      const url = 'https://www.sogou.com/suggnew/ajajjson?type=web&key=' + encodeURI(value)
      const script = document.createElement('script')
      script.src = url
      const sug = Sea(this.$refs.sug)
      sug.child().remove()
      sug.appendChild(script)
    },
    bindFocus() {
      this.inputFocus = true
      if (this.keyword && this.sugArr.length === 0) {
        this.bindInput()
      }
    },
    bindBlur() {
      this.inputFocus = false
    },
    bindLogo() {
      this.engineStoreShow = Date.now() + ',logo'
    },
    updateEngine(engine) {
      // 添加常用搜索引擎
      let type = this.engineStoreShow.split(',')[1]
      if (type === 'engineAdd') {
        if (this.engines.find((e) => e.id === engine.id)) {
          this.$message.info('已经有了')
        } else {
          this.engines.push(engine)
          this.enginesSave()
        }
      } else {
        if (this.$refs.search) {
          this.$refs.search.select()
        }
      }
    },
    bindEngineDel() {
      // 检查登录
      // if (Sea.Vue.login()) return
      const l = this.engines.length
      // 最后一个
      if (l === 1) {
        this.$message.info('最后一个，星星之火，可以燎原。')
        this.contextMenuHide()
        return
      }
      const i = this.contextMenuData
      const index = this.engineIndex
      // 前面减一 & 删除最后一个
      if (index > i || index === l - 1) {
        this.$store.state.engineIndex = index - 1
        // 后面啥也不干
      }
      // 删除
      this.engines.splice(i, 1)
      this.contextMenuHide()
      this.enginesSave()
    },
    enginesSave() {
      // if (Sea.Vue.login()) return
      const engine = Sea.deepCopy(this.engines).map((e) => e.id)
      Sea.Ajax({
        method: 'post',
        url: '/v3/user.engine',
        data: {
          engine: engine,
        },
      }).then((res) => {
        if (res.ok) {
          // this.$message.success(res.msg)
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    init() {
      this.keyword = this.$store.state.keyword || ''
      this.updateEngine()
    },
  },
  beforeCreate() {
    // 搜狗 jsonp 提示
    window.sogou = {
      sug: (data) => {
        const arr = data[1]
        this.sugArr = arr
        this.sugNow = null
      },
    }
  },
  async created() {
    // this.init()
    // // 验证登录
    // await this.$store.dispatch('actionUser')
    // const user = this.user || this.userDefault
    // this.engines = user.engine
    // this.bindEngine(0)
  },
}
</script>

<script setup></script>

<style lang="scss">
#Index {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  margin-bottom: 35px;

  .logo {
    margin-top: 54px;
    display: flex;
    align-items: center;

    .btn {
      cursor: pointer;
      padding: 4px 8px;
      color: #eee;
      margin-top: 2px;
    }

    .btn:hover {
      color: rgba(0, 0, 0, 0.24);
    }

    .left {
      margin-right: 8px;
    }

    .center {
      // transition: all 0.3s;
      cursor: pointer;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      // height: 55px;
      // line-height: 55px;
      // max-width: 211px;
      width: 211px;
      color: #666;
      border-radius: 2px;
      overflow: hidden;
      font-weight: lighter;

      .iconfont {
        font-size: 54px;
      }

      span {
        // font-size: 14px;
        line-height: 22px;
        // font-weight: normal;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      // 图片 logo
      img {
        box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.25);
        width: 100%;
        max-height: 100%;
      }
    }

    .center.outwall {
      opacity: 0.6;
    }

    .center:hover {
      opacity: 1;
      color: #333;
    }

    .right {
      margin-left: 8px;
    }
  }

  .search {
    position: relative;
    width: 100%;
    height: 44px;
    margin-top: 30px;

    input {
      transition: all 0.3s;
      width: 100%;
      height: 100%;
      border: 1px solid #eee;
      outline: 0;
      padding: 10px;
      padding-right: 74px;
      background: #fff;
      border-radius: 6px;
      box-shadow: 0;
    }

    input.active {
      border-radius: 2px 2px 0px 0px;
      border-color: rgba(0, 0, 0, 0.44);
    }

    input:hover {
      border-color: rgba(0, 0, 0, 0.24);
    }

    input:focus {
      border-color: rgba(0, 0, 0, 0.44);
    }

    .btn,
    .clear {
      transition: color 0.4s;
      cursor: pointer;
      position: absolute;
      right: 0;
      top: 0;
      height: 100%;
      display: flex;
      align-items: center;
      color: #0f60ab;
      padding: 0 10px 0 5px;
      margin-left: 5px;
      margin-right: 6px;

      svg {
        width: 22px;
        height: 22px;
      }
    }

    .btn:hover {
      color: #666;
    }

    .btn:active {
      color: #000;
    }

    .clear {
      margin-right: 60px;
      color: rgba(0, 0, 0, 0.24);
      padding: 0;

      svg {
        width: 12px;
        height: 12px;
      }
    }

    .clear:hover {
      color: rgba(0, 0, 0, 0.64);
    }
  }

  .sug {
    width: 100%;
    border: 1px solid rgba(0, 0, 0, 0.44);
    border-top: 0;
    border-radius: 0px 0px 2px 2px;
    padding: 5px 0;
    margin-bottom: 5px;
    color: #666;
    overflow: hidden;

    .one {
      cursor: pointer;
      display: flex;
      align-items: center;
      padding: 5px 10px;
      margin-top: 5px;
    }

    .one.active {
      background: #0f60ab;
      color: #fff;
    }
  }

  .user-engines {
    display: flex;
    justify-content: space-around;
    flex-wrap: wrap;
    padding: 7px 0;

    .engine {
      cursor: pointer;
      width: 80px;
      padding: 7px 0;
      text-align: center;
      color: rgba(0, 0, 0, 0.6);

      .iconfont {
        font-size: 20px;
      }

      span {
        font-size: 12px;
        margin-top: 8px;
        display: block;
      }
    }

    .engine:hover {
      background: rgba(0, 0, 0, 0.02);
    }

    .engine.active {
      color: #0f60ab;
    }

    .engine.empty {
      visibility: hidden;
      margin: 0;
      padding: 0;
    }

    .engine.add {
      color: rgba(0, 0, 0, 0.3);
      font-weight: 500;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .engine.add:hover {
      color: #0f60ab;
    }
  }

  .cloud {
    width: 100%;
    padding: 4px 0;
  }
}
</style>
