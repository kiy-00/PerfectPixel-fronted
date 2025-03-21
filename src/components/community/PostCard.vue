<template>
  <div
    class="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-200 hover:shadow-lg"
  >
    <!-- Post header with user info -->
    <div class="flex items-center p-4 border-b border-neutral-100">
      <!-- User avatar - make it clickable -->
      <div
        class="bg-primary text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg mr-3 cursor-pointer hover:bg-green-dark transition-colors"
        @click="navigateToUserProfile"
      >
        {{ post.username ? post.username.charAt(0).toUpperCase() : '?' }}
      </div>
      <div class="flex-grow">
        <!-- Make username clickable too -->
        <div
          class="font-medium text-neutral-dark hover:text-primary cursor-pointer"
          @click="navigateToUserProfile"
        >
          {{ post.username }}
        </div>
        <div class="text-xs text-neutral-500">{{ formatDate(post.createdAt) }}</div>
      </div>
      <div class="text-neutral">
        <button class="hover:text-primary" title="更多操作">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"
            />
          </svg>
        </button>
      </div>
    </div>

    <!-- Post content -->
    <div class="p-4">
      <!-- Post title if exists -->
      <h3 v-if="post.title" class="font-semibold text-lg mb-2 text-neutral-dark">
        {{ post.title }}
      </h3>

      <!-- Post text content -->
      <p class="text-neutral-dark mb-4">{{ post.content }}</p>

      <!-- Post image if exists -->
      <div v-if="post.imagePath" class="mb-4">
        <img
          :src="getImageUrl(post.imagePath)"
          :alt="post.title || 'Post image'"
          class="w-full rounded-md"
          @click="viewImage"
        />
      </div>

      <!-- Post tags -->
      <div v-if="post.tags && post.tags.length > 0" class="flex flex-wrap gap-2 mb-4">
        <span
          v-for="tag in post.tags"
          :key="tag"
          class="px-2 py-1 bg-green-light bg-opacity-20 text-primary text-xs rounded-md"
        >
          {{ tag }}
        </span>
      </div>
    </div>

    <!-- Post footer with like button only -->
    <div class="px-4 py-3 border-t border-neutral-100 bg-neutral-50 flex items-center text-sm">
      <!-- Like button -->
      <button
        class="flex items-center hover:text-primary"
        :class="{
          'text-primary font-medium': post.isLikedByCurrentUser,
          'text-neutral-dark': !post.isLikedByCurrentUser,
        }"
        @click="toggleLike"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5 mr-1"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          :stroke-width="post.isLikedByCurrentUser ? 2 : 1.5"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>
        <span>{{ likesCount }}</span>
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import apiClient from '../../services/apiService'
import { useRouter } from 'vue-router'

export default defineComponent({
  name: 'PostCard',
  props: {
    post: {
      type: Object,
      required: true,
    },
  },
  setup(props, { emit }) {
    const router = useRouter()
    // Add reactive state for likes count and liked status
    const likesCount = ref(props.post.likesCount || 0)
    const isLiked = ref(props.post.isLikedByCurrentUser || false)

    // Format date to a readable string
    const formatDate = (dateString: string) => {
      const date = new Date(dateString)

      // Get difference in hours
      const hoursDiff = Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60))

      if (hoursDiff < 1) {
        // Less than an hour
        const minutes = Math.floor((Date.now() - date.getTime()) / (1000 * 60))
        return `${minutes} 分钟前`
      } else if (hoursDiff < 24) {
        // Less than a day
        return `${hoursDiff} 小时前`
      } else if (hoursDiff < 48) {
        // Yesterday
        return '昨天'
      } else {
        // Regular date format
        return new Intl.DateTimeFormat('zh-CN', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        }).format(date)
      }
    }

    // Get complete image URL with static assets prefix
    const getImageUrl = (imagePath: string): string => {
      if (!imagePath) return ''

      // If already an absolute URL, return as is
      if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
        return imagePath
      }

      // Add static assets prefix
      const staticAssetsUrl = import.meta.env.VITE_STATIC_ASSETS_URL || 'http://localhost:5000'

      // Ensure path has leading slash
      const path = imagePath.startsWith('/') ? imagePath : `/${imagePath}`

      return `${staticAssetsUrl}${path}`
    }

    // Fetch likes count from API
    const fetchLikes = async () => {
      try {
        const response = await apiClient.get(`/Like/post/${props.post.postId}`)
        // The API returns a list of likes, so the count is the length of the array
        if (Array.isArray(response.data)) {
          likesCount.value = response.data.length
        }
      } catch (error) {
        console.error(`Error fetching likes for post ${props.post.postId}:`, error)
        // Fall back to the value passed in props if API call fails
        likesCount.value = props.post.likesCount || 0
      }
    }

    // Check if user has already liked the post
    const checkLikeStatus = async () => {
      try {
        const response = await apiClient.get(`/Like/check/${props.post.postId}`)
        if (response.data && typeof response.data.hasLiked === 'boolean') {
          // Update local state based on server response
          isLiked.value = response.data.hasLiked

          // If server state differs from prop state, update the parent component
          if (isLiked.value !== props.post.isLikedByCurrentUser) {
            props.post.isLikedByCurrentUser = isLiked.value
            console.log(`Updated like status for post ${props.post.postId} to ${isLiked.value}`)
          }
        }
      } catch (error) {
        console.error(`Error checking like status for post ${props.post.postId}:`, error)
      }
    }

    // Toggle like status with server verification
    const toggleLike = async () => {
      try {
        // First check the current like status to ensure UI matches server state
        await checkLikeStatus()

        // Now toggle based on verified status
        const currentLikeStatus = isLiked.value

        // Update UI optimistically
        isLiked.value = !currentLikeStatus
        likesCount.value = currentLikeStatus ? likesCount.value - 1 : likesCount.value + 1
        props.post.isLikedByCurrentUser = isLiked.value

        // Make API call based on verified status
        if (!currentLikeStatus) {
          // Like post
          await apiClient.post(`/Like/post/${props.post.postId}`)
        } else {
          // Unlike post
          await apiClient.delete(`/Like/post/${props.post.postId}`)
        }

        // Refresh likes count to ensure accuracy
        fetchLikes()
      } catch (error) {
        console.error('Error toggling like:', error)

        // Revert UI changes on error
        isLiked.value = !isLiked.value
        likesCount.value = isLiked.value ? likesCount.value + 1 : likesCount.value - 1
        props.post.isLikedByCurrentUser = isLiked.value

        // Refresh likes count from server
        fetchLikes()

        // Recheck like status
        checkLikeStatus()
      }
    }

    // View full image
    const viewImage = () => {
      emit('view-image', getImageUrl(props.post.imagePath))
    }

    // Navigate to user profile
    const navigateToUserProfile = () => {
      if (props.post.userId) {
        router.push({
          path: `/user/${props.post.userId}`,
        })
      }
    }

    // Fetch likes when component is mounted and verify like status
    onMounted(() => {
      fetchLikes()
      checkLikeStatus()
    })

    return {
      formatDate,
      getImageUrl,
      toggleLike,
      viewImage,
      likesCount,
      isLiked,
      navigateToUserProfile,
    }
  },
})
</script>
