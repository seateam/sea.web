<template>
  <div class="sea-header">
    <span v-if="props.title" class="title">{{ props.title }}</span>
  </div>
</template>
<script setup>
const props = defineProps({
  title: String,
});
</script>
