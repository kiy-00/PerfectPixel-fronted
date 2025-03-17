<template>
  <div class="bg-neutral min-h-screen pb-10">
    <!-- 页面标题区域 -->
    <div class="bg-primary text-white px-6 py-4 shadow-md">
      <div class="container mx-auto">
        <div class="flex justify-between items-center">
          <div>
            <h1 class="text-2xl font-bold">修图订单详情</h1>
            <p class="text-sm text-green-light mt-1">查看修图订单的详细信息和处理进度</p>
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
          <p class="mt-4 text-neutral-dark">正在加载订单信息...</p>
        </div>
      </div>

      <!-- 错误状态 -->
      <div v-else-if="error" class="bg-white rounded-lg shadow-md p-6 text-center">
        <div class="text-error text-lg mb-3">加载失败</div>
        <p class="text-neutral-dark mb-6">{{ error }}</p>
        <button
          @click="fetchOrderDetails"
          class="px-4 py-2 bg-primary text-white rounded-md hover:bg-green-dark transition-colors"
        >
          重新加载
        </button>
      </div>

      <!-- 订单详情 -->
      <div v-else-if="orderDetails" class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <!-- 左侧订单信息 -->
        <div class="md:col-span-2">
          <div class="bg-white rounded-lg shadow-md p-6 mb-6">
            <div class="flex justify-between items-center mb-6">
              <h2 class="text-xl font-semibold text-neutral-dark">订单信息</h2>
              <div class="flex items-center">
                <span
                  :class="['px-3 py-1 text-sm rounded-full', getStatusClass(orderDetails.status)]"
                >
                  {{ getStatusText(orderDetails.status) }}
                </span>
                <span class="ml-2 text-sm text-neutral-dark"
                  >订单号: {{ orderDetails.orderId }}</span
                >
              </div>
            </div>

            <div class="border border-neutral rounded-md divide-y divide-neutral mb-6">
              <div class="flex p-4">
                <div class="w-1/3 text-neutral-dark font-medium">修图师</div>
                <div class="w-2/3 text-primary">{{ orderDetails.retoucherName }}</div>
              </div>
              <div class="flex p-4">
                <div class="w-1/3 text-neutral-dark font-medium">创建日期</div>
                <div class="w-2/3 text-neutral-dark">{{ formatDate(orderDetails.createdAt) }}</div>
              </div>
              <div class="flex p-4">
                <div class="w-1/3 text-neutral-dark font-medium">照片标题</div>
                <div class="w-2/3 text-neutral-dark">{{ orderDetails.photoTitle }}</div>
              </div>
              <div class="flex p-4">
                <div class="w-1/3 text-neutral-dark font-medium">修图要求</div>
                <div class="w-2/3 text-neutral-dark">{{ orderDetails.requirements }}</div>
              </div>
              <div class="flex p-4">
                <div class="w-1/3 text-neutral-dark font-medium">价格</div>
                <div class="w-2/3 text-primary font-semibold">¥{{ orderDetails.price }}</div>
              </div>
              <div v-if="orderDetails.completedAt" class="flex p-4">
                <div class="w-1/3 text-neutral-dark font-medium">完成日期</div>
                <div class="w-2/3 text-neutral-dark">
                  {{ formatDate(orderDetails.completedAt) }}
                </div>
              </div>
            </div>

            <!-- 订单操作按钮 -->
            <div class="flex justify-end space-x-4">
              <button
                v-if="orderDetails.status === 'Pending'"
                @click="cancelOrder"
                class="px-4 py-2 border border-red-500 text-red-500 rounded-md hover:bg-red-50 transition-colors"
              >
                取消订单
              </button>
              <button
                v-if="orderDetails.status === 'Completed'"
                @click="downloadResult"
                class="px-4 py-2 bg-primary text-white rounded-md hover:bg-green-dark transition-colors"
              >
                下载修图成品
              </button>
            </div>
          </div>

          <!-- 订单进度时间轴 -->
          <div class="bg-white rounded-lg shadow-md p-6">
            <h2 class="text-xl font-semibold text-neutral-dark mb-6">订单进度</h2>

            <div class="relative pl-8">
              <!-- 垂直线 -->
              <div class="absolute left-0 top-0 bottom-0 w-0.5 bg-neutral-light"></div>

              <!-- 创建订单 -->
              <div class="relative mb-6 pl-8">
                <div class="absolute left-0 -translate-x-1/2 w-4 h-4 rounded-full bg-primary"></div>
                <div class="mb-1 font-medium text-neutral-dark">订单创建</div>
                <div class="text-sm text-neutral-dark">
                  {{ formatDate(orderDetails.createdAt) }}
                </div>
              </div>

              <!-- 修图师接单 -->
              <div class="relative mb-6 pl-8">
                <div
                  class="absolute left-0 -translate-x-1/2 w-4 h-4 rounded-full"
                  :class="orderDetails.status !== 'Pending' ? 'bg-primary' : 'bg-neutral'"
                ></div>
                <div
                  class="mb-1 font-medium"
                  :class="orderDetails.status !== 'Pending' ? 'text-neutral-dark' : 'text-neutral'"
                >
                  修图师接单
                </div>
                <div class="text-sm text-neutral-dark">
                  {{ orderDetails.status !== 'Pending' ? '已接单' : '等待中' }}
                </div>
              </div>

              <!-- 修图中 -->
              <div class="relative mb-6 pl-8">
                <div
                  class="absolute left-0 -translate-x-1/2 w-4 h-4 rounded-full"
                  :class="
                    orderDetails.status === 'Processing' || orderDetails.status === 'Completed'
                      ? 'bg-primary'
                      : 'bg-neutral'
                  "
                ></div>
                <div
                  class="mb-1 font-medium"
                  :class="
                    orderDetails.status === 'Processing' || orderDetails.status === 'Completed'
                      ? 'text-neutral-dark'
                      : 'text-neutral'
                  "
                >
                  修图处理中
                </div>
                <div class="text-sm text-neutral-dark">
                  {{
                    orderDetails.status === 'Processing'
                      ? '进行中'
                      : orderDetails.status === 'Completed'
                        ? '已完成'
                        : '未开始'
                  }}
                </div>
              </div>

              <!-- 订单完成 -->
              <div class="relative pl-8">
                <div
                  class="absolute left-0 -translate-x-1/2 w-4 h-4 rounded-full"
                  :class="orderDetails.status === 'Completed' ? 'bg-primary' : 'bg-neutral'"
                ></div>
                <div
                  class="mb-1 font-medium"
                  :class="
                    orderDetails.status === 'Completed' ? 'text-neutral-dark' : 'text-neutral'
                  "
                >
                  订单完成
                </div>
                <div class="text-sm text-neutral-dark">
                  {{
                    orderDetails.status === 'Completed'
                      ? formatDate(orderDetails.completedAt)
                      : '等待中'
                  }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 右侧照片预览 -->
        <div class="md:col-span-1">
          <div class="bg-white rounded-lg shadow-md p-6">
            <h2 class="text-xl font-semibold text-neutral-dark mb-4">照片预览</h2>

            <div v-if="photoLoaded" class="space-y-4">
              <!-- 原图预览 -->
              <div>
                <h3 class="text-sm font-medium text-neutral-dark mb-2">原始照片</h3>
                <div class="border border-neutral rounded-lg overflow-hidden">
                  <img :src="photoUrl" :alt="orderDetails.photoTitle" class="w-full h-auto" />
                </div>
                <p class="mt-1 text-xs text-neutral-dark">{{ orderDetails.photoTitle }}</p>
              </div>

              <!-- 修图成品 - 仅在订单完成时显示 -->
              <div v-if="orderDetails.status === 'Completed'">
                <h3 class="text-sm font-medium text-neutral-dark mb-2">修图成品</h3>
                <div class="border border-neutral rounded-lg overflow-hidden">
                  <img
                    :src="resultPhotoUrl"
                    :alt="orderDetails.photoTitle + ' (修图后)'"
                    class="w-full h-auto"
                  />
                </div>
                <p class="mt-1 text-xs text-neutral-dark">{{ orderDetails.photoTitle }} (修图后)</p>
              </div>
            </div>

            <div v-else class="h-64 bg-neutral-light flex items-center justify-center rounded-lg">
              <p class="text-neutral-dark">加载照片中...</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import apiClient from '../services/apiService'

export default defineComponent({
  name: 'RetouchOrderDetailView',
  setup() {
    const route = useRoute()
    const router = useRouter()

    const orderId = ref(route.params.id as string)
    const orderDetails = ref<any>(null)
    const loading = ref(true)
    const error = ref('')

    // 照片相关
    const photoLoaded = ref(false)
    const photoUrl = ref('')
    const resultPhotoUrl = ref('')
    const retouchedPhotoLoaded = ref(false) // Add a ref to track retouched photo loading

    // 获取订单状态对应的CSS类
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

    // 获取订单状态对应的文字
    const getStatusText = (status: string): string => {
      switch (status) {
        case 'Pending':
          return '待处理'
        case 'Processing':
          return '处理中'
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

    // 获取订单详情
    const fetchOrderDetails = async () => {
      loading.value = true
      error.value = ''
      photoLoaded.value = false

      try {
        console.log(`正在获取修图订单详情，订单ID: ${orderId.value}`)
        const response = await apiClient.get(`/RetouchOrder/${orderId.value}`)
        orderDetails.value = response.data
        console.log('获取到订单详情:', orderDetails.value)

        // 获取照片URL
        await fetchPhotoUrl()

        if (orderDetails.value.status === 'Completed' && orderDetails.value.retouchedPhotoId) {
          await fetchRetouchedPhotoUrl()
        }
      } catch (err: any) {
        console.error('获取订单详情失败:', err)
        error.value = '获取订单详情失败，请稍后再试'
      } finally {
        loading.value = false
      }
    }

    // 获取照片URL
    const fetchPhotoUrl = async () => {
      if (!orderDetails.value || !orderDetails.value.photoId) return

      try {
        console.log(`正在获取照片信息，照片ID: ${orderDetails.value.photoId}`)
        const response = await apiClient.get(`/Photo/${orderDetails.value.photoId}`)
        console.log('获取到照片信息:', response.data)

        // 获取静态资源基础URL
        const staticAssetsUrl = import.meta.env.VITE_STATIC_ASSETS_URL || ''

        // 设置原始照片URL
        const imageUrl = response.data.imageUrl
        photoUrl.value = imageUrl.startsWith('http') ? imageUrl : `${staticAssetsUrl}${imageUrl}`

        photoLoaded.value = true
      } catch (err) {
        console.error('获取照片信息失败:', err)
        error.value = '获取照片信息失败，请稍后再试'
      }
    }

    // Fetch the retouched photo similarly to the original photo
    const fetchRetouchedPhotoUrl = async () => {
      try {
        console.log(`正在获取修图后照片信息，ID: ${orderDetails.value.retouchedPhotoId}`)
        const response = await apiClient.get(`/Photo/${orderDetails.value.retouchedPhotoId}`)
        console.log('修图后照片信息:', response.data)

        const staticAssetsUrl = import.meta.env.VITE_STATIC_ASSETS_URL || ''
        const imageUrl = response.data.imageUrl
        resultPhotoUrl.value = imageUrl.startsWith('http')
          ? imageUrl
          : `${staticAssetsUrl}${imageUrl}`

        retouchedPhotoLoaded.value = true
      } catch (err) {
        console.error('获取修图后照片失败:', err)
      }
    }

    // 取消订单
    const cancelOrder = async () => {
      if (!orderDetails.value) return

      if (confirm('确定要取消该订单吗？')) {
        try {
          await apiClient.post(`/RetouchOrder/${orderId.value}/cancel`)
          alert('订单已成功取消')
          fetchOrderDetails() // 刷新订单数据
        } catch (err) {
          console.error('取消订单失败:', err)
          alert('取消订单失败，请稍后再试')
        }
      }
    }

    // 下载修图结果
    const downloadResult = () => {
      if (resultPhotoUrl.value) {
        window.open(resultPhotoUrl.value, '_blank')
      }
    }

    onMounted(() => {
      fetchOrderDetails()
    })

    return {
      orderDetails,
      loading,
      error,
      photoLoaded,
      photoUrl,
      resultPhotoUrl,
      getStatusClass,
      getStatusText,
      formatDate,
      fetchOrderDetails,
      cancelOrder,
      downloadResult,
    }
  },
})
</script>
