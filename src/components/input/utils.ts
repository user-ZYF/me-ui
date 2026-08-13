import type { CSSProperties } from 'vue';

/** 隐藏 textarea 样式 */
const HIDDEN_STYLE: Record<string, string> = {
  height: '0',
  visibility: 'hidden',
  overflow: 'hidden',
  position: 'absolute',
  'z-index': '-1000',
  top: '0',
  right: '0',
};

/** 需要复制的上下文样式属性 */
const CONTEXT_STYLE = [
  'letter-spacing',
  'line-height',
  'padding-top',
  'padding-bottom',
  'font-family',
  'font-weight',
  'font-size',
  'text-rendering',
  'text-transform',
  'width',
  'text-indent',
  'padding-left',
  'padding-right',
  'border-width',
  'box-sizing',
  'word-break',
];

/** 节点样式信息 */
interface NodeStyle {
  /** 上下文样式键值对 */
  contextStyle: string[][];
  /** box-sizing 值 */
  boxSizing: string;
  /** 上下 padding 总和 */
  paddingSize: number;
  /** 上下 border 总和 */
  borderSize: number;
}

/** textarea 高度计算结果 */
export type TextAreaHeight = CSSProperties & {
  /** 高度 */
  height: string;
  /** 最小高度 */
  minHeight?: string;
};

/** 计算目标元素的样式信息 */
function calculateNodeStyling(targetElement: Element): NodeStyle {
  const style = window.getComputedStyle(targetElement);

  const boxSizing = style.getPropertyValue('box-sizing');

  const paddingSize =
    Number.parseFloat(style.getPropertyValue('padding-bottom')) +
    Number.parseFloat(style.getPropertyValue('padding-top'));

  const borderSize =
    Number.parseFloat(style.getPropertyValue('border-bottom-width')) +
    Number.parseFloat(style.getPropertyValue('border-top-width'));

  const contextStyle = CONTEXT_STYLE.map((name) => [
    name,
    style.getPropertyValue(name),
  ]);

  return { contextStyle, paddingSize, borderSize, boxSizing };
}

/**
 * 计算 textarea 自适应高度
 * 通过创建隐藏的 textarea 副本，复制样式后测量其 scrollHeight
 * @param targetElement 目标 textarea 元素
 * @param minRows 最小行数
 * @param maxRows 最大行数
 */
export function calcTextareaHeight(
  targetElement: HTMLTextAreaElement,
  minRows?: number,
  maxRows?: number,
): TextAreaHeight & CSSProperties {
  // 创建隐藏的 textarea 副本，用于测量内容所需高度，不影响页面显示
  const hiddenTextarea = document.createElement('textarea');
  document.body.appendChild(hiddenTextarea);

  try {
    // 从原 textarea 提取样式信息（padding、border、box-sizing、上下文样式）
    const { paddingSize, borderSize, boxSizing, contextStyle } =
      calculateNodeStyling(targetElement);

    // 将原 textarea 的上下文样式复制到隐藏副本，确保两者渲染一致
    contextStyle.forEach(([key, val]) =>
      hiddenTextarea.style.setProperty(key, val),
    );

    // 应用隐藏样式（important 覆盖前面复制的 height 等），使副本不可见且不影响布局
    Object.entries(HIDDEN_STYLE).forEach(([key, val]) =>
      hiddenTextarea.style.setProperty(key, val, 'important'),
    );

    // 【第一次测量】设置实际内容（优先 value，其次 placeholder），测量完整内容所需高度
    hiddenTextarea.value = targetElement.value || targetElement.placeholder || '';

    // scrollHeight = padding + 内容区高度（此时为完整内容撑开的高度）
    let height = hiddenTextarea.scrollHeight;
    const result = {} as TextAreaHeight;

    // 根据 box-sizing 修正高度：
    // - border-box：scrollHeight 不含 border，需加回 border
    // - content-box：scrollHeight 含 padding，需减去 padding（因为 height 属性只管内容区）
    if (boxSizing === 'border-box') {
      height = height + borderSize;
    } else if (boxSizing === 'content-box') {
      height = height - paddingSize;
    }

    // 【第二次测量】清空内容，测量单行高度
    // textarea 即使内容为空也会渲染一行空行，所以：
    // scrollHeight = padding + 单行文本高度
    // 单行文本高度 = scrollHeight - padding
    hiddenTextarea.value = '';
    const singleRowHeight = hiddenTextarea.scrollHeight - paddingSize;

    // 根据 minRows 计算最小高度约束
    if (typeof minRows === 'number') {
      let minHeight = singleRowHeight * minRows;
      // border-box 下 height 属性包含 padding 和 border，需补上
      if (boxSizing === 'border-box') {
        minHeight = minHeight + paddingSize + borderSize;
      }
      // 取内容和最小高度的较大值，确保不小于 minRows
      height = Math.max(minHeight, height);
      result.minHeight = `${minHeight}px`;
    }
    // 根据 maxRows 计算最大高度约束
    if (typeof maxRows === 'number') {
      let maxHeight = singleRowHeight * maxRows;
      // border-box 下 height 属性包含 padding 和 border，需补上
      if (boxSizing === 'border-box') {
        maxHeight = maxHeight + paddingSize + borderSize;
      }
      // 取内容和最大高度的较小值，确保不大于 maxRows
      height = Math.min(maxHeight, height);
    }
    result.height = `${height}px`;

    return result;
  } finally {
    // 移除隐藏副本，避免 DOM 泄漏
    hiddenTextarea.parentNode?.removeChild(hiddenTextarea);
  }
}
