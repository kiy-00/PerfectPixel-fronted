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

            <div class="ml-auto">
              <button
                class="px-4 py-2 bg-primary text-white rounded-md hover:bg-green-dark transition-colors"
              >
                上传新作品
              </button>
            </div>
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
              class="bg-white rounded-lg shadow-md overflow-hidden h-72 group"
            >
              <div class="h-48 overflow-hidden relative">
                <img
                  :src="photo.url"
                  :alt="photo.title"
                  class="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
                <!-- 公开/私密标识 -->
                <div
                  :class="[
                    'absolute top-2 left-2 px-2 py-1 text-xs rounded-md',
                    photo.isPublic ? 'bg-primary text-white' : 'bg-white text-neutral-dark',
                  ]"
                >
                  {{ photo.isPublic ? '已公开' : '未公开' }}
                </div>
              </div>
              <div class="p-3">
                <h3 class="font-medium text-neutral-dark">{{ photo.title }}</h3>
                <p class="text-xs text-neutral-dark">{{ photo.category }}</p>

                <div class="flex justify-between items-center mt-2">
                  <span class="text-xs text-neutral-dark">{{ photo.createdAt }}</span>
                  <div class="flex space-x-2">
                    <button class="p-1 text-neutral-dark hover:text-primary">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                        />
                      </svg>
                    </button>
                    <button class="p-1 text-neutral-dark hover:text-error">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-4 w-4"
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
                </div>
              </div>
            </div>
          </div>

          <!-- 空状态 -->
          <div
            v-if="filteredPhotographyPortfolio.length === 0"
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
            <button
              class="px-4 py-2 bg-primary text-white rounded-md hover:bg-green-dark transition-colors"
            >
              开始上传
            </button>
          </div>
        </div>

        <!-- 修图作品列表 -->
        <div v-else-if="portfolioType === 'retouching' && userStore.isRetoucher">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
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

            <!-- 修图作品卡片 -->
            <div
              v-for="(work, index) in filteredRetouchingPortfolio"
              :key="index"
              class="bg-white rounded-lg shadow-md overflow-hidden group"
            >
              <div class="flex flex-col md:flex-row">
                <div class="relative md:w-1/2">
                  <img
                    :src="work.beforeImage"
                    alt="修图前"
                    class="w-full aspect-square object-cover"
                  />
                  <div
                    class="absolute top-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded"
                  >
                    修图前
                  </div>

                  <!-- 公开/私密标识 -->
                  <div
                    :class="[
                      'absolute top-2 right-2 px-2 py-1 text-xs rounded-md',
                      work.isPublic ? 'bg-primary text-white' : 'bg-white text-neutral-dark',
                    ]"
                  >
                    {{ work.isPublic ? '已公开' : '未公开' }}
                  </div>
                </div>

                <div class="relative md:w-1/2">
                  <img
                    :src="work.afterImage"
                    alt="修图后"
                    class="w-full aspect-square object-cover"
                  />
                  <div
                    class="absolute top-2 left-2 bg-primary text-white text-xs px-2 py-1 rounded"
                  >
                    修图后
                  </div>
                </div>
              </div>

              <div class="p-4">
                <h3 class="font-medium text-neutral-dark">{{ work.title }}</h3>
                <p class="text-sm text-neutral-dark mb-2">{{ work.description }}</p>

                <div class="flex justify-between items-center">
                  <span class="text-xs text-neutral-dark">{{ work.createdAt }}</span>
                  <div class="flex space-x-2">
                    <button class="p-1 text-neutral-dark hover:text-primary">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                        />
                      </svg>
                    </button>
                    <button class="p-1 text-neutral-dark hover:text-error">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-4 w-4"
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
                </div>
              </div>
            </div>
          </div>

          <!-- 空状态 -->
          <div
            v-if="filteredRetouchingPortfolio.length === 0"
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
                d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
              />
            </svg>
            <h3 class="text-lg font-medium text-neutral-dark mb-2">暂无修图作品</h3>
            <p class="text-neutral-dark mb-4">您还没有上传任何修图作品</p>
            <button
              class="px-4 py-2 bg-primary text-white rounded-md hover:bg-green-dark transition-colors"
            >
              开始上传
            </button>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from 'vue'
import { useUserStore } from '../stores/userStore'

export default defineComponent({
  name: 'PortfolioView',
  setup() {
    // 使用集中管理的用户存储
    const userStore = useUserStore()

    // 状态变量
    const loading = ref(true)
    const error = ref('')

    // 标签状态
    const activeTab = ref('all') // 'all', 'public', 'private'
    const portfolioType = ref('photography') // 'photography', 'retouching'

    // 模拟摄影作品集数据
    const photographyPortfolio = ref([
      {
        id: 1,
        url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
        title: '日系人像',
        category: '人像摄影',
        isPublic: true,
        createdAt: '2023-06-15',
      },
      {
        id: 2,
        url: 'https://images.unsplash.com/photo-1554151228-14d9def656e4',
        title: '城市街拍',
        category: '街拍',
        isPublic: true,
        createdAt: '2023-07-22',
      },
      {
        id: 3,
        url: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04',
        title: '自然光人像',
        category: '人像摄影',
        isPublic: false,
        createdAt: '2023-08-10',
      },
      {
        id: 4,
        url: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e',
        title: '夏日写真',
        category: '人像摄影',
        isPublic: false,
        createdAt: '2023-09-05',
      },
    ])

    // 模拟修图作品集数据
    const retouchingPortfolio = ref([
      {
        id: 1,
        title: '人像磨皮精修',
        description: '专业人像精修，自然肤色和质感',
        beforeImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
        afterImage: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e',
        isPublic: true,
        createdAt: '2023-05-12',
      },
      {
        id: 2,
        title: '风景照片调色',
        description: '增强色彩和对比度，突出主体',
        beforeImage: 'https://images.unsplash.com/photo-1504257432389-52343af06ae3',
        afterImage: 'https://images.unsplash.com/photo-1511765224389-37f0e77cf0eb',
        isPublic: false,
        createdAt: '2023-10-18',
      },
    ])

    // 根据标签筛选的摄影作品
    const filteredPhotographyPortfolio = computed(() => {
      if (activeTab.value === 'all') {
        return photographyPortfolio.value
      } else if (activeTab.value === 'public') {
        return photographyPortfolio.value.filter((item) => item.isPublic)
      } else {
        return photographyPortfolio.value.filter((item) => !item.isPublic)
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

    // 获取用户信息和作品集
    const fetchPortfolio = async () => {
      loading.value = true
      error.value = ''

      try {
        // 初始化userStore，从本地存储或API获取用户信息
        if (!userStore.isAuthenticated) {
          await userStore.initializeUser()
        }

        // 根据角色设置初始标签
        if (userStore.isPhotographer) {
          portfolioType.value = 'photography'
        } else if (userStore.isRetoucher) {
          portfolioType.value = 'retouching'
        }

        // 这里应该继续获取作品集数据
        // 目前使用模拟数据

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

    // 组件挂载时获取数据
    onMounted(() => {
      fetchPortfolio()
    })

    return {
      userStore,
      loading,
      error,
      activeTab,
      portfolioType,
      photographyPortfolio,
      retouchingPortfolio,
      filteredPhotographyPortfolio,
      filteredRetouchingPortfolio,
      fetchPortfolio,
    }
  },
})
</script>
