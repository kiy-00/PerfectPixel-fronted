<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
    <div class="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
      <!-- Modal header -->
      <div class="flex justify-between items-center px-6 py-4 border-b border-neutral-100">
        <h2 class="text-xl font-semibold text-neutral-dark">编辑帖子</h2>
        <button @click="closeModal" class="text-neutral-dark hover:text-primary" aria-label="关闭">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6"
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

      <!-- Modal body with form -->
      <div class="flex-1 overflow-y-auto p-6">
        <form @submit.prevent="submitPost" class="space-y-6">
          <!-- Title field -->
          <div>
            <label for="title" class="block text-sm font-medium text-neutral-dark mb-1"
              >标题 <span class="text-red-500">*</span></label
            >
            <input
              type="text"
              id="title"
              v-model="formData.title"
              placeholder="输入帖子标题（3-100字符）"
              class="w-full px-4 py-2 border border-neutral rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              :class="{ 'border-red-500': errors.title }"
            />
            <p v-if="errors.title" class="mt-1 text-sm text-red-500">{{ errors.title }}</p>
          </div>

          <!-- Content field -->
          <div>
            <label for="content" class="block text-sm font-medium text-neutral-dark mb-1"
              >内容 <span class="text-red-500">*</span></label
            >
            <textarea
              id="content"
              v-model="formData.content"
              rows="6"
              placeholder="输入帖子内容（10-2000字符）"
              class="w-full px-4 py-2 border border-neutral rounded-md focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              :class="{ 'border-red-500': errors.content }"
            ></textarea>
            <p v-if="errors.content" class="mt-1 text-sm text-red-500">{{ errors.content }}</p>
            <p class="mt-1 text-xs text-neutral">{{ formData.content.length }}/2000</p>
          </div>

          <!-- Original post image (readonly display) -->
          <div v-if="post.imagePath">
            <label class="block text-sm font-medium text-neutral-dark mb-1"
              >原图片（不可更改）</label
            >
            <div class="border border-dashed rounded-md p-4">
              <img
                :src="getImageUrl(post.imagePath)"
                :alt="post.title || '帖子图片'"
                class="max-h-48 mx-auto rounded-md"
              />
              <p class="mt-2 text-xs text-neutral text-center">帖子图片在编辑时不能更改</p>
            </div>
          </div>
        </form>
      </div>

      <!-- Modal footer with actions -->
      <div class="px-6 py-4 border-t border-neutral-100 flex justify-end space-x-4">
        <button
          @click="closeModal"
          type="button"
          class="px-4 py-2 border border-neutral rounded-md text-neutral-dark hover:bg-neutral-light transition-colors"
          :disabled="isSubmitting"
        >
          取消
        </button>
        <button
          @click="submitPost"
          type="button"
          class="px-4 py-2 bg-primary text-white rounded-md hover:bg-green-dark transition-colors flex items-center"
          :disabled="isSubmitting"
        >
          <svg
            v-if="isSubmitting"
            class="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              class="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              stroke-width="4"
            ></circle>
            <path
              class="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          {{ isSubmitting ? '保存中...' : '保存修改' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, onMounted } from 'vue'
import apiClient from '../../services/apiService'

export default defineComponent({
  name: 'EditPostModal',
  props: {
    post: {
      type: Object,
      required: true,
    },
  },
  emits: ['close', 'post-updated'],
  setup(props, { emit }) {
    const isSubmitting = ref(false)

    // Form data and validation
    const formData = reactive({
      title: props.post.title || '',
      content: props.post.content || '',
    })

    const errors = reactive({
      title: '',
      content: '',
    })

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

    // Validate form
    const validateForm = (): boolean => {
      let isValid = true

      // Reset errors
      errors.title = ''
      errors.content = ''

      // Validate title
      if (!formData.title.trim()) {
        errors.title = '请输入标题'
        isValid = false
      } else if (formData.title.length < 3) {
        errors.title = '标题至少需要3个字符'
        isValid = false
      } else if (formData.title.length > 100) {
        errors.title = '标题不能超过100个字符'
        isValid = false
      }

      // Validate content
      if (!formData.content.trim()) {
        errors.content = '请输入内容'
        isValid = false
      } else if (formData.content.length < 10) {
        errors.content = '内容至少需要10个字符'
        isValid = false
      } else if (formData.content.length > 2000) {
        errors.content = '内容不能超过2000个字符'
        isValid = false
      }

      return isValid
    }

    // Submit the post update
    const submitPost = async () => {
      // Validate form
      if (!validateForm()) {
        return
      }

      isSubmitting.value = true

      try {
        // Create request data
        const updateData = {
          title: formData.title,
          content: formData.content,
        }

        // Send request to API
        const response = await apiClient.put(`/Post/${props.post.postId}`, updateData)

        // Handle successful response
        console.log('Post updated successfully:', response.data)
        emit('post-updated', response.data)
        closeModal()
      } catch (error: any) {
        console.error('Error updating post:', error)

        // Handle validation errors from API
        if (error.response?.status === 400 && error.response.data) {
          // Map backend validation errors to our form errors
          const backendErrors = error.response.data.errors || error.response.data

          if (backendErrors.Title) {
            errors.title = Array.isArray(backendErrors.Title)
              ? backendErrors.Title[0]
              : backendErrors.Title
          }

          if (backendErrors.Content) {
            errors.content = Array.isArray(backendErrors.Content)
              ? backendErrors.Content[0]
              : backendErrors.Content
          }
        } else {
          // Generic error
          alert('更新失败，请稍后再试')
        }
      } finally {
        isSubmitting.value = false
      }
    }

    // Close the modal
    const closeModal = () => {
      emit('close')
    }

    return {
      formData,
      errors,
      isSubmitting,
      getImageUrl,
      submitPost,
      closeModal,
    }
  },
})
</script>
