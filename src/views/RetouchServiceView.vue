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
        <div class="flex flex-col md:flex-row md:items-center md:space-x-4">
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

        <!-- 筛选器 -->
        <div class="mt-6">
          <h3 class="text-lg font-medium text-neutral-dark mb-3">按专业领域筛选</h3>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="category in categories"
              :key="category.value"
              @click="toggleCategory(category.value)"
              :class="[
                'px-4 py-2 rounded-full border transition-colors',
                selectedCategories.includes(category.value)
                  ? 'bg-primary text-white border-primary'
                  : 'bg-white text-neutral-dark border-neutral hover:border-primary',
              ]"
            >
              {{ category.label }}
            </button>
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
              <option value="rating">评分最高</option>
              <option value="price-low">价格从低到高</option>
              <option value="price-high">价格从高到低</option>
              <option value="experience">经验丰富度</option>
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
import { defineComponent, ref, onMounted } from 'vue'
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
    const selectedCategories = ref<string[]>([])
    const sortOption = ref('rating')
    const isLoading = ref(true)
    const retouchers = ref<RetoucherCardData[]>([])

    // 分页相关
    const currentPage = ref(1)
    const totalPages = ref(1)
    const pageSize = 12

    // 模拟的分类数据
    const categories = [
      { label: '人像精修', value: 'portraitRetouch' },
      { label: '婚礼照片', value: 'weddingRetouch' },
      { label: '风景照片', value: 'landscapeRetouch' },
      { label: '时尚修图', value: 'fashionRetouch' },
      { label: '产品图片', value: 'productRetouch' },
      { label: '美食照片', value: 'foodRetouch' },
      { label: '皮肤修饰', value: 'skinRetouch' },
      { label: '建筑照片', value: 'architectureRetouch' },
      { label: '广告图片', value: 'advertisingRetouch' },
    ]

    // 切换分类筛选
    const toggleCategory = (category: string) => {
      if (selectedCategories.value.includes(category)) {
        selectedCategories.value = selectedCategories.value.filter((cat) => cat !== category)
      } else {
        selectedCategories.value.push(category)
      }
      // 重新搜索
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
        if (sortMethod === 'rating') {
          return b.rating - a.rating
        } else if (sortMethod === 'price-low') {
          return a.price - b.price
        } else if (sortMethod === 'price-high') {
          return b.price - a.price
        } else if (sortMethod === 'experience') {
          const expMap = { beginner: 1, intermediate: 2, advanced: 3, expert: 4 }
          return (
            expMap[b.experience as keyof typeof expMap] -
            expMap[a.experience as keyof typeof expMap]
          )
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

    // 选择修图师创建订单
    const selectRetoucher = (retoucher: RetoucherCardData) => {
      // 这里可以导航到创建订单页面，并传递修图师信息
      router.push({
        path: '/create-retouch-order',
        query: { retoucherId: retoucher.id.toString() },
      })
    }

    // 获取修图师数据
    const fetchRetouchers = async () => {
      isLoading.value = true

      try {
        // 调用API获取已验证的修图师数据
        const response = await retoucherAPI.getVerifiedRetouchers()
        const retouchersData: RetoucherData[] = response.data

        // 将API数据转换为UI需要的格式
        const transformedData: RetoucherCardData[] = retouchersData.map((r) => {
          // 生成完整名字或使用用户名
          const fullName = [r.firstName, r.lastName].filter(Boolean).join(' ') || r.username

          // 从expertise字段中提取分类
          const categories = r.expertise.split('、').map((item) => item.trim())

          return {
            id: r.retoucherId,
            name: fullName,
            rating: 5.0, // 默认评分
            price: r.pricePerPhoto,
            categories: categories,
            description: r.bio,
            coverImage: `https://avatars.dicebear.com/api/initials/${encodeURIComponent(r.username)}.svg`, // 使用头像生成API
            experience: 'advanced', // 默认经验级别
          }
        })

        // 过滤和分页逻辑
        let filtered = [...transformedData]

        // 根据搜索词过滤
        if (searchQuery.value) {
          const query = searchQuery.value.toLowerCase()
          filtered = filtered.filter(
            (r) =>
              r.name.toLowerCase().includes(query) || r.description.toLowerCase().includes(query),
          )
        }

        // 根据分类过滤
        if (selectedCategories.value.length > 0) {
          filtered = filtered.filter((r) =>
            selectedCategories.value.some((cat) => {
              const catLabel = categories.find((c) => c.value === cat)?.label || ''
              return r.categories.some((c) => c.toLowerCase().includes(catLabel.toLowerCase()))
            }),
          )
        }

        // 计算总页数
        totalPages.value = Math.max(1, Math.ceil(filtered.length / pageSize))

        // 分页
        const start = (currentPage.value - 1) * pageSize
        const end = start + pageSize
        retouchers.value = filtered.slice(start, end)

        // 应用排序
        sortRetouchers()
      } catch (error) {
        console.error('获取修图师数据失败:', error)
        retouchers.value = [] // 清空数据
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
      selectedCategories,
      sortOption,
      categories,
      retouchers,
      isLoading,
      currentPage,
      totalPages,
      toggleCategory,
      searchRetouchers,
      sortRetouchers,
      nextPage,
      prevPage,
      selectRetoucher,
    }
  },
})
</script>
