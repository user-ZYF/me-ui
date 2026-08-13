import type { InjectionKey } from 'vue';

import type { FormContext, FormItemContext } from './types';

/** Form 上下文注入 key */
export const formContextKey: InjectionKey<FormContext> = Symbol('me-form-context-key');

/** FormItem 上下文注入 key */
export const formItemContextKey: InjectionKey<FormItemContext | undefined> = Symbol('me-form-item-context-key');
