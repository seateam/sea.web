<template>
  <div id="AppFooter" v-show="showAppFooter">
    <div class="beian">
      <div class="left">
        <span>© SEA.TEAM 大海团队</span>
      </div>
      <a class="human" href="https://mp.sea.team" target="_blank">
        <icon name="sea" />
      </a>
      <div class="right">
        <a href="https://beian.miit.gov.cn/">粤ICP备2020105439号</a>
        <div class="gongan">
          <img src="/imgs/ghs.png" alt="ghs" />
          <span>公网安备 44030402004182</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AppFooter',
  data() {
    return {
      tabs: this.$store.state.tabs,
    }
  },
  computed: {
    showAppFooter() {
      if (Boolean(this.tabs.find((e) => e.path === this.$route.path))) {
        return true
      }
      return false
    },
  },
  methods: {},
  created() {},
  mounted() {},
}
</script>
<script setup lang="ts"></script>

<style lang="scss">
#AppFooter {
  user-select: text;
  position: relative;
  display: flex;
  width: 100%;
  align-items: center;
  flex-direction: column;
  color: rgba(0, 0, 0, 0.54);

  a {
    border: 0;
    color: rgba(0, 0, 0, 0.54);
    text-decoration: none;
  }

  a:hover {
    color: #333;
  }

  .human {
    cursor: pointer;
    display: flex;
    align-items: center;
    margin: 0 10px;
    width: 28px;
    height: 28px;

    svg {
      width: 100%;
      height: 100%;
    }
  }

  .beian {
    background: #f2f2f2;
    width: 100%;
    border-top: 1px solid #e4e4e4;
    font-size: 14px;
    height: 52px;
    display: flex;
    justify-content: center;
    align-items: center;

    .right {
      display: flex;
      align-items: center;

      .gongan {
        display: none;
        align-items: center;

        img {
          margin: 0 2px;
          width: 5px;
          height: 5px;
        }
      }
    }
  }
}
</style>
