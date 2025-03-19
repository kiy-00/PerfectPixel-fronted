<template>
  <div class="flex h-screen bg-neutral">
    <!-- 侧边栏 -->
    <SideBar class="hidden md:block" />

    <!-- 主要内容 -->
    <div class="flex-1 flex flex-col overflow-hidden">
      <!-- 页面标题区域 -->
      <div class="bg-primary text-white px-6 py-4 shadow-md">
        <div class="container mx-auto">
          <div class="flex justify-between items-center">
            <div>
              <h1 class="text-2xl font-bold">约拍预约</h1>
              <p class="text-sm text-green-light mt-1">预约专业摄影师的拍摄服务</p>
            </div>
            <button
              @click="goBack"
              class="px-4 py-2 bg-white text-primary rounded-md hover:bg-green-light transition-colors"
            >
              返回
            </button>
          </div>
        </div>
      </div>

      <!-- 滚动内容区域 -->
      <div class="flex-1 overflow-y-auto">
        <div class="container mx-auto px-4 py-8">
          <!-- 加载中状态 -->
          <div v-if="isLoading" class="flex justify-center my-12">
            <div class="text-center">
              <div
                class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"
              ></div>
              <p class="mt-4 text-neutral-dark">正在加载摄影师信息...</p>
            </div>
          </div>

          <!-- 错误提示 -->
          <div v-else-if="error" class="bg-white rounded-lg shadow-md p-8 text-center">
            <div class="text-error text-xl mb-4">出错了</div>
            <p class="text-neutral-dark mb-6">{{ error }}</p>
            <button @click="goBack" class="px-4 py-2 bg-primary text-white rounded-md">
              返回上一页
            </button>
          </div>

          <!-- 表单内容 -->
          <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <!-- 左侧摄影师信息 -->
            <div class="md:col-span-1">
              <!-- 摄影师卡片 -->
              <div class="bg-white rounded-lg shadow-md overflow-hidden">
                <div class="h-48 bg-neutral-light">
                  <img
                    :src="'/images/photographer/cat.jpg'"
                    :alt="photographerInfo.name"
                    class="w-full h-full object-cover"
                  />
                </div>
                <div class="p-5">
                  <h3 class="text-xl font-semibold text-neutral-dark mb-2">
                    {{ photographerInfo.name }}
                  </h3>
                  <div class="mb-4">
                    <div class="flex flex-wrap gap-2 mb-3">
                      <span
                        v-for="(category, idx) in photographerInfo.categories"
                        :key="idx"
                        class="px-2 py-1 bg-green-light bg-opacity-20 text-primary text-xs rounded-md"
                      >
                        {{ category }}
                      </span>
                    </div>
                    <p class="text-sm text-neutral-dark mb-3">{{ photographerInfo.bio }}</p>
                    <div class="flex items-center text-sm text-neutral-dark mb-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-4 w-4 mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      {{ photographerInfo.location || '未知地区' }}
                    </div>
                  </div>
                  <div class="flex justify-between items-center py-3 border-t border-neutral">
                    <span class="text-neutral-dark">价格区间</span>
                    <span class="font-semibold text-primary"
                      >¥{{ photographerInfo.priceRangeMin }} - ¥{{
                        photographerInfo.priceRangeMax
                      }}</span
                    >
                  </div>
                </div>
              </div>
            </div>

            <!-- 右侧预约表单 -->
            <div class="md:col-span-2">
              <div class="bg-white rounded-lg shadow-md p-6">
                <h2 class="text-xl font-semibold text-neutral-dark mb-6">预约信息</h2>

                <form @submit.prevent="submitBooking" class="space-y-6">
                  <!-- 预约日期 -->
                  <div>
                    <label
                      for="bookingDate"
                      class="block text-sm font-medium text-neutral-dark mb-1"
                      >预约日期 <span class="text-error">*</span></label
                    >
                    <input
                      type="datetime-local"
                      id="bookingDate"
                      v-model="bookingForm.bookingDate"
                      required
                      class="w-full px-3 py-2 border border-neutral rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <!-- 拍摄地点 -->
                  <div>
                    <label for="location" class="block text-sm font-medium text-neutral-dark mb-1"
                      >拍摄地点 <span class="text-error">*</span></label
                    >
                    <input
                      type="text"
                      id="location"
                      v-model="bookingForm.location"
                      required
                      placeholder="请输入具体的拍摄地点"
                      class="w-full px-3 py-2 border border-neutral rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <!-- 预计拍摄数量 -->
                  <div>
                    <label for="photoCount" class="block text-sm font-medium text-neutral-dark mb-1"
                      >预计拍摄照片数量 <span class="text-error">*</span></label
                    >
                    <input
                      type="number"
                      id="photoCount"
                      v-model.number="bookingForm.photoCount"
                      min="1"
                      required
                      class="w-full px-3 py-2 border border-neutral rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <!-- 拍摄需求 -->
                  <div>
                    <label
                      for="requirements"
                      class="block text-sm font-medium text-neutral-dark mb-1"
                      >拍摄需求 <span class="text-error">*</span></label
                    >
                    <textarea
                      id="requirements"
                      v-model="bookingForm.requirements"
                      rows="4"
                      required
                      placeholder="请详细描述您的拍摄需求、期望风格等"
                      class="w-full px-3 py-2 border border-neutral rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    ></textarea>
                  </div>

                  <!-- 服务选择 -->
                  <div>
                    <div class="flex justify-between items-center mb-3">
                      <label class="block text-sm font-medium text-neutral-dark"
                        >选择服务项目 <span class="text-error">*</span></label
                      >
                      <button
                        type="button"
                        @click="addService"
                        class="text-sm text-primary flex items-center"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          class="h-4 w-4 mr-1"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M12 4v16m8-8H4"
                          />
                        </svg>
                        添加服务
                      </button>
                    </div>

                    <!-- 服务列表 -->
                    <div v-if="bookingForm.services.length > 0" class="space-y-4">
                      <div
                        v-for="(service, index) in bookingForm.services"
                        :key="index"
                        class="p-4 border border-neutral rounded-md"
                      >
                        <div class="flex justify-between mb-2">
                          <h3 class="font-medium text-neutral-dark">服务项 #{{ index + 1 }}</h3>
                          <button
                            type="button"
                            @click="removeService(index)"
                            class="text-error hover:text-red-600"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              class="h-5 w-5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </button>
                        </div>
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
                          <div class="md:col-span-1">
                            <label class="text-xs text-neutral-dark mb-1 block">服务名称</label>
                            <input
                              type="text"
                              v-model="service.serviceName"
                              required
                              placeholder="例如：基本拍摄"
                              class="w-full px-2 py-1 border border-neutral rounded-md text-sm"
                            />
                          </div>
                          <div class="md:col-span-1">
                            <label class="text-xs text-neutral-dark mb-1 block">价格 (¥)</label>
                            <input
                              type="number"
                              v-model.number="service.price"
                              min="0"
                              required
                              class="w-full px-2 py-1 border border-neutral rounded-md text-sm"
                            />
                          </div>
                          <div class="md:col-span-3">
                            <label class="text-xs text-neutral-dark mb-1 block">服务说明</label>
                            <input
                              type="text"
                              v-model="service.description"
                              placeholder="服务内容简要描述"
                              class="w-full px-2 py-1 border border-neutral rounded-md text-sm"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div
                      v-else
                      class="text-center border border-dashed border-neutral rounded-md p-6"
                    >
                      <p class="text-neutral-dark mb-2">请添加至少一项服务</p>
                      <button
                        type="button"
                        @click="addDefaultServices"
                        class="text-primary hover:text-green-dark"
                      >
                        添加默认服务项
                      </button>
                    </div>
                  </div>

                  <!-- 总价 -->
                  <div class="pt-4 border-t border-neutral">
                    <div class="flex justify-between items-center">
                      <span class="text-lg font-medium text-neutral-dark">总价:</span>
                      <span class="text-xl font-bold text-primary">¥{{ totalPrice }}</span>
                    </div>
                  </div>

                  <!-- 提交按钮 -->
                  <div class="pt-4">
                    <button
                      type="submit"
                      class="w-full py-3 bg-primary text-white rounded-md hover:bg-green-dark transition-colors"
                      :disabled="isSubmitting"
                    >
                      <span v-if="isSubmitting">
                        <svg
                          class="animate-spin h-5 w-5 text-white inline-block mr-2"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            class="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            stroke-width="4"
                          ></circle>
                          <path
                            class="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        提交中...
                      </span>
                      <span v-else>提交预约</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import SideBar from '../components/SideBar.vue'
