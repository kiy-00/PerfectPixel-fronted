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
            <h3 class="text-lg font-medium text-neutral-dark mb-4">已上传照片预览</h3>
            <div class="flex justify-center">
              <div class="relative group rounded-lg overflow-hidden aspect-square max-w-sm w-full">
                <img :src="uploadedPhoto.url" class="w-full h-full object-cover" />
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
                  {{ uploadedPhoto.file.name }}
                </div>
              </div>
            </div>
          </div>

          <!-- 按钮区域 -->
          <div class="flex justify-between items-center">
            <span class="text-sm text-neutral-dark">
              {{ uploadedPhoto ? '已选择照片' : '请选择一张照片' }}
            </span>
            <button
              @click="proceedToOrderCreation"
              :disabled="!uploadedPhoto"
              :class="[
                'px-6 py-3 rounded-md font-medium transition-colors',
                uploadedPhoto
                  ? 'bg-primary text-white hover:bg-green-dark'
                  : 'bg-neutral text-neutral-dark cursor-not-allowed',
              ]"
            >
              下一步
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
import { defineComponent, ref, PropType } from 'vue'
import { useRouter } from 'vue-router'

interface UploadedPhoto {
  file: File
  url: string
}

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
    const fileInput = ref<HTMLInputElement | null>(null)
    const uploadedPhoto = ref<UploadedPhoto | null>(null)
    const isDragging = ref(false)

    // 处理文件选择
    const handleFileChange = (event: Event) => {
      const input = event.target as HTMLInputElement
      if (!input.files?.length) return

      processFile(input.files[0])
    }

    // 处理拖拽放置
    const handleDrop = (event: DragEvent) => {
      isDragging.value = false

      if (!event.dataTransfer?.files.length) return

      // 如果拖放了多个文件，只处理第一个
      const file = Array.from(event.dataTransfer.files).find((file) =>
        file.type.startsWith('image/'),
      )
      if (file) {
        processFile(file)
      }
    }

    // 处理文件
    const processFile = (file: File) => {
      // 检查是否为图片文件
      if (!file.type.startsWith('image/')) {
        alert('请选择图片文件')
        return
      }

      // 检查文件大小（20MB限制）
      if (file.size > 20 * 1024 * 1024) {
        alert(`文件 "${file.name}" 超过20MB限制，请重新选择`)
        return
      }

      // 如果已有照片，释放之前的URL资源
      if (uploadedPhoto.value) {
        URL.revokeObjectURL(uploadedPhoto.value.url)
      }

      // 创建预览URL
      const url = URL.createObjectURL(file)
      uploadedPhoto.value = { file, url }
    }

    // 移除照片
    const removePhoto = () => {
      if (uploadedPhoto.value) {
        // 释放URL资源
        URL.revokeObjectURL(uploadedPhoto.value.url)
        // 移除照片
        uploadedPhoto.value = null
      }
    }

    // 继续到订单创建
    const proceedToOrderCreation = () => {
      if (!uploadedPhoto.value) {
        alert('请选择一张照片')
        return
      }

      // 模拟上传完成后获取的照片ID
      const photoId = `photo-${Date.now()}`

      // 导航到下一步（订单创建）
      router.push({
        path: '/create-retouch-order',
        query: {
          retoucherId: props.retoucherId.toString(),
          photoId: photoId,
        },
      })
    }

    return {
      fileInput,
      uploadedPhoto,
      isDragging,
      handleFileChange,
      handleDrop,
      removePhoto,
      proceedToOrderCreation,
    }
  },
})
</script>
