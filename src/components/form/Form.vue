<!-- Form 表单组件 -->
<template>
  <form ref="formRef" :class="formClasses" @submit.prevent @reset.prevent>
    <slot></slot>
  </form>
</template>

<script lang="ts" setup>
import { computed, provide, reactive, ref, toRefs, watch } from 'vue';

import { useNamespace } from '@me-ui/hooks/use-namespace';
import { useConfigProvider } from '@me-ui/components/config-provider/hooks/use-config-provider';

import { formContextKey } from './constants';
import { formEmits, formProps } from './form';
import { isFunction } from '@me-ui/utils/types';
import { cloneDeep, ensureArray, filterFields, getProp, isArray } from './utils';

import type { ValidateFieldsError } from 'async-validator';
import type { Arrayable } from './utils';
import type { FormItemContext, FormValidateCallback, FormValidationResult } from './types';
import type { FormItemName } from './form-item';

defineOptions({ name: 'MeForm' });

const props = defineProps(formProps);
const emit = defineEmits(formEmits);

const ns = useNamespace('form');
const { size: configSize } = useConfigProvider();

/** form 元素引用 */
const formRef = ref<HTMLFormElement>();
/** 已注册的 FormItem 列表 */
const fields = reactive<FormItemContext[]>([]);
/** 初始值缓存 */
const initialValues = new Map<string, any>();

/** 表单尺寸 */
const formSize = computed(() => props.size ?? configSize.value ?? 'default');

/** 表单 class */
const formClasses = computed(() => [
  ns.b.value,
  ns.m(formSize.value),
]);

/** 获取指定字段 */
function getField(name: FormItemName) {
  return filterFields(fields, [name])[0];
}

/** 添加字段 */
function addField(field: FormItemContext) {
  if (!fields.includes(field)) {
    fields.push(field);
  }
  if (field.nameString) {
    if (initialValues.has(field.nameString)) {
      // 动态表单场景：FormItem 重新挂载时，恢复之前缓存的初始值
      field.setInitialValue(initialValues.get(field.nameString));
    } else {
      // 首次挂载：将当前 model 值作为初始值缓存
      initialValues.set(field.nameString, cloneDeep(field.fieldValue));
    }
  }
}

/**
 * 移除字段
 * @param field FormItem 上下文
 * @param oldNameString 旧的字段路径，传入时表示 name 变更场景，仅清理旧初始值缓存；
 * 不传时表示组件卸载场景，从 fields 中移除并保留初始值缓存以支持重新挂载
 */
function removeField(field: FormItemContext, oldNameString?: string) {
  if (oldNameString) {
    // name 变更：仅删除旧 name 对应的初始值缓存，组件本身仍在 fields 中
    initialValues.delete(oldNameString);
    return;
  }
  // 组件卸载：从 fields 中移除，但保留初始值缓存以支持动态表单重新挂载
  const idx = fields.indexOf(field);
  if (idx > -1) {
    fields.splice(idx, 1);
    if (field.nameString) {
      initialValues.set(field.nameString, cloneDeep(field.getInitialValue()));
    }
  }
}

/**
 * 重置字段
 * 先重置当前挂载的 FormItem，再处理已卸载但仍有初始值缓存的字段，
 * 直接操作 model 恢复其初始值
 */
function resetFields(properties: Arrayable<FormItemName> = []) {
  if (!props.model) return;

  // 重置当前挂载的 FormItem
  filterFields(fields, properties).forEach((field) => field.resetField());

  // 当前仍挂载的 FormItem 的 name 集合
  const activeNameStrings = new Set(
    fields.map((f) => f.nameString).filter(Boolean),
  );
  // 需要检查的 name 列表：指定了 properties 就用指定的，否则检查所有缓存的初始值
  const namesToCheck =
    ensureArray(properties).length > 0
      ? ensureArray(properties).map((p) => (isArray(p) ? p.join('.') : p))
      : [...initialValues.keys()];

  // 处理已卸载但仍有初始值缓存的字段，直接操作 model 恢复初始值
  for (const nameString of namesToCheck) {
    if (!activeNameStrings.has(nameString) && initialValues.has(nameString)) {
      getProp(props.model, nameString).value = cloneDeep(
        initialValues.get(nameString),
      );
    }
  }
}

/** 清除校验信息 */
function clearValidate(properties: Arrayable<FormItemName> = []) {
  filterFields(fields, properties).forEach((field) => field.clearValidate());
}

/** 是否可校验 */
const isValidatable = computed(() => !!props.model);

/** 获取需要校验的字段 */
function obtainValidateFields(modelProps: Arrayable<FormItemName>) {
  if (fields.length === 0) return [];
  const filteredFields = filterFields(fields, modelProps);
  return filteredFields;
}

/** 执行字段校验 */
async function doValidateField(
  modelProps: Arrayable<FormItemName> = [],
): Promise<boolean> {
  if (!isValidatable.value) return false;

  const validateFields = obtainValidateFields(modelProps);
  if (validateFields.length === 0) return true;

  let validationErrors: ValidateFieldsError = {};
  for (const field of validateFields) {
    try {
      await field.validate('');
      if (field.validateState === 'error' && !field.error) field.resetField();
    } catch (fields) {
      validationErrors = {
        ...validationErrors,
        ...(fields as ValidateFieldsError),
      };
    }
  }

  if (Object.keys(validationErrors).length === 0) return true;
  return Promise.reject(validationErrors);
}

/** 校验整个表单 */
async function validate(
  callback?: FormValidateCallback,
): FormValidationResult {
  return validateField(undefined, callback);
}

/** 校验指定字段 */
async function validateField(
  modelProps: Arrayable<FormItemName> = [],
  callback?: FormValidateCallback,
): FormValidationResult {
  let result = false;
  const shouldThrow = !isFunction(callback);
  try {
    result = await doValidateField(modelProps);
    if (result === true) {
      await callback?.(result);
    }
    return result;
  } catch (e) {
    if (e instanceof Error) throw e;

    const invalidFields = e as ValidateFieldsError;

    if (props.scrollToError) {
      if (formRef.value) {
        const formItem = formRef.value.querySelector(`.${ns.b.value}-item.is-error`);
        formItem?.scrollIntoView(
          props.scrollIntoViewOptions === true
            ? undefined
            : props.scrollIntoViewOptions,
        );
      }
    }
    if (!result) {
      await callback?.(false, invalidFields);
    }
    return shouldThrow ? Promise.reject(invalidFields) : false;
  }
}

/** 滚动到指定字段 */
function scrollToField(name: FormItemName) {
  const field = getField(name);
  if (field) {
    field.$el?.scrollIntoView(
      props.scrollIntoViewOptions === true
        ? undefined
        : props.scrollIntoViewOptions,
    );
  }
}

/** rules 变化时自动校验 */
watch(
  () => props.rules,
  () => {
    if (props.validateOnRuleChange) {
      validate().catch(() => {});
    }
  },
  { deep: true, flush: 'post' },
);

/** 提供 Form 上下文给子组件 */
provide(
  formContextKey,
  reactive({
    ...toRefs(props),
    emit,

    resetFields,
    clearValidate,
    validateField,
    addField,
    removeField,
  }),
);

defineExpose({
  /** 校验整个表单 */
  validate,
  /** 校验指定字段 */
  validateField,
  /** 重置字段并移除校验结果 */
  resetFields,
  /** 清除指定字段的校验信息 */
  clearValidate,
  /** 滚动到指定字段 */
  scrollToField,
});
</script>
