<!-- Modal 对话框 -->
<template>
  <teleport to="body">
    <transition :name="`${ns.namespace}-modal-fade`" appear @after-leave="onAfterLeave">
      <div
        v-if="openModel"
        :class="[ns.e('wrapper'), ns.is('transparent', !mask)]"
        :style="wrapperStyle"
        @click="onWrapperClick"
        @mousedown.self="onWrapperMousedown"
        @mouseup.self="onWrapperMouseup"
      >
        <div
          :class="[ns.b.value, modalClassName]"
          :style="modalStyle"
          @click.stop
        >
            <!-- 头部（包含关闭按钮） -->
            <div v-if="closable || hasTitle" :class="ns.e('header')">
              <slot name="title">
                <span :class="ns.e('title')">{{ title }}</span>
              </slot>
              <!-- 关闭按钮 -->
              <button
                v-if="closable"
                :class="ns.e('close')"
                type="button"
                @click="onCloseClick"
              >
                <me-icon :size="16">
                  <Close />
                </me-icon>
              </button>
            </div>

            <!-- 内容 -->
            <div :class="ns.e('body')">
              <slot></slot>
            </div>

            <!-- 底部 -->
            <div v-if="hasFooter" :class="ns.e('footer')">
              <template v-if="customFooter">
                <component :is="customFooter" />
              </template>
              <slot v-else name="footer">
                <me-button
                  v-if="showCancel"
                  :disabled="cancelButtonDisabled"
                  :loading="cancelLoading"
                  @click="onCancelClick"
                >
                  {{ cancelText }}
                </me-button>
                <me-button
                  :type="confirmType"
                  :disabled="confirmButtonDisabled"
                  :loading="confirmLoading"
                  @click="onConfirmClick"
                >
                  {{ confirmText }}
                </me-button>
              </slot>
            </div>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script lang="ts" setup>
import { computed, useSlots } from 'vue';

import { Close } from '@element-plus/icons-vue';

import MeButton from '@me-ui/components/button';
import MeIcon from '@me-ui/components/icon';
import { useNamespace } from '@me-ui/hooks/use-namespace';

import { modalEmits, modalProps } from './modal';

defineOptions({ name: 'MeModal' });

const props = defineProps(modalProps);
const emit = defineEmits(modalEmits);

const ns = useNamespace('modal');
const slots = useSlots();

/** v-model:open 双向绑定 */
const openModel = defineModel<boolean>('open', {
  default: false,
});

/** 是否有标题 */
const hasTitle = computed(() => {
  return props.title !== '' || !!slots.title;
});

/** 是否有 footer（null 隐藏，undefined 显示默认按钮，VNode/函数显示自定义） */
const hasFooter = computed(() => {
  return props.footer !== null;
});

/** 自定义 footer 内容 */
const customFooter = computed(() => {
  if (props.footer === null) return null;
  if (typeof props.footer === 'function') return props.footer();
  if (props.footer !== undefined) return props.footer;
  return null;
});

/** wrapper 样式 */
const wrapperStyle = computed(() => ({
  zIndex: props.zIndex,
}));

/** modal 样式 */
const modalStyle = computed(() => ({
  width: typeof props.width === 'number' ? `${props.width}px` : props.width,
}));

/** 记录 mousedown / mouseup 是否发生在遮罩本身，规避跨元素拖动误触发遮罩点击 */
let mouseDownOnWrapper = false;
let mouseUpOnWrapper = false;

/** wrapper mousedown（仅当 target 为 wrapper 本身时触发） */
function onWrapperMousedown() {
  mouseDownOnWrapper = true;
}

/** wrapper mouseup（仅当 target 为 wrapper 本身时触发） */
function onWrapperMouseup() {
  mouseUpOnWrapper = true;
}

/** wrapper 点击（遮罩点击） */
function onWrapperClick() {
  // 只有 mousedown 和 mouseup 都落在遮罩本身，才视为一次遮罩点击
  // 跨元素拖动（如 content down + wrapper up，或 wrapper down + content up）
  // 会导致 click 派发在共同祖先 wrapper 上，此时不应关闭
  const shouldClose = mouseDownOnWrapper && mouseUpOnWrapper;
  mouseDownOnWrapper = false;
  mouseUpOnWrapper = false;
  if (shouldClose && props.maskClosable) {
    handleClose();
  }
}

/** 关闭按钮点击 */
function onCloseClick() {
  handleClose();
}

/** 确认按钮点击 */
function onConfirmClick() {
  emit('confirm');
}

/** 取消按钮点击 */
function onCancelClick() {
  emit('cancel');
  openModel.value = false;
}

/** 关闭处理 */
function handleClose() {
  emit('cancel');
  openModel.value = false;
}

/** 关闭过渡动画结束 */
function onAfterLeave() {
  emit('afterLeave');
}
</script>
