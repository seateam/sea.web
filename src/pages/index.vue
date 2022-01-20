<template>
  <h1>大海个人助理</h1>
  <div class="route">
    <router-link to="/note">笔记</router-link>
    <router-link to="/mark">书签</router-link>
  </div>
  <el-button type="primary" @click="bindUserDefault">默认用户</el-button>
  <el-button @click="bindEngineList">搜索引擎商店</el-button>
  <el-input v-model="account"></el-input>
  <el-input v-model="password" type="password"></el-input>
  <el-button type="success" @click="bindLogin">登录</el-button>
  <el-input v-model="token"></el-input>
  <el-button type="warning" @click="bindUser">用户</el-button>
</template>

<script setup lang="ts"></script>
<script lang="ts">
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
</script>

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
