export default [
  {
    label: "用户信息",
    prop: "avatar",
    width: 200,
    scopedSlots: "userInfo"
  },
  {
    label: "封面",
    prop: "cover",
    width: 100,
    scopedSlots: "cover"
  },
  {
    label: "标题",
    scopedSlots: "titleInfo"
  },
  {
    label: "标签",
    width: 200,
    scopedSlots: "labelInfo"
  },
  {
    label: "互动信息",
    width: 150,
    scopedSlots: "interactionInfo"
  },
  {
    label: "是否有附件",
    prop: "attachment",
    width: 100,
    scopedSlots: "attachmentInfo"
  },
  {
    label: "状态信息",
    prop: "status",
    width: 100,
    scopedSlots: "statusInfo"
  },
  {
    label: "发布时间",
    prop: "createTime",
    width: 180,
    scopedSlots: "createTime"
  },
  {
    label: "操作",
    prop: "option",
    width: 80,
    scopedSlots: "option"
  }
];
