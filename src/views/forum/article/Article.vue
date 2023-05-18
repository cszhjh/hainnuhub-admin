<template>
  <div>
    <div class="top-panel">
      <el-form :model="searchFormData" label-width="50px">
        <el-row>
          <el-col :span="4">
            <el-form-item label="标题">
              <el-input
                placeholder="请输入标题"
                v-model="searchFormData.titleFuzzy"
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
          <el-col :span="3">
            <el-form-item label="标签">
              <el-select
                placeholder="请选择标签"
                multiple
                clearable
                collapse-tags
                collapse-tags-tooltip
                filterable
                :multiple-limit="3"
                value-key="id"
                v-model="searchFormData.labelIds"
              >
                <el-option
                  v-for="label in labelList"
                  :label="label.name"
                  :value="label.id"
                  :key="label"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="3">
            <el-form-item label="附件">
              <el-select
                placeholder="是否有附件"
                clearable
                v-model="searchFormData.attachmentType"
              >
                <el-option :value="1" label="有附件" />
                <el-option :value="0" label="无附件" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="3">
            <el-form-item label="状态">
              <el-select
                placeholder="请选择状态"
                clearable
                v-model="searchFormData.status"
                style="width: 100%"
              >
                <el-option :value="0" label="待审核" />
                <el-option :value="1" label="已审核" />
                <el-option :value="-1" label="已删除" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col style="margin: 14px; margin-left: 30px" :span="4">
            <el-button-group style="width: 100%; display: flex">
              <el-button type="primary" @click="loadDataList">搜索</el-button>
              <el-button
                type="success"
                @click="auditBatch"
                :disabled="!selectBatchList.length"
              >
                批量审核
              </el-button>
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
          <Avatar :userId="row.author.id" :width="50" />
          <div class="name-info">
            <div>
              <a
                :href="USER_BASE_URL + row.author.id"
                class="a-link-anim"
                target="_black"
                >{{ row.author.username }}</a
              >
            </div>
          </div>
        </template>

        <!-- 封面 -->
        <template #cover="{ row }">
          <Cover :cover="row.cover" />
        </template>

        <!-- 标题 -->
        <template #titleInfo="{ row }">
          <a
            :href="ARTICLE_BASE_URL + row.id"
            class="a-link-anim"
            target="_black"
          >
            {{ row.title }}
          </a>
        </template>

        <!-- 标签 -->
        <template #labelInfo="{ row }">
          <div>
            <span v-for="(label, index) in row.labels" :key="label">
              {{ index ? " /" : "" }} {{ label.name }}
            </span>
          </div>
        </template>

        <!-- 互动信息 -->
        <template #interactionInfo="{ row }">
          <div>阅读：{{ row.readCount }}</div>
          <div>获赞：{{ row.goodCount }}</div>
          <div>
            评论：<span>{{ row.commentCount }}</span>
            <span
              class="a-link-anim"
              style="margin-left: 5px"
              v-if="row.commentCount"
              @click="showComment(row.id)"
              >查看</span
            >
          </div>
        </template>

        <!-- 附件信息 -->
        <template #attachmentInfo="{ row }">
          <div v-if="!row.attachmentType">无附件</div>
          <div v-else>
            <span
              class="a-link-anim"
              @click="
                showAttachment(row.author.username, row.author.id, row.id)
              "
            >
              查看附件
            </span>
          </div>
        </template>

        <!-- 状态 -->
        <template #statusInfo="{ row }">
          <span v-if="row.status === 1" style="color: green">已审核</span>
          <span v-else-if="row.status === 0" style="color: red">待审核</span>
          <span v-else-if="row.status === -1" style="color: red">已删除</span>
        </template>

        <!-- 发布时间 -->
        <template #createTime="{ row }">
          <span v-format-time="row.createTime"></span>
        </template>

        <template #option="{ row }">
          <div class="option" v-if="row.status !== -1">
            <el-dropdown trigger="click">
              <i class="iconfont icon-more"></i>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item @click="audit(row)">
                    审核通过
                  </el-dropdown-item>
                  <el-dropdown-item @click="updateLabel(row)">
                    修改标签
                  </el-dropdown-item>
                  <el-dropdown-item @click="removeAudit(row)">
                    删除
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </template>
      </Table>
    </div>
    <!-- 修改标签 -->
    <ArticleLabel
      :labelList="labelList"
      ref="articleLabelRef"
      @reload="loadDataList"
    />
    <!-- 附件 -->
    <ArticleAttachment ref="articleAttachmentRef" />
    <!-- 评论 -->
    <ArticleComment ref="articleCommentRef" />
  </div>
