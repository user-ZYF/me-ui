import type { FormItemContext } from './types';
import type { FormItemPropPath } from './form-item.ts';

import { isArray } from '@me-ui/utils/types';

export { isArray };

/** 可被数组或单值包装的类型 */
export type Arrayable<T> = T | T[];

/** 将值转换为数组 */
export function ensureArray<T>(value: Arrayable<T> | undefined): T[] {
  if (value === undefined || value === null) return [];
  return Array.isArray(value) ? value : [value];
}

/** 深拷贝 */
export function cloneDeep<T>(value: T): T {
  if (value === null || value === undefined) return value;
  return JSON.parse(JSON.stringify(value));
}

/**
 * 按路径获取对象嵌套属性的可写引用
 * 支持点分路径（如 'a.b.c'）和数组路径（如 ['a', 'b', 'c']）
 */
export function getProp(obj: Record<string, any>, path: FormItemPropPath): { value: any; key: string } {
  let tempObj = obj;
  let finalKey = '';

  const pathArr = isArray(path) ? path : path.split('.');

  for (let i = 0; i < pathArr.length; i++) {
    const key = pathArr[i];
    if (!tempObj) break;
    if (i === pathArr.length - 1) {
      finalKey = key;
    } else {
      tempObj = tempObj[key];
    }
  }

  return {
    get value() {
      return tempObj?.[finalKey];
    },
    set value(val: any) {
      if (tempObj) {
        tempObj[finalKey] = val;
      }
    },
    key: finalKey,
  };
}

/** 按字段路径过滤 FormItem */
export function filterFormItemContexts(
  contexts: FormItemContext[],
  propPaths: Arrayable<FormItemPropPath>,
): FormItemContext[] {
  const normalized = ensureArray(propPaths).map((propPath) =>
    isArray(propPath) ? propPath.join('.') : propPath,
  );
  return normalized.length > 0
    ? contexts.filter((context) => normalized.includes(context.propString))
    : contexts;
}
