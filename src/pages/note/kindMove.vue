<template>
  <div id="KindMove">
    <el-dialog
      title="移动分类"
      v-model="dialogShow"
      :append-to-body="true"
      custom-class="KindMove-dialog"
    >
      <div class="kinds">
        <div class="kind" v-for="(e, i) in kind" :key="i" :data-i="i" @click="bindKind">
          {{ e.name }}
        </div>
        <div class="kind add"></div>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts">
export default {
  name: 'KindMove',
  props: ['show', 'kind'],
  data() {
    return {
      dialogShow: false,
    }
  },
  computed: {
    user() {
      return this.$store.getters.getUser
    },
  },
  methods: {
    bindKind(event) {
      const i = Number(event.target.dataset.i)
      this.$emit('save', i)
      this.dialogShow = false
    },
  },
  created() {},
  mounted() {},
  watch: {
    show() {
      this.dialogShow = true
    },
  },
}
</script>
<script setup lang="ts"></script>

<style lang="scss">
.KindMove-dialog {
  width: calc(100% - 40px);
  margin-top: 52px !important;

  .el-dialog__header {
    display: none;
  }

  .el-dialog__body {
    padding: 0;
  }

  .kinds {
    display: flex;
    flex-wrap: wrap;
    padding-top: 10px;
    padding-bottom: 10px;

    .kind {
      cursor: pointer;
      padding: 10px 4px;
      width: 33.333%;
      text-align: center;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .kind.active,
    .kind:hover {
      color: #0f60ab;
    }
  }
}
</style>
