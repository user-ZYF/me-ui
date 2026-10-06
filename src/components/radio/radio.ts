import type { ExtractPropTypes, PropType } from 'vue';

import { componentSizes } from '@me-ui/constants/config';
import type { ComponentSize } from '@me-ui/types/config';

/** Radio Props 定义 */
export const radioProps = {
  /** 是否禁用 */
  disabled: {
    type: Boolean,
    default: undefined,
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
  /** 当前 radio 的值（配合 RadioGroup 使用时必填） */
  value: {
    type: [String, Number, Boolean] as PropType<string | number | boolean>,
    default: undefined,
  },
} as const;

/** Radio Props 类型 */
export type RadioProps = ExtractPropTypes<typeof radioProps>;

/** Radio Emits 定义 */
export const radioEmits = {
  /** 值变化事件 */
  change: (value: string | number | boolean) => value,
} as const;

/** Radio Emits 类型 */
export type RadioEmits = typeof radioEmits;
