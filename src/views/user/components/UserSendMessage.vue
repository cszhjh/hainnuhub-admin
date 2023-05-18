<template>
  <Dialog
    :show="dialogConfig.show"
    :title="dialogConfig.title"
    :buttons="dialogConfig.buttons"
    width="500px"
    @close="dialogConfig.show = false"
  >
    <el-form :model="formData" :rules="rules" label-width="80px" ref="formRef">
      <el-form-item label="消息内容" prop="message">
        <el-input
          clearable
          placeholder="请输入消息内容"
          type="textarea"
          :rows="5"
          :maxlength="200"
          resize="none"
          v-model="formData.message"
        />
      </el-form-item>
    </el-form>
  </Dialog>
</template>

<script setup>
import { ref, reactive, nextTick } from "vue";
import { sendSystemMessageRequest } from "@/service/user/user";

import Dialog from "@/components/dialog/Dialog";

const dialogConfig = reactive({
  show: false,
  title: "发送系统通知",
  buttons: [
    {
      text: "确定",
      click: () => {
        submit();
      }
    }
  ]
});

const formData = ref({});
const formRef = ref(null);
const rules = {
  message: [{ required: true, message: "消息内容不能为空", trigger: "blur" }]
};

const sendMessage = (data) => {
  dialogConfig.show = true;
  nextTick(() => {
    formRef.value.resetFields();
    formData.value = {
      receivedUserId: data.receivedUserId,
      userId: data.id,
      username: data.username
    };
  });
};

defineExpose({ sendMessage });

const submit = () => {
  formRef.value.validate(async (valid) => {
    if (!valid) return;

    try {
      await sendSystemMessageRequest({ ...formData.value });
      ElNotification.success({
        title: "操作",
        message: "发送成功"
      });

      dialogConfig.show = false;
    } catch (error) {
      console.log(error);
    }
  });
};
</script>

<style lang="scss" scoped></style>
