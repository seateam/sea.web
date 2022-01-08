<template>
  <router-link to="/about">About</router-link>
  <el-button @click="bindTest">Test Button</el-button>
</template>

<script setup lang="ts">
const bindTest = () => {
  console.log('🌊', 'Test')
}
</script>
