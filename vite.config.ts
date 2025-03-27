import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';

export default defineConfig({
  plugins: [
    vue(),
    // 自动导入 Vue 和其他库的 API
    AutoImport({
      imports: ['vue', '@vueuse/core'],
      resolvers: [ElementPlusResolver()], // 解析 Element Plus 的 API
      dts: 'src/auto-imports.d.ts', // 生成类型声明文件
    }),
    // 自动导入组件
    Components({
      resolvers: [ElementPlusResolver()], // 解析 Element Plus 的组件
      dts: 'src/components.d.ts', // 生成组件声明文件
    }),
  ],
});