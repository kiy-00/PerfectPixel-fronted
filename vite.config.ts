import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import UnoCSS from 'unocss/vite'
import { presetUno, presetAttributify, presetIcons } from 'unocss'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    UnoCSS({
      presets: [
        presetUno(),
        presetAttributify(),
        presetIcons({
          scale: 1.2,
          warn: true,
        }),
      ],
      rules: [['custom-rule', { color: 'red' }]],
      shortcuts: {
        btn: 'py-2 px-4 font-semibold rounded-lg shadow-md',
        'btn-primary': 'btn text-white bg-blue-500 hover:bg-blue-700',
      },
      theme: {
        colors: {
          // 主要颜色
          primary: '#2E8B57', // 海洋绿，可作为主色调
          secondary: '#98FB98', // 淡绿色，适合次要元素

          // 扩展绿色系列
          'green-dark': '#006400', // 暗绿色，用于强调和重点内容
          'green-light': '#CCFFCC', // 浅绿色，用于背景和卡片
          'green-accent': '#00C957', // 亮绿色，用于按钮和高亮元素

          // 配套颜色
          neutral: '#F5F5F5', // 浅灰色，用于背景
          'neutral-dark': '#333333', // 深灰色，用于文本
          success: '#4CAF50', // 成功状态绿色
          warning: '#FFC107', // 警告状态黄色
          error: '#F44336', // 错误状态红色
          info: '#03A9F4', // 信息状态蓝色
        },
      },
    }),
  ],
})
