<template>
  <el-dialog
    class="dialog-form"
    :style="style"
    :model-value="modelValue"
    :width="width"
    append-to-body
    destroy-on-close
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    v-bind="$attrs"
    @close="close"
  >
    <template #header>
      <slot name="header">
        <div class="dialog-title">{{ title }}</div>
      </slot>
    </template>
    <sc-form
      ref="dialogFormRef"
      :formData="formData"
      :size="size"
      :label-width="labelWidth"
      :label-position="labelPosition"
      :button-align="buttonAlign"
      :statusIcon="false"
    >
      <slot></slot>
      <template #footer>
        <div class="dialog-form-button-row" :style="buttonStyle">
          <el-button :size="size" @click.stop="handleClear">
            {{ clearName }}
          </el-button>
          <el-button
            type="primary"
            color="#8B5CF6"
            :size="size"
            :loading="submitLoading"
            @click.stop="handleClick"
          >
            {{ submitName }}
          </el-button>
        </div>
      </template>
    </sc-form>
  </el-dialog>
</template>
<script setup lang="ts">
// 修正路径：fd-form 实际目录为 components/fd-form
import ScForm from '@/components/fd-form/index.vue';
import { useComponentRef } from '@/hooks';
const props = defineProps({
  //选择的所有素材信息
  modelValue: {
    type: Boolean,
    default: false,
  },
  size: {
    type: String as any,
    default: 'default' as 'large' | 'small' | 'default',
  },
  /**
   *  提交按钮名称
   */
  submitName: {
    type: String,
    default: '确定',
  },
  /**
   *  取消按钮名称
   */
  clearName: {
    type: String,
    default: '取消',
  },
  /**
   * Dialog 对话框 Dialog 的标题， 也可通过dom元素传入
   */
  title: {
    type: String,
    default: '标题',
  },
  /**
   * Dialog 的宽度
   */
  width: {
    type: [String, Number],
    default: '',
  },
  // 隐藏头部
  showHeader: {
    type: Boolean,
    default: true,
  },
  /***
   * 为 Dialog 启用可拖拽功能
   */
  draggable: {
    type: Boolean,
    default: true,
  },
  /**
   * 表单数据对象
   */
  formData: {
    type: Object,
    default: () => {},
  },
  /**
   * 标签的长度，例如 '50px'。 作为 Form 直接子元素的 form-item 会继承该值。 可以使用 auto。
   * */
  labelWidth: {
    type: String,
    default: '90px',
  },
  /**
   * 表单域标签的位置， 当设置为 left 或 right 时，则也需要设置 label-width 属性
   * */
  labelPosition: {
    type: String,
    default: 'right',
  },
  buttonAlign: {
    type: String,
    default: 'center',
  },
  submitLoading: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['update:modelValue', 'submit']);

const style = computed(() => {
  return {
    '--show-header': props.showHeader ? 'block' : 'none',
  };
});
const buttonStyle = computed(() => {
  const align: any = {
    center: 'center',
    left: 'flex-start',
    right: 'flex-end',
  };
  return {
    justifyContent: align[props.buttonAlign],
  };
});
const dialogFormRef = useComponentRef(ScForm);

const handleClick = async () => {
  dialogFormRef.value?.validate((valid: any) => {
    if (valid) {
      /**
       * @event submit
       */
      emit('submit');
    }
  });
};

// 点击按钮
const handleClear = () => {
  if (!dialogFormRef) return;
  emit('update:modelValue', false);
  dialogFormRef.value?.clearForm();
};

const close = () => {
  emit('update:modelValue', false);
};
</script>
<style lang="scss">
.dialog-form {
  border-radius: 6px;
  padding-top: 0;

  .el-dialog__header {
    padding: 16px 20px;
    border-bottom: 1px solid #e8eaec;
    display: var(--show-header);

    .el-dialog__headerbtn {
      top: 5px;
      right: 32px;
    }
  }
  .dialog-title {
    font-size: 16px;
    font-weight: 700;
    line-height: 18px;
    color: #333;
  }
  .dialog-form-button-row {
    width: 100%;
    display: flex;
    align-items: flex-end;
    justify-content: center;
    gap: 10px;
    margin-top: 16px;
  }
}
</style>
