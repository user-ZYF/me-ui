import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig(({ command }) => ({
  plugins: [vue()],
  resolve: {
    alias: {
      '@me-ui': resolve(__dirname, 'src'),
    },
  },
  css: {
    preprocessorOptions: {
      less: {
        additionalData: `@import "${resolve(__dirname, 'src/styles/variables.less').replace(/\\/g, '/')}";`,
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
        'config-provider': resolve(__dirname, 'src/components/config-provider/index.ts'),
      },
      name: 'MeUI',
    },
    rollupOptions: {
      external: ['vue', '@element-plus/icons-vue'],
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
