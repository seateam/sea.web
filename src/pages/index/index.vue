<template>
    <h1>首页</h1>
    <h2>
        <router-link to="/wahaha" @click="bindName">{{ name }}</router-link>
    </h2>
</template>


<script lang="ts">
export default {
    data() {
        return {
            // name: '哇哈哈222'
        }
    },
    methods: {
        bindName() {
            console.log('🌊', '点击了哇哈哈')
        }
    }
}
</script>

<script setup lang="ts">
const name = 'wahaha'
const bindName = function () {
    console.log('🌊', '点击了哇哈哈')
}
onMounted(() => {
    console.log('🌊onMounted')
})
</script>