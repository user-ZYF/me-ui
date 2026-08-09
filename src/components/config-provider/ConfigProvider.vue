<!-- ? ConfigProvider 全局配置 -->
<template>
  <div ref="wrapperRef" :class="ns.b.value" :style="cssVarsStyle">
    <slot />
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, toRef, watch } from 'vue';

import { useNamespace } from '@me-ui/hooks/use-namespace';

import { configProviderProps } from './config-provider';
import {
  provideConfigProvider,
  useConfigProvider,
  applyThemeToElement,
} from './hooks/use-config-provider';
import { tokensToCssVars } from './utils';

defineOptions({ name: 'MeConfigProvider' });

const props = defineProps(configProviderProps);

const ns = useNamespace('config-provider');

/** 包装元素引用 */
const wrapperRef = ref<HTMLElement>();

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

/** 监听主题变化，同步应用到 DOM 元素 */
watch(
  mergedTheme,
  (tokens) => {
    if (wrapperRef.value) {
      applyThemeToElement(wrapperRef.value, tokens);
    }
  },
  { deep: true, immediate: true },
);
</script>
