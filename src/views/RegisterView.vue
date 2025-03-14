<template>
  <div
    class="flex flex-col items-center justify-center w-full h-full min-h-screen bg-neutral text-neutral-dark"
  >
    <div class="w-full max-w-md p-8 rounded-lg shadow-lg bg-white">
      <!-- 标题 -->
      <h1 class="text-3xl font-bold text-center mb-6 text-primary">账号注册</h1>

      <!-- 注册表单 -->
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <!-- 用户名输入框 -->
        <div class="space-y-2">
          <label for="username" class="block text-sm font-medium text-neutral-dark">
            用户名 <span class="text-error">*</span>
          </label>
          <div class="relative">
            <input
              type="text"
              id="username"
              name="username"
              v-model="registerForm.username"
              class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-accent focus:border-green-accent bg-green-light bg-opacity-10"
              placeholder="请输入用户名"
              required
            />
          </div>
          <p class="text-xs text-neutral-dark mt-1">
            用户名长度为4-20个字符，支持字母、数字、下划线
          </p>
        </div>

        <!-- 邮箱输入框 -->
        <div class="space-y-2">
          <label for="email" class="block text-sm font-medium text-neutral-dark">
            邮箱 <span class="text-error">*</span>
          </label>
          <div class="relative">
            <input
              type="email"
              id="email"
              name="email"
              v-model="registerForm.email"
              class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-accent focus:border-green-accent bg-green-light bg-opacity-10"
              placeholder="请输入邮箱"
              required
            />
          </div>
        </div>

        <!-- 密码输入框 -->
        <div class="space-y-2">
          <label for="password" class="block text-sm font-medium text-neutral-dark">
            密码 <span class="text-error">*</span>
          </label>
          <div class="relative">
            <input
              :type="showPassword ? 'text' : 'password'"
              id="password"
              name="password"
              v-model="registerForm.password"
              class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-accent focus:border-green-accent bg-green-light bg-opacity-10"
              placeholder="请设置密码"
              required
            />
            <button
              type="button"
              @click="showPassword = !showPassword"
              class="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-dark"
            >
              {{ showPassword ? '隐藏' : '显示' }}
            </button>
          </div>
          <p class="text-xs text-neutral-dark mt-1">密码长度为8-20个字符，必须包含字母和数字</p>
        </div>

        <!-- 确认密码输入框 -->
        <div class="space-y-2">
          <label for="confirmPassword" class="block text-sm font-medium text-neutral-dark">
            确认密码 <span class="text-error">*</span>
          </label>
          <div class="relative">
            <input
              :type="showConfirmPassword ? 'text' : 'password'"
              id="confirmPassword"
              name="confirmPassword"
              v-model="registerForm.confirmPassword"
              class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-accent focus:border-green-accent bg-green-light bg-opacity-10"
              placeholder="请再次输入密码"
              required
            />
            <button
              type="button"
              @click="showConfirmPassword = !showConfirmPassword"
              class="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-dark"
            >
              {{ showConfirmPassword ? '隐藏' : '显示' }}
            </button>
          </div>
        </div>

        <!-- 名字输入框 -->
        <div class="space-y-2">
          <label for="firstName" class="block text-sm font-medium text-neutral-dark"> 名字 </label>
          <div class="relative">
            <input
              type="text"
              id="firstName"
              name="firstName"
              v-model="registerForm.firstName"
              class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-accent focus:border-green-accent bg-green-light bg-opacity-10"
              placeholder="请输入名字（可选）"
            />
          </div>
        </div>

        <!-- 姓氏输入框 -->
        <div class="space-y-2">
          <label for="lastName" class="block text-sm font-medium text-neutral-dark"> 姓氏 </label>
          <div class="relative">
            <input
              type="text"
              id="lastName"
              name="lastName"
              v-model="registerForm.lastName"
              class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-accent focus:border-green-accent bg-green-light bg-opacity-10"
              placeholder="请输入姓氏（可选）"
            />
          </div>
        </div>

        <!-- 手机号码输入框 -->
        <div class="space-y-2">
          <label for="phoneNumber" class="block text-sm font-medium text-neutral-dark">
            手机号码
          </label>
          <div class="relative">
            <input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              v-model="registerForm.phoneNumber"
              class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-accent focus:border-green-accent bg-green-light bg-opacity-10"
              placeholder="请输入手机号码（可选）"
            />
          </div>
        </div>

        <!-- 个人简介输入框 -->
        <div class="space-y-2">
          <label for="biography" class="block text-sm font-medium text-neutral-dark">
            个人简介
          </label>
          <div class="relative">
            <textarea
              id="biography"
              name="biography"
              v-model="registerForm.biography"
              rows="3"
              class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-accent focus:border-green-accent bg-green-light bg-opacity-10"
              placeholder="请输入个人简介（可选）"
            ></textarea>
          </div>
        </div>

        <!-- 用户协议 -->
        <div class="flex items-start">
          <input
            type="checkbox"
            id="agreement"
            name="agreement"
            v-model="registerForm.agreement"
            class="h-4 w-4 mt-1 text-primary focus:ring-green-accent border-gray-300 rounded"
            required
          />
          <label for="agreement" class="ml-2 block text-sm text-neutral-dark">
            我已阅读并同意
            <a href="#" class="text-primary hover:text-green-dark">《用户协议》</a>和
            <a href="#" class="text-primary hover:text-green-dark">《隐私政策》</a>
          </label>
        </div>

        <!-- 错误消息 -->
        <div v-if="errorMessage" class="mt-2 text-sm text-error text-center">
          {{ errorMessage }}
        </div>

        <!-- 注册按钮 -->
        <button
          type="submit"
          class="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-primary hover:bg-green-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-accent transition duration-200"
          :disabled="isLoading"
        >
          <span v-if="isLoading">注册中...</span>
          <span v-else>立即注册</span>
        </button>
      </form>

      <!-- 登录链接 -->
      <div class="text-center mt-6">
        <p class="text-sm text-neutral-dark">
          已有账号?
          <a
            href="#"
            @click.prevent="goLogin"
            class="font-medium text-primary hover:text-green-dark"
          >
            立即登录
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
import { useUserStore } from '../stores/userStore'

