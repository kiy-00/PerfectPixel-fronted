<template>
  <div class="flex h-screen bg-neutral overflow-hidden">
    <!-- 左侧边栏 -->
    <SideBar />

    <!-- 主内容区 -->
    <div class="flex-1 flex flex-col overflow-hidden">
      <!-- 顶部用户信息条 -->
      <div class="bg-white shadow-sm z-10">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-end h-16">
            <div class="flex items-center">
              <!-- 用户信息悬浮组件 -->
              <UserProfileCard />
            </div>
          </div>
        </div>
      </div>

      <!-- 主要内容 -->
      <main class="flex-1 overflow-y-auto p-6 bg-neutral">
        <div class="max-w-7xl mx-auto">
          <h1 class="text-2xl font-semibold text-neutral-dark mb-6">预约日历</h1>

          <!-- 日历组件 -->
          <div class="bg-white rounded-lg shadow p-6">
            <BookingCalendar />
          </div>

          <!-- 可选的其他内容区域 -->
          <div class="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
            <!-- 最近预约 -->
            <div class="bg-white rounded-lg shadow p-6">
              <h2 class="text-lg font-medium text-neutral-dark mb-4">最近预约</h2>
              <div class="space-y-4">
                <div
                  v-for="booking in recentBookings"
                  :key="booking.id"
                  class="p-4 border-l-4 rounded-r-md"
                  :class="{
                    'border-primary bg-green-light bg-opacity-10': booking.status === 'confirmed',
                    'border-warning bg-warning bg-opacity-10': booking.status === 'pending',
                  }"
                >
                  <div class="flex justify-between">
                    <p class="font-medium">{{ booking.title }}</p>
                    <span
                      class="text-sm"
                      :class="{
                        'text-primary': booking.status === 'confirmed',
                        'text-warning': booking.status === 'pending',
                      }"
                    >
                      {{ booking.statusText }}
                    </span>
                  </div>
                  <p class="text-sm text-neutral-dark mt-1">
                    {{ booking.date }} {{ booking.time }}
                  </p>
                  <p class="text-sm text-neutral-dark">地点: {{ booking.location }}</p>
                </div>
              </div>
            </div>

            <!-- 推荐摄影师 -->
            <div class="bg-white rounded-lg shadow p-6">
              <h2 class="text-lg font-medium text-neutral-dark mb-4">推荐摄影师</h2>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div
                  v-for="photographer in recommendedPhotographers"
                  :key="photographer.id"
                  class="flex items-center space-x-4 p-3 rounded-md hover:bg-green-light hover:bg-opacity-10 cursor-pointer"
                >
                  <img
                    :src="photographer.avatar"
                    :alt="photographer.name"
                    class="w-12 h-12 rounded-full object-cover border border-green-light"
                  />
                  <div>
                    <p class="font-medium text-neutral-dark">{{ photographer.name }}</p>
                    <p class="text-sm text-green-dark">{{ photographer.speciality }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import SideBar from '../components/SideBar.vue'
import UserProfileCard from '../components/UserProfileCard.vue'
import BookingCalendar from '../components/BookingCalendar.vue'

export default defineComponent({
  name: 'HomeView',
  components: {
    SideBar,
    UserProfileCard,
    BookingCalendar,
  },
  setup() {
    // 最近预约数据
    const recentBookings = ref([
      {
        id: 1,
        title: '人像写真拍摄',
        date: '2025-03-10',
        time: '14:00-16:00',
        location: '市中心摄影基地',
        status: 'confirmed',
        statusText: '已确认',
      },
      {
        id: 2,
        title: '产品样片拍摄',
        date: '2025-03-15',
        time: '09:30-11:30',
        location: '阳光工作室',
        status: 'pending',
        statusText: '待确认',
      },
      {
        id: 3,
        title: '婚纱照外景',
        date: '2025-03-20',
        time: '15:00-18:00',
        location: '海滨公园',
        status: 'confirmed',
        statusText: '已确认',
      },
    ])

    // 推荐摄影师数据
    const recommendedPhotographers = ref([
      {
        id: 1,
        name: '王明',
        speciality: '人像摄影',
        avatar: '/api/placeholder/80/80',
      },
      {
        id: 2,
        name: '李梅',
        speciality: '风景摄影',
        avatar: '/api/placeholder/80/80',
      },
      {
        id: 3,
        name: '张伟',
        speciality: '产品摄影',
        avatar: '/api/placeholder/80/80',
      },
      {
        id: 4,
        name: '赵琳',
        speciality: '婚纱摄影',
        avatar: '/api/placeholder/80/80',
      },
    ])

    return {
      recentBookings,
      recommendedPhotographers,
    }
  },
})
</script>
