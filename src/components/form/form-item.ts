import { componentSizes } from '@me-ui/constants/config';

import type { ExtractPropTypes, PropType } from 'vue';
import type { ComponentSize } from '@me-ui/types/config';
import type { Arrayable } from './utils';
import type { FormItemRule } from './types';

/** 可被数组或单值包装的类型 */
export type FormItemPropPath = Arrayable<string>;

/** FormItem 校验状态 */
export type FormItemValidateState = '' | 'error' | 'validating' | 'success';

/** FormItem 校验状态可选值 */
export const formItemValidateStates: FormItemValidateState[] = ['', 'error', 'validating', 'success'];

/** FormItem Props 定义 */
export const formItemProps = {
  /** 标签文本 */
  label: {
    type: String,
    default: '',
  },
  /** data 中的字段路径 */
  propPath: {
    type: [String, Array] as PropType<FormItemPropPath>,
    default: undefined,
  },
  /** 是否必填，不传则由 rules 决定 */
  required: {
    type: Boolean,
    default: undefined,
  },
  /** 字段校验规则 */
  rules: {
    type: [Object, Array] as PropType<Arrayable<FormItemRule>>,
    default: undefined,
  },
  /** 错误提示文案 */
  errorText: {
    type: String,
    default: '',
  },
  /** 校验状态 */
  validateStatus: {
    type: String as PropType<FormItemValidateState>,
    values: formItemValidateStates,
    default: undefined,
  },
  /** 原生 label for 属性 */
  labelFor: {
    type: String,
    default: undefined,
  },
  /** 是否显示校验错误信息 */
  showErrorMessage: {
    type: Boolean,
    default: true,
  },
  /** 组件尺寸 */
  size: {
    type: String as PropType<ComponentSize>,
    values: componentSizes,
    default: undefined,
  },
} as const;

/** FormItem Props 类型 */
export type FormItemProps = ExtractPropTypes<typeof formItemProps>;

/** FormItem Emits 定义 */
export const formItemEmits = {} as const;

/** FormItem Emits 类型 */
export type FormItemEmits = typeof formItemEmits;
