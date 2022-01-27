<template>
  <div id="index">
    <Header></Header>
    <div class="logo">
      <div
        class="btn left"
        @click="bindPrev"
        :style="{ visibility: user.engineIndex.value <= 0 ? 'hidden' : 'visible' }"
      >
        <icon name="back" />
      </div>
      <div
        @click="bindLogo"
        class="center"
        :class="{ outwall: data.engineNow.outwall && !user.GreatWallOut.value }"
      >
        <icon-app :name="data.engineNow.icon || 'shalou'" />
        <span>{{ data.engineNow.name }}</span>
      </div>
      <div
        class="btn right"
        @click="bindNext"
        :style="{
          visibility:
            user.engineIndex.value >= user.engineList.value.length - 1 ? 'hidden' : 'visible',
        }"
      >
        <icon name="next" />
      </div>
    </div>
    <div class="search">
      <div ref="sug"></div>
      <input
        ref="search"
        type="text"
        v-model="data.keyword"
        @keydown="bindKeyDown"
        @keyup="bindKeyUp"
        @input="bindInput"
        @focus="bindFocus"
        @blur="bindBlur"
        :class="{ active: data.inputFocus && data.sugArr.length }"
        autofocus
      />
      <!-- :placeholder="data.engineNow.placeholder || ''" -->
      <div class="clear" v-show="data.keyword || showSug" @mousedown.prevent="bindClear">
        <icon name="close" />
      </div>
      <div class="btn" @click="bindSearch(null)">
        <icon name="search" />
      </div>
    </div>
    <div class="sug" v-show="showSug" @mouseout="data.sugNow = -1">
      <div
        @mouseover="data.sugNow = i"
        class="one"
        :class="{ active: data.sugNow === i }"
        v-for="(e, i) in data.sugArr"
        @mousedown.prevent="bindSearch(e)"
        :key="i"
      >
        {{ e }}
      </div>
    </div>
    <draggable
      v-show="!showSug"
      v-model="user.engineList.value"
      item-key="id"
      class="user-engines"
      @update="bindUpdate"
    >
      <template #item="{ element, index }">
        <div
          class="engine drag"
          :class="{ active: data.engineNow.id === element.id }"
          :style="{ color: data.engineNow.id === element.id ? element.color : '' }"
          @click="bindEngine(index)"
        >
          <icon-app :name="element.icon || 'shalou'" />
          <span>{{ element.name }}</span>
        </div>
      </template>
      <template #footer>
        <div class="engine add" @click="bindEngineAdd">+</div>
        <div class="engine empty" v-for="(e, i) in new Array(24)" :key="i"></div>
      </template>
    </draggable>
    <!-- <div class="cloud" v-if="user && user.default.value" v-show="!showSug">
      <Task mode="task" />
    </div>
    <EngineStore v-if="user && user.default.value" :show="data.engineStoreShow" @updateEngine="updateEngine" /> -->
  </div>
</template>

<script setup lang="ts">
import user from '../assets/store/user'
import engine from '../assets/store/engine'
import draggable from 'vuedraggable'
// import api from '../assets/js/api'

const router = useRouter()
const route = useRoute()

let data = reactive({
  inputFocus: false,
  sugArr: [],
  sugNow: -1,
  keyword: '',
  // 禁用任务
  disabledTask: false,
  // 搜索引擎商店
  engineStoreShow: '',
  // engineIndex: 0,
  engineNow: computed(() => {
    return user.engineList.value[user.engineIndex.value]
  }),
  engines: user.engineList.value,
})
let showSug = computed(() => {
  return data.inputFocus && data.sugArr.length
})

// console.log(user.engineList.value)

const bindKeyDown = (event: any) => {
  // 解决光标bug
  if (event.keyCode === 38) {
    event.preventDefault()
  }
}
const bindKeyUp = (event: any) => {}
const bindInput = (event: any) => {}
const bindFocus = (event: any) => {}
const bindBlur = () => {
  data.inputFocus = false
}
const bindEngine = (index: any) => {
  user.engineList.value = data.engines
  user.engineIndex.value = index
}
// 上一个搜索引擎
const bindPrev = () => {
  user.engineIndex.value = user.engineIndex.value - 1
}
// 下一个搜索引擎
const bindNext = () => {
  user.engineIndex.value = user.engineIndex.value + 1
}
const bindClear = () => {
  // store.state.keyword = ''
  data.keyword = ''
  data.sugArr = []
  data.sugNow = -1
}
const bindSearch = (value: any) => {}
const bindUpdate = () => {
  enginesSave()
}
const enginesSave = () => {}
const bindEngineAdd = () => {
  // 检查登录
  data.engineStoreShow = Date.now() + ',engineAdd'
}
const bindLogo = () => {
  data.engineStoreShow = Date.now() + ',logo'
}

