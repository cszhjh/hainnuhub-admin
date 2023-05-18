<template>
  <div>
    <el-table
      :data="dataSource?.list || []"
      :height="tableHeight"
      :stripe="options?.stripe"
      :border="options?.border"
      highlight-current-row
      ref="tableRef"
      @row-click="handleRowClick"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        v-if="options.selectType && options.selectType == 'checkbox'"
        type="selection"
        width="50"
        align="center"
      />
      <el-table-column
        v-if="options.showIndex"
        label="序号"
        type="index"
        width="60"
        align="center"
      />
      <template v-for="(column, index) in columns">
        <template v-if="column.scopedSlots">
          <el-table-column
            :key="index"
            :prop="column.prop"
            :label="column.label"
            :align="column.align || 'left'"
            :width="column.width"
          >
            <template #default="scope">
              <slot
                :name="column.scopedSlots"
                :index="scope.$index"
                :row="scope.row"
              />
            </template>
          </el-table-column>
        </template>
        <template v-else>
          <el-table-column
            :key="index"
            :prop="column.prop"
            :label="column.label"
            :align="column.align || 'left'"
            :width="column.width"
            :fixed="column.fixed"
          />
        </template>
      </template>
    </el-table>
    <div class="pagination" v-if="showPagination">
      <el-pagination
        v-if="dataSource?.dataTotal"
        background
        :total="dataSource?.dataTotal"
        :page-size="dataSource?.pageSize"
        :page-sizes="[5, 10, 30, 50, 100]"
        :current-page="dataSource?.pageNo"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handlePageSizeChange"
        @current-change="handlePageNoChange"
        style="text-align: right"
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const props = defineProps({
  dataSource: {
    type: Object
  },
  showPagination: {
    type: Boolean,
    default: true
  },
  options: {
    type: Object,
    default: () => {
      return {
        selectType: "",
        tableHeight: null,
        stripe: true,
        border: false,
        extHeight: 0,
        showIndex: false
      };
    }
  },
  columns: {
    type: Array,
    default: () => []
  },
  fetch: {
    type: Function
  },
  initFetch: {
    type: Boolean,
    default: true
  }
});

const topHeight = 50 + 39 + 60 + 52;

const tableHeight = ref(
  props.options?.tableHeight ||
    window.innerHeight - topHeight - (props.options.extHeight || 0)
);

const init = () => {
  if (props.initFetch && props.fetch) {
    props.fetch();
  }
};
init();

const tableRef = ref();

const clearSelection = () => {
  tableRef.value.clearSelection();
};

const setCurrentRow = (rowKey, rowValue) => {
  let row = props.dataSource.list.find((item) => {
    return item[rowKey] === rowValue;
  });
  tableRef.value.setCurrentRow(row);
};

defineExpose({ setCurrentRow, clearSelection });

const emit = defineEmits([
  "rowSelected",
  "rowClick",
  "pageSizeChange",
  "pageNoChange"
]);

const handleRowClick = (row) => {
  emit("rowClick", row);
};

const handleSelectionChange = (row) => {
  emit("rowSelected", row);
};

const handlePageSizeChange = (size) => {
  emit("pageSizeChange", size);
  props.fetch();
};

const handlePageNoChange = (pageNo) => {
  emit("pageNoChange", pageNo);
  props.fetch();
};
</script>

<style lang="scss" scoped>
.pagination {
  padding-top: 10px;
}

.el-pagination {
  justify-content: right;
}

.el-table__body tr.current-row > td.el-table__cell {
  background-color: #e6f0f9;
}

.el-table__body tr:hover > td.el-table__cell {
  background-color: #e6f0f9 !important;
}
</style>
