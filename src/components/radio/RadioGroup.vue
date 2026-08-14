<!-- ? RadioGroup 单选框组 -->
<template>
  <div :class="ns.b.value" role="radiogroup">
    <slot />
  </div>
</template>

<script lang="ts" setup>
import { computed, provide } from 'vue';

import { useFormDisabled, useFormSize } from '@me-ui/components/form/hooks';
import { useNamespace } from '@me-ui/hooks/use-namespace';

import { radioGroupContextKey, radioGroupEmits, radioGroupProps } from './radio-group';

defineOptions({ name: 'MeRadioGroup' });

const props = defineProps(radioGroupProps);
const emit = defineEmits(radioGroupEmits);

/** v-model 绑定值（选中的值） */
const model = defineModel<string | number | boolean>({ default: '' });

const ns = useNamespace('radio-group');

/** 实际尺寸：优先使用 prop 传入的，其次继承 Form/FormItem 的，最后使用默认值 */
const actualSize = useFormSize(computed(() => props.size));

/** 实际禁用状态：优先使用 prop 传入的，其次继承 Form 的 */
const actualDisabled = useFormDisabled(computed(() => props.disabled));

/** 值变化回调 */
function change(value: string | number | boolean) {
  emit('change', value);
}

/** 提供给子 Radio 的上下文 */
provide(radioGroupContextKey, {
  modelValue: model,
  size: actualSize,
  disabled: actualDisabled,
  change,
});
</script>
