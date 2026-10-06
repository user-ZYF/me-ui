<!-- FormItem 表单项组件 -->
<template>
  <div
    ref="formItemRef"
    :class="[
      ns.b.value,
      ns.m(_size),
      ns.is('error', validateState === 'error'),
      ns.is('validating', validateState === 'validating'),
      ns.is('success', validateState === 'success'),
      ns.is('required', isRequired || props.required),
      ns.is('no-asterisk', formContext?.hideRequiredAsterisk),
    ]"
  >
    <label
      v-if="!!(label || $slots.label)"
      :for="labelFor"
      :class="ns.e('label')"
    >
      <slot name="label" :label="labelText">
        {{ labelText }}
      </slot>
    </label>

    <div :class="ns.e('content')">
      <slot></slot>
      <!-- 校验失败错误提示 -->
      <transition :name="`${ns.namespace}-zoom-in-top`" appear>
        <slot v-if="shouldShowError" name="error" :error="validateMessage">
          <div :class="ns.e('error')">
            {{ validateMessage }}
          </div>
        </slot>
      </transition>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {
  computed,
  inject,
  nextTick,
  onBeforeUnmount,
  onMounted,
  provide,
  reactive,
  ref,
  toRefs,
  watch,
} from 'vue';

import AsyncValidator from 'async-validator';

import { useNamespace } from '@me-ui/hooks/use-namespace';

import { formContextKey, formItemContextKey } from './constants';
import { formItemProps } from './form-item';
import { cloneDeep, ensureArray, getProp, isArray } from './utils';
import { useFormSize } from './hooks';

import type { RuleItem } from 'async-validator';
import type { Arrayable } from './utils';
import type {
  FormItemContext,
  FormItemRule,
  FormValidateFailure,
} from './types';
import type { FormItemValidateState } from './form-item';

defineOptions({ name: 'MeFormItem' });

const props = defineProps(formItemProps);

const formContext = inject(formContextKey, undefined);

/** 组件尺寸 */
const _size = useFormSize(
  computed(() => props.size),
  { formItem: false },
);
const ns = useNamespace('form-item');

/** 校验状态 */
const validateState = ref<FormItemValidateState>('');
/** 校验信息 */
const validateMessage = ref('');
/** FormItem 根元素引用 */
const formItemRef = ref<HTMLDivElement>();
/** 是否正在重置字段 */
let isResetting = false;

/** 字段路径字符串 */
const propString = computed(() => {
  if (!props.propPath) return '';
  return isArray(props.propPath) ? props.propPath.join('.') : props.propPath;
});

/** label 的 for 属性 */
const labelFor = computed<string | undefined>(() => props.labelFor);

/** 字段当前值 */
const formItemValue = computed(() => {
  const data = formContext?.data;
  if (!data || !propString.value) {
    return;
  }
  return getProp(data, props.propPath!).value;
});

/** 合并后的校验规则 */
const normalizedRules = computed(() => {
  const { required } = props;

  // 规则汇总
  const totalRules: FormItemRule[] = [];

  if (props.rules) {
    totalRules.push(...ensureArray(props.rules));
  }

  const formRules = formContext?.rules;
  if (formRules && propString.value) {
    const _rules = formRules[propString.value] as Arrayable<FormItemRule> | undefined;
    if (_rules) {
      totalRules.push(...ensureArray(_rules));
    }
  }

  if (required !== undefined) {
    // 当props.required存在时，规则中的required需要对齐prop.required
    const requiredRules = totalRules
      .map((rule, i) => [rule, i] as const)
      .filter(([rule]) => 'required' in rule);

    if (requiredRules.length > 0) {
      for (const [rule, i] of requiredRules) {
        if (rule.required === required) continue;
        totalRules[i] = { ...rule, required };
      }
    } else {
      totalRules.push({ required });
    }
  }

  return totalRules;
});

/** 是否必填 */
const isRequired = computed(() =>
  normalizedRules.value.some((rule) => rule.required),
);

/** 是否应该显示错误信息 */
const shouldShowError = computed(
  () =>
    validateState.value === 'error' &&
    props.showErrorMessage &&
    (formContext?.showErrorMessage ?? true),
);

