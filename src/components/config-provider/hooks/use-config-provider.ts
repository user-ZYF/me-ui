import { inject, provide, ref, watch } from 'vue';

import { tokensToCssVars } from '../utils';

import type { Ref } from 'vue';
import type { ThemeTokens } from '../types';

/** ConfigProvider 注入 key */
export const configProviderKey = Symbol('me-config-provider');

/** ConfigProvider 注入上下文类型 */
export interface ConfigProviderContext {
  /** 主题 Token 配置 */
  theme: Ref<ThemeTokens>;
  /** 全局组件尺寸 */
  size: Ref<string>;
  /** CSS 类名命名空间前缀 */
  namespace: Ref<string>;
}

/**
 * 提供 ConfigProvider 上下文
 * @param theme 主题 Token 配置
 * @param size 全局组件尺寸
 * @param namespace 命名空间前缀
 */
export function provideConfigProvider(
  theme: Ref<ThemeTokens>,
  size: Ref<string>,
  namespace: Ref<string>,
) {
  const context: ConfigProviderContext = {
    theme,
    size,
    namespace,
  };

  provide(configProviderKey, context);

  return context;
}

/**
 * 消费 ConfigProvider 上下文
 * 如果没有上层 ConfigProvider，返回默认值
 */
export function useConfigProvider(): ConfigProviderContext {
  const defaultContext: ConfigProviderContext = {
    theme: ref({}),
    size: ref('default'),
    namespace: ref('me'),
  };

  return inject(configProviderKey, defaultContext);
}

/**
 * 将主题 Token 应用为 CSS 变量到指定元素
 * @param el 目标元素
 * @param tokens 主题 Token 配置
 */
export function applyThemeToElement(el: HTMLElement, tokens: ThemeTokens) {
  const cssVars = tokensToCssVars(tokens);
  Object.entries(cssVars).forEach(([key, value]) => {
    el.style.setProperty(key, value);
  });
}

/**
 * 监听主题变化并自动应用到指定元素
 * @param el 目标元素 ref
 * @param tokens 主题 Token 配置 ref
 */
export function watchTheme(
  el: Ref<HTMLElement | undefined>,
  tokens: Ref<ThemeTokens>,
) {
  watch(
    tokens,
    (newTokens) => {
      if (el.value) {
        applyThemeToElement(el.value, newTokens);
      }
    },
    { deep: true, immediate: true },
  );
}
