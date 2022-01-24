<template>
  <div id="index">
    <Header></Header>
    <!-- <h1>大海个人助理</h1> -->
    <!-- <div class="route">
      <router-link to="/note">笔记</router-link>
      <router-link to="/mark">书签</router-link>
    </div>
    <el-button type="primary" @click="bindUserDefault">默认用户：{{ name }}</el-button>
    <el-button @click="bindEngineList">搜索引擎商店</el-button>
    <el-input v-model="account"></el-input>
    <el-input v-model="password" type="password"></el-input>
    <el-button type="success" @click="bindLogin">登录</el-button>
    <el-input v-model="token"></el-input>
    <el-button type="warning" @click="bindUser">用户</el-button> -->
    <div class="logo">
      <div
        class="btn left"
        @click="bindPrev"
        :style="{ visibility: engineIndex <= 0 ? 'hidden' : 'visible' }"
      >
        <icon name="back" />
      </div>
      <!-- <div
        @click="bindLogo"
        class="center"
        :class="{ outwall: engineNow.outwall && !GreatWallOut }"
      >
        <icon-app :name="engineNow.icon || 'shalou'" />
        <span>{{ engineNow.name }}</span>
      </div> -->
      <!-- <div
        class="btn right"
        @click="bindNext"
        :style="{ visibility: engineIndex >= engineArr.length - 1 ? 'hidden' : 'visible' }"
      >
        <icon name="next" />
      </div> -->
    </div>
    <div class="search">
      <div ref="sug"></div>
      <!-- <input
        ref="search"
        type="text"
        v-model="data.keyword"
        @keydown="bindKeyDown"
        @keyup="bindKeyUp"
        @input="bindInput"
        @focus="bindFocus"
        @blur="bindBlur"
        :class="{ active: data.inputFocus && data.sugArr.length }"
        :placeholder="engineNow.placeholder || ''"
        autofocus
      /> -->
      <!-- <div class="clear" v-show="data.keyword || showSug" @mousedown.prevent="bindClear">
        <icon name="close" />
      </div>
      <div class="btn" @click="bindSearch(null)">
        <icon name="search" />
      </div> -->
    </div>
  </div>
</template>

<script setup lang="ts">
import icon from '../components/icon.vue'
  import Header from './header.vue'
  import draggable from 'vuedraggable'
  import api from '../assets/js/api'

  import { useStore } from 'vuex'
  import { useRouter, useRoute } from 'vue-router'
  const store = useStore()
  const router = useRouter()
  const route = useRoute()

  let data = reactive({
    inputFocus: false,
    sugArr: [],
    sugNow: null,
    keyword:  '',
        // 禁用任务
    disabledTask: false,
        // 搜索引擎商店
    engineStoreShow: '',
    engines: store.state.engineArr,
  })
  


  const GreatWallOut = computed(() =>  {
    return store.state.GreatWallOut
  })
  const showSug = computed(() =>  {
    return data.inputFocus && data.sugArr.length
  })
  const user = computed(() =>  {
    return store.state.user
  })
  const userDefault = computed(() =>  {
    return store.state.userDefault
  })
  const engineArr = computed(() =>  {
    return store.state.engineArr
  })
  const engineIndex = computed(() =>  {
    // console.log(typeof store.state.engineIndex, '=========')
    return store.state.engineIndex
  })
  // console.log(engineIndex.value, '=========')
  // let index = Number(engineIndex.value)
  // let index:Number = 0
  const engineNow = computed(() =>  {
    console.log(engineArr)
    // return engineArr[engineIndex]
  })

  const bindPrev = () => {

  }
  const bindLogo  = () => {

  }
  
  // 下一个搜索引擎
  const bindNext = () => {
    // store.state.engineIndex = engineIndex + 1
  }
  const bindClear = () => {
    store.state.keyword = ''
    data.keyword = ''
    data.sugArr = []
    data.sugNow = null
  }
  const bindSearch = (value: any) => {
    let keyword = encodeURIComponent(value || data.keyword)
    const engine = engineNow
    let url = ''
    // if (store.state.isPC) {
    //   url = engine.pc
    //   // 有关键字
    //   if (keyword) {
    //     url = url.replace(Sea.re('#{keyword}'), keyword)
    //   } else {
    //     url = engine.home_pc || new URL(url).origin
    //   }
    // } else {
    //   url = engine.mobile || engine.pc
    //   // 有关键字
    //   if (keyword) {
    //     url = url.replace(Sea.re('#{keyword}'), keyword)
    //   } else {
    //     url = engine.home_mobile || new URL(url).origin
    //   }
    // }
    // if (!engine.pc && engine.app) {
    //   this.$alert('该引擎只有APP端可用', '提示', {
    //     confirmButtonText: '确定',
    //   })
    //   return
    // }
    // Sea.open(url)
  }
  const bindKeyDown = (event: any) => {
    // 解决光标bug
    if (event.keyCode === 38) {
      event.preventDefault()
    }
  }
  const bindKeyUp = (event: any) => {
    let code = event.keyCode
    let now = data.sugNow === null ? -1 : data.sugNow
    let len = data.sugArr.length
    // if (code === 13) {
    //   // 回车
    //   bindSearch(null)
    // } else if (code === 38) {
    //   // 上
    //   data.sugNow = (now + len - 1) % len
    //   data.keyword = data.sugArr[data.sugNow]
    //   // 下
    // } else if (code === 40) {
    //   data.sugNow = (now + len + 1) % len
    //   data.keyword = data.sugArr[data.sugNow]
    // }
  }
  const bindInput = () => {
    const value = data.keyword
    if (!value) {
      data.sugArr = []
      data.sugNow = null
      return
    }
    // 缓存关键字
    store.state.keyword = value
    const url = 'https://www.sogou.com/suggnew/ajajjson?type=web&key=' + encodeURI(value)
    const script = document.createElement('script')
    script.src = url
    // const sug = Sea(this.$refs.sug)
    // sug.child().remove()
    // sug.appendChild(script)
  }
  const bindFocus = () => {
    data.inputFocus = true
    if (data.keyword && data.sugArr.length === 0) {
      bindInput()
    }
  }
  const bindBlur = () => {
    data.inputFocus = false
  }
  
</script>
<!-- <script lang="ts">
import api from '../assets/js/api'
export default {
  data() {
    return {
      account: '',
      password: '',
      token: '',
    }
  },
  methods: {
    async bindUserDefault() {
      const res = await api.request({
        method: 'POST',
        url: '/v3/userDefault.get',
      })
      console.log('🌊', res)
    },
    async bindEngineList() {
      const res = await api.request({
        method: 'POST',
        url: '/v3/engine.list',
      })
      console.log('🌊', res)
    },
    async bindLogin() {
      const res = await api.request({
        method: 'POST',
        url: '/v3/user.login',
        data: {
          account: this.account,
          password: this.password,
        },
      })
      console.log('🌊', res)
      this.token = res.token
    },
    async bindUser() {
      const res = await api.request({
        method: 'POST',
        url: '/v3/user.get',
        data: {
          token: this.token,
        },
      })
      console.log('🌊', res)
    },
  },
}
</script> -->

<!-- <style lang="scss">
.page-index {
  h1 {
    background-image: linear-gradient(45deg, var(--primary), var(--danger));
    background-clip: text;
    color: transparent;
    font-weight: 300;
  }
  .route {
    a + a {
      margin-left: 20px;
    }
  }
}
</style> -->
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
