import { tokenConfig } from './constants/config';
import { injectRootCssVars } from './utils/derived-colors';

// 确保按需引入单个组件时，:root CSS 变量也被注入
// injected 标志保证只注入一次
injectRootCssVars(tokenConfig);
