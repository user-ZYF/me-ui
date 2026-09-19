import { computed } from 'vue';

import { useConfigProvider } from '@me-ui/components/config-provider/hooks/use-config-provider';
import { defaultNamespace } from '@me-ui/constants/config';

/** BEM 命名空间 hook */
export function useNamespace(block: string, namespaceOverride?: string) {
  /** 从 ConfigProvider 上下文获取命名空间 */
  const configContext = useConfigProvider();

  /** 命名空间前缀：优先使用显式传入的，其次使用 ConfigProvider 的，最后使用默认值 */
  const namespace = namespaceOverride ?? configContext.namespace.value ?? defaultNamespace;

  /** 生成 block 类名，如 me-button */
  const b = computed(() => `${namespace}-${block}`);

  /** 生成 block--modifier 类名，如 me-button--primary */
  function m(modifier: string | undefined) {
    if (!modifier) return '';
    return `${b.value}--${modifier}`;
  }

  /** 生成 block__element 类名，如 me-button__icon */
  function e(element: string | undefined) {
    if (!element) return '';
    return `${b.value}__${element}`;
  }

  /** 生成 block__element--modifier 类名 */
  function em(element: string | undefined, modifier: string | undefined) {
    if (!element || !modifier) return '';
    return `${b.value}__${element}--${modifier}`;
  }

  /** 生成 is-xxx 状态类名 */
  function is(name: string, state: boolean | undefined) {
    return state ? `is-${name}` : '';
  }

  return {
    namespace,
    b,
    m,
    e,
    em,
    is,
  };
}
