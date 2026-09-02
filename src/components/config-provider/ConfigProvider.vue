<!-- ? ConfigProvider 全局配置 -->
<template>
  <div :class="ns.b.value" :style="cssVarsStyle">
    <slot></slot>
  </div>
</template>

<script lang="ts" setup>
import { computed, toRef } from 'vue';

import { useNamespace } from '@me-ui/hooks/use-namespace';

import { configProviderProps } from './config-provider';
import {
  provideConfigProvider,
  useConfigProvider,
} from './hooks/use-config-provider';
import { tokensToCssVars } from './utils';

defineOptions({ name: 'MeConfigProvider' });

const props = defineProps(configProviderProps);

const ns = useNamespace('config-provider');

/** 全局尺寸响应式引用 */
const sizeRef = toRef(props, 'size');
/** 命名空间响应式引用 */
const namespaceRef = toRef(props, 'namespace');

/** 父级 ConfigProvider 上下文 */
const parentContext = useConfigProvider();

/** 合并后的主题 Token */
const mergedTheme = computed(() => ({
  ...parentContext.theme.value,
  ...props.theme,
}));

/** CSS 变量样式对象 */
const cssVarsStyle = computed(() => tokensToCssVars(mergedTheme.value));

/** 提供上下文给子组件 */
provideConfigProvider(mergedTheme as any, sizeRef, namespaceRef);
</script>
