<template>
  <div class="relative">
    <!-- 用户头像和下拉按钮 -->
    <button
      @click="toggleDropdown"
      class="flex items-center max-w-xs rounded-full focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
    >
      <img
        class="h-10 w-10 rounded-full object-cover border-2 border-green-light"
        :src="avatarUrl"
        alt="用户头像"
      />
      <span class="ml-2 text-sm font-medium text-neutral-dark">{{ user.name }}</span>
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
            <img
              class="h-12 w-12 rounded-full object-cover border-2 border-green-light"
              :src="avatarUrl"
              alt="用户头像"
            />
            <div class="ml-3">
              <p class="text-sm font-medium text-neutral-dark">{{ user.name }}</p>
              <p class="text-xs text-primary">{{ user.role }}</p>
              <p class="text-xs text-neutral-dark">{{ user.email }}</p>
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
import { defineComponent, ref, onMounted, onUnmounted } from 'vue'

export default defineComponent({
  name: 'UserProfileCard',
  setup() {
    const isOpen = ref(false)

    // 模拟用户数据
    const user = ref({
      name: '张三',
      role: '摄影师',
      email: 'zhangsan@example.com',
    })

    // 使用本地图片作为头像
    const avatarUrl = ref('/src/assets/avatar-placeholder.png')

    // 下拉菜单项
    const menuItems = ref([
      { name: '个人资料', href: '#' },
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
      console.log('退出登录')
      isOpen.value = false
    }

    // 点击外部关闭下拉菜单
    const closeDropdown = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (!target.closest('.relative')) {
        isOpen.value = false
      }
    }

    // 添加和移除事件监听器
    onMounted(() => {
      document.addEventListener('click', closeDropdown)
    })

    onUnmounted(() => {
      document.removeEventListener('click', closeDropdown)
    })

    return {
      isOpen,
      user,
      avatarUrl,
      menuItems,
      toggleDropdown,
      logout,
    }
  },
})
</script>
