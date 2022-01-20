<template>
    <h1>首页</h1>
    <h2>
        <router-link to="/wahaha">{{ name }}</router-link>
    </h2>
    <el-button type="primary" @click="bindName">{{ name }}</el-button>
</template>

<script setup lang="ts"></script>
<script lang="ts">
export default {
    data() {
        return {
            name: '哇哈哈'
        }
    },
    methods: {
        bindName() {
            this.$message.info('点击了哇哈哈')
            this.$alert('点击了哇哈哈')
        }
    }
}
</script>
