import { inject } from 'vue';

import { formContextKey, formItemContextKey } from '../constants';

/** 获取 Form 和 FormItem 上下文 */
export function useFormItem() {
  const form = inject(formContextKey, undefined);
  const formItem = inject(formItemContextKey, undefined);

  return {
    form,
    formItem,
  };
}
