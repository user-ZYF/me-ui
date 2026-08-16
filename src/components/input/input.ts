import type { Component, ExtractPropTypes, PropType } from 'vue';

import { componentSizes } from '@me-ui/constants/config';
import type { ComponentSize } from '@me-ui/types/config';

/** Input 组件类型 */
export type InputType = 'text' | 'password' | 'textarea' | 'number' | 'email' | 'tel' | 'url';

/** Input 组件类型可选值 */
export const inputTypes: InputType[] = ['text', 'password', 'textarea', 'number', 'email', 'tel', 'url'];

/** Input Props 定义 */
export const inputProps = {
  /** 输入框类型 */
  type: {
    type: String as PropType<InputType>,
    values: inputTypes,
    default: 'text',
  },
  /** 输入框尺寸 */
  size: {
    type: String as PropType<ComponentSize | undefined>,
    values: componentSizes,
    default: undefined,
  },
  /** 是否禁用 */
  disabled: {
    type: Boolean,
    default: undefined,
  },
  /** 是否只读 */
  readonly: {
    type: Boolean,
    default: false,
  },
  /** 是否可清空 */
  clearable: {
    type: Boolean,
    default: false,
  },
  /** 是否显示切换密码图标 */
  showPassword: {
    type: Boolean,
    default: false,
  },
  /** 占位文本 */
  placeholder: {
    type: String,
    default: '',
  },
  /** 最大输入长度 */
  maxlength: {
    type: [Number, String] as PropType<number | string>,
    default: undefined,
  },
  /** 最小输入长度 */
  minlength: {
    type: [Number, String] as PropType<number | string>,
    default: undefined,
  },
  /** 是否自动获取焦点 */
  autofocus: {
    type: Boolean,
    default: false,
  },
  /** 是否在输入框聚焦时显示清除按钮 */
  clearOnFocus: {
    type: Boolean,
    default: false,
  },
  /** 前缀图标组件 */
  prefixIcon: {
    type: [String, Object, Function] as PropType<string | Component>,
    default: '',
  },
  /** 后缀图标组件 */
  suffixIcon: {
    type: [String, Object, Function] as PropType<string | Component>,
    default: '',
  },
  /** textarea 行数 */
  rows: {
    type: [Number, String] as PropType<number | string>,
    default: 3,
  },
  /** 是否自适应高度（textarea） */
  autosize: {
    type: [Boolean, Object] as PropType<boolean | { minRows?: number; maxRows?: number }>,
    default: false,
  },
  /** 原生 name 属性 */
  name: {
    type: String,
    default: '',
  },
  /** 原生 autocomplete 属性 */
  autocomplete: {
    type: String,
    default: 'off',
  },
  /** 原生 form 属性 */
  form: {
    type: String,
    default: '',
  },
} as const;

/** Input Props 类型 */
export type InputProps = ExtractPropTypes<typeof inputProps>;

/** Input Emits 定义 */
export const inputEmits = {
  /** 输入事件 */
  input: (value: string) => value,
  /** 值变化事件（失焦或回车时触发） */
  change: (value: string) => value,
  /** 聚焦事件 */
  focus: (evt: FocusEvent) => evt,
  /** 失焦事件 */
  blur: (evt: FocusEvent) => evt,
  /** 清空事件 */
  clear: () => true,
  /** 按键按下事件 */
  keydown: (evt: KeyboardEvent) => evt,
  /** 按键释放事件 */
  keyup: (evt: KeyboardEvent) => evt,
  /** 按键按下事件（字符键） */
  keypress: (evt: KeyboardEvent) => evt,
} as const;

/** Input Emits 类型 */
export type InputEmits = typeof inputEmits;
