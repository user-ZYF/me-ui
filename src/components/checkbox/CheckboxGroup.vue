<!-- CheckboxGroup 多选框组 -->
<template>
  <div :class="ns.b.value">
    <slot></slot>
  </div>
</template>

<script lang="ts" setup>
import { computed, provide } from 'vue';

import { useFormDisabled, useFormSize } from '@me-ui/components/form/hooks';
import { useNamespace } from '@me-ui/hooks/use-namespace';

import { checkboxGroupContextKey, checkboxGroupEmits, checkboxGroupProps } from './checkbox-group';

defineOptions({ name: 'MeCheckboxGroup' });

const props = defineProps(checkboxGroupProps);
const emit = defineEmits(checkboxGroupEmits);

/** v-model 绑定值（选中的值数组） */
const model = defineModel<Array<string | number | boolean>>({ default: () => [] });

const ns = useNamespace('checkbox-group');

/** 实际尺寸：优先使用 prop 传入的，其次继承 Form/FormItem 的，最后使用 ConfigProvider 的，最后使用默认值 */
const actualSize = useFormSize(computed(() => props.size));

/** 实际禁用状态：优先使用 prop 传入的，其次继承 Form 的 */
const actualDisabled = useFormDisabled(computed(() => props.disabled));

/** 值变化回调 */
function change(value: Array<string | number | boolean>) {
  emit('change', value);
}

/** 提供给子 Checkbox 的上下文 */
provide(checkboxGroupContextKey, {
  modelValue: model,
  size: actualSize,
  disabled: actualDisabled,
  change,
});
</script>
