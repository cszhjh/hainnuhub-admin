<template>
  <el-aside class="aside" :style="{ width: asideWidth + 'px' }">
    <div class="logo">
      <span v-if="!menuCollapse">HainnuHub 后台管理</span>
    </div>
    <div class="menu-panel">
      <el-menu
        :default-openeds="defaultOpeneds"
        :collapse="menuCollapse"
        :collapse-transition="false"
        class="el-menu-vertical-demo"
        default-active="2"
        background-color="#545c64"
        text-color="#fff"
        active-text-color="#ffd04b"
        router
        :defaultActive="defaultActive"
      >
        <template v-for="menu in menuList" :key="menu">
          <el-sub-menu :index="menu.path" v-if="menu.children">
            <template #title>
              <i :class="['iconfont', menu.icon]"></i>
              <span class="menu-name">{{ menu.menuName }}</span>
            </template>
            <el-menu-item
              v-for="subMenu in menu.children"
              :index="subMenu.path"
              :key="subMenu"
            >
              <span class="menu-name">{{ subMenu.menuName }}</span>
            </el-menu-item>
          </el-sub-menu>
          <el-menu-item v-else :index="menu.path">
            <template #title>
              <i :class="['iconfont', menu.icon]"></i>
              <span class="menu-name">{{ menu.menuName }}</span>
            </template>
          </el-menu-item>
        </template>
      </el-menu>
    </div>
  </el-aside>
</template>

<script setup>
import { ref } from "vue";
import menuList from "../config/menu-config";

const props = defineProps({
  menuCollapse: {
    type: Boolean,
    default: false
  },
  defaultActive: {
    type: String,
    default: ""
  },
  asideWidth: {
    type: Number,
    default: 250
  }
});

const defaultOpeneds = ref([menuList[0].path]);
</script>

<style lang="scss" scoped>
.aside {
  background: #545c64;
  .logo {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 50px;
    color: #fff;
    background: #4c4c53;
    font-size: 18px;
    padding-left: 5px;
  }
  .menu-panel {
    height: calc(100vh - 50px);
    .menu-name {
      padding-left: 10px;
    }
    .el-menu {
      border-right: none;
    }
  }
}
</style>
