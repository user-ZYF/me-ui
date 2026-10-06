import type { SetupContext } from 'vue';

import type { RuleItem, ValidateError, ValidateFieldsError } from 'async-validator';

import type { ComponentSize } from '@me-ui/types/config';
import type { Arrayable } from './utils.ts';
import type { FormItemPropPath, FormItemProps, FormItemValidateState } from './form-item.ts';
import type { FormEmits, FormProps } from './form.ts';

/** FormItem 校验规则，扩展自 async-validator 的 RuleItem */
export interface FormItemRule extends RuleItem {
  /** 触发方式 */
  trigger?: Arrayable<string>;
}

/** 表单规则集 */
export type FormRules = Partial<Record<string, Arrayable<FormItemRule>>>;

/** 表单校验结果 */
export type FormValidationResult = Promise<boolean>;

/** 表单校验失败信息 */
export interface FormValidateFailure {
  /** 校验错误列表 */
  errors: ValidateError[] | null;
  /** 校验失败的字段 */
  fields: ValidateFieldsError;
}

/** Form 上下文类型（通过 provide/inject 传递给 FormItem） */
export type FormContext = FormProps & {
    emit: SetupContext<FormEmits>['emit'];
    /** 添加字段 */
    addFormItemContext: (context: FormItemContext) => void;
    /** 移除字段 */
    removeFormItemContext: (context: FormItemContext) => void;
    /** 获取字段初始值 */
    getInitialValue: (propString: string) => any;
    /** 清除初始值缓存（prop 变更时调用） */
    removeInitialValue: (propString: string) => void;
    /** 重置字段 */
    resetFormItems: (propPaths?: Arrayable<FormItemPropPath>) => void;
    /** 清除校验信息 */
    clearValidate: (propPaths?: Arrayable<FormItemPropPath>) => void;
    /** 校验指定字段 */
    validate: (propPaths?: Arrayable<FormItemPropPath>) => FormValidationResult;
  };

/** FormItem 上下文类型（通过 provide/inject 传递给子组件） */
export interface FormItemContext extends FormItemProps {
  /** FormItem 根元素 */
  $el: HTMLDivElement | undefined;
  /** 组件尺寸 */
  size: ComponentSize;
  /** 校验信息 */
  validateMessage: string;
  /** 校验状态 */
  validateState: FormItemValidateState;
  /** 字段当前值 */
  formItemValue: any;
  /** 字段路径字符串 */
  propString: string;
  /** 校验字段，不传 trigger 时校验全部规则 */
  validate: (trigger?: string) => FormValidationResult;
  /** 重置字段 */
  resetFormItem: () => void;
  /** 清除校验信息 */
  clearValidate: () => void;
}
