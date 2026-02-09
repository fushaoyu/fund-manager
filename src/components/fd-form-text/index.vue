<template>
  <el-form-item
    :label="label"
    :label-width="labelWidth"
    :prop="prop"
    :rules="rule_option"
  >
    <div class="flex items-center gap-2 w-[100%]">
      <slot name="prepend-button"></slot>
      <el-input
        v-bind="$attrs"
        :model-value="modelValue"
        :style="style"
        :placeholder="Placeholder"
        @input="handleChange"
      >
        <template v-for="(_vallue, name) in $slots" #[name]="slotData">
          <slot :name="name" v-bind="slotData || {}"></slot>
        </template>
      </el-input>
      <slot name="append-button"></slot>
    </div>
  </el-form-item>
</template>
<script></script>
<script setup lang="ts">
const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
  width: {
    type: [String, Number],
    default: '',
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
    default: 999999999,
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
    type: Array as any,
    default: () => [],
  },
  placeholder: {
    type: String,
    default: '',
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

const rule_option = reactive<any>([
  {
    required: props.require,
    message: props.require ? `请输入${props.label}` : '',
    trigger: ['blur', 'change'],
  },
  {
    min: props.min,
    max: props.max,
    message: `请输入长度${props.min}到${props.max}个字符`,
    trigger: ['blur', 'change'],
  },
  ...props.rule,
]);

const handleChange = (value: any) => {
  emit('update:modelValue', value);
};
</script>
<style lang="scss" scoped></style>
