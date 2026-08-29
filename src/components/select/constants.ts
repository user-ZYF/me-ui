import type { InjectionKey } from 'vue';

import type { SelectContext } from './types';

/** Select 注入 key */
export const selectKey: InjectionKey<SelectContext> = Symbol('meSelect');

/** 虚拟列表默认高度（px） */
export const DEFAULT_LIST_HEIGHT = 274;

/** 虚拟列表默认每项高度（px） */
export const DEFAULT_ITEM_HEIGHT = 34;

/** SelectDropdown 命名空间 */
export const SELECT_DROPDOWN_NAMESPACE = 'select-dropdown';
