<template>
  <div class="bg-neutral min-h-screen pb-10">
    <!-- 页面标题区域 -->
    <div class="bg-primary text-white px-6 py-4 shadow-md">
      <div class="container mx-auto">
        <div class="flex justify-between items-center">
          <div>
            <h1 class="text-2xl font-bold">修图服务</h1>
            <p class="text-sm text-green-light mt-1">
              寻找专业的修图师，为您的照片提供专业修饰服务
            </p>
          </div>
          <router-link
            to="/profile"
            class="px-4 py-2 bg-white text-primary rounded-md hover:bg-green-light transition-colors"
          >
            返回个人资料
          </router-link>
        </div>
      </div>
    </div>

    <!-- 搜索和筛选区域 -->
    <div class="container mx-auto px-4 pt-8">
      <div class="bg-white rounded-lg shadow-md p-6 mb-8">
        <div class="flex flex-col md:flex-row md:items-center md:space-x-4 mb-5">
          <!-- 搜索框 -->
          <div class="flex-grow mb-4 md:mb-0">
            <div class="relative">
              <input
                type="text"
                v-model="searchQuery"
                placeholder="搜索修图师姓名或描述..."
                class="w-full pl-10 pr-4 py-2 border border-neutral rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                @keyup.enter="searchRetouchers"
              />
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center">
                <svg
                  class="h-5 w-5 text-neutral-dark"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>
          </div>
          <!-- 搜索按钮 -->
          <button
            @click="searchRetouchers"
            class="bg-primary text-white py-2 px-6 rounded-md hover:bg-green-dark transition-colors"
          >
            搜索
          </button>
        </div>

        <!-- 价格区间筛选 -->
        <div>
          <div class="flex items-center mb-2">
            <h3 class="text-neutral-dark mr-2">价格区间:</h3>
            <div class="flex items-center space-x-2">
              <input
                type="number"
                v-model.number="minPrice"
                min="0"
                placeholder="最低价格"
                class="w-24 px-3 py-1 border border-neutral rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <span class="text-neutral-dark">至</span>
              <input
                type="number"
                v-model.number="maxPrice"
                min="0"
                placeholder="最高价格"
                class="w-24 px-3 py-1 border border-neutral rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button
                @click="applyPriceFilter"
                class="ml-2 px-3 py-1 bg-primary text-white text-sm rounded-md hover:bg-green-dark transition-colors"
              >
                应用
              </button>
              <button
                v-if="isPriceFilterActive"
                @click="clearPriceFilter"
                class="px-3 py-1 bg-neutral text-neutral-dark text-sm rounded-md hover:bg-neutral-light transition-colors"
              >
                清除
              </button>
            </div>
          </div>
          <div v-if="isPriceFilterActive" class="text-xs text-primary">
            当前筛选: ¥{{ minPrice || 0 }} - ¥{{ maxPrice || '不限' }}
          </div>
        </div>
      </div>

      <!-- 结果展示区域 -->
      <div>
        <!-- 结果标题和排序 -->
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-xl font-semibold text-neutral-dark">
            <span v-if="isLoading">正在加载修图师...</span>
            <span v-else>找到 {{ retouchers.length }} 位修图师</span>
          </h2>
          <div class="flex items-center space-x-2">
            <span class="text-sm text-neutral-dark">排序方式:</span>
            <select
              v-model="sortOption"
              @change="sortRetouchers"
              class="border border-neutral rounded-md py-1 px-2 focus:outline-none focus:ring-2 focus:ring-primary text-sm"
            >
              <option value="price-low">价格从低到高</option>
              <option value="price-high">价格从高到低</option>
            </select>
          </div>
        </div>

        <!-- 加载中状态 -->
        <div v-if="isLoading" class="flex justify-center my-12">
          <div class="text-center">
            <div
              class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"
            ></div>
            <p class="mt-4 text-neutral-dark">正在加载修图师信息...</p>
          </div>
        </div>

        <!-- 无结果状态 -->
        <div
          v-else-if="retouchers.length === 0"
          class="bg-white rounded-lg shadow-md p-12 text-center"
        >
          <svg
            class="h-16 w-16 text-neutral mx-auto mb-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1"
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h3 class="text-lg font-semibold text-neutral-dark mb-2">没有找到符合条件的修图师</h3>
          <p class="text-neutral-dark">请尝试其他搜索条件或删除一些筛选条件以获得更多结果</p>
        </div>

        <!-- 修图师列表 -->
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <RetoucherCard
            v-for="retoucher in retouchers"
            :key="retoucher.id"
            :retoucher="retoucher"
            @select="selectRetoucher"
          />
        </div>

        <!-- 分页控制 -->
        <div class="mt-8 flex justify-center">
          <div class="inline-flex rounded-md shadow-sm">
            <button
              @click="prevPage"
              :disabled="currentPage === 1"
              class="px-3 py-2 border border-neutral rounded-l-md bg-white text-neutral-dark hover:bg-neutral-light disabled:opacity-50 disabled:cursor-not-allowed"
            >
              上一页
            </button>
            <div class="px-4 py-2 border-t border-b border-neutral bg-white text-primary">
              {{ currentPage }} / {{ totalPages }}
            </div>
            <button
              @click="nextPage"
              :disabled="currentPage === totalPages"
              class="px-3 py-2 border border-neutral rounded-r-md bg-white text-neutral-dark hover:bg-neutral-light disabled:opacity-50 disabled:cursor-not-allowed"
            >
              下一页
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { retoucherAPI } from '../services/apiService'
import RetoucherCard, { RetoucherCardData } from '../components/RetoucherCard.vue'

