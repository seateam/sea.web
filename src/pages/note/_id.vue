<template>
  <div class="Note" v-loading="htmlLoading" :class="{ editing: editing }">
    <div class="app-header-button toc">
      <div class="mask" v-if="tocShow" @click="tocShow = false"></div>
      <div class="btn-show" @click="tocShow = !tocShow">
        <i class="fa fa-list-ul"></i>
      </div>
      <div class="box" v-show="tocShow">
        <header>
          <template v-if="canEdit">
            <el-switch v-model="editing" inactive-text="编辑"></el-switch>
            <el-button :disabled="!editing" type="text" @click="bindSave">保存</el-button>
            <el-button
              :disabled="!editing"
              class="unity"
              type="text"
              @click="dialogUnityEdit = true"
            >联合投稿</el-button>
          </template>
          <template v-else>
            <div>目录</div>
          </template>
        </header>
        <main>
          <div class="render" v-html="initHtml(toc)"></div>
        </main>
      </div>
    </div>
    <!-- 二维码 -->
    <div class="qrcode">
      <el-popover title="手机扫码" width="120" trigger="click">
        <img :src="noteQRCode" alt="二维码" />
        <slot name="reference">
          <icon name="qrcode" />
        </slot>
      </el-popover>
    </div>
    <!-- 编辑 -->
    <div class="edit" :class="{ isPC: isPC }" v-show="editorShow">
      <div class="btns">
        <div class="up" @click="bindAddUp">
          <i class="fas fa-arrow-alt-circle-up"></i>
        </div>
        <div class="down" @click="bindAddDown">
          <i class="fas fa-arrow-alt-circle-down"></i>
        </div>
        <div class="close" @click="bindClose">
          <i class="fas fa-check-circle"></i>
        </div>
        <div class="image" @click="dialogUploadShow = true">
          <i class="fas fa-mountain"></i>
        </div>
        <div class="question" @click="bindQuestion">
          <i class="fas fa-question-circle"></i>
        </div>
      </div>
      <div class="render-box">
        <div ref="render" class="render" v-html="initHtml(editor)"></div>
      </div>
      <div class="editor-box">
        <div class="editor">
          <textarea ref="editor" v-model="editor" @input="bindInput" @scroll="bindScroll"></textarea>
        </div>
      </div>
    </div>
    <!-- 笔记 -->
    <template v-if="note && user">
      <template v-for="(s, i) in html" :key="i">
        <div class="one" v-html="s" @click="bindOne($event, i)"></div>
      </template>
      <div class="user-info">
        <div>
          <span>{{ user.name }}</span>
          <span v-for="(user, i) in author" :key="i">、{{ user.name || user.id }}</span>
        </div>
        <div>{{ updatedTime }}</div>
      </div>
    </template>
    <!-- 保存弹窗 -->
    <el-dialog title="确认发布" v-model="dialogPublishShow" custom-class="dialog-publish">
      <el-switch v-model="isPublic" inactive-text="公开"></el-switch>
      <slot name="footer">
        <div class="dialog-footer" v-loading="saveLoading">
          <el-button @click="dialogPublishShow = false">取 消</el-button>
          <el-button type="primary" @click="noteSave">确 定</el-button>
        </div>
      </slot>
    </el-dialog>
    <!-- 联合投稿 -->
    <el-dialog
      title="联合投稿"
      v-model="dialogUnityEdit"
      custom-class="dialog-unity"
      :close-on-click-modal="false"
    >
      <div class="label">当前作者：</div>
      <div class="users">
        <div v-if="user" class="user">
          <el-image class="avatar" :src="user.avatar || '/imgs/head.png'" />
          <div class="name">{{ user.name || user.id }}</div>
        </div>
        <div v-for="user in author" class="user" :key="user.id">
          <el-image class="avatar" :src="user.avatar || '/imgs/head.png'" />
          <div class="name">{{ user.name || user.id }}</div>
        </div>
      </div>
      <div class="label">添加作者：</div>
      <div class="search">
        <el-input placeholder="搜索用户：手机号、ID或名字" v-model="searchInput" clearable></el-input>
        <el-button
          type="primary"
          icon="el-icon-search"
          circle
          :disabled="!searchInput"
          @click="bindSearch"
        ></el-button>
      </div>
      <div class="search-result" v-if="searchUser">
        <div class="user">
          <el-image class="avatar" :src="searchUser.avatar || '/imgs/head.png'" />
          <div class="name">{{ searchUser.name || searchUser.id }}</div>
        </div>
        <el-button @click.native="bindAddAuthor">添加作者</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import dayjs from 'dayjs'
