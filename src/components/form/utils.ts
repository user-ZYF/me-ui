import type { FormItemContext } from './types';
import type { FormItemName } from './form-item.ts';

/** 可被数组或单值包装的类型 */
export type Arrayable<T> = T | T[];

/** 将值转换为数组 */
export function ensureArray<T>(value: Arrayable<T> | undefined): T[] {
  if (value === undefined || value === null) return [];
  return Array.isArray(value) ? value : [value];
}

/** 判断是否为数组 */
export function isArray(value: unknown): value is any[] {
  return Array.isArray(value);
}

/** 判断是否为函数 */
export function isFunction(value: unknown): value is Function {
  return typeof value === 'function';
}

/** 深拷贝 */
export function cloneDeep<T>(value: T): T {
  if (value === null || value === undefined) return value;
  return JSON.parse(JSON.stringify(value));
}

/**
 * 按路径获取对象嵌套属性值
 * 支持点分路径（如 'a.b.c'）和数组路径（如 ['a', 'b', 'c']）
 */
export function getPropByPath(obj: Record<string, any>, path: string | string[]): { value: any; key: string } {
  let tempObj = obj;
  let key = '';

  const pathArr = isArray(path) ? path : path.split('.');

  for (let i = 0; i < pathArr.length; i++) {
    const segment = pathArr[i];
    if (!tempObj) break;
    if (i === pathArr.length - 1) {
      key = segment;
    } else {
      tempObj = tempObj[segment];
    }
  }

  return {
    get value() {
      return tempObj?.[key];
    },
    set value(val: any) {
      if (tempObj) {
        tempObj[key] = val;
      }
    },
    key,
  };
}

/**
 * 获取对象嵌套属性的可写引用
 */
export function getProp(obj: Record<string, any>, path: FormItemName) {
  const propPath = isArray(path) ? path : path.split('.');
  return getPropByPath(obj, propPath);
}

/** 按字段路径过滤 FormItem */
export function filterFields(
  fields: FormItemContext[],
  props: Arrayable<FormItemName>,
): FormItemContext[] {
  const normalized = ensureArray(props).map((prop) =>
    isArray(prop) ? prop.join('.') : prop,
  );
  return normalized.length > 0
    ? fields.filter((field) => field.nameString && normalized.includes(field.nameString))
    : fields;
}
