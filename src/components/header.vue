<template>
  <header class="unipass-header">
    <div class="header-box">
      <div class="left">
        <i class="iconfont icon-back"></i>
        <span v-if="props.title" class="title">{{ props.title }}</span>
        <slot name="left"></slot>
      </div>
      <div class="right">
        <slot name="right"></slot>
      </div>
    </div>
  </header>
</template>
<script setup lang="ts">
const props = defineProps({
  title: String,
});
</script>
<style lang="stylus"></style>
