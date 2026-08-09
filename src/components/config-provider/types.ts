/**
 * 主题 Token 配置
 * 使用者可通过 ConfigProvider 的 theme prop 覆盖这些 CSS 变量
 * 颜色派生色（light/dark 变体）由 CSS color-mix() 自动计算，无需单独配置
 */
export interface ThemeTokens {
  /** 主色 */
  colorPrimary?: string;
  /** 成功色 */
  colorSuccess?: string;
  /** 警告色 */
  colorWarning?: string;
  /** 危险色 */
  colorDanger?: string;
  /** 信息色 */
  colorInfo?: string;
  /** 主要文字颜色 */
  textColorPrimary?: string;
  /** 常规文字颜色 */
  textColorRegular?: string;
  /** 次要文字颜色 */
  textColorSecondary?: string;
  /** 占位符文字颜色 */
  textColorPlaceholder?: string;
  /** 禁用文字颜色 */
  textColorDisabled?: string;
  /** 边框颜色 */
  borderColor?: string;
  /** 边框浅色 */
  borderColorLight?: string;
  /** 边框更浅色 */
  borderColorLighter?: string;
  /** 边框极浅色 */
  borderColorExtraLight?: string;
  /** 边框深色 */
  borderColorDark?: string;
  /** 基础圆角 */
  borderRadiusBase?: string;
  /** 小圆角 */
  borderRadiusSmall?: string;
  /** 圆角 */
  borderRadiusRound?: string;
  /** 圆形圆角 */
  borderRadiusCircle?: string;
  /** 大号字体 */
  fontSizeExtraLarge?: string;
  /** 较大字体 */
  fontSizeLarge?: string;
  /** 中号字体 */
  fontSizeMedium?: string;
  /** 基础字体 */
  fontSizeBase?: string;
  /** 小号字体 */
  fontSizeSmall?: string;
  /** 极小字体 */
  fontSizeExtraSmall?: string;
  /** 大号组件尺寸 */
  componentSizeLarge?: string;
  /** 默认组件尺寸 */
  componentSizeDefault?: string;
  /** 小号组件尺寸 */
  componentSizeSmall?: string;
}