export default defineComponent({
  name: 'RegisterView',
  setup() {
    const router = useRouter()

    // 密码显示控制
    const showPassword = ref(false)
    const showConfirmPassword = ref(false)

    // 状态管理
    const isLoading = ref(false)
    const errorMessage = ref('')

    // 注册表单数据
    const registerForm = reactive({
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      firstName: '',
      lastName: '',
      phoneNumber: '',
      biography: '',
      agreement: false,
    })

    // 表单验证函数
    const validateForm = () => {
      // 重置错误消息
      errorMessage.value = ''

      // 用户名验证
      if (!registerForm.username) {
        errorMessage.value = '请输入用户名'
        return false
      }

      const usernameRegex = /^[a-zA-Z0-9_]{4,20}$/
      if (!usernameRegex.test(registerForm.username)) {
        errorMessage.value = '用户名格式不正确，长度为4-20个字符，支持字母、数字、下划线'
        return false
      }

      // 邮箱验证
      if (!registerForm.email) {
        errorMessage.value = '请输入邮箱'
        return false
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(registerForm.email)) {
        errorMessage.value = '邮箱格式不正确'
        return false
      }

      // 密码验证
      if (!registerForm.password) {
        errorMessage.value = '请输入密码'
        return false
      }

      const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,20}$/
      if (!passwordRegex.test(registerForm.password)) {
        errorMessage.value = '密码格式不正确，长度为8-20个字符，必须包含字母和数字'
        return false
      }

      // 确认密码验证
      if (registerForm.password !== registerForm.confirmPassword) {
        errorMessage.value = '两次输入的密码不一致'
        return false
      }

      // 用户协议验证
      if (!registerForm.agreement) {
        errorMessage.value = '请阅读并同意用户协议和隐私政策'
        return false
      }

      return true
    }

    // 提交处理函数
    const handleSubmit = async () => {
      // 表单验证
      if (!validateForm()) {
        return
      }

      try {
        isLoading.value = true

        // 准备请求数据
        const registerData = {
          Username: registerForm.username,
          Email: registerForm.email,
          Password: registerForm.password,
          FirstName: registerForm.firstName,
          LastName: registerForm.lastName,
          PhoneNumber: registerForm.phoneNumber,
          Biography: registerForm.biography,
          Roles: ['Regular'], // 默认注册为普通用户
        }

        console.log('正在发送注册请求:', {
          url: import.meta.env.VITE_API_BASE_URL + '/User/register',
          data: { ...registerData, Password: '******' }, // 日志中隐藏密码
        })

        // 发送注册请求
        const response = await userAPI.register(registerData)

        console.log('注册成功:', response.data)

        // 注册成功后，先登录
        const loginResponse = await userAPI.login(registerForm.username, registerForm.password)
        const token = loginResponse.data.token

        // 先存储token以便后续API调用
        sessionStorage.setItem('token', token)

        // 获取完整用户信息
        const userResponse = await userAPI.getCurrentUser()
        const completeUserData = userResponse.data
        completeUserData.token = token

        // 使用Pinia存储
        const userStore = useUserStore()
        // saveLoginInfo会自动获取摄影师和修图师ID
        await userStore.saveLoginInfo(completeUserData, token, false)

        // 跳转到首页
        router.push('/home')
      } catch (error: any) {
        console.error('注册失败:', error)

        // 处理不同类型的错误
        if (error.response) {
          // 服务器返回了错误状态码
          const { status, data } = error.response

          switch (status) {
            case 400:
              errorMessage.value = data.message || '注册参数错误'
              break
            case 409:
              errorMessage.value = '用户名或邮箱已存在'
              break
            default:
              errorMessage.value = '注册失败，请稍后再试'
          }
        } else if (error.request) {
          // 请求发送了但没有收到响应
          errorMessage.value = '无法连接到服务器，请检查网络连接'
        } else {
          // 设置请求时发生了错误
          errorMessage.value = '注册过程中发生错误'
        }
      } finally {
        isLoading.value = false
      }
    }

    const goLogin = () => router.push('/login')

    return {
      showPassword,
      showConfirmPassword,
      registerForm,
      handleSubmit,
      goLogin,
      isLoading,
      errorMessage,
    }
  },
})
</script>
