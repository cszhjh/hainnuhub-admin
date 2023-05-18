export default [
  {
    label: "用户信息",
    prop: "avatar",
    width: 200,
    scopedSlots: "userInfo"
  },
  {
    label: "评论内容",
    prop: "content",
    scopedSlots: "contentInfo"
  },
  {
    label: "获赞",
    width: 150,
    scopedSlots: "goodCount"
  },
  {
    label: "一级评论",
    width: 150,
    scopedSlots: "commentType"
  },
  {
    label: "评论时间",
    width: 180,
    scopedSlots: "createTime"
  },
  {
    label: "操作",
    prop: "option",
    width: 120,
    scopedSlots: "option"
  }
];
