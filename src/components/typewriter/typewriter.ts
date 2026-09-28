import type { ExtractPropTypes } from 'vue';

/** Typewriter Props 定义 */
export const typewriterProps = {
  /** 是否独占一行 */
  block: {
    type: Boolean,
    default: true,
  },
  /** 完整的文案 */
  text: {
    type: String,
    default: '',
  },
  /** 打字/删除速度（单位：ms） */
  speed: {
    type: Number,
    default: 50,
  },
  /** 是否循环 */
  loop: {
    type: Boolean,
    default: false,
  },
  /** 是否自动开始 */
  autoStart: {
    type: Boolean,
    default: false,
  },
  /** 是否显示光标 */
  showCursor: {
    type: Boolean,
    default: true,
  },
  /** 光标符号 */
  cursorSymbol: {
    type: String,
    default: '|',
  },
  /** 是否禁用（禁用时直接显示完整文案，不再播放动画） */
  disabled: {
    type: Boolean,
    default: false,
  },
} as const;

/** Typewriter Props 类型 */
export type TypewriterProps = ExtractPropTypes<typeof typewriterProps>;

/** Typewriter Emits 定义 */
export const typewriterEmits = {
  /** 开始打字（正向） */
  start: () => true,
  /** 开始删除（反向） */
  delete: () => true,
  /** 手动停止（自然结束不会触发，只触发 complete） */
  stop: () => true,
  /** 打字完成（completeTyping 立即完成时也会触发） */
  complete: () => true,
  /** 每显示/删除一个字符时触发 */
  display: (text: string) => typeof text === 'string',
  /** 删除完成（文本清空） */
  clear: () => true,
} as const;

/** Typewriter Emits 类型 */
export type TypewriterEmits = typeof typewriterEmits;
