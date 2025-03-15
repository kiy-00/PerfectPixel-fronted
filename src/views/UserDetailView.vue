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

    <!-- 用户资料内容 -->
    <template v-else>
      <!-- 用户资料头部 -->
      <div class="bg-primary text-white p-6 shadow-md">
        <div class="container mx-auto">
          <div class="flex flex-col md:flex-row items-center md:items-start">
            <!-- 用户头像 -->
            <div
              class="h-24 w-24 rounded-full border-4 border-white bg-green-dark text-white flex items-center justify-center text-4xl font-bold mr-6"
            >
              {{ user.name ? user.name.charAt(0).toUpperCase() : '?' }}
            </div>

            <!-- 用户基本信息 -->
            <div class="mt-4 md:mt-0 text-center md:text-left">
              <h1 class="text-3xl font-bold">{{ user.name }}</h1>
              <p class="text-sm text-green-light">@{{ user.username }}</p>
              <p class="text-green-light mt-1">
                <span v-if="user.isRetoucher">专业修图师</span>
                <span v-if="user.isRetoucher && user.isPhotographer"> · </span>
                <span v-if="user.isPhotographer">专业摄影师</span>
              </p>
              <p class="text-green-light text-sm mt-1">
                <span class="mr-4">注册于 {{ formatDate(user.createdAt) }}</span>
                <span>上次活跃 {{ formatDate(user.lastActive) }}</span>
              </p>

              <div class="mt-4 flex items-center justify-center md:justify-start space-x-4">
                <button
                  v-if="user.isRetoucher"
                  class="bg-white text-primary px-4 py-2 rounded-md font-medium hover:bg-green-light transition-colors"
                  @click="createRetouchOrder"
                >
                  修图下单
                </button>
                <button
                  v-if="user.isPhotographer"
                  class="bg-white text-primary px-4 py-2 rounded-md font-medium hover:bg-green-light transition-colors"
                  @click="createPhotoshootOrder"
                >
                  约拍预约
                </button>
                <button
                  class="bg-transparent border border-white text-white px-4 py-2 rounded-md font-medium hover:bg-green-dark transition-colors"
                >
                  联系TA
                </button>
                <button
                  class="bg-transparent border border-white text-white px-4 py-2 rounded-md font-medium hover:bg-green-dark transition-colors"
                >
                  关注
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 主要内容区域 -->
      <div class="container mx-auto px-4 mt-8">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <!-- 左侧用户详细信息 -->
          <div class="md:col-span-1">
            <!-- 数据统计卡片 -->
            <div class="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 class="text-xl font-semibold text-neutral-dark mb-4">统计数据</h2>
              <div class="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div class="text-2xl font-bold text-primary">{{ user.completedOrders }}</div>
                  <div class="text-sm text-neutral-dark">完成订单</div>
                </div>
                <div>
                  <div class="text-2xl font-bold text-primary">{{ user.portfolioCount }}</div>
                  <div class="text-sm text-neutral-dark">作品集</div>
                </div>
                <div>
                  <div class="text-2xl font-bold text-primary">{{ user.following || 0 }}</div>
                  <div class="text-sm text-neutral-dark">关注人数</div>
                </div>
                <div>
                  <div class="text-2xl font-bold text-primary">{{ user.followers || 0 }}</div>
                  <div class="text-sm text-neutral-dark">粉丝人数</div>
                </div>
              </div>
            </div>

            <!-- 修图师信息卡片 -->
            <div v-if="user.isRetoucher" class="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 class="text-xl font-semibold text-neutral-dark mb-4">修图师资料</h2>
              <div class="space-y-4">
                <div>
                  <h3 class="text-sm text-neutral-dark font-medium">擅长领域</h3>
                  <div class="mt-2 flex flex-wrap gap-2">
                    <span
                      v-for="(category, index) in user.retoucherInfo.categories"
                      :key="`retouch-${index}`"
                      class="px-2 py-1 bg-green-light bg-opacity-20 text-primary text-xs rounded-md"
                    >
                      {{ category }}
                    </span>
                  </div>
                </div>
                <div>
                  <h3 class="text-sm text-neutral-dark font-medium">修图经验</h3>
                  <p class="mt-1 text-primary">
                    {{ getExperienceText(user.retoucherInfo.experience) }}
                  </p>
                </div>
                <div>
                  <h3 class="text-sm text-neutral-dark font-medium">使用软件</h3>
                  <p class="mt-1 text-primary">{{ user.retoucherInfo.software }}</p>
                </div>
                <div>
                  <h3 class="text-sm text-neutral-dark font-medium">修图介绍</h3>
                  <p class="mt-1 text-primary">{{ user.retoucherInfo.bio }}</p>
                </div>
              </div>
            </div>

            <!-- 摄影师信息卡片 -->
            <div v-if="user.isPhotographer" class="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 class="text-xl font-semibold text-neutral-dark mb-4">摄影师资料</h2>
              <div class="space-y-4">
                <div>
                  <h3 class="text-sm text-neutral-dark font-medium">擅长领域</h3>
                  <div class="mt-2 flex flex-wrap gap-2">
                    <span
                      v-for="(category, index) in user.photographerInfo.categories"
                      :key="`photo-${index}`"
                      class="px-2 py-1 bg-green-light bg-opacity-20 text-primary text-xs rounded-md"
                    >
                      {{ category }}
                    </span>
                  </div>
                </div>
                <div>
                  <h3 class="text-sm text-neutral-dark font-medium">摄影经验</h3>
                  <p class="mt-1 text-primary">
                    {{ getExperienceText(user.photographerInfo.experience) }}
                  </p>
                </div>
                <div>
                  <h3 class="text-sm text-neutral-dark font-medium">摄影设备</h3>
                  <p class="mt-1 text-primary">{{ user.photographerInfo.equipment }}</p>
                </div>
                <div>
                  <h3 class="text-sm text-neutral-dark font-medium">摄影介绍</h3>
                  <p class="mt-1 text-primary">{{ user.photographerInfo.bio }}</p>
                </div>
              </div>
            </div>

            <!-- 个人信息卡片 -->
            <div class="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 class="text-xl font-semibold text-neutral-dark mb-4">个人资料</h2>
              <div class="space-y-4">
                <div>
                  <h3 class="text-sm text-neutral-dark font-medium">所在城市</h3>
                  <p class="mt-1 text-primary">{{ user.city }}</p>
                </div>
                <div>
                  <h3 class="text-sm text-neutral-dark font-medium">个人简介</h3>
                  <p class="mt-1 text-primary">{{ user.bio }}</p>
                </div>
              </div>
            </div>

            <!-- 价格信息卡片 -->
            <div v-if="user.isRetoucher" class="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 class="text-xl font-semibold text-neutral-dark mb-4">修图价格</h2>
              <div class="flex justify-between items-center py-3 border-b border-neutral">
                <span class="text-neutral-dark">基础修图</span>
                <span class="font-semibold text-primary"
                  >¥{{ user.retoucherInfo.pricePerPhoto }} / 张</span
                >
              </div>
              <div class="flex justify-between items-center py-3 border-b border-neutral">
                <span class="text-neutral-dark">高级精修</span>
                <span class="font-semibold text-primary"
                  >¥{{ user.retoucherInfo.pricePerPhoto * 2 }} / 张</span
                >
              </div>
              <div class="flex justify-between items-center py-3">
                <span class="text-neutral-dark">创意修图</span>
                <span class="font-semibold text-primary"
                  >¥{{ user.retoucherInfo.pricePerPhoto * 3 }} / 张</span
                >
              </div>
              <button
                @click="createRetouchOrder"
                class="mt-4 w-full py-2 bg-primary text-white rounded-md hover:bg-green-dark transition-colors"
              >
                修图下单
              </button>
            </div>

            <!-- 摄影价格信息 -->
            <div v-if="user.isPhotographer" class="bg-white rounded-lg shadow-md p-6">
              <h2 class="text-xl font-semibold text-neutral-dark mb-4">拍摄价格</h2>
              <div class="flex justify-between items-center py-3 border-b border-neutral">
                <span class="text-neutral-dark">普通套餐</span>
                <span class="font-semibold text-primary"
                  >¥{{ user.photographerInfo.pricePerHour }} / 小时</span
                >
              </div>
              <div class="flex justify-between items-center py-3 border-b border-neutral">
                <span class="text-neutral-dark">精品套餐</span>
                <span class="font-semibold text-primary"
                  >¥{{ user.photographerInfo.pricePerHour * 1.5 }} / 小时</span
                >
              </div>
              <div class="flex justify-between items-center py-3">
                <span class="text-neutral-dark">商业套餐</span>
                <span class="font-semibold text-primary"
                  >¥{{ user.photographerInfo.pricePerHour * 2 }} / 小时</span
                >
              </div>
              <button
                @click="createPhotoshootOrder"
                class="mt-4 w-full py-2 bg-primary text-white rounded-md hover:bg-green-dark transition-colors"
              >
                约拍预约
              </button>
            </div>
          </div>

          <!-- 右侧作品集展示 -->
          <div class="md:col-span-2">
            <div class="bg-white rounded-lg shadow-md p-6">
              <!-- 作品集切换标签 -->
              <div class="mb-6 border-b border-green-light">
                <div class="flex">
                  <button
                    v-if="user.isRetoucher"
                    @click="activePortfolioTab = 'retouching'"
                    :class="[
                      'px-4 py-2 font-medium text-sm transition-colors border-b-2 -mb-px',
                      activePortfolioTab === 'retouching'
                        ? 'border-primary text-primary'
                        : 'border-transparent text-neutral-dark hover:text-primary',
                    ]"
                  >
                    修图作品
                  </button>
                  <button
                    v-if="user.isPhotographer"
                    @click="activePortfolioTab = 'photography'"
                    :class="[
                      'px-4 py-2 font-medium text-sm transition-colors border-b-2 -mb-px',
                      activePortfolioTab === 'photography'
                        ? 'border-primary text-primary'
                        : 'border-transparent text-neutral-dark hover:text-primary',
                    ]"
                  >
                    摄影作品
                  </button>
                </div>
              </div>

              <!-- 修图作品集 -->
              <div v-if="activePortfolioTab === 'retouching' && user.isRetoucher">
                <div class="flex justify-between items-center mb-6">
                  <h2 class="text-xl font-semibold text-neutral-dark">修图作品集</h2>
                </div>

                <!-- 修图作品集列表 -->
                <div class="mb-8">
                  <div v-for="(portfolio, index) in retoucherPortfolios" :key="index" class="mb-8">
                    <h3 class="text-lg font-semibold text-primary mb-3">{{ portfolio.title }}</h3>
                    <p class="text-sm text-neutral-dark mb-4">{{ portfolio.description }}</p>

                    <!-- 修图前后对比展示 -->
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div
                        v-for="(item, itemIndex) in portfolio.items"
                        :key="itemIndex"
                        class="bg-neutral bg-opacity-10 rounded-lg p-3"
                      >
                        <div class="flex space-x-2 mb-3">
                          <div class="w-1/2 relative">
                            <img
                              :src="item.beforeImage"
                              alt="修图前"
                              class="w-full h-48 object-cover rounded-md"
                            />
                            <div
                              class="absolute top-2 left-2 px-2 py-1 bg-black bg-opacity-50 text-white text-xs rounded"
                            >
                              修图前
                            </div>
                          </div>
                          <div class="w-1/2 relative">
                            <img
                              :src="item.afterImage"
                              alt="修图后"
                              class="w-full h-48 object-cover rounded-md"
                            />
                            <div
                              class="absolute top-2 left-2 px-2 py-1 bg-black bg-opacity-50 text-white text-xs rounded"
                            >
                              修图后
                            </div>
                          </div>
                        </div>
                        <p class="text-xs text-neutral-dark">{{ item.description }}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- 无作品集状态 -->
                <div v-if="retoucherPortfolios.length === 0" class="text-center py-10">
                  <p class="text-neutral-dark">该用户暂无公开修图作品集</p>
                </div>
              </div>

              <!-- 摄影作品集 -->
              <div v-if="activePortfolioTab === 'photography' && user.isPhotographer">
                <div class="flex justify-between items-center mb-6">
                  <h2 class="text-xl font-semibold text-neutral-dark">摄影作品集</h2>
                </div>

                <!-- 摄影作品网格 -->
                <div class="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
                  <div
                    v-for="(photo, index) in photographyPortfolios"
                    :key="index"
                    class="group relative overflow-hidden rounded-lg aspect-square"
                  >
                    <img
                      :src="photo.imageUrl"
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
                <div v-if="photographyPortfolios.length === 0" class="text-center py-10">
                  <p class="text-neutral-dark">该用户暂无公开摄影作品</p>
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
import { defineComponent, ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  userAPI,
  retoucherAPI,
  photographerAPI,
  retoucherPortfolioAPI,
  photographerPortfolioAPI,
} from '../services/apiService'

