<!-- Icon 图标 -->
<template>
  <i v-bind="$attrs" :class="ns.b.value" :style="iconStyle">
    <slot></slot>
  </i>
</template>

<script lang="ts" setup>
import { computed } from 'vue';

import { useNamespace } from '@me-ui/hooks/use-namespace';

import { iconProps } from './icon';
import { isNumber } from '@me-ui/utils/types';

defineOptions({ name: 'MeIcon', inheritAttrs: false });

const props = defineProps(iconProps);

const ns = useNamespace('icon');

/** 图标样式：根据 size 和 color 生成 */
const iconStyle = computed(() => {
  const fontSize = isNumber(props.size) ? `${props.size}px` : props.size;
  if (!fontSize && !props.color) return {};

  return {
    fontSize,
    ...(props.color ? { color: props.color } : {}),
  };
});
</script>
