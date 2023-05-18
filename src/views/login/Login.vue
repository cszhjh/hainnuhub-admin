<template>
  <div class="login">
    <div class="login-panel">
      <div class="login-title">管理员登录</div>
      <el-form :model="account" :rules="rules" ref="formRef">
        <el-form-item prop="email">
          <el-input
            clearable
            placeholder="请输入邮箱地址"
            v-model="account.email"
            size="large"
            @keyup.enter="submit"
          >
            <template #prefix>
              <span class="iconfont icon-account"></span>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="code">
          <div class="send-email-panel">
            <el-input
              size="large"
              clearable
              placeholder="请输入验证码"
              v-model="account.code"
              @keyup.enter="submit"
            >
              <template #prefix>
                <span class="iconfont icon-checkcode"></span>
              </template>
            </el-input>
            <Submit
              :countDown="true"
              message="获取验证码"
              loadingMessage="正在获取"
              ref="emailCodeRef"
              @click="getEmailCode"
            />
          </div>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            clearable
            placeholder="请输入密码"
            show-password
            v-model="account.password"
            size="large"
            @keyup.enter="submit"
          >
            <template #prefix>
              <span class="iconfont icon-password"></span>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item class="submit">
          <Submit
            :isFill="true"
            message="登录"
            loadingMessage="登录中"
            ref="submitRef"
            @click="submit"
          />
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, nextTick } from "vue";
import { useRouter } from "vue-router";
import { sendEmailCodeRequest, loginRequest } from "@/service/user/user";
import localCache from "@/utils/cache";
import { rules } from "./config/login-config";

import Submit from "@/components/submit/Submit";

const router = useRouter();
const formRef = ref(null);
const account = reactive({
  email: "",
  password: "",
  code: ""
});
const emailCodeRef = ref(null);
const submitRef = ref(null);

const login = () => {
  nextTick(() => {
    formRef.value.resetFields();
  });
};

// 获取验证码前必填邮箱地址
const getEmailCode = () => {
  formRef.value.validateField("email", async (isValid) => {
    if (isValid) {
      if (!emailCodeRef.value.timer) {
        // 发送验证码，并显示加载动画
        emailCodeRef.value.start();
        try {
          // 开始倒数
          emailCodeRef.value.openCountDown();
          await sendEmailCodeRequest({ email: account.email });
          emailCodeRef.value.openCountDown();
        } catch (error) {
          emailCodeRef.value.finish();
        }
      }
    } else {
      ElMessage({
        type: "error",
        message: "请输入正确的邮箱地址！"
      });
    }
  });
};

// 注册 / 重置密码
const submit = () => {
  formRef.value?.validate(async (isValid) => {
    if (!isValid) return;

    // 开始加载动画
    submitRef.value.start();

    // 登录
    try {
      const result = await loginRequest(account);
      const { token, userInfo } = result.data ?? {};

      localCache.setCache("token", token);
      localCache.setCache("userInfo", userInfo);

      router.push("/main");
    } catch (error) {
      console.log(error);
    }

    // 网络请求结束，按钮恢复点击
    submitRef.value.finish();
  });
};
</script>

<style lang="scss" scoped>
.login {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background: url("../../assets/image/login-bg.svg");
  .login-panel {
    width: 500px;
    padding: 60px;
    background: rgba(255, 255, 255, 0.25);
    border: 1px solid #fff;
    border-bottom: 1px solid rgba(255, 255, 255, 0.5);
    border-right: 1px solid rgba(255, 255, 255, 0.5);
    border-radius: 20px;
    gap: 30px;
    box-shadow: 0 25px 50px rgba(0, 0, 0, 0.1);
    .login-title {
      text-align: center;
      font-size: 2em;
      font-weight: 600;
      margin-bottom: 30px;
      color: #4c4c4c;
    }
    .send-email-panel {
      width: 100%;
      display: flex;
      justify-content: space-between;
    }
    .submit {
      margin-bottom: 0;
    }
    .a-link-anim::after {
      bottom: 3px;
    }
  }
}
</style>
