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
        additionalData: `@import "${resolve(__dirname, 'src/styles/variables.module.less').replace(/\\/g, '/')}";`,
      },
    },
  },
  // dev 模式使用 play 目录作为根目录
  root: command === 'serve' ? resolve(__dirname, 'play') : undefined,
  build: {
    lib: {
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
        'virtual-list': resolve(__dirname, 'src/components/virtual-list/index.ts'),
      },
      name: 'MeUI',
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
        globals: {
          vue: 'Vue',
          '@element-plus/icons-vue': 'ElementPlusIconsVue',
        },
        exports: 'named',
        entryFileNames: '[name].js',
        assetFileNames: '[name].[ext]',
      },
    },
    cssCodeSplit: true,
  },
}));
