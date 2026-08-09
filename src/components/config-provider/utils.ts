import { tokenConfig } from '@me-ui/constants/config';
import { generateDerivedColors } from '@me-ui/utils/derived-colors';

import type { ThemeTokens } from './types';

/** ThemeTokens key → CSS 变量名映射（从 tokenConfig 派生） */
const tokenToCssVarMap = Object.fromEntries(
  Object.entries(tokenConfig).map(([key, { cssVar }]) => [key, cssVar]),
) as Record<keyof ThemeTokens, string>;

/** 基础色 CSS 变量名集合（key 以 color 开头即为基础色） */
const BASE_COLOR_VARS = new Set<string>(
  Object.entries(tokenConfig)
    .filter(([key]) => key.startsWith('color'))
    .map(([, { cssVar }]) => cssVar),
);

/**
 * 将 ThemeTokens 转换为 CSS 变量键值对
 * 当设置基础色时，自动在同一元素上生成派生色 CSS 变量，确保 color-mix() 中的 var() 引用在正确上下文中解析
 * @param tokens 主题 Token 配置
 * @returns CSS 变量键值对记录
 */
export function tokensToCssVars(tokens: ThemeTokens): Record<string, string> {
  const cssVars: Record<string, string> = {};

  (Object.keys(tokens) as (keyof ThemeTokens)[]).forEach((key) => {
    const value = tokens[key];
    if (value !== undefined && value !== null) {
      const cssVarName = tokenToCssVarMap[key];
      if (cssVarName) {
        cssVars[cssVarName] = value;

        // 基础色：自动生成派生色，确保在同一元素上覆盖时派生色同步更新
        if (BASE_COLOR_VARS.has(cssVarName)) {
          Object.assign(cssVars, generateDerivedColors(cssVarName));
        }
      }
    }
  });

  return cssVars;
}
