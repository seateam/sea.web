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
#app {
  display: flex;
  align-items: center;
  min-height: 100vh;

  .sea-page {
    background: var(--background);
    margin: 0 auto;
    padding: 0 20px 20px;
    width: 375px;
    height: 667px;
    display: flex;
    align-items: center;
    flex-direction: column;
    text-align: center;
    box-shadow: 0 1px 18px rgb(23 25 29 / 30%);
    overflow-y: auto;

    > * {
      margin-top: 20px !important;
    }
  }
}
</style>
