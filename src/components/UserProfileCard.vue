<template>
  <div class="relative">
    <!-- 用户头像和下拉按钮 -->
    <button
      @click="toggleDropdown"
      class="flex items-center max-w-xs rounded-full focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
    >
      <!-- 使用字母头像或用户头像 -->
      <div
        v-if="!avatarUrl"
        class="h-10 w-10 rounded-full border-2 border-green-light bg-primary text-white flex items-center justify-center font-bold"
      >
        {{ userInitial }}
      </div>
      <img
        v-else
        class="h-10 w-10 rounded-full object-cover border-2 border-green-light"
        :src="avatarUrl"
        alt="用户头像"
      />
      <span class="ml-2 text-sm font-medium text-neutral-dark">{{ userData.username }}</span>
      <svg
        :class="[isOpen ? 'transform rotate-180' : '', 'ml-1 h-5 w-5 text-neutral-dark']"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        aria-hidden="true"
      >
        <path
          fill-rule="evenodd"
          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
          clip-rule="evenodd"
        />
      </svg>
    </button>

    <!-- 下拉菜单 -->
    <transition
      enter-active-class="transition ease-out duration-100"
      enter-from-class="transform opacity-0 scale-95"
      enter-to-class="transform opacity-100 scale-100"
      leave-active-class="transition ease-in duration-75"
      leave-from-class="transform opacity-100 scale-100"
      leave-to-class="transform opacity-0 scale-95"
    >
      <div
        v-if="isOpen"
        class="origin-top-right absolute right-0 mt-2 w-64 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 z-50"
      >
        <!-- 用户信息头部 -->
        <div class="px-4 py-3 border-b border-green-light">
          <div class="flex items-center">
            <!-- 相同的头像逻辑 -->
            <div
              v-if="!avatarUrl"
              class="h-12 w-12 rounded-full border-2 border-green-light bg-primary text-white flex items-center justify-center font-bold"
            >
              {{ userInitial }}
            </div>
            <img
              v-else
              class="h-12 w-12 rounded-full object-cover border-2 border-green-light"
              :src="avatarUrl"
              alt="用户头像"
            />
            <div class="ml-3">
              <p class="text-sm font-medium text-neutral-dark">{{ userData.username }}</p>
              <p class="text-xs text-primary">
                <span v-if="isLoadingRoles">加载中...</span>
                <span v-else-if="userRoles.length">{{ formattedRoles }}</span>
                <span v-else>普通用户</span>
              </p>
              <p class="text-xs text-neutral-dark">{{ userData.email }}</p>
            </div>
          </div>
        </div>

        <!-- 菜单项 -->
        <div class="mt-1">
          <a
            v-for="(item, index) in menuItems"
            :key="index"
            :href="item.href"
            class="block px-4 py-2 text-sm text-neutral-dark hover:bg-green-light hover:bg-opacity-10"
          >
            {{ item.name }}
          </a>
        </div>

        <!-- 退出登录 -->
        <div class="border-t border-green-light mt-1 pt-1">
          <a
            href="#"
            class="block px-4 py-2 text-sm text-neutral-dark hover:bg-green-light hover:bg-opacity-10"
            @click.prevent="logout"
          >
            退出登录
          </a>
        </div>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, onUnmounted, computed } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

