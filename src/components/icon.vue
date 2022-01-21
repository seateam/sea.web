<template>
    <svg class="iconfont" :class="`icon-${name}`" aria-hidden="true">
        <use :xlink:href="`#icon-${props.name}`" />
    </svg>
</template>
<script setup>
const props = defineProps({
    name: String,
});
</script>