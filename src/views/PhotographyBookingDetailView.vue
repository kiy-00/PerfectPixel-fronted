<template>
  <div class="bg-neutral min-h-screen pb-10">
    <!-- 页面标题区域 -->
    <div class="bg-primary text-white px-6 py-4 shadow-md">
      <div class="container mx-auto">
        <div class="flex justify-between items-center">
          <div>
            <h1 class="text-2xl font-bold">摄影预约详情</h1>
            <p class="text-sm text-green-light mt-1">查看摄影预约的详细信息和处理进度</p>
          </div>
          <router-link
            to="/my-orders"
            class="px-4 py-2 bg-white text-primary rounded-md hover:bg-green-light transition-colors"
          >
            返回订单列表
          </router-link>
        </div>
      </div>
    </div>

    <!-- 主要内容区域 -->
    <div class="container mx-auto px-4 mt-8">
      <!-- 加载状态 -->
      <div v-if="loading" class="flex justify-center py-12">
        <div class="text-center">
          <div
            class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"
          ></div>
          <p class="mt-4 text-neutral-dark">正在加载预约信息...</p>
        </div>
      </div>

      <!-- 错误状态 -->
      <div v-else-if="error" class="bg-white rounded-lg shadow-md p-6 text-center">
        <div class="text-error text-lg mb-3">加载失败</div>
        <p class="text-neutral-dark mb-6">{{ error }}</p>
        <button
          @click="fetchBookingDetails"
          class="px-4 py-2 bg-primary text-white rounded-md hover:bg-green-dark transition-colors"
        >
          重新加载
        </button>
      </div>

      <!-- 预约详情 -->
      <div v-else-if="bookingDetails" class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <!-- 左侧预约信息 -->
        <div class="md:col-span-2">
          <div class="bg-white rounded-lg shadow-md p-6 mb-6">
            <div class="flex justify-between items-center mb-6">
              <h2 class="text-xl font-semibold text-neutral-dark">预约信息</h2>
              <div class="flex items-center">
                <span
                  :class="['px-3 py-1 text-sm rounded-full', getStatusClass(bookingDetails.status)]"
                >
                  {{ getStatusText(bookingDetails.status) }}
                </span>
                <span class="ml-2 text-sm text-neutral-dark"
                  >预约号: {{ bookingDetails.bookingId }}</span
                >
              </div>
            </div>

            <div class="border border-neutral rounded-md divide-y divide-neutral mb-6">
              <div class="flex p-4">
                <div class="w-1/3 text-neutral-dark font-medium">摄影师</div>
                <div class="w-2/3 text-primary">{{ bookingDetails.photographerName }}</div>
              </div>
              <div class="flex p-4">
                <div class="w-1/3 text-neutral-dark font-medium">预约日期</div>
                <div class="w-2/3 text-neutral-dark">
                  {{ formatDate(bookingDetails.bookingDate) }}
                </div>
              </div>
              <div class="flex p-4">
                <div class="w-1/3 text-neutral-dark font-medium">拍摄地点</div>
                <div class="w-2/3 text-neutral-dark">{{ bookingDetails.location }}</div>
              </div>
              <div class="flex p-4">
                <div class="w-1/3 text-neutral-dark font-medium">照片数量</div>
                <div class="w-2/3 text-neutral-dark">{{ bookingDetails.photoCount }}张</div>
              </div>
              <div class="flex p-4">
                <div class="w-1/3 text-neutral-dark font-medium">拍摄需求</div>
                <div class="w-2/3 text-neutral-dark">{{ bookingDetails.requirements }}</div>
              </div>
              <div class="flex p-4">
                <div class="w-1/3 text-neutral-dark font-medium">预约金额</div>
                <div class="w-2/3 text-primary font-semibold">
                  ¥{{ bookingDetails.initialAmount }}
                </div>
              </div>
              <div class="flex p-4">
                <div class="w-1/3 text-neutral-dark font-medium">创建日期</div>
                <div class="w-2/3 text-neutral-dark">
                  {{ formatDate(bookingDetails.createdAt) }}
                </div>
              </div>
            </div>

            <!-- 订单操作按钮 -->
            <div class="flex justify-end space-x-4">
              <button
                v-if="bookingDetails.status === 'Pending'"
                @click="cancelBooking"
                class="px-4 py-2 border border-red-500 text-red-500 rounded-md hover:bg-red-50 transition-colors"
              >
                取消预约
              </button>
              <button
                v-if="bookingDetails.status === 'Completed' && bookingDetails.isPublic"
                @click="viewAlbum"
                class="px-4 py-2 bg-primary text-white rounded-md hover:bg-green-dark transition-colors"
              >
                查看照片集
              </button>
            </div>
          </div>

          <!-- 服务明细 -->
          <div class="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 class="text-xl font-semibold text-neutral-dark mb-4">服务明细</h2>
            <div class="border border-neutral rounded-md overflow-hidden">
              <table class="min-w-full divide-y divide-neutral">
                <thead class="bg-neutral-light">
                  <tr>
                    <th
                      class="px-6 py-3 text-left text-xs font-medium text-neutral-dark uppercase tracking-wider"
                    >
                      服务项目
                    </th>
                    <th
                      class="px-6 py-3 text-left text-xs font-medium text-neutral-dark uppercase tracking-wider"
                    >
                      描述
                    </th>
                    <th
                      class="px-6 py-3 text-right text-xs font-medium text-neutral-dark uppercase tracking-wider"
                    >
                      价格
                    </th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-neutral">
                  <tr v-for="service in bookingDetails.services" :key="service.serviceId">
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-neutral-dark">
                      {{ service.serviceName }}
                    </td>
                    <td class="px-6 py-4 text-sm text-neutral-dark">
                      {{ service.description }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-right text-primary">
                      ¥{{ service.price }}
                    </td>
                  </tr>
                  <tr class="bg-neutral-light">
                    <td colspan="2" class="px-6 py-4 text-right font-medium text-neutral-dark">
                      总计
                    </td>
                    <td class="px-6 py-4 text-right font-bold text-primary">
                      ¥{{ bookingDetails.initialAmount }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- 订单进度时间轴 -->
          <div class="bg-white rounded-lg shadow-md p-6">
            <h2 class="text-xl font-semibold text-neutral-dark mb-6">预约进度</h2>

            <div class="relative pl-8">
              <!-- 垂直线 -->
              <div class="absolute left-0 top-0 bottom-0 w-0.5 bg-neutral-light"></div>

              <!-- 创建预约 -->
              <div class="relative mb-6 pl-8">
                <div class="absolute left-0 -translate-x-1/2 w-4 h-4 rounded-full bg-primary"></div>
                <div class="mb-1 font-medium text-neutral-dark">预约创建</div>
                <div class="text-sm text-neutral-dark">
                  {{ formatDate(bookingDetails.createdAt) }}
                </div>
              </div>

              <!-- 摄影师确认 -->
              <div class="relative mb-6 pl-8">
                <div
                  class="absolute left-0 -translate-x-1/2 w-4 h-4 rounded-full"
                  :class="bookingDetails.status !== 'Pending' ? 'bg-primary' : 'bg-neutral'"
                ></div>
                <div
                  class="mb-1 font-medium"
                  :class="
                    bookingDetails.status !== 'Pending' ? 'text-neutral-dark' : 'text-neutral'
                  "
                >
                  摄影师确认
                </div>
                <div class="text-sm text-neutral-dark">
                  {{ bookingDetails.status !== 'Pending' ? '已确认' : '等待中' }}
                </div>
              </div>

              <!-- 拍摄日期 -->
              <div class="relative mb-6 pl-8">
                <div
                  class="absolute left-0 -translate-x-1/2 w-4 h-4 rounded-full"
                  :class="
                    bookingDetails.status === 'Processing' || bookingDetails.status === 'Completed'
                      ? 'bg-primary'
                      : 'bg-neutral'
                  "
                ></div>
                <div
                  class="mb-1 font-medium"
                  :class="
                    bookingDetails.status === 'Processing' || bookingDetails.status === 'Completed'
                      ? 'text-neutral-dark'
                      : 'text-neutral'
                  "
                >
                  拍摄日期
                </div>
                <div class="text-sm text-neutral-dark">
                  {{ formatDate(bookingDetails.bookingDate) }}
                </div>
              </div>

              <!-- 预约完成 -->
              <div class="relative pl-8">
                <div
                  class="absolute left-0 -translate-x-1/2 w-4 h-4 rounded-full"
                  :class="bookingDetails.status === 'Completed' ? 'bg-primary' : 'bg-neutral'"
                ></div>
                <div
                  class="mb-1 font-medium"
                  :class="
                    bookingDetails.status === 'Completed' ? 'text-neutral-dark' : 'text-neutral'
                  "
                >
                  预约完成
                </div>
                <div class="text-sm text-neutral-dark">
                  {{ bookingDetails.status === 'Completed' ? '已完成' : '等待中' }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 右侧联系信息和备注 -->
        <div class="md:col-span-1">
          <div class="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 class="text-xl font-semibold text-neutral-dark mb-4">摄影师信息</h2>
            <div class="flex items-center mb-4">
              <div class="w-16 h-16 bg-neutral-light rounded-full mr-4 flex-shrink-0">
                <!-- 这里可以添加摄影师头像 -->
              </div>
              <div>
                <div class="font-medium text-primary">{{ bookingDetails.photographerName }}</div>
                <div class="text-sm text-neutral-dark mt-1">专业摄影师</div>
              </div>
            </div>
            <div class="mt-4">
              <router-link
                :to="`/photographer/${bookingDetails.photographerId}`"
                class="text-primary hover:text-green-dark text-sm"
              >
                查看摄影师主页
              </router-link>
            </div>
          </div>

          <!-- 天气提醒 - 如果是户外拍摄可能有用 -->
          <div v-if="isOutdoorShoot" class="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 class="text-lg font-semibold text-neutral-dark mb-2">拍摄日天气预报</h2>
            <p class="text-sm text-neutral-dark mb-4">
              室外拍摄受天气影响较大，建议提前关注天气状况。
            </p>
            <div class="flex justify-center">
              <a
                :href="`https://weather.com/zh-CN/weather/tenday/l/${bookingDetails.location}`"
                target="_blank"
                class="px-4 py-2 bg-neutral-light text-neutral-dark rounded-md hover:bg-neutral transition-colors text-sm"
              >
                查看拍摄地点天气
              </a>
            </div>
          </div>

          <!-- 预约提醒 -->
          <div class="bg-white rounded-lg shadow-md p-6">
            <h2 class="text-lg font-semibold text-neutral-dark mb-2">预约提醒</h2>
            <ul class="text-sm text-neutral-dark space-y-2">
              <li class="flex items-start">
                <span class="text-primary mr-2">•</span>
                请提前15分钟到达拍摄地点
              </li>
              <li class="flex items-start">
                <span class="text-primary mr-2">•</span>
                带好个人证件和所需物品
              </li>
              <li class="flex items-start">
                <span class="text-primary mr-2">•</span>
                如需更改预约，请提前24小时联系摄影师
              </li>
              <li class="flex items-start">
                <span class="text-primary mr-2">•</span>
                拍摄成果将在拍摄完成后7个工作日内交付
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import apiClient from '../services/apiService'

export default defineComponent({
  name: 'PhotographyBookingDetailView',
  setup() {
    const route = useRoute()
    const router = useRouter()

    const bookingId = ref(route.params.id as string)
    const bookingDetails = ref<any>(null)
    const loading = ref(true)
    const error = ref('')

    // 计算属性 - 是否是户外拍摄
    const isOutdoorShoot = computed(() => {
      if (!bookingDetails.value) return false
      const location = bookingDetails.value.location?.toLowerCase() || ''
      const requirements = bookingDetails.value.requirements?.toLowerCase() || ''

      const outdoorKeywords = [
        '户外',
        '公园',
        '海边',
        '沙滩',
        '花海',
        '山',
        '湖',
        '外景',
        'outdoor',
      ]

      return outdoorKeywords.some(
        (keyword) => location.includes(keyword) || requirements.includes(keyword),
      )
    })

    // 获取预约状态对应的CSS类
    const getStatusClass = (status: string): string => {
      switch (status) {
        case 'Pending':
          return 'bg-yellow-100 text-yellow-800'
        case 'Processing':
          return 'bg-blue-100 text-blue-800'
        case 'Completed':
          return 'bg-green-100 text-green-800'
        case 'Cancelled':
          return 'bg-red-100 text-red-800'
        default:
          return 'bg-neutral-light text-neutral-dark'
      }
    }

    // 获取预约状态对应的文字
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

    // 获取预约详情
    const fetchBookingDetails = async () => {
      loading.value = true
      error.value = ''

      try {
        console.log(`正在获取摄影预约详情，预约ID: ${bookingId.value}`)
        const response = await apiClient.get(`/Booking/${bookingId.value}`)
        bookingDetails.value = response.data
        console.log('获取到预约详情:', bookingDetails.value)
      } catch (err: any) {
        console.error('获取预约详情失败:', err)
        error.value = '获取预约详情失败，请稍后再试'
      } finally {
        loading.value = false
      }
    }

    // 取消预约
    const cancelBooking = async () => {
      if (!bookingDetails.value) return

      if (confirm('确定要取消该预约吗？')) {
        try {
          await apiClient.post(`/Booking/${bookingId.value}/cancel`)
          alert('预约已成功取消')
          fetchBookingDetails() // 刷新预约数据
        } catch (err) {
          console.error('取消预约失败:', err)
          alert('取消预约失败，请稍后再试')
        }
      }
    }

    // 查看照片集
    const viewAlbum = () => {
      if (bookingDetails.value && bookingDetails.value.albumId) {
        router.push(`/album/${bookingDetails.value.albumId}`)
      } else {
        alert('照片集尚未创建或不可访问')
      }
    }

    onMounted(() => {
      fetchBookingDetails()
    })

    return {
      bookingDetails,
      loading,
      error,
      isOutdoorShoot,
      getStatusClass,
      getStatusText,
      formatDate,
      fetchBookingDetails,
      cancelBooking,
      viewAlbum,
    }
  },
})
</script>
