import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Pages from 'vite-plugin-pages'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '~/': '/src/',
    },
  },
  plugins: [
    vue(),
    Pages({
      nuxtStyle: true,
      extensions: ['vue'],
      exclude: ['**/data/*.vue'],
    }),
    AutoImport({
      imports: ['vue', 'vue-router', 'vuex'],
      dts: 'src/auto-imports.d.ts',
    }),
    Components({
      dts: 'src/auto-components.d.ts',
    }),
  ],
  server: {
    port: 2020,
  },
})
