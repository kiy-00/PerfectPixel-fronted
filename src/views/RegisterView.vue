<template>
  <div
    class="flex flex-col items-center justify-center w-full h-full min-h-screen bg-neutral text-neutral-dark"
  >
    <div class="w-full max-w-md p-8 rounded-lg shadow-lg bg-white">
      <!-- 标题 -->
      <h1 class="text-3xl font-bold text-center mb-6 text-primary">账号注册</h1>

      <!-- 注册选项切换 - tab栏样式 -->
      <div class="flex justify-center mb-6">
        <div class="w-full max-w-xs border border-green-light rounded-lg overflow-hidden">
          <div class="flex">
            <button
              @click="registerMethod = 'username'"
              :class="[
                'flex-1 py-3 px-4 text-center font-medium transition-colors duration-200',
                registerMethod === 'username'
                  ? 'bg-primary text-white'
                  : 'bg-white text-neutral-dark hover:bg-green-light hover:bg-opacity-20',
              ]"
            >
              用户名注册
            </button>
            <button
              @click="registerMethod = 'email'"
              :class="[
                'flex-1 py-3 px-4 text-center font-medium transition-colors duration-200',
                registerMethod === 'email'
                  ? 'bg-primary text-white'
                  : 'bg-white text-neutral-dark hover:bg-green-light hover:bg-opacity-20',
              ]"
            >
              邮箱注册
            </button>
          </div>
        </div>
      </div>

      <!-- 注册表单 -->
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <!-- 用户名/邮箱输入框 -->
        <div class="space-y-2">
          <label
            :for="registerMethod === 'username' ? 'username' : 'email'"
            class="block text-sm font-medium text-neutral-dark"
          >
            {{ registerMethod === 'username' ? '用户名' : '邮箱' }}
          </label>
          <div class="relative">
            <input
              :type="registerMethod === 'username' ? 'text' : 'email'"
              :id="registerMethod === 'username' ? 'username' : 'email'"
              :name="registerMethod === 'username' ? 'username' : 'email'"
              v-model="registerForm.identifier"
              class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-accent focus:border-green-accent bg-green-light bg-opacity-10"
              :placeholder="registerMethod === 'username' ? '请输入用户名' : '请输入邮箱'"
              required
            />
          </div>
          <p v-if="registerMethod === 'username'" class="text-xs text-neutral-dark mt-1">
            用户名长度为4-20个字符，支持字母、数字、下划线
          </p>
        </div>

        <!-- 手机号码输入框 -->
        <div class="space-y-2">
          <label for="phone" class="block text-sm font-medium text-neutral-dark"> 手机号码 </label>
          <div class="relative">
            <input
              type="tel"
              id="phone"
              name="phone"
              v-model="registerForm.phone"
              class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-accent focus:border-green-accent bg-green-light bg-opacity-10"
              placeholder="请输入手机号码"
              required
            />
          </div>
        </div>

        <!-- 验证码 -->
        <div class="space-y-2">
          <label for="verificationCode" class="block text-sm font-medium text-neutral-dark">
            验证码
          </label>
          <div class="flex space-x-2">
            <input
              type="text"
              id="verificationCode"
              name="verificationCode"
              v-model="registerForm.verificationCode"
              class="flex-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-accent focus:border-green-accent bg-green-light bg-opacity-10"
              placeholder="请输入验证码"
              required
            />
            <button
              type="button"
              class="px-4 py-2 border border-primary rounded-md text-primary hover:bg-green-light focus:outline-none focus:ring-2 focus:ring-green-accent"
              :disabled="cooldown > 0"
              @click="sendVerificationCode"
            >
              {{ cooldown > 0 ? `${cooldown}秒后重试` : '获取验证码' }}
            </button>
          </div>
        </div>

        <!-- 密码输入框 -->
        <div class="space-y-2">
          <label for="password" class="block text-sm font-medium text-neutral-dark"> 密码 </label>
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
            确认密码
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

        <!-- 注册按钮 -->
        <button
          type="submit"
          class="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-primary hover:bg-green-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-accent transition duration-200"
        >
          立即注册
        </button>
      </form>

      <!-- 登录链接 -->
      <div class="text-center mt-6">
        <p class="text-sm text-neutral-dark">
          已有账号?
          <a @click.prevent="goLogin">立即登录</a>
        </p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive } from 'vue'
import { useRouter } from 'vue-router'

export default defineComponent({
  name: 'RegisterView',
  setup() {
    const router = useRouter()

    // 注册方式（用户名/邮箱）
    const registerMethod = ref('username')

    // 密码显示控制
    const showPassword = ref(false)
    const showConfirmPassword = ref(false)

    // 验证码冷却时间
    const cooldown = ref(0)

    // 注册表单数据
    const registerForm = reactive({
      identifier: '', // 用户名或邮箱
      phone: '',
      verificationCode: '',
      password: '',
      confirmPassword: '',
      agreement: false,
    })

    // 发送验证码
    const sendVerificationCode = () => {
      // 模拟发送验证码
      console.log('向手机号码发送验证码:', registerForm.phone)

      // 设置冷却时间
      cooldown.value = 60
      const timer = setInterval(() => {
        cooldown.value--
        if (cooldown.value <= 0) {
          clearInterval(timer)
        }
      }, 1000)
    }

    // 提交处理函数
    const handleSubmit = () => {
      // 表单验证
      if (registerForm.password !== registerForm.confirmPassword) {
        alert('两次输入的密码不一致')
        return
      }

      console.log('注册信息:', {
        registerMethod: registerMethod.value,
        identifier: registerForm.identifier,
        phone: registerForm.phone,
        password: registerForm.password,
        agreement: registerForm.agreement,
      })

      // 这里添加注册逻辑
    }

    const goLogin = () => router.push('/login')

    return {
      registerMethod,
      showPassword,
      showConfirmPassword,
      cooldown,
      registerForm,
      sendVerificationCode,
      handleSubmit,
      goLogin,
    }
  },
})
</script>
