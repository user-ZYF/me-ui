import type { ComputedRef, ExtractPropTypes, InjectionKey, PropType, ModelRef } from 'vue';

import { componentSizes } from '@me-ui/constants/config';
import type { ComponentSize } from '@me-ui/types/config';

/** CheckboxGroup 上下文类型 */
export interface CheckboxGroupContext {
  /** 当前选中的值数组 */
  modelValue: ModelRef<Array<string | number | boolean>>;
  /** 尺寸 */
  size?: ComputedRef<ComponentSize>;
  /** 是否禁用 */
  disabled?: ComputedRef<boolean>;
  /** 值变化事件 */
  change: (value: Array<string | number | boolean>) => void;
}

/** CheckboxGroup 注入 key */
export const checkboxGroupContextKey: InjectionKey<CheckboxGroupContext> = Symbol('checkboxGroupContextKey');

/** CheckboxGroup Props 定义 */
export const checkboxGroupProps = {
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

/** CheckboxGroup Props 类型 */
export type CheckboxGroupProps = ExtractPropTypes<typeof checkboxGroupProps>;

/** CheckboxGroup Emits 定义 */
export const checkboxGroupEmits = {
  /** 值变化事件 */
  change: (value: Array<string | number | boolean>) => value,
} as const;

/** CheckboxGroup Emits 类型 */
export type CheckboxGroupEmits = typeof checkboxGroupEmits;
