<template>
  <a
    :href="clickLink ? USER_BASE_URL + userId : ''"
    target="_black"
    class="avatar"
    :style="{ width: size + 'px', height: size + 'px' }"
  >
    <el-image
      :style="{
        width: size + 'px',
        height: size + 'px',
        borderRadius: size / 2 + 'px',
        outline: 'none',
        cursor: clickLink ? 'pointer' : 'default'
      }"
      class="avatar-image"
      :src="getAvatarUrl"
      fit="cover"
      loading="lazy"
    >
      <template #error>
        <el-image
          :style="{
            width: size + 'px',
            height: size + 'px',
            borderRadius: size / 2 + 'px',
            outline: 'none',
            cursor: clickLink ? 'pointer' : 'default'
          }"
          class="avatar-image"
          fit="cover"
          loading="lazy"
          :src="DEFAULT_AVATAR"
        />
      </template>
    </el-image>
  </a>
</template>

<script setup>
import { computed } from "vue";
import { useRouter } from "vue-router";

import { BASE_URL, USER_BASE_URL } from "@/constants/base-url-config";
import DEFAULT_AVATAR from "@/assets/image/defaultAvatar.webp";

const props = defineProps({
  userId: {
    type: Number
  },
  size: {
    type: Number,
    default: 50
  },
  clickLink: {
    type: Boolean,
    default: true
  }
});
const router = useRouter();

const getAvatarUrl = computed(() => {
  if (!props.userId) return;
  return BASE_URL + "/users/" + props.userId + "/avatar";
});
</script>

<style lang="scss" scoped>
.avatar {
  height: 100%;
  outline: none;
  .avatar-image {
    ::v-deep(.el-image__wrapper) {
      display: flex;
      align-items: center;
      background: #f0f0f0;
      .no-login {
        width: 100%;
        text-align: center;
        font-size: 13px;
        color: #bdbdbd;
      }
    }
  }
}
</style>
