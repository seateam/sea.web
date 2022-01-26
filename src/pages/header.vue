<template>
  <div id="header">
    <!-- v-show="tabType === 'Tab'" -->
    <div class="main">
      <div class="tabs">
        <div
          class="tab"
          v-for="(tab, i) in data.tabs"
          :key="i"
          @click="bindTab(i)"
          :class="{ active: String(i) === String(data.tabNow) }"
        >
          <span>{{ tab.name }}</span>
        </div>
      </div>
      <div class="user">
        <el-image v-if="user.songPlaying.value" :src="user.song.value" class="cover" alt="唱片" @click="bindPause" />
        <div class="yezi" @click="bindBook">
          <icon name="yezi" />
        </div>
        <div class="more" @click="data.boxShow = !data.boxShow">
          <icon name="more" />
          <div class="mask" v-if="data.boxShow" @mousedown.prevent="bindMask"></div>
          <div class="box" v-if="data.boxShow">
            <div class="border-up-empty">
              <span></span>
            </div>
            <div class="app music" :class="{ playing: user.songPlaying.value }" @click="bindMusic">
              <icon name="music" />
              <span>音乐</span>
            </div>
            <div class="app cloud-history" @click="bindTask">
              <icon name="history" />
              <span>已完成</span>
            </div>
            <div class="app question" @click="bindHelp">
              <icon name="question" />
              <span>帮助</span>
            </div>
            <div class="app communism" @click="bindCommunism">
              <icon name="comintern" />
              <span>共产国际</span>
            </div>
          </div>
        </div>
        <div @click="bindLogin" class="head">
          <el-image :src="user.avatar.value">
            <div slot="error">
              <i class="el-icon-picture-outline"></i>
            </div>
          </el-image>
          <div class="icon" v-show="!user">
            <i class="el-icon el-icon-user"></i>
          </div>
        </div>
      </div>
    </div>
    <!--  v-if="data.tabType === 'Back'" -->
    <template>
      <div class="back" @click="bindBack">
        <icon name="back" />
      </div>
      <a name="0" />
      <div class="placeholder">
        <span>{{ user.title.value }}</span>
      </div>
    </template>
  </div>
</template>
<script setup lang="ts">
import icon from '../components/icon.vue'
import user from '../assets/store/user'
import engine from '../assets/store/engine'
const router = useRouter()
const route = useRoute()

const data = reactive({
  // tabType: '',
  tabNow: 0,
  boxShow: false,
  tabs: toRaw(user.tabs.value),
  // title: user.title.value,
  // playing: user.songPlaying.value,
  // song: user.song.value,
  // userAvatar: user.avatar.value, // 头像
  account: '',
  password: '',
})


const bindTab = (i: any) => {
  if (data.tabNow !== i) {
    let path = data.tabs[i].path
    if (route.path !== path) {
      data.tabNow = i
      router.replace(path)
    }
  }
}
const bindBook = () => {
  router.push('/book')
}
const bindMask = () => {
  data.boxShow = false
}
// 暂停
const bindPause = () => {
  bindMusic()
}
const bindMusic = () => {
  router.push('/music')
}
const bindTask = () => {
  router.push('/task')
}
const bindHelp = () => {
  router.push('/note/0')
}
const bindCommunism = () => {
  router.push('/note/1')
}
const bindLogin = async () => {
  await user.login(data.account, data.password)
  console.log('🌊', toRaw(user.markList.value))
}
const bindBack = () => {
  router.back()
}
</script>
<style lang="scss">
$height: 32px;
$marginTop: 20px;

// 右侧按钮样式
.app-header-button {
  margin-top: $marginTop;
  margin-right: 5px;
  margin-left: 5px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  right: 0;
  padding: 0;
  height: $height;
  width: $height;
  z-index: 10;
}

