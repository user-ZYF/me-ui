import type { ExtractPropTypes, PropType } from 'vue';

import { componentSizes } from '@me-ui/constants/config';
import type { ComponentSize } from '@me-ui/types/config';
import type { TooltipPlacement } from '@me-ui/components/tooltip/tooltip';

/** Select 选项值类型 */
export type OptionValue = string | number | boolean;

/** 自定义筛选函数 */
export type FilterMethod = (query: string, option: { value: OptionValue; label: string | number }) => boolean;

/** Select Props 定义 */
export const selectProps = {
  /** 是否多选 */
  multiple: {
    type: Boolean,
    default: false,
  },
  /** 是否禁用 */
  disabled: {
    type: Boolean,
    default: undefined,
  },
  /** 是否可清空 */
  clearable: {
    type: Boolean,
    default: false,
  },
  /** 是否可搜索 */
  filterable: {
    type: Boolean,
    default: false,
  },
  /** 自定义筛选函数，接收查询值和选项信息，返回是否匹配 */
  filterMethod: {
    type: Function as PropType<FilterMethod>,
    default: undefined,
  },
  /** 占位文本 */
  placeholder: {
    type: String,
    default: '请选择',
  },
  /** 输入框尺寸 */
  size: {
    type: String as PropType<ComponentSize | undefined>,
    values: componentSizes,
    default: undefined,
  },
  /** 下拉框出现位置 */
  placement: {
    type: String as PropType<TooltipPlacement>,
    default: 'bottom-start',
  },
  /** 下拉框自定义类名 */
  popperClass: {
    type: String,
    default: '',
  },
  /** 多选模式下最多显示的标签数，超出部分折叠为 +N；设置为 'responsive' 时根据容器宽度自适应 */
  maxTagCount: {
    type: [Number, String] as PropType<number | 'responsive'>,
    default: undefined,
  },
} as const;

/** Select Props 类型 */
export type SelectProps = ExtractPropTypes<typeof selectProps>;

/** Select Emits 定义 */
export const selectEmits = {
  /** 值变化事件 */
  change: (_value: OptionValue | OptionValue[] | undefined) => true,
  /** 清空事件 */
  clear: () => true,
  /** 可见性变化事件 */
  visibleChange: (_visible: boolean) => true,
  /** 聚焦事件 */
  focus: (evt: FocusEvent) => evt instanceof FocusEvent,
  /** 失焦事件 */
  blur: (evt: FocusEvent) => evt instanceof FocusEvent,
  /** 多选模式下移除标签事件 */
  removeTag: (_value: OptionValue) => true,
} as const;

/** Select Emits 类型 */
export type SelectEmits = typeof selectEmits;

/** Option Props 定义 */
export const optionProps = {
  /** 选项值 */
  value: {
    type: [String, Number, Boolean] as PropType<OptionValue>,
    required: true as const,
  },
  /** 选项标签，省略时同 value */
  label: {
    type: [String, Number] as PropType<string | number>,
    default: '',
  },
  /** 是否禁用 */
  disabled: {
    type: Boolean,
    default: false,
  },
} as const;

/** Option Props 类型 */
export type OptionProps = ExtractPropTypes<typeof optionProps>;
