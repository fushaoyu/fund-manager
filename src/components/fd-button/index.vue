<template>
  <el-button
    v-bind="omit(attrs, ['onClick'])"
    :loading="loading"
    @click.stop="handleClick"
  >
    <template #icon v-if="iconName">
      <el-icon :size="iconSize">
        <component :is="iconName" />
      </el-icon>
    </template>
    {{ name }}
  </el-button>
</template>
<script lang="ts" setup>
import { omit } from 'lodash';
defineProps({
  name: {
    type: String,
    default: '',
  },
  iconName: {
    type: String,
    default: '',
  },
  iconSize: {
    type: String,
    default: '16px',
  },
});
const loading = ref<boolean>(false);

const attrs = useAttrs();
const handleClick = async () => {
  loading.value = true;
  try {
    if (typeof attrs.onOnClick === 'function') {
      await attrs.onOnClick();
    }
  } finally {
    loading.value = false;
  }
};
</script>
