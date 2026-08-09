<!-- ? Button 按钮 -->
<template>
  <button
    :class="[
      ns.b.value,
      ns.m(type),
      ns.m(actualSize),
      ns.is('disabled', disabled),
      ns.is('loading', loading),
      ns.is('round', round),
      ns.is('circle', circle),
      ns.is('plain', plain),
    ]"
    :type="nativeType"
    :disabled="disabled || loading"
    :autofocus="autofocus"
    @click="onClick"
  >
    <span v-if="loading" class="me-button-loading-icon">
      <Loading class="me-button-loading-svg" />
    </span>
    <slot />
  </button>
</template>

<script lang="ts" setup>
import { computed } from 'vue';

import { Loading } from '@element-plus/icons-vue';

import { useConfigProvider } from '@me-ui/components/config-provider/hooks/use-config-provider';
import { useNamespace } from '@me-ui/hooks/use-namespace';

import { buttonEmits, buttonProps } from './button';

defineOptions({ name: 'MeButton' });

const props = defineProps(buttonProps);
const emit = defineEmits(buttonEmits);

const ns = useNamespace('button');
const { size: configSize } = useConfigProvider();

/** 实际尺寸：优先使用 prop 传入的，其次使用 ConfigProvider 的，最后使用默认值 */
const actualSize = computed(() => props.size ?? configSize.value ?? 'default');

function onClick(evt: MouseEvent) {
  emit('click', evt);
}
</script>
