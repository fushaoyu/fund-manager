<template>
  <el-form-item
    :label="label"
    :labelWidth="labelWidth"
    :prop="prop"
    :rules="rule_option"
  >
    <el-select-v2
      :model-value="modelValue"
      :options="options"
      clearable
      filterable
      v-bind="$attrs"
      @change="handleChange"
      @clear="handleClear"
    >
      <template #header v-if="isCheckAll">
        <el-checkbox
          v-model="checkAll"
          :indeterminate="indeterminate"
          @change="handleCheckAll"
        >
          全选
        </el-checkbox>
      </template>
    </el-select-v2>
  </el-form-item>
</template>
<script setup lang="ts">
import { type CheckboxValueType } from 'element-plus';

const props = defineProps({
  modelValue: {
    type: [Array, String, Number, Boolean],
    default: () => [],
  },
  /**
   * 是否开启全选
   */
  isCheckAll: {
    type: Boolean,
    default: false,
  },
  /**
   * 标签文本
   */
  label: {
    type: String,
    default: '',
  },
  /**
   * model 的键名。 它可以是一个路径数组(例如 ['a', 'b', 0])。 在定义了 validate、resetFields 的方法时，该属性是必填的
   */
  prop: {
    type: String,
    default: '',
  },
  /**
   * 是否为必填项，如不设置，则会根据校验规则确认
   */
  require: {
    type: Boolean,
    default: true,
  },
  /**
   * 标签宽度，例如 '50px'。 可以使用 auto。
   */
  labelWidth: {
    type: [String, Number],
    default: '120',
  },
  /**
   * 表单验证追加规则
   */
  rule: {
    type: Array<any>,
    default: () => [],
  },
  /**
   * 下拉选框配置
   */
  options: {
    require: true,
    type: Array<any>,
    default: () => [],
  },
  /**
   * 取值时label别名
   */
  defaultName: {
    type: String,
    default: 'label',
  },
  /**
   * 取值时value别名
   */
  defaultValue: {
    type: String,
    default: 'value',
  },
});

const rule_option = reactive([
  {
    required: props?.require,
    message: props?.require ? `请选择${props.label}` : '',
    trigger: ['blur', 'change'],
  },
  ...props.rule,
]);

const emits = defineEmits(['update:modelValue', 'change', 'clear']);

const checkAll = ref(false);
const indeterminate = ref(false);

watch(
  () => props.modelValue,
  (val) => {
    if (!Array.isArray(val)) return;
    if (val.length === 0) {
      checkAll.value = false;
      indeterminate.value = false;
    } else if (val.length === props.options.length) {
      checkAll.value = true;
      indeterminate.value = false;
    } else {
      indeterminate.value = true;
    }
  },
);

const handleCheckAll = (val: CheckboxValueType) => {
  indeterminate.value = false;
  let selectedValues = [];
  if (val) {
    selectedValues = props.options.map((_) => _[props.defaultValue]);
  } else {
    selectedValues = [];
  }
  emits('update:modelValue', selectedValues);
  emits('change', selectedValues);
};
// 选中值发生变化时触发
const handleChange = <T,>(val: T): void => {
  emits('update:modelValue', val);
  emits('change', val);
};

// 可清空的单选模式下用户点击清空按钮时触发
const handleClear = (): void => {
  emits('clear');
};
</script>
<style lang="scss" scoped></style>
