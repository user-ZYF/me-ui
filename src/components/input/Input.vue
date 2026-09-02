<!-- ? Input 输入框 -->
<template>
  <div
    :class="[
      ns.b.value,
      ns.m(actualSize),
      ns.is('disabled', actualDisabled),
      ns.is('focus', isFocused),
      ns.is('textarea', isTextarea),
      ns.is('clearable', showClearIcon),
      ns.is('password', showPasswordIcon),
      ns.is('autosize', !!props.autosize),
    ]"
    @mouseenter="isHovering = true"
    @mouseleave="isHovering = false"
  >
    <!-- 前置内容 -->
    <div v-if="$slots.prepend" :class="ns.e('prepend')">
      <slot name="prepend"></slot>
    </div>

    <!-- textarea 模式：textarea 和 clear 图标作为容器直接子元素 -->
    <template v-if="isTextarea">
      <textarea
        v-bind="$attrs"
        ref="textareaRef"
        :class="[ns.e('inner'), ns.is('clearable', clearable)]"
        v-model="value"
        :style="textareaCalcStyle"
        :placeholder="placeholder"
        :disabled="actualDisabled"
        :readonly="readonly"
        :maxlength="maxlength"
        :minlength="minlength"
        :rows="rows"
        :autofocus="autofocus"
        :name="name"
        autocomplete="off"
        :form="form"
        @input="handleInput"
        @change="handleValueChange"
        @focus="onFocus"
        @blur="onBlur"
        @keydown="onKeydown"
        @keyup="onKeyup"
        @keypress="onKeypress"
      ></textarea>

      <!-- 清除按钮（绝对定位浮在 textarea 上） -->
      <!-- @mousedown.prevent 阻止默认行为，防止点击图标时 textarea 失焦 -->
      <me-icon
        v-if="showClearIcon"
        :class="ns.e('clear')"
        :size="14"
        @mousedown.prevent
        @click="handleClear"
      >
        <CircleClose />
      </me-icon>
    </template>

    <!-- input 模式：使用 wrapper 包裹 -->
    <template v-else>
      <!-- 输入区域 -->
      <div :class="ns.e('wrapper')">
        <!-- 前缀图标 -->
        <me-icon
          v-if="prefixIcon || $slots.prefix"
          :class="ns.e('prefix')"
          :size="14"
        >
          <slot v-if="$slots.prefix" name="prefix"></slot>
          <component :is="prefixIcon" v-else />
        </me-icon>

        <input
          v-bind="$attrs"
          ref="inputRef"
          :class="ns.e('inner')"
          :type="actualType"
          v-model="value"
          :placeholder="placeholder"
          :disabled="actualDisabled"
          :readonly="readonly"
          :maxlength="maxlength"
          :minlength="minlength"
          :autofocus="autofocus"
          :name="name"
          autocomplete="off"
          :form="form"
          @input="handleInput"
          @change="handleValueChange"
          @focus="onFocus"
          @blur="onBlur"
          @keydown="onKeydown"
          @keyup="onKeyup"
          @keypress="onKeypress"
        />

        <!-- 后缀区域：清除按钮、密码切换、后缀图标 -->
        <me-icon
          v-if="showClearIcon"
          :class="ns.e('clear')"
          :size="14"
          @mousedown.prevent
          @click="handleClear"
        >
          <CircleClose />
        </me-icon>

        <me-icon
          v-if="showPasswordIcon"
          :class="ns.e('password')"
          :size="14"
          @mousedown.prevent
          @mouseup.prevent
          @click="handleTogglePassword"
        >
          <View v-if="isPasswordVisible" />
          <Hide v-else />
        </me-icon>

        <me-icon
          v-if="suffixIcon || $slots.suffix"
          :class="ns.e('suffix')"
          :size="14"
        >
          <slot v-if="$slots.suffix" name="suffix"></slot>
          <component :is="suffixIcon" v-else />
        </me-icon>
      </div>
    </template>

    <!-- 后置内容 -->
    <div v-if="$slots.append" :class="ns.e('append')">
      <slot name="append"></slot>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, nextTick, onMounted, ref, shallowRef, watch, type StyleValue } from 'vue';

import { CircleClose, Hide, View } from '@element-plus/icons-vue';

import MeIcon from '@me-ui/components/icon';
import { useFormItem, useFormDisabled, useFormSize } from '@me-ui/components/form/hooks';
import { useNamespace } from '@me-ui/hooks/use-namespace';

import { inputEmits, inputProps } from './input';
import { calcTextareaHeight } from './utils';

defineOptions({ name: 'MeInput', inheritAttrs: false });

const props = defineProps(inputProps);
const emit = defineEmits(inputEmits);

/** v-model 绑定值 */
const value = defineModel<string | number>({ default: '' });

const ns = useNamespace('input');
const { formItem } = useFormItem();

/** input 元素引用 */
const inputRef = ref<HTMLInputElement>();
/** textarea 元素引用 */
const textareaRef = ref<HTMLTextAreaElement>();

