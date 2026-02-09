import { ref } from "vue";

/**
 *
 * 组件类型标注
 * @param _component 组件示例
 * @returns 完整类型标注的响应式组件示例
 */
export const useComponentRef = <T extends abstract new (...args: any) => any>(
  _component: T
) => {
  return ref<InstanceType<T>>();
};
