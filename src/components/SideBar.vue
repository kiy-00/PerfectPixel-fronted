<template>
  <div class="w-64 bg-white shadow-lg h-full flex flex-col">
    <!-- 网站标志 -->
    <div class="px-6 py-5 border-b border-green-light">
      <div class="flex items-center">
        <div class="h-8 w-8 bg-primary rounded-md flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5 text-white"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z"
              clip-rule="evenodd"
            />
          </svg>
        </div>
        <div class="ml-3">
          <h1 class="text-lg font-bold text-primary">PerfectPixel</h1>
          <p class="text-xs text-green-dark">摄影修图服务平台</p>
        </div>
      </div>
    </div>

    <!-- 导航菜单 -->
    <nav class="flex-1 overflow-y-auto py-4">
      <div class="px-3 space-y-5">
        <h2 class="px-3 text-md font-semibold text-neutral-dark uppercase tracking-wider">
          My PixelPerfect
        </h2>

        <router-link
          v-for="(item, index) in navigationItems"
          :key="index"
          :to="item.href"
          custom
          v-slot="{ navigate, isActive }"
        >
          <a
            @click="navigate"
            :class="[
              isActive
                ? 'bg-green-light bg-opacity-30 text-primary'
                : 'text-neutral-dark hover:bg-green-light hover:bg-opacity-10',
              'group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-150',
            ]"
          >
            <div
              :class="[
                isActive ? 'text-primary' : 'text-neutral-dark group-hover:text-primary',
                'mr-3 h-6 w-6',
              ]"
              v-html="item.icon"
            ></div>
            {{ item.name }}
          </a>
        </router-link>
      </div>
    </nav>

    <!-- 底部 -->
    <div class="p-4 border-t border-green-light">
      <div class="bg-green-light bg-opacity-20 rounded-md p-3">
        <h3 class="text-sm font-medium text-primary">需要帮助?</h3>
        <p class="mt-1 text-xs text-green-dark">有任何问题可以联系我们的客服团队获取帮助。</p>
        <a
          href="#"
          class="mt-2 text-xs font-medium text-primary hover:text-green-dark inline-flex items-center"
        >
          联系客服
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-4 w-4 ml-1"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
              clip-rule="evenodd"
            />
          </svg>
        </a>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue'
import { useRoute } from 'vue-router'

export default defineComponent({
  name: 'SideBar',
  setup() {
    const route = useRoute()

    const navigationItems = ref([
      {
        name: '我的预约',
        href: '/home',
        icon: `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>`,
      },
      {
        name: '我的订单',
        href: '/my-orders',
        icon: `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>`,
      },
      {
        name: '修图服务',
        href: '/retouch-service',
        icon: `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>`,
      },
      {
        name: '我的作品集',
        href: '/portfolio',
        icon: `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>`,
      },
      {
        name: '迷你社区',
        href: '/community',
        icon: `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>`,
      },
      {
        name: '自助修图区',
        href: '/retouch',
        icon: `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
              </svg>`,
      },
    ])

    return {
      navigationItems,
    }
  },
})
</script>
