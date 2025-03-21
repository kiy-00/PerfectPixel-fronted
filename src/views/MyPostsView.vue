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
              <h1 class="text-2xl font-bold">我的帖子</h1>
              <p class="text-sm text-green-light mt-1">查看和管理您在社区发布的所有帖子</p>
            </div>
            <div class="flex space-x-3">
              <router-link
                to="/community"
                class="px-4 py-2 bg-white text-primary rounded-md hover:bg-green-light transition-colors"
              >
                返回社区
              </router-link>
              <button
                @click="openCreatePostModal"
                class="px-4 py-2 bg-white text-primary rounded-md hover:bg-green-light transition-colors"
              >
                创建帖子
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 滚动内容区域 -->
      <div class="flex-1 overflow-y-auto">
        <div class="container mx-auto px-4 py-6">
          <!-- 加载中状态 -->
          <div v-if="loading" class="flex justify-center py-12">
            <div class="text-center">
              <div
                class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"
              ></div>
              <p class="mt-4 text-neutral-dark">加载您的帖子中...</p>
            </div>
          </div>

          <!-- 无内容状态 -->
          <div v-else-if="posts.length === 0" class="bg-white rounded-lg shadow-md p-8 text-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-16 w-16 mx-auto text-neutral mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1"
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
            <h3 class="text-lg font-semibold text-neutral-dark mb-2">您还没有发布任何帖子</h3>
            <p class="text-neutral-dark mb-6">分享您的摄影作品或修图成果，与社区成员交流吧！</p>
            <button
              @click="openCreatePostModal"
              class="px-4 py-2 bg-primary text-white rounded-md hover:bg-green-dark transition-colors"
            >
              创建帖子
            </button>
          </div>

          <!-- 错误状态 -->
          <div v-else-if="error" class="bg-white rounded-lg shadow-md p-8 text-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-16 w-16 mx-auto text-red-500 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.5"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 class="text-lg font-semibold text-neutral-dark mb-2">加载失败</h3>
            <p class="text-neutral-dark mb-6">{{ error }}</p>
            <button
              @click="fetchUserPosts"
              class="px-4 py-2 bg-primary text-white rounded-md hover:bg-green-dark transition-colors"
            >
              重试
            </button>
          </div>

          <!-- 帖子列表 -->
          <div v-else>
            <div class="mb-6">
              <h2 class="text-xl font-semibold text-neutral-dark">
                您已发布 {{ totalCount }} 篇帖子
              </h2>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              <PostCard
                v-for="post in posts"
                :key="post.postId"
                :post="post"
                @like="handleLike"
                @view-image="handleViewImage"
              />
            </div>

            <!-- 分页控制 -->
            <div v-if="totalPages > 1" class="mt-8 flex justify-center">
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

    <!-- 图片查看器模态框 -->
    <div
      v-if="imageViewerUrl"
      class="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center"
      @click="closeImageViewer"
    >
      <div class="max-w-4xl max-h-full p-4">
        <img
          :src="imageViewerUrl"
          alt="Full size image"
          class="max-w-full max-h-[90vh] object-contain"
        />
      </div>
      <button class="absolute top-4 right-4 text-white hover:text-green-light">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-8 w-8"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>

    <!-- 创建帖子模态框 -->
    <CreatePostModal
      v-if="showCreatePostModal"
      @close="showCreatePostModal = false"
      @post-created="handlePostCreated"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import { useUserStore } from '../stores/userStore'
import { useRouter } from 'vue-router'
import SideBar from '../components/SideBar.vue'
import PostCard from '../components/community/PostCard.vue'
import CreatePostModal from '../components/community/CreatePostModal.vue'
import apiClient from '../services/apiService'

// 定义Post接口
interface Post {
  postId: number
  userId: number
  username: string
  title: string
  content: string
  imagePath: string | null
  likesCount: number
  isLikedByCurrentUser: boolean
  createdAt: string
}

// 定义分页结果接口
interface PagedResult<T> {
  items: T[]
  totalCount: number
  page: number
  pageSize: number
  totalPages: number
}