/** 是否聚焦 */
const isFocused = ref(false);
/** 是否 hover */
const isHovering = ref(false);
/** 密码是否可见 */
const isPasswordVisible = ref(false);

/** 实际尺寸：优先使用 prop 传入的，其次继承 Form/FormItem 的，最后使用 ConfigProvider 的，最后使用默认值 */
const actualSize = useFormSize(computed(() => props.size));

/** 实际禁用状态：优先使用 prop 传入的，其次继承 Form 的 */
const actualDisabled = useFormDisabled(computed(() => props.disabled));

/** 是否为 textarea 模式 */
const isTextarea = computed(() => props.type === 'textarea');

/** 实际 input type */
const actualType = computed(() => {
  if (props.type === 'password') {
    return isPasswordVisible.value ? 'text' : 'password';
  }
  return props.type;
});

/** 是否显示清除图标 */
const showClearIcon = computed(() => {
  if (!props.clearable || actualDisabled.value || props.readonly) return false;
  if (!value.value && value.value !== 0) return false;
  return isFocused.value || isHovering.value;
});

/** 是否显示密码切换图标 */
const showPasswordIcon = computed(() => {
  return props.showPassword && props.type === 'password' && !actualDisabled.value;
});

/** 组件元素引用 */
const componentRef = computed(() => (isTextarea.value ? textareaRef.value : inputRef.value));

/** textarea 计算样式 */
const textareaCalcStyle = shallowRef<StyleValue>({});

/** 监听 value 变化，autosize 模式下重新计算 textarea 高度 */
watch(
  () => value.value,
  () => {
    if (isTextarea.value && props.autosize) {
      nextTick(resizeTextarea);
    }
  },
);

/** 监听 autosize 配置变化，动态切换自适应模式时重新计算高度 */
watch(
  () => props.autosize,
  () => {
    if (isTextarea.value && props.autosize) {
      nextTick(resizeTextarea);
    }
  },
);

/**
 * textarea 自适应高度计算
 * 通过创建隐藏的 textarea 副本测量实际所需高度，避免滚动条闪烁
 */
function resizeTextarea() {
  const target = textareaRef.value;
  // SSR 环境或非 textarea 模式或元素未挂载时跳过
  if (typeof window === 'undefined' || !isTextarea.value || !target) return;

  if (props.autosize) {
    // autosize 为对象时提取 minRows/maxRows，为 boolean 时传 undefined
    const minRows = typeof props.autosize === 'object' ? props.autosize.minRows : undefined;
    const maxRows = typeof props.autosize === 'object' ? props.autosize.maxRows : undefined;
    const textareaStyle = calcTextareaHeight(target, minRows, maxRows);

    // 先隐藏滚动条，避免计算高度时滚动条闪烁
    textareaCalcStyle.value = {
      overflowY: 'hidden',
      ...textareaStyle,
    } as StyleValue;

    nextTick(() => {
      // 强制重绘，确保上面的样式生效后再应用最终样式
      target.offsetHeight;
      textareaCalcStyle.value = textareaStyle;
    });
  }
}

/** 输入事件：每次输入时触发 */
function handleInput(evt: Event) {
  const target = evt.target as HTMLInputElement | HTMLTextAreaElement;
  const inputValue = target.value;
  emit('input', inputValue);
}

/** 值变化事件：失焦或按回车时触发 */
function handleValueChange(evt: Event) {
  const target = evt.target as HTMLInputElement | HTMLTextAreaElement;
  emit('change', target.value);
  formItem?.validate('change').catch(() => {});
}

/** 聚焦事件 */
function onFocus(evt: FocusEvent) {
  isFocused.value = true;
  emit('focus', evt);
}

/** 失焦事件 */
function onBlur(evt: FocusEvent) {
  isFocused.value = false;
  emit('blur', evt);
  formItem?.validate('blur').catch(() => {});
}

/** 清空：清空绑定值并触发 clear 事件（焦点由 @mousedown.prevent 保留） */
function handleClear() {
  value.value = '';
  emit('clear');
}

/** 切换密码可见性（焦点由 @mousedown.prevent 保留） */
function handleTogglePassword() {
  isPasswordVisible.value = !isPasswordVisible.value;
}

/** 键盘按下事件 */
function onKeydown(evt: KeyboardEvent) {
  emit('keydown', evt);
}

/** 键盘释放事件 */
function onKeyup(evt: KeyboardEvent) {
  emit('keyup', evt);
}

/** 字符键按下事件 */
function onKeypress(evt: KeyboardEvent) {
  emit('keypress', evt);
}

/** 挂载时初始化 textarea 自适应高度 */
onMounted(() => {
  if (isTextarea.value && props.autosize) {
    nextTick(resizeTextarea);
  }
});

defineExpose({
  /** 获取原生元素引用 */
  ref: componentRef,
  /** 手动聚焦 */
  focus: () => componentRef.value?.focus(),
  /** 手动失焦 */
  blur: () => componentRef.value?.blur(),
  /** 选中文本 */
  select: () => (componentRef.value as HTMLInputElement)?.select(),
  /** 重新计算 textarea 高度 */
  resizeTextarea,
});
</script>
