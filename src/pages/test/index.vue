<template>
  <h1>大海个人助理</h1>
  <div class="route">
    <router-link to="/note">笔记</router-link>
    <router-link to="/mark">书签</router-link>
  </div>
  <el-button @click="bindEngineList">搜索引擎商店</el-button>
  <el-input v-model="data.account"></el-input>
  <el-input v-model="data.password" type="password"></el-input>
  <el-button type="success" @click="bindLogin">登录</el-button>
  <el-input v-model="user.token.value" disabled></el-input>
</template>

<script lang="ts" setup>
import user from '../../assets/store/user'
import engine from '../../assets/store/engine'

const data = reactive({
  account: '',
  password: '',
})
const bindLogin = async () => {
  await user.login(data.account, data.password)
  console.log('🌊', toRaw(user.markList.value))
}
const bindEngineList = async () => {
  for (const e of engine.list.value) {
    console.log('🌊', toRaw(e))
    break
  }
}
</script>
<style lang="scss">
.page-test {
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
