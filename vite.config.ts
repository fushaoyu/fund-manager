import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';

export default defineConfig({
  // 跨域代理（关键：解决基金API跨域）
  server: {
    port: 8080, // 自定义端口号
    open: true, // 自动打开浏览器
    proxy: {
      '/api': {
        target: 'http://fundgz.1234567.com.cn', // 新浪财经API域名
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
        configure: (proxy) => {
          proxy.on('proxyRes', (res) => {
            res.headers['Access-Control-Allow-Origin'] = '*';
            // 禁用缓存
            res.headers['Cache-Control'] =
              'no-cache, no-store, must-revalidate';
            res.headers['Pragma'] = 'no-cache';
            res.headers['Expires'] = '0';
          });
        },
      },
    },
  },
  plugins: [
    vue(),
    AutoImport({
      imports: ['vue', 'vue-router', 'pinia'],
      resolvers: [ElementPlusResolver()],
      dts: 'src/types/auto-imports.d.ts',
    }),
    Components({
      resolvers: [ElementPlusResolver()],
      dts: 'src/types/components.d.ts',
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'), // 配置@别名
    },
  },
});
