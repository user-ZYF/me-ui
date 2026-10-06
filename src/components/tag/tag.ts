import type { ExtractPropTypes, PropType } from 'vue';

import { componentSizes, componentTypes } from '@me-ui/constants/config';
import type { ComponentSize, ComponentType } from '@me-ui/types/config';

/** Tag 主题效果 */
export type TagEffect = 'dark' | 'light' | 'plain';

/** Tag 主题效果可选值 */
export const tagEffects: TagEffect[] = ['dark', 'light', 'plain'];

/** Tag Props 定义 */
export const tagProps = {
  /** 标签类型 */
  type: {
    type: String as PropType<ComponentType>,
    values: componentTypes,
    default: 'default',
  },
  /** 是否可关闭 */
  closable: {
    type: Boolean,
    default: false,
  },
  /** 标签尺寸 */
  size: {
    type: String as PropType<ComponentSize>,
    values: componentSizes,
    default: undefined,
  },
  /** 主题效果 */
  effect: {
    type: String as PropType<TagEffect>,
    values: tagEffects,
    default: 'light',
  },
} as const;

/** Tag Props 类型 */
export type TagProps = ExtractPropTypes<typeof tagProps>;

/** Tag Emits 定义 */
export const tagEmits = {
  /** 关闭事件 */
  close: (evt: MouseEvent) => evt instanceof MouseEvent,
  /** 点击事件 */
  click: (evt: MouseEvent) => evt instanceof MouseEvent,
} as const;

/** Tag Emits 类型 */
export type TagEmits = typeof tagEmits;
