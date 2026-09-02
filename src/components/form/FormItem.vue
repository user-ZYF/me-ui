<!-- ? FormItem 表单项组件 -->
<template>
  <div
    ref="formItemRef"
    :class="formItemClasses"
  >
    <label
      v-if="!!(label || $slots.label)"
      :for="labelFor"
      :class="ns.e('label')"
    >
      <slot name="label" :label="currentLabel">
        {{ currentLabel }}
      </slot>
    </label>

    <div :class="ns.e('content')">
      <slot></slot>
      <transition :name="`${ns.namespace}-zoom-in-top`" appear>
        <slot v-if="shouldShowError" name="error" :error="validateMessage">
          <div :class="validateClasses">
            {{ validateMessage }}
          </div>
        </slot>
      </transition>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, inject, nextTick, onBeforeUnmount, onMounted, provide, reactive, ref, toRefs, watch } from 'vue';

import AsyncValidator from 'async-validator';

import { useNamespace } from '@me-ui/hooks/use-namespace';

import { formContextKey, formItemContextKey } from './constants';
import { formItemProps } from './form-item';
import { isFunction } from '@me-ui/utils/types';
import { cloneDeep, ensureArray, getProp, isArray } from './utils';
import { useFormSize } from './hooks';

import type { RuleItem } from 'async-validator';
import type { Arrayable } from './utils';
import type { FormItemContext, FormItemRule, FormValidateFailure } from './types';
import type { FormItemValidateState } from './form-item';

defineOptions({ name: 'MeFormItem' });

const props = defineProps(formItemProps);

const formContext = inject(formContextKey, undefined);

/** 组件尺寸 */
const _size = useFormSize(undefined, { formItem: false });
const ns = useNamespace('form-item');

/** 校验状态 */
const validateState = ref<FormItemValidateState>('');
/** 校验信息 */
const validateMessage = ref('');
/** FormItem 根元素引用 */
const formItemRef = ref<HTMLDivElement>();
/** 初始值 */
let initialValue: any = undefined;
/** 是否正在重置字段 */
let isResettingField = false;

/** FormItem class */
const formItemClasses = computed(() => [
  ns.b.value,
  ns.m(_size.value),
  ns.is('error', validateState.value === 'error'),
  ns.is('validating', validateState.value === 'validating'),
  ns.is('success', validateState.value === 'success'),
  ns.is('required', isRequired.value || props.required),
  ns.is('no-asterisk', formContext?.hideRequiredAsterisk),
]);

/** 校验信息 class */
const validateClasses = computed(() => [ns.e('error')]);

/** 字段路径字符串 */
const nameString = computed(() => {
  if (!props.name) return '';
  return isArray(props.name) ? props.name.join('.') : props.name;
});

/** label 的 for 属性 */
const labelFor = computed<string | undefined>(() => props.for);

/** 字段当前值 */
const fieldValue = computed(() => {
  const model = formContext?.model;
  if (!model || !props.name) {
    return;
  }
  return getProp(model, props.name).value;
});

/** 合并后的校验规则 */
const normalizedRules = computed(() => {
  const { required } = props;

  const rules: FormItemRule[] = [];

  if (props.rules) {
    rules.push(...ensureArray(props.rules));
  }

  const formRules = formContext?.rules;
  if (formRules && props.name) {
    const key = isArray(props.name) ? props.name.join('.') : props.name;
    const _rules = formRules[key] as Arrayable<FormItemRule> | undefined;
    if (_rules) {
      rules.push(...ensureArray(_rules));
    }
  }

  if (required !== undefined) {
    const requiredRules = rules
      .map((rule, i) => [rule, i] as const)
      .filter(([rule]) => 'required' in rule);

    if (requiredRules.length > 0) {
      for (const [rule, i] of requiredRules) {
        if (rule.required === required) continue;
        rules[i] = { ...rule, required };
      }
    } else {
      rules.push({ required });
    }
  }

  return rules;
});

/** 是否启用校验 */
const validateEnabled = computed(() => normalizedRules.value.length > 0);

/** 是否必填 */
const isRequired = computed(() =>
  normalizedRules.value.some((rule) => rule.required),
);

/** 是否应该显示错误信息 */
const shouldShowError = computed(
  () =>
    validateState.value === 'error' &&
    props.showMessage &&
    (formContext?.showMessage ?? true),
);

/** 当前 label 文本 */
const currentLabel = computed(() => props.label || '');

