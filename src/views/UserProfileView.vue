<template>
  <div class="bg-neutral min-h-screen pb-10">
    <!-- 加载中状态 -->
    <div v-if="loading" class="flex justify-center items-center h-screen">
      <div class="text-center">
        <div
          class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"
        ></div>
        <p class="mt-4 text-neutral-dark">正在加载用户资料...</p>
      </div>
    </div>

    <!-- 错误提示 -->
    <div v-else-if="error" class="flex justify-center items-center h-screen">
      <div class="text-center bg-white p-8 rounded-lg shadow-md">
        <div class="text-error text-xl mb-4">加载失败</div>
        <p class="text-neutral-dark mb-6">{{ error }}</p>
        <button @click="fetchUserProfile" class="px-4 py-2 bg-primary text-white rounded-md">
          重试
        </button>
      </div>
    </div>

    <!-- 个人资料内容 -->
    <template v-else>
      <!-- 个人资料头部 -->
      <div class="bg-primary text-white p-6 shadow-md">
        <div class="container mx-auto">
          <div class="flex flex-col md:flex-row items-center md:items-start">
            <!-- 用户头像 -->
            <div
              class="h-24 w-24 rounded-full border-4 border-white bg-green-dark text-white flex items-center justify-center text-4xl font-bold mr-6"
            >
              {{ userStore.userInitial }}
            </div>

            <!-- 用户基本信息 -->
            <div class="mt-4 md:mt-0 text-center md:text-left">
              <h1 class="text-3xl font-bold">{{ userStore.userInfo?.username }}</h1>
              <p class="text-green-light mt-1">{{ userStore.formattedRoles }}</p>
              <p class="text-green-light text-sm mt-1">
                <span class="mr-4">注册于 {{ formatDate(userStore.userInfo?.createdAt) }}</span>
                <span>上次登录 {{ formatDate(userStore.userInfo?.lastLogin) }}</span>
              </p>

              <div class="mt-4 flex items-center justify-center md:justify-start space-x-4">
                <button
                  class="bg-white text-primary px-4 py-2 rounded-md font-medium hover:bg-green-light transition-colors"
                >
                  编辑资料
                </button>
                <button
                  class="bg-transparent border border-white text-white px-4 py-2 rounded-md font-medium hover:bg-green-dark transition-colors"
                >
                  联系我
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 主要内容区域 -->
      <div class="container mx-auto px-4 mt-8">
        <!-- 查看所有作品集的按钮 - 顶部操作区 -->
        <div class="flex justify-end mb-6">
          <router-link
            to="/portfolio"
            class="flex items-center px-6 py-2 bg-primary text-white rounded-lg shadow hover:bg-green-dark transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5 mr-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M4 3a2 2 0 100 4h12a2 2 0 100-4H4z" />
              <path
                fill-rule="evenodd"
                d="M3 8h14v7a2 2 0 01-2 2H5a2 2 0 01-2-2V8zm5 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z"
                clip-rule="evenodd"
              />
            </svg>
            查看我的所有作品集
          </router-link>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <!-- 左侧用户详细信息 -->
          <div class="md:col-span-1">
            <!-- 数据统计卡片 -->
            <div class="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 class="text-xl font-semibold text-neutral-dark mb-4">统计数据</h2>
              <div class="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div class="text-2xl font-bold text-primary">{{ photoCount }}</div>
                  <div class="text-sm text-neutral-dark">作品</div>
                </div>
                <div>
                  <div class="text-2xl font-bold text-primary">
                    {{ userStore.userInfo?.followersCount || 0 }}
                  </div>
                  <div class="text-sm text-neutral-dark">粉丝</div>
                </div>
                <div>
                  <div class="text-2xl font-bold text-primary">
                    {{ userStore.userInfo?.followingCount || 0 }}
                  </div>
                  <div class="text-sm text-neutral-dark">关注</div>
                </div>
              </div>
            </div>

            <!-- 个人信息卡片 -->
            <div class="bg-white rounded-lg shadow-md p-6">
              <h2 class="text-xl font-semibold text-neutral-dark mb-4">个人资料</h2>
              <div class="space-y-4">
                <div>
                  <h3 class="text-sm text-neutral-dark font-medium">全名</h3>
                  <p class="mt-1 text-primary">{{ userStore.fullName || '暂无' }}</p>
                </div>
                <div>
                  <h3 class="text-sm text-neutral-dark font-medium">邮箱</h3>
                  <p class="mt-1 text-primary">{{ userStore.userInfo?.email }}</p>
                </div>
                <div>
                  <h3 class="text-sm text-neutral-dark font-medium">电话</h3>
                  <p class="mt-1 text-primary">{{ userStore.userInfo?.phoneNumber || '暂无' }}</p>
                </div>
                <div>
                  <h3 class="text-sm text-neutral-dark font-medium">个人简介</h3>
                  <p class="mt-1 text-primary">
                    {{ userStore.userInfo?.biography || '用户暂未填写个人简介' }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- 右侧作品集展示 -->
          <div class="md:col-span-2">
            <div class="bg-white rounded-lg shadow-md p-6">
              <!-- 作品集切换标签 -->
              <div class="mb-6 border-b border-green-light">
                <div class="flex">
                  <button
                    @click="activePortfolioTab = 'photography'"
                    :class="[
                      'px-4 py-2 font-medium text-sm transition-colors border-b-2 -mb-px',
                      activePortfolioTab === 'photography'
                        ? 'border-primary text-primary'
                        : 'border-transparent text-neutral-dark hover:text-primary',
                    ]"
                  >
                    摄影作品集
                  </button>
                  <button
                    @click="activePortfolioTab = 'retouching'"
                    :class="[
                      'px-4 py-2 font-medium text-sm transition-colors border-b-2 -mb-px',
                      activePortfolioTab === 'retouching'
                        ? 'border-primary text-primary'
                        : 'border-transparent text-neutral-dark hover:text-primary',
                    ]"
                  >
                    修图作品集
                  </button>
                </div>
              </div>

              <!-- 摄影作品集 -->
              <div v-if="activePortfolioTab === 'photography'">
                <div class="flex justify-between items-center mb-6">
                  <h2 class="text-xl font-semibold text-neutral-dark">摄影作品集</h2>
                  <!-- <button
                    v-if="isPhotographer"
                    class="text-primary hover:text-green-dark transition-colors"
                  >
                    查看全部
                  </button> -->
                </div>

                <!-- 摄影师角色验证 -->
                <template v-if="isPhotographer">
                  <!-- 摄影作品网格 -->
                  <div
                    v-if="photographyPortfolio.length > 0"
                    class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                  >
                    <div
                      v-for="(photo, index) in photographyPortfolio"
                      :key="index"
                      class="group relative overflow-hidden rounded-lg aspect-square"
                    >
                      <img
                        :src="photo.url"
                        :alt="photo.title"
                        class="w-full h-full object-cover transition-transform group-hover:scale-105"
                      />
                      <div
                        class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4"
                      >
                        <div class="text-white">
                          <h3 class="font-medium">{{ photo.title }}</h3>
                          <p class="text-sm text-green-light">{{ photo.category }}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- 无摄影作品状态 -->
                  <div v-else class="bg-neutral bg-opacity-20 rounded-lg p-6 text-center">
                    <div class="text-neutral-dark">暂无摄影作品</div>
                    <button
                      class="mt-4 px-4 py-2 bg-primary text-white rounded-md hover:bg-green-dark transition-colors"
                    >
                      上传第一张摄影作品
                    </button>
                  </div>
                </template>

                <!-- 非摄影师提示 -->
                <div v-else class="bg-neutral bg-opacity-20 rounded-lg p-8 text-center">
                  <div class="text-neutral-dark text-lg mb-3">您还不是认证摄影师</div>
                  <p class="text-sm text-neutral-dark mb-6">
                    成为认证摄影师可以展示您的摄影作品集，接受约拍邀请
                  </p>
                  <button
                    class="px-6 py-3 bg-primary text-white rounded-md hover:bg-green-dark transition-colors"
                  >
                    去认证摄影师
                  </button>
                </div>
              </div>

              <!-- 修图作品集 -->
              <div v-else-if="activePortfolioTab === 'retouching'">
                <div class="flex justify-between items-center mb-6">
                  <h2 class="text-xl font-semibold text-neutral-dark">修图作品集</h2>
                  <!-- <button
                    v-if="isRetoucher"
                    class="text-primary hover:text-green-dark transition-colors"
                  >
                    查看全部
                  </button> -->
                </div>

                <!-- 修图师角色验证 -->
                <template v-if="isRetoucher">
                  <!-- 修图作品网格 -->
                  <!-- 修图作品网格 -->
                  <div
                    v-if="retoucherPublicPortfolios.length > 0"
                    class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                  >
                    <div
                      v-for="(portfolio, index) in retoucherPublicPortfolios.slice(0, 3)"
                      :key="portfolio.portfolioId"
                      class="group relative overflow-hidden rounded-lg aspect-square"
                    >
                      <img
                        :src="portfolio.coverImageUrl"
                        :alt="portfolio.title"
                        class="w-full h-full object-cover transition-transform group-hover:scale-105"
                      />
                      <div
                        class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4"
                      >
                        <div class="text-white">
                          <h3 class="font-medium">{{ portfolio.title }}</h3>
                          <p class="text-sm text-green-light">{{ portfolio.category }}</p>
                        </div>
                      </div>
                    </div>
                    <!-- 如果作品集不足三个，添加占位元素 -->
                    <div
                      v-for="i in Math.max(0, 3 - retoucherPublicPortfolios.length)"
                      :key="`placeholder-${i}`"
                      class="bg-neutral bg-opacity-20 rounded-lg aspect-square flex items-center justify-center"
                    >
                      <div class="text-neutral-dark text-center">
                        <div class="text-3xl mb-2">+</div>
                        <div>添加更多作品集</div>
                      </div>
                    </div>
                  </div>

                  <!-- 无修图作品状态 -->
                  <div v-else class="bg-neutral bg-opacity-20 rounded-lg p-6 text-center">
                    <div class="text-neutral-dark">暂无修图作品</div>
                    <button
                      class="mt-4 px-4 py-2 bg-primary text-white rounded-md hover:bg-green-dark transition-colors"
                    >
                      上传第一组修图作品
                    </button>
                  </div>
                </template>

                <!-- 非修图师提示 -->
                <div v-else class="bg-neutral bg-opacity-20 rounded-lg p-8 text-center">
                  <div class="text-neutral-dark text-lg mb-3">您还不是认证修图师</div>
                  <p class="text-sm text-neutral-dark mb-6">
                    成为认证修图师可以展示您的修图技术，接受修图订单
                  </p>
                  <button
                    class="px-6 py-3 bg-primary text-white rounded-md hover:bg-green-dark transition-colors"
                  >
                    去认证修图师
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from 'vue'
import { useUserStore } from '../stores/userStore'
import { retoucherPortfolioAPI } from '../services/apiService.ts' // 确保路径正确

