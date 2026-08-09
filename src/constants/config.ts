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

import type { ThemeTokens } from '../components/config-provider/types';

/** 默认命名空间前缀（从 variables.module.less 导入，单一数据源） */
export const defaultNamespace = namespace;

/** 组件尺寸可选值 */
export const componentSizes = ['large', 'default', 'small'] as const;

/** 默认组件尺寸 */
export const defaultComponentSize = 'default';

/** 组件大小 */
export type ComponentSize = (typeof componentSizes)[number];

/** 组件类型可选值 */
export const componentTypes = ['default', 'primary', 'success', 'warning', 'danger', 'info'] as const;

/** 组件类型 */
export type ComponentType = (typeof componentTypes)[number];

/**
 * Token 配置：ThemeTokens key → CSS 变量名 + 默认值（单一数据源）
 * CSS 变量名和默认值均从 variables.module.less 导入
 * key 以 color 开头的基础色会自动生成派生色
 */
export const tokenConfig: Record<keyof ThemeTokens, { cssVar: string; default: string }> = {
  colorPrimary: { cssVar: cssVarColorPrimary, default: defaultColorPrimary },
  colorSuccess: { cssVar: cssVarColorSuccess, default: defaultColorSuccess },
  colorWarning: { cssVar: cssVarColorWarning, default: defaultColorWarning },
  colorDanger: { cssVar: cssVarColorDanger, default: defaultColorDanger },
  colorInfo: { cssVar: cssVarColorInfo, default: defaultColorInfo },
  textColorPrimary: { cssVar: cssVarTextColorPrimary, default: defaultTextColorPrimary },
  textColorRegular: { cssVar: cssVarTextColorRegular, default: defaultTextColorRegular },
  textColorSecondary: { cssVar: cssVarTextColorSecondary, default: defaultTextColorSecondary },
  textColorPlaceholder: { cssVar: cssVarTextColorPlaceholder, default: defaultTextColorPlaceholder },
  textColorDisabled: { cssVar: cssVarTextColorDisabled, default: defaultTextColorDisabled },
  borderColor: { cssVar: cssVarBorderColor, default: defaultBorderColor },
  borderColorLight: { cssVar: cssVarBorderColorLight, default: defaultBorderColorLight },
  borderColorLighter: { cssVar: cssVarBorderColorLighter, default: defaultBorderColorLighter },
  borderColorExtraLight: { cssVar: cssVarBorderColorExtraLight, default: defaultBorderColorExtraLight },
  borderColorDark: { cssVar: cssVarBorderColorDark, default: defaultBorderColorDark },
  borderRadiusBase: { cssVar: cssVarBorderRadiusBase, default: defaultBorderRadiusBase },
  borderRadiusSmall: { cssVar: cssVarBorderRadiusSmall, default: defaultBorderRadiusSmall },
  borderRadiusRound: { cssVar: cssVarBorderRadiusRound, default: defaultBorderRadiusRound },
  borderRadiusCircle: { cssVar: cssVarBorderRadiusCircle, default: defaultBorderRadiusCircle },
  fontSizeExtraLarge: { cssVar: cssVarFontSizeExtraLarge, default: defaultFontSizeExtraLarge },
  fontSizeLarge: { cssVar: cssVarFontSizeLarge, default: defaultFontSizeLarge },
  fontSizeMedium: { cssVar: cssVarFontSizeMedium, default: defaultFontSizeMedium },
  fontSizeBase: { cssVar: cssVarFontSizeBase, default: defaultFontSizeBase },
  fontSizeSmall: { cssVar: cssVarFontSizeSmall, default: defaultFontSizeSmall },
  fontSizeExtraSmall: { cssVar: cssVarFontSizeExtraSmall, default: defaultFontSizeExtraSmall },
  componentSizeLarge: { cssVar: cssVarComponentSizeLarge, default: defaultComponentSizeLarge },
  componentSizeDefault: { cssVar: cssVarComponentSizeDefault, default: defaultComponentSizeDefault },
  componentSizeSmall: { cssVar: cssVarComponentSizeSmall, default: defaultComponentSizeSmall },
};