export default defineComponent({
  name: 'MyPostsView',
  components: {
    SideBar,
    PostCard,
    CreatePostModal,
  },
  setup() {
    const userStore = useUserStore()
    const router = useRouter()
    const loading = ref(true)
    const error = ref('')
    const posts = ref<Post[]>([])
    const imageViewerUrl = ref('')
    const showCreatePostModal = ref(false)

    // 分页相关
    const currentPage = ref(1)
    const pageSize = ref(9)
    const totalPages = ref(1)
    const totalCount = ref(0)

    // 尝试初始化用户
    const initUser = async () => {
      try {
        // 如果用户未登录，尝试从存储中恢复会话
        if (!userStore.isAuthenticated) {
          console.log('尝试恢复用户会话...')
          const success = await userStore.initializeUser()
          console.log('恢复用户会话结果:', success ? '成功' : '失败')

          // 如果恢复失败，重定向到登录页
          if (!success) {
            console.log('用户未登录，重定向到登录页')
            error.value = '请先登录后查看您的帖子'
            loading.value = false

            // 延迟重定向以便用户看到错误信息
            setTimeout(() => {
              router.push({
                path: '/login',
                query: { redirect: '/my-posts' },
              })
            }, 1500)

            return false
          }
        }

        // 确认用户ID
        if (!userStore.userInfo?.userId) {
          console.error('无法获取用户ID，但用户已登录')
          error.value = '无法获取您的用户信息，请重新登录'
          loading.value = false
          return false
        }

        console.log('用户已登录，ID:', userStore.userInfo.userId)
        return true
      } catch (err) {
        console.error('初始化用户失败:', err)
        error.value = '登录状态验证失败，请重新登录'
        loading.value = false
        return false
      }
    }

    // 获取用户帖子
    const fetchUserPosts = async () => {
      console.log('开始获取用户帖子...')

      // 先检查用户是否登录
      if (!(await initUser())) {
        return
      }

      loading.value = true
      error.value = ''

      try {
        const userId = userStore.userInfo!.userId
        console.log('当前用户ID:', userId)

        // 构建API请求URL和参数
        const apiPath = `/Post/user/${userId}`
        const params = {
          page: currentPage.value,
          pageSize: pageSize.value,
        }

        // 打印完整请求URL以便调试
        const baseUrl = import.meta.env.VITE_API_BASE_URL || ''
        const queryString = new URLSearchParams(params as any).toString()
        const fullUrl = `${baseUrl}${apiPath}?${queryString}`
        console.log('API请求URL:', fullUrl)

        const response = await apiClient.get(apiPath, { params })

        console.log('API响应状态:', response.status)
        console.log('API响应数据:', response.data)

        // 检查响应数据结构
        if (!response.data || !Array.isArray(response.data.items)) {
          console.error('API响应数据格式不符合预期:', response.data)
          error.value = '服务器返回的数据格式有误'
          loading.value = false
          return
        }

        const result = response.data as PagedResult<Post>
        posts.value = result.items
        totalPages.value = result.totalPages || 1
        totalCount.value = result.totalCount || 0

        console.log(`成功获取到 ${posts.value.length} 篇帖子，总数: ${totalCount.value}`)
      } catch (err: any) {
        console.error('获取用户帖子失败:', err)

        // 详细记录错误信息
        if (err.response) {
          console.error('错误状态码:', err.response.status)
          console.error('错误响应内容:', err.response.data)
        } else if (err.request) {
          console.error('未收到响应，请求详情:', err.request)
        } else {
          console.error('错误信息:', err.message)
        }

        error.value = '获取帖子失败，请稍后再试'
      } finally {
        loading.value = false
      }
    }

    // 下一页
    const nextPage = () => {
      if (currentPage.value < totalPages.value) {
        currentPage.value++
        fetchUserPosts()
      }
    }

    // 上一页
    const prevPage = () => {
      if (currentPage.value > 1) {
        currentPage.value--
        fetchUserPosts()
      }
    }

    // 点赞/取消点赞
    const handleLike = async (postId: number) => {
      try {
        const post = posts.value.find((p) => p.postId === postId)
        if (!post) return

        // 处理取消点赞的情况
        if (post.isLikedByCurrentUser) {
          // 使用正确的API端点取消点赞
          await apiClient.delete(`/Like/post/${postId}`)
          // 刷新数据以获取更新后的点赞数
          fetchUserPosts()
        }
      } catch (error) {
        console.error('点赞操作失败:', error)
        // 操作失败时重新获取数据
        fetchUserPosts()
      }
    }

    // 查看图片
    const handleViewImage = (imageUrl: string) => {
      imageViewerUrl.value = imageUrl
    }

    // 关闭图片查看器
    const closeImageViewer = () => {
      imageViewerUrl.value = ''
    }

    // 打开创建帖子模态框
    const openCreatePostModal = () => {
      showCreatePostModal.value = true
    }

    // 处理帖子创建成功
    const handlePostCreated = () => {
      // 刷新帖子列表
      fetchUserPosts()
    }

    onMounted(async () => {
      // 确保用户已初始化后再获取帖子
      await fetchUserPosts()
    })

    return {
      posts,
      loading,
      error,
      imageViewerUrl,
      showCreatePostModal,
      currentPage,
      totalPages,
      totalCount,
      fetchUserPosts,
      nextPage,
      prevPage,
      handleLike,
      handleViewImage,
      closeImageViewer,
      openCreatePostModal,
      handlePostCreated,
    }
  },
})
</script>
