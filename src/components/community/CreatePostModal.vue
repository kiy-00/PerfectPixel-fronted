<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
    <div class="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
      <!-- Modal header -->
      <div class="flex justify-between items-center px-6 py-4 border-b border-neutral-100">
        <h2 class="text-xl font-semibold text-neutral-dark">创建帖子</h2>
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

          <!-- Image upload -->
          <div>
            <label class="block text-sm font-medium text-neutral-dark mb-1">图片（可选）</label>
            <div
              @click="triggerFileInput"
              @dragover.prevent="isDragging = true"
              @dragleave.prevent="isDragging = false"
              @drop.prevent="handleFileDrop"
              class="cursor-pointer border-2 border-dashed rounded-md p-6 text-center transition-colors"
              :class="isDragging ? 'border-primary bg-green-50' : 'border-neutral'"
            >
              <div v-if="!previewImage">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-10 w-10 mx-auto text-neutral-dark"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="1.5"
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <p class="mt-2 text-sm text-neutral-dark">点击或拖放图片到此处上传</p>
                <p class="text-xs text-neutral mt-1">支持JPG, PNG, GIF格式，最大5MB</p>
              </div>
              <div v-else class="relative">
                <img :src="previewImage" alt="预览图片" class="max-h-64 mx-auto rounded-md" />
                <button
                  @click.stop="removeImage"
                  type="button"
                  class="absolute top-2 right-2 bg-black bg-opacity-50 rounded-full p-1 text-white hover:bg-opacity-70"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-5 w-5"
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
            </div>
            <input
              type="file"
              ref="fileInput"
              accept="image/jpeg,image/png,image/gif"
              @change="handleFileChange"
              class="hidden"
            />
            <p v-if="errors.image" class="mt-1 text-sm text-red-500">{{ errors.image }}</p>
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
          {{ isSubmitting ? '发布中...' : '发布帖子' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, onMounted } from 'vue'
import apiClient from '../../services/apiService'

export default defineComponent({
  name: 'CreatePostModal',
  emits: ['close', 'post-created'],
  setup(props, { emit }) {
    const fileInput = ref<HTMLInputElement | null>(null)
    const isDragging = ref(false)
    const previewImage = ref('')
    const selectedFile = ref<File | null>(null)
    const isSubmitting = ref(false)

    // Form data and validation
    const formData = reactive({
      title: '',
      content: '',
    })

    const errors = reactive({
      title: '',
      content: '',
      image: '',
    })

    // Open file browser when container is clicked
    const triggerFileInput = () => {
      fileInput.value?.click()
    }

    // Handle file selection from file browser
    const handleFileChange = (event: Event) => {
      const input = event.target as HTMLInputElement
      if (input.files && input.files[0]) {
        validateAndPreviewFile(input.files[0])
      }
    }

    // Handle file drop
    const handleFileDrop = (event: DragEvent) => {
      isDragging.value = false
      if (event.dataTransfer?.files.length) {
        validateAndPreviewFile(event.dataTransfer.files[0])
      }
    }

    // Validate and preview the selected file
    const validateAndPreviewFile = (file: File) => {
      // Reset error
      errors.image = ''

      // Validate file type
      const validTypes = ['image/jpeg', 'image/png', 'image/gif']
      if (!validTypes.includes(file.type)) {
        errors.image = '请上传JPG、PNG或GIF格式的图片'
        return
      }

      // Validate file size (5MB limit)
      const maxSize = 5 * 1024 * 1024 // 5MB in bytes
      if (file.size > maxSize) {
        errors.image = '图片大小不能超过5MB'
        return
      }

      // Store file and create preview
      selectedFile.value = file
      const reader = new FileReader()
      reader.onload = (e) => {
        previewImage.value = e.target?.result as string
      }
      reader.readAsDataURL(file)
    }

    // Remove selected image
    const removeImage = () => {
      selectedFile.value = null
      previewImage.value = ''
      if (fileInput.value) {
        fileInput.value.value = ''
      }
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

    // Submit the post
    const submitPost = async () => {
      // Validate form
      if (!validateForm()) {
        return
      }

      isSubmitting.value = true

      try {
        // Create form data for API request
        const postFormData = new FormData()
        postFormData.append('title', formData.title)
        postFormData.append('content', formData.content)

        if (selectedFile.value) {
          postFormData.append('image', selectedFile.value)
        }

        // Send request to API
        const response = await apiClient.post('/Post', postFormData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })

        // Handle successful response
        console.log('Post created successfully:', response.data)
        emit('post-created', response.data)
        closeModal()
      } catch (error: any) {
        console.error('Error creating post:', error)

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
          alert('发布失败，请稍后再试')
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
      fileInput,
      isDragging,
      previewImage,
      selectedFile,
      formData,
      errors,
      isSubmitting,
      triggerFileInput,
      handleFileChange,
      handleFileDrop,
      validateAndPreviewFile,
      removeImage,
      submitPost,
      closeModal,
    }
  },
})
</script>
