<template>
    <svg class="iconfont" aria-hidden="true">
        <use :xlink:href="`#icon-app-${props.name}`" />
    </svg>
</template>
<script setup lang="ts">
const props = defineProps({
    name: String,
});
</script>

<style>
.iconfont {
    width: 1em;
    height: 1em;
    vertical-align: -0.15em;
    fill: currentColor;
    overflow: hidden;
}
</style>
