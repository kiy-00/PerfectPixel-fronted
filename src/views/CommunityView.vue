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
            <button
              @click="openCreatePostModal"
              class="px-4 py-2 bg-white text-primary rounded-md hover:bg-green-light transition-colors"
            >
              创建帖子
            </button>
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
              <div class="flex space-x-4">
                <div class="relative">
                  <select
                    v-model="categoryFilter"
                    class="appearance-none bg-neutral-100 rounded-md py-2 pl-4 pr-10 text-neutral-dark focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">所有分类</option>
                    <option value="photography">摄影作品</option>
                    <option value="retouching">修图成果</option>
                    <option value="question">技术问答</option>
                    <option value="sharing">经验分享</option>
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

                <div class="relative">
                  <select
                    v-model="sortOption"
                    class="appearance-none bg-neutral-100 rounded-md py-2 pl-4 pr-10 text-neutral-dark focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="latest">最新发布</option>
                    <option value="popular">热门推荐</option>
                    <option value="mostLiked">点赞最多</option>
                    <option value="mostCommented">评论最多</option>
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
              </div>

              <!-- 右侧搜索框 -->
              <div class="relative w-full md:w-auto">
                <input
                  v-model="searchQuery"
                  type="text"
                  placeholder="搜索帖子..."
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
              :key="post.id"
              :post="post"
              @like="handleLike"
              @view-comments="handleViewComments"
              @view-image="handleViewImage"
              @share="handleShare"
            />
          </div>

          <!-- 加载更多 -->
          <div v-if="posts.length > 0 && hasMorePosts" class="mt-8 text-center">
            <button
              @click="loadMorePosts"
              class="px-4 py-2 bg-white text-primary border border-primary rounded-md hover:bg-green-light hover:bg-opacity-20 transition-colors"
              :disabled="loadingMore"
            >
              <span v-if="!loadingMore">加载更多</span>
              <span v-else class="flex items-center justify-center">
                <svg class="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                  <circle
                    class="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    stroke-width="4"
                    fill="none"
                  ></circle>
                  <path
                    class="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                加载中...
              </span>
            </button>
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
import { defineComponent, ref, onMounted, watch } from 'vue'
import SideBar from '../components/SideBar.vue'
import PostCard from '../components/community/PostCard.vue'
import CreatePostModal from '../components/community/CreatePostModal.vue'

