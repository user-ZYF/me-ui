import type { ExtractPropTypes, PropType } from 'vue';

import { componentSizes, componentTypes } from '@me-ui/constants/config';
import type { ComponentSize, ComponentType } from '@me-ui/types/config';

/** Button 组件原生类型 */
export type ButtonNativeType = 'button' | 'submit' | 'reset';

/** Button 组件原生类型可选值 */
export const buttonNativeTypes: ButtonNativeType[] = ['button', 'submit', 'reset'];

/** Button Props 定义 */
export const buttonProps = {
  /** 按钮类型 */
  type: {
    type: String as PropType<ComponentType>,
    values: componentTypes,
    default: 'default',
  },
  /** 按钮尺寸 */
  size: {
    type: String as PropType<ComponentSize | undefined>,
    values: componentSizes,
    default: undefined,
  },
  /** 原生 type 属性 */
  nativeType: {
    type: String as PropType<ButtonNativeType>,
    values: buttonNativeTypes,
    default: 'button',
  },
  /** 是否禁用 */
  disabled: {
    type: Boolean,
    default: undefined,
  },
  /** 是否加载中 */
  loading: {
    type: Boolean,
    default: false,
  },
  /** 是否为圆角按钮 */
  round: {
    type: Boolean,
    default: false,
  },
  /** 是否为圆形按钮 */
  circle: {
    type: Boolean,
    default: false,
  },
  /** 是否为朴素按钮 */
  plain: {
    type: Boolean,
    default: false,
  },
} as const;

/** Button Props 类型 */
export type ButtonProps = ExtractPropTypes<typeof buttonProps>;

/** Button Emits 定义 */
export const buttonEmits = {
  /** 点击事件 */
  click: (evt: MouseEvent) => evt,
} as const;

/** Button Emits 类型 */
export type ButtonEmits = typeof buttonEmits;