export default defineComponent({
  name: 'UserProfileView',
  setup() {
    // 使用用户信息存储
    const userStore = useUserStore()

    // 状态变量
    const loading = ref(false)
    const error = ref('')

    // 模拟统计数据 - 只保留照片数，其他使用真实数据
    const photoCount = ref(48)

    // 活动作品集标签
    const activePortfolioTab = ref('photography')

    // 角色状态判断 - 使用store中的getter
    const isPhotographer = computed(() => userStore.isPhotographer)
    const isRetoucher = computed(() => userStore.isRetoucher)

    // 模拟作品集数据 - 实际项目中通常会有专门的API获取
    const portfolio = ref([
      {
        url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
        title: '日系人像',
        category: '人像摄影',
      },
      {
        url: 'https://images.unsplash.com/photo-1554151228-14d9def656e4',
        title: '城市街拍',
        category: '街拍',
      },
      {
        url: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04',
        title: '自然光人像',
        category: '人像摄影',
      },
      {
        url: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e',
        title: '夏日写真',
        category: '人像摄影',
      },
      {
        url: 'https://images.unsplash.com/photo-1504257432389-52343af06ae3',
        title: '暮色城市',
        category: '风景摄影',
      },
      {
        url: 'https://images.unsplash.com/photo-1511765224389-37f0e77cf0eb',
        title: '美食记录',
        category: '美食摄影',
      },
    ])

    // 摄影作品集数据
    const photographyPortfolio = ref([
      {
        url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
        title: '日系人像',
        category: '人像摄影',
      },
      {
        url: 'https://images.unsplash.com/photo-1554151228-14d9def656e4',
        title: '城市街拍',
        category: '街拍',
      },
      {
        url: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04',
        title: '自然光人像',
        category: '人像摄影',
      },
      {
        url: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e',
        title: '夏日写真',
        category: '人像摄影',
      },
      {
        url: 'https://images.unsplash.com/photo-1504257432389-52343af06ae3',
        title: '暮色城市',
        category: '风景摄影',
      },
      {
        url: 'https://images.unsplash.com/photo-1511765224389-37f0e77cf0eb',
        title: '美食记录',
        category: '美食摄影',
      },
    ])

    const retoucherPublicPortfolios = ref([])

    // 添加获取修图师作品集的方法
    // 添加获取修图师作品集的方法
    const fetchPublicRetoucherPortfolios = async () => {
      if (userStore.retoucherId) {
        try {
          console.log('开始获取修图师作品集, retoucherId:', userStore.retoucherId)
          const response = await retoucherPortfolioAPI.getPublicPortfolios(userStore.retoucherId)
          console.log('修图师作品集API响应:', response.data)

          // 检查并处理图片路径
          retoucherPublicPortfolios.value = response.data.map((portfolio) => {
            // 检查图片路径是否以 http 开头，如果不是则添加基础URL
            const apiBaseUrl = import.meta.env.VITE_STATIC_ASSETS_URL || ''

            // 创建完整的封面图片URL
            const coverImageUrl = portfolio.coverImageUrl.startsWith('http')
              ? portfolio.coverImageUrl
              : `${apiBaseUrl}${portfolio.coverImageUrl}`

            console.log('处理前封面URL:', portfolio.coverImageUrl)
            console.log('处理后封面URL:', coverImageUrl)

            return {
              ...portfolio,
              coverImageUrl: coverImageUrl,
            }
          })

          console.log('处理后的作品集数据:', retoucherPublicPortfolios.value)
        } catch (err) {
          console.error('获取修图师作品集失败:', err)
        }
      } else {
        console.warn('未找到修图师ID，无法获取作品集')
      }
    }

    // 格式化日期
    const formatDate = (dateString?: string) => {
      if (!dateString) return '暂无数据'

      try {
        const date = new Date(dateString)
        return new Intl.DateTimeFormat('zh-CN', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }).format(date)
      } catch (e) {
        console.error('日期格式化错误:', e)
        return dateString
      }
    }

    // 获取用户资料
    const fetchUserProfile = async () => {
      loading.value = true
      error.value = ''

      try {
        console.log('开始获取用户信息...')
        await userStore.fetchUserInfo()
        console.log('获取用户信息成功')
      } catch (err: any) {
        console.error('获取用户信息失败:', err)
        if (err.response?.status === 401) {
          error.value = '登录已过期，请重新登录'
        } else {
          error.value = '获取用户信息失败，请稍后再试'
        }
      } finally {
        loading.value = false
      }
    }

    // 在组件挂载时获取用户资料
    onMounted(async () => {
      loading.value = true
      // 先尝试从本地存储获取用户信息
      const hasStoredUser = userStore.loadUserFromStorage()

      if (!hasStoredUser) {
        // 如果本地没有用户信息，尝试从API获取
        await fetchUserProfile()
      } else {
        loading.value = false
      }

      // 如果用户是修图师，获取作品集
      if (isRetoucher.value) {
        await fetchPublicRetoucherPortfolios()
      }
    })

    return {
      userStore,
      loading,
      error,
      formatDate,
      photoCount,
      fetchUserProfile,
      activePortfolioTab,
      isPhotographer,
      isRetoucher,
      photographyPortfolio,
      retoucherPublicPortfolios,
      fetchPublicRetoucherPortfolios,
    }
  },
})
</script>
