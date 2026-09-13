<!-- Radio 单选框 -->
<template>
  <label
    :class="[
      ns.b.value,
      ns.m(actualSize),
      ns.is('disabled', actualDisabled),
      ns.is('checked', isChecked),
    ]"
  >
    <!-- 原生 input（隐藏，仅用于无障碍和表单提交） -->
    <input
      :class="ns.e('input')"
      type="radio"
      :checked="isChecked"
      :disabled="actualDisabled"
      :name="props.name"
      @change="onRadioChange"
    />

    <!-- 自定义单选框 -->
    <span :class="ns.e('box')">
      <span :class="[ns.e('dot'), ns.is('show', isChecked)]"></span>
    </span>

    <!-- 标签文本 -->
    <span v-if="props.label || $slots.default" :class="ns.e('label')">
      <slot>{{ props.label }}</slot>
    </span>
  </label>
</template>

<script lang="ts" setup>
import { toRef } from 'vue';

import { useNamespace } from '@me-ui/hooks/use-namespace';

import { radioEmits, radioProps } from './radio';
import { useRadio } from './useRadio';

defineOptions({ name: 'MeRadio' });

const props = defineProps(radioProps);
const emit = defineEmits(radioEmits);

/** v-model 绑定值 */
const model = defineModel<string | number | boolean>({ default: '' });

const ns = useNamespace('radio');

const { actualSize, actualDisabled, isChecked, onChange } = useRadio({
  isStandalone: true,
  model,
  value: toRef(props, 'value'),
  size: toRef(props, 'size'),
  disabled: toRef(props, 'disabled'),
});

/** 值变化事件 */
function onRadioChange() {
  if (onChange()) {
    emit('change', props.value as string | number | boolean);
  }
}
</script>
