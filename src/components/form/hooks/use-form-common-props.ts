import { computed, inject, unref } from 'vue';

import { useConfigProvider } from '@me-ui/components/config-provider/hooks/use-config-provider';
import { formContextKey, formItemContextKey } from '../constants';

import type { ComponentSize } from '@me-ui/types/config';
import type { MaybeRef } from 'vue';
import { defaultComponentSize } from '@me-ui/constants/config';

/**
 * 获取表单级别的组件尺寸
 * 优先级：组件自身 prop > FormItem > Form > ConfigProvider > 默认值
 */
export function useFormSize(
  fallback?: MaybeRef<ComponentSize | undefined>,
  ignore: Partial<Record<'form' | 'formItem' | 'global', boolean>> = {},
) {
  const configProvider = ignore.global ? undefined : useConfigProvider();
  const form = ignore.form ? undefined : inject(formContextKey, undefined);
  const formItem = ignore.formItem ? undefined : inject(formItemContextKey, undefined);

  return computed<ComponentSize>(() => {
    const size =
      unref(fallback) || formItem?.size || form?.size || configProvider?.size.value || defaultComponentSize;
    return size as ComponentSize;
  });
}

/**
 * 获取表单级别的禁用状态
 * 优先级：FormItem prop > Form prop > false
 */
export function useFormDisabled(fallback?: MaybeRef<boolean | undefined>) {
  const form = inject(formContextKey, undefined);

  return computed(() => {
    return unref(fallback) ?? form?.disabled ?? false;
  });
}
