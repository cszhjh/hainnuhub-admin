import { createRouter, createWebHistory } from "vue-router";
import localCache from "@/utils/cache";

const routes = [
  {
    path: "/",
    redirect: "/login"
  },
  {
    path: "/login",
    name: "login",
    component: () => import("@/views/login/Login")
  },
  {
    path: "/main",
    name: "首页",
    redirect: "forum/article",
    component: () => import("@/views/main/Main"),
    children: [
      {
        path: "/forum",
        name: "内容管理",
        redirect: "forum/article",
        children: [
          {
            path: "article",
            name: "帖子管理",
            component: () => import("@/views/forum/article/Article")
          },
          {
            path: "comment",
            name: "评论管理",
            component: () => import("@/views/forum/comment/Comment")
          }
        ]
      },
      {
        path: "/user",
        name: "用户管理",
        redirect: "user/list",
        children: [
          {
            path: "list",
            name: "用户列表",
            component: () => import("@/views/user/User")
          }
        ]
      },
      {
        path: "/settings",
        name: "设置",
        redirect: "settings/sys",
        children: [
          {
            path: "sys",
            name: "系统设置",
            component: () => import("@/views/settings/Settings")
          }
        ]
      }
    ]
  }
];

const router = createRouter({
  routes,
  history: createWebHistory()
});

router.beforeEach(async (to, from, next) => {
  const token = localCache.getCache("token");
  if (to.path === "/login") {
    if (token) {
      next("/main");
    } else {
      next();
    }
  } else {
    if (token) {
      next();
    } else {
      next("/login");
    }
  }
});

export default router;