export default defineComponent({
  name: 'UserProfileCard',
  setup() {
    const router = useRouter()
    const isOpen = ref(false)
    const avatarUrl = ref('')
    const userRoles = ref<string[]>([])
    const isLoadingRoles = ref(false)

    // 从localStorage或sessionStorage获取用户数据
    const getUserData = () => {
      // 先检查 sessionStorage，因为登录时会首选这里
      const sessionUserStr = sessionStorage.getItem('user')
      // 然后检查 localStorage (如果用户选择了"记住我")
      const localUserStr = localStorage.getItem('user')

      console.log('Storage data check:', {
        sessionStorage: sessionUserStr ? 'exists' : 'empty',
        localStorage: localUserStr ? 'exists' : 'empty',
      })

      const userStr = sessionUserStr || localUserStr

      if (!userStr) {
        console.log('No user data found in storage')
        return null
      }

      try {
        const parsedData = JSON.parse(userStr)
        console.log('Retrieved user data:', {
          username: parsedData.username,
          userId: parsedData.userId,
          email: parsedData.email,
          roles: parsedData.roles || [], // 从存储的数据中获取角色
        })

        // 如果已经存储了角色信息，直接使用，避免多余的API请求
        if (parsedData.roles && Array.isArray(parsedData.roles)) {
          userRoles.value = parsedData.roles
        }

        return parsedData
      } catch (e) {
        console.error('解析用户数据失败:', e)
        return null
      }
    }

    const userData = ref(
      getUserData() || {
        userId: 0,
        username: '游客',
        email: 'guest@example.com',
        userType: '',
        token: '',
      },
    )

    // 监听存储变化
    const setupStorageListener = () => {
      // 创建一个处理函数来响应存储变化
      const handleStorageChange = () => {
        console.log('Storage changed, updating user data')
        const newUserData = getUserData()
        if (newUserData) {
          userData.value = newUserData
          // 如果用户ID改变，重新获取角色
          fetchUserRoles()
        } else if (userData.value.userId !== 0) {
          // 如果原先有用户但现在没有，表示登出
          userData.value = {
            userId: 0,
            username: '游客',
            email: 'guest@example.com',
            userType: '',
            token: '',
          }
          userRoles.value = []
        }
      }

      // 监听存储事件
      window.addEventListener('storage', handleStorageChange)

      // 返回清理函数
      return () => {
        window.removeEventListener('storage', handleStorageChange)
      }
    }

    // 计算用户名首字母作为头像
    const userInitial = computed(() => {
      if (!userData.value.username) return '?'
      return userData.value.username.charAt(0).toUpperCase()
    })

    // 获取用户角色
    const fetchUserRoles = async () => {
      if (!userData.value.userId) return

      isLoadingRoles.value = true
      try {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token')
        if (!token) throw new Error('未找到认证令牌')

        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/User/${userData.value.userId}/roles`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        )

        userRoles.value = response.data.filter((role: string) => role && role.trim() !== '')
        console.log('获取到的用户角色:', userRoles.value)
      } catch (error) {
        console.error('获取用户角色失败:', error)
        userRoles.value = []
      } finally {
        isLoadingRoles.value = false
      }
    }

    // 格式化角色显示
    const formattedRoles = computed(() => {
      // 筛选非普通用户角色
      const nonRegularRoles = userRoles.value.filter((role) => role !== 'Regular')

      if (nonRegularRoles.length > 0) {
        // 如果有非普通用户角色，显示这些角色
        return nonRegularRoles.map(formatRoleName).join('、')
      } else if (userRoles.value.includes('Regular')) {
        // 如果只有普通用户角色，显示"普通用户"
        return '普通用户'
      } else {
        return '普通用户'
      }
    })

    // 角色名称格式化
    const formatRoleName = (role: string): string => {
      const roleMap: Record<string, string> = {
        Regular: '普通用户',
        Admin: '管理员',
        Photographer: '摄影师',
        Retoucher: '修图师',
      }
      return roleMap[role] || role
    }

    // 监听自定义登录事件
    const handleUserLogin = (event: CustomEvent) => {
      userData.value = event.detail
      fetchUserRoles()
    }

    // 下拉菜单项
    const menuItems = ref([
      { name: '个人资料', href: '/profile' },
      { name: '账户设置', href: '#' },
      { name: '消息中心', href: '#' },
      { name: '收支明细', href: '#' },
    ])

    // 切换下拉菜单状态
    const toggleDropdown = () => {
      isOpen.value = !isOpen.value
    }

    // 处理退出登录
    const logout = () => {
      isOpen.value = false
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      sessionStorage.removeItem('token')
      sessionStorage.removeItem('user')
      console.log('退出登录')
      router.push('/login')
    }

    // 点击外部关闭下拉菜单
    const closeDropdown = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (!target.closest('.relative')) {
        isOpen.value = false
      }
    }

    onMounted(() => {
      // 添加和移除事件监听器，获取用户角色
      document.addEventListener('click', closeDropdown)
      window.addEventListener('user-login', handleUserLogin as EventListener)
      // 模拟存储事件，确保在组件挂载时更新数据
      const newUserData = getUserData()
      if (newUserData && newUserData.userId !== userData.value.userId) {
        userData.value = newUserData
        fetchUserRoles()
      }
      // 设置存储监听器
      const cleanupStorageListener = setupStorageListener()
      if (userData.value.userId) {
        fetchUserRoles()
      }
    })

    onUnmounted(() => {
      // 在组件卸载时清理
      document.removeEventListener('click', closeDropdown)
      window.removeEventListener('user-login', handleUserLogin as EventListener)
    })

    const refreshUserData = () => {
      // 创建一个方法，可以从外部调用来刷新用户数据
      const newData = getUserData()
      if (newData) {
        userData.value = newData
        fetchUserRoles()
      }
    }

    return {
      isOpen,
      userData,
      avatarUrl,
      userRoles,
      isLoadingRoles,
      formattedRoles,
      userInitial,
      menuItems,
      toggleDropdown,
      logout,
    }
  },
})
</script>
