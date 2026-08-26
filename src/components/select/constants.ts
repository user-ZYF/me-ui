import type { InjectionKey } from 'vue';

import type { SelectContext } from './types';

/** Select 注入 key */
export const selectKey: InjectionKey<SelectContext> = Symbol('meSelect');

/** 下拉框最大高度 */
export const MAX_DROPDOWN_HEIGHT = '274px';
