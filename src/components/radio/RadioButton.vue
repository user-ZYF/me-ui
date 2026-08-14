<!-- ? RadioButton 按钮样式的单选框 -->
<template>
  <label
    :class="[
      ns.b.value,
      ns.m(actualSize),
      ns.is('disabled', actualDisabled),
      ns.is('active', isChecked),
    ]"
  >
    <!-- 原生 input（隐藏，仅用于无障碍和表单提交） -->
    <input
      :class="ns.e('input')"
      type="radio"
      :checked="isChecked"
      :disabled="actualDisabled"
      :name="props.name"
      @change="onRadioButtonChange"
    />

    <!-- 标签文本 -->
    <span :class="ns.e('inner')">
      <slot>{{ props.label }}</slot>
    </span>
  </label>
</template>

<script lang="ts" setup>
import { toRef } from 'vue';

import { useNamespace } from '@me-ui/hooks/use-namespace';

import { radioButtonEmits, radioButtonProps } from './radio-button';
import { useRadio } from './useRadio';

defineOptions({ name: 'MeRadioButton' });

const props = defineProps(radioButtonProps);
const emit = defineEmits(radioButtonEmits);

const ns = useNamespace('radio-button');

const { actualSize, actualDisabled, isChecked, onChange } = useRadio({
  isStandalone: false,
  value: toRef(props, 'value'),
  size: toRef(props, 'size'),
  disabled: toRef(props, 'disabled'),
});

/** 值变化事件 */
function onRadioButtonChange() {
  if (onChange()) {
    emit('change', props.value as string | number | boolean);
  }
}
</script>
