/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue';
  const component: DefineComponent<Record<string, unknown>, Record<string, unknown>, unknown>;
  export default component;
}

declare module '*.module.less' {
  const classes: Record<string, string>;
  export default classes;
}

declare module '@me-ui/styles/variables.module.less' {
  export const namespace: string;
  export const cssVarColorPrimary: string;
  export const cssVarColorSuccess: string;
  export const cssVarColorWarning: string;
  export const cssVarColorDanger: string;
  export const cssVarColorInfo: string;
  export const cssVarTextColorPrimary: string;
  export const cssVarTextColorRegular: string;
  export const cssVarTextColorSecondary: string;
  export const cssVarTextColorPlaceholder: string;
  export const cssVarTextColorDisabled: string;
  export const cssVarBorderColor: string;
  export const cssVarBorderColorLight: string;
  export const cssVarBorderColorLighter: string;
  export const cssVarBorderColorExtraLight: string;
  export const cssVarBorderColorDark: string;
  export const cssVarBorderRadiusBase: string;
  export const cssVarBorderRadiusSmall: string;
  export const cssVarBorderRadiusRound: string;
  export const cssVarBorderRadiusCircle: string;
  export const cssVarFontSizeExtraLarge: string;
  export const cssVarFontSizeLarge: string;
  export const cssVarFontSizeMedium: string;
  export const cssVarFontSizeBase: string;
  export const cssVarFontSizeSmall: string;
  export const cssVarFontSizeExtraSmall: string;
  export const cssVarComponentSizeLarge: string;
  export const cssVarComponentSizeDefault: string;
  export const cssVarComponentSizeSmall: string;
  export const suffixLight3: string;
  export const suffixLight5: string;
  export const suffixLight7: string;
  export const suffixLight8: string;
  export const suffixLight9: string;
  export const suffixDark2: string;
  export const defaultColorPrimary: string;
  export const defaultColorSuccess: string;
  export const defaultColorWarning: string;
  export const defaultColorDanger: string;
  export const defaultColorInfo: string;
  export const defaultTextColorPrimary: string;
  export const defaultTextColorRegular: string;
  export const defaultTextColorSecondary: string;
  export const defaultTextColorPlaceholder: string;
  export const defaultTextColorDisabled: string;
  export const defaultBorderColor: string;
  export const defaultBorderColorLight: string;
  export const defaultBorderColorLighter: string;
  export const defaultBorderColorExtraLight: string;
  export const defaultBorderColorDark: string;
  export const defaultBorderRadiusBase: string;
  export const defaultBorderRadiusSmall: string;
  export const defaultBorderRadiusRound: string;
  export const defaultBorderRadiusCircle: string;
  export const defaultFontSizeExtraLarge: string;
  export const defaultFontSizeLarge: string;
  export const defaultFontSizeMedium: string;
  export const defaultFontSizeBase: string;
  export const defaultFontSizeSmall: string;
  export const defaultFontSizeExtraSmall: string;
  export const defaultComponentSizeLarge: string;
  export const defaultComponentSizeDefault: string;
  export const defaultComponentSizeSmall: string;
}
