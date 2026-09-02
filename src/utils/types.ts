import type { Component, Plugin } from 'vue';

/** 可安装的组件类型 */
export type SFCWithInstall<T extends Component> = T & Plugin;

/** 判断值是否为函数 */
export function isFunction(value: unknown): value is Function {
  return typeof value === 'function';
}