import { photographerAPI } from '../services/apiService'
import apiClient from '../services/apiService'

// 服务项目接口
interface BookingService {
  serviceName: string
  description: string
  price: number
}

// 摄影师信息接口
interface PhotographerInfo {
  id: number
  name: string
  bio: string
  categories: string[]
  location: string
  priceRangeMin: number
  priceRangeMax: number
}

export default defineComponent({
  name: 'CreatePhotoshootOrderView',
  components: {
    SideBar,
  },
  setup() {
    const route = useRoute()
    const router = useRouter()

    // 从路由参数中获取摄影师ID
    const photographerId = Number(route.query.photographerId) || 0

    // 错误和加载状态
    const error = ref('')
    const isLoading = ref(true)
    const isSubmitting = ref(false)

    // 摄影师信息
    const photographerInfo = ref<PhotographerInfo>({
      id: photographerId,
      name: '加载中...',
      bio: '',
      categories: [],
      location: '',
      priceRangeMin: 0,
      priceRangeMax: 0,
    })

    // 预约表单数据
    const bookingForm = ref({
      photographerId: photographerId,
      bookingDate: formatDateForInput(addDays(new Date(), 3)), // 默认为3天后
      location: '',
      requirements: '',
      photoCount: 20,
      services: [] as BookingService[],
    })

    // 计算总价
    const totalPrice = computed(() => {
      return bookingForm.value.services.reduce((total, service) => total + service.price, 0)
    })

    // 获取摄影师信息
    const fetchPhotographerInfo = async () => {
      if (!photographerId) {
        error.value = '未指定摄影师ID，无法创建预约'
        isLoading.value = false
        return
      }

      try {
        isLoading.value = true
        const response = await photographerAPI.getPhotographerById(photographerId)
        const data = response.data

        // 更新摄影师信息
        photographerInfo.value = {
          id: data.photographerId,
          name: [data.firstName, data.lastName].filter(Boolean).join(' ') || data.username,
          bio: data.bio || '暂无简介',
          categories: data.specialties
            ? data.specialties.split(',').map((s: string) => s.trim())
            : [],
          location: data.location || '',
          priceRangeMin: data.priceRangeMin || 0,
          priceRangeMax: data.priceRangeMax || 0,
        }

        // 默认设置地点
        if (data.location) {
          bookingForm.value.location = data.location
        }

        isLoading.value = false
      } catch (err) {
        console.error('获取摄影师信息失败:', err)
        error.value = '获取摄影师信息失败，请稍后再试'
        isLoading.value = false
      }
    }

    // 添加服务项目
    const addService = () => {
      bookingForm.value.services.push({
        serviceName: '',
        description: '',
        price: 0,
      })
    }

    // 添加默认服务
    const addDefaultServices = () => {
      const minPrice = photographerInfo.value.priceRangeMin
      bookingForm.value.services = [
        {
          serviceName: '基础拍摄套餐',
          description: '包含基本拍摄及简单修图',
          price: minPrice,
        },
      ]
    }

    // 删除服务项目
    const removeService = (index: number) => {
      bookingForm.value.services.splice(index, 1)
    }

    // 提交预约
    const submitBooking = async () => {
      // 表单验证
      if (bookingForm.value.services.length === 0) {
        alert('请至少添加一项服务')
        return
      }

      try {
        isSubmitting.value = true

        // 准备提交数据
        const bookingData = {
          photographerId: bookingForm.value.photographerId,
          bookingDate: new Date(bookingForm.value.bookingDate).toISOString(),
          location: bookingForm.value.location,
          requirements: bookingForm.value.requirements,
          photoCount: bookingForm.value.photoCount,
          services: bookingForm.value.services,
        }

        // 发送请求
        const response = await apiClient.post('/Booking', bookingData)

        // 跳转到成功页面
        router.push({
          path: '/order-success',
          query: {
            orderType: 'photoshoot',
            orderId: response.data.bookingId?.toString(),
            photographer: photographerInfo.value.name,
            date: formatBookingDate(bookingForm.value.bookingDate),
          },
        })
      } catch (err: any) {
        console.error('提交预约失败:', err)
        let errorMsg = '预约提交失败，请稍后再试'
        if (err.response?.data?.message) {
          errorMsg = err.response.data.message
        }
        alert(errorMsg)
        isSubmitting.value = false
      }
    }

    // 返回上一页
    const goBack = () => {
      router.back()
    }

    // 帮助函数：格式化日期到HTML日期时间输入框格式
    function formatDateForInput(date: Date): string {
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      const hours = String(date.getHours()).padStart(2, '0')
      const minutes = String(date.getMinutes()).padStart(2, '0')

      return `${year}-${month}-${day}T${hours}:${minutes}`
    }

    // 帮助函数：添加天数
    function addDays(date: Date, days: number): Date {
      const result = new Date(date)
      result.setDate(date.getDate() + days)
      return result
    }

    // 格式化日期显示
    function formatBookingDate(dateString: string): string {
      const date = new Date(dateString)
      return date.toLocaleString('zh-CN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    }

    onMounted(() => {
      fetchPhotographerInfo()
    })

    return {
      photographerInfo,
      bookingForm,
      totalPrice,
      isLoading,
      isSubmitting,
      error,
      addService,
      removeService,
      submitBooking,
      goBack,
      addDefaultServices,
    }
  },
})
</script>
