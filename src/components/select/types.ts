import type { ComputedRef, Ref, ModelRef } from 'vue';

import type { OptionValue, FilterMethod } from './select';

/** 选项实例 */
export interface OptionInstance {
  /** 选项值 */
  value: OptionValue;
  /** 标签名 */
  label: ComputedRef<string | number | boolean>;
  /** 是否禁用 */
  disabled: ComputedRef<boolean>;
  /** 是否选中 */
  selected: ComputedRef<boolean>;
  /** 是否可见 */
  visible: Ref<boolean>;
}

/** Select 上下文 */
export interface SelectContext {
  /** 当前绑定值 */
  modelValue: ModelRef<OptionValue | OptionValue[] | undefined>;
  /** 是否多选 */
  multiple: Ref<boolean>;
  /** 当前过滤查询 */
  filterQuery: Ref<string>;
  /** 自定义筛选函数 */
  filterMethod: Ref<FilterMethod | undefined>;
  /** 是否正在输入法组合 */
  isComposing: Ref<boolean>;
  /** 添加选项 */
  addOption: (option: OptionInstance) => void;
  /** 移除选项 */
  removeOption: (value: OptionValue) => void;
  /** 选择选项 */
  selectOption: (option: OptionInstance) => void;
}
