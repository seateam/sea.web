<template>
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
</template>

<script setup lang="ts">
  import Header from './header.vue'
  import draggable from 'vuedraggable'
  import api from '../assets/js/api'

  import { useStore } from 'vuex'
  import { useRouter, useRoute } from 'vue-router'
  const store = useStore()
  const router = useRouter()
  const route = useRoute()

  let inputFocus = false
  let sugArr = []
  let sugNow = null
  let keyword =  ''
      // 禁用任务
  let disabledTask = false
      // 搜索引擎商店
  let engineStoreShow = ''
  let engines = store.state.engineArr


  const GreatWallOut = computed(() =>  {
    return store.state.GreatWallOut
  })
  const showSug = computed(() =>  {
    return inputFocus && sugArr.length
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
    return store.state.engineIndex
  })
  const engineNow = computed(() =>  {
    // return engineArr[engineIndex]
  })

  const bindPrev = () => {

  }
  const bindLogo  = () => {

  }
  const bindNext  = () => {

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

<style lang="scss">
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
</style>
