<template>
  <div class="bg-neutral min-h-screen pb-10">
    <!-- 加载中状态 -->
    <div v-if="loading" class="flex justify-center items-center h-screen">
      <div class="text-center">
        <div
          class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"
        ></div>
        <p class="mt-4 text-neutral-dark">正在加载作品集...</p>
      </div>
    </div>

    <!-- 错误提示 -->
    <div v-else-if="error" class="flex justify-center items-center h-screen">
      <div class="text-center bg-white p-8 rounded-lg shadow-md">
        <div class="text-error text-xl mb-4">加载失败</div>
        <p class="text-neutral-dark mb-6">{{ error }}</p>
        <button @click="fetchPortfolio" class="px-4 py-2 bg-primary text-white rounded-md">
          重试
        </button>
      </div>
    </div>

    <!-- 作品集内容 -->
    <template v-else>
      <!-- 顶部导航和标题 -->
      <div class="bg-primary text-white px-6 py-4 shadow-md">
        <div class="container mx-auto">
          <div class="flex justify-between items-center">
            <div>
              <h1 class="text-2xl font-bold">我的作品集</h1>
              <p class="text-sm text-green-light mt-1">
                管理您的所有作品集，包括公开和未公开的内容
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

      <!-- 主要内容区域 -->
      <div class="container mx-auto px-4 mt-8">
        <!-- 过滤和排序工具栏 -->
        <div class="bg-white rounded-lg shadow-md p-4 mb-6">
          <div class="flex flex-wrap gap-4 items-center">
            <!-- 分类切换 -->
            <div class="flex border border-green-light rounded-lg overflow-hidden">
              <button
                @click="activeTab = 'all'"
                :class="[
                  'px-4 py-2 text-sm font-medium transition-colors',
                  activeTab === 'all'
                    ? 'bg-primary text-white'
                    : 'bg-white text-neutral-dark hover:bg-green-light hover:bg-opacity-20',
                ]"
              >
                全部
              </button>
              <button
                @click="activeTab = 'public'"
                :class="[
                  'px-4 py-2 text-sm font-medium transition-colors',
                  activeTab === 'public'
                    ? 'bg-primary text-white'
                    : 'bg-white text-neutral-dark hover:bg-green-light hover:bg-opacity-20',
                ]"
              >
                已公开
              </button>
              <button
                @click="activeTab = 'private'"
                :class="[
                  'px-4 py-2 text-sm font-medium transition-colors',
                  activeTab === 'private'
                    ? 'bg-primary text-white'
                    : 'bg-white text-neutral-dark hover:bg-green-light hover:bg-opacity-20',
                ]"
              >
                未公开
              </button>
            </div>

            <!-- 作品类型选择 -->
            <div class="flex border border-green-light rounded-lg overflow-hidden">
              <button
                @click="portfolioType = 'photography'"
                :class="[
                  'px-4 py-2 text-sm font-medium transition-colors',
                  portfolioType === 'photography'
                    ? 'bg-primary text-white'
                    : 'bg-white text-neutral-dark hover:bg-green-light hover:bg-opacity-20',
                ]"
                :disabled="!userStore.isPhotographer"
              >
                摄影作品
              </button>
              <button
                @click="portfolioType = 'retouching'"
                :class="[
                  'px-4 py-2 text-sm font-medium transition-colors',
                  portfolioType === 'retouching'
                    ? 'bg-primary text-white'
                    : 'bg-white text-neutral-dark hover:bg-green-light hover:bg-opacity-20',
                ]"
                :disabled="!userStore.isRetoucher"
              >
                修图作品
              </button>
            </div>

            <!-- <div class="ml-auto">
              <button
                class="px-4 py-2 bg-primary text-white rounded-md hover:bg-green-dark transition-colors"
              >
                上传新作品
              </button>
            </div> -->
          </div>
        </div>

        <!-- 摄影师认证提示 -->
        <div
          v-if="portfolioType === 'photography' && !userStore.isPhotographer"
          class="bg-white rounded-lg shadow-md p-8 mb-8 text-center"
        >
          <div class="mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-16 w-16 mx-auto text-neutral-dark"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
              />
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </div>
          <h2 class="text-xl font-semibold text-neutral-dark mb-2">您还不是认证摄影师</h2>
          <p class="text-neutral-dark mb-6">
            成为认证摄影师可以展示您的摄影作品集，接受约拍邀请，获得专业收入
          </p>
          <button
            class="px-6 py-3 bg-primary text-white rounded-md hover:bg-green-dark transition-colors"
          >
            立即认证摄影师
          </button>
        </div>

        <!-- 修图师认证提示 -->
        <div
          v-else-if="portfolioType === 'retouching' && !userStore.isRetoucher"
          class="bg-white rounded-lg shadow-md p-8 mb-8 text-center"
        >
          <div class="mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-16 w-16 mx-auto text-neutral-dark"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
              />
            </svg>
          </div>
          <h2 class="text-xl font-semibold text-neutral-dark mb-2">您还不是认证修图师</h2>
          <p class="text-neutral-dark mb-6">
            成为认证修图师可以展示您的修图技术，接受修图订单，获得专业收入
          </p>
          <button
            class="px-6 py-3 bg-primary text-white rounded-md hover:bg-green-dark transition-colors"
          >
            立即认证修图师
          </button>
        </div>

        <!-- 摄影作品列表 -->
        <div v-else-if="portfolioType === 'photography' && userStore.isPhotographer">
          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <!-- 添加新作品的卡片 -->
            <div
              class="bg-white rounded-lg shadow-md overflow-hidden h-72 flex flex-col items-center justify-center border-2 border-dashed border-green-light cursor-pointer hover:bg-green-light hover:bg-opacity-10"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-12 w-12 text-primary mb-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              <span class="text-primary font-medium">添加新作品</span>
            </div>

            <!-- 作品卡片 -->
            <div
              v-for="(photo, index) in filteredPhotographyPortfolio"
              :key="index"
              class="bg-white rounded-lg shadow-md overflow-hidden group cursor-pointer hover:shadow-lg transition-shadow"
            >
              <div class="aspect-video relative">
                <img
                  v-if="photo.coverImageUrl"
                  :src="getImageUrl(photo.coverImageUrl)"
                  :alt="photo.title"
                  class="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
                <div
                  v-else
                  class="w-full h-full bg-neutral-dark bg-opacity-10 flex items-center justify-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-16 w-16 text-neutral-dark opacity-30"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <!-- 公开/私密标识 -->
                <div
                  :class="[
                    'absolute top-2 right-2 px-2 py-1 text-xs rounded-md',
                    photo.isPublic ? 'bg-primary text-white' : 'bg-white text-neutral-dark',
                  ]"
                >
                  {{ photo.isPublic ? '已公开' : '未公开' }}
                </div>
              </div>
              <div class="p-3">
                <h3 class="font-medium text-neutral-dark text-lg mb-1">{{ photo.title }}</h3>
                <p class="text-sm text-neutral-dark line-clamp-2 mb-3 h-10 overflow-hidden">
                  {{ photo.description }}
                </p>

                <div class="flex justify-between items-center mt-2">
                  <span class="text-xs text-neutral-dark">{{ formatDate(photo.createdAt) }}</span>
                  <div class="flex space-x-1">
                    <div
                      class="text-xs text-neutral-dark bg-neutral bg-opacity-20 px-2 py-1 rounded-full"
                    >
                      {{ photo.items?.length || 0 }} 作品
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 空状态 -->
          <div
            v-if="
              !photographyPortfolio ||
              !filteredPhotographyPortfolio ||
              filteredPhotographyPortfolio.length === 0
            "
            class="bg-white rounded-lg shadow-md p-8 text-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-16 w-16 mx-auto text-neutral-dark opacity-50 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <h3 class="text-lg font-medium text-neutral-dark mb-2">暂无作品</h3>
            <p class="text-neutral-dark mb-4">您还没有上传任何摄影作品</p>
            <router-link
              to="/portfolio/photographer/create"
              class="px-4 py-2 bg-primary text-white rounded-md hover:bg-green-dark transition-colors"
            >
              开始上传
            </router-link>
          </div>
        </div>

        <!-- 修图作品列表 -->
        <div v-else-if="portfolioType === 'retouching' && userStore.isRetoucher">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <!-- 添加新作品按钮 -->
            <router-link
              to="/portfolio/retoucher/create"
              class="bg-white rounded-lg shadow-md overflow-hidden flex flex-col items-center justify-center border-2 border-dashed border-green-light cursor-pointer hover:bg-green-light hover:bg-opacity-10 h-64"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-12 w-12 text-primary mb-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              <span class="text-primary font-medium">添加新修图作品</span>
            </router-link>

            <!-- 修图作品集卡片 -->
            <div
              v-for="portfolio in filteredRetoucherPortfolios"
              :key="portfolio.portfolioId"
              class="bg-white rounded-lg shadow-md overflow-hidden group cursor-pointer hover:shadow-lg transition-shadow"
              @click="viewPortfolioDetails(portfolio)"
            >
              <div class="aspect-video relative">
                <img
                  v-if="portfolio.coverImageUrl"
                  :src="getImageUrl(portfolio.coverImageUrl)"
                  :alt="portfolio.title"
                  class="w-full h-full object-cover"
                />
                <div
                  v-else
                  class="w-full h-full bg-neutral-dark bg-opacity-10 flex items-center justify-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-16 w-16 text-neutral-dark opacity-30"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>

                <!-- 公开/私密标识 -->
                <div
                  :class="[
                    'absolute top-2 right-2 px-2 py-1 text-xs rounded-md',
                    portfolio.isPublic ? 'bg-primary text-white' : 'bg-white text-neutral-dark',
                  ]"
                >
                  {{ portfolio.isPublic ? '已公开' : '未公开' }}
                </div>

                <!-- 分类标签 -->
                <div
                  class="absolute bottom-2 left-2 px-2 py-1 text-xs bg-black bg-opacity-50 text-white rounded-md"
                >
                  {{ getCategoryName(portfolio.category) }}
                </div>
              </div>

              <div class="p-4">
                <h3 class="font-medium text-neutral-dark text-lg mb-1">{{ portfolio.title }}</h3>
                <p class="text-sm text-neutral-dark line-clamp-2 mb-3 h-10 overflow-hidden">
                  {{ portfolio.description }}
                </p>

                <div class="flex justify-between items-center mt-2">
                  <span class="text-xs text-neutral-dark">
                    {{ formatDate(portfolio.createdAt) }}
                  </span>
                  <div class="flex space-x-1">
                    <div
                      class="text-xs text-neutral-dark bg-neutral bg-opacity-20 px-2 py-1 rounded-full"
                    >
                      {{ portfolio.items?.length || 0 }} 作品
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 加载指示器 -->
          <div v-if="loadingRetoucherPortfolios" class="flex justify-center my-8">
            <div
              class="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent"
            ></div>
            <span class="ml-2">正在加载作品集...</span>
          </div>

          <!-- 空状态 - 添加更详细的提示信息 -->
          <div
            v-if="!loadingRetoucherPortfolios && filteredRetoucherPortfolios.length === 0"
            class="bg-white rounded-lg shadow-md p-8 text-center mt-4"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-16 w-16 mx-auto text-neutral-dark opacity-50 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
              />
            </svg>
            <h3 class="text-lg font-medium text-neutral-dark mb-2">
              {{
                activeTab === 'all'
                  ? '暂无修图作品'
                  : activeTab === 'public'
                    ? '暂无公开修图作品'
                    : '暂无私密修图作品'
              }}
            </h3>
            <p class="text-neutral-dark mb-4">
              {{
                activeTab === 'all'
                  ? '您还没有上传任何修图作品'
                  : activeTab === 'public'
                    ? '您没有公开的修图作品'
                    : '您没有私密的修图作品'
              }}
            </p>
            <router-link
              to="/portfolio/retoucher/create"
              class="px-4 py-2 bg-primary text-white rounded-md hover:bg-green-dark transition-colors"
            >
              {{ activeTab === 'all' ? '开始上传' : '创建新作品集' }}
            </router-link>
          </div>
        </div>
      </div>

      <!-- 添加调试信息 - 仅在开发环境显示 -->
      <div
        v-if="isDevelopment"
        class="container mx-auto mt-4 p-4 bg-error bg-opacity-10 rounded-lg text-red"
      >
        <h3 class="font-bold text-error">调试信息:</h3>
        <p>用户是否是修图师: {{ userStore.isRetoucher ? '是' : '否' }}</p>
        <p>修图师ID: {{ userStore.retoucherId }}</p>
        <p>作品类型: {{ portfolioType }}</p>
        <p>活动标签: {{ activeTab }}</p>
        <p>API基础URL: {{ apiBaseUrl }}</p>
        <p>静态资源URL: {{ staticBaseUrl }}</p>
        <p>获取到的作品集数量: {{ retoucherPortfolios ? retoucherPortfolios.length : 0 }}</p>
        <p>
          筛选后的作品集数量:
          {{ filteredRetoucherPortfolios ? filteredRetoucherPortfolios.length : 0 }}
        </p>
        <p>加载状态: {{ loadingRetoucherPortfolios ? '加载中' : '已完成' }}</p>
        <p>错误信息: {{ error || '无' }}</p>
        <div v-if="retoucherPortfolios && retoucherPortfolios.length > 0" class="mt-2">
          <p>第一个作品集封面URL: {{ retoucherPortfolios[0].coverImageUrl }}</p>
          <p>处理后的封面URL: {{ getImageUrl(retoucherPortfolios[0].coverImageUrl) }}</p>
        </div>
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import { getAssetUrl } from '../utils/urlUtils'
import { defineComponent, ref, computed, onMounted, watch } from 'vue'
import { useUserStore } from '../stores/userStore'
import { useRouter } from 'vue-router'

