<template>
    <svg class="iconfont app" :class="`icon-app-${name}`" aria-hidden="true">
        <use :xlink:href="`#icon-app-${props.name}`" />
    </svg>
</template>
<script setup>
const props = defineProps({
    name: String,
});
</script>
