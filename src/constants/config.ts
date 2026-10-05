import {
  namespace,
  cssVarColorPrimary,
  cssVarColorSuccess,
  cssVarColorWarning,
  cssVarColorDanger,
  cssVarColorInfo,
  cssVarTextColorPrimary,
  cssVarTextColorRegular,
  cssVarTextColorSecondary,
  cssVarTextColorPlaceholder,
  cssVarTextColorDisabled,
  cssVarBorderColor,
  cssVarBorderColorLight,
  cssVarBorderColorLighter,
  cssVarBorderColorExtraLight,
  cssVarBorderColorDark,
  cssVarBorderRadiusBase,
  cssVarBorderRadiusSmall,
  cssVarBorderRadiusRound,
  cssVarBorderRadiusCircle,
  cssVarFontSizeExtraLarge,
  cssVarFontSizeLarge,
  cssVarFontSizeMedium,
  cssVarFontSizeBase,
  cssVarFontSizeSmall,
  cssVarFontSizeExtraSmall,
  cssVarComponentSizeLarge,
  cssVarComponentSizeDefault,
  cssVarComponentSizeSmall,
  defaultColorPrimary,
  defaultColorSuccess,
  defaultColorWarning,
  defaultColorDanger,
  defaultColorInfo,
  defaultTextColorPrimary,
  defaultTextColorRegular,
  defaultTextColorSecondary,
  defaultTextColorPlaceholder,
  defaultTextColorDisabled,
  defaultBorderColor,
  defaultBorderColorLight,
  defaultBorderColorLighter,
  defaultBorderColorExtraLight,
  defaultBorderColorDark,
  defaultBorderRadiusBase,
  defaultBorderRadiusSmall,
  defaultBorderRadiusRound,
  defaultBorderRadiusCircle,
  defaultFontSizeExtraLarge,
  defaultFontSizeLarge,
  defaultFontSizeMedium,
  defaultFontSizeBase,
  defaultFontSizeSmall,
  defaultFontSizeExtraSmall,
  defaultComponentSizeLarge,
  defaultComponentSizeDefault,
  defaultComponentSizeSmall,
} from '@me-ui/styles/variables.module.less';

import type {
  ComponentSize,
  ComponentType,
  TokenConfigItem,
} from '@me-ui/types/config';
import type { ThemeTokens } from '../components/config-provider/types';

/** 默认命名空间前缀（从 variables.module.less 导入，单一数据源） */
export const defaultNamespace = namespace;

/** 组件尺寸可选值 */
export const componentSizes: readonly ComponentSize[] = [
  'large',
  'default',
  'small',
];

/** 默认组件尺寸 */
export const defaultComponentSize = 'default';

/** 组件类型可选值 */
export const componentTypes: readonly ComponentType[] = [
  'default',
  'primary',
  'success',
  'warning',
  'danger',
  'info',
];

/**
 * Token 配置：ThemeTokens key → CSS 变量名 + 默认值（单一数据源）
 * CSS 变量名和默认值均从 variables.module.less 导入
 * hasDerivedColors 为 true 的基础色会自动生成 light/dark 派生色
 */
export const tokenConfig: Record<keyof ThemeTokens, TokenConfigItem> = {
  colorPrimary: {
    cssVarName: cssVarColorPrimary,
    defaultColor: defaultColorPrimary,
    hasDerivedColors: true,
  },
  colorSuccess: {
    cssVarName: cssVarColorSuccess,
    defaultColor: defaultColorSuccess,
    hasDerivedColors: true,
  },
  colorWarning: {
    cssVarName: cssVarColorWarning,
    defaultColor: defaultColorWarning,
    hasDerivedColors: true,
  },
  colorDanger: {
    cssVarName: cssVarColorDanger,
    defaultColor: defaultColorDanger,
    hasDerivedColors: true,
  },
  colorInfo: {
    cssVarName: cssVarColorInfo,
    defaultColor: defaultColorInfo,
    hasDerivedColors: true,
  },
  textColorPrimary: {
    cssVarName: cssVarTextColorPrimary,
    defaultColor: defaultTextColorPrimary,
  },
  textColorRegular: {
    cssVarName: cssVarTextColorRegular,
    defaultColor: defaultTextColorRegular,
  },
  textColorSecondary: {
    cssVarName: cssVarTextColorSecondary,
    defaultColor: defaultTextColorSecondary,
  },
  textColorPlaceholder: {
    cssVarName: cssVarTextColorPlaceholder,
    defaultColor: defaultTextColorPlaceholder,
  },
  textColorDisabled: {
    cssVarName: cssVarTextColorDisabled,
    defaultColor: defaultTextColorDisabled,
  },
  borderColor: {
    cssVarName: cssVarBorderColor,
    defaultColor: defaultBorderColor,
  },
  borderColorLight: {
    cssVarName: cssVarBorderColorLight,
    defaultColor: defaultBorderColorLight,
  },
  borderColorLighter: {
    cssVarName: cssVarBorderColorLighter,
    defaultColor: defaultBorderColorLighter,
  },
  borderColorExtraLight: {
    cssVarName: cssVarBorderColorExtraLight,
    defaultColor: defaultBorderColorExtraLight,
  },
  borderColorDark: {
    cssVarName: cssVarBorderColorDark,
    defaultColor: defaultBorderColorDark,
  },
  borderRadiusBase: {
    cssVarName: cssVarBorderRadiusBase,
    defaultColor: defaultBorderRadiusBase,
  },
  borderRadiusSmall: {
    cssVarName: cssVarBorderRadiusSmall,
    defaultColor: defaultBorderRadiusSmall,
  },
  borderRadiusRound: {
    cssVarName: cssVarBorderRadiusRound,
    defaultColor: defaultBorderRadiusRound,
  },
  borderRadiusCircle: {
    cssVarName: cssVarBorderRadiusCircle,
    defaultColor: defaultBorderRadiusCircle,
  },
  fontSizeExtraLarge: {
    cssVarName: cssVarFontSizeExtraLarge,
    defaultColor: defaultFontSizeExtraLarge,
  },
  fontSizeLarge: {
    cssVarName: cssVarFontSizeLarge,
    defaultColor: defaultFontSizeLarge,
  },
  fontSizeMedium: {
    cssVarName: cssVarFontSizeMedium,
    defaultColor: defaultFontSizeMedium,
  },
  fontSizeBase: {
    cssVarName: cssVarFontSizeBase,
    defaultColor: defaultFontSizeBase,
  },
  fontSizeSmall: {
    cssVarName: cssVarFontSizeSmall,
    defaultColor: defaultFontSizeSmall,
  },
  fontSizeExtraSmall: {
    cssVarName: cssVarFontSizeExtraSmall,
    defaultColor: defaultFontSizeExtraSmall,
  },
  componentSizeLarge: {
    cssVarName: cssVarComponentSizeLarge,
    defaultColor: defaultComponentSizeLarge,
  },
  componentSizeDefault: {
    cssVarName: cssVarComponentSizeDefault,
    defaultColor: defaultComponentSizeDefault,
  },
  componentSizeSmall: {
    cssVarName: cssVarComponentSizeSmall,
    defaultColor: defaultComponentSizeSmall,
  },
};