import { retoucherPortfolioAPI, userAPI, photographerPortfolioAPI } from '../services/apiService'

// Interface for retoucher portfolio
interface RetoucherPortfolio {
  retoucherId: number
  retoucherName: string
  portfolioId: number
  title: string
  description: string
  category: string
  isPublic: boolean
  createdAt: string
  updatedAt: string
  coverImageUrl: string | null
  coverThumbnailUrl: string | null
  items: PortfolioItem[]
}

// Interface for portfolio item
interface PortfolioItem {
  itemId: number
  portfolioId: number
  portfolioType: string
  imagePath: string
  imageUrl: string
  thumbnailUrl: string | null
  title: string
  description: string
  metadata: string
  createdAt: string
  isBeforeImage: boolean
  afterImageId: number | null
  afterImage: any | null
  isPortfolioCover: boolean
  beforeImageUrl: string | null
  beforeThumbnailUrl: string | null
  afterImageUrl: string | null
  afterThumbnailUrl: string | null
}

export default defineComponent({
  name: 'PortfolioView',
  setup() {
    // 使用集中管理的用户存储
    const userStore = useUserStore()
    const router = useRouter()

    // 状态变量
    const loading = ref(true)
    const error = ref('')
    const isDevelopment = ref(process.env.NODE_ENV === 'development')
    const apiBaseUrl = ref(import.meta.env.VITE_API_BASE_URL)
    const staticBaseUrl = ref(import.meta.env.VITE_STATIC_ASSETS_URL)
    const activeTab = ref('all') // 'all', 'public', 'private'
    const portfolioType = ref('photography') // 'photography', 'retouching'

    // 摄影作品集数据
    const photographyPortfolio = ref([])

    // 修图作品集数据
    const retouchingPortfolio = ref([])

    // 根据标签筛选的摄影作品
    const filteredPhotographyPortfolio = computed(() => {
      console.log('[DEBUG] computing filteredPhotographyPortfolio, activeTab:', activeTab.value)

      if (!photographyPortfolio.value || !Array.isArray(photographyPortfolio.value)) {
        console.error(
          '[ERROR] photographyPortfolio is undefined or not an array:',
          photographyPortfolio.value,
        )
        return []
      }

      if (activeTab.value === 'all') {
        return photographyPortfolio.value
      } else if (activeTab.value === 'public') {
        return photographyPortfolio.value.filter((item) => item && item.isPublic)
      } else {
        return photographyPortfolio.value.filter((item) => item && !item.isPublic)
      }
    })

    // 根据标签筛选的修图作品
    const filteredRetouchingPortfolio = computed(() => {
      if (activeTab.value === 'all') {
        return retouchingPortfolio.value
      } else if (activeTab.value === 'public') {
        return retouchingPortfolio.value.filter((item) => item.isPublic)
      } else {
        return retouchingPortfolio.value.filter((item) => !item.isPublic)
      }
    })

    // 修图作品集数据
    const retoucherPortfolios = ref<RetoucherPortfolio[]>([])

    // 根据标签筛选的修图作品
    const filteredRetoucherPortfolios = computed(() => {
      console.log(
        '[DEBUG] filteredRetoucherPortfolios: start computation, activeTab:',
        activeTab.value,
      )

      // Check if the source array exists and is an array
      if (!retoucherPortfolios.value) {
        console.error('[ERROR] retoucherPortfolios.value is undefined!')
        return []
      }
      if (!Array.isArray(retoucherPortfolios.value)) {
        console.error(
          '[ERROR] retoucherPortfolios.value is not an array:',
          retoucherPortfolios.value,
        )
        return []
      }

      console.log('[DEBUG] retoucherPortfolios contents:', retoucherPortfolios.value)
      console.log('[DEBUG] Total portfolios count:', retoucherPortfolios.value.length)

      let result
      if (activeTab.value === 'all') {
        result = retoucherPortfolios.value
      } else if (activeTab.value === 'public') {
        result = retoucherPortfolios.value.filter((item) => {
          if (!item) {
            console.error('[ERROR] Encountered an undefined portfolio item in public filter')
            return false
          }
          return item.isPublic === true
        })
      } else {
        result = retoucherPortfolios.value.filter((item) => {
          if (!item) {
            console.error('[ERROR] Encountered an undefined portfolio item in private filter')
            return false
          }
          return item.isPublic === false
        })
      }
      if (!result) {
        console.error('[ERROR] Result of filtering is undefined!')
        return []
      }
      console.log('[DEBUG] Filtered portfolios count:', result.length)
      return result
    })

    const loadingRetoucherPortfolios = ref(false)
    const loadingPhotographerPortfolios = ref(false)

    // 角色ID状态
    const retoucherId = ref<number | null>(null)
    const photographerId = ref<number | null>(null)

    // 获取用户角色ID (修图师和摄影师)
    const fetchUserRoleIds = async () => {
      if (!userStore.isAuthenticated || !userStore.userInfo?.userId) {
        console.error('无法获取用户角色ID：用户未登录或缺少用户ID')
        return false
      }

      const userId = userStore.userInfo.userId
      console.log(`开始获取用户 ID ${userId} 的角色编号`)

      try {
        // 如果用户是修图师，获取修图师ID
        if (userStore.isRetoucher) {
          try {
            console.log(`请求API: ${apiBaseUrl.value}/User/${userId}/retoucher-id`)
            const retoucherResponse = await userAPI.getRetoucherId(userId)
            retoucherId.value = retoucherResponse.data.retoucherId
            console.log('获取修图师ID成功:', retoucherId.value)

            // 更新 userStore 中的 retoucherId
            userStore.updateUserInfo({ retoucherId: retoucherId.value })
          } catch (error: any) {
            if (error.response?.status === 404) {
              console.warn('用户没有修图师ID，可能需要完成认证')
            } else {
              console.error('获取修图师ID失败:', error)
            }
          }
        }

        // 如果用户是摄影师，获取摄影师ID
        if (userStore.isPhotographer) {
          try {
            console.log(`请求API: ${apiBaseUrl.value}/User/${userId}/photographer-id`)
            const photographerResponse = await userAPI.getPhotographerId(userId)
            photographerId.value = photographerResponse.data.photographerId
            console.log('获取摄影师ID成功:', photographerId.value)

            // 更新 userStore 中的 photographerId
            userStore.updateUserInfo({ photographerId: photographerId.value })
          } catch (error: any) {
            if (error.response?.status === 404) {
              console.warn('用户没有摄影师ID，可能需要完成认证')
            } else {
              console.error('获取摄影师ID失败:', error)
            }
          }
        }

        // 如果用户是修图师但没有修图师ID，或者是摄影师但没有摄影师ID，返回false
        if (
          (userStore.isRetoucher && !retoucherId.value) ||
          (userStore.isPhotographer && !photographerId.value)
        ) {
          return false
        }

        return true
      } catch (err) {
        console.error('获取用户角色ID时发生错误:', err)
        return false
      }
    }

    // 获取修图师的作品集
    const fetchRetoucherPortfolios = async () => {
      // 检查并可能获取修图师ID
      if (!retoucherId.value && !userStore.retoucherId) {
        console.log('修图师ID未设置，尝试获取...')
        await fetchUserRoleIds()
      }

      // 优先使用本地retoucherId，其次使用store中的
      const currentRetoucherId = retoucherId.value || userStore.retoucherId

      if (!userStore.isRetoucher || !currentRetoucherId) {
        console.error('无法获取修图作品集: 用户不是修图师或缺少修图师ID')
        if (userStore.isRetoucher) {
          error.value = '请先完成修图师认证，才能查看和管理修图作品集'
        }
        return
      }

      loadingRetoucherPortfolios.value = true
      error.value = ''

      try {
        console.log(`开始获取修图师ID为${currentRetoucherId}的作品集数据`)

        // 获取公开作品集
        console.log(
          `请求API: ${apiBaseUrl.value}/retoucher-portfolios/retoucher/${currentRetoucherId}/public`,
        )
        const publicResponse = await retoucherPortfolioAPI.getPublicPortfolios(currentRetoucherId)
        console.log('公开作品集数量:', publicResponse.data?.length || 0)

        // 获取私密作品集
        console.log(
          `请求API: ${apiBaseUrl.value}/retoucher-portfolios/retoucher/${currentRetoucherId}/private-simple`,
        )
        const privateResponse = await retoucherPortfolioAPI.getPrivatePortfolios(currentRetoucherId)
        console.log('私密作品集数量:', privateResponse.data?.length || 0)

        // Ensure we're initializing with an empty array if the response is invalid
        const publicData = Array.isArray(publicResponse.data) ? publicResponse.data : []
        const privateData = Array.isArray(privateResponse.data) ? privateResponse.data : []

        // 合并并深拷贝作品集数据
        const allPortfolios = JSON.parse(JSON.stringify([...publicData, ...privateData]))

        console.log('合并后总作品集数量:', allPortfolios.length)

        // 确保数据类型正确
        allPortfolios.forEach((portfolio: RetoucherPortfolio) => {
          if (!Array.isArray(portfolio.items)) {
            portfolio.items = []
          }
          portfolio.isPublic = !!portfolio.isPublic // 确保是布尔值
        })

        // Initialize retoucherPortfolios with an empty array if it's undefined
        retoucherPortfolios.value = allPortfolios || []
        console.log('成功更新修图作品集数据')

        // 如果数据为空，记录更多信息
        if (allPortfolios.length === 0) {
          console.warn('获取到的作品集为空，可能需要检查API返回格式或认证信息')
        }
      } catch (err: any) {
        const errorMsg = '获取修图作品集失败'
        console.error(errorMsg, err)

        // 记录更详细的错误信息
        if (err.response) {
          console.error('API错误状态码:', err.response.status)
          console.error('API错误详情:', err.response.data)
        } else if (err.request) {
          console.error('未收到API响应:', err.request)
        } else {
          console.error('错误详情:', err.message)
        }

        error.value = `${errorMsg}，请稍后再试`

        // Make sure to set the value to an empty array on error
        retoucherPortfolios.value = []
      } finally {
        loadingRetoucherPortfolios.value = false
      }
    }

    // 获取摄影师的作品集
    const fetchPhotographerPortfolios = async () => {
      if (!photographerId.value && !userStore.photographerId) {
        console.log('摄影师ID未设置，尝试获取...')
        await fetchUserRoleIds()
      }

      const currentPhotographerId = photographerId.value || userStore.photographerId
      if (!userStore.isPhotographer || !currentPhotographerId) {
        console.error('无法获取摄影作品集: 用户不是摄影师或缺少摄影师ID')
        if (userStore.isPhotographer) {
          error.value = '请先完成摄影师认证，才能查看和管理摄影作品集'
        }
        return
      }

      loadingPhotographerPortfolios.value = true
      error.value = ''

      try {
        console.log(`开始获取摄影师ID为${currentPhotographerId}的作品集数据`)

        // 获取公开作品集
        const publicResponse =
          await photographerPortfolioAPI.getPublicPortfolios(currentPhotographerId)
        console.log('公开摄影作品集数量:', publicResponse.data?.length || 0)

        // 获取私密作品集
        const privateResponse =
          await photographerPortfolioAPI.getPrivatePortfolios(currentPhotographerId)
        console.log('私密摄影作品集数量:', privateResponse.data?.length || 0)

        const publicData = Array.isArray(publicResponse.data) ? publicResponse.data : []
        const privateData = Array.isArray(privateResponse.data) ? privateResponse.data : []
        const allPortfolios = JSON.parse(JSON.stringify([...publicData, ...privateData]))

        console.log('合并后总摄影作品集数量:', allPortfolios.length)

        allPortfolios.forEach((portfolio: any) => {
          if (!Array.isArray(portfolio.items)) {
            portfolio.items = []
          }
          portfolio.isPublic = !!portfolio.isPublic
        })

        photographyPortfolio.value = allPortfolios || []
        console.log('成功更新摄影作品集数据')

        if (allPortfolios.length === 0) {
          console.warn('获取到的摄影作品集为空，可能需要检查API或认证信息')
        }
      } catch (err: any) {
        const errorMsg = '获取摄影作品集失败'
        console.error(errorMsg, err)
        if (err.response) {
          console.error('API错误状态码:', err.response.status)
          console.error('API错误详情:', err.response.data)
        } else if (err.request) {
          console.error('未收到API响应:', err.request)
        } else {
          console.error('错误详情:', err.message)
        }
        error.value = `${errorMsg}，请稍后再试`
        photographyPortfolio.value = []
      } finally {
        loadingPhotographerPortfolios.value = false
      }
    }

    // 获取用户信息和作品集
    const fetchPortfolio = async () => {
      loading.value = true
      error.value = ''

      try {
        // 初始化userStore，从本地存储或API获取用户信息
        if (!userStore.isAuthenticated) {
          console.log('用户未登录，尝试初始化用户数据')
          await userStore.initializeUser()
        }

        // 如果用户已登录但角色ID未获取，尝试获取角色ID
        if (
          userStore.isAuthenticated &&
          ((userStore.isRetoucher && !userStore.retoucherId) ||
            (userStore.isPhotographer && !userStore.photographerId))
        ) {
          console.log('用户已登录但角色ID未获取，尝试获取角色ID')
          await fetchUserRoleIds()
        }

        console.log('用户信息:', {
          isAuthenticated: userStore.isAuthenticated,
          isRetoucher: userStore.isRetoucher,
          isPhotographer: userStore.isPhotographer,
          retoucherId: retoucherId.value || userStore.retoucherId,
          photographerId: photographerId.value || userStore.photographerId,
        })

        // 根据角色设置初始标签
        if (userStore.isPhotographer) {
          portfolioType.value = 'photography'
          console.log('用户是摄影师，设置作品类型为摄影作品')
          await fetchPhotographerPortfolios()
        } else if (userStore.isRetoucher) {
          portfolioType.value = 'retouching'
          console.log('用户是修图师，设置作品类型为修图作品')

          // 获取修图师作品集
          await fetchRetoucherPortfolios()
        }

        loading.value = false
      } catch (err: any) {
        console.error('获取作品集数据失败:', err)
        if (err.response?.status === 401) {
          error.value = '登录已过期，请重新登录'
        } else {
          error.value = '获取数据失败，请稍后再试'
        }
        loading.value = false
      }
    }

    // 格式化日期
    const formatDate = (dateString: string) => {
      try {
        const date = new Date(dateString)
        return new Intl.DateTimeFormat('zh-CN', {
          year: 'numeric',
          month: 'numeric',
          day: 'numeric',
        }).format(date)
      } catch (e) {
        return dateString
      }
    }

    // 获取分类名称
    const getCategoryName = (category: string) => {
      const categoryMap: Record<string, string> = {
        Portrait: '人像修图',
        Wedding: '婚礼修图',
        Fashion: '时尚修图',
        Event: '活动修图',
        Landscape: '风景修图',
        Product: '产品修图',
        Other: '其他',
      }

      return categoryMap[category] || category
    }

    // 处理图片URL - 使用新的工具函数
    const getImageUrl = (url: string | null) => {
      // 使用新的工具函数处理URL
      return getAssetUrl(url)
    }

    // 查看作品集详情
    const viewPortfolioDetails = (portfolio: RetoucherPortfolio) => {
      console.log('查看作品集详情:', {
        id: portfolio.portfolioId,
        title: portfolio.title,
        items: portfolio.items?.length || 0,
      })
      // 使用路由导航到详情页面
      router.push({
        name: 'retoucher-portfolio-detail',
        params: { id: portfolio.portfolioId.toString() },
      })
    }

    // 监听作品类型变化，切换到修图作品时加载数据
    watch(portfolioType, async (newType) => {
      console.log('作品类型切换为:', newType)
      if (newType === 'retouching' && userStore.isRetoucher) {
        if (retoucherPortfolios.value.length === 0) {
          console.log('未加载修图作品集数据，开始获取...')
          await fetchRetoucherPortfolios()
        } else {
          console.log('已有修图作品集数据，数量:', retoucherPortfolios.value.length)
        }
      } else if (newType === 'photography' && userStore.isPhotographer) {
        if (photographyPortfolio.value.length === 0) {
          console.log('未加载摄影作品集数据，开始获取...')
          await fetchPhotographerPortfolios()
        } else {
          console.log('已有摄影作品集数据，数量:', photographyPortfolio.value.length)
        }
      }
    })

    // 监听标签变化，记录日志
    watch(activeTab, (newTab) => {
      console.log('活动标签切换为:', newTab)
      console.log('筛选后的作品集数量:', filteredRetoucherPortfolios.value.length)
    })

    onMounted(() => {
      console.log('组件已挂载，开始获取作品集数据')
      fetchPortfolio()
    })

    return {
      userStore,
      loading,
      error,
      activeTab,
      portfolioType,
      photographyPortfolio,
      retoucherPortfolios,
      filteredRetoucherPortfolios,
      loadingRetoucherPortfolios,
      isDevelopment, // 添加到返回值中
      apiBaseUrl, // 添加到返回值中
      staticBaseUrl,
      fetchPortfolio,
      fetchUserRoleIds, // 添加到返回值供模板使用
      formatDate,
      getCategoryName,
      getImageUrl,
      viewPortfolioDetails,
      retoucherId, // 添加到返回值供模板使用
      photographerId, // 添加到返回值供模板使用
      filteredPhotographyPortfolio,
    }
  },
})
</script>
