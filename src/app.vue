<template>
  <main class="sea-page" :class="pageClass">
    <router-view />
  </main>
</template>

<script setup lang="ts"></script>
<script lang="ts">
export default {
  computed: {
    pageClass() {
      const path = this.$route.path as string
      const name = path.slice(1).replace(/\//g, '-') || 'index'
      return `page-${name}`
    },
  },
}
</script>

<style lang="scss">
.sea-page {
  padding: 0 20px 20px;
  width: 100%;
  min-height: 100vh;
  display: flex;
  align-items: center;
  flex-direction: column;
  text-align: center;

  > * {
    margin-top: 20px !important;
  }
}
</style>
