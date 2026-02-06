/**
 * 封装Element Plus的ElMessageBox组件
 * 提供统一的消息弹窗处理方式
 */
import { ElMessageBox } from 'element-plus';
import 'element-plus/es/components/message-box/style/css';
import { ElMessage } from 'element-plus';
import 'element-plus/es/components/message/style/css';
import type { CSSProperties, VNode } from 'vue';
import type { Action } from 'element-plus';

/**
 * 消息弹窗配置项
 */
interface MessageBoxOptions {
  title?: string;
  message?: VNode | string | any;
  type?: 'success' | 'warning' | 'info' | 'error' | 'primary' | '';
  customClass?: string;
  customStyle?: CSSProperties;
  showClose?: boolean;
  closeOnClickModal?: boolean;
  closeOnPressEscape?: boolean;
  center?: boolean;
  draggable?: boolean;
  dangerouslyUseHTMLString?: boolean;
  confirmButtonText?: string;
  cancelButtonText?: string;
  showCancelButton?: boolean;
  showConfirmButton?: boolean;
  callback?: (action: Action) => void;
}

/**
 * 确认弹窗配置项
 */
interface ConfirmOptions extends Omit<MessageBoxOptions, 'message'> {
  message: VNode | string;
  confirmButtonText?: string;
  cancelButtonText?: string;
  distinguishCancelAndClose?: boolean;
}

/**
 * 输入弹窗配置项
 */
interface PromptOptions extends ConfirmOptions {
  inputType?: 'text' | 'password' | 'number' | 'textarea';
  inputValue?: string;
  inputPlaceholder?: string;
  inputValidator?: (value: string) => boolean | string;
  inputErrorMessage?: string;
}

/**
 * 封装ElMessageBox的hook
 * @returns 包含各种弹窗方法的对象
 */
export const useElMessageBox = () => {
  /**
   * 基础消息弹窗
   * @param options 弹窗配置
   * @returns Promise<any>
   */
  const alert = (options: MessageBoxOptions): Promise<any> => {
    return ElMessageBox.alert(options.message, options.title || '提示', {
      type: options.type,
      customClass: options.customClass,
      customStyle: options.customStyle,
      showClose: options.showClose !== false,
      closeOnClickModal: options.closeOnClickModal !== false,
      closeOnPressEscape: options.closeOnPressEscape !== false,
      center: options.center,
      draggable: options.draggable,
      dangerouslyUseHTMLString: options.dangerouslyUseHTMLString,
      showCancelButton: options.showCancelButton !== false,
      showConfirmButton: options.showConfirmButton !== false,
      confirmButtonText: options.confirmButtonText,
      cancelButtonText: options.cancelButtonText,
      callback: options.callback,
    });
  };

  /**
   * 确认弹窗
   * @param options 弹窗配置
   * @returns Promise<any>
   */
  const confirm = (options: ConfirmOptions): Promise<any> => {
    return ElMessageBox.confirm(
      options.message || '',
      options.title || '确认',
      {
        type: options.type || 'warning',
        customClass: options.customClass,
        showClose: options.showClose !== false,
        closeOnClickModal: options.closeOnClickModal !== false,
        closeOnPressEscape: options.closeOnPressEscape !== false,
        center: options.center,
        draggable: options.draggable,
        confirmButtonText: options.confirmButtonText || '确认',
        cancelButtonText: options.cancelButtonText || '取消',
        distinguishCancelAndClose: options.distinguishCancelAndClose,
      },
    );
  };

  /**
   * 输入弹窗
   * @param options 弹窗配置
   * @returns Promise<string> 用户输入的值
   */
  const prompt = (options: PromptOptions): Promise<string> => {
    return ElMessageBox.prompt(options.message || '', options.title || '输入', {
      type: options.type || 'info',
      customClass: options.customClass,
      showClose: options.showClose !== false,
      closeOnClickModal: options.closeOnClickModal !== false,
      closeOnPressEscape: options.closeOnPressEscape !== false,
      center: options.center,
      draggable: options.draggable,
      confirmButtonText: options.confirmButtonText || '确认',
      cancelButtonText: options.cancelButtonText || '取消',
      distinguishCancelAndClose: options.distinguishCancelAndClose,
      inputType: options.inputType || 'text',
      inputValue: options.inputValue,
      inputPlaceholder: options.inputPlaceholder,
      inputValidator: options.inputValidator,
      inputErrorMessage: options.inputErrorMessage,
    }).then(({ value }: any) => value);
  };

  /**
   * 错误消息弹窗
   * @param message 错误消息
   * @param title 标题
   * @returns Promise<any>
   */
  const error = (message: string, title: string = '错误'): Promise<any> => {
    return alert({ message, title, type: 'error' });
  };

  /**
   * 成功消息弹窗
   * @param message 成功消息
   * @param title 标题
   * @returns Promise<any>
   */
  const success = (message: string, title: string = '成功'): Promise<any> => {
    return alert({ message, title, type: 'success' });
  };

  /**
   * 警告消息弹窗
   * @param message 警告消息
   * @param title 标题
   * @returns Promise<any>
   */
  const warning = (message: string, title: string = '警告'): Promise<any> => {
    return alert({ message, title, type: 'warning' });
  };

  /**
   * 信息消息弹窗
   * @param message 信息消息
   * @param title 标题
   * @returns Promise<any>
   */
  const info = (message: string, title: string = '提示'): Promise<any> => {
    return alert({ message, title, type: 'info' });
  };

  // 用于存储最近一次toast消息的信息
  const recentToasts = new Map<string, number>();
  // 消息重复显示的最小间隔时间（毫秒）
  const MIN_TOAST_INTERVAL = 2000;

  const toast = (options: {
    message: string;
    type?: 'success' | 'warning' | 'info' | 'error';
  }) => {
    const { message, type = 'warning' } = options;
    // 创建消息唯一标识符（消息内容+消息类型）
    const toastKey = `${message}_${type}`;
    const now = Date.now();
    const lastShowTime = recentToasts.get(toastKey) || 0;

    // 检查是否在规定的时间间隔内
    if (now - lastShowTime < MIN_TOAST_INTERVAL) {
      // 在时间间隔内，不显示重复消息
      return;
    }

    // 更新消息显示时间
    recentToasts.set(toastKey, now);

    ElMessage({
      message: message,
      type: type,
      duration: 2000,
    });
  };
  /**
   * 操作成功提示
   * @param message 提示消息
   */
  const successToast = (message: string): void => {
    ElMessage.success(message);
  };

  /**
   * 操作失败提示
   * @param message 提示消息
   */
  const errorToast = (message: string): void => {
    ElMessage.error(message);
  };

  /**
   * 警告提示
   * @param message 提示消息
   */
  const warningToast = (message: string): void => {
    ElMessage.warning(message);
  };

  /**
   * 信息提示
   * @param message 提示消息
   */
  const infoToast = (message: string): void => {
    ElMessage.info(message);
  };

  return {
    alert,
    confirm,
    prompt,
    error,
    success,
    warning,
    info,
    toast,
    successToast,
    errorToast,
    warningToast,
    infoToast,
  };
};
