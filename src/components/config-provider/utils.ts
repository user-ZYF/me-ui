import { tokenConfig } from '@me-ui/constants/config';
import { generateDerivedColors } from '@me-ui/utils/derived-colors';

import type { ThemeTokens } from './types';

/**
 * 将 ThemeTokens 转换为 CSS 变量键值对
 * 当设置 derived 标记的基础色时，自动在同一元素上生成派生色 CSS 变量，确保 color-mix() 中的 var() 引用在正确上下文中解析
 * @param tokens 主题 Token 配置
 * @returns CSS 变量键值对记录
 */
export function tokensToCssVars(tokens: ThemeTokens): Record<string, string> {
  const cssVars: Record<string, string> = {};

  (Object.keys(tokens) as (keyof ThemeTokens)[]).forEach((key) => {
    const value = tokens[key];
    if (value !== undefined && value !== null) {
      const item = tokenConfig[key];
      if (item) {
        cssVars[item.cssVar] = value;

        // 派生色：自动生成 light/dark 变体，确保在同一元素上覆盖时派生色同步更新
        if (item.derived) {
          Object.assign(cssVars, generateDerivedColors(item.cssVar));
        }
      }
    }
  });

  return cssVars;
}