/** 设置校验状态 */
function setValidationState(state: FormItemValidateState) {
  validateState.value = state;
}

/** 校验失败处理 */
function onValidationFailed(error: FormValidateFailure) {
  const { errors } = error;
  setValidationState('error');
  validateMessage.value = errors
    ? (errors?.[0]?.message ?? `${props.name} is required`)
    : '';

  formContext?.emit('validate', props.name!, false, validateMessage.value);
}

/** 校验成功处理 */
function onValidationSucceeded() {
  setValidationState('success');
  formContext?.emit('validate', props.name!, true, '');
}

/** 执行校验 */
async function doValidate(rules: RuleItem[]): Promise<true> {
  const modelName = nameString.value;
  const validator = new AsyncValidator({
    [modelName]: rules,
  });
  return validator
    .validate({ [modelName]: fieldValue.value }, { firstFields: true })
    .then(() => {
      onValidationSucceeded();
      return true as const;
    })
    .catch((err: FormValidateFailure) => {
      onValidationFailed(err);
      return Promise.reject(err);
    });
}

/** 校验字段 */
const validate: FormItemContext['validate'] = async (trigger, callback) => {
  if (isResettingField || !props.name) {
    return false;
  }

  const hasCallback = isFunction(callback);
  if (!validateEnabled.value) {
    callback?.(false);
    return false;
  }

  const rules = getFilteredRule(trigger);
  if (rules.length === 0) {
    callback?.(true);
    return true;
  }

  setValidationState('validating');

  return doValidate(rules)
    .then(() => {
      callback?.(true);
      return true as const;
    })
    .catch((err: FormValidateFailure) => {
      const { fields } = err;
      callback?.(false, fields);
      return hasCallback ? false : Promise.reject(fields);
    });
};

/** 获取过滤后的规则 */
function getFilteredRule(trigger: string) {
  const rules = normalizedRules.value;
  return rules
    .filter((rule) => {
      if (!rule.trigger || !trigger) return true;
      if (isArray(rule.trigger)) {
        return rule.trigger.includes(trigger);
      } else {
        return rule.trigger === trigger;
      }
    })
    .map(({ trigger: _trigger, ...rule }): RuleItem => rule);
}

/** 清除校验信息 */
function clearValidate() {
  setValidationState('');
  validateMessage.value = '';
  isResettingField = false;
}

/** 重置字段 */
async function resetField() {
  const model = formContext?.model;
  if (!model || !props.name) return;

  const computedValue = getProp(model, props.name);

  isResettingField = true;

  computedValue.value = cloneDeep(initialValue);

  await nextTick();
  clearValidate();

  isResettingField = false;
}

/** 设置初始值 */
function setInitialValue(value: any) {
  initialValue = cloneDeep(value);
}

/** 获取初始值 */
function getInitialValue() {
  return initialValue;
}

/** 监听 error prop 变化 */
watch(
  () => props.error,
  (val) => {
    validateMessage.value = val || '';
    setValidationState(val ? 'error' : '');
  },
  { immediate: true },
);

/** 监听 validateStatus prop 变化 */
watch(
  () => props.validateStatus,
  (val) => {
    if (props.error) return;
    setValidationState(val || '');
  },
  { immediate: true },
);

/** FormItem 上下文 */
const context: FormItemContext = reactive({
  ...toRefs(props),
  $el: formItemRef,
  size: _size,
  validateMessage,
  validateState,
  fieldValue,
  resetField,
  clearValidate,
  validate,
  nameString,
  setInitialValue,
  getInitialValue,
});

/** 提供 FormItem 上下文给子组件 */
provide(formItemContextKey, context);

/** 监听 name 变化，更新 Form 中的字段注册 */
watch(nameString, (newNameString, oldNameString) => {
  if (!formContext) return;
  if (oldNameString) {
    formContext.removeField(context, oldNameString);
  }
  if (newNameString) {
    setInitialValue(fieldValue.value);
    formContext.addField(context);
  }
});

onMounted(() => {
  if (props.name) {
    setInitialValue(fieldValue.value);
    formContext?.addField(context);
  }
});

onBeforeUnmount(() => {
  formContext?.removeField(context);
});

defineExpose({
  /** 组件尺寸 */
  size: _size,
  /** 校验信息 */
  validateMessage,
  /** 校验状态 */
  validateState,
  /** 校验字段 */
  validate,
  /** 清除校验信息 */
  clearValidate,
  /** 重置字段 */
  resetField,
  /** 设置初始值 */
  setInitialValue,
});
</script>
