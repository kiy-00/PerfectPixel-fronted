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
          :disabled="isLoading"
        >
          <span v-if="isLoading"> 登录中... </span>
          <span v-else> 登录 </span>
        </button>

        <!-- 错误消息 -->
        <div v-if="errorMessage" class="mt-2 text-sm text-error text-center">
          {{ errorMessage }}
        </div>
      </form>

      <!-- 分隔线 -->
      <!-- <div class="relative my-6">
        <div class="absolute inset-0 flex items-center">
          <div class="w-full border-t border-green-light"></div>
        </div>
        <div class="relative flex justify-center text-sm">
          <span class="px-2 bg-white text-neutral-dark"> 或者使用 </span>
        </div>
      </div> -->

      <!-- 第三方登录选项 -->
      <!-- <div class="grid grid-cols-3 gap-3">
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
      </div> -->

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
import { userAPI } from '../services/apiService'

export default defineComponent({
  name: 'LoginView',
  setup() {
    const router = useRouter()
    // 登录方式（用户名/邮箱）
    const loginMethod = ref('username')

    // 密码显示控制
    const showPassword = ref(false)

    // 添加状态管理
    const isLoading = ref(false)
    const errorMessage = ref('')

    // 登录表单数据
    const loginForm = reactive({
      identifier: '', // 用户名或邮箱
      password: '',
      remember: false,
    })

    // 提交处理函数
    const handleSubmit = async () => {
      try {
        // 重置错误消息
        errorMessage.value = ''

        // 表单验证
        if (!loginForm.identifier) {
          errorMessage.value = '请输入' + (loginMethod.value === 'username' ? '用户名' : '邮箱')
          return
        }

        if (!loginForm.password) {
          errorMessage.value = '请输入密码'
          return
        }

        // 设置加载状态
        isLoading.value = true

        // 准备请求数据
        const loginData = {
          UsernameOrEmail: loginForm.identifier,
          Password: loginForm.password,
        }

        console.log('正在发送登录请求:', {
          url: import.meta.env.VITE_API_BASE_URL + '/User/login',
          data: { ...loginData, Password: '******' }, // 日志中隐藏密码
        })

        // 发送登录请求 - 使用API服务
        const response = await userAPI.login(loginForm.identifier, loginForm.password)

        console.log('登录成功:', response.data)

        // 存储用户信息和令牌 - 修正字段名的大小写匹配
        const userData = {
          userId: response.data.userId,
          username: response.data.username,
          email: response.data.email,
          userType: response.data.roles?.join(',') || 'Regular',
          roles: response.data.roles || ['Regular'],
          token: response.data.token,
        }

        // 打印确认从响应中提取的用户数据正确
        console.log('提取的用户数据:', userData)

        // 如果选择记住登录状态，则存储在 localStorage，否则存储在 sessionStorage
        const storage = loginForm.remember ? localStorage : sessionStorage

        // 先清除现有的数据，避免冲突
        localStorage.removeItem('user')
        localStorage.removeItem('token')
        sessionStorage.removeItem('user')
        sessionStorage.removeItem('token')

        // 存储新数据 - 修复：使用小写的 token 字段名
        storage.setItem('user', JSON.stringify(userData))
        storage.setItem('token', response.data.token) // 修改: 使用小写的 token

        // 添加验证部分
        const storedUser = JSON.parse(storage.getItem('user') || '{}')
        console.log(`已存储用户数据至${loginForm.remember ? 'localStorage' : 'sessionStorage'}:`, {
          username: storedUser.username,
          userId: storedUser.userId,
          roles: storedUser.roles,
        })

        // 额外验证存储是否成功
        console.log('验证存储的完整用户数据:', storedUser)
        console.log('验证存储的token:', storage.getItem('token'))

        // 触发自定义事件，通知其他组件用户已登录
        window.dispatchEvent(new CustomEvent('user-login', { detail: userData }))

        // 登录成功后跳转到首页
        router.push('/home')
      } catch (error: any) {
        console.error('登录失败:', error)

        // 处理不同类型的错误
        if (error.response) {
          // 服务器返回了错误状态码
          const { status, data } = error.response

          switch (status) {
            case 400:
              errorMessage.value = data.message || '请求参数错误'
              break
            case 401:
              errorMessage.value = '用户名/邮箱或密码不正确'
              break
            case 403:
              errorMessage.value = '账号未激活，请联系客服'
              break
            default:
              errorMessage.value = '登录失败，请稍后再试'
          }
        } else if (error.request) {
          // 请求发送了但没有收到响应
          errorMessage.value = '无法连接到服务器，请检查网络连接'
        } else {
          // 设置请求时发生了错误
          errorMessage.value = '登录过程中发生错误'
        }
      } finally {
        // 无论成功还是失败，都重置加载状态
        isLoading.value = false
      }
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
      isLoading,
      errorMessage,
    }
  },
})
</script>
