import {
  cssVarColorWarning,
  cssVarColorDanger,
  suffixLight3,
  suffixLight5,
  suffixLight7,
  suffixLight8,
  suffixLight9,
  suffixDark2,
} from '@me-ui/styles/variables.module.less';

/** 派生色规则 */
interface DerivedRule {
  /** 派生色后缀 */
  suffix: string;
  /** 混合比例 */
  percent: number;
  /** 混合基底色 */
  base: 'white' | 'black';
}

/**
 * 默认派生色规则
 * 后缀从 variables.module.less 导入（单一数据源），percent 和 base 仅 TS 使用
 */
const DEFAULT_RULES: DerivedRule[] = [
  { suffix: suffixLight3, percent: 70, base: 'white' },
  { suffix: suffixLight5, percent: 50, base: 'white' },
  { suffix: suffixLight7, percent: 30, base: 'white' },
  { suffix: suffixLight8, percent: 20, base: 'white' },
  { suffix: suffixLight9, percent: 10, base: 'white' },
  { suffix: suffixDark2, percent: 80, base: 'black' },
];

/**
 * 按基础色 CSS 变量名索引的百分比覆盖表
 * 部分颜色（如 warning、danger）的原始设计稿派生色不完全遵循默认混合比例，需单独覆盖
 */
const COLOR_PERCENT_OVERRIDES: Record<string, Partial<Record<string, number>>> = {
  [cssVarColorWarning]: { [suffixLight3]: 80, [suffixLight7]: 40 },
  [cssVarColorDanger]: { [suffixLight7]: 40 },
};

/**
 * 为基础色生成派生色 CSS 变量键值对
 * 内部自动查找该颜色的百分比覆盖，未覆盖则使用默认值
 * @param baseVar 基础色 CSS 变量名，如 --me-color-primary
 * @returns 派生色 CSS 变量键值对
 */
export function generateDerivedColors(baseVar: string): Record<string, string> {
  const overrides = COLOR_PERCENT_OVERRIDES[baseVar];
  const result: Record<string, string> = {};
  for (const rule of DEFAULT_RULES) {
    const percent = overrides?.[rule.suffix] ?? rule.percent;
    result[`${baseVar}${rule.suffix}`] = `color-mix(in srgb, var(${baseVar}) ${percent}%, ${rule.base})`;
  }
  return result;
}

/** Token 配置项类型 */
interface TokenConfigItem {
  cssVar: string;
  default: string;
}

let injected = false;

/**
 * 重置注入状态（仅供单元测试使用）
 */
export function resetInjection(): void {
  injected = false;
}

/**
 * 生成 :root CSS 变量声明文本（基础变量 + 派生色）
 * SSR 环境下可调用此函数获取 CSS 文本，注入到 HTML 模板中避免 FOUC
 * @param config token 配置表，key 以 color 开头的基础色会自动生成派生色
 * @returns `:root { ... }` CSS 文本
 */
export function getRootCssVarsText(config: Record<string, TokenConfigItem>): string {
  const declarations: string[] = [];
  for (const [key, { cssVar, default: defaultValue }] of Object.entries(config)) {
    declarations.push(`  ${cssVar}: ${defaultValue};`);

    // 基础色：自动生成派生色
    if (key.startsWith('color')) {
      const derived = generateDerivedColors(cssVar);
      for (const [name, value] of Object.entries(derived)) {
        declarations.push(`  ${name}: ${value};`);
      }
    }
  }
  return `:root {\n${declarations.join('\n')}\n}`;
}

/**
 * 将所有 CSS 变量注入 :root（基础变量 + 派生色）
 * 在库初始化时自动调用，确保只注入一次
 * @param config token 配置表，key 以 color 开头的基础色会自动生成派生色
 */
export function injectRootCssVars(config: Record<string, TokenConfigItem>): void {
  if (injected) return;
  if (typeof document === 'undefined') return;
  if (!document.head) return;

  const style = document.createElement('style');
  style.setAttribute('data-me-ui', 'root-vars');
  style.textContent = getRootCssVarsText(config);
  document.head.appendChild(style);
  injected = true;
}