/** label 文本 */
const labelText = computed(() => props.label);

/** 校验失败处理 */
function onValidationFailed(error: FormValidateFailure) {
  const { errors } = error;
  validateState.value = 'error';
  // errorText 作为错误文案的优先覆盖
  validateMessage.value = props.errorText || errors?.[0]?.message || '';

  formContext?.emit('validate', props.propPath!, false, validateMessage.value);
}

/** 校验成功处理 */
function onValidationSucceeded() {
  validateState.value = 'success';
  formContext?.emit('validate', props.propPath!, true, '');
}

/** 执行校验：成功 resolve，失败 reject */
async function doValidate(rules: RuleItem[]) {
  const propKey = propString.value;
  const validator = new AsyncValidator({
    [propKey]: rules,
  });
  try {
    await validator.validate(
      { [propKey]: formItemValue.value },
      // 遇到第一条失败的规则就停止校验
      { firstFields: true },
    );
    onValidationSucceeded();
  } catch (err) {
    onValidationFailed(err as FormValidateFailure);
    throw err;
  }
}

/** 校验字段 */
const validate: FormItemContext['validate'] = async (trigger) => {
  // 重置中或未配置字段路径，不执行校验
  if (isResetting || !propString.value) {
    // 重置结束后自动会clearValidate，这里不干预，避免出现问题
    // propString为空时，只有使用方能够更改校验状态，而使用方设置的状态不应该被clear
    return false;
  }

  const rules = getFilteredRule(trigger);
  // 没有适用的规则，不执行校验；清掉残留的 error 状态
  if (rules.length === 0) {
    clearValidate();
    return false;
  }

  validateState.value = 'validating';

  try {
    await doValidate(rules);
    return true;
  } catch (err) {
    throw (err as FormValidateFailure).fields;
  }
};

/** 获取过滤后的规则 */
function getFilteredRule(trigger?: string) {
  return normalizedRules.value.filter((rule) => {
    // 无触发方式即通用匹配，可以匹配任意的规则
    if (!rule.trigger || !trigger) return true;
    return isArray(rule.trigger) ? rule.trigger.includes(trigger) : rule.trigger === trigger;
  });
}

/** 清除校验信息 */
function clearValidate() {
  validateState.value = '';
  validateMessage.value = '';
  isResetting = false;
}

/** 重置字段 */
async function resetFormItem() {
  const data = formContext?.data;
  if (!data || !propString.value) return;

  const computedValue = getProp(data, props.propPath!);

  isResetting = true;

  // 初始值由 Form 统一缓存
  computedValue.value = cloneDeep(formContext.getInitialValue(propString.value));

  await nextTick();
  clearValidate();
}

/** 监听 errorText prop 变化 */
watch(
  () => props.errorText,
  (val) => {
    validateMessage.value = val || "";
  },
  { immediate: true },
);

/** 监听 validateStatus prop 变化 */
watch(
  () => props.validateStatus,
  (val) => {
    validateState.value = val || "";
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
  formItemValue,
  resetFormItem,
  clearValidate,
  validate,
  propString,
});

/** 提供 FormItem 上下文给子组件 */
provide(formItemContextKey, context);

/** 监听 prop 变化，更新 Form 中的字段注册 */
watch(propString, (newPropString, oldPropString) => {
  if (!formContext) return;
  if (oldPropString) {
    formContext.removeInitialValue(oldPropString);
  }
  if (newPropString) {
    // prop 变更视为新绑定：清掉新路径可能存在的旧缓存，注册时以当前值作为初始值
    formContext.removeInitialValue(newPropString);
    formContext.addFormItemContext(context);
  } else {
    // prop 清空：注销注册，避免空 propString 的 context 滞留
    formContext.removeFormItemContext(context);
  }
});

onMounted(() => {
  if (propString.value) {
    formContext?.addFormItemContext(context);
  }
});

onBeforeUnmount(() => {
  formContext?.removeFormItemContext(context);
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
  resetFormItem,
});
</script>