export default defineComponent({
  name: 'CommunityView',
  components: {
    SideBar,
    PostCard,
    CreatePostModal,
  },
  setup() {
    // UI state refs
    const loading = ref(true)
    const loadingMore = ref(false)
    const hasMorePosts = ref(true)
    const imageViewerUrl = ref('')

    // Filter and sort options
    const categoryFilter = ref('')
    const sortOption = ref('latest')
    const searchQuery = ref('')

    // Posts data
    const posts = ref<any[]>([])

    // Load posts on component mount
    onMounted(() => {
      fetchPosts()
    })

    // Watch for filter changes
    watch([categoryFilter, sortOption], () => {
      fetchPosts()
    })

    // Fetch posts from API (mock implementation)
    const fetchPosts = async () => {
      loading.value = true

      try {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // For demonstration, we'll generate mock data
        posts.value = generateMockPosts()
      } catch (error) {
        console.error('Error fetching posts:', error)
      } finally {
        loading.value = false
      }
    }

    // Load more posts
    const loadMorePosts = async () => {
      if (loadingMore.value) return

      loadingMore.value = true

      try {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Add more mock posts
        const morePosts = generateMockPosts(3, posts.value.length)
        posts.value = [...posts.value, ...morePosts]

        // For demo purposes, limit "infinite" scroll
        if (posts.value.length >= 15) {
          hasMorePosts.value = false
        }
      } catch (error) {
        console.error('Error loading more posts:', error)
      } finally {
        loadingMore.value = false
      }
    }

    // Search posts
    const searchPosts = () => {
      // In a real app, this would trigger an API call with the search term
      console.log('Searching for:', searchQuery.value)
      fetchPosts()
    }

    // Handle like action
    const handleLike = (postId: number) => {
      const post = posts.value.find((p) => p.id === postId)
      if (post) {
        post.isLiked = !post.isLiked
        post.likes += post.isLiked ? 1 : -1
      }
    }

    // Handle view comments
    const handleViewComments = (postId: number) => {
      console.log('View comments for post:', postId)
      // In a real app, this would open a comments section or navigate to a details page
    }

    // Handle view image
    const handleViewImage = (imageUrl: string) => {
      imageViewerUrl.value = imageUrl
    }

    // Close image viewer
    const closeImageViewer = () => {
      imageViewerUrl.value = ''
    }

    // Handle share post
    const handleShare = (postId: number) => {
      console.log('Share post:', postId)
      // In a real app, this would open a share dialog
    }

    // Create post modal state
    const showCreatePostModal = ref(false)

    // Open create post modal
    const openCreatePostModal = () => {
      showCreatePostModal.value = true
    }

    // Handle post created event
    const handlePostCreated = (newPost: any) => {
      // In a real app, we would need to update the posts list with the new post
      // For now, we'll just refetch all posts
      fetchPosts()
    }

    // Helper function to generate mock posts
    const generateMockPosts = (count = 10, startId = 0) => {
      const categories = ['photography', 'retouching', 'question', 'sharing']
      const tags = [
        '人像摄影',
        '风景摄影',
        '产品摄影',
        '修图技巧',
        'Photoshop',
        'Lightroom',
        '构图指南',
        '色彩理论',
      ]
      const userNames = ['张摄影', '李修图', '王光影', '赵构图', '刘色彩', '陈快门']

      return Array.from({ length: count }, (_, i) => {
        const id = startId + i + 1
        const category = categories[Math.floor(Math.random() * categories.length)]
        const postTags = Array.from(
          { length: Math.floor(Math.random() * 3) + 1 },
          () => tags[Math.floor(Math.random() * tags.length)],
        )

        // Create unique tag set (no duplicates)
        const uniqueTags = Array.from(new Set(postTags))

        // Random creation date within the last month
        const createdAt = new Date()
        createdAt.setDate(createdAt.getDate() - Math.floor(Math.random() * 30))

        // Determine if post has an image based on category
        const hasImage =
          category === 'photography' || category === 'retouching' || Math.random() > 0.3

        // Set image URL or placeholder
        const imageNumber = Math.floor(Math.random() * 5) + 1 // 1-5
        const imageUrl = hasImage ? `/images/samples/sample${imageNumber}.jpg` : ''

        return {
          id,
          userName: userNames[Math.floor(Math.random() * userNames.length)],
          title: `社区帖子 #${id} - ${category === 'question' ? '求助' : '分享'}`,
          content: generateLoremText(),
          imageUrl,
          category,
          tags: uniqueTags,
          likes: Math.floor(Math.random() * 50),
          comments: Math.floor(Math.random() * 20),
          isLiked: Math.random() > 0.7,
          createdAt: createdAt.toISOString(),
        }
      })
    }

    // Helper function to generate random text
    const generateLoremText = () => {
      const texts = [
        '分享一组近期拍摄的人像作品，光线运用和后期色彩处理都是我比较满意的部分。欢迎大家点评和交流！',
        '最近研究了一套新的修图流程，特别是对于肤色处理有了新的心得。附上修图前后对比，希望能给大家一些启发。',
        '请教一个关于夜景摄影的问题：在光污染严重的城市，如何拍出干净的星空？有没有推荐的后期降噪方法？',
        '分享一个小技巧：使用渐变滤镜平衡天空与地面的曝光差异，效果比后期合成自然得多。大家有什么其他实用的拍摄技巧吗？',
        '刚入手了新的相机和镜头，还在适应中。这是我的第一组测试照片，构图和用光还需要多加练习。期待各位的建议！',
        '这组照片是我在尝试一种新的色彩风格，偏向于电影感的调色。过程中遇到了一些挑战，但最终效果我还比较满意。',
        '想请教一下大家关于人像摄影中的引导姿势问题，特别是拍摄经验不多的普通人，有什么好的方法让被摄者自然放松？',
        '最近在练习产品摄影，光比控制是我遇到的最大难题。这是我最近的一些尝试，欢迎有经验的摄影师给些建议。',
      ]

      return texts[Math.floor(Math.random() * texts.length)]
    }

    return {
      posts,
      loading,
      loadingMore,
      hasMorePosts,
      categoryFilter,
      sortOption,
      searchQuery,
      imageViewerUrl,
      fetchPosts,
      searchPosts,
      loadMorePosts,
      handleLike,
      handleViewComments,
      handleViewImage,
      closeImageViewer,
      handleShare,
      openCreatePostModal,
      showCreatePostModal,
      handlePostCreated,
    }
  },
})
</script>
