import { componentSizes } from '@me-ui/constants/config';

import type { ExtractPropTypes, PropType } from 'vue';
import type { ComponentSize } from '@me-ui/types/config';
import type { FormItemName } from './form-item.ts';
import type { FormRules } from './types';

/** Form Props 定义 */
export const formProps = {
  /** 表单数据对象 */
  model: {
    type: Object as PropType<Record<string, any>>,
    default: undefined,
  },
  /** 表单验证规则 */
  rules: {
    type: Object as PropType<FormRules>,
    default: undefined,
  },
  /** 是否显示校验错误信息 */
  showMessage: {
    type: Boolean,
    default: true,
  },
  /** rules 变化时是否触发校验 */
  validateOnRuleChange: {
    type: Boolean,
    default: true,
  },
  /** 是否隐藏必填星号 */
  hideRequiredAsterisk: {
    type: Boolean,
    default: false,
  },
  /** 校验失败时是否滚动到第一个错误项 */
  scrollToError: {
    type: Boolean,
    default: false,
  },
  /** 滚动到错误项的 scrollIntoView 配置 */
  scrollIntoViewOptions: {
    type: [Object, Boolean] as PropType<ScrollIntoViewOptions | boolean>,
    default: true,
  },
  /** 表单内组件尺寸 */
  size: {
    type: String as PropType<ComponentSize | undefined>,
    values: componentSizes,
    default: undefined,
  },
  /** 是否禁用表单内所有组件 */
  disabled: {
    type: Boolean,
    default: false,
  },
} as const;

/** Form Props 类型 */
export type FormProps = ExtractPropTypes<typeof formProps>;

/** Form Emits 定义 */
export const formEmits = {
  /** 表单校验时触发 */
  validate: (
    name: FormItemName,
    isValid: boolean,
    message: string,
  ) => (typeof name === 'string' || Array.isArray(name)) && typeof isValid === 'boolean' && typeof message === 'string',
} as const;

/** Form Emits 类型 */
export type FormEmits = typeof formEmits;
