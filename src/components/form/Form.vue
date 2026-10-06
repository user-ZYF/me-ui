<!-- Form 表单组件 -->
<template>
  <form ref="formRef" :class="[ns.b.value, ns.m(formSize)]" @submit.prevent @reset.prevent>
    <slot></slot>
  </form>
</template>

<script lang="ts" setup>
import { computed, provide, reactive, ref, toRefs, watch } from 'vue';

import { useNamespace } from '@me-ui/hooks/use-namespace';
import { useConfigProvider } from '@me-ui/components/config-provider/hooks/use-config-provider';

import { formContextKey } from './constants';
import { formEmits, formProps } from './form';
import { cloneDeep, ensureArray, filterFormItemContexts, getProp, isArray } from './utils';

import type { ValidateFieldsError } from 'async-validator';
import type { Arrayable } from './utils';
import type { FormItemContext, FormValidationResult } from './types';
import type { FormItemPropPath } from './form-item';

defineOptions({ name: 'MeForm' });

const props = defineProps(formProps);
const emit = defineEmits(formEmits);

const ns = useNamespace('form');
const { size: configSize } = useConfigProvider();

/** form 元素引用 */
const formRef = ref<HTMLFormElement>();
/** 已注册的 FormItem 列表 */
const formItemContexts = reactive<FormItemContext[]>([]);
/** 初始值缓存（用于处理动态表单场景） */
const initialValues = new Map<string, any>();

/** 表单尺寸 */
const formSize = computed(() => props.size ?? configSize.value ?? 'default');

/** 获取指定字段 */
function getFormItemContext(propPath: FormItemPropPath) {
  return filterFormItemContexts(formItemContexts, [propPath])[0];
}

/** 添加字段 */
function addFormItemContext(context: FormItemContext) {
  if (!formItemContexts.includes(context)) {
    formItemContexts.push(context);
  }
  // 首次注册：将当前 data 值作为初始值缓存；已有缓存（重新挂载）则保留原初始值
  if (context.propString && !initialValues.has(context.propString)) {
    initialValues.set(context.propString, cloneDeep(context.formItemValue));
  }
}

/** 获取指定字段路径的初始值 */
function getInitialValue(propString: string) {
  return initialValues.get(propString);
}

/** 清除指定字段路径的初始值缓存（prop 变更时调用） */
function removeInitialValue(propString: string) {
  initialValues.delete(propString);
}

/** 移除字段（组件卸载时调用）：从 formItemContexts 中移除，但保留初始值缓存以支持重新挂载 */
function removeFormItemContext(context: FormItemContext) {
  const idx = formItemContexts.indexOf(context);
  if (idx > -1) {
    formItemContexts.splice(idx, 1);
  }
}

/**
 * 重置字段
 * 先重置当前挂载的 FormItem，再处理已卸载但仍有初始值缓存的字段，直接操作 data 恢复其初始值
 */
function resetFormItems(propPaths: Arrayable<FormItemPropPath> = []) {
  if (!props.data) return;

  const propPathArr = ensureArray(propPaths);

  // 重置当前挂载的 FormItem
  filterFormItemContexts(formItemContexts, propPathArr).forEach((context) => context.resetFormItem());

  // 需要检查的 prop 列表：指定了 propPaths 就用指定的，否则检查所有缓存的初始值
  const propsToCheck =
    propPathArr.length > 0
      ? propPathArr.map((p) => (isArray(p) ? p.join('.') : p))
      : [...initialValues.keys()];

  // 处理已卸载但仍有初始值缓存的字段，直接操作 data 恢复初始值
  for (const propString of propsToCheck) {
    const isMounted = formItemContexts.some((context) => context.propString === propString);
    if (!isMounted && initialValues.has(propString)) {
      const target = getProp(props.data, propString);
      target.value = cloneDeep(initialValues.get(propString));
    }
  }
}

/** 清除校验信息 */
function clearValidate(propPaths: Arrayable<FormItemPropPath> = []) {
  filterFormItemContexts(formItemContexts, propPaths).forEach((context) => context.clearValidate());
}

/** 是否可校验 */
const isValidatable = computed(() => !!props.data);

/** 执行字段校验 */
async function doValidate(
  propPaths: Arrayable<FormItemPropPath> = [],
): Promise<boolean> {
  if (!isValidatable.value) return false;

  const validateContexts = filterFormItemContexts(formItemContexts, propPaths);
  // 没有需要校验的字段，不执行校验
  if (validateContexts.length === 0) return false;

  let validationErrors: ValidateFieldsError = {};
  for (const context of validateContexts) {
    try {
      await context.validate();
    } catch (err) {
      // 合并错误信息
      validationErrors = {
        ...validationErrors,
        ...(err as ValidateFieldsError),
      };
    }
  }

  if (Object.keys(validationErrors).length === 0) return true;
  return Promise.reject(validationErrors);
}

/** 校验字段：不传参时校验整个表单，校验失败时 reject invalidFields */
async function validate(
  propPaths: Arrayable<FormItemPropPath> = [],
): FormValidationResult {
  try {
    return await doValidate(propPaths);
  } catch (e) {
    if (e instanceof Error) throw e;

    const invalidFormItems = e as ValidateFieldsError;

    if (props.scrollToError && formRef.value) {
      // 按 DOM 顺序滚动到页面上最靠前的错误项
      const errorItem = formRef.value.querySelector<HTMLElement>(`.${ns.b.value}-item.is-error`);
      scrollToElement(errorItem);
    }

    return Promise.reject(invalidFormItems);
  }
}

/** 按 scrollIntoViewOptions 配置滚动到元素 */
function scrollToElement(el?: HTMLElement | null) {
  el?.scrollIntoView(
    props.scrollIntoViewOptions === true ? undefined : props.scrollIntoViewOptions,
  );
}

/** 滚动到指定字段 */
function scrollToProp(propPath: FormItemPropPath) {
  const context = getFormItemContext(propPath);
  scrollToElement(context?.$el);
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
    resetFormItems,
    clearValidate,
    validate,
    addFormItemContext,
    removeFormItemContext,
    getInitialValue,
    removeInitialValue,
  }),
);

defineExpose({
  /** 校验字段：不传参时校验整个表单 */
  validate,
  /** 重置字段并移除校验结果 */
  resetFormItems,
  /** 清除指定字段的校验信息 */
  clearValidate,
  /** 滚动到指定字段 */
  scrollToProp,
});
</script>
