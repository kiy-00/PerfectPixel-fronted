<template>
  <div class="flex min-h-screen bg-neutral">
    <!-- 侧边栏 -->
    <SideBar class="hidden md:block" />

    <!-- 主内容区 -->
    <div class="flex-1">
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
                    @click="openUserProfileModal"
                    class="bg-white text-primary px-4 py-2 rounded-md font-medium hover:bg-green-light transition-colors"
                  >
                    编辑资料
                  </button>
                  <!-- <button
                    class="bg-transparent border border-white text-white px-4 py-2 rounded-md font-medium hover:bg-green-dark transition-colors"
                  >
                    联系我
                  </button> -->
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
                    <div class="text-2xl font-bold text-primary">
                      {{ photographerPortfolioCount }}
                    </div>
                    <div class="text-sm text-neutral-dark">摄影作品</div>
                  </div>
                  <div>
                    <div class="text-2xl font-bold text-primary">{{ retoucherPortfolioCount }}</div>
                    <div class="text-sm text-neutral-dark">修图作品</div>
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

              <!-- 专业信息卡片 -->
              <div class="bg-white rounded-lg shadow-md p-6 mt-6" v-if="photographerDetails">
                <div class="flex justify-between items-center mb-4">
                  <h2 class="text-xl font-semibold text-neutral-dark">摄影师详情</h2>
                  <button
                    @click="openPhotographerModal"
                    class="text-primary hover:text-green-dark transition-colors text-sm flex items-center"
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
                        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                      />
                    </svg>
                    更新资料
                  </button>
                </div>
                <div class="space-y-4">
                  <div>
                    <h3 class="text-sm text-neutral-dark font-medium">专业认证</h3>
                    <p class="mt-1 text-primary flex items-center">
                      <span v-if="photographerDetails.isVerified" class="text-green-600 mr-2"
                        >已认证</span
                      >
                      <span v-else class="text-yellow-600 mr-2">未认证</span>
                      <span v-if="photographerDetails.verifiedAt" class="text-xs text-neutral-dark">
                        (认证于 {{ formatDate(photographerDetails.verifiedAt) }})
                      </span>
                    </p>
                  </div>
                  <div>
                    <h3 class="text-sm text-neutral-dark font-medium">个人简介</h3>
                    <p class="mt-1 text-primary">{{ photographerDetails.bio || '暂无信息' }}</p>
                  </div>
                  <div>
                    <h3 class="text-sm text-neutral-dark font-medium">摄影经验</h3>
                    <p class="mt-1 text-primary">
                      {{ photographerDetails.experience || '暂无信息' }}
                    </p>
                  </div>
                  <div>
                    <h3 class="text-sm text-neutral-dark font-medium">摄影设备</h3>
                    <p class="mt-1 text-primary">
                      {{ photographerDetails.equipmentInfo || '暂无信息' }}
                    </p>
                  </div>
                  <div>
                    <h3 class="text-sm text-neutral-dark font-medium">常驻地</h3>
                    <p class="mt-1 text-primary">
                      {{ photographerDetails.location || '暂无信息' }}
                    </p>
                  </div>
                  <div>
                    <h3 class="text-sm text-neutral-dark font-medium">价格区间</h3>
                    <p class="mt-1 text-primary">
                      {{
                        photographerDetails.priceRangeMin && photographerDetails.priceRangeMax
                          ? `¥${photographerDetails.priceRangeMin} ~ ¥${photographerDetails.priceRangeMax}`
                          : '暂无信息'
                      }}
                    </p>
                  </div>
                </div>
              </div>

              <div class="bg-white rounded-lg shadow-md p-6 mt-6" v-if="retoucherDetails">
                <div class="flex justify-between items-center mb-4">
                  <h2 class="text-xl font-semibold text-neutral-dark">修图师详情</h2>
                  <button
                    @click="openRetoucherModal"
                    class="text-primary hover:text-green-dark transition-colors text-sm flex items-center"
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
                        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                      />
                    </svg>
                    更新资料
                  </button>
                </div>
                <div class="space-y-4">
                  <div>
                    <h3 class="text-sm text-neutral-dark font-medium">专业认证</h3>
                    <p class="mt-1 text-primary flex items-center">
                      <span v-if="retoucherDetails.isVerified" class="text-green-600 mr-2"
                        >已认证</span
                      >
                      <span v-else class="text-yellow-600 mr-2">未认证</span>
                      <span v-if="retoucherDetails.verifiedAt" class="text-xs text-neutral-dark">
                        (认证于 {{ formatDate(retoucherDetails.verifiedAt) }})
                      </span>
                    </p>
                  </div>
                  <div>
                    <h3 class="text-sm text-neutral-dark font-medium">个人简介</h3>
                    <p class="mt-1 text-primary">{{ retoucherDetails.bio || '暂无信息' }}</p>
                  </div>
                  <div>
                    <h3 class="text-sm text-neutral-dark font-medium">专业领域</h3>
                    <p class="mt-1 text-primary">{{ retoucherDetails.expertise || '暂无信息' }}</p>
                  </div>
                  <div>
                    <h3 class="text-sm text-neutral-dark font-medium">使用软件</h3>
                    <p class="mt-1 text-primary">{{ retoucherDetails.software || '暂无信息' }}</p>
                  </div>
                  <div>
                    <h3 class="text-sm text-neutral-dark font-medium">单张价格</h3>
                    <p class="mt-1 text-primary">
                      {{
                        retoucherDetails.pricePerPhoto
                          ? `¥${retoucherDetails.pricePerPhoto}`
                          : '暂无信息'
                      }}
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
                        v-for="portfolio in photographyPortfolio.slice(0, 3)"
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
                        v-for="i in Math.max(0, 3 - photographyPortfolio.length)"
                        :key="`placeholder-${i}`"
                        class="bg-neutral bg-opacity-20 rounded-lg aspect-square flex items-center justify-center"
                      >
                        <router-link
                          to="/portfolio/photographer/create"
                          class="text-neutral-dark text-center"
                        >
                          <div class="text-3xl mb-2">+</div>
                          <div>添加更多作品集</div>
                        </router-link>
                      </div>
                    </div>

                    <!-- 无摄影作品状态 -->
                    <div v-else class="bg-neutral bg-opacity-20 rounded-lg p-6 text-center">
                      <div class="text-neutral-dark mb-4">暂无摄影作品</div>
                      <router-link
                        to="/portfolio/photographer/create"
                        class="mt-4 px-4 py-2 bg-primary text-white rounded-md hover:bg-green-dark transition-colors"
                      >
                        上传第一张摄影作品
                      </router-link>
                    </div>
                  </template>

                  <!-- 非摄影师提示 -->
                  <div v-else class="bg-neutral bg-opacity-20 rounded-lg p-8 text-center">
                    <div class="text-neutral-dark text-lg mb-3">您还不是认证摄影师</div>
                    <p class="text-sm text-neutral-dark mb-6">
                      成为认证摄影师可以展示您的摄影作品集，接受约拍邀请
                    </p>
                    <router-link
                      to="/photographer-certification"
                      class="px-6 py-3 bg-primary text-white rounded-md hover:bg-green-dark transition-colors"
                    >
                      去认证摄影师
                    </router-link>
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
                        <router-link
                          to="/portfolio/retoucher/create"
                          class="text-neutral-dark text-center"
                        >
                          <div class="text-3xl mb-2">+</div>
                          <div>添加更多作品集</div>
                        </router-link>
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
      <ProfessionalProfileModal
        :is-open="isProfileModalOpen"
        :profile-type="activeProfileType"
        :profile-data="
          activeProfileType === 'photographer' ? photographerDetails || {} : retoucherDetails || {}
        "
        @close="closeProfileModal"
        @save="saveProfileChanges"
      />
      <UserProfileEditModal
        :is-open="isUserProfileModalOpen"
        :user-data="userStore.userInfo"
        @close="closeUserProfileModal"
        @save="saveUserProfileChanges"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from 'vue'
