<template>
  <div id="app-footer" v-show="showAppFooter">
    <div class="beian">
      <div class="left">
        <router-link to="/note/104">© SEA.TEAM 大海团队</router-link>
      </div>
      <a class="human" href="https://mp.sea.team" target="_blank">
        <icon name="sea" />
      </a>
      <div class="right">
        <a
          href="https://beian.miit.gov.cn/#/Integrated/recordQuery?icp=%E7%B2%A4ICP%E5%A4%872020105439%E5%8F%B7"
          target="_blank"
        >粤ICP备2020105439号</a>
        <a
          href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=44030402004182"
          target="_blank"
          class="ghs"
        >
          <img src="./assets/imgs/ghs.png" title="公网安备 44030402004182" />
        </a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
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
  created() { },
  mounted() { },
}
</script>
<script setup>  </script>

<style lang="scss">
#app-footer {
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

      .ghs {
        margin-left: 8px;
        width: 1em;
        height: 1em;
      }
    }
  }
}
</style>
