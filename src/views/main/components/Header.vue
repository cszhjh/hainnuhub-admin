<template>
  <div
    :class="[
      'open-menu',
      'iconfont',
      menuCollapse ? 'icon-expand' : 'icon-collapse'
    ]"
    @click="openMenu"
  ></div>
  <div class="menu-label">
    <el-breadcrumb>
      <template v-for="item in menuBreadCrumbList" :key="item">
        <el-breadcrumb-item v-if="item.name">
          {{ item.name }}
        </el-breadcrumb-item>
      </template>
    </el-breadcrumb>
  </div>
</template>

<script setup>
const props = defineProps({
  menuCollapse: {
    type: Boolean,
    default: false
  },
  menuBreadCrumbList: {
    type: Array,
    default: () => []
  }
});

const emit = defineEmits(["openMenu"]);
const openMenu = () => {
  emit("openMenu");
};
</script>

<style lang="scss" scoped>
.open-menu {
  font-size: 20px;
  cursor: pointer;
  color: #3a3a40;
}
.menu-label {
  margin-left: 10px;
}
</style>
