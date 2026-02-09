<template>
  <el-upload
    class="upload-demo"
    action=""
    :show-file-list="false"
    :http-request="handleHttpRequest"
  >
    <template #trigger>
      <el-button v-bind="$attrs">{{ name }}</el-button>
    </template>
  </el-upload>
</template>
<script lang="ts" setup>
import type { UploadRequestOptions } from 'element-plus';
import { useElMessageBox } from '@/hooks/useElMessageBox';

const { errorToast } = useElMessageBox();
const props = defineProps({
  name: {
    type: String,
    default: '上传文件',
  },
});
const emit = defineEmits(['onChange']);

const handleHttpRequest = (options: UploadRequestOptions): any => {
  const file = options.file;
  // 只能上传 Excel 文件
  if (!file.name.endsWith('.xlsx')) return errorToast('只能上传 Excel 文件');
  emit('onChange', file);
};
</script>
<style lang="scss" scoped></style>
