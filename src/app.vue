<template>
  <main class="sea-page">
    <app-header />
    <router-view />
  </main>
  <app-footer />
</template>

<script setup lang="ts"></script>
<script>
import AppHeader from './app-header.vue'
import AppFooter from './app-footer.vue'
export default {
  components: {
    AppHeader,
    AppFooter,
  },
}
</script>

<style lang="scss">
.sea-page {
  padding: 0 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
}
</style>
