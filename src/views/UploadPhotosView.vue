<template>
  <div class="bg-neutral min-h-screen pb-10">
    <!-- 页面标题区域 -->
    <div class="bg-primary text-white px-6 py-4 shadow-md">
      <div class="container mx-auto">
        <div class="flex justify-between items-center">
          <div>
            <h1 class="text-2xl font-bold">上传修图照片</h1>
            <p class="text-sm text-green-light mt-1">
              选择您需要进行修图处理的照片，完成后将进入订单创建页面
            </p>
          </div>
          <button
            @click="$router.go(-1)"
            class="px-4 py-2 bg-white text-primary rounded-md hover:bg-green-light transition-colors"
          >
            返回
          </button>
        </div>
      </div>
    </div>

    <!-- 主要内容区域 -->
    <div class="container mx-auto px-4 mt-8">
      <div class="max-w-4xl mx-auto">
        <!-- 步骤指示器 -->
        <div class="bg-white rounded-lg shadow-md p-6 mb-6">
          <div class="flex items-center justify-between">
            <div class="flex flex-col items-center">
              <div
                class="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center text-lg font-bold"
              >
                1
              </div>
              <span class="mt-2 text-sm text-primary font-medium">上传照片</span>
            </div>
            <div class="h-1 flex-1 bg-neutral mx-2"></div>
            <div class="flex flex-col items-center">
              <div
                class="w-10 h-10 rounded-full bg-neutral-dark text-white flex items-center justify-center text-lg font-bold"
              >
                2
              </div>
              <span class="mt-2 text-sm text-neutral-dark font-medium">填写要求</span>
            </div>
            <div class="h-1 flex-1 bg-neutral mx-2"></div>
            <div class="flex flex-col items-center">
              <div
                class="w-10 h-10 rounded-full bg-neutral-dark text-white flex items-center justify-center text-lg font-bold"
              >
                3
              </div>
              <span class="mt-2 text-sm text-neutral-dark font-medium">确认订单</span>
            </div>
          </div>
        </div>

        <!-- 上传区域 -->
        <div class="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 class="text-xl font-semibold text-neutral-dark mb-6">选择照片</h2>

          <!-- 照片拖放区域 -->
          <div
            class="border-2 border-dashed border-neutral rounded-lg p-8 mb-6 text-center"
            @dragover.prevent="isDragging = true"
            @dragleave.prevent="isDragging = false"
            @drop.prevent="handleDrop"
            :class="{ 'border-primary bg-green-light bg-opacity-10': isDragging }"
          >
            <input
              type="file"
              ref="fileInput"
              @change="handleFileChange"
              accept="image/*"
              class="hidden"
            />

            <div v-if="!uploadedPhoto">
              <svg
                class="mx-auto h-16 w-16 text-neutral"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1"
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <h3 class="mt-4 text-neutral-dark font-medium">拖放照片到此处或点击选择</h3>
              <p class="mt-2 text-sm text-neutral-dark">支持 JPEG, PNG 格式的图片文件</p>
              <button
                @click="$refs.fileInput.click()"
                class="mt-4 px-6 py-2 bg-primary text-white rounded-md hover:bg-green-dark transition-colors"
              >
                选择照片
              </button>
            </div>

            <div v-else class="text-center">
              <p class="text-neutral-dark mb-4">已选择照片</p>
              <button
                @click="$refs.fileInput.click()"
                class="px-6 py-2 bg-primary text-white rounded-md hover:bg-green-dark transition-colors"
              >
                更换照片
              </button>
            </div>
          </div>

          <!-- 照片预览区域 -->
          <div v-if="uploadedPhoto" class="mb-6">
            <h3 class="text-lg font-medium text-neutral-dark mb-4">照片预览</h3>
            <div class="mx-auto max-w-md">
              <div class="relative group rounded-lg overflow-hidden">
                <img :src="uploadedPhoto.url" class="w-full object-contain max-h-80" />
                <div
                  class="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                >
                  <button
                    @click="removePhoto"
                    class="bg-red-600 text-white rounded-full p-2 hover:bg-red-700 transition-colors"
                  >
                    <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
                <div
                  class="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white text-xs p-1 truncate"
                >
                  {{ uploadedPhoto.file ? uploadedPhoto.file.name : '已上传照片' }}
                </div>
              </div>
            </div>
          </div>

          <!-- 照片信息表单 -->
          <div v-if="uploadedPhoto" class="mb-6">
            <h3 class="text-lg font-medium text-neutral-dark mb-4">照片信息</h3>
            <div class="space-y-4">
              <!-- 照片标题 -->
              <div>
                <label for="photoTitle" class="block text-neutral-dark mb-2">
                  照片标题 <span class="text-error">*</span>
                </label>
                <input
                  type="text"
                  id="photoTitle"
                  v-model="uploadedPhoto.title"
                  class="w-full px-4 py-2 border border-neutral rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="请输入照片标题"
                  required
                />
              </div>

              <!-- 照片描述 -->
              <div>
                <label for="photoDescription" class="block text-neutral-dark mb-2">
                  照片描述 <span class="text-error">*</span>
                </label>
                <textarea
                  id="photoDescription"
                  v-model="uploadedPhoto.description"
                  rows="3"
                  class="w-full px-4 py-2 border border-neutral rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="请描述这张照片的修图需求或其他信息"
                  required
                ></textarea>
              </div>
            </div>
          </div>

          <!-- 按钮区域 -->
          <div class="flex justify-between items-center">
            <span class="text-sm text-neutral-dark">
              {{ uploadedPhoto ? '已选择照片' : '请选择一张照片' }}
            </span>
            <button
              @click="uploadAndProceed"
              :disabled="!canProceed"
              :class="[
                'px-6 py-3 rounded-md font-medium transition-colors',
                canProceed
                  ? 'bg-primary text-white hover:bg-green-dark'
                  : 'bg-neutral text-neutral-dark cursor-not-allowed',
              ]"
            >
              {{ isUploading ? '上传中...' : '下一步' }}
            </button>
          </div>
        </div>

        <!-- 照片上传说明 -->
        <div class="bg-white rounded-lg shadow-md p-6">
          <h3 class="font-semibold text-lg text-neutral-dark mb-4">照片上传说明</h3>
          <ul class="list-disc list-inside space-y-2 text-neutral-dark">
            <li>请上传您需要修图的原始照片，建议使用高分辨率图片</li>
            <li>支持的文件格式：JPEG、PNG</li>
            <li>单张照片最大文件大小：20MB</li>
            <li>一次只能上传一张照片</li>
            <li>请确保您拥有上传照片的版权或使用权</li>
            <li>上传后可进行预览，确认无误后进入下一步</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, PropType, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import apiClient from '../services/apiService'

