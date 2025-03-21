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
              <h1 class="text-2xl font-bold">迷你社区</h1>
              <p class="text-sm text-green-light mt-1">分享您的摄影和修图作品，探索社区创作</p>
            </div>
            <div class="flex space-x-3">
              <router-link
                to="/my-posts"
                class="px-4 py-2 bg-white text-primary rounded-md hover:bg-green-light transition-colors"
              >
                我的帖子
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
          <!-- 筛选和分类工具栏 -->
          <div class="bg-white rounded-lg shadow-md p-4 mb-6">
            <div
              class="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0"
            >
              <!-- 左侧筛选选项 -->
              <div class="flex flex-wrap gap-4">
                <!-- 排序方式 -->
                <div class="relative">
                  <select
                    v-model="searchParams.sortBy"
                    class="appearance-none bg-neutral-100 rounded-md py-2 pl-4 pr-10 text-neutral-dark focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="CreatedAt">按发布时间</option>
                    <option value="LikesCount">按点赞数</option>
                  </select>
                  <div
                    class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none"
                  >
                    <svg
                      class="h-4 w-4 text-neutral-dark"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>

                <!-- 排序顺序 -->
                <div class="relative">
                  <select
                    v-model="searchParams.descending"
                    class="appearance-none bg-neutral-100 rounded-md py-2 pl-4 pr-10 text-neutral-dark focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option :value="true">降序</option>
                    <option :value="false">升序</option>
                  </select>
                  <div
                    class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none"
                  >
                    <svg
                      class="h-4 w-4 text-neutral-dark"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>

                <!-- 时间范围筛选按钮 -->
                <button
                  @click="showDateFilter = !showDateFilter"
                  class="px-3 py-2 bg-neutral-100 text-neutral-dark rounded-md hover:bg-neutral-200 flex items-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-5 w-5 mr-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  时间筛选
                  <span v-if="hasDateFilter" class="ml-1 w-2 h-2 bg-primary rounded-full"></span>
                </button>
              </div>

              <!-- 右侧搜索框 -->
              <div class="relative w-full md:w-auto">
                <input
                  v-model="searchParams.query"
                  type="text"
                  placeholder="搜索帖子、内容或用户..."
                  class="w-full md:w-64 pl-10 pr-4 py-2 bg-neutral-100 rounded-md text-neutral-dark focus:outline-none focus:ring-2 focus:ring-primary"
                  @keyup.enter="searchPosts"
                />
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
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

            <!-- 日期筛选扩展面板 -->
            <div v-if="showDateFilter" class="mt-4 bg-neutral-50 p-4 rounded-md">
              <div class="flex flex-col md:flex-row gap-4 items-end">
                <div>
                  <label class="block text-sm text-neutral-dark mb-1">开始日期</label>
                  <input
                    type="date"
                    v-model="dateFilter.startDate"
                    class="px-4 py-2 border border-neutral rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label class="block text-sm text-neutral-dark mb-1">结束日期</label>
                  <input
                    type="date"
                    v-model="dateFilter.endDate"
                    class="px-4 py-2 border border-neutral rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div class="flex gap-2">
                  <button
                    @click="applyDateFilter"
                    class="px-4 py-2 bg-primary text-white rounded-md hover:bg-green-dark transition-colors"
                  >
                    应用筛选
                  </button>
                  <button
                    v-if="hasDateFilter"
                    @click="clearDateFilter"
                    class="px-4 py-2 border border-neutral text-neutral-dark rounded-md hover:bg-neutral-light transition-colors"
                  >
                    清除筛选
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- 加载中状态 -->
          <div v-if="loading" class="flex justify-center py-12">
            <div class="text-center">
              <div
                class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"
              ></div>
              <p class="mt-4 text-neutral-dark">加载社区内容中...</p>
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
            <h3 class="text-lg font-semibold text-neutral-dark mb-2">暂时没有帖子</h3>
            <p class="text-neutral-dark mb-6">成为第一个分享内容的用户吧！</p>
            <button
              @click="openCreatePostModal"
              class="px-4 py-2 bg-primary text-white rounded-md hover:bg-green-dark transition-colors"
            >
              创建帖子
            </button>
          </div>

          <!-- 帖子列表 -->
          <div v-else class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            <PostCard
              v-for="post in posts"
              :key="post.postId"
              :post="post"
              @like="handleLike"
              @view-image="handleViewImage"
            />
          </div>

          <!-- 分页控制 -->
          <div v-if="posts.length > 0" class="mt-8 flex justify-center">
            <div class="inline-flex rounded-md shadow-sm">
              <button
                @click="prevPage"
                :disabled="searchParams.page === 1"
                class="px-3 py-2 border border-neutral rounded-l-md bg-white text-neutral-dark hover:bg-neutral-light disabled:opacity-50 disabled:cursor-not-allowed"
              >
                上一页
              </button>
              <div class="px-4 py-2 border-t border-b border-neutral bg-white text-primary">
                {{ searchParams.page }} / {{ totalPages }}
              </div>
              <button
                @click="nextPage"
                :disabled="searchParams.page >= totalPages"
                class="px-3 py-2 border border-neutral rounded-r-md bg-white text-neutral-dark hover:bg-neutral-light disabled:opacity-50 disabled:cursor-not-allowed"
              >
                下一页
              </button>
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
import { defineComponent, ref, reactive, computed, onMounted, watch } from 'vue'
import SideBar from '../components/SideBar.vue'
import PostCard from '../components/community/PostCard.vue'
import CreatePostModal from '../components/community/CreatePostModal.vue'
import apiClient from '../services/apiService'

