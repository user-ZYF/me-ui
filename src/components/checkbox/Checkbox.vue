<!-- ? Checkbox 多选框 -->
<template>
  <label
    :class="[
      ns.b.value,
      ns.m(actualSize),
      ns.is('disabled', actualDisabled),
      ns.is('checked', isChecked),
      ns.is('indeterminate', props.indeterminate),
    ]"
  >
    <!-- 原生 input（隐藏，仅用于无障碍和表单提交） -->
    <input
      :class="ns.e('input')"
      type="checkbox"
      :checked="isChecked"
      :disabled="actualDisabled"
      :name="props.name"
      @change="onChange"
    />

    <!-- 自定义勾选框 -->
    <span :class="ns.e('box')">
      <me-icon v-if="props.indeterminate" :class="ns.e('icon')" :size="12">
        <Minus />
      </me-icon>
      <me-icon v-else-if="isChecked" :class="ns.e('icon')" :size="12">
        <Check />
      </me-icon>
    </span>

    <!-- 标签文本 -->
    <span v-if="props.label || $slots.default" :class="ns.e('label')">
      <slot>{{ props.label }}</slot>
    </span>
  </label>
</template>

<script lang="ts" setup>
import { computed, inject } from 'vue';

import { Check, Minus } from '@element-plus/icons-vue';

import MeIcon from '@me-ui/components/icon';
import { useFormDisabled, useFormSize } from '@me-ui/components/form/hooks';
import { useNamespace } from '@me-ui/hooks/use-namespace';

import { checkboxGroupContextKey } from './checkbox-group';
import { checkboxEmits, checkboxProps } from './checkbox';

defineOptions({ name: 'MeCheckbox' });

const props = defineProps(checkboxProps);
const emit = defineEmits(checkboxEmits);

/** v-model 绑定值 */
const model = defineModel<boolean>({ default: false });

const ns = useNamespace('checkbox');

/** 注入 CheckboxGroup 上下文 */
const checkboxGroup = inject(checkboxGroupContextKey, undefined);

/** 实际尺寸：优先使用 prop 传入的，其次继承 CheckboxGroup / Form / FormItem 的，最后使用 ConfigProvider 的，最后使用默认值 */
const actualSize = useFormSize(computed(() => props.size ?? checkboxGroup?.size?.value));

/** 实际禁用状态：优先使用 prop 传入的，其次继承 CheckboxGroup / Form 的 */
const actualDisabled = useFormDisabled(computed(() => props.disabled ?? checkboxGroup?.disabled?.value));

/** 是否在 CheckboxGroup 中 */
const isInGroup = computed(() => !!checkboxGroup);

/** 是否选中 */
const isChecked = computed(() => {
  if (isInGroup.value) {
    return checkboxGroup!.modelValue.value.includes(props.value as string | number | boolean);
  }
  return model.value === true;
});

/** 切换选中状态 */
function onChange() {
  if (actualDisabled.value) return;

  if (isInGroup.value) {
    const arr = [...checkboxGroup!.modelValue.value];
    const val = props.value as string | number | boolean;
    const index = arr.indexOf(val);
    if (index > -1) {
      arr.splice(index, 1);
    } else {
      arr.push(val);
    }
    checkboxGroup!.modelValue.value = arr;
    checkboxGroup!.change(arr);
    emit('change', isChecked.value);
    return;
  }

  model.value = !model.value;
  emit('change', model.value);
}
</script>
