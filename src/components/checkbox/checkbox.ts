import type { ExtractPropTypes, PropType } from 'vue';

import { componentSizes } from '@me-ui/constants/config';
import type { ComponentSize } from '@me-ui/types/config';

/** Checkbox Props 定义 */
export const checkboxProps = {
  /** 是否禁用 */
  disabled: {
    type: Boolean,
    default: undefined,
  },
  /** 是否为半选状态 */
  indeterminate: {
    type: Boolean,
    default: false,
  },
  /** 尺寸 */
  size: {
    type: String as PropType<ComponentSize>,
    values: componentSizes,
    default: undefined,
  },
  /** 标签文本 */
  label: {
    type: String,
    default: '',
  },
  /** 原生 name 属性 */
  name: {
    type: String,
    default: '',
  },
  /** 选中时的值（数组模式下使用，配合 v-model 为数组时生效） */
  value: {
    type: [String, Number, Boolean] as PropType<string | number | boolean>,
    default: undefined,
  },
} as const;

/** Checkbox Props 类型 */
export type CheckboxProps = ExtractPropTypes<typeof checkboxProps>;

/** Checkbox Emits 定义 */
export const checkboxEmits = {
  /** 值变化事件 */
  change: (_value: boolean) => true,
} as const;

/** Checkbox Emits 类型 */
export type CheckboxEmits = typeof checkboxEmits;
