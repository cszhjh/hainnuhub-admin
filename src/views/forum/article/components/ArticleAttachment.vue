<template>
  <Dialog
    :show="dialogConfig.show"
    :title="dialogConfig.title"
    :buttons="dialogConfig.buttons"
    width="500px"
    :showCancel="false"
    @close="dialogConfig.show = false"
  >
    <el-form :model="formData" label-width="120px">
      <el-form-item label="发表人">
        <Avatar :userId="formData.userId" :width="40" />
        <span style="margin-left: 5px">{{ formData.username }}</span>
      </el-form-item>
      <el-form-item label="文件名">
        {{ formatFilename(formData.filename) }}
      </el-form-item>
      <el-form-item label="大小">
        {{ formatSize(formData.size) }}
      </el-form-item>
      <el-form-item>
        <a
          class="a-link"
          target="_black"
          ref="downloadRef"
          :download="formatFilename(formData.filename)"
        >
          下载
        </a>
      </el-form-item>
    </el-form>
  </Dialog>
</template>

<script setup>
import { ref, reactive } from "vue";
import { getAttachmentInfoRequest } from "@/service/forum/forum";
import { formatFilename, formatSize } from "@/utils/utils";

import Dialog from "@/components/dialog/Dialog";
import Avatar from "@/components/avatar/Avatar";

const dialogConfig = reactive({
  show: false,
  title: "查看附件",
  buttons: [
    {
      text: "关闭",
      click: () => {
        dialogConfig.show = false;
      }
    }
  ]
});

const formData = ref({});
const downloadRef = ref(null);
const show = async (username, userId, forumId) => {
  dialogConfig.show = true;
  try {
    const result = await getAttachmentInfoRequest({
      forumId
    });
    formData.value = result.data;
    formData.value.username = username;
    formData.value.userId = userId;
    downloadRef.value.href = `/api/forum/attachment/download/${forumId}`;
  } catch (error) {
    console.log(error);
  }
};

defineExpose({ show });
</script>

<style lang="scss" scoped></style>
