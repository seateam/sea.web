<template>
  <div id="Emoji">
    <div class="one emojis" v-for="(e, i) in emojis" :key="i" @click="bindCopiedEmoji(e)">
      <div class="emoji">{{ e }}</div>
      <div class="text id">#-{{ i }}</div>
    </div>
    <hr />
    <h1>Font Awesome</h1>
    <div v-for="(e, i) in icons[0]" :key="`0-${i}`" class="one" @click="bindCopiedIcon(e, 'fab')">
      <i class="fab" :class="`fa-${e}`"></i>
      <div class="text name">{{ e }}</div>
      <div class="text id">0-{{ i }}</div>
    </div>
    <div v-for="(e, i) in icons[1]" :key="`1-${i}`" class="one" @click="bindCopiedIcon(e, 'fas')">
      <i class="fas" :class="`fa-${e}`"></i>
      <div class="text name">{{ e }}</div>
      <div class="text id">1-{{ i }}</div>
    </div>
    <div v-for="(e, i) in icons[2]" :key="`2-${i}`" class="one" @click="bindCopiedIcon(e, 'fas')">
      <i class="fas" :class="`fa-${e}`"></i>
      <div class="text name">{{ e }}</div>
      <div class="text id">2-{{ i }}</div>
    </div>
  </div>
</template>

<script>
import icons from '../emoji-icons.js'
import emojis from 'emojis-list'
export default {
  name: 'Emoji',
  data() {
    return {
      emojis: emojis,
      icons: icons,
    }
  },
  methods: {
    bindCopiedEmoji(e) {
      this.$clipboard(e)
      this.$message.success(e + ' 复制成功')
    },
    bindCopiedIcon(e, type) {
      const v = `<i class="${type} fa-${e} fa-2x"></i>`
      this.$clipboard(v)
      this.$message.success(`fa-${e} 复制成功`)
    },
  },
  beforeCreate() {
    Sea.Vue.initFontAwesomeJs()
    document.title = 'Emoji'
    this.$store.state.title = 'Emoji 选中表情复制'
  },
  created() { },
  mounted() {
    this.$nextTick(() => {
      Sea('#AppHeader>.back').hide()
    })
  },
  destroyed() {
    document.title = '大海个人助理'
    this.$store.state.title = ''
  },
}
</script>

<style lang="scss">
@import "/cdn/fontawesome/css/all.min.css";

#Emoji {
  text-align: center;

  .emojis {
    display: inline-block;
  }

  .one {
    cursor: pointer;
    margin: 10px;
    display: inline-block;
    text-align: center;
    font-size: 30px;
    width: 60px;

    .text {
      font-size: 14px;
      width: 100%;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }

    .text.name {
      line-height: 18px;
    }

    .text.id {
      color: rgba(0, 0, 0, 0.14);
      font-size: 10px;
    }
  }

  .one.emojis {
    width: 40px;

    .emoji {
      font-size: 20px;
    }
  }

  .one:hover {
    color: #0f60ab;
  }
}

@media (min-width: 1024px) {
  #Emoji {
    padding: 0 20px 5px;

    .one {
      margin: 5px;
      font-size: 12px;
      width: 20px;

      .text {
        font-size: 5px;
      }

      .text.name {
        line-height: 7px;
        font-size: 4px;
      }

      .text.id {
        margin-top: 2px;
        font-size: 3px;
      }
    }

    .one.emojis {
      margin: 4px;
      font-size: 10px;
      width: 12px;

      .emoji {
        font-size: 6px;
      }

      .text.id {
        font-size: 3px;
      }
    }
  }
}
</style>