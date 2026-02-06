<template>
  <el-table-column
    :label="column.title"
    :prop="column.key"
    :current-row-key="column.key"
    v-bind="column.options"
  >
    <!-- 自定义列（有插槽） -->
    <template #default="{ row }" v-if="column.slotName">
      <slot :name="column.slotName" :row="row">{{ column.slotName }}</slot>
    </template>

    <template v-if="column.chidren?.length">
      <!-- 递归渲染子列 -->
      <table-columns
        v-for="(child, index) in column.chidren || []"
        :key="child.key || index"
        :column="child"
      >
        <!-- 传递插槽到下一级 -->
        <template v-for="(_, name) in Object.keys($slots)" :key="name" #[name]>
          <slot :name="name"></slot>
        </template>
      </table-columns>
    </template>
  </el-table-column>
</template>

<script lang="ts" setup>
import TableColumns from './tableColumns.vue';

// 定义列配置类型（支持递归）
interface ColumnConfig {
  key?: string;
  title: string;
  slotName?: string;
  chidren?: ColumnConfig[];
  options?: Record<string, any>;
}

defineProps<{
  column: ColumnConfig;
}>();
</script>
