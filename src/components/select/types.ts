import type { ModelRef } from 'vue';

/** Select 选项值类型 */
export type OptionValue = string | number;

/** Select 选项标签类型 */
export type OptionLabel = string | number;

/** 自定义筛选函数 */
export type FilterMethod = (query: string, option: OptionItem) => boolean;

/** Select 选项数据 */
export interface SelectOption {
  /** 选项值 */
  value: OptionValue;
  /** 选项标签 */
  label: OptionLabel;
  /** 是否禁用 */
  disabled?: boolean;
  /** 自定义属性 */
  [key: string]: any;
}

/** 选项标签信息（用于多选标签展示、自定义筛选函数等场景） */
export interface OptionItem {
  /** 选项值 */
  value: OptionValue;
  /** 标签名 */
  label: OptionLabel;
}

/** Select 上下文 */
export interface SelectContext {
  /** 当前绑定值 */
  modelValue: ModelRef<OptionValue | OptionValue[] | undefined>;
}
