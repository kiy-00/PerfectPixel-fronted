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
              <h1 class="text-2xl font-bold">摄影服务</h1>
              <p class="text-sm text-green-light mt-1">寻找专业的摄影师，为您提供专业的拍摄服务</p>
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

      <!-- 滚动内容区域 -->
      <div class="flex-1 overflow-y-auto">
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
                    placeholder="搜索摄影师姓名或描述..."
                    class="w-full pl-10 pr-4 py-2 border border-neutral rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    @keyup.enter="searchPhotographers"
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
                @click="searchPhotographers"
                class="bg-primary text-white py-2 px-6 rounded-md hover:bg-green-dark transition-colors"
              >
                搜索
              </button>
            </div>

            <!-- 高级筛选区域 -->
            <div class="flex flex-col md:flex-row justify-between items-start mb-4">
              <!-- 价格区间筛选 -->
              <div class="w-full md:w-1/2 mb-4 md:mb-0">
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
                  </div>
                </div>
                <div v-if="isPriceFilterActive" class="text-xs text-primary">
                  当前价格筛选: ¥{{ minPrice || 0 }} - ¥{{ maxPrice || '不限' }}
                </div>
              </div>

              <!-- 地点筛选 -->
              <div class="w-full md:w-1/2">
                <div class="flex items-center mb-2">
                  <h3 class="text-neutral-dark mr-2">地点:</h3>
                  <div class="flex items-center space-x-2">
                    <input
                      type="text"
                      v-model="locationFilter"
                      placeholder="输入城市名称"
                      class="w-40 px-3 py-1 border border-neutral rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>
                <div v-if="locationFilter" class="text-xs text-primary">
                  当前地点筛选: {{ locationFilter }}
                </div>
              </div>
            </div>

            <!-- 筛选按钮 -->
            <div class="flex justify-end mt-2">
              <button
                @click="applyFilters"
                class="px-4 py-2 bg-primary text-white text-sm rounded-md hover:bg-green-dark transition-colors"
              >
                应用筛选
              </button>
              <button
                v-if="isAnyFilterActive"
                @click="clearFilters"
                class="ml-2 px-4 py-2 bg-neutral text-neutral-dark text-sm rounded-md hover:bg-neutral-light transition-colors"
              >
                清除筛选
              </button>
            </div>
          </div>

          <!-- 结果展示区域 -->
          <div>
            <!-- 结果标题和排序 -->
            <div class="flex justify-between items-center mb-6">
              <h2 class="text-xl font-semibold text-neutral-dark">
                <span v-if="isLoading">正在加载摄影师...</span>
                <span v-else>找到 {{ photographers.length }} 位摄影师</span>
              </h2>
              <div class="flex items-center space-x-2">
                <span class="text-sm text-neutral-dark">排序方式:</span>
                <select
                  v-model="sortOption"
                  @change="sortPhotographers"
                  class="border border-neutral rounded-md py-1 px-2 focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                >
                  <option value="price-low">价格从低到高</option>
                  <option value="price-high">价格从高到低</option>
                  <option value="rating">按评分排序</option>
                </select>
              </div>
            </div>

            <!-- 加载中状态 -->
            <div v-if="isLoading" class="flex justify-center my-12">
              <div class="text-center">
                <div
                  class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"
                ></div>
                <p class="mt-4 text-neutral-dark">正在加载摄影师信息...</p>
              </div>
            </div>

            <!-- 无结果状态 -->
            <div
              v-else-if="photographers.length === 0"
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
              <h3 class="text-lg font-semibold text-neutral-dark mb-2">没有找到符合条件的摄影师</h3>
              <p class="text-neutral-dark">请尝试其他搜索条件或删除一些筛选条件以获得更多结果</p>
            </div>

            <!-- 摄影师列表 -->
            <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <div
                v-for="photographer in photographers"
                :key="photographer.id"
                class="bg-white rounded-lg shadow-md overflow-hidden"
              >
                <div class="h-48 bg-neutral-light relative">
                  <img
                    :src="photographer.coverImage"
                    :alt="photographer.name"
                    class="w-full h-full object-cover"
                  />
                  <div
                    v-if="photographer.location"
                    class="absolute top-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded"
                  >
                    {{ photographer.location }}
                  </div>
                </div>
                <div class="p-4">
                  <div class="flex justify-between items-start">
                    <h3 class="text-lg font-semibold text-primary">{{ photographer.name }}</h3>
                    <div class="bg-primary-light text-primary font-bold px-2 py-1 rounded text-sm">
                      ¥{{ photographer.priceRangeMin }} - {{ photographer.priceRangeMax }}
                    </div>
                  </div>
                  <div class="flex mt-2">
                    <div
                      v-for="(category, idx) in photographer.categories.slice(0, 3)"
                      :key="idx"
                      class="mr-1 px-2 py-1 bg-green-light bg-opacity-20 text-primary text-xs rounded-md"
                    >
                      {{ category }}
                    </div>
                    <div
                      v-if="photographer.categories.length > 3"
                      class="px-2 py-1 text-neutral-dark text-xs"
                    >
                      +{{ photographer.categories.length - 3 }}
                    </div>
                  </div>
                  <p class="mt-2 text-sm text-neutral-dark line-clamp-2">
                    {{ photographer.description }}
                  </p>
                  <button
                    @click="selectPhotographer(photographer)"
                    class="mt-4 w-full py-2 bg-primary text-white rounded-md hover:bg-green-dark transition-colors"
                  >
                    查看详情
                  </button>
                </div>
              </div>
            </div>

            <!-- 分页控制 -->
            <div v-if="photographers.length > 0" class="mt-8 flex justify-center">
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
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { photographerAPI } from '../services/apiService'
import SideBar from '../components/SideBar.vue'

