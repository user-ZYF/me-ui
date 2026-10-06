import { resolve } from 'node:path';
import { defineConfig, type UserConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import dts from 'vite-plugin-dts';
import { libInjectCss } from 'vite-plugin-lib-inject-css';

export default defineConfig(({ command }): UserConfig => ({
  plugins: [
    vue(),
    ...(command === 'build'
      ? [
          libInjectCss(),
          dts({
            entryRoot: 'src',
            include: ['src/**/*.ts', 'src/**/*.vue'],
            exclude: ['src/**/*.test.ts', 'src/**/*.spec.ts'],
          }),
        ]
      : []),
  ],
  resolve: {
    alias: {
      '@me-ui': resolve(__dirname, 'src'),
    },
  },
  css: {
    preprocessorOptions: {
      less: {
        // 在每个 .less 文件（含 .vue 中的 <style lang="less">）编译前自动注入全局变量文件，使所有组件无需手动 @import 即可直接使用其中的变量/mixin
        // 注意：该文件应只包含变量和 mixin，若含实际 CSS 规则会被每个文件重复打包
        additionalData: `@import "${
          resolve(__dirname, 'src/styles/variables.module.less').replace(/\\/g, '/')
        }";`,
      },
    },
  },
  // dev 模式使用 play 目录作为根目录
  root: command === 'serve' ? resolve(__dirname, 'play') : undefined,
  build: {
    lib: {
      // 新增组件时需同步修改四处：
      // 1. 此处 entry 添加组件入口
      // 2. package.json 的 exports 添加对应子路径导出
      // 3. src/index.ts 导出该组件
      // 4. src/components.d.ts 添加全局组件类型声明（GlobalComponents 接口）
      entry: {
        'index': resolve(__dirname, 'src/index.ts'),
        'button': resolve(__dirname, 'src/components/button/index.ts'),
        'checkbox': resolve(__dirname, 'src/components/checkbox/index.ts'),
        'config-provider': resolve(__dirname, 'src/components/config-provider/index.ts'),
        'form': resolve(__dirname, 'src/components/form/index.ts'),
        'icon': resolve(__dirname, 'src/components/icon/index.ts'),
        'input': resolve(__dirname, 'src/components/input/index.ts'),
        'modal': resolve(__dirname, 'src/components/modal/index.ts'),
        'pagination': resolve(__dirname, 'src/components/pagination/index.ts'),
        'radio': resolve(__dirname, 'src/components/radio/index.ts'),
        'select': resolve(__dirname, 'src/components/select/index.ts'),
        'table': resolve(__dirname, 'src/components/table/index.ts'),
        'tag': resolve(__dirname, 'src/components/tag/index.ts'),
        'scrollbar': resolve(__dirname, 'src/components/scrollbar/index.ts'),
        'tooltip': resolve(__dirname, 'src/components/tooltip/index.ts'),
        'tree': resolve(__dirname, 'src/components/tree/index.ts'),
        'typewriter': resolve(__dirname, 'src/components/typewriter/index.ts'),
        'virtual-list': resolve(__dirname, 'src/components/virtual-list/index.ts'),
        'setup': resolve(__dirname, 'src/setup.ts'),
      },
      formats: ['es'],
    },
    rollupOptions: {
      external: [
        'vue',
        /^vue\//,
        /^@element-plus\/icons-vue/,
        /^@vueuse\//,
        /^lodash/,
        /^async-validator/,
        /^uuid/,
        /^js-easing-functions/,
      ],
      output: {
        exports: 'named',
        entryFileNames: '[name].js',
        assetFileNames: '[name].[ext]',
      },
    },
    cssCodeSplit: true,
  },
}));
