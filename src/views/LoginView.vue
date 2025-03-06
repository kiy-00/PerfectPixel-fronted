<template>
  <div
    class="flex flex-col items-center justify-center w-full h-full min-h-screen bg-neutral text-neutral-dark"
  >
    <div class="w-full max-w-md p-8 rounded-lg shadow-lg bg-white">
      <!-- 标题 -->
      <h1 class="text-3xl font-bold text-center mb-6 text-primary">欢迎登录</h1>

      <!-- 登录选项切换 - 改为tab栏样式 -->
      <div class="flex justify-center mb-6">
        <div class="w-full max-w-xs border border-green-light rounded-lg overflow-hidden">
          <div class="flex">
            <button
              @click="loginMethod = 'username'"
              :class="[
                'flex-1 py-3 px-4 text-center font-medium transition-colors duration-200',
                loginMethod === 'username'
                  ? 'bg-primary text-white'
                  : 'bg-white text-neutral-dark hover:bg-green-light hover:bg-opacity-20',
              ]"
            >
              用户名登录
            </button>
            <button
              @click="loginMethod = 'email'"
              :class="[
                'flex-1 py-3 px-4 text-center font-medium transition-colors duration-200',
                loginMethod === 'email'
                  ? 'bg-primary text-white'
                  : 'bg-white text-neutral-dark hover:bg-green-light hover:bg-opacity-20',
              ]"
            >
              邮箱登录
            </button>
          </div>
        </div>
      </div>

      <!-- 登录表单 -->
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <!-- 用户名/邮箱输入框 -->
        <div class="space-y-2">
          <label
            :for="loginMethod === 'username' ? 'username' : 'email'"
            class="block text-sm font-medium text-neutral-dark"
          >
            {{ loginMethod === 'username' ? '用户名' : '邮箱' }}
          </label>
          <div class="relative">
            <input
              :type="loginMethod === 'username' ? 'text' : 'email'"
              :id="loginMethod === 'username' ? 'username' : 'email'"
              :name="loginMethod === 'username' ? 'username' : 'email'"
              v-model="loginForm.identifier"
              class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-accent focus:border-green-accent bg-green-light bg-opacity-10"
              :placeholder="loginMethod === 'username' ? '请输入用户名' : '请输入邮箱'"
              required
            />
          </div>
        </div>

        <!-- 密码输入框 -->
        <div class="space-y-2">
          <div class="flex justify-between">
            <label for="password" class="block text-sm font-medium text-neutral-dark"> 密码 </label>
            <a href="#" class="text-sm text-primary hover:text-green-dark"> 忘记密码? </a>
          </div>
          <div class="relative">
            <input
              :type="showPassword ? 'text' : 'password'"
              id="password"
              name="password"
              v-model="loginForm.password"
              class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-accent focus:border-green-accent bg-green-light bg-opacity-10"
              placeholder="请输入密码"
              required
            />
            <button
              type="button"
              @click="showPassword = !showPassword"
              class="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-dark"
            >
              <!-- 这里可以添加眼睛图标，显示/隐藏密码 -->
              {{ showPassword ? '隐藏' : '显示' }}
            </button>
          </div>
        </div>

        <!-- 记住我选项 -->
        <div class="flex items-center">
          <input
            type="checkbox"
            id="remember"
            name="remember"
            v-model="loginForm.remember"
            class="h-4 w-4 text-primary focus:ring-green-accent border-gray-300 rounded"
          />
          <label for="remember" class="ml-2 block text-sm text-neutral-dark"> 记住我 </label>
        </div>

        <!-- 登录按钮 -->
        <button
          type="submit"
          class="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-primary hover:bg-green-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-accent transition duration-200"
        >
          登录
        </button>
      </form>

      <!-- 分隔线 -->
      <div class="relative my-6">
        <div class="absolute inset-0 flex items-center">
          <div class="w-full border-t border-green-light"></div>
        </div>
        <div class="relative flex justify-center text-sm">
          <span class="px-2 bg-white text-neutral-dark"> 或者使用 </span>
        </div>
      </div>

      <!-- 第三方登录选项 -->
      <div class="grid grid-cols-3 gap-3">
        <button
          type="button"
          class="py-2 px-4 border rounded-md shadow-sm bg-white hover:bg-green-light text-neutral-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-accent"
        >
          微信
        </button>
        <button
          type="button"
          class="py-2 px-4 border rounded-md shadow-sm bg-white hover:bg-green-light text-neutral-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-accent"
        >
          QQ
        </button>
        <button
          type="button"
          class="py-2 px-4 border rounded-md shadow-sm bg-white hover:bg-green-light text-neutral-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-accent"
        >
          微博
        </button>
      </div>

      <!-- 注册链接 -->
      <div class="text-center mt-6">
        <p class="text-sm text-neutral-dark">
          还没有账号?
          <a
            href="#"
            @click.prevent="goRegister"
            class="font-medium text-primary hover:text-green-dark"
          >
            立即注册
          </a>
        </p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive } from 'vue'
import { useRouter } from 'vue-router'

export default defineComponent({
  name: 'LoginView',
  setup() {
    const router = useRouter()
    // 登录方式（用户名/邮箱）
    const loginMethod = ref('username')

    // 密码显示控制
    const showPassword = ref(false)

    // 登录表单数据
    const loginForm = reactive({
      identifier: '', // 用户名或邮箱
      password: '',
      remember: false,
    })

    // 提交处理函数
    const handleSubmit = () => {
      console.log('登录信息:', {
        loginMethod: loginMethod.value,
        identifier: loginForm.identifier,
        password: loginForm.password,
        remember: loginForm.remember,
      })
      // 这里添加登录逻辑
    }

    const goRegister = () => {
      router.push('/register')
    }

    return {
      loginMethod,
      showPassword,
      loginForm,
      handleSubmit,
      goRegister,
    }
  },
})
</script>
