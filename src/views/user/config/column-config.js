export default [
  {
    label: "头像",
    prop: "avatar",
    width: 80,
    scopedSlots: "avatar"
  },
  {
    label: "昵称",
    prop: "username",
    width: 150,
    scopedSlots: "username"
  },
  {
    label: "邮箱",
    prop: "email",
    width: 180
  },
  {
    label: "性别",
    prop: "sex",
    width: 80
  },
  {
    label: "个性签名",
    prop: "description"
  },

  {
    label: "角色",
    prop: "role",
    width: 120,
    scopedSlots: "role"
  },
  {
    label: "注册日期",
    prop: "createTime",
    width: 180,
    scopedSlots: "createTime"
  },
  {
    label: "最后登录日期",
    prop: "lastLoginTime",
    width: 180,
    scopedSlots: "lastLoginTime"
  },
  {
    label: "操作",
    prop: "option",
    width: 120,
    scopedSlots: "option"
  }
];