import { useUserStore } from '../stores/userStore'
import { retoucherPortfolioAPI, photographerPortfolioAPI } from '../services/apiService.ts' // 确保路径正确
import apiClient from '../services/apiService.ts' // 确保路径正确
import ProfessionalProfileModal from '../components/ProfessionalProfileModal.vue' // 确保路径正确
import SideBar from '../components/SideBar.vue'
import UserProfileEditModal from '../components/UserProfileEditModal.vue'

export default defineComponent({
  name: 'UserProfileView',
  components: {
    ProfessionalProfileModal, // 在这里注册组件
    SideBar, // 注册侧边栏组件
    UserProfileEditModal, // 注册用户资料编辑模态框组件
  },
  setup() {
    // 使用用户信息存储
    const userStore = useUserStore()

    // 状态变量
    const loading = ref(false)
    const error = ref('')

    // 作品集数量统计
    const photographerPortfolioCount = ref(0)
    const retoucherPortfolioCount = ref(0)

    // 活动作品集标签
    const activePortfolioTab = ref('photography')

    // 角色状态判断 - 使用store中的getter
    const isPhotographer = computed(() => userStore.isPhotographer)
    const isRetoucher = computed(() => userStore.isRetoucher)

    // 模拟作品集数据 - 实际项目中通常会有专门的API获取
    const portfolio = ref([])

    // 摄影作品集数据
    const photographyPortfolio = ref([])

    const retoucherPublicPortfolios = ref([])

    // 获取摄影师作品集数量
    const fetchPhotographerPortfolioCount = async () => {
      if (userStore.photographerId) {
        try {
          console.log('获取摄影师作品集数量, photographerId:', userStore.photographerId)
          const response = await apiClient.get(
            `photographer-portfolios/photographer/${userStore.photographerId}/public-count`,
          )
          photographerPortfolioCount.value = response.data.publicPortfolioCount
          console.log('摄影师作品集数量:', photographerPortfolioCount.value)
        } catch (err) {
          console.error('获取摄影师作品集数量失败:', err)
        }
      }
    }

    // 获取修图师作品集数量
    const fetchRetoucherPortfolioCount = async () => {
      if (userStore.retoucherId) {
        try {
          console.log('获取修图师作品集数量, retoucherId:', userStore.retoucherId)
          const response = await apiClient.get(
            `retoucher-portfolios/retoucher/${userStore.retoucherId}/public-count`,
          )
          retoucherPortfolioCount.value = response.data.publicPortfolioCount
          console.log('修图师作品集数量:', retoucherPortfolioCount.value)
        } catch (err) {
          console.error('获取修图师作品集数量失败:', err)
        }
      }
    }

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

    // 添加响应式状态变量来保存摄影师和修图师的详细信息
    const photographerDetails = ref(null)
    const retoucherDetails = ref(null)
    const loadingProfessionalDetails = ref(false)

    // 获取摄影师详细信息
    const fetchPhotographerDetails = async () => {
      if (!userStore.photographerId) return

      try {
        loadingProfessionalDetails.value = true
        console.log('获取摄影师详情, photographerId:', userStore.photographerId)
        const response = await apiClient.get(`/Photographer/${userStore.photographerId}`)
        photographerDetails.value = response.data
        console.log('获取到摄影师详情:', photographerDetails.value)
      } catch (err) {
        console.error('获取摄影师详情失败:', err)
      } finally {
        loadingProfessionalDetails.value = false
      }
    }

    // 获取修图师详细信息
    const fetchRetoucherDetails = async () => {
      if (!userStore.retoucherId) return

      try {
        loadingProfessionalDetails.value = true
        console.log('获取修图师详情, retoucherId:', userStore.retoucherId)
        const response = await apiClient.get(`/Retoucher/${userStore.retoucherId}`)
        retoucherDetails.value = response.data
        console.log('获取到修图师详情:', retoucherDetails.value)
      } catch (err) {
        console.error('获取修图师详情失败:', err)
      } finally {
        loadingProfessionalDetails.value = false
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

    // 在 setup 函数中添加以下内容
    const isProfileModalOpen = ref(false)
    const activeProfileType = ref('')

    // 打开摄影师资料编辑模态框
    const openPhotographerModal = () => {
      activeProfileType.value = 'photographer'
      isProfileModalOpen.value = true
    }

    // 打开修图师资料编辑模态框
    const openRetoucherModal = () => {
      activeProfileType.value = 'retoucher'
      isProfileModalOpen.value = true
    }

    // 关闭模态框
    const closeProfileModal = () => {
      isProfileModalOpen.value = false
    }

    // 保存专业资料更改
    const saveProfileChanges = async (updatedData) => {
      try {
        if (activeProfileType.value === 'photographer' && userStore.photographerId) {
          console.log('更新摄影师资料:', updatedData)

          // 调用API更新摄影师信息
          await apiClient.put(`/Photographer/${userStore.photographerId}`, {
            bio: updatedData.bio,
            experience: updatedData.experience,
            equipmentInfo: updatedData.equipmentInfo,
            location: updatedData.location,
            priceRangeMin: updatedData.priceRangeMin,
            priceRangeMax: updatedData.priceRangeMax,
          })

          // 更新本地数据
          photographerDetails.value = { ...photographerDetails.value, ...updatedData }
        } else if (activeProfileType.value === 'retoucher' && userStore.retoucherId) {
          console.log('更新修图师资料:', updatedData)

          // 调用API更新修图师信息
          await apiClient.put(`/Retoucher/${userStore.retoucherId}`, {
            bio: updatedData.bio,
            expertise: updatedData.expertise,
            software: updatedData.software,
            pricePerPhoto: updatedData.pricePerPhoto,
          })

          // 更新本地数据
          retoucherDetails.value = { ...retoucherDetails.value, ...updatedData }
        }
      } catch (error) {
        console.error('更新专业资料失败:', error)
        alert('更新专业资料失败，请稍后重试')
      }
    }

    // 添加获取摄影师作品集的方法
    const fetchPublicPhotographerPortfolios = async () => {
      if (isPhotographer.value && userStore.photographerId) {
        try {
          const response = await photographerPortfolioAPI.getPublicPortfolios(
            userStore.photographerId,
          )
          photographyPortfolio.value = response.data.map((portfolio) => {
            const baseUrl = import.meta.env.VITE_STATIC_ASSETS_URL || ''
            const cover = portfolio.coverImageUrl.startsWith('http')
              ? portfolio.coverImageUrl
              : `${baseUrl}${portfolio.coverImageUrl}`
            return {
              ...portfolio,
              coverImageUrl: cover,
            }
          })
        } catch (error) {
          console.error('Fetch photographer portfolios failed:', error)
        }
      }
    }

    // 用户资料编辑模态框状态
    const isUserProfileModalOpen = ref(false)

    // 打开用户资料编辑模态框
    const openUserProfileModal = () => {
      isUserProfileModalOpen.value = true
    }

    // 关闭用户资料编辑模态框
    const closeUserProfileModal = () => {
      isUserProfileModalOpen.value = false
    }

    // 保存用户资料更改
    const saveUserProfileChanges = async (updatedData) => {
      try {
        console.log('更新用户资料:', updatedData)

        // 调用API更新用户信息
        await apiClient.put(`/User`, updatedData)

        // 更新本地存储的用户信息
        if (userStore.userInfo) {
          userStore.userInfo = { ...userStore.userInfo, ...updatedData }
          // 保存到本地存储，使用正确的方法名
          userStore.updateUserStorage()
        }

        alert('用户资料更新成功！')
      } catch (error) {
        console.error('更新用户资料失败:', error)
        alert('更新用户资料失败，请稍后重试')
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
        await fetchRetoucherPortfolioCount()
      }

      // 如果用户是摄影师，获取摄影师详情
      if (isPhotographer.value && userStore.photographerId) {
        await fetchPhotographerDetails()
        await fetchPhotographerPortfolioCount()
      }

      // 如果用户是修图师，获取修图师详情
      if (isRetoucher.value && userStore.retoucherId) {
        await fetchRetoucherDetails()
      }

      // 如果用户是摄影师，获取摄影师作品集
      if (isPhotographer.value && userStore.photographerId) {
        await fetchPublicPhotographerPortfolios()
      }
    })

    return {
      userStore,
      loading,
      error,
      formatDate,
      photographerPortfolioCount,
      retoucherPortfolioCount,
      fetchUserProfile,
      activePortfolioTab,
      isPhotographer,
      isRetoucher,
      photographyPortfolio,
      retoucherPublicPortfolios,
      fetchPublicRetoucherPortfolios,
      photographerDetails,
      retoucherDetails,
      loadingProfessionalDetails,
      isProfileModalOpen,
      activeProfileType,
      openPhotographerModal,
      openRetoucherModal,
      closeProfileModal,
      saveProfileChanges,
      fetchPublicPhotographerPortfolios,
      isUserProfileModalOpen,
      openUserProfileModal,
      closeUserProfileModal,
      saveUserProfileChanges,
    }
  },
})
</script>
