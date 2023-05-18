<template>
  <div>
    <Dialog
      :show="dialogConfig.show"
      :title="dialogConfig.title"
      :buttons="dialogConfig.buttons"
      width="400px"
      :showCancel="true"
      @close="dialogConfig.show = false"
    >
      <el-form :model="formData" label-width="80px" ref="formRef">
        <el-form-item label="标题">
          {{ formData.title }}
        </el-form-item>
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
            v-model="formData.labels"
          >
            <el-option
              v-for="label in labelList"
              :label="label.name"
              :value="label"
              :key="label"
            />
          </el-select>
        </el-form-item>
      </el-form>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, reactive, nextTick } from "vue";
import { updateLabelRequest } from "@/service/forum/forum";

import Dialog from "@/components/dialog/Dialog";

const props = defineProps({
  labelList: {
    type: Array,
    default: () => []
  }
});

const dialogConfig = reactive({
  show: false,
  title: "修改标签",
  buttons: [
    {
      type: "primary",
      text: "确定",
      click: () => {
        submit();
      }
    }
  ]
});

const formData = ref({});
const formRef = ref(null);

const emit = defineEmits(["reload"]);
const submit = async () => {
  try {
    await updateLabelRequest({
      forumId: formData.value.id,
      labels: formData.value.labels
    });
    dialogConfig.show = false;
    ElNotification.success({
      title: "操作",
      message: "修改成功"
    });
    emit("reload");
  } catch (error) {
    console.log(error);
  }
};

const updateLabel = (data) => {
  dialogConfig.show = true;
  nextTick(() => {
    formRef.value?.resetFields();
    formData.value.title = data.title;
    formData.value.id = data.id;
    formData.value.labels = data.labels;
  });
};

defineExpose({
  updateLabel
});
</script>

<style lang="scss" scoped></style>