// 定义API返回的修图师数据接口
interface RetoucherData {
  retoucherId: number
  userId: number
  username: string
  firstName: string | null
  lastName: string | null
  bio: string
  expertise: string
  software: string
  pricePerPhoto: number
  isVerified: boolean
  verifiedAt: string
}

export default defineComponent({
  name: 'RetouchServiceView',
  components: {
    RetoucherCard,
  },
  setup() {
    const router = useRouter()
    const searchQuery = ref('')
    const sortOption = ref('price-low') // 默认排序改为按价格从低到高
    const isLoading = ref(true)
    const retouchers = ref<RetoucherCardData[]>([])

    // 价格筛选
    const minPrice = ref<number | null>(null)
    const maxPrice = ref<number | null>(null)
    const isPriceFilterActive = computed(() => minPrice.value !== null || maxPrice.value !== null)

    // 分页相关
    const currentPage = ref(1)
    const totalPages = ref(1)
    const pageSize = ref(12)

    // 应用价格筛选
    const applyPriceFilter = () => {
      // 验证价格区间
      if (minPrice.value !== null && maxPrice.value !== null && minPrice.value > maxPrice.value) {
        alert('最低价格不能高于最高价格')
        return
      }

      // 重置到第一页并搜索
      currentPage.value = 1
      fetchRetouchers()
    }

    // 清除价格筛选
    const clearPriceFilter = () => {
      minPrice.value = null
      maxPrice.value = null
      currentPage.value = 1
      fetchRetouchers()
    }

    // 搜索函数
    const searchRetouchers = () => {
      currentPage.value = 1
      fetchRetouchers()
    }

    // 排序函数
    const sortRetouchers = () => {
      // 对本地数据进行排序
      const sortMethod = sortOption.value
      retouchers.value.sort((a, b) => {
        if (sortMethod === 'price-low') {
          return a.price - b.price
        } else if (sortMethod === 'price-high') {
          return b.price - a.price
        }
        return 0
      })
    }

    // 分页控制
    const nextPage = () => {
      if (currentPage.value < totalPages.value) {
        currentPage.value++
        fetchRetouchers()
      }
    }

    const prevPage = () => {
      if (currentPage.value > 1) {
        currentPage.value--
        fetchRetouchers()
      }
    }

    // 选择修图师导航到用户详情页
    const selectRetoucher = (retoucher: RetoucherCardData) => {
      // 导航到上传照片页面，开始创建订单流程
      router.push({
        path: `/upload-photos`,
        query: {
          retoucherId: retoucher.id.toString(),
          returnTo: '/retouch-service', // 添加这个参数指定创建完成后的返回位置
        },
      })
    }

    // 获取修图师数据
    const fetchRetouchers = async () => {
      isLoading.value = true
      try {
        console.log('开始获取修图师数据')
        console.log('当前搜索条件:', {
          searchQuery: searchQuery.value,
          minPrice: minPrice.value,
          maxPrice: maxPrice.value,
        })

        // 使用新的V2接口，同时处理关键词和价格筛选
        const response = await retoucherAPI.searchRetouchersV2(
          searchQuery.value.trim(),
          minPrice.value || undefined,
          maxPrice.value || undefined,
        )

        console.log('API响应成功:', response.status)
        const retouchersData: RetoucherData[] = response.data
        console.log(`获取到${retouchersData.length}位修图师数据`)

        // 将API数据转换为UI需要的格式
        const transformedData: RetoucherCardData[] = retouchersData.map((r) => {
          // 生成完整名字或使用用户名
          const fullName = [r.firstName, r.lastName].filter(Boolean).join(' ') || r.username

          // 从expertise字段中提取分类
          const categories = r.expertise.split('、').map((item) => item.trim())

          return {
            id: r.retoucherId,
            userId: r.userId, // 保存userId
            name: fullName,
            price: r.pricePerPhoto,
            categories: categories,
            description: r.bio,
            coverImage: `https://avatars.dicebear.com/api/initials/${encodeURIComponent(r.username)}.svg`,
            experience: 'advanced', // 默认经验级别
          }
        })

        console.log(`转换后共有${transformedData.length}位修图师数据`)

        // 计算总页数
        totalPages.value = Math.max(1, Math.ceil(transformedData.length / pageSize.value))

        // 分页
        const start = (currentPage.value - 1) * pageSize.value
        const end = start + pageSize.value
        retouchers.value = transformedData.slice(start, end)

        // 应用排序
        sortRetouchers()
      } catch (error) {
        console.error('获取修图师数据失败:', error)
        // 增加更详细的错误信息
        if (axios.isAxiosError(error)) {
          console.error('API错误详情:', {
            status: error.response?.status,
            statusText: error.response?.statusText,
            data: error.response?.data,
            config: {
              url: error.config?.url,
              method: error.config?.method,
              params: error.config?.params,
            },
          })
        }
        retouchers.value = [] // 清空数据
        totalPages.value = 1
      } finally {
        isLoading.value = false
      }
    }

    // 组件挂载时获取数据
    onMounted(() => {
      fetchRetouchers()
    })

    return {
      searchQuery,
      sortOption,
      minPrice,
      maxPrice,
      isPriceFilterActive,
      retouchers,
      isLoading,
      currentPage,
      totalPages,
      searchRetouchers,
      applyPriceFilter,
      clearPriceFilter,
      sortRetouchers,
      nextPage,
      prevPage,
      selectRetoucher,
    }
  },
})
</script>
