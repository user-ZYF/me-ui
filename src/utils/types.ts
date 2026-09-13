import type { Component, Plugin } from 'vue';

/** 可安装的组件类型 */
export type SFCWithInstall<T extends Component> = T & Plugin;

/** 判断值是否为 undefined */
export function isUndefined(value: unknown): value is undefined {
  return value === undefined;
}

/** 判断值是否为 null */
export function isNull(value: unknown): value is null {
  return value === null;
}

/** 判断值是否为 null 或 undefined */
export function isNil(value: unknown): value is null | undefined {
  return value === null || value === undefined;
}

/** 判断值是否为字符串 */
export function isString(value: unknown): value is string {
  return typeof value === 'string';
}

/** 判断值是否为数字（排除 NaN） */
export function isNumber(value: unknown): value is number {
  return typeof value === 'number' && !Number.isNaN(value);
}

/** 判断值是否为布尔值 */
export function isBoolean(value: unknown): value is boolean {
  return typeof value === 'boolean';
}

/** 判断值是否为函数 */
export function isFunction(value: unknown): value is Function {
  return typeof value === 'function';
}

/** 判断值是否为非 null 的对象（排除数组、函数等） */
export function isObject(value: unknown): value is Record<string, any> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/** 判断值是否为数组 */
export function isArray(value: unknown): value is any[] {
  return Array.isArray(value);
}

/** 判断值是否为 Promise */
export function isPromise<T = any>(value: unknown): value is Promise<T> {
  return (
    !!value &&
    typeof value === 'object' &&
    typeof (value as Promise<T>).then === 'function' &&
    typeof (value as Promise<T>).catch === 'function'
  );
}