#header {
  width: 100%;

  .main {
    margin-top: $marginTop;
    width: 100%;
    height: $height;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .tabs {
      display: flex;
      align-items: center;
      font-size: 14px;
      height: 100%;

      .tab {
        display: flex;
        align-items: center;
        cursor: pointer;
        padding: 0 16px;

        span {
          padding: 6px 0;
          display: block;
          border-bottom: 0.125rem dashed transparent;
          pointer-events: none;
        }
      }

      .tab:hover {
        color: #333;
      }

      .tab.active {
        span {
          font-weight: normal;
          border-bottom-color: #0f60ab;
        }
      }
    }

    .user {
      display: flex;
      align-items: center;
      height: 100%;

      .cover {
        margin-right: 4px;
        cursor: pointer;
        border-radius: 50%;
        width: 30px;
        height: 30px;
        overflow: hidden;
        opacity: 0.9;
        box-shadow: 0px 0px 2px 0px rgba(0, 0, 0, 0.24);
        animation: animate-spin 18.2s linear infinite;
      }

      .cover:hover {
        opacity: 1;
      }

      .yezi {
        margin: 10px;
        cursor: pointer;

        .icon-yezi {
          width: 20px;
          height: 20px;
        }
      }

      .more {
        cursor: pointer;
        color: #666;
        padding: 0 10px;
        height: 100%;
        display: flex;
        align-items: center;
        position: relative;

        .mask {
          cursor: auto;
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 9;
          background: rgba(51, 51, 51, 0.14);
        }

        .box {
          // blog.csdn.net/LLL_liuhui/article/details/80916265
          cursor: auto;
          user-select: none;
          z-index: 10;
          position: absolute;
          top: $height;
          right: -42px;
          width: 260px;
          margin-top: 10px;
          background: #fff;
          padding: 16px 16px 0;
          border-radius: 2px;
          border: 1px solid #eee;
          display: flex;
          justify-content: space-between;
          flex-wrap: wrap;
          $triangle: 9px;

          .border-up-empty {
            z-index: 9;
            position: absolute;
            top: -($triangle);
            right: 51px;
            width: 0;
            height: 0;
            border-left: $triangle solid transparent;
            border-right: $triangle solid transparent;
            border-bottom: $triangle solid #eee;
          }

          .border-up-empty span {
            display: block;
            width: 0;
            height: 0;
            border-left: $triangle solid transparent;
            border-right: $triangle solid transparent;
            border-bottom: $triangle solid #fff;
            position: absolute;
            left: -($triangle);
            top: 1px;
          }

          .app {
            cursor: pointer;
            width: 70px;
            display: inline-flex;
            flex-direction: column;
            align-items: center;
            border: 1px solid transparent;
            border-radius: 2px;
            background: #eee;
            margin-bottom: 16px;

            svg {
              margin: 10px;
              width: 28px;
              height: 28px;
            }

            span {
              margin-bottom: 10px;
            }
          }

          .app.empty {
            visibility: hidden;
          }

          .app.music.playing {
            border-color: #000;
          }

          .app:hover {
            border-color: rgba(0, 0, 0, 0.24);
          }
        }

        .icon-more {
          width: 18px;
          height: 18px;
        }
      }

      .more:hover {
        .icon-more {
          color: #333;
        }
      }

      .head {
        position: relative;
        margin-left: 10px;
        color: rgba(0, 0, 0, 0.3);
        cursor: pointer;
        display: flex;
        justify-content: center;
        align-items: center;
        width: $height - 1px;
        height: $height - 1px;
        line-height: $height - 1px;
        opacity: 0.9;
        border-radius: 50%;
        overflow: hidden;
        box-shadow: 0px 0px 2px 0px rgba(0, 0, 0, 0.4);

        .icon {
          color: #0f60ab;
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          width: 100%;
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
        }
      }

      .head:hover {
        opacity: 1;
      }
    }
  }

  .placeholder {
    user-select: text;
    margin-top: $marginTop;
    width: 100%;
    height: $height;
    padding: 0 37px;
    font-size: 18px;
    display: flex;
    align-items: center;
    justify-content: center;

    span {
      white-space: nowrap;
      overflow-x: auto;
      overflow-y: hidden;
      text-align: center;
    }
  }

  .back {
    margin-top: $marginTop;
    margin-left: 5px;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    position: fixed;
    top: 0;
    left: 0;
    padding: 0;
    height: $height;
    width: $height;
    z-index: 10;
  }

  .back:hover {
    color: rgba(0, 0, 0, 0.3);
  }
}
</style>
