<template>
  <div v-show="show" id="Task" :class="{ history: mode === 'history' }"></div>
</template>

<script>
import api from '../../../assets/js/api'
import Sea from '../../../assets/js/bigsea'
export default {
  components: {},
  props: ['mode'],
  data() {
    return {
      taskList: [],
      taskHistory: [],
      taskSaveLock: false,
      taskSaveHistoryLock: false,
    }
  },
  computed: {
    show() {
      if (this.userDefault && this.taskList.find((e) => e) === undefined) {
        return false
      } else {
        return true
      }
    },
    user() {
      return this.$store.state.user
    },
    userDefault() {
      return this.$store.state.userDefault
    },
  },
  methods: {
    taskSave(rightNow) {
      const send = () => {
        api
          .request({
            method: 'post',
            url: '/v3/task.save',
            data: {
              task_list: this.taskList,
            },
          })
          .then((res) => {
            if (res.ok) {
              console.log('云便签', res.msg)
            } else {
              this.$message.error(res.msg)
              this.$alert('您的账户已退出', '提示', {
                confirmButtonText: '确定',
                callback: (res) => {
                  // 刷新网页
                  location.reload()
                },
              })
            }
          })
      }
      const taskList = JSON.stringify(this.taskList)
      if (this.user && JSON.stringify(this.user.task_list) !== taskList) {
        this.user.task_list = JSON.parse(taskList)
        if (rightNow) {
          send()
          return
        }
        // 延迟发送 没锁
        if (!this.taskSaveLock) {
          // 锁上
          this.taskSaveLock = true
          setTimeout(() => {
            // 1.026s 后解锁
            this.taskSaveLock = false
            // 发送
            send()
          }, 1026)
        }
      }
    },
    taskSaveHistory(rightNow) {
      const send = () => {
        api
          .request({
            method: 'post',
            url: '/v3/task.history.save',
            data: {
              task_history: this.taskHistory,
            },
          })
          .then((res) => {
            console.log('历史任务', res.msg)
          })
      }
      const taskHistory = JSON.stringify(this.taskHistory)
      if (JSON.stringify(this.user.task_history) !== taskHistory) {
        this.user.task_history = JSON.parse(taskHistory)
        if (rightNow) {
          send()
          return
        }
        // 延迟发送 没锁
        if (!this.taskSaveHistoryLock) {
          // 锁上
          this.taskSaveHistoryLock = true
          setTimeout(() => {
            // 2s 后解锁
            this.taskSaveHistoryLock = false
            // 发送
            send()
          }, 1000)
        }
      }
    },
    taskFocus(n) {
      Sea(`#Task .task${n} .input`).focus()
    },
    bindFocus(event) {
      let i = event.target.dataset.id
      let v = event.target.innerText
      if (v) {
        Sea(event.target).parent().append(`<div data-id="${i}" class="done">
        <svg aria-hidden="true" class="iconfont icon-select"><use xlink:href="#icon-select"></use></svg>
        <svg aria-hidden="true" class="iconfont icon-selected"><use xlink:href="#icon-selected"></use></svg>
        </div>`)
      }
    },
    bindBlur(event) {
      this.taskSave()
      Sea('#Task .done').remove()
    },
    bindKeyDown(event) {
      let i = Number(event.target.dataset.id)
      // 回车
      if (event.keyCode === 13) {
        event.preventDefault()
        // https://developer.mozilla.org/zh-CN/docs/Web/API/Selection
        const selection = window.getSelection && window.getSelection()
        let v = this.taskList[i]
        let index
        if (v !== '' && selection && selection.anchorOffset === 0 && selection.isCollapsed) {
          // 向上添加
          index = i
        } else {
          // 向下添加
          index = i + 1
        }
        this.taskList.splice(index, 0, '')
        this.render()
        this.taskFocus(index)
      }
      // 删除
      else if (event.keyCode === 8) {
        if (event.target.innerText === '') {
          event.preventDefault()
          this.taskList.splice(i, 1)
          this.render()
          this.taskFocus(i > 0 ? i - 1 : i)
        }
      }
      // 向上
      else if (event.keyCode === 38) {
        event.preventDefault()
        this.taskFocus(i - 1)
      }
      // 向下
      else if (event.keyCode === 40) {
        event.preventDefault()
        this.taskFocus(i + 1)
      }
    },
    bindInput(event) {
      let i = Number(event.target.dataset.id)
      let v = event.target.innerText
      this.taskList[i] = v
      this.taskSave()
    },
    bindDoneMouseOver(event) {
      let el = Sea(event.target)
      el.find('.icon-select').hide()
      el.find('.icon-selected').show()
    },
    bindDoneMouseOut(event) {
      let el = Sea(event.target)
      el.find('.icon-select').show()
      el.find('.icon-selected').hide()
    },
    bindDoneMouseDown(event) {
      event.preventDefault()
      let i = Number(event.target.dataset.id)
      let v = this.taskList.splice(i, 1)[0]
      this.taskHistory.unshift(v)
      this.render()
      // 保存 历史
      this.taskSaveHistory()
      this.$message.success(v)
    },
    bindHistoryMouseOver(event) {
      let el = Sea(event.target)
      el.find('.icon-delete').show()
      el.find('.icon-selected').hide()
    },
    bindHistoryMouseOut(event) {
      let el = Sea(event.target)
      el.find('.icon-delete').hide()
      el.find('.icon-selected').show()
    },
    bindHistoryMouseDown() {
      event.preventDefault()
      let i = Number(event.target.dataset.id)
      let v = this.taskHistory[i]
      this.$confirm(v, '是否删除这个历史任务?', {
        center: true,
      }).then(
        () => {
          this.taskHistory.splice(i, 1)
          this.render()
          // 保存 历史
          this.taskSaveHistory()
        },
        () => { },
      )
    },
    render() {
      let html = ''
      if (this.mode === 'history') {
        this.taskHistory.forEach((e, i) => {
          html += `<div class="task task${i}"><div class="input" data-id="${i}">${e}</div>
          <div data-id="${i}" class="done">
            <svg aria-hidden="true" class="iconfont icon-selected"><use xlink:href="#icon-selected"></use></svg>
            <svg aria-hidden="true" class="iconfont icon-delete"><use xlink:href="#icon-delete"></use></svg>
          </div>
          </div>`
        })
      } else {
        // 初始 ''
        let taskList = this.taskList.length ? this.taskList : ['']
        let contenteditable = this.userDefault ? false : 'plaintext-only'
        taskList.forEach((e, i) => {
          html += `<div class="task task${i}"><div contenteditable="${contenteditable}" class="input" data-placeholder="输入任务" data-id="${i}">${e}</div></div>`
        })
      }
      Sea('#Task').html(html)
    },
    bindEvent() {
      Sea('#Task').on('keydown', '.input', (event) => {
        if (this.mode === 'task') {
          this.bindKeyDown(event)
        }
      })
      Sea('#Task').on('focus', '.input', (event) => {
        if (this.mode === 'task') {
          this.bindFocus(event)
        }
      })
      Sea('#Task').on('blur', '.input', (event) => {
        if (this.mode === 'task') {
          this.bindBlur(event)
        }
      })
      Sea('#Task').on('input', '.input', (event) => {
        if (this.mode === 'task') {
          this.bindInput(event)
        }
      })
      Sea('#Task').on('mouseover', '.done', (event) => {
        if (this.mode === 'history') {
          this.bindHistoryMouseOver(event)
        }
        if (this.mode === 'task') {
          this.bindDoneMouseOver(event)
        }
      })
      Sea('#Task').on('mouseout', '.done', (event) => {
        if (this.mode === 'history') {
          this.bindHistoryMouseOut(event)
        }
        if (this.mode === 'task') {
          this.bindDoneMouseOut(event)
        }
      })
      Sea('#Task').on('mousedown', '.done', (event) => {
        // 禁用
        if (Sea.Vue.login()) return
        if (this.mode === 'history') {
          this.bindHistoryMouseDown(event)
        }
        if (this.mode === 'task') {
          this.bindDoneMouseDown(event)
        }
      })
    },
  },
  async mounted() {
    // 验证登录
    await this.$store.dispatch('actionUser')
    const user = this.user || this.userDefault
    this.taskList = Sea.deepCopy(user.task_list) || []
    this.taskHistory = Sea.deepCopy(user.task_history) || []
    this.bindEvent()
    this.render()
  },
  beforeCreate() {
    // 关闭提示
    window.onbeforeunload = (event) => {
      // event.returnValue = '未保存'
      this.taskSave(true)
    }
  },
}
</script>

<style lang="scss">
#Task {
  user-select: text;
  padding: 10px 0;
  transition: all 0.4s;
  color: #666;
  background: rgba(0, 0, 0, 0.02);
  border-radius: 2px;

  .task {
    position: relative;

    .input {
      word-break: break-word;
      padding-left: 10px;
      line-height: 24px;
      outline: 0;
      margin-right: 28px;
    }

    .input:focus {
      color: #444;
      background: rgba(0, 0, 0, 0.02);
    }

    .input:focus:empty:before {
      content: attr(data-placeholder);
      color: #bbb;
      position: absolute;
      left: 10px;
    }

    .done {
      cursor: pointer;
      position: absolute;
      top: 0;
      right: 6px;
      height: 100%;
      display: flex;
      align-items: center;

      .iconfont {
        pointer-events: none;
      }

      .icon-delete {
        display: none;
        color: #d43f3a;
      }

      .icon-selected {
        display: none;
      }
    }
  }
}

#Task.history {
  .task {
    text-decoration: overline;

    .done {
      .icon-selected {
        display: block;
      }
    }
  }

  .task:first-child {
    text-decoration: none;
  }
}
</style>
