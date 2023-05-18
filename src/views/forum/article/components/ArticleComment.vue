<template>
  <Dialog
    :show="dialogConfig.show"
    :title="dialogConfig.title"
    :buttons="dialogConfig.buttons"
    width="700px"
    :showCancel="false"
    @close="dialogConfig.show = false"
  >
    <div class="comment-list">
      <div class="comment-item" v-for="item in commentList" :key="item">
        <div class="parent-comment-item">
          <Avatar :userId="item.user.id" :size="40" />
          <div class="content-info">
            <a
              :href="USER_BASE_URL + item.user.id"
              class="a-link-anim"
              target="_black"
            >
              {{ item.user.username }}
            </a>
            <div v-html="item.content" class="comment-content"></div>
            <div v-if="item.images">
              <ArticleCommentImage
                :srcList="item.images"
                :size="100"
                class="comment-image"
              />
            </div>
            <div class="post-info">
              <span>发表：<span v-format-time="item.createTime"></span></span>
              <span>获赞：{{ item.goodCount }}</span>
            </div>
            <div v-if="item.children">
              <div
                v-for="sub in item.children"
                class="children-comment-item"
                :key="sub"
              >
                <Avatar :userId="sub.user.id" :size="40" />
                <div class="content-info">
                  <a
                    :href="USER_BASE_URL + sub.user.id"
                    class="a-link-anim"
                    target="_black"
                  >
                    {{ sub.user.username }}
                  </a>
                  <span v-if="sub.replyUserId">
                    回复
                    <a
                      :href="USER_BASE_URL + sub.user.id"
                      class="a-link a-link"
                      target="_black"
                    >
                      {{ sub.replyUsername }}
                    </a>
                  </span>
                  <div v-html="sub.content" class="comment-content"></div>
                  <div class="post-info">
                    <span>
                      发表：<span v-format-time="sub.createTime"></span>
                    </span>
                    <span>获赞：{{ sub.goodCount }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Dialog>
</template>

<script setup>
import { ref, reactive } from "vue";
import { getCommentRequest } from "@/service/comment/comment";
import { USER_BASE_URL } from "@/constants/base-url-config";

import Dialog from "@/components/dialog/Dialog";
import Avatar from "@/components/avatar/Avatar";
import ArticleCommentImage from "@/components/comment-image/CommentImage.vue";

const dialogConfig = reactive({
  show: false,
  title: "查看评论",
  buttons: [
    {
      text: "关闭",
      click: () => {
        dialogConfig.show = false;
      }
    }
  ]
});

const commentList = ref([]);
const show = async (forumId) => {
  dialogConfig.show = true;
  try {
    const result = await getCommentRequest({ forumId });
    commentList.value = result.data.commentList;
  } catch (error) {
    console.log(error);
  }
};

defineExpose({ show });
</script>

<style lang="scss" scoped>
.comment-list {
  .comment-item {
    margin-top: 10px;
    border-bottom: 1px solid #ddd;
    padding: 10px 0;
    .parent-comment-item {
      display: flex;
      .comment-image {
        margin-bottom: 15px;
      }
    }
    .content-info {
      margin-left: 5px;
    }
    .comment-content {
      margin: 5px 0;
    }
    .post-info {
      font-size: 12px;
      color: rgb(135, 130, 130);
    }
    .children-comment-item {
      display: flex;
      margin-top: 10px;
    }
  }
}
</style>
