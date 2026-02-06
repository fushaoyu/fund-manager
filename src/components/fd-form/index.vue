<template>
  <el-form
    ref="ruleFormRef"
    :model="formData"
    :label-width="labelWidth"
    :label-position="labelPosition"
    :size="size"
    :status-icon="statusIcon"
    :style="formWidth"
    @submit.prevent
  >
    <slot></slot>

    <slot name="footer"></slot>
  </el-form>
</template>
<script setup lang="ts">
import type { FormValidateCallback } from 'element-plus';
import { ElForm } from 'element-plus';
import { useComponentRef } from '@/hooks';

const props = defineProps({
  width: {
    type: String,
    default: '',
  },
  /**
   * 表单数据对象
   */
  formData: {
    type: Object,
    default: () => {},
  },
  /**
   * 用于控制该表单内组件的尺寸
   */
  size: {
    type: String as any,
    default: 'default' as 'large' | 'small' | 'mini',
  },
  /**
   * 是否在输入框中显示校验结果反馈图标
   */
  statusIcon: {
    type: Boolean,
    default: false,
  },
  /**
   * 自定义底部按钮时设置的插槽名称
   * */
  slotName: {
    type: String,
    default: '',
  },
  /**
   * 标签的长度，例如 '50px'。 作为 Form 直接子元素的 form-item 会继承该值。 可以使用 auto。
   * */
  labelWidth: {
    type: [String, Number],
    default: '120px',
  },
  /**
   * 表单域标签的位置， 当设置为 left 或 right 时，则也需要设置 label-width 属性
   * */
  labelPosition: {
    type: String as any,
    default: 'right',
  },
});

const formWidth = computed(() => {
  return {
    width: /px/.test(props.width) ? props.width : '',
  };
});
const ruleFormRef = useComponentRef(ElForm);
const emit = defineEmits(['submit', 'clear']);

const clearForm = (): void => {
  ruleFormRef.value?.resetFields();
};
// 表单验证
const validate = (callback: FormValidateCallback) => {
  ruleFormRef.value?.validate((valid: any) => {
    callback(valid);
  });
};
defineExpose({
  clearForm,
  validate,
});
</script>