// 定义帖子搜索参数v2类型
interface PostSearchParamsV2 {
  query: string
  startDate?: string
  endDate?: string
  sortBy: string
  descending: boolean
  page: number
  pageSize: number
}

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
  name: 'CommunityView',
  components: {
    SideBar,
    PostCard,
    CreatePostModal,
  },
  setup() {
    // UI state
    const loading = ref(true)
    const imageViewerUrl = ref('')
    const showCreatePostModal = ref(false)
    const showDateFilter = ref(false)
    const totalPages = ref(1)
    const totalPosts = ref(0)

    // 搜索参数 - 使用新的V2接口参数
    const searchParams = reactive<PostSearchParamsV2>({
      query: '',
      sortBy: 'CreatedAt',
      descending: true,
      page: 1,
      pageSize: 9,
    })

    // 日期筛选
    const dateFilter = reactive({
      startDate: '',
      endDate: '',
    })

    // 是否有日期筛选
    const hasDateFilter = computed(() => {
      return searchParams.startDate !== undefined || searchParams.endDate !== undefined
    })

    // 帖子数据
    const posts = ref<Post[]>([])

    // 监听搜索参数变化
    watch([() => searchParams.sortBy, () => searchParams.descending], () => {
      searchParams.page = 1 // 重置到第一页

      // 如果有搜索条件，使用搜索接口；否则获取最新帖子
      if (searchParams.query || searchParams.startDate || searchParams.endDate) {
        fetchPosts()
      } else {
        fetchLatestPosts()
      }
    })

    // 应用日期筛选
    const applyDateFilter = () => {
      if (dateFilter.startDate) {
        searchParams.startDate = dateFilter.startDate
      } else {
        searchParams.startDate = undefined
      }

      if (dateFilter.endDate) {
        searchParams.endDate = dateFilter.endDate
      } else {
        searchParams.endDate = undefined
      }

      searchParams.page = 1 // 重置到第一页
      showDateFilter.value = false

      // 当应用日期筛选时，总是使用搜索接口
      fetchPosts()
    }

    // 清除日期筛选
    const clearDateFilter = () => {
      dateFilter.startDate = ''
      dateFilter.endDate = ''
      searchParams.startDate = undefined
      searchParams.endDate = undefined
      searchParams.page = 1

      // 如果没有搜索关键词，则回到获取最新帖子
      if (!searchParams.query) {
        fetchLatestPosts()
      } else {
        fetchPosts()
      }
    }

    // 获取最新帖子
    const fetchLatestPosts = async () => {
      loading.value = true

      try {
        // 使用latest接口获取最新帖子
        const response = await apiClient.get('/Post/latest', {
          params: { count: searchParams.pageSize },
        })

        // latest API返回的是数组而不是分页对象
        posts.value = response.data

        // 因为latest API不是分页的，所以重置分页相关状态
        totalPages.value = 1
        totalPosts.value = posts.value.length
        searchParams.page = 1
      } catch (error) {
        console.error('获取最新帖子失败:', error)
      } finally {
        loading.value = false
      }
    }

    // 使用V2接口搜索帖子
    const fetchPosts = async () => {
      loading.value = true

      try {
        // 构建查询参数
        const params: Record<string, string> = {
          page: searchParams.page.toString(),
          pageSize: searchParams.pageSize.toString(),
          sortBy: searchParams.sortBy,
          descending: searchParams.descending.toString(),
        }

        if (searchParams.query) {
          params.query = searchParams.query
        }

        if (searchParams.startDate) {
          params.startDate = searchParams.startDate
        }

        if (searchParams.endDate) {
          params.endDate = searchParams.endDate
        }

        // 调用新的V2搜索API
        const response = await apiClient.get('/Post/search/v2', { params })
        const result = response.data as PagedResult<Post>

        posts.value = result.items
        totalPages.value = result.totalPages
        totalPosts.value = result.totalCount
      } catch (error) {
        console.error('获取帖子失败:', error)
      } finally {
        loading.value = false
      }
    }

    // 搜索帖子
    const searchPosts = () => {
      searchParams.page = 1 // 重置页码
      // 只有当有搜索条件时才使用搜索API，否则获取最新帖子
      if (searchParams.query || searchParams.startDate || searchParams.endDate) {
        fetchPosts()
      } else {
        fetchLatestPosts()
      }
    }

    // 下一页
    const nextPage = () => {
      if (searchParams.page < totalPages.value) {
        searchParams.page++
        fetchPosts()
      }
    }

    // 上一页
    const prevPage = () => {
      if (searchParams.page > 1) {
        searchParams.page--
        fetchPosts()
      }
    }

    // 点赞/取消点赞
    const handleLike = async (postId: number) => {
      try {
        const post = posts.value.find((p) => p.postId === postId)
        if (!post) return

        // We handle the unlike case here (the like case is handled directly in the PostCard component)
        if (post.isLikedByCurrentUser) {
          // Unlike post - Using the correct API endpoint
          await apiClient.delete(`/Like/post/${postId}`)
          post.isLikedByCurrentUser = false

          // Refresh the posts to get updated like count
          if (searchParams.query || searchParams.startDate || searchParams.endDate) {
            fetchPosts()
          } else {
            fetchLatestPosts()
          }
        }
      } catch (error) {
        console.error('点赞操作失败:', error)
        // On error, refresh the posts data
        if (searchParams.query || searchParams.startDate || searchParams.endDate) {
          fetchPosts()
        } else {
          fetchLatestPosts()
        }
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
      // 刷新最新帖子列表
      fetchLatestPosts()
    }

    // 组件挂载时获取最新帖子
    onMounted(() => {
      fetchLatestPosts()
    })

    return {
      posts,
      loading,
      searchParams,
      dateFilter,
      showDateFilter,
      hasDateFilter,
      totalPages,
      totalPosts,
      imageViewerUrl,
      showCreatePostModal,
      fetchPosts,
      fetchLatestPosts,
      searchPosts,
      applyDateFilter,
      clearDateFilter,
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
