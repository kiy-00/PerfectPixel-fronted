import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { createPersistedState } from './stores/plugins/persistedState'

import './assets/main.css'
import 'uno.css' // 导入 UnoCSS 样式

const app = createApp(App)

// 创建Pinia实例并配置持久化插件
const pinia = createPinia()
pinia.use(
  createPersistedState({
    key: 'perfectpixel-state',
    paths: ['user.userInfo'], // 需要持久化的路径
  }),
)

app.use(pinia)
app.use(router)

app.mount('#app')
