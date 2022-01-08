<template>
  <div id="page-index">
    <el-button @click="bindTest">测试</el-button>
    <div class="logo">
      <div
        class="btn left"
        @click="bindPrev"
        :style="{ visibility: engineIndex <= 0 ? 'hidden' : 'visible' }"
      >
        <icon name="back" />
      </div>
      <div
        @click="bindLogo"
        class="center"
        :class="{ outwall: engineNow.outwall && !GreatWallOut }"
      >
        <icon-app :name="engineNow.icon || 'shalou'" />
        <span>{{ engineNow.name }}</span>
      </div>
      <div
        class="btn right"
        @click="bindNext"
        :style="{ visibility: engineIndex >= engineArr.length - 1 ? 'hidden' : 'visible' }"
      >
        <icon name="next" />
      </div>
    </div>
    <div class="search">
      <div ref="sug"></div>
      <input
        ref="search"
        type="text"
        v-model="keyword"
        @keydown="bindKeyDown"
        @keyup="bindKeyUp"
        @input="bindInput"
        @focus="bindFocus"
        @blur="bindBlur"
        :class="{ active: inputFocus && sugArr.length }"
        :placeholder="engineNow.placeholder || ''"
        autofocus
      />
      <div class="clear" v-show="keyword || showSug" @mousedown.prevent="bindClear">
        <icon name="close" />
      </div>
      <div class="btn" @click="bindSearch(null)">
        <icon name="search" />
      </div>
    </div>
    <div class="sug" v-show="showSug" @mouseout="sugNow = -1">
      <div
        @mouseover="sugNow = i"
        class="one"
        :class="{ active: sugNow === i }"
        v-for="(e, i) in sugArr"
        @mousedown.prevent="bindSearch(e)"
        :key="i"
      >{{ e }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import api from '/src/assets/js/api'
const bindTest = async () => {
  const res = await api.post('/v3/userDefault.get')
  console.log('🌊', res)
}
const sugArr = ref([])
const engineArr = ref([])
const sugNow = ref(0)
const engineIndex = ref(0)
const keyword = ref('')
const showSug = ref(false)
const inputFocus = ref(false)
const GreatWallOut = ref(false)
const engineNow = ref({ placeholder: '', outwall: false, icon: 'juejin', name: '掘金' })
// const engineNow = ref({ placeholder: '', outwall: false, icon: 'sougou', name: '搜狗' })
const bindSearch = (e: any) => { }
const bindClear = (e: any) => { }
const bindKeyDown = (e: any) => { }
const bindKeyUp = (e: any) => { }
const bindInput = (e: any) => { }
const bindFocus = (e: any) => { }
const bindBlur = (e: any) => { }
const bindPrev = (e: any) => { }
const bindLogo = (e: any) => { }
const bindNext = (e: any) => { }
</script>

<style lang="scss">
#page-index {
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
      color: #eee;
      margin-top: 2px;
    }

    .btn:hover {
      color: rgba(0, 0, 0, 0.24);
    }

    .left {
      margin-right: 8px;
    }

    .center {
      cursor: pointer;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      width: 211px;
      color: #666;
      border-radius: 2px;
      overflow: hidden;
      font-weight: lighter;

      .iconfont {
        font-size: 54px;
      }

      span {
        margin-top: 2px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
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
      color: var(--primary);
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
