<template>
  <h1>大海个人助理</h1>

  <router-link to="/note">笔记</router-link>

  <el-button type="primary" @click="bindName">{{ name }}</el-button>
</template>

<script setup lang="ts"></script>
<script lang="ts">
export default {
  data() {
    return {
      name: '哇哈哈',
    }
  },
  methods: {
    bindName() {
      this.$message.info('点击了哇哈哈')
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
}
</style>