// 定义API返回的摄影师数据接口
interface PhotographerData {
  photographerId: number
  userId: number
  username: string
  firstName: string | null
  lastName: string | null
  bio: string
  specialties: string
  experience: string
  location: string
  priceRangeMin: number
  priceRangeMax: number
  isVerified: boolean
  verifiedAt: string
}

// 展示卡片数据结构
interface PhotographerCardData {
  id: number
  userId: number
  name: string
  priceRangeMin: number
  priceRangeMax: number
  categories: string[]
  description: string
  coverImage: string
  location: string
  experience: string
}

export default defineComponent({
  name: 'PhotographyServiceView',
  components: {
    SideBar,
  },
  setup() {
    const router = useRouter()
    const searchQuery = ref('')
    const sortOption = ref('price-low') // 默认排序方式
    const isLoading = ref(true)
    const photographers = ref<PhotographerCardData[]>([])

    // 筛选条件
    const minPrice = ref<number | null>(null)
    const maxPrice = ref<number | null>(null)
    const locationFilter = ref('')

    // 计算是否有任何筛选条件激活
    const isPriceFilterActive = computed(() => minPrice.value !== null || maxPrice.value !== null)
    const isAnyFilterActive = computed(
      () => isPriceFilterActive.value || locationFilter.value !== '',
    )

    // 分页相关
    const currentPage = ref(1)
    const totalPages = ref(1)
    const pageSize = ref(12)

    // 应用所有筛选条件
    const applyFilters = () => {
      // 验证价格区间
      if (minPrice.value !== null && maxPrice.value !== null && minPrice.value > maxPrice.value) {
        alert('最低价格不能高于最高价格')
        return
      }

      // 重置到第一页并搜索
      currentPage.value = 1
      fetchPhotographers()
    }

    // 清除所有筛选
    const clearFilters = () => {
      minPrice.value = null
      maxPrice.value = null
      locationFilter.value = ''
      currentPage.value = 1
      fetchPhotographers()
    }

    // 搜索函数
    const searchPhotographers = () => {
      currentPage.value = 1
      fetchPhotographers()
    }

    // 排序函数
    const sortPhotographers = () => {
      const sortMethod = sortOption.value
      photographers.value.sort((a, b) => {
        if (sortMethod === 'price-low') {
          return a.priceRangeMin - b.priceRangeMin
        } else if (sortMethod === 'price-high') {
          return b.priceRangeMin - a.priceRangeMin
        }
        return 0
      })
    }

    // 分页控制
    const nextPage = () => {
      if (currentPage.value < totalPages.value) {
        currentPage.value++
        fetchPhotographers()
      }
    }

    const prevPage = () => {
      if (currentPage.value > 1) {
        currentPage.value--
        fetchPhotographers()
      }
    }

    // 选择摄影师进入详情页
    const selectPhotographer = (photographer: PhotographerCardData) => {
      router.push({
        path: `/user/${photographer.userId}`,
        query: { tab: 'photography' },
      })
    }

    // 获取摄影师数据
    const fetchPhotographers = async () => {
      isLoading.value = true
      try {
        console.log('开始获取摄影师数据')
        console.log('当前搜索条件:', {
          searchQuery: searchQuery.value,
          minPrice: minPrice.value,
          maxPrice: maxPrice.value,
          location: locationFilter.value,
        })

        // 假设API具有searchPhotographers方法，类似于修图师的搜索
        const response = await photographerAPI.searchPhotographers(searchQuery.value.trim(), {
          minPrice: minPrice.value || undefined,
          maxPrice: maxPrice.value || undefined,
          location: locationFilter.value || undefined,
        })

        console.log('API响应成功:', response.status)
        const photographersData: PhotographerData[] = response.data
        console.log(`获取到${photographersData.length}位摄影师数据`)

        // 将API数据转换为UI需要的格式
        const transformedData: PhotographerCardData[] = photographersData.map((p) => {
          // 生成完整名字或使用用户名
          const fullName = [p.firstName, p.lastName].filter(Boolean).join(' ') || p.username

          // 从specialties字段中提取分类
          const specialtiesText = p.specialties || '通用摄影'
          const categories = specialtiesText.split(',').map((item) => item.trim())

          return {
            id: p.photographerId,
            userId: p.userId,
            name: fullName,
            priceRangeMin: p.priceRangeMin || 0,
            priceRangeMax: p.priceRangeMax || 0,
            categories: categories,
            description: p.bio || '暂无描述',
            location: p.location || '',
            coverImage: '/images/photographer/cat.jpg', // 使用固定的猫咪图片作为封面
            experience: p.experience || '',
          }
        })

        console.log(`转换后共有${transformedData.length}位摄影师数据`)

        // 计算总页数
        totalPages.value = Math.max(1, Math.ceil(transformedData.length / pageSize.value))

        // 分页
        const start = (currentPage.value - 1) * pageSize.value
        const end = start + pageSize.value
        photographers.value = transformedData.slice(start, end)

        // 应用排序
        sortPhotographers()
      } catch (error) {
        console.error('获取摄影师数据失败:', error)
        photographers.value = [] // 清空数据
        totalPages.value = 1
      } finally {
        isLoading.value = false
      }
    }

    // 组件挂载时获取数据
    onMounted(() => {
      fetchPhotographers()
    })

    return {
      searchQuery,
      sortOption,
      minPrice,
      maxPrice,
      locationFilter,
      isPriceFilterActive,
      isAnyFilterActive,
      photographers,
      isLoading,
      currentPage,
      totalPages,
      searchPhotographers,
      applyFilters,
      clearFilters,
      sortPhotographers,
      nextPage,
      prevPage,
      selectPhotographer,
    }
  },
})
</script>
