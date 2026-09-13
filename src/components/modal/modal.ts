import type { Component, ExtractPropTypes, PropType, VNode } from 'vue';

import type { ComponentType } from '@me-ui/types/config';

/** Modal 类型 */
export type ModalType = 'confirm' | 'info' | 'success' | 'warning' | 'error';

/** Modal 按钮配置 */
export interface ModalButtonOptions {
  /** 按钮文本 */
  text?: string;
  /** 按钮类型 */
  type?: ComponentType;
  /** 是否加载中 */
  loading?: boolean;
  /** 是否禁用 */
  disabled?: boolean;
  /** 点击回调，返回 false 阻止关闭 */
  onClick?: () => void | boolean | Promise<void | boolean>;
}

/** Modal Props 定义 */
export const modalProps = {
  /** 标题 */
  title: {
    type: String,
    default: '',
  },
  /** 宽度 */
  width: {
    type: [String, Number] as PropType<string | number>,
    default: 520,
  },
  /** 是否显示遮罩 */
  mask: {
    type: Boolean,
    default: true,
  },
  /** 点击遮罩是否关闭 */
  maskClosable: {
    type: Boolean,
    default: true,
  },
  /** 是否显示右上角关闭按钮 */
  closable: {
    type: Boolean,
    default: true,
  },
  /** 确认按钮文字 */
  confirmText: {
    type: String,
    default: '确定',
  },
  /** 取消按钮文字 */
  cancelText: {
    type: String,
    default: '取消',
  },
  /** 确认按钮类型 */
  confirmType: {
    type: String as PropType<ComponentType>,
    default: 'primary',
  },
  /** 是否显示取消按钮 */
  showCancel: {
    type: Boolean,
    default: true,
  },
  /** 确认按钮加载中 */
  confirmLoading: {
    type: Boolean,
    default: false,
  },
  /** 取消按钮加载中 */
  cancelLoading: {
    type: Boolean,
    default: false,
  },
  /** 是否禁用确认按钮 */
  confirmButtonDisabled: {
    type: Boolean,
    default: false,
  },
  /** 是否禁用取消按钮 */
  cancelButtonDisabled: {
    type: Boolean,
    default: false,
  },
  /** z-index */
  zIndex: {
    type: Number,
    default: 1000,
  },
  /** 自定义类名 */
  modalClassName: {
    type: String,
    default: '',
  },
  /** 自定义 footer 内容，为 null 时不显示 footer */
  footer: {
    type: [Object, Function, null] as PropType<VNode | (() => VNode) | null>,
    default: undefined,
  },
} as const;

/** Modal Props 类型 */
export type ModalProps = ExtractPropTypes<typeof modalProps>;

/** Modal 函数式调用配置 */
export interface ModalOptions extends Partial<ModalProps> {
  /** 内容 */
  content?: string;
  /** 自定义图标 */
  icon?: Component;
  /** 确认回调，返回 false 阻止关闭 */
  onConfirm?: () => void | boolean | Promise<void | boolean>;
  /** 取消回调，返回 false 阻止关闭 */
  onCancel?: () => void | boolean | Promise<void | boolean>;
  /** 确认按钮配置（覆盖对应 props） */
  confirmButtonProps?: ModalButtonOptions;
  /** 取消按钮配置（覆盖对应 props） */
  cancelButtonProps?: ModalButtonOptions;
}

/** Modal Emits 定义 */
export const modalEmits = {
  /** 确认事件 */
  confirm: () => true,
  /** 取消事件 */
  cancel: () => true,
  /** 关闭过渡动画结束 */
  afterLeave: () => true,
} as const;

/** Modal Emits 类型 */
export type ModalEmits = typeof modalEmits;

/** Modal 函数式调用返回的实例 */
export interface ModalFuncReturn {
  /** 关闭弹窗 */
  close: () => void;
  /** 更新弹窗配置 */
  update: (options: Partial<ModalOptions>) => void;
}

/** Modal 函数式调用类型 */
export type ModalFunc = (options: ModalOptions) => ModalFuncReturn;

/** 带方法的 Modal 函数 */
export interface ModalFuncWithTypes {
  /** 信息提示 */
  info: ModalFunc;
  /** 成功提示 */
  success: ModalFunc;
  /** 警告提示 */
  warning: ModalFunc;
  /** 错误提示 */
  error: ModalFunc;
  /** 确认对话框 */
  confirm: ModalFunc;
}
