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
  const hiddenTextarea = document.createElement('textarea');
  document.body.appendChild(hiddenTextarea);

  try {
    const { paddingSize, borderSize, boxSizing, contextStyle } =
      calculateNodeStyling(targetElement);

    contextStyle.forEach(([key, val]) =>
      hiddenTextarea.style.setProperty(key, val),
    );

    Object.entries(HIDDEN_STYLE).forEach(([key, val]) =>
      hiddenTextarea.style.setProperty(key, val, 'important'),
    );

    hiddenTextarea.value = targetElement.value || targetElement.placeholder || '';

    let height = hiddenTextarea.scrollHeight;
    const result = {} as TextAreaHeight;

    if (boxSizing === 'border-box') {
      height = height + borderSize;
    } else if (boxSizing === 'content-box') {
      height = height - paddingSize;
    }

    hiddenTextarea.value = '';
    const singleRowHeight = hiddenTextarea.scrollHeight - paddingSize;

    if (typeof minRows === 'number') {
      let minHeight = singleRowHeight * minRows;
      if (boxSizing === 'border-box') {
        minHeight = minHeight + paddingSize + borderSize;
      }
      height = Math.max(minHeight, height);
      result.minHeight = `${minHeight}px`;
    }
    if (typeof maxRows === 'number') {
      let maxHeight = singleRowHeight * maxRows;
      if (boxSizing === 'border-box') {
        maxHeight = maxHeight + paddingSize + borderSize;
      }
      height = Math.min(maxHeight, height);
    }
    result.height = `${height}px`;

    return result;
  } finally {
    hiddenTextarea.parentNode?.removeChild(hiddenTextarea);
  }
}
