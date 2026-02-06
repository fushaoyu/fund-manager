<template>
  <el-table
    ref="tableRef"
    v-bind="$attrs"
    :header-cell-style="headerStyle"
    :data="tableData"
    style="width: 100%"
    :height="height"
    :row-key="rowKey"
    scrollbar-always-on
    border
    :span-method="spanMethod"
    @selection-change="handleSelectionChange"
    @select-all="handleSelectAll"
  >
    <template #empty>
      <el-empty description="暂无数据" :image-size="80" />
    </template>
    <!-- 渲染顶级列 -->
    <table-columns
      v-for="(item, index) in columns"
      :key="item?.key ?? index"
      :column="item"
    >
      <template v-for="(_, name) in $slots" #[name]="scope">
        <slot :name="name" v-bind="scope || {}"></slot>
      </template>
    </table-columns>
  </el-table>
</template>

<script lang="ts" setup>
import type { TableInstance } from 'element-plus';
import TableColumns from './tableColumns.vue'; // 引入新组件

const props = defineProps({
  rowKey: {
    type: String,
    default: 'id',
  },
  // 表格数据
  tableData: {
    type: Array,
    default: () => [],
  },
  // 表格列
  columns: {
    type: Array as any,
    default: () => [] as any[],
  },
  height: {
    type: [String, Number],
    default: 'auto',
  },
  // 合并单元格
  spanMethod: {
    type: Function as any,
    default: () => {},
  },
  headerStyle: {
    type: Object,
    default: {
      backgroundColor: '#fff',
      fontWeight: 'bold',
      color: '#909399',
    },
  },
  // 最大选择数量，0或不设置表示无限制
  maxSelectionCount: {
    type: Number,
    default: 0,
  },
});

const emit = defineEmits(['selectionChange', 'selectAll']);

const tableRef = ref<TableInstance>();
// 用于标记是否是组件内部触发的选择变化，避免重复触发事件
let isInternalSelectionChange = false;

const handleSelectionChange = (val: any) => {
  // 如果是组件内部触发的选择变化，不向外发射事件
  if (isInternalSelectionChange) {
    return;
  }

  // 确保选择数量不超过最大限制
  if (props.maxSelectionCount > 0 && val.length > props.maxSelectionCount) {
    // 如果超过限制，保留前maxSelectionCount个
    const limitedSelection = val.slice(0, props.maxSelectionCount);

    // 清除当前选择并重新选择符合限制的项
    nextTick(() => {
      // 设置标志位，表示接下来的选择变化是组件内部触发的
      isInternalSelectionChange = true;

      tableRef.value?.clearSelection();
      limitedSelection.forEach((row: any) => {
        tableRef.value?.toggleRowSelection(row, true, true);
      });

      // 在下一个事件循环中重置标志位
      nextTick(() => {
        isInternalSelectionChange = false;
      });
    });

    emit('selectionChange', limitedSelection);
    return;
  }
  emit('selectionChange', val);
};

const handleSelectAll = (val: any) => {
  // 如果是组件内部触发的选择变化，不向外发射事件
  if (isInternalSelectionChange) {
    return;
  }

  // 全选时也遵循选择数量限制
  if (props.maxSelectionCount > 0 && val.length > props.maxSelectionCount) {
    // 限制全选数量
    const limitedSelection = val.slice(0, props.maxSelectionCount);

    // 清除当前选择并重新选择符合限制的项
    nextTick(() => {
      // 设置标志位，表示接下来的选择变化是组件内部触发的
      isInternalSelectionChange = true;

      tableRef.value?.clearSelection();
      limitedSelection.forEach((row: any) => {
        tableRef.value?.toggleRowSelection(row, true, true);
      });

      // 在下一个事件循环中重置标志位
      nextTick(() => {
        isInternalSelectionChange = false;
      });
    });

    emit('selectAll', limitedSelection);
    return;
  }
  emit('selectAll', val);
};

// 批量操作
const toggleRowSelection = (
  rows: any,
  selected?: boolean,
  ignoreSelectable: boolean = true,
): void => {
  if (rows) {
    // 获取当前已选择的行数
    const currentSelection = tableRef.value?.getSelectionRows() || [];

    rows.forEach((row: any) => {
      // 只有在需要选择且未达到最大限制时才执行选择操作
      if (selected) {
        // 检查是否已达到最大选择数量
        if (
          props.maxSelectionCount <= 0 ||
          currentSelection.length < props.maxSelectionCount
        ) {
          tableRef.value?.toggleRowSelection(row, selected, ignoreSelectable);
        }
      } else {
        // 取消选择不受限制
        tableRef.value?.toggleRowSelection(row, selected, ignoreSelectable);
      }
    });
  }
};
// 清除选择
const clearSelection = () => {
  tableRef.value?.clearSelection();
};
// 	用于多选表格，切换全选和全不选
const toggleAllSelection = () => {
  tableRef.value?.toggleAllSelection();
};
// 返回当前选中的行
const getSelectionRows = () => {
  return tableRef.value?.getSelectionRows();
};
// 用于清空排序条件，数据会恢复成未排序的状态
const clearSort = () => {
  tableRef.value?.clearSort();
};
defineExpose({
  toggleRowSelection,
  clearSelection,
  toggleAllSelection,
  getSelectionRows,
  clearSort,
});
</script>
