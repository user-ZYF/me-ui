import type { ComputedRef, ExtractPropTypes, InjectionKey, ModelRef, PropType } from 'vue';

import { componentSizes } from '@me-ui/constants/config';
import type { ComponentSize } from '@me-ui/types/config';

/** RadioGroup 上下文类型 */
export interface RadioGroupContext {
  /** 当前选中的值 */
  modelValue: ModelRef<string | number | boolean>;
  /** 尺寸 */
  size?: ComputedRef<ComponentSize>;
  /** 是否禁用 */
  disabled?: ComputedRef<boolean>;
  /** 值变化事件 */
  change: (value: string | number | boolean) => void;
}

/** RadioGroup 注入 key */
export const radioGroupContextKey: InjectionKey<RadioGroupContext> = Symbol('radioGroupContextKey');

/** RadioGroup Props 定义 */
export const radioGroupProps = {
  /** 是否禁用 */
  disabled: {
    type: Boolean,
    default: undefined,
  },
  /** 尺寸 */
  size: {
    type: String as PropType<ComponentSize | undefined>,
    values: componentSizes,
    default: undefined,
  },
} as const;

/** RadioGroup Props 类型 */
export type RadioGroupProps = ExtractPropTypes<typeof radioGroupProps>;

/** RadioGroup Emits 定义 */
export const radioGroupEmits = {
  /** 值变化事件 */
  change: (value: string | number | boolean) => value,
} as const;

/** RadioGroup Emits 类型 */
export type RadioGroupEmits = typeof radioGroupEmits;
