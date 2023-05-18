import { ElMessage } from "element-plus";
import router from "@/router";

export const interceptors = {
  requestInterceptor(config) {
    return config;
  },
  responseInterceptorCatch(err) {
    if (err.response?.status === 401) {
      ElMessage.error(err.response.data.message);
      router.push("/login");
    }
    return err;
  }
};
