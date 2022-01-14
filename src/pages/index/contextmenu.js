export default {
  data() {
    return {
      // 右键菜单
      contextMenuOffset: {
        left: 0,
        top: 0,
      },
      contextMenuShow: false,
      contextMenuType: '',
      // 计时
      contextMenuTime: null,
    }
  },
  computed: {
    isPC() {
      return this.$store.state.isPC
    },
    contextMenuDragText() {
      return this.$store.state.draggable.disabled ? '拖放排序' : '关闭拖放排序'
    },
  },
  methods: {
    contextMenuDrag() {
      if (Sea.Vue.login()) return
      if (this.$store.state.draggable.disabled === false) {
        this.$message.info('关闭拖动排序')
        this.$store.state.draggable.disabled = true
        this.contextMenuHide()
        return
      }
      this.$message.info('开启拖动排序')
      this.$store.state.draggable.disabled = false
      this.contextMenuHide()
    },
    contextMenuDragEnd() {
      if (!this.isPC) {
        this.$store.state.draggable.disabled = true
      }
    },
    contextMenuHide() {
      this.contextMenuShow = false
      Sea('.context-menu-mask').hide()
    },
    contextMenuInit(offset, data, type) {
      this.contextMenuType = type
      this.contextMenuShow = true
      this.contextMenuData = data
      this.contextMenuOffset = offset
      Sea('.context-menu-mask').show()
    },
    bindContextMenuShow(event, data, type) {
      event.preventDefault()
      if (this.isPC) {
        this.contextMenuInit(
          {
            left: parseInt(event.pageX),
            top: parseInt(event.pageY),
          },
          data,
          type,
        )
      }
    },
    bindContextMenuStart(event, data, type) {
      if (!this.isPC) {
        this.contextMenuTime = setTimeout(() => {
          let touch = event.changedTouches[0]
          this.contextMenuInit(
            {
              left: parseInt(touch.pageX),
              top: parseInt(touch.pageY),
            },
            data,
            type,
          )
          this.contextMenuTime = null
        }, 300)
      }
    },
    bindContextMenuMove() {
      if (this.contextMenuTime) {
        clearTimeout(this.contextMenuTime)
        this.contextMenuTime = null
      }
    },
    bindContextMenuEnd(event) {
      if (this.contextMenuTime) {
        clearTimeout(this.contextMenuTime)
        this.contextMenuTime = null
      } else {
        if (event.cancelable) {
          event.preventDefault()
        }
      }
    },
  },
}