</template>

<script setup>
import { ref, nextTick } from "vue";
import { getForumListFuzzyRequest, auditRequest } from "@/service/forum/forum";
import { getLablesRequest } from "@/service/labels/labels";
import confirm from "@/utils/confirm";
import columns from "./config/column-config";
import { USER_BASE_URL, ARTICLE_BASE_URL } from "@/constants/base-url-config";

import ArticleLabel from "./components/ArticleLabel";
import ArticleAttachment from "./components/ArticleAttachment";
import ArticleComment from "./components/ArticleComment.vue";
import Table from "@/components/table/Table";
import Avatar from "@/components/avatar/Avatar";
import Cover from "@/components/cover/Cover";

// 标签信息
const labelList = ref([]);
const loadLabelList = async () => {
  try {
    const result = await getLablesRequest();
    labelList.value = result.data;
  } catch (error) {
    console.log(error);
  }
};
loadLabelList();

// 修改标签
const articleLabelRef = ref(null);
const updateLabel = (data) => {
  articleLabelRef.value.updateLabel(data);
};

// 搜索
const searchFormData = ref({});

const tableOptions = ref({
  selectType: "checkbox",
  extHeight: 0
});
const tableData = ref({});
const loadDataList = async () => {
  try {
    const { pageNo, pageSize } = tableData.value;
    const params = {
      offset: (pageNo - 1) * pageSize || undefined,
      size: tableData.value.pageSize,
      labelIds: []
    };

    Object.assign(params, searchFormData.value);

    if (params.labelIds.length) {
      params.labelIds = params.labelIds.reduce((preId, curId) => {
        return preId + "," + curId;
      });
    }
    const { data } = await getForumListFuzzyRequest(params);
    data.list = data.forumList;
    tableData.value = data;
  } catch (error) {
    console.log(error);
  }
};

// 批量选择
const selectBatchList = ref([]);
const rowSelected = (rows) => {
  selectBatchList.value = [];
  rows.forEach((item) => {
    selectBatchList.value.push(item.id);
  });
};

// 批量审核
const tableRef = ref(null);
const auditBatch = () => {
  confirm("确定要审核吗？", async () => {
    try {
      await auditRequest({
        forumIds: selectBatchList.value.join(","),
        status: 1
      });
      tableRef.value.clearSelection();
      loadDataList();
      ElNotification.success({
        title: "操作",
        message: "审核成功"
      });
    } catch (error) {
      console.log(error);
    }
  });
};

// 单个审核
const audit = (data) => {
  confirm(`确定要审核《${data.title}》吗？`, async () => {
    try {
      await auditRequest({
        forumIds: data.id,
        status: 1
      });
      loadDataList();
      ElNotification.success({
        title: "操作",
        message: "审核成功"
      });
    } catch (error) {
      console.log(error);
    }
  });
};

// 删除单个
const removeAudit = (data) => {
  confirm(`删除后不可修改，确定要删除《${data.title}》吗？`, async () => {
    try {
      await auditRequest({
        forumIds: data.id,
        status: -1
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
const removeBatch = () => {
  confirm("删除后不可修改，确定要删除吗？", async () => {
    try {
      await auditRequest({
        forumIds: selectBatchList.value.join(","),
        status: -1
      });
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

// 附件
const articleAttachmentRef = ref(null);
const showAttachment = (username, userId, forumId) => {
  articleAttachmentRef.value.show(username, userId, forumId);
};

const articleCommentRef = ref(null);
const showComment = (forumId) => {
  articleCommentRef.value.show(forumId);
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
  .option {
    .iconfont {
      cursor: pointer;
    }
  }
}
</style>
