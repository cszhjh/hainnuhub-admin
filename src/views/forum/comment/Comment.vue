<template>
  <div>
    <div class="top-panel">
      <el-form :model="searchFormData" label-width="50px">
        <el-row>
          <el-col :span="4">
            <el-form-item label="内容">
              <el-input
                placeholder="支持模糊搜索"
                v-model="searchFormData.contentFuzzy"
                clearable
                @keyup.enter="loadDataList"
              />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="昵称">
              <el-input
                placeholder="请输入昵称"
                v-model="searchFormData.usernameFuzzy"
                clearable
                @keyup.enter="loadDataList"
              />
            </el-form-item>
          </el-col>
          <el-col style="margin: 14px; margin-left: 30px" :span="4">
            <el-button-group style="width: 100%">
              <el-button type="primary" @click="loadDataList">搜索</el-button>
              <el-button
                type="danger"
                @click="removeBatch"
                :disabled="!selectBatchList.length"
              >
                批量删除
              </el-button>
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
        :options="tableOptions"
        ref="tableRef"
        @rowSelected="rowSelected"
        @pageSizeChange="pageSizeChange"
        @pageNoChange="pageNoChange"
      >
        <!-- 用户信息 -->
        <template #userInfo="{ row }">
          <Avatar :userId="row.user.id" :width="50" />
          <div class="name-info">
            <div>
              <a
                :href="USER_BASE_URL + row.user.id"
                class="a-link-anim"
                target="_black"
                >{{ row.user.username }}</a
              >
            </div>
          </div>
        </template>

        <!-- 查看文章 -->
        <template #contentInfo="{ row }">
          <div v-html="row.content"></div>
          <div v-if="row.images">
            <CommentImage :srcList="row.images" :size="80" />
          </div>
          <span>
            <a
              :href="ARTICLE_BASE_URL + row.forumId"
              class="a-link-anim"
              target="_black"
            >
              查看文章
            </a>
          </span>
        </template>

        <!-- 获赞 -->
        <template #goodCount="{ row }">
          <span>{{ row.goodCount }}</span>
        </template>

        <!-- 获赞 -->
        <template #commentType="{ row }">
          <span>{{ row.commentType ? "是" : "否" }}</span>
        </template>

        <!-- 发布时间 -->
        <template #createTime="{ row }">
          <span v-format-time="row.createTime"></span>
        </template>

        <!-- 操作 -->
        <template #option="{ row }">
          <div class="option">
            <el-button type="danger" @click="removeComment(row)">
              删除
            </el-button>
          </div>
        </template>
      </Table>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import {
  getCommentFuzzyRequest,
  removeCommentRequest
} from "@/service/comment/comment";
import columns from "./config/column-config";
import confirm from "@/utils/confirm";
import { USER_BASE_URL, ARTICLE_BASE_URL } from "@/constants/base-url-config";

import CommentImage from "@/components/comment-image/CommentImage";

const searchFormData = ref({});

const tableData = ref({});
const tableOptions = {
  selectType: "checkbox"
};

const loadDataList = async () => {
  try {
    const { pageNo, pageSize } = tableData.value;
    const params = {
      offset: (pageNo - 1) * pageSize || undefined,
      size: tableData.value.pageSize
    };

    Object.assign(params, searchFormData.value);

    const { data } = await getCommentFuzzyRequest(params);
    data.list = data.commentList;
    tableData.value = data;
  } catch (error) {
    console.log(error);
  }
};

loadDataList();

// 批量选择
const selectBatchList = ref([]);
const rowSelected = (rows) => {
  selectBatchList.value = [];
  rows.forEach((item) => {
    selectBatchList.value.push(item.id);
  });
};

// 删除
const removeComment = (data) => {
  confirm("将从数据库中彻底删除，确定要删除吗？", async () => {
    try {
      await removeCommentRequest({
        commentIds: data.id
      });
      loadDataList();
      ElNotification.success({
        title: "操作",
        message: "删除成功"
      });
    } catch (error) {
      console.log(error);
    }
  });
};

// 批量删除
const tableRef = ref(null);
const removeBatch = () => {
  confirm("将从数据库中彻底删除，确定要删除吗？", async () => {
    try {
      await removeCommentRequest({
        commentIds: selectBatchList.value.join(",")
      });
      console.log("object");
      tableRef.value.clearSelection();
      loadDataList();
      ElNotification.success({
        title: "操作",
        message: "删除成功"
      });
    } catch (error) {
      console.log(error);
    }
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
  .user-info {
    display: flex;
    align-items: center;
    .name-info {
      margin-left: 5px;
      font-size: 13px;
    }
  }
}
</style>
