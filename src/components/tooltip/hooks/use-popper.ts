import { ref, type Ref } from 'vue';

import type { TooltipPlacement } from '../tooltip';

/** 箭头尺寸（px） */
export const ARROW_SIZE = 10;

/** 弹出层位置计算结果 */
export interface PopperPosition {
  /** left 坐标 */
  left: number;
  /** top 坐标 */
  top: number;
  /** 箭头水平位置（仅 top/bottom 方向使用） */
  arrowLeft: number;
  /** 箭头垂直位置（仅 left/right 方向使用） */
  arrowTop: number;
  /** 实际使用的 placement（可能因边界翻转） */
  placement: TooltipPlacement;
}

/** placement 解析结果 */
export interface ParsedPlacement {
  /** 方向 */
  side: string;
  /** 对齐方式 */
  align: string;
}

/** 获取 placement 的主方向和对齐方式 */
function parsePlacement(placement: TooltipPlacement): ParsedPlacement {
  const [side, align] = placement.split('-');
  return { side, align: align ?? 'center' };
}

/** 计算弹出层位置 */
export function computePosition(
  triggerRect: DOMRect,
  popperSize: { width: number; height: number },
  placement: TooltipPlacement,
  arrowSize: number,
): PopperPosition {
  const { side, align } = parsePlacement(placement);
  const { width: triggerWidth, height: triggerHeight } = triggerRect;
  const { width: popperWidth, height: popperHeight } = popperSize;
  const offset = 8;

  let left = 0;
  let top = 0;
  let arrowLeft = 0;
  let arrowTop = 0;

  // 弹出层的实际位置
  let actualPlacement = placement;

  // 计算基础位置
  switch (side) {
    case 'top':
      top = triggerRect.top - popperHeight - offset;
      left = triggerRect.left;
      break;
    case 'bottom':
      top = triggerRect.bottom + offset;
      left = triggerRect.left;
      break;
    case 'left':
      left = triggerRect.left - popperWidth - offset;
      top = triggerRect.top;
      break;
    case 'right':
      left = triggerRect.right + offset;
      top = triggerRect.top;
      break;
  }

  // 计算对齐
  switch (align) {
    case 'start':
      // left/top 已为基础值，无需调整
      break;
    case 'end':
      if (side === 'top' || side === 'bottom') {
        left = triggerRect.left + triggerWidth - popperWidth;
      } else {
        top = triggerRect.top + triggerHeight - popperHeight;
      }
      break;
    case 'center':
      if (side === 'top' || side === 'bottom') {
        left = triggerRect.left + triggerWidth / 2 - popperWidth / 2;
      } else {
        top = triggerRect.top + triggerHeight / 2 - popperHeight / 2;
      }
      break;
  }

  // 边界检测与翻转
  const margin = 8;
  if (side === 'top' && top < margin) {
    // 翻转到 bottom
    top = triggerRect.bottom + offset;
    actualPlacement = (`bottom${align !== 'center' ? `-${align}` : ''}` as TooltipPlacement);
  } else if (side === 'bottom' && top + popperHeight > window.innerHeight - margin) {
    // 翻转到 top
    top = triggerRect.top - popperHeight - offset;
    actualPlacement = (`top${align !== 'center' ? `-${align}` : ''}` as TooltipPlacement);
  } else if (side === 'left' && left < margin) {
    // 翻转到 right
    left = triggerRect.right + offset;
    actualPlacement = (`right${align !== 'center' ? `-${align}` : ''}` as TooltipPlacement);
  } else if (side === 'right' && left + popperWidth > window.innerWidth - margin) {
    // 翻转到 left
    left = triggerRect.left - popperWidth - offset;
    actualPlacement = (`left${align !== 'center' ? `-${align}` : ''}` as TooltipPlacement);
  }

  const actualSide = parsePlacement(actualPlacement).side;
  
  // 计算箭头副轴位置（居中于 trigger，主轴由 CSS bottom/top/left/right 控制）
  if (actualSide === 'top' || actualSide === 'bottom') {
    arrowLeft = triggerRect.left + triggerWidth / 2 - left - arrowSize / 2;
    // clamp 箭头不超出 tooltip 水平边界（距离边界保持半个箭头的距离）
    arrowLeft = Math.max(arrowSize / 2, Math.min(arrowLeft, popperWidth - arrowSize - arrowSize / 2));
  } else {
    arrowTop = triggerRect.top + triggerHeight / 2 - top - arrowSize / 2;
    // clamp 箭头不超出 tooltip 垂直边界（距离边界保持半个箭头的距离）
    arrowTop = Math.max(arrowSize / 2, Math.min(arrowTop, popperHeight - arrowSize - arrowSize / 2));
  }

  return { left, top, arrowLeft, arrowTop, placement: actualPlacement };
}

/** usePopper composable：管理弹出层定位 */
export function usePopper(
  triggerRef: Ref<HTMLElement | undefined>,
  popperRef: Ref<HTMLElement | undefined>,
  placement: Ref<TooltipPlacement>,
) {
  /** 当前位置（这里为临时值） */
  const position = ref<PopperPosition>({
    left: 0,
    top: 0,
    arrowLeft: 0,
    arrowTop: 0,
    placement: placement.value,
  });

  /** 更新弹出层位置 */
  function updatePopper() {
    const triggerEl = triggerRef.value;
    const popperEl = popperRef.value;
    if (!triggerEl || !popperEl) return;

    const triggerRect = triggerEl.getBoundingClientRect();
    // popper 的尺寸不能用 getBoundingClientRect 获取，因为 rect 会受到 scale 变换的影响，而offset不会
    const popperSize = {
      width: popperEl.offsetWidth,
      height: popperEl.offsetHeight,
    };

    position.value = computePosition(
      triggerRect,
      popperSize,
      placement.value,
      ARROW_SIZE,
    );
  }

  return {
    position,
    updatePopper,
  };
}
