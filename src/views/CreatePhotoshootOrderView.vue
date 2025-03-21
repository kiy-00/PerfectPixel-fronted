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

                  <!-- 服务选择 - 修改为预设服务项列表 -->
                  <div>
                    <div class="mb-3">
                      <label class="block text-sm font-medium text-neutral-dark mb-3"
                        >选择服务项目 <span class="text-error">*</span></label
                      >

                      <!-- 基础套餐 -->
                      <div
                        class="mb-4 p-4 border border-primary rounded-md bg-green-light bg-opacity-10"
                      >
                        <div class="flex items-center mb-2">
                          <input
                            type="checkbox"
                            id="baseService"
                            checked
                            disabled
                            class="h-4 w-4 text-primary border-neutral rounded focus:ring-primary"
                          />
                          <label for="baseService" class="ml-2 font-semibold">基础服务</label>
                          <span class="ml-auto font-semibold text-primary">¥{{ basePrice }}</span>
                        </div>
                        <p class="text-sm text-neutral-dark ml-6">
                          包含基础拍摄服务，{{ bookingForm.photoCount }}张照片的简单修图。
                        </p>
                      </div>

                      <!-- 可选服务列表 -->
                      <div class="space-y-3">
                        <div
                          v-for="(service, index) in availableServices"
                          :key="index"
                          class="p-4 border border-neutral rounded-md hover:border-primary transition-colors"
                        >
                          <div class="flex items-center mb-2">
                            <input
                              type="checkbox"
                              :id="`service-${index}`"
                              v-model="service.selected"
                              class="h-4 w-4 text-primary border-neutral rounded focus:ring-primary"
                            />
                            <label :for="`service-${index}`" class="ml-2 font-medium">{{
                              service.serviceName
                            }}</label>
                            <span class="ml-auto font-semibold text-primary"
                              >+¥{{ service.price }}</span
                            >
                          </div>
                          <p class="text-sm text-neutral-dark ml-6">{{ service.description }}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- 总价 -->
                  <div class="pt-4 border-t border-neutral">
                    <div class="flex justify-between items-center">
                      <span class="text-lg font-medium text-neutral-dark">总价:</span>
                      <span class="text-xl font-bold text-primary">¥{{ totalPrice }}</span>
                    </div>
                    <p class="text-sm text-neutral-dark mt-2">
                      包含基础服务 (¥{{ basePrice }})
                      <span v-if="selectedServicesCount > 0">
                        及 {{ selectedServicesCount }} 项附加服务
                      </span>
                    </p>
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
import { defineComponent, ref, computed, onMounted, watch } from 'vue'
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

// 可选服务项目接口
interface AvailableService extends BookingService {
  selected: boolean
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

    // 预设的可选服务项目
    const availableServices = ref<AvailableService[]>([
      {
        serviceName: '增加额外5张照片',
        description: '在基础拍摄数量基础上增加5张照片的拍摄和修图',
        price: 200,
        selected: false,
      },
      {
        serviceName: '增加拍摄场景',
        description: '在原有场景基础上，增加一个不同风格的拍摄场景',
        price: 300,
        selected: false,
      },
      {
        serviceName: '化妆服务',
        description: '专业化妆师提供的妆容服务，包含一次造型',
        price: 400,
        selected: false,
      },
      {
        serviceName: '服装租赁',
        description: '提供1-2套拍摄服装的租赁，根据拍摄主题选择',
        price: 350,
        selected: false,
      },
      {
        serviceName: '精修照片',
        description: '针对所有照片进行精细修图，包括肤色调整、瑕疵处理等',
        price: 500,
        selected: false,
      },
      {
        serviceName: '加急处理',
        description: '照片处理时间缩短一半，优先完成',
        price: 250,
        selected: false,
      },
      {
        serviceName: '实体相册制作',
        description: '精选照片制作精美实体相册，赠送电子版',
        price: 600,
        selected: false,
      },
    ])

    // 预约表单数据
    const bookingForm = ref({
      photographerId: photographerId,
      bookingDate: formatDateForInput(addDays(new Date(), 3)), // 默认为3天后
      location: '',
      requirements: '',
      photoCount: 20,
    })

    // 基础价格 - 使用摄影师的最低价
    const basePrice = computed(() => {
      return photographerInfo.value.priceRangeMin || 300
    })

    // 选中的服务项数量
    const selectedServicesCount = computed(() => {
      return availableServices.value.filter((service) => service.selected).length
    })

    // 计算总价
    const totalPrice = computed(() => {
      // 基础价格 + 所有选中的额外服务价格
      const addonsPrice = availableServices.value
        .filter((service) => service.selected)
        .reduce((total, service) => total + service.price, 0)

      return basePrice.value + addonsPrice
    })

    // 获取最终提交的服务列表
    const getSelectedServices = (): BookingService[] => {
      const services: BookingService[] = [
        {
          serviceName: '基础拍摄套餐',
          description: `包含基本拍摄及简单修图，${bookingForm.value.photoCount}张照片`,
          price: basePrice.value,
        },
      ]

      // 添加选中的额外服务
      availableServices.value
        .filter((service) => service.selected)
        .forEach((service) => {
          services.push({
            serviceName: service.serviceName,
            description: service.description,
            price: service.price,
          })
        })

      return services
    }

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

    // 提交预约
    const submitBooking = async () => {
      try {
        isSubmitting.value = true

        // 准备提交数据
        const bookingData = {
          photographerId: bookingForm.value.photographerId,
          bookingDate: new Date(bookingForm.value.bookingDate).toISOString(),
          location: bookingForm.value.location,
          requirements: bookingForm.value.requirements,
          photoCount: bookingForm.value.photoCount,
          services: getSelectedServices(), // 获取所有选中的服务
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
      basePrice,
      totalPrice,
      availableServices,
      selectedServicesCount,
      isLoading,
      isSubmitting,
      error,
      submitBooking,
      goBack,
    }
  },
})
</script>
