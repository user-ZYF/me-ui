import type { ExtractPropTypes, PropType } from 'vue';

/** Icon Props 定义 */
export const iconProps = {
  /** 图标尺寸 */
  size: {
    type: [Number, String] as PropType<number | string>,
    default: undefined,
  },
  /** 图标颜色 */
  color: {
    type: String,
    default: undefined,
  },
} as const;

/** Icon Props 类型 */
export type IconProps = ExtractPropTypes<typeof iconProps>;
