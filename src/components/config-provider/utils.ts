import type { ThemeTokens } from './types';

/**
 * ThemeTokens 的 camelCase key 到 CSS 变量名的映射表
 * 例如: colorPrimary -> --me-color-primary
 */
const tokenToCssVarMap: Record<keyof ThemeTokens, string> = {
  colorPrimary: '--me-color-primary',
  colorPrimaryLight3: '--me-color-primary-light-3',
  colorPrimaryLight5: '--me-color-primary-light-5',
  colorPrimaryLight7: '--me-color-primary-light-7',
  colorPrimaryLight8: '--me-color-primary-light-8',
  colorPrimaryLight9: '--me-color-primary-light-9',
  colorPrimaryDark2: '--me-color-primary-dark-2',
  colorSuccess: '--me-color-success',
  colorSuccessLight3: '--me-color-success-light-3',
  colorSuccessLight5: '--me-color-success-light-5',
  colorSuccessLight7: '--me-color-success-light-7',
  colorSuccessLight8: '--me-color-success-light-8',
  colorSuccessLight9: '--me-color-success-light-9',
  colorWarning: '--me-color-warning',
  colorWarningLight3: '--me-color-warning-light-3',
  colorWarningLight5: '--me-color-warning-light-5',
  colorWarningLight7: '--me-color-warning-light-7',
  colorWarningLight8: '--me-color-warning-light-8',
  colorWarningLight9: '--me-color-warning-light-9',
  colorDanger: '--me-color-danger',
  colorDangerLight3: '--me-color-danger-light-3',
  colorDangerLight5: '--me-color-danger-light-5',
  colorDangerLight7: '--me-color-danger-light-7',
  colorDangerLight8: '--me-color-danger-light-8',
  colorDangerLight9: '--me-color-danger-light-9',
  colorInfo: '--me-color-info',
  colorInfoLight3: '--me-color-info-light-3',
  colorInfoLight5: '--me-color-info-light-5',
  colorInfoLight7: '--me-color-info-light-7',
  colorInfoLight8: '--me-color-info-light-8',
  colorInfoLight9: '--me-color-info-light-9',
  textColorPrimary: '--me-text-color-primary',
  textColorRegular: '--me-text-color-regular',
  textColorSecondary: '--me-text-color-secondary',
  textColorPlaceholder: '--me-text-color-placeholder',
  textColorDisabled: '--me-text-color-disabled',
  borderColor: '--me-border-color',
  borderColorLight: '--me-border-color-light',
  borderColorLighter: '--me-border-color-lighter',
  borderColorExtraLight: '--me-border-color-extra-light',
  borderColorDark: '--me-border-color-dark',
  borderRadiusBase: '--me-border-radius-base',
  borderRadiusSmall: '--me-border-radius-small',
  borderRadiusRound: '--me-border-radius-round',
  borderRadiusCircle: '--me-border-radius-circle',
  fontSizeExtraLarge: '--me-font-size-extra-large',
  fontSizeLarge: '--me-font-size-large',
  fontSizeMedium: '--me-font-size-medium',
  fontSizeBase: '--me-font-size-base',
  fontSizeSmall: '--me-font-size-small',
  fontSizeExtraSmall: '--me-font-size-extra-small',
  componentSizeLarge: '--me-component-size-large',
  componentSizeDefault: '--me-component-size-default',
  componentSizeSmall: '--me-component-size-small',
};

/**
 * 将 ThemeTokens 转换为 CSS 变量键值对
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
      }
    }
  });

  return cssVars;
}
