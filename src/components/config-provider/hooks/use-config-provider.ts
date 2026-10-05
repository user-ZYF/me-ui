import { inject, provide, readonly, ref } from 'vue';

import { defaultComponentSize, defaultNamespace } from '@me-ui/constants/config';

import type { InjectionKey, Ref } from 'vue';
import type { ThemeTokens } from '../types';

/** ConfigProvider 注入 key */
export const configProviderKey: InjectionKey<ConfigProviderContext> =
  Symbol('me-config-provider');

/** ConfigProvider 注入上下文类型 */
export interface ConfigProviderContext {
  /** 主题 Token 配置 */
  theme: Readonly<Ref<ThemeTokens>>;
  /** 全局组件尺寸 */
  size: Readonly<Ref<string>>;
  /** CSS 类名命名空间前缀 */
  namespace: Readonly<Ref<string>>;
}

/**
 * 提供 ConfigProvider 上下文
 * @param theme 主题 Token 配置
 * @param size 全局组件尺寸
 * @param namespace 命名空间前缀
 */
export function provideConfigProvider(
  theme: Readonly<Ref<ThemeTokens>>,
  size: Readonly<Ref<string>>,
  namespace: Readonly<Ref<string>>,
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
    theme: readonly(ref({})),
    size: readonly(ref(defaultComponentSize)),
    namespace: readonly(ref(defaultNamespace)),
  };

  return inject(configProviderKey, defaultContext);
}
