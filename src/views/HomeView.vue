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

          <!-- 加载状态 -->
          <div v-if="loading" class="flex justify-center py-12">
            <div class="text-center">
              <div
                class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"
              ></div>
              <p class="mt-4 text-neutral-dark">正在加载预约数据...</p>
            </div>
          </div>

          <!-- 错误状态 -->
          <div v-else-if="error" class="bg-white rounded-lg shadow-md p-6 text-center">
            <div class="text-error text-lg mb-3">加载失败</div>
            <p class="text-neutral-dark mb-6">{{ error }}</p>
            <button
              @click="fetchBookings"
              class="px-4 py-2 bg-primary text-white rounded-md hover:bg-green-dark transition-colors"
            >
              重新加载
            </button>
          </div>

          <div v-else>
            <!-- 日历组件 -->
            <div class="bg-white rounded-lg shadow p-6">
              <BookingCalendar :bookings="bookings" />
            </div>

            <!-- 最近预约 -->
            <div class="mt-8">
              <div class="bg-white rounded-lg shadow p-6">
                <h2 class="text-lg font-medium text-neutral-dark mb-4">最近预约</h2>
                <div v-if="bookings.length > 0" class="space-y-4">
                  <div
                    v-for="booking in sortedBookings"
                    :key="booking.bookingId"
                    class="p-4 border-l-4 rounded-r-md"
                    :class="{
                      'border-primary bg-green-light bg-opacity-10':
                        booking.status === 'Processing',
                      'border-warning bg-warning bg-opacity-10': booking.status === 'Pending',
                      'border-green-300 bg-green-100': booking.status === 'Completed',
                      'border-red-300 bg-red-100': booking.status === 'Cancelled',
                    }"
                  >
                    <div class="flex justify-between">
                      <p class="font-medium text-primary">
                        与 {{ booking.photographerName }} 的预约
                      </p>
                      <span
                        class="text-sm"
                        :class="{
                          'text-primary': booking.status === 'Processing',
                          'text-warning': booking.status === 'Pending',
                          'text-green-600': booking.status === 'Completed',
                          'text-red-600': booking.status === 'Cancelled',
                        }"
                      >
                        {{ getStatusText(booking.status) }}
                      </span>
                    </div>
                    <p class="text-sm text-neutral-dark mt-1">
                      {{ formatDate(booking.bookingDate) }}
                    </p>
                    <p class="text-sm text-neutral-dark">地点: {{ booking.location }}</p>
                    <div class="mt-2 flex justify-end">
                      <router-link
                        :to="`/photography-booking/${booking.bookingId}`"
                        class="text-primary hover:text-green-dark text-sm"
                      >
                        查看详情
                      </router-link>
                    </div>
                  </div>
                </div>
                <div v-else class="text-center py-12">
                  <div class="text-neutral-dark mb-4">您还没有任何摄影预约</div>
                  <router-link
                    to="/photography-service"
                    class="px-6 py-2 bg-primary text-white rounded-md hover:bg-green-dark transition-colors"
                  >
                    去寻找摄影师
                  </router-link>
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
import { defineComponent, ref, computed, onMounted } from 'vue'
import SideBar from '../components/SideBar.vue'
import UserProfileCard from '../components/UserProfileCard.vue'
import BookingCalendar from '../components/BookingCalendar.vue'
import apiClient from '../services/apiService'

export default defineComponent({
  name: 'HomeView',
  components: {
    SideBar,
    UserProfileCard,
    BookingCalendar,
  },
  setup() {
    const bookings = ref<any[]>([])
    const loading = ref(true)
    const error = ref('')

    // 获取状态文字
    const getStatusText = (status: string): string => {
      switch (status) {
        case 'Pending':
          return '待确认'
        case 'Processing':
          return '已确认'
        case 'Completed':
          return '已完成'
        case 'Cancelled':
          return '已取消'
        default:
          return status
      }
    }

    // 格式化日期
    const formatDate = (dateString: string): string => {
      if (!dateString) return '未设置'
      const date = new Date(dateString)
      return new Intl.DateTimeFormat('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      }).format(date)
    }

    // 按日期排序的预约列表
    const sortedBookings = computed(() => {
      return [...bookings.value].sort((a, b) => {
        return new Date(a.bookingDate).getTime() - new Date(b.bookingDate).getTime()
      })
    })

    // 获取预约数据
    const fetchBookings = async () => {
      loading.value = true
      error.value = ''

      try {
        console.log('正在获取用户摄影预约...')
        const response = await apiClient.get('/Booking/user')
        bookings.value = response.data
        console.log(`获取到${bookings.value.length}条摄影预约:`, bookings.value)
      } catch (err: any) {
        console.error('获取摄影预约失败:', err)
        error.value = '获取预约数据失败，请稍后再试'
        bookings.value = []
      } finally {
        loading.value = false
      }
    }

    onMounted(() => {
      fetchBookings()
    })

    return {
      bookings,
      loading,
      error,
      getStatusText,
      formatDate,
      sortedBookings,
      fetchBookings,
    }
  },
})
</script>