interface UploadedPhoto {
  file: File | null
  url: string
  title: string
  description: string
  uploadedPhotoId?: string
  uploadedPhotoUrl?: string
  uploadedThumbnailUrl?: string
  isFromStorage?: boolean
}

// Storage key for persisting uploaded photo data
const UPLOADED_PHOTO_STORAGE_KEY = 'perfectpixel-photo'

export default defineComponent({
  name: 'UploadPhotosView',
  props: {
    retoucherId: {
      type: Number as PropType<number>,
      required: true,
    },
  },
  setup(props) {
    const router = useRouter()
    const route = useRoute()
    const fileInput = ref<HTMLInputElement | null>(null)
    const uploadedPhoto = ref<UploadedPhoto | null>(null)
    const isDragging = ref(false)
    const isUploading = ref(false)

    // 计算是否可以进行下一步
    const canProceed = computed(() => {
      if (!uploadedPhoto.value) return false
      return (
        !!uploadedPhoto.value.title &&
        !!uploadedPhoto.value.description &&
        (!!uploadedPhoto.value.uploadedPhotoId || !isUploading.value)
      )
    })

    // Save uploaded photo information to storage
    const saveUploadedPhotoToStorage = (photo: UploadedPhoto) => {
      const photoToStore = {
        title: photo.title,
        description: photo.description,
        uploadedPhotoId: photo.uploadedPhotoId,
        uploadedPhotoUrl: photo.uploadedPhotoUrl,
        uploadedThumbnailUrl: photo.uploadedThumbnailUrl,
        // Store the original file name for debugging
        originalFileName: photo.file ? photo.file.name : null,
        // Store time for debugging
        uploadTime: new Date().toISOString(),
        retoucherId: props.retoucherId,
      }

      localStorage.setItem(UPLOADED_PHOTO_STORAGE_KEY, JSON.stringify(photoToStore))
      console.log('照片信息已保存到本地存储:', photoToStore)
    }

    // Load previously uploaded photo information from storage
    const loadUploadedPhotoFromStorage = () => {
      try {
        const storedPhotoString = localStorage.getItem(UPLOADED_PHOTO_STORAGE_KEY)
        if (!storedPhotoString) return null

        const storedPhoto = JSON.parse(storedPhotoString)

        // Only restore if it's for the same retoucher
        if (storedPhoto.retoucherId !== props.retoucherId) return null

        console.log('找到存储的照片信息:', storedPhoto)

        // Get the STATIC ASSETS URL instead of API base URL
        const staticAssetsUrl = import.meta.env.VITE_STATIC_ASSETS_URL || ''

        // Use paths directly from the server without modification
        let photoUrl = storedPhoto.uploadedPhotoUrl
        let thumbnailUrl = storedPhoto.uploadedThumbnailUrl || ''

        // Make sure URLs are absolute by prepending the static assets URL if needed
        photoUrl = photoUrl.startsWith('http') ? photoUrl : `${staticAssetsUrl}${photoUrl}`
        thumbnailUrl =
          thumbnailUrl.startsWith('http') || !thumbnailUrl
            ? thumbnailUrl
            : `${staticAssetsUrl}${thumbnailUrl}`

        // Create a photo object from stored data
        return {
          file: null, // We don't have the actual file object anymore
          url: photoUrl, // Use the complete URL with static assets base
          title: storedPhoto.title,
          description: storedPhoto.description,
          uploadedPhotoId: storedPhoto.uploadedPhotoId,
          uploadedPhotoUrl: photoUrl,
          uploadedThumbnailUrl: thumbnailUrl,
          isFromStorage: true,
        } as UploadedPhoto
      } catch (error) {
        console.error('从存储加载照片信息失败:', error)
        return null
      }
    }

    // Clear stored photo information
    const clearStoredPhotoInfo = () => {
      localStorage.removeItem(UPLOADED_PHOTO_STORAGE_KEY)
      console.log('已清除存储的照片信息')
    }

    // 处理文件选择
    const handleFileChange = (event: Event) => {
      const input = event.target as HTMLInputElement
      if (!input.files?.length) return

      const file = input.files[0]
      processFile(file)
    }

    // 处理拖拽放置
    const handleDrop = (event: DragEvent) => {
      isDragging.value = false

      if (!event.dataTransfer?.files.length) return

      const file = event.dataTransfer.files[0]
      processFile(file)
    }

    // 处理文件
    const processFile = (file: File) => {
      // 检查是否是图片文件
      if (!file.type.startsWith('image/')) {
        alert('请上传图片文件')
        return
      }

      // 检查文件大小（20MB限制）
      if (file.size > 20 * 1024 * 1024) {
        alert(`文件 "${file.name}" 超过20MB限制，请重新选择`)
        return
      }

      // 如果已经有上传的照片，先释放其URL资源
      if (uploadedPhoto.value && !uploadedPhoto.value.isFromStorage) {
        URL.revokeObjectURL(uploadedPhoto.value.url)
      }

      // Clear any stored photo data when selecting a new image
      clearStoredPhotoInfo()

      // 创建预览URL
      const url = URL.createObjectURL(file)
      uploadedPhoto.value = {
        file,
        url,
        title: '',
        description: '',
      }
    }

    // 移除照片 (简化版本 - 不再调用后端删除API)
    const removePhoto = () => {
      if (uploadedPhoto.value) {
        // 释放URL资源，但仅当它不是从存储加载的
        if (!uploadedPhoto.value.isFromStorage) {
          URL.revokeObjectURL(uploadedPhoto.value.url)
        }
        uploadedPhoto.value = null

        // Clear stored information when removing a photo
        clearStoredPhotoInfo()
      }
    }

    // 上传照片到服务器并继续到订单创建
    const uploadAndProceed = async () => {
      if (!uploadedPhoto.value || !uploadedPhoto.value.title || !uploadedPhoto.value.description) {
        alert('请填写完整的照片信息')
        return
      }

      // If the photo was already uploaded (loaded from storage), just proceed
      if (uploadedPhoto.value.isFromStorage && uploadedPhoto.value.uploadedPhotoId) {
        console.log('使用已存储的照片信息，跳过上传', uploadedPhoto.value)
        router.push({
          path: '/create-retouch-order',
          query: {
            retoucherId: props.retoucherId.toString(),
            photoId: uploadedPhoto.value.uploadedPhotoId,
            photoUrl: uploadedPhoto.value.uploadedPhotoUrl,
            photoTitle: encodeURIComponent(uploadedPhoto.value.title),
            photoDescription: encodeURIComponent(uploadedPhoto.value.description),
          },
        })
        return
      }

      try {
        isUploading.value = true

        // 准备FormData对象 - 直接发送到general endpoint
        const formData = new FormData()
        formData.append('file', uploadedPhoto.value.file!)
        formData.append('title', uploadedPhoto.value.title)
        formData.append('description', uploadedPhoto.value.description)

        console.log('正在上传照片:', {
          fileName: uploadedPhoto.value.file!.name,
          fileSize: uploadedPhoto.value.file!.size,
          title: uploadedPhoto.value.title,
          description: uploadedPhoto.value.description,
        })

        // 直接调用general照片上传API
        const response = await apiClient.post('/Photo/upload/general', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })

        console.log('照片上传成功:', response.data)

        // 获取静态资源URL前缀
        const staticAssetsUrl = import.meta.env.VITE_STATIC_ASSETS_URL || ''

        // 保存上传成功后返回的信息
        if (uploadedPhoto.value) {
          uploadedPhoto.value.uploadedPhotoId = response.data.photoId

          // Use paths directly from the server without modification
          const photoUrl = response.data.photoUrl
          const thumbnailUrl = response.data.thumbnailUrl

          // 添加完整的URL路径
          uploadedPhoto.value.uploadedPhotoUrl = photoUrl.startsWith('http')
            ? photoUrl
            : `${staticAssetsUrl}${photoUrl}`
          uploadedPhoto.value.uploadedThumbnailUrl = thumbnailUrl.startsWith('http')
            ? thumbnailUrl
            : `${staticAssetsUrl}${thumbnailUrl}`

          // Save to storage
          saveUploadedPhotoToStorage(uploadedPhoto.value)
        }

        // 导航到下一步（订单创建）
        router.push({
          path: '/create-retouch-order',
          query: {
            retoucherId: props.retoucherId.toString(),
            photoId: response.data.photoId,
            photoUrl: uploadedPhoto.value.uploadedPhotoUrl,
            photoTitle: encodeURIComponent(uploadedPhoto.value.title),
            photoDescription: encodeURIComponent(uploadedPhoto.value.description),
          },
        })
      } catch (error) {
        console.error('照片上传失败:', error)
        alert('照片上传失败，请稍后重试')
      } finally {
        isUploading.value = false
      }
    }

    // On component mount, check for previously uploaded photos
    onMounted(() => {
      const storedPhoto = loadUploadedPhotoFromStorage()
      if (storedPhoto) {
        console.log('正在恢复之前上传的照片:', storedPhoto)
        uploadedPhoto.value = storedPhoto
      }
    })

    return {
      fileInput,
      uploadedPhoto,
      isDragging,
      isUploading,
      canProceed,
      handleFileChange,
      handleDrop,
      removePhoto,
      uploadAndProceed,
    }
  },
})
</script>
