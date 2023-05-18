<template>
  <div class="settings">
    <el-form
      :model="formData"
      :rules="rules"
      label-width="150px"
      style="width: 800px"
      ref="formRef"
    >
      <el-divider content-position="left">用户注册欢迎信息</el-divider>
      <el-row>
        <el-col :span="24">
          <el-form-item label="欢迎消息" prop="registerWelcomeInfo">
            <el-input
              v-model="formData.registerWelcomeInfo"
              placeholder="请输入注册欢迎消息"
              :maxlength="250"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-divider content-position="left">邮件设置</el-divider>
      <el-row>
        <el-col :span="24">
          <el-form-item label="邮件标题" prop="emailTitle">
            <el-input
              v-model="formData.emailTitle"
              placeholder="请输入邮件标题"
              :maxlength="100"
            />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="邮件内容" prop="emailContent">
            <el-input
              type="textarea"
              :rows="10"
              resize="none"
              v-model="formData.emailContent"
              placeholder="请输入邮件内容，验证码使用 %s 占位符"
              :maxlength="250"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-divider content-position="left">审核设置</el-divider>
      <el-row>
        <el-col :span="24">
          <el-form-item label="帖子是否需要审核" prop="forumAudit">
            <el-radio-group v-model="formData.forumAudit">
              <el-radio :label="1">需要审核</el-radio>
              <el-radio :label="0">无需审核</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item>
        <el-button type="primary" @click="saveSetting">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";
import {
  getSettingsRequest,
  settingsRequest
} from "@/service/settings/settings";

const rules = {
  registerWelcomeInfo: [
    { required: true, message: "请输入欢迎信息", trigger: "blur" }
  ],
  emailTitle: [{ required: true, message: "请输入邮件标题", trigger: "blur" }],
  emailContent: [
    { required: true, message: "请输入邮件内容", trigger: "blur" }
  ],
  forumAudit: [
    { required: true, message: "请选择评论是否需要审核", trigger: "blur" }
  ]
};

const formRef = ref(null);
const formData = ref({});

const getSettings = async () => {
  try {
    const result = await getSettingsRequest();
    formData.value = result.data;
  } catch (error) {
    console.log(result);
  }
};
getSettings();

const saveSetting = () => {
  formRef.value.validate(async (valid) => {
    if (!valid) return;
    try {
      await settingsRequest(formData.value);
      ElNotification.success({
        title: "操作",
        message: "保存成功"
      });
    } catch (error) {
      console.log(error);
    }
  });
};
</script>

<style lang="scss" scoped>
.settings {
  ::v-deep(.el-divider__text) {
    background-color: var(--body-bg);
  }
}
</style>
