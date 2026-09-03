/**
 * 判断数值是否为奇数
 * @param value 数值
 * @returns 是否为奇数
 */
export function isOdd(value: number): boolean {
  return Math.abs(value) % 2 === 1;
}

/**
 * 判断数值是否为偶数
 * @param value 数值
 * @returns 是否为偶数
 */
export function isEven(value: number): boolean {
  return Math.abs(value) % 2 === 0;
}
