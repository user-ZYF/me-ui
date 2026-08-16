import type { Arrayable, TooltipTriggerType } from './tooltip';
import type { Ref } from 'vue';

/** 判断触发方式是否包含指定类型 */
export function isTriggerType(trigger: Arrayable<TooltipTriggerType>, type: TooltipTriggerType): boolean {
  if (Array.isArray(trigger)) {
    return trigger.includes(type);
  }
  return trigger === type;
}

/** 组合事件处理器：先执行 guard 判断，再判断触发方式是否匹配，匹配则执行 handler */
export function composeEventHandlers(
  guard: () => boolean | undefined | void,
  trigger: Ref<Arrayable<TooltipTriggerType>>,
  type: TooltipTriggerType,
  handler: (e: Event) => void,
): (e: Event) => void {
  return (e: Event) => {
    if (guard()) return;
    if (!isTriggerType(trigger.value, type)) return;
    handler(e);
  };
}
