<template>
  <div id="Notes">
    <div class="kinds" :list="note">
      <div
        class="kind context-menu-hover"
        :class="{ active: noteNow === i }"
        v-for="(e, i) in note"
        :key="i"
        @click="$store.state.noteKind = i"
      >{{ e.name }}</div>
      <div class="kind add" slot="footer" @click="bindKindAdd">+</div>
    </div>
    <div class="notes" v-if="note[noteNow]" :list="note[noteNow].arr">
      <router-link
        v-for="(e, i) in note[noteNow].arr"
        :key="i"
        class="note"
        :style="{ color: e.color }"
        @click="bindNote($event, e)"
        :to="`/note/${e.id}`"
      >{{ e.title }}</router-link>
      <div class="note add" slot="footer" @click="bindNoteAdd">+</div>
    </div>
    <!-- 弹窗 移动分类  -->
    <KindMove :show="moveShow" :kind="note" @save="bindNoteMoveCallback" />
  </div>
</template>

<script>
import api from '../../assets/js/api'
import Sea from '../../assets/js/bigsea'
import KindMove from './data/kindMove.vueindMove.vue'
export default {
  name: 'Notes',
  components: { KindMove },
  data() {
    return {
      note: [],
      moveShow: false,
    }
  },
  computed: {
    noteNow() {
      return this.$store.state.noteKind
    },
    user() {
      return this.$store.getters.getUser
    },
  },
  methods: {
    bindKindRename() {
      // if (Sea.Vue.login()) return
      const i = this.contextMenuData
      const oldName = this.note[i].name
      this.$prompt(`名称：${oldName}`, '重命名', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /.+/,
        inputErrorMessage: '请输入新名称',
      })
        .then((data) => {
          this.note[i].name = data.value
          // 写入
          this.noteSave()
        })
        .catch(() => {
          this.$message.info('取消输入')
        })
    },
    bindKindDel() {
      // if (Sea.Vue.login()) return
      const i = this.contextMenuData
      const kind = this.note[i]
      if (kind.arr.length) {
        this.$message.info(`请先删除 ${kind.name} 分类下所有书签`)
        return
      }
      this.$store.state.noteKind = i - 1
      this.note.splice(i, 1)
      this.contextMenuHide()
      // 写入
      this.noteSave()
    },
    bindKindAdd() {
      // if (Sea.Vue.login()) return
      this.$prompt('请输入分类名称', '新分类', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /[\S\s]/,
        inputErrorMessage: '不能为空',
      })
        .then((res) => {
          // 创建分类
          this.note.push({
            name: res.value,
            arr: [],
          })
          this.noteSave()
        })
        .catch(() => {
          this.$message.info('取消创建')
        })
    },
    bindNoteMove() {
      // if (Sea.Vue.login()) return
      this.moveShow = Date.now()
    },
    bindNoteMoveCallback(kindIndex) {
      const i = this.contextMenuData
      // 取出
      const note = this.note[this.noteNow].arr.splice(i, 1)[0]
      // 添加
      this.note[kindIndex].arr.push(note)
      // 保存
      this.noteSave()
    },
    bindNoteRename() {
      // if (Sea.Vue.login()) return
      const i = this.contextMenuData
      const note = this.note[this.noteNow].arr[i]
      const oldName = note.title
      this.$prompt(`名称：${oldName}`, '重命名', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /.+/,
        inputErrorMessage: '请输入新名称',
      })
        .then((data) => {
          note.title = data.value
          // 写入
          this.noteRename(note)
        })
        .catch(() => {
          this.$message.info('取消输入')
        })
    },
    bindNoteOpen() {
      const i = this.contextMenuData
      const e = this.note[this.noteNow].arr[i]
      Sea.open(`/note/${e.id}`)
    },
    noteSave() {
      // if (Sea.Vue.login()) return
      this.$api
        .request({
          method: 'post',
          url: '/v3/user.note',
          data: {
            note: this.note,
          },
        })
        .then((res) => {
          if (res.ok) {
            this.$message.success(res.msg)
          } else {
            this.$message.error(res.msg)
          }
        })
    },
    noteRename(note) {
      api
        .request({
          method: 'post',
          url: '/v3/note.rename',
          data: {
            note_id: note.id,
            note_title: note.title,
          },
        })
        .then((res) => {
          if (res.ok) {
            this.noteSave()
          } else {
            this.$message.error(res.msg)
          }
        })
    },
    createNote(title) {
      api
        .request({
          method: 'post',
          url: '/v3/note.create',
          data: {
            title: title,
            kind: this.noteNow,
          },
        })
        .then((res) => {
          if (res.ok) {
            this.note[this.noteNow].arr.push(res.data)
            this.$message.success(res.msg)
          } else {
            this.$message.error(res.msg)
          }
        })
    },
    bindNoteAdd() {
      // if (Sea.Vue.login()) return
      this.$prompt('请输入标题', '新文章', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /[\S\s]/,
        inputErrorMessage: '不能为空',
      })
        .then((res) => {
          // 创建文章
          this.createNote(res.value)
        })
        .catch(() => {
          this.$message.info('取消创建')
        })
    },
    bindNote(event, e) {
      event.preventDefault()
      this.$router.push(`/note/${e.id}`)
    },
    async init() {
      await this.$store.dispatch('actionUser')
      const user = this.$store.state.user || this.$store.state.userDefault
      this.note = user.note || []
    },
  },
  created() {
    this.init()
  },
}
</script>
<script setup></script>

<style lang="scss">
#Notes {
  .kinds {
    display: flex;
    flex-wrap: wrap;
    border-bottom: 1px solid #eee;
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

    .kind.add {
      color: #333;
      font-weight: 500;
    }

    .kind.add:hover {
      color: #037dd8;
    }
  }

  .notes {
    display: flex;
    flex-wrap: wrap;
    padding-bottom: 16px;

    .note {
      padding: 8px 16px;
      margin-top: 16px;
      cursor: pointer;
      border-radius: 20px;
      border: 0;
      color: #191919;
    }

    .note:hover {
      background-color: #f0f0f0;
    }

    .note.add {
      background: transparent;
      color: rgba(0, 0, 0, 0.3);
      font-weight: 500;
    }

    .note.add:hover {
      background-color: transparent;
      color: #0f60ab;
    }
  }
}
</style>
