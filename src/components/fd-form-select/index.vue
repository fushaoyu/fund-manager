<template>
  <el-form-item
    :label="label"
    :labelWidth="labelWidth"
    :prop="prop"
    :rules="rule_option"
  >
    <el-select
      :model-value="modelValue"
      :style="style"
      clearable
      filterable
      v-bind="$attrs"
      :placeholder="Placeholder"
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
      <template v-for="(_vallue, name) in $slots" #[name]="slotData">
        <slot :name="name" v-bind="slotData || {}"></slot>
      </template>
      <el-option
        v-for="item in options"
        :key="item[defaultValue]"
        :label="item[defaultName]"
        :value="item[defaultValue]"
        :disabled="item?.disabled"
      >
      </el-option>
    </el-select>
  </el-form-item>
</template>
<script setup lang="ts">
import { type CheckboxValueType } from "element-plus";
import { type PropType, reactive } from "vue";
const props = defineProps({
  modelValue: {
    type: [Array, String, Number, Boolean] as PropType<any>,
    default: () => [],
  },
  modelData: {
    type: [Object, Array],
    default: () => {},
  },
  /**
   * 是否显示全选
   */
  isCheckAll: {
    type: Boolean,
    default: false,
  },
  width: {
    type: [String, Number],
    default: "",
  },
  /**
   * 占位符
   */
  placeholder: {
    type: String,
    default: "",
  },
  /**
   * 标签文本
   */
  label: {
    type: String,
    default: "",
  },
  /**
   * model 的键名。 它可以是一个路径数组(例如 ['a', 'b', 0])。 在定义了 validate、resetFields 的方法时，该属性是必填的
   */
  prop: {
    type: String,
    default: "",
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
    default: "120",
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
    default: "label",
  },
  /**
   * 取值时value别名
   */
  defaultValue: {
    type: String,
    default: "value",
  },
});

const style = computed(() => {
  return {
    width: typeof props.width === "number" ? props.width + "px" : props.width,
  };
});
/**
 * 占位符
 */
const Placeholder = computed(() => {
  return props.placeholder || `请选择${props.label}`;
});



const rule_option = reactive([
  {
    required: props?.require,
    message: props?.require ? `请选择${props.label}` : "",
    trigger: ["blur", "change"],
  },
  ...props.rule,
]);

const emits = defineEmits([
  "update:modelValue",
  "update:modelData",
  "change",
  "clear",
  "changeData",
]);

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
  {
    immediate: true, // 初始化时触发
  }
);

// 全选/取消全选
const handleCheckAll = (val: CheckboxValueType): void => {
  indeterminate.value = false;
  let selectedValues = [];
  let selectedData = [];
  if (val) {
    selectedValues = props.options.map((_) => _[props.defaultValue]);
    selectedData = props.options.map((_) => _);
  } else {
    selectedValues = [];
    selectedData = [];
  }
  emits("update:modelValue", selectedValues);
  emits("update:modelData", selectedData);
  emits("change", selectedValues);
  emits("changeData", selectedData);
};

// 选中值发生变化时触发
const handleChange = <
  T extends string | number | boolean | (string | number | boolean)[]
>(
  val: T
): void => {
  emits("update:modelValue", val);
  emits("change", val);
  // 处理 val 可能是数组的情况
  const selectedItems = Array.isArray(val)
    ? props.options.filter((item) =>
        val.includes(item[props.defaultValue] as string | number | boolean)
      )
    : props.options.find((item) => item[props.defaultValue] === val);
  emits("update:modelData", selectedItems);
  emits("changeData", selectedItems);
};

// 可清空的单选模式下用户点击清空按钮时触发
const handleClear = (): void => {
  emits("clear");
};
</script>
<style lang="scss" scoped></style>
