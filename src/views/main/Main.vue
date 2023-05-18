<template>
  <div class="main">
    <el-container>
      <Menu
        :menuCollapse="menuCollapse"
        :defaultActive="defaultActive"
        :asideWidth="asideWidth"
      />
      <el-container>
        <el-header class="header">
          <Header
            :menuCollapse="menuCollapse"
            :menuBreadCrumbList="menuBreadCrumbList"
            @openMenu="openMenu"
          />
        </el-header>
        <el-main class="main-content">
          <div class="tag-content">
            <el-tabs
              type="border-card"
              v-model="defaultActive"
              @tab-change="tabChange"
              @edit="editTab"
            >
              <el-tab-pane
                v-for="item in tabList"
                :name="item.path"
                :label="item.menuName"
                :closable="tabList.length > 1"
                :key="item"
              />
            </el-tabs>
          </div>
          <div class="content-body">
            <router-view></router-view>
          </div>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

import Menu from "./components/Menu";
import Header from "./components/Header";

const route = useRoute();
const router = useRouter();

const asideWidth = ref(250);
const menuCollapse = ref(false);
const openMenu = () => {
  menuCollapse.value = !menuCollapse.value;
  asideWidth.value = menuCollapse.value ? 63 : 250;
};

const defaultActive = ref();
const menuBreadCrumbList = ref([]);
const tabList = ref([]);
watch(
  () => route,
  (newValue) => {
    defaultActive.value = newValue.path;
    menuBreadCrumbList.value = route.matched;

    const currentMenu = tabList.value.some(
      (item) => item.path === defaultActive.value
    );
    if (!currentMenu) {
      tabList.value.push({
        path: newValue.path,
        menuName: route.name
      });
    }
  },
  {
    immediate: true,
    deep: true
  }
);

const tabChange = (path) => {
  router.push(path);
};
const editTab = (targetKey, action) => {
  if (action !== "remove") return;

  let currentPath = defaultActive.value;
  const tabs = tabList.value;
  tabList.value = tabs.filter((tab) => tab.path !== targetKey);

  if (targetKey === defaultActive.value) {
    tabs.forEach((tab, index) => {
      if (tab.path === targetKey) {
        const nextTab = tabs[index + 1] || tabs[index - 1];
        currentPath = nextTab.path;
      }
    });
  }

  if (currentPath !== defaultActive.value) {
    router.push(currentPath);
  }
};
</script>

<style lang="scss" scoped>
.main {
  .header {
    background: #fff;
    border-bottom: 1px solid #ddd;
    height: 50px;
    line-height: 50px;
    padding: 0px 10px !important;
    display: flex;
    align-items: center;
    .open-menu {
      font-size: 20px;
      cursor: pointer;
      color: #3a3a40;
    }
    .menu-label {
      margin-left: 10px;
    }
  }
  .main-content {
    padding: 0;
    .tag-content {
      .el-tabs--border-card {
        border: none;
      }
      ::v-deep(.el-tabs__content) {
        display: none;
      }
      .content-body {
        overflow: hidden;
        padding: 10px;
        padding-bottom: 5px;
      }
    }
  }
}
</style>
