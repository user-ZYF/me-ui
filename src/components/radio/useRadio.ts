import { computed, inject, type ModelRef, type Ref } from 'vue';

import { useFormDisabled, useFormSize } from '@me-ui/components/form/hooks';

import type { ComponentSize } from '@me-ui/types/config';

import { radioGroupContextKey } from './radio-group';

/** useRadio 入参 */
export interface UseRadioOptions {
  /** 是否支持独立使用（非 group 模式） */
  isStandalone: boolean;
  /** 独立模式下的 v-model */
  model?: ModelRef<string | number | boolean>;
  /** 当前 radio 的值 */
  value: Ref<string | number | boolean | undefined>;
  /** prop 传入的 size */
  size: Ref<ComponentSize | undefined>;
  /** prop 传入的 disabled */
  disabled: Ref<boolean | undefined>;
}

/** useRadio 返回值 */
export interface UseRadioReturn {
  /** 是否在 RadioGroup 中 */
  isInGroup: Ref<boolean>;
  /** 实际尺寸 */
  actualSize: Ref<ComponentSize>;
  /** 实际禁用状态 */
  actualDisabled: Ref<boolean>;
  /** 是否选中 */
  isChecked: Ref<boolean>;
  /** 切换选中状态，返回是否实际发生了变更 */
  onChange: () => boolean;
}

/**
 * Radio / RadioButton 公共逻辑
 */
export function useRadio(options: UseRadioOptions): UseRadioReturn {
  const { isStandalone, model, value, size, disabled } = options;

  /** 注入 RadioGroup 上下文 */
  const radioGroup = inject(radioGroupContextKey, undefined);

  /** 是否在 RadioGroup 中 */
  const isInGroup = computed(() => !!radioGroup);

  /** 实际尺寸：优先使用 prop 传入的，其次继承 RadioGroup / Form / FormItem 的，最后使用默认值 */
  const actualSize = useFormSize(computed(() => size.value ?? radioGroup?.size?.value));

  /** 实际禁用状态：优先使用 prop 传入的，其次继承 RadioGroup / Form 的 */
  const actualDisabled = useFormDisabled(computed(() => disabled.value ?? radioGroup?.disabled?.value));

  /** 是否选中 */
  const isChecked = computed(() => {
    if (isInGroup.value) {
      return radioGroup!.modelValue.value === value.value;
    }
    if (isStandalone && model) {
      return model.value === value.value;
    }
    return false;
  });

  /** 切换选中状态，返回是否实际发生了变更 */
  function onChange(): boolean {
    if (actualDisabled.value) return false;
    if (isChecked.value) return false;

    if (isInGroup.value) {
      const val = value.value as string | number | boolean;
      radioGroup!.modelValue.value = val;
      radioGroup!.change(val);
      return true;
    }

    if (isStandalone && model) {
      model.value = value.value as string | number | boolean;
      return true;
    }

    return false;
  }

  return {
    isInGroup,
    actualSize,
    actualDisabled,
    isChecked,
    onChange,
  };
}
