<template>
  <el-form-item
    :label="label"
    :label-width="labelWidth"
    :prop="prop"
    :rules="rule_option"
  >
    <div class="flex items-center gap-2 w-full">
      <el-input-number
        :model-value="modelValue"
        v-bind="$attrs"
        :align="align"
        disabled-scientific
        :controls="controls"
        :placeholder="Placeholder"
        :min="min"
        :max="max"
        :style="style"
        @change="handleChange"
      >
        <template v-for="(vallue, name) in $slots" #[name]="slotData">
          <slot :name="name" v-bind="slotData || {}"></slot>
        </template>
      </el-input-number>
      <slot name="append-button"></slot>
    </div>
  </el-form-item>
</template>
<script></script>
<script setup lang="ts">
import type { PropType } from 'vue';

const props = defineProps({
  modelValue: {
    type: Number,
    default: null!,
  },
  width: {
    type: [String, Number],
    default: '100%',
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
   * 原生属性，设置最小值
   */
  min: {
    type: Number,
    default: 1,
  },
  /**
   * 原生 max 属性，设置最大值
   */
  max: {
    type: Number,
    default: 99999999,
  },
  placeholder: {
    type: String,
    default: '',
  },
  /**
   * 是否显示控制按钮
   */
  controls: {
    type: Boolean,
    default: false,
  },
  align: {
    type: String as PropType<'left' | 'right' | 'center'>,
    default: 'left',
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
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(['update:modelValue']);

const style = computed(() => {
  return {
    width: typeof props.width === 'number' ? props.width + 'px' : props.width,
  };
});

const Placeholder = computed(() => {
  return props.placeholder || `请输入${props.label}`;
});

const validator = (rule: any, value: any, callback: any) => {
  if (
    (value === undefined ||
      value === null ||
      (typeof value === 'string' && value.trim() === '')) &&
    props.require
  ) {
    return callback(new Error(props.placeholder || '请输入' + props.label));
  }

  const num = Number(value);
  if (isNaN(num)) {
    return callback(new Error('请输入数字'));
  }

  if (num < props.min || num > props.max) {
    const msg = `${props.label}必须在${props.min}-${props.max}之间`;
    return callback(new Error(msg));
  }

  callback(); // 验证通过
};
const rule_option = computed<any>(() => [
  {
    required: props.require,
    message: props.require ? props.placeholder || '请输入' + props.label : '',
    trigger: ['blur', 'change'],
  },
  {
    validator: validator,
    trigger: ['blur', 'change'],
  },
  ...props.rule,
]);

const handleChange = (value: any) => {
  emit('update:modelValue', value);
};
</script>
<style lang="scss" scoped></style>