import QRCode from 'qrcode'
import Sea from '../../assets/js/bigsea'
import api from '../../assets/js/api'
import h1 from './data/remarkable-h1.js'
import remarkable from './data/remarkable.js'
export default {
  mixins: [remarkable],
  computed: {
    isPC() {
      return this.$store.state.isPC
    },
    updatedTime() {
      if (this.note.updated_time) {
        return dayjs(this.note.updated_time).format('YYYY 年 M 月 D 日')
      }
      return ''
    },
  },
  data() {
    return {
      screen: window.screen,
      // 编辑中
      editing: false,
      // 可以编辑
      canEdit: false,
      // 已编辑
      isEdited: false,
      // 公开
      isPublic: true,
      emoji: [],
      note: null,
      user: null,
      html: [],
      htmlLoading: true,
      toc: '',
      tocShow: false,
      editor: '',
      editorShow: false,
      editorNow: NaN,
      // 保存弹窗
      dialogPublishShow: false,
      // 上传弹窗
      dialogUploadShow: false,
      // 联合投稿弹窗
      dialogUnityEdit: false,
      // 二维码
      noteQRCode: '',
      // 保存 loading
      saveLoading: false,
      // 搜索类型
      searchType: 'name',
      searchInput: '',
      searchUser: null,
      // 作者
      author: [],
      // 锚点
      hash: ''
    }
  },
  methods: {
    async bindAddAuthor() {
      const res = await api.request({
        method: 'post',
        url: '/v3/note.author.add',
        data: {
          author_id: this.searchUser.id,
          note_id: this.note.id,
        },
      })
      if (res.ok) {
        this.author.push(Sea.deepCopy(this.searchUser))
        this.$message.success(res.msg)
      } else {
        this.$message.error(res.msg)
      }
    },
    async bindSearch() {
      const res = await api.request({
        method: 'post',
        url: '/v3/user.find',
        data: {
          account: this.searchInput,
        },
      })
      if (!res.ok) {
        this.$message.info(res.msg)
      }
      this.searchUser = res.data
    },
    // 保存
    bindSave() {
      this.dialogPublishShow = true
    },
    async noteSave() {
      if (Sea.Vue.login()) return
      // 是否公开
      this.note.is_public = this.isPublic
      this.saveLoading = true
      const res = await api.request({
        method: 'POST',
        url: '/v3/note.update',
        data: {
          note: this.note,
        },
      })
      this.saveLoading = false
      if (res.ok) {
        this.editing = false
        this.tocShow = false
        this.isEdited = false
        this.dialogPublishShow = false
        this.$message.success(res.msg)
      } else {
        this.$message.error(res.msg)
      }
    },
    bindAdd(i) {
      this.bindClose()
      const v = '**点击编辑**'
      this.note.arr.splice(i, 0, v)
      this.html.splice(i, 0, this.initHtml(v))
    },
    // 向上添加
    bindAddUp() {
      this.bindAdd(this.editorNow)
    },
    // 向下添加
    bindAddDown() {
      this.bindAdd(this.editorNow + 1)
    },
    // 关闭 / 删除
    bindClose() {
      const i = this.editorNow
      const v = this.editor
      if (v === '') {
        this.note.arr.splice(i, 1)
        this.html.splice(i, 1)
      } else {
        this.html[i] = this.initHtml(v)
      }
      // 渲染 toc html
      this.toc = this.initToc(this.note)
      this.editorShow = false
    },
    bindQuestion() {
      Sea.open('/note/8')
    },
    bindOne(event, i) {
      // 编辑模式
      if (this.editing) {
        event.preventDefault()
      } else {
        return
      }
      this.editorShow = true
      this.editorNow = i
      // 格式化
      let s = this.note.arr[i]
      let v = s
      if (s.startsWith('    ')) {
        v = s
      } else {
        v = s.trim() + '\n'
      }
      v = v.replace(/\n\n+/g, '\n\n')
      this.editor = v
    },
    bindScroll(event) {
      let editor = event.target
      let render = this.$refs.render
      let top = editor.scrollTop
      // 不变
      let left = editor.scrollHeight
      let right = render.scrollHeight
      let radio = left / right
      // 取最大值
      if (radio < 1) {
        radio = right / left
      }
      let scroll = Math.floor(radio * top)
      // 判断底部
      if (left - editor.clientHeight - top < 1) {
        scroll = right
      }
      render.scrollTop = scroll
    },
    bindInput(event) {
      const i = this.editorNow
      const v = event.target.value
      this.note.arr[i] = v
      // 已编辑
      if (!this.isEdited) {
        this.isEdited = true
      }
    },
    bindExitEditor(event) {
      if (Sea(event.target).hasClass('edit')) {
        this.editorShow = false
        this.editorNow = NaN
      }
    },
    initToc(note) {
      let md = note.arr
        .map((e) => {
          // 补全代码块
          let arr = e.match(/\n```/g)
          if (arr && arr.length % 2 === 1) {
            e += '\n```'
          }
          // 移除代码块
          return e.replace(/```[\s\S]+?```/g, '')
        })
        .join('')
      let arr = [`# ${note.title}`]
      arr = arr.concat(md.split('\n'))
      // # 号开头
      arr = arr.filter((e) => /^#+? /.test(e))
      this.$store.state.mdToc = arr
      arr = arr.map((e, i) => {
        e = h1.format(e)

        // #
        e = e.slice(1).replace(/#/g, '>')
        // > -
        e = e.replace(/ /, ' - ')
        // 锚点
        e = e.replace(/ - (.+?)$/g, ` - <a href="#${i}">$1</a>`)
        return e
      })
      md = arr.join('\n')
      return md
    },
    async initData() {
      const { id: noteID } = this.$route.params
      const res = await api.request({
        method: 'post',
        url: '/v3/note.get',
        data: {
          note_id: noteID,
        },
      })
      this.htmlLoading = false
      if (!res.ok) {
        this.$store.state.title = res.msg
        return
      }
      // 自己的文章 可以编辑
      this.canEdit = res.edit || false
      const { note, user, author } = res.data
      // 默认内容
      if (note.arr.length === 0) {
        note.arr.push('## 提示\n点击右上角 *<i class="fa fa-list-ul"></i>* 开启编辑')
      }
      this.note = note
      this.user = user
      // 作者
      if (note.author) {
        api.request({
          method: 'post',
          url: '/v3/user.find',
          data: {
            user_ids: note.author.join(','),
          },
        }).then((res) => {
          if (res.ok) {
            this.author = res.data
          }
        })
      }
      // 是否公开
      this.isPublic = note.is_public
      // 标题
      document.title = note.title || ''
      this.$store.state.title = note.title
      // 目录
      this.toc = this.initToc(note)
      // 渲染
      this.html = note.arr.map((e) => this.initHtml(e))
      // 锚点
      this.$nextTick(() => {
        window.location.hash = this.hash
      })
    },
    async initQRCode() {
      const host = 'https://sea.team'
      // https://www.npmjs.com/package/qrcode#example-1
      const url = await QRCode.toDataURL(host + this.$route.fullPath, {
        margin: 0,
      })
      this.noteQRCode = url
    },
    // 关闭提示
    closeTip() {
      if (window.onbeforeunload === null) {
        window.onbeforeunload = (event) => {
          // 已编辑
          if (this.isEdited) {
            this.bindSave()
            event.returnValue = '提示: 未保存'
          }
        }
      }
    },
  },
  beforeCreate() {
    // hash
    this.hash = String(window.location.hash) || ''
    window.location.hash = ''
  },
  created() {
    this.initData()
    this.initQRCode()
    this.initRemarkable()
    // 关闭提示
    this.closeTip()
  },
  destroyed() {
    document.title = '大海个人助理'
    this.$store.state.title = ''
  },
  beforeRouteLeave(to, from, next) {
    // 已编辑
    if (this.isEdited) {
      this.$msgbox({
        title: '提示',
        message: '尚未保存，是否发布？',
        cancelButtonText: '放弃',
        showCancelButton: true,
        showClose: false,
        closeOnPressEscape: false,
        closeOnClickModal: false,
      })
        .then(() => {
          next(false)
          setTimeout(() => {
            this.bindSave()
          }, 400)
        })
        .catch(() => {
          next(false)
          this.isEdited = false
        })
    } else {
      window.onbeforeunload = null
      next()
    }
  },
}
</script>

<style lang="scss">
@import "../../assets/css/fontawesome/css/all.min.css";
@import "./data/atom-one-light.css";

.Note {
  @import "./data/note.scss";
  user-select: text;
  min-height: 40vh;
  font-size: 16px;
  line-height: 25px;
  letter-spacing: 0.01rem;
  word-break: break-all;
  $height: 32px;
  $marginTop: 20px;
  overflow: hidden;
  width: 61.8%;

  .el-loading-mask {
    background-color: transparent;
  }

  .dialog-unity {
    // 公共样式
    .user {
      display: inline-flex;
      flex-direction: column;
      align-items: center;
      width: 60px;
      margin-right: 10px;
      margin-bottom: 10px;

      .el-image {
        width: 60px;
        height: 60px;
        border-radius: 50%;
      }

      .name {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        width: 100%;
        text-align: center;
        margin-top: 6px;
      }
    }

    .search {
      display: flex;

      .el-button {
        margin-left: 20px;
      }
    }

    .search-result {
      display: flex;
      align-items: center;
      margin-top: 8px;

      .el-button {
        margin-left: 20px;
      }
    }

    .label {
      padding: 4px 0;
    }
  }

  .qrcode {
    display: none;
    position: absolute;
    top: 0;
    right: 0;
    color: rgba(0, 0, 0, 0.24);
    padding: 14px;
    transition: opacity 1s;

    .icon-qrcode {
      pointer-events: auto;
      cursor: pointer;
    }
  }

  .qrcode:hover {
    position: absolute;
    top: 0;
    right: 0;
    color: rgba(0, 0, 0, 94);
  }

  .edit {
    z-index: 11;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    background: #f6f7f7;
    display: flex;
    align-items: center;
    flex-direction: column;

    .btns {
      position: absolute;
      top: 36.4%;
      left: 0;
      right: 0;
      margin: 0 auto;
      display: flex;
      align-items: flex-start;
      justify-content: space-around;
      height: 100%;
      width: 100%;
      font-size: 24px;
      pointer-events: none;
      color: rgba(102, 128, 153, 0.45);

      svg {
        cursor: pointer;
        pointer-events: auto;
      }

      svg:hover {
        color: rgba(44, 62, 80, 0.65);
      }

      .nowarp.wrap {
        color: #444;
      }
    }

    .render-box,
    .editor-box {
      width: 100%;
      padding: 14px;
    }

    // 滚动条
    .render-box {
      height: 38.2%;

      .render {
        &::-webkit-scrollbar {
          width: 0px;
          height: 0px;
        }
      }
    }

    .render-box {
      background: #fff;

      .render {
        overflow: auto;
        height: 100%;
      }
    }

    .editor-box {
      height: 61.8%;

      .editor {
        height: 100%;

        textarea {
          font-family: Monaco, Menlo, Consolas, "Courier New", Microsoft Yahei,
            sans-serif;
          font-weight: 300;
          letter-spacing: 0.01rem;
          color: #191919;
          width: 100%;
          height: 100%;
          border: 0;
          outline: 0;
          padding: 0;
          background: transparent;
          line-height: 22px;
          resize: none;
          word-break: break-word;
        }
      }
    }
  }

  .toc.app-header-button {
    .mask {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      width: 100%;
      height: 100%;
      background: rgba(51, 51, 51, 0.14);
    }

    .btn-show {
      width: 100%;
      height: 100%;
      justify-content: center;
      align-items: center;
      display: flex;
      z-index: 11;
      color: rgba(102, 128, 153, 0.45);

      svg {
        width: 18px;
        height: 18px;
      }
    }

    .box {
      cursor: auto;
      width: 320px;
      position: absolute;
      top: 0;
      right: 0;
      background: #fff;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.35);
      border-radius: 2px;
      background: #fff url("./toc_bg.png");
      border: 1px solid rgba(0, 0, 0, 0.2);
      box-shadow: 0 2px 7px rgba(0, 0, 0, 0.2);
      padding: 14px;
      padding-bottom: 0;

      > header {
        display: flex;
        border-bottom: 1px solid rgba(0, 0, 0, 0.44);
        padding-bottom: 6px;
        font-weight: 500;

        .el-switch + .el-switch {
          margin-left: 16px;
        }

        .el-button {
          margin-left: 16px;
          font-size: 14px;
          cursor: pointer;
          transition: 0.2s;
        }

        .unity {
          margin-left: auto;
          margin-right: 26px;
        }
      }

      > main {
        padding-top: 6px;
        min-height: 30vh;
        max-height: 70vh;
        overflow: auto;

        .render {
          // white-space: nowrap;
          word-break: keep-all;

          ul {
            padding-left: 0;
            list-style: none outside none;
          }
        }
      }
    }
  }

  .toc:hover {
    > svg {
      color: rgba(44, 62, 80, 0.65);
    }
  }

  .user-info {
    text-align: right;
    padding-bottom: 1rem;
  }

  .one {
    min-height: 60px;
  }
}

.Note.editing {
  .one:hover {
    background: rgba(170, 170, 170, 0.22);
    border-radius: 2px;
    cursor: pointer;
    cursor: zoom-in;
  }
}
</style>
