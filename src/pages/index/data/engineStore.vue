<template>
  <div id="EngineStore" v-show="engineStoreShow">
    <!-- 墙外 -->
    <div
      class="app-header-button Great-Wall"
      :class="{ active: GreatWallOut }"
      @click="bindGreatWall"
    >
      <icon name="Great-Wall" />
    </div>
    <!-- 商店 -->
    <div
      class="app-header-button App-Shop"
      :class="{ active: tagsShow }"
      @click="tagsShow = !tagsShow"
    >
      <icon name="shop" />
    </div>
    <!-- 关闭 -->
    <div class="app-header-button close" @click="bindClose">
      <icon name="close" />
    </div>
    <header>
      <input type="text" class="input" placeholder="全局搜索" v-model="enginesKeyword" />
      <i class="el-icon-circle-close" v-show="enginesKeyword" @click="enginesKeyword = ''"></i>
    </header>
    <main>
      <div class="tags" v-show="tagsShow">
        <div
          class="tag"
          :class="{ active: enginesTagsIndex === i }"
          v-for="(tag, i) in enginesTags"
          :key="i"
          @click="bindTag(i)"
        >
          <icon :name="`tag-${initKindPinyin(tag)}`" />
          <div>{{ tag }}</div>
        </div>
        <div class="tag" @click="bindTag(null)">
          <icon name="tag-qita" />
          <div>其它</div>
        </div>
      </div>
      <div class="engines" :class="{ tags: tagsShow }">
        <template v-for="(engine, i) in enginesFilter" :key="i">
          <div
            :disabled="engine && engine.outwall && !GreatWallOut"
            class="engine"
            @mouseover="bindMouseOver(engine, $event)"
            @mouseout="bindMouseOut(engine, $event)"
            @click="bindEngine(i)"
          >
            <icon-app :name="engine.icon || 'shalou'" />
            <span>{{ engine.name }}</span>
          </div>
        </template>
        <div class="engine add" v-if="user.id === 0" @click="bindEngineAdd">+</div>
        <div class="engine empty"></div>
        <div class="engine empty"></div>
        <div class="engine empty"></div>
      </div>
    </main>
    <!-- 弹窗 编辑书签 -->
    <EngineEdit :show="editShow" :edit="edit" :type="editType" @save="bindEngineEditCallback" />
  </div>
</template>

<script>
import engineMethod from './engineMethod.js'
import EngineEdit from './engineEdit.vue'
import Pinyin from 'pinyin'
import api from '../../../assets/js/api'
import Sea from '../../../assets/js/bigsea.js'
export default {
  mixins: [engineMethod],
  components: { EngineEdit },
  props: ['show'],
  data() {
    return {
      editShow: false,
      edit: null,
      editType: 'edit',
      tagsShow: true,
      engineStoreShow: false,
    }
  },
  watch: {
    show(nv) {
      this.engineStoreShow = Boolean(nv)
    },
    engineStoreShow(nv) {
      if (nv === true) {
        Sea('body').css({ overflow: 'hidden' })
      } else {
        Sea('body').removeAttr('style')
      }
    },
  },
  computed: {
    // 过滤
    enginesFilter() {
      let arr = []
      // 关键字
      if (this.enginesKeyword !== '') {
        const keyword = this.enginesKeyword.toLowerCase()
        arr = this.enginesFormat.filter((engine) => {
          return engine.name.includes(keyword)
        })
        // 数组去重
        arr = Array.from(new Set(arr.map((e) => e.index)))
        arr = arr.map((e) => this.engineStore[e])
      } else {
        // 标签分类
        const tag = this.enginesTags[this.enginesTagsIndex]
        if (tag) {
          arr = this.engineStore.filter((engine) => {
            if (engine.tags) {
              return engine.tags.includes(tag)
            }
          })
        } else {
          arr = this.engineStore.filter((engine) => {
            if (engine.tags && engine.tags.length) {
              return false
            } else {
              return true
            }
          })
        }
      }
      return arr
    },
  },
  async created() {
    // 引擎
    await this.$store.dispatch('actionEngineStore')
    this.initEngines()
    // this.bindEngine(0)
  },
  methods: {
    initKindPinyin(e) {
      const arr = Pinyin(e, {
        style: Pinyin.STYLE_NORMAL, // 设置拼音风格
        heteronym: false, // 启用多音字
      })
      return arr.join('')
    },
    bindClose() {
      if (this.engineStoreShow) {
        this.engineStoreShow = false
      }
    },
    // 墙外
    bindGreatWall() {
      this.$store.state.GreatWallOut = !this.$store.state.GreatWallOut
      Sea.localStorage('GreatWallOut', this.$store.state.GreatWallOut)
    },
    bindTag(i) {
      if (this.enginesKeyword) {
        this.enginesKeyword = ''
      }
      this.enginesTagsIndex = i
    },
    bindEngineAdd() {
      const tag = this.enginesTags[this.enginesTagsIndex]
      this.edit = {
        tags: tag ? [tag] : [],
      }
      this.editType = 'add'
      this.editShow = Date.now()
    },
    bindEngineEdit() {
      // if (Sea.Vue.login()) return
      const i = this.contextMenuData
      const engine = this.enginesFilter[i]
      this.edit = engine
      this.editType = 'edit'
      this.editShow = Date.now()
    },
    async bindEngineEditCallback(engine) {
      if (this.editType === 'edit') {
        const i = this.engineStore.findIndex((e) => e.id === engine.id)
        const res = await api.request({
          method: 'post',
          url: '/v3/engine.update',
          data: {
            engine: engine,
          },
        })
        if (res.ok) {
          this.$message.success(res.msg)
          this.engineStore[i] = engine
          this.initEngines()
          this.$forceUpdate()
        } else {
          this.$message.error(res.msg)
        }
      } else if (this.editType === 'add') {
        const res = await api.request({
          method: 'post',
          url: '/v3/engine.add',
          data: {
            engine: engine,
          },
        })
        if (res.ok) {
          this.$message.success(res.msg)
          // 编辑
          this.$store.state.engineStore.push(engine)
          this.initEngines()
        } else {
          this.$message.error(res.msg)
        }
      }
    },
    bindContactUs() {
      Sea.open('https://mp.sea.team/team')
    },
    bindMouseOver(engine, event) {
      let dom = event.target
      dom.style.color = engine.color || 'rgba(0,0,0,0.44)'
    },
    bindMouseOut(engine, event) {
      let dom = event.target
      dom.style.color = ''
    },
    bindEngine(i) {
      this.$store.state.engineArr = this.enginesFilter
      this.$store.state.engineIndex = i
      this.bindClose()
      this.$emit('updateEngine', this.enginesFilter[i])
    },
  },
}
</script>