const updateEngine = (engine: any) => {
  // 添加常用搜索引擎
  let type = data.engineStoreShow.split(',')[1]
  if (type === 'engineAdd') {
    if (data.engines.find((e) => e.id === engine.id)) {
      // message.info('已经有了')
    } else {
      data.engines.push(engine)
      enginesSave()
    }
  } else {
    // if (this.$refs.search) {
    //   this.$refs.search.select()
    // }
  }
}
</script>
<style lang="scss">
#index {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  margin-bottom: 35px;

  .logo {
    margin-top: 54px;
    display: flex;
    align-items: center;

    .btn {
      cursor: pointer;
      padding: 4px 8px;
      color: #848484;
      margin-top: 2px;
    }

    .btn:hover {
      color: rgba(0, 0, 0, 0.24);
    }

    .left {
      margin-right: 8px;
    }

    .center {
      // transition: all 0.3s;
      cursor: pointer;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      // height: 55px;
      // line-height: 55px;
      // max-width: 211px;
      width: 211px;
      color: #666;
      border-radius: 2px;
      overflow: hidden;
      font-weight: lighter;

      .iconfont {
        font-size: 54px;
      }

      span {
        // font-size: 14px;
        line-height: 22px;
        // font-weight: normal;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      // 图片 logo
      img {
        box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.25);
        width: 100%;
        max-height: 100%;
      }
    }

    .center.outwall {
      opacity: 0.6;
    }

    .center:hover {
      opacity: 1;
      color: #333;
    }

    .right {
      margin-left: 8px;
    }
  }

  .search {
    position: relative;
    width: 100%;
    height: 44px;
    margin-top: 30px;

    input {
      transition: all 0.3s;
      width: 100%;
      height: 100%;
      border: 1px solid #eee;
      outline: 0;
      padding: 10px;
      padding-right: 74px;
      background: #fff;
      border-radius: 6px;
      box-shadow: 0;
    }

    input.active {
      border-radius: 2px 2px 0px 0px;
      border-color: rgba(0, 0, 0, 0.44);
    }

    input:hover {
      border-color: rgba(0, 0, 0, 0.24);
    }

    input:focus {
      border-color: rgba(0, 0, 0, 0.44);
    }

    .btn,
    .clear {
      transition: color 0.4s;
      cursor: pointer;
      position: absolute;
      right: 0;
      top: 0;
      height: 100%;
      display: flex;
      align-items: center;
      color: #0f60ab;
      padding: 0 10px 0 5px;
      margin-left: 5px;
      margin-right: 6px;

      svg {
        width: 22px;
        height: 22px;
      }
    }

    .btn:hover {
      color: #666;
    }

    .btn:active {
      color: #000;
    }

    .clear {
      margin-right: 60px;
      color: rgba(0, 0, 0, 0.24);
      padding: 0;

      svg {
        width: 12px;
        height: 12px;
      }
    }

    .clear:hover {
      color: rgba(0, 0, 0, 0.64);
    }
  }

  .sug {
    width: 100%;
    border: 1px solid rgba(0, 0, 0, 0.44);
    border-top: 0;
    border-radius: 0px 0px 2px 2px;
    padding: 5px 0;
    margin-bottom: 5px;
    color: #666;
    overflow: hidden;

    .one {
      cursor: pointer;
      display: flex;
      align-items: center;
      padding: 5px 10px;
      margin-top: 5px;
    }

    .one.active {
      background: #0f60ab;
      color: #fff;
    }
  }

  .user-engines {
    display: flex;
    justify-content: space-around;
    flex-wrap: wrap;
    padding: 7px 0;

    .engine {
      cursor: pointer;
      width: 80px;
      padding: 7px 0;
      text-align: center;
      color: rgba(0, 0, 0, 0.6);

      .iconfont {
        font-size: 20px;
      }

      span {
        font-size: 12px;
        margin-top: 8px;
        display: block;
      }
    }

    .engine:hover {
      background: rgba(0, 0, 0, 0.02);
    }

    .engine.active {
      color: #0f60ab;
    }

    .engine.empty {
      visibility: hidden;
      margin: 0;
      padding: 0;
    }

    .engine.add {
      color: rgba(0, 0, 0, 0.3);
      font-weight: 500;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .engine.add:hover {
      color: #0f60ab;
    }
  }

  .cloud {
    width: 100%;
    padding: 4px 0;
  }
}
</style>
