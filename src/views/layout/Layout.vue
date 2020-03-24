<template>
  <div :class="classObj" class="app-wrapper">

    <el-header height="80px">
      <!-- <img src="../../assets/u2.png" class="hearImg"> -->
      <span class="hearSpan">闲置交易平台后台管理</span>
    </el-header>

    <div v-if="device==='mobile'&&sidebar.opened" class="drawer-bg" @click="handleClickOutside"/>
    <sidebar class="sidebar-container"/>
    <div class="main-container">
      <navbar/>
      <app-main/>
    </div>
  </div>
</template>

<script>
import { Navbar, Sidebar, AppMain } from './components'
import ResizeMixin from './mixin/ResizeHandler'

export default {
  name: 'Layout',
  components: {
    Navbar,
    Sidebar,
    AppMain
  },
  mixins: [ResizeMixin],
  computed: {
    sidebar() {
      return this.$store.state.app.sidebar
    },
    device() {
      return this.$store.state.app.device
    },
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === 'mobile'
      }
    }
  },
  methods: {
    handleClickOutside() {
      this.$store.dispatch('CloseSideBar', { withoutAnimation: false })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import 'src/styles/mixin.scss';

.app-wrapper {
    margin-top: 80px;
    .el-header {
        width: 100%;
        // background: rgb(48, 65, 86);
        background: rgba($color: #27ae60, $alpha: .8);
        line-height: 80px;
        position: fixed;
        top: 0;
        bottom: 0;
        left: 0;
        z-index: 1001;
    }
    .hearSpan {
        font-family: 'Arial Negreta', 'Arial Normal', 'Arial';
        font-weight: 700;
        font-style: normal;
        font-size: 36px;
        color: #ffffff;
        vertical-align: middle;
    }
    .hearImg {
        width: 166px;
        height: 65px;
        padding-left: 20px;
        padding-right: 60px;
        vertical-align: middle;
    }
    @include clearfix;
    position: relative;
    height: 100%;
    width: 100%;
    &.mobile.openSidebar {
        position: fixed;
        top: 0;
    }
}
.drawer-bg {
    background: #000;
    opacity: 0.3;
    width: 100%;
    top: 0;
    height: 100%;
    position: absolute;
    z-index: 999;
}
</style>
