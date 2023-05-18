<template>
  <div>
    <div class="top-panel">
      <el-form :model="searchFormData" label-width="50px">
        <el-row>
          <el-col :span="4">
            <el-form-item label="昵称">
              <el-input
                placeholder="支持模糊搜索"
                v-model="searchFormData.usernameFuzzy"
                clearable
                @keyup.enter="loadDataList"
              />
            </el-form-item>
          </el-col>
          <el-col :span="3">
            <el-form-item label="性别">
              <el-select
                placeholder="请选择性别"
                clearable
                v-model="searchFormData.sex"
              >
                <el-option value="男" label="男" />
                <el-option value="女" label="女" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="3">
            <el-form-item label="角色">
              <el-select
                placeholder="请选择角色"
                clearable
                v-model="searchFormData.power"
              >
                <el-option :value="-1" label="超级管理员" />
                <el-option :value="1" label="管理员" />
                <el-option :value="0" label="用户" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col style="margin: 14px; margin-left: 30px" :span="4">
            <el-button-group style="width: 100%">
              <el-button type="primary" @click="loadDataList">搜索</el-button>
            </el-button-group>
          </el-col>
        </el-row>
      </el-form>
    </div>

    <div class="data-list">
      <Table
        :columns="columns"
        :dataSource="tableData"
        :fetch="loadDataList"
        @pageSizeChange="pageSizeChange"
        @pageNoChange="pageNoChange"
      >
        <!-- 头像 -->
        <template #avatar="{ row }">
          <Avatar :userId="row.id" />
        </template>

        <!-- 用户名 -->
        <template #username="{ row }">
          <span>{{ row.username }}</span>
          <span>{{ row.six }}</span>
        </template>

        <!-- 加入时间 -->
        <template #createTime="{ row }">
          <span v-format-time="row.createTime"></span>
        </template>

        <!-- 登录信息 -->
        <template #lastLoginTime="{ row }">
          <span v-format-time="row.lastLoginTime"></span>
        </template>

        <!-- 角色 -->
        <template #role="{ row }">
          <div>{{ getRoleInfo(row.power) }}</div>
        </template>

        <!-- 操作 -->
        <template #option="{ row }">
          <div class="option">
            <el-dropdown trigger="click">
              <i class="iconfont icon-more"></i>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item
                    v-if="currentUserPower === -1"
                    @click="setRole(row)"
                  >
                    设为管理员
                  </el-dropdown-item>
                  <el-dropdown-item @click="sendMessage(row)">
                    发送系统通知
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </template>
      </Table>
    </div>
    <UserSendMessage ref="userSendMessageRef" />
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { getUserListFuzzyRequest, setRoleRequest } from "@/service/user/user";
import columns from "./config/column-config";
import confirm from "@/utils/confirm";
import localCache from "@/utils/cache";
import { USER_BASE_URL, ARTICLE_BASE_URL } from "@/constants/base-url-config";
import UserSendMessage from "./components/UserSendMessage";

const currentUserInfo = localCache.getCache("userInfo");
const currentUserId = currentUserInfo.id;
const currentUserPower = currentUserInfo.power;

const searchFormData = ref({});

const tableData = ref({});

const loadDataList = async () => {
  try {
    const { pageNo, pageSize } = tableData.value;
    const params = {
      offset: (pageNo - 1) * pageSize || undefined,
      size: tableData.value.pageSize
    };

    Object.assign(params, searchFormData.value);

    const { data } = await getUserListFuzzyRequest(params);
    data.list = data.userList;
    tableData.value = data;
  } catch (error) {
    console.log(error);
  }
};

loadDataList();

const setRole = (row) => {
  confirm(`将提升用户“${row.username}”为管理员角色，你确定吗？`, async () => {
    try {
      await setRoleRequest({ userId: row.id });
      loadDataList();
      ElNotification.success({
        title: "操作",
        message: "修改成功"
      });
    } catch (error) {
      console.log(error);
    }
  });
};

const getRoleInfo = computed(() => {
  return (power) => {
    switch (power) {
      case -1:
        return "超级管理员";
      case 1:
        return "管理员";
      default:
        return "用户";
    }
  };
});

const userSendMessageRef = ref(null);
const sendMessage = (row) => {
  userSendMessageRef.value.sendMessage({
    ...row,
    receivedUserId: currentUserId
  });
};

const pageSizeChange = (size) => {
  tableData.value.pageSize = size;
  tableData.value.pageNo = 1;
};

const pageNoChange = (pageNo) => {
  tableData.value.pageNo = pageNo;
};
</script>

<style lang="scss" scoped>
.top-panel {
  .el-form .el-form-item {
    margin: 14px 0;
  }
}
.data-list {
  .option {
    .iconfont {
      cursor: pointer;
    }
  }
}
</style>
