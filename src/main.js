import { createApp } from "vue";

import "element-plus/dist/index.css";
import "normalize.css";
import "./assets/css/index.scss";
import "./assets/icon/iconfont.css";

import App from "./App";
import router from "./router";
import registerDirectives from "./directives";
import { dispatchEventStroage } from "@/utils/utils";

const app = createApp(App);

app.use(registerDirectives);
app.use(router);
app.use(dispatchEventStroage);

app.mount("#app");