<script setup></script>

<style lang="scss">
#EngineStore {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  background: #f4f4f4;
  z-index: 2;

  header {
    height: 60px;
    width: 38.2%;
    display: flex;
    align-items: center;
    padding: 10px;

    .input {
      font-size: 14px;
      width: 100%;
      outline: 0;
      border: 0;
      height: 30px;
      background: rgba(231, 232, 233, 1);
      border-radius: 10px;
      padding: 8px 10px;
    }

    .el-icon-circle-close {
      cursor: pointer;
      margin-left: -22px;
      opacity: 0.44;
    }

    .el-icon-circle-close:hover {
      opacity: 0.94;
    }
  }

  .app-header-button.Great-Wall {
    right: 30px;
    opacity: 0.4;
    font-size: 26px;
  }

  .app-header-button.App-Shop {
    font-size: 22px;
    right: 82px;
    opacity: 0.4;
  }

  .app-header-button.App-Shop.active,
  .app-header-button.Great-Wall.active {
    opacity: 0.9;
  }

  .engines {
    flex: 1;
    font-size: 18px;
    overflow-y: auto;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: space-between;
    align-content: flex-start;
    flex-wrap: wrap;
    padding: 0 10px;

    .engine {
      cursor: pointer;
      margin-bottom: 10px;
      border-radius: 2px;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      width: 114px;
      height: 80px;
      border: 1px solid #eee;
      background: #fff;

      .iconfont {
        font-size: 30px;
      }

      span {
        margin-top: 4px;
        font-size: 14px;
        line-height: 22px;
        text-align: center;
        width: 100%;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }

    .engine.empty {
      visibility: hidden;
      margin-bottom: 0;
      height: 0;
    }

    .engine.add {
      color: rgba(0, 0, 0, 0.3);
      font-weight: 500;
      border-color: transparent;
      background: transparent;
    }

    .engine.add:hover {
      color: #0f60ab;
    }
  }

  .engines.tags {
    padding: 0 10px;

    .engine {
      width: 134px;
    }
  }

  // engineStore
  > main {
    display: flex;
    height: calc(100% - 60px);

    .tags {
      height: 100%;
      width: 72px;
      text-align: center;
      overflow-y: auto;

      .tag {
        cursor: pointer;
        padding: 10px 0 10px 10px;
      }

      .tag.active {
        color: #0f60ab;
      }

      .tag:hover {
        color: #0f60ab;
      }
    }

    .engines {
      padding-bottom: 15px;
      flex: auto;
    }
  }
}
</style>
