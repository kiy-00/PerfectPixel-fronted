<template>
  <div
    class="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-200 hover:shadow-lg"
  >
    <!-- Post header with user info -->
    <div class="flex items-center p-4 border-b border-neutral-100">
      <!-- User avatar -->
      <div
        class="bg-primary text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg mr-3"
      >
        {{ post.userName.charAt(0).toUpperCase() }}
      </div>
      <div class="flex-grow">
        <div class="font-medium text-neutral-dark">{{ post.userName }}</div>
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
      <div v-if="post.imageUrl" class="mb-4">
        <img
          :src="post.imageUrl"
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

    <!-- Post footer with engagement metrics -->
    <div class="px-4 py-3 border-t border-neutral-100 bg-neutral-50 flex items-center text-sm">
      <!-- Like button -->
      <button
        class="flex items-center mr-4 hover:text-primary"
        :class="{ 'text-primary font-medium': post.isLiked, 'text-neutral-dark': !post.isLiked }"
        @click="toggleLike"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5 mr-1"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          :stroke-width="post.isLiked ? 2 : 1.5"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>
        <span>{{ post.likes }}</span>
      </button>

      <!-- Comment button -->
      <button
        class="flex items-center mr-4 text-neutral-dark hover:text-primary"
        @click="viewComments"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5 mr-1"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="1.5"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
          />
        </svg>
        <span>{{ post.comments }}</span>
      </button>

      <!-- Share button -->
      <button
        class="flex items-center text-neutral-dark hover:text-primary ml-auto"
        @click="sharePost"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5 mr-1"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="1.5"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
          />
        </svg>
        <span>分享</span>
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'PostCard',
  props: {
    post: {
      type: Object,
      required: true,
    },
  },
  setup(props, { emit }) {
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

    // Toggle like status
    const toggleLike = () => {
      emit('like', props.post.id)
    }

    // View comments
    const viewComments = () => {
      emit('view-comments', props.post.id)
    }

    // View full image
    const viewImage = () => {
      emit('view-image', props.post.imageUrl)
    }

    // Share post
    const sharePost = () => {
      emit('share', props.post.id)
    }

    return {
      formatDate,
      toggleLike,
      viewComments,
      viewImage,
      sharePost,
    }
  },
})
</script>
