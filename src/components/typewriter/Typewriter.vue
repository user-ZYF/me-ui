<!-- Typewriter 打字机组件 -->
<template>
  <div :class="[ns.b.value, ns.is('block', block)]">
    <slot :display-text="displayText">
      <span :class="ns.e('text')">{{ displayText }}</span>
      <span v-if="showCursor && !disabled" :class="ns.e('cursor')">{{ cursorSymbol }}</span>
    </slot>
  </div>
</template>

<script lang="ts" setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';

import { useNamespace } from '@me-ui/hooks/use-namespace';

import { typewriterEmits, typewriterProps } from './typewriter';

defineOptions({ name: 'MeTypewriter' });

const props = defineProps(typewriterProps);
const emit = defineEmits(typewriterEmits);

const ns = useNamespace('typewriter');

/** 定时器编号 */
const timerId = ref<ReturnType<typeof setTimeout> | null>(null);

/** 当前已显示的字符下标 */
const charIndex = ref(0);

/** 按 code point 拆分文案，避免 emoji 等代理对字符被切半 */
const chars = computed(() => Array.from(props.text));

/** 显示的文本 */
const displayText = computed(() => chars.value.slice(0, charIndex.value).join(''));

/** 当前正在执行的操作 */
const runningAction = ref<'type' | 'delete' | null>(null);

/** 清理定时器（不触发事件） */
function clearTimer() {
  if (timerId.value !== null) {
    clearTimeout(timerId.value);
    timerId.value = null;
  }
  runningAction.value = null;
}

/** 打字 */
function tickType() {
  if (charIndex.value < chars.value.length) {
    charIndex.value++;
    emit('display', displayText.value);
    timerId.value = setTimeout(tickType, props.speed);
  } else if (props.loop) {
    // 打完后停留 loopDelay 再清空重打
    charIndex.value = 0;
    emit('display', displayText.value);
    timerId.value = setTimeout(tickType, props.speed);
  } else {
    clearTimer();
    emit('complete');
  }
}

/** 删除 */
function tickDelete() {
  if (charIndex.value > 0) {
    charIndex.value--;
    emit('display', displayText.value);
    timerId.value = setTimeout(tickDelete, props.speed);
  } else {
    clearTimer();
    emit('clear');
  }
}

/** 开始打字（正在打字时静默忽略，不会重复触发 start；删除中调用会切换为打字） */
function startTyping() {
  if (props.disabled || runningAction.value === 'type') return;
  // 清除反向计时器
  clearTimer();
  emit('start');
  runningAction.value = 'type';
  timerId.value = setTimeout(tickType, props.speed);
}

/** 停止打字 */
function stopTyping() {
  if (props.disabled || timerId.value === null) return;
  clearTimer();
  emit('stop');
}

/** 重新打字 */
function reStartTyping() {
  if (props.disabled) return;
  charIndex.value = 0;
  clearTimer();
  startTyping();
}

/** 立即完成打字（显示完整文案） */
function completeTyping() {
  if (props.disabled) return;
  clearTimer();
  charIndex.value = chars.value.length;
  emit('display', displayText.value);
  emit('complete');
}

/** 删除打字（正在删除时静默忽略，不会重复触发 delete；打字中调用会切换为删除） */
function deleteTyping() {
  if (props.disabled || runningAction.value === 'delete') return;
  // 清除正向计数器
  clearTimer();
  if (charIndex.value === 0) {
    emit('delete');
    emit('clear');
    return;
  }
  emit('delete');
  runningAction.value = 'delete';
  timerId.value = setTimeout(tickDelete, props.speed);
}

watch(
  () => props.disabled,
  (disabled) => {
    if (disabled) {
      clearTimer();
      charIndex.value = chars.value.length;
    }
  },
  { immediate: true },
);

watch(
  () => props.text,
  () => {
    if (props.autoStart) {
      // text 变化时重新开始打字
      reStartTyping();
    } else {
      // 重置下标，避免残留旧文案或打字中错位进入新文案
      charIndex.value = 0;
    }
  },
);

onMounted(() => {
  if (props.autoStart) {
    startTyping();
  }
});

onBeforeUnmount(clearTimer);

defineExpose({
  /** 显示的文本内容 */
  text: displayText,
  /** 开始打字 */
  start: startTyping,
  /** 停止打字 */
  stop: stopTyping,
  /** 重新打字 */
  reStart: reStartTyping,
  /** 立即完成打字 */
  complete: completeTyping,
  /** 删除打字 */
  delete: deleteTyping,
});
</script>