export default defineComponent({
  name: 'UserDetailView',
  setup() {
    const route = useRoute()
    const router = useRouter()

    const loading = ref(true)
    const error = ref('')
    const activePortfolioTab = ref('retouching')

    // 获取userId参数
    const userId = parseInt(route.params.id as string)

    // 用户信息对象
    const user = ref({
      id: userId,
      name: '',
      username: '',
      createdAt: '',
      lastActive: '',
      city: '',
      bio: '',
      completedOrders: 0,
      portfolioCount: 0,
      followers: 0,
      following: 0,

      // 角色标识
      isRetoucher: false,
      isPhotographer: false,

      // 修图师专属信息
      retoucherInfo: {
        categories: [],
        experience: '',
        software: '',
        bio: '',
        pricePerPhoto: 0,
      },

      // 摄影师专属信息
      photographerInfo: {
        categories: [],
        experience: '',
        equipment: '',
        bio: '',
        pricePerHour: 0,
      },
    })

    // 修图作品集数据
    const retoucherPortfolios = ref([
      {
        id: 1,
        title: '人像精修合集',
        description: '各种风格的人像修图作品，注重皮肤质感和色彩表现。',
        category: 'Portrait',
        items: [
          {
            id: 101,
            beforeImage:
              'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&h=500&fit=crop',
            afterImage:
              'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=500&h=500&fit=crop',
            description: '自然风格人像精修，提亮肤色，保持自然质感',
          },
          {
            id: 102,
            beforeImage:
              'https://images.unsplash.com/photo-1554151228-14d9def656e4?w=500&h=500&fit=crop',
            afterImage:
              'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=500&h=500&fit=crop',
            description: '时尚风格修图，增强对比度和色彩表现',
          },
        ],
      },
      {
        id: 2,
        title: '产品摄影精修',
        description: '各类产品精修作品，注重细节展示和质感表达。',
        category: 'Product',
        items: [
          {
            id: 201,
            beforeImage:
              'https://images.unsplash.com/photo-1491637639811-60e2756cc1c7?w=500&h=500&fit=crop',
            afterImage:
              'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=500&h=500&fit=crop',
            description: '产品精修，提升质感和细节，调整色彩平衡',
          },
        ],
      },
    ])

    // 摄影作品集数据
    const photographyPortfolios = ref([
      {
        id: 301,
        title: '城市掠影',
        category: '风景摄影',
        imageUrl:
          'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=500&h=500&fit=crop',
      },
      {
        id: 302,
        title: '日系写真',
        category: '人像摄影',
        imageUrl:
          'https://images.unsplash.com/photo-1504257432389-52343af06ae3?w=500&h=500&fit=crop',
      },
      {
        id: 303,
        title: '街头印象',
        category: '街拍',
        imageUrl:
          'https://images.unsplash.com/photo-1511765224389-37f0e77cf0eb?w=500&h=500&fit=crop',
      },
      {
        id: 304,
        title: '秋日光影',
        category: '风景摄影',
        imageUrl:
          'https://images.unsplash.com/photo-1476611550463-8c34582b4d90?w=500&h=500&fit=crop',
      },
      {
        id: 305,
        title: '都市剪影',
        category: '建筑摄影',
        imageUrl:
          'https://images.unsplash.com/photo-1533582437341-8b0cd28b3af7?w=500&h=500&fit=crop',
      },
      {
        id: 306,
        title: '人间烟火',
        category: '纪实摄影',
        imageUrl:
          'https://images.unsplash.com/photo-1465572089651-8fde36c892dd?w=500&h=500&fit=crop',
      },
    ])

    // 获取用户资料的函数
    const fetchUserProfile = async () => {
      loading.value = true
      error.value = ''

      try {
        // 使用userId请求用户详情
        console.log('获取用户信息，userId:', userId)
        const response = await userAPI.getUserPublicProfile(userId)

        console.log('获取到用户数据:', response.data)

        // 更新用户基本信息
        const userData = response.data
        user.value = {
          ...user.value,
          username: userData.username,
          name:
            `${userData.firstName || ''} ${userData.lastName || ''}`.trim() || userData.username,
          createdAt: userData.createdAt,
          lastActive: userData.lastLogin || userData.createdAt,
          city: userData.city || '未知',
          bio: userData.biography || '这个用户很懒，还没有填写个人简介',

          // 检查用户角色
          isRetoucher: userData.roles?.includes('Retoucher') || false,
          isPhotographer: userData.roles?.includes('Photographer') || false,
        }

        // 如果用户是修图师，获取修图师信息
        if (user.value.isRetoucher) {
          await fetchRetoucherInfo(userId)
        }

        // 如果用户是摄影师，获取摄影师信息
        if (user.value.isPhotographer) {
          await fetchPhotographerInfo(userId)
        }

        // 设置初始激活的作品集标签
        setInitialActiveTab()

        loading.value = false
      } catch (err: any) {
        console.error('获取用户信息失败:', err)
        error.value = '获取用户信息失败，请稍后再试'
        loading.value = false
      }
    }

    // 获取修图师详情
    const fetchRetoucherInfo = async (userId: number) => {
      try {
        // 先获取retoucherId
        const retoucherIdResponse = await userAPI.getRetoucherId(userId)
        const retoucherId = retoucherIdResponse.data.retoucherId

        // 获取修图师详情
        const retoucherResponse = await retoucherAPI.getRetoucherById(retoucherId)
        const retoucherData = retoucherResponse.data

        // 更新修图师信息
        user.value.retoucherInfo = {
          categories: retoucherData.expertise.split('、').map((item: string) => item.trim()),
          experience: getExperienceLevel(retoucherData.experience || 0),
          software: retoucherData.software,
          bio: retoucherData.bio,
          pricePerPhoto: retoucherData.pricePerPhoto,
        }

        // 获取修图作品集
        await fetchRetoucherPortfolios(retoucherId)
      } catch (err) {
        console.error('获取修图师信息失败:', err)
      }
    }

    // 获取摄影师详情
    const fetchPhotographerInfo = async (userId: number) => {
      try {
        // 先获取photographerId
        const photographerIdResponse = await userAPI.getPhotographerId(userId)
        const photographerId = photographerIdResponse.data.photographerId

        // 获取摄影师详情
        const photographerResponse = await photographerAPI.getPhotographerById(photographerId)
        const photographerData = photographerResponse.data

        // 更新摄影师信息
        user.value.photographerInfo = {
          categories:
            photographerData.specialties?.split(',').map((item: string) => item.trim()) || [],
          experience: getExperienceLevel(photographerData.experience || 0),
          equipment: photographerData.equipment,
          bio: photographerData.bio,
          pricePerHour: photographerData.hourlyRate || 0,
        }

        // 获取摄影作品集
        await fetchPhotographyPortfolios(photographerId)
      } catch (err) {
        console.error('获取摄影师信息失败:', err)
      }
    }

    // 获取修图师作品集
    const fetchRetoucherPortfolios = async (retoucherId: number) => {
      try {
        const response = await retoucherPortfolioAPI.getPublicPortfolios(retoucherId)

        // 这里需要对作品集数据进行处理，格式化为前端需要的结构
        // retoucherPortfolios.value = ...处理逻辑...
      } catch (err) {
        console.error('获取修图作品集失败:', err)
      }
    }

    // 获取摄影作品集
    const fetchPhotographyPortfolios = async (photographerId: number) => {
      try {
        const response = await photographerPortfolioAPI.getPublicPortfolios(photographerId)

        // 这里需要对作品集数据进行处理，格式化为前端需要的结构
        // photographyPortfolios.value = ...处理逻辑...
      } catch (err) {
        console.error('获取摄影作品集失败:', err)
      }
    }

    // 根据经验年数返回级别
    const getExperienceLevel = (years: number) => {
      if (years < 1) return 'beginner'
      if (years < 3) return 'intermediate'
      if (years < 5) return 'advanced'
      return 'expert'
    }

    // 设置初始激活的标签页
    const setInitialActiveTab = () => {
      // 如果用户是摄影师也是修图师，根据URL参数选择初始标签
      if (user.value.isRetoucher && user.value.isPhotographer) {
        const defaultTab = route.query.tab as string
        if (defaultTab === 'photography') {
          activePortfolioTab.value = 'photography'
        } else {
          // 默认展示修图作品
          activePortfolioTab.value = 'retouching'
        }
      } else if (user.value.isPhotographer) {
        // 只是摄影师
        activePortfolioTab.value = 'photography'
      } else if (user.value.isRetoucher) {
        // 只是修图师
        activePortfolioTab.value = 'retouching'
      }
    }

    // 创建修图订单
    const createRetouchOrder = () => {
      // 获取retoucherId并导航到创建订单页面
      userAPI
        .getRetoucherId(userId)
        .then((response) => {
          const retoucherId = response.data.retoucherId
          router.push({
            path: '/create-retouch-order',
            query: { retoucherId: retoucherId.toString() },
          })
        })
        .catch((err) => {
          console.error('获取修图师ID失败:', err)
          alert('无法创建订单，请稍后再试')
        })
    }

    // 创建约拍订单
    const createPhotoshootOrder = () => {
      // 获取photographerId并导航到创建订单页面
      userAPI
        .getPhotographerId(userId)
        .then((response) => {
          const photographerId = response.data.photographerId
          router.push({
            path: '/create-photoshoot-order',
            query: { photographerId: photographerId.toString() },
          })
        })
        .catch((err) => {
          console.error('获取摄影师ID失败:', err)
          alert('无法创建订单，请稍后再试')
        })
    }

    onMounted(() => {
      fetchUserProfile()
    })

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

    // 获取经验等级对应的文字
    const getExperienceText = (experience: string) => {
      const experienceMap: Record<string, string> = {
        beginner: '入门级（1年以下）',
        intermediate: '进阶级（1-3年）',
        advanced: '专业级（3-5年）',
        expert: '资深级（5年以上）',
      }
      return experienceMap[experience] || experience
    }

    return {
      loading,
      error,
      user,
      activePortfolioTab,
      retoucherPortfolios,
      photographyPortfolios,
      formatDate,
      getExperienceText,
      createRetouchOrder,
      createPhotoshootOrder,
      fetchUserProfile,
    }
  },
})
</script>
