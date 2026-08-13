import type { SetupContext } from 'vue';

import type { RuleItem, ValidateError, ValidateFieldsError } from 'async-validator';

import type { ComponentSize } from '@me-ui/types/config';
import type { Arrayable } from './utils.ts';
import type { FormItemName, FormItemProps, FormItemValidateState } from './form-item.ts';
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

/** 表单校验回调 */
export type FormValidateCallback = (
  isValid: boolean,
  invalidFields?: ValidateFieldsError,
) => Promise<void> | void;

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
    addField: (field: FormItemContext) => void;
    /** 移除字段 */
    removeField: (field: FormItemContext, oldNameString?: string) => void;
    /** 重置字段 */
    resetFields: (props?: Arrayable<FormItemName>) => void;
    /** 清除校验信息 */
    clearValidate: (props?: Arrayable<FormItemName>) => void;
    /** 校验指定字段 */
    validateField: (
      props?: Arrayable<FormItemName>,
      callback?: FormValidateCallback,
    ) => FormValidationResult;
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
  fieldValue: any;
  /** 字段路径字符串 */
  nameString: string;
  /** 校验字段 */
  validate: (
    trigger: string,
    callback?: FormValidateCallback,
  ) => FormValidationResult;
  /** 重置字段 */
  resetField: () => void;
  /** 清除校验信息 */
  clearValidate: () => void;
  /** 设置初始值 */
  setInitialValue: (value: any) => void;
  /** 获取初始值 */
  getInitialValue: () => any;
}
