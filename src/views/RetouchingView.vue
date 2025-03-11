<template>
  <div class="flex h-screen bg-neutral overflow-hidden">
    <!-- 左侧工具栏 -->
    <div class="w-72 bg-white shadow-lg h-full flex flex-col">
      <div class="px-4 py-5 border-b border-green-light">
        <h1 class="text-xl font-bold text-primary">自助修图工具</h1>
        <p class="text-sm text-green-dark">选择工具并调整参数</p>
      </div>

      <!-- 工具选项 -->
      <div class="flex-1 overflow-y-auto p-4">
        <!-- 基础调整 -->
        <div class="mb-6">
          <h2 class="font-medium text-neutral-dark mb-3">基础调整</h2>

          <!-- 亮度调整 -->
          <div class="mb-4">
            <div class="flex justify-between">
              <label class="text-sm text-neutral-dark">亮度</label>
              <span class="text-xs text-primary">{{ brightness }}%</span>
            </div>
            <input
              type="range"
              v-model="brightness"
              min="-100"
              max="100"
              step="1"
              class="w-full h-2 bg-neutral rounded-lg appearance-none cursor-pointer"
              @input="applyFilters"
            />
          </div>

          <!-- 对比度调整 -->
          <div class="mb-4">
            <div class="flex justify-between">
              <label class="text-sm text-neutral-dark">对比度</label>
              <span class="text-xs text-primary">{{ contrast }}%</span>
            </div>
            <input
              type="range"
              v-model="contrast"
              min="-100"
              max="100"
              step="1"
              class="w-full h-2 bg-neutral rounded-lg appearance-none cursor-pointer"
              @input="applyFilters"
            />
          </div>

          <!-- 饱和度调整 -->
          <div class="mb-4">
            <div class="flex justify-between">
              <label class="text-sm text-neutral-dark">饱和度</label>
              <span class="text-xs text-primary">{{ saturation }}%</span>
            </div>
            <input
              type="range"
              v-model="saturation"
              min="-100"
              max="100"
              step="1"
              class="w-full h-2 bg-neutral rounded-lg appearance-none cursor-pointer"
              @input="applyFilters"
            />
          </div>
        </div>

        <!-- 锐化工具 -->
        <div class="mb-6">
          <h2 class="font-medium text-neutral-dark mb-3">锐化工具</h2>

          <div class="mb-4">
            <div class="flex justify-between">
              <label class="text-sm text-neutral-dark">锐化程度</label>
              <span class="text-xs text-primary">{{ sharpness }}%</span>
            </div>
            <input
              type="range"
              v-model="sharpness"
              min="0"
              max="100"
              step="1"
              class="w-full h-2 bg-neutral rounded-lg appearance-none cursor-pointer"
              @input="applyFilters"
            />
          </div>
        </div>

        <!-- 滤镜效果 -->
        <div class="mb-6">
          <h2 class="font-medium text-neutral-dark mb-3">滤镜效果</h2>

          <div class="grid grid-cols-3 gap-2">
            <button
              v-for="filter in filters"
              :key="filter.name"
              @click="applyFilter(filter.name)"
              :class="[
                'p-2 text-center text-xs rounded-md transition-colors',
                selectedFilter === filter.name
                  ? 'bg-primary text-white'
                  : 'bg-neutral bg-opacity-30 text-neutral-dark hover:bg-green-light hover:bg-opacity-20',
              ]"
            >
              {{ filter.label }}
            </button>
          </div>
        </div>

        <!-- 图片裁剪 -->
        <div class="mb-6">
          <h2 class="font-medium text-neutral-dark mb-3">图片裁剪</h2>

          <div class="mb-3">
            <button
              @click="startCropping"
              :class="[
                'w-full p-2 rounded-md text-sm',
                isCropping
                  ? 'bg-primary text-white'
                  : 'border border-primary text-primary hover:bg-green-light hover:bg-opacity-10',
              ]"
            >
              {{ isCropping ? '取消裁剪' : '开始裁剪' }}
            </button>
          </div>

          <div v-if="isCropping" class="mb-4 p-3 bg-neutral bg-opacity-20 rounded-md">
            <div class="flex space-x-2 mb-3">
              <button
                v-for="ratio in cropRatios"
                :key="ratio.value"
                @click="setCropRatio(ratio.value)"
                :class="[
                  'px-2 py-1 text-xs rounded',
                  currentCropRatio === ratio.value
                    ? 'bg-primary text-white'
                    : 'bg-white text-neutral-dark',
                ]"
              >
                {{ ratio.label }}
              </button>
            </div>

            <button
              @click="applyCrop"
              class="w-full p-2 bg-green-dark text-white rounded-md text-sm"
            >
              确认裁剪
            </button>
          </div>
        </div>
      </div>

      <!-- 重置按钮 -->
      <div class="p-4 border-t border-green-light">
        <button
          @click="resetAllSettings"
          class="w-full p-2 border border-error text-error rounded-md hover:bg-error hover:bg-opacity-10 transition-colors"
        >
          重置所有设置
        </button>
      </div>
    </div>

    <!-- 中间编辑区域 -->
    <div class="flex-1 flex flex-col p-6 overflow-hidden">
      <!-- 图片对比区域 -->
      <div class="flex-1 flex flex-col items-center justify-center relative overflow-auto">
        <div v-if="!imageUrl" class="text-center">
          <div class="mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-24 w-24 mx-auto text-neutral-dark opacity-30"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
          <p class="text-neutral-dark">请上传需要修图的图片</p>
        </div>

        <div
          v-else
          class="relative max-w-full max-h-[calc(100vh-160px)] flex justify-center items-center"
        >
          <!-- 原始图片 -->
          <img
            :src="imageUrl"
            alt="原始图片"
            ref="originalImage"
            class="max-w-full max-h-full object-contain"
            :style="{ display: showProcessed ? 'none' : 'block' }"
            @load="onImageLoad"
          />

          <!-- 处理后的图片 -->
          <img
            :src="processedImageUrl"
            alt="处理后图片"
            ref="processedImage"
            class="max-w-full max-h-full object-contain"
            :style="{
              display: showProcessed && processedImageUrl ? 'block' : 'none',
              border: debugMode ? '2px solid red' : 'none',
            }"
          />

          <!-- Debug message -->
          <div
            v-if="showProcessed && !processedImageUrl"
            class="absolute top-0 left-0 bg-red-500 text-white p-2"
          >
            无处理后的图片 (debug)
          </div>

          <!-- 裁剪区域 -->
          <div
            v-if="isCropping && imageUrl"
            ref="cropBox"
            class="absolute border-2 border-primary cursor-move"
            :style="{
              left: cropArea.left + 'px',
              top: cropArea.top + 'px',
              width: cropArea.width + 'px',
              height: cropArea.height + 'px',
            }"
            @mousedown="startDragCrop($event)"
          >
            <!-- 裁剪区域的拖拽点 -->
            <div
              class="absolute -m-1 w-3 h-3 bg-white border-2 border-primary rounded-full right-0 bottom-0 cursor-se-resize"
              @mousedown.stop="startResizeCrop($event, 'se')"
            ></div>
            <div
              class="absolute -m-1 w-3 h-3 bg-white border-2 border-primary rounded-full left-0 bottom-0 cursor-sw-resize"
              @mousedown.stop="startResizeCrop($event, 'sw')"
            ></div>
            <div
              class="absolute -m-1 w-3 h-3 bg-white border-2 border-primary rounded-full right-0 top-0 cursor-ne-resize"
              @mousedown.stop="startResizeCrop($event, 'ne')"
            ></div>
            <div
              class="absolute -m-1 w-3 h-3 bg-white border-2 border-primary rounded-full left-0 top-0 cursor-nw-resize"
              @mousedown.stop="startResizeCrop($event, 'nw')"
            ></div>
          </div>
        </div>
      </div>

      <!-- 对比按钮 - 固定在底部 -->
      <div class="mt-4 flex justify-center sticky bottom-4" v-if="imageUrl">
        <button
          @click="toggleProcessedView"
          :class="[
            'px-4 py-2 rounded-md text-sm transition-colors shadow-md',
            showProcessed
              ? 'bg-primary text-white'
              : 'border border-primary text-primary hover:bg-green-light hover:bg-opacity-10',
          ]"
        >
          {{ showProcessed ? '查看原图' : '查看处理后' }}
        </button>

        <!-- Debug button to help troubleshoot -->
        <button
          v-if="debugMode"
          @click="forceCreateProcessed"
          class="ml-2 px-4 py-2 bg-red-500 text-white rounded-md text-sm"
        >
          重新生成处理图
        </button>
      </div>
    </div>

    <!-- 右下角悬浮按钮 -->
    <div class="fixed bottom-8 right-8 flex flex-col space-y-4">
      <!-- 上传按钮 -->
      <label
        class="h-14 w-14 flex items-center justify-center rounded-full bg-primary text-white shadow-lg cursor-pointer hover:bg-green-dark transition-colors"
      >
        <input type="file" class="hidden" accept="image/*" @change="handleImageUpload" />
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
            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0l-4 4m4-4v12"
          />
        </svg>
      </label>

      <!-- 下载按钮 -->
      <button
        @click="downloadProcessedImage"
        :disabled="!imageUrl || !processedImageUrl"
        :class="[
          'h-14 w-14 flex items-center justify-center rounded-full shadow-lg transition-colors',
          imageUrl && processedImageUrl
            ? 'bg-green-dark text-white hover:bg-primary'
            : 'bg-neutral text-neutral-dark cursor-not-allowed',
        ]"
      >
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
            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4 4l-4 4m0 0l-4-4m4 4v-12"
          />
        </svg>
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, onMounted, onUnmounted, nextTick, watch } from 'vue'

export default defineComponent({
  name: 'RetouchingView',
  setup() {
    // 图片相关
    const imageUrl = ref('')
    const processedImageUrl = ref('')
    const originalImage = ref<HTMLImageElement | null>(null)
    const processedImage = ref<HTMLImageElement | null>(null)
    // 将这个修改成false
    const showProcessed = ref(false)
    const imageLoaded = ref(false)

    // 调整参数
    const brightness = ref(0)
    const contrast = ref(0)
    const saturation = ref(0)
    const sharpness = ref(0)
    const selectedFilter = ref('none')

    // 滤镜列表
    const filters = [
      { name: 'none', label: '无' },
      { name: 'warm', label: '暖调' },
      { name: 'cool', label: '冷调' },
      { name: 'vintage', label: '复古' },
      { name: 'grayscale', label: '黑白' },
      { name: 'sepia', label: '棕褐色' },
      { name: 'clarity', label: '清晰' },
      { name: 'vivid', label: '鲜艳' },
      { name: 'dreamy', label: '梦幻' },
    ]

    // 裁剪相关
    const isCropping = ref(false)
    const cropBox = ref<HTMLElement | null>(null)
    const cropArea = reactive({
      left: 0,
      top: 0,
      width: 0,
      height: 0,
    })
    const cropRatios = [
      { value: 'free', label: '自由' },
      { value: '1:1', label: '1:1' },
      { value: '4:3', label: '4:3' },
      { value: '16:9', label: '16:9' },
      { value: '3:4', label: '3:4' },
    ]
    const currentCropRatio = ref('free')
    let isDraggingCrop = false
    let isResizingCrop = false
    let resizeDirection = ''
    let startX = 0
    let startY = 0
    let startCropArea = { left: 0, top: 0, width: 0, height: 0 }

    // 文件上传处理
    const handleImageUpload = (event: Event) => {
      console.log('handleImageUpload triggered')
      const input = event.target as HTMLInputElement
      if (input.files && input.files[0]) {
        const file = input.files[0]
        const reader = new FileReader()

        reader.onload = (e: ProgressEvent<FileReader>) => {
          if (e.target && typeof e.target.result === 'string') {
            imageUrl.value = e.target.result
            processedImageUrl.value = ''
            imageLoaded.value = false

            // Force show the original image first
            showProcessed.value = false
            console.log('Image uploaded, showing original image')

            // Reset all settings
            resetAllSettings()
          }
        }

        reader.readAsDataURL(file)
      }
    }

    // 应用滤镜效果
    const applyFilter = (filterName: string) => {
      selectedFilter.value = filterName
      applyFilters()
    }

    // 应用所有图像处理效果
    const applyFilters = () => {
      if (!imageLoaded.value) {
        console.log('图片尚未加载，跳过滤镜应用')
        return
      }

      console.log('应用过滤器...')
      if (!imageUrl.value || !originalImage.value) {
        console.error('缺少原始图片，无法应用滤镜')
        return
      }

      try {
        // 创建离屏 canvas
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        if (!ctx) return

        const img = originalImage.value
        canvas.width = img.naturalWidth
        canvas.height = img.naturalHeight

        // 绘制原始图像
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

        // 应用亮度、对比度和饱和度调整
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
        const data = imageData.data

        const brightnessValue = Number(brightness.value) / 100
        const contrastValue = Number(contrast.value) / 100
        const saturationValue = Number(saturation.value) / 100

        for (let i = 0; i < data.length; i += 4) {
          // 亮度
          if (brightnessValue !== 0) {
            data[i] += brightnessValue * 255
            data[i + 1] += brightnessValue * 255
            data[i + 2] += brightnessValue * 255
          }
          // 对比度 (简单公式示例)
          if (contrastValue !== 0) {
            const factor = (259 * (contrastValue + 1)) / (1 * (259 - contrastValue))
            data[i] = factor * (data[i] - 128) + 128
            data[i + 1] = factor * (data[i + 1] - 128) + 128
            data[i + 2] = factor * (data[i + 2] - 128) + 128
          }
          // 饱和度 (简单示例)
          if (saturationValue !== 0) {
            const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]
            data[i] += (data[i] - gray) * saturationValue
            data[i + 1] += (data[i + 1] - gray) * saturationValue
            data[i + 2] += (data[i + 2] - gray) * saturationValue
          }
        }

        ctx.putImageData(imageData, 0, 0)

        // 应用锐化效果
        if (Number(sharpness.value) > 0) {
          const sharpnessValue = Number(sharpness.value) / 100
          const tempCanvas = document.createElement('canvas')
          const tempCtx = tempCanvas.getContext('2d')
          if (tempCtx) {
            tempCanvas.width = canvas.width
            tempCanvas.height = canvas.height

            // 绘制当前图像
            tempCtx.drawImage(canvas, 0, 0)

            // 应用锐化卷积核
            const strength = 0.5 * sharpnessValue
            const kernel = [
              [0, -strength, 0],
              [-strength, 1 + 4 * strength, -strength],
              [0, -strength, 0],
            ]

            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
            const tempData = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height)
            const data = imageData.data
            const tempDataArr = tempData.data

            // 应用卷积
            for (let y = 1; y < canvas.height - 1; y++) {
              for (let x = 1; x < canvas.width - 1; x++) {
                const offset = (y * canvas.width + x) * 4

                for (let c = 0; c < 3; c++) {
                  let val = 0
                  for (let ky = -1; ky <= 1; ky++) {
                    for (let kx = -1; kx <= 1; kx++) {
                      const idx = ((y + ky) * canvas.width + (x + kx)) * 4 + c
                      val += tempDataArr[idx] * kernel[ky + 1][kx + 1]
                    }
                  }
                  data[offset + c] = Math.min(255, Math.max(0, val))
                }
              }
            }

            ctx.putImageData(imageData, 0, 0)
          }
        }

        // 应用滤镜效果
        if (selectedFilter.value !== 'none') {
          switch (selectedFilter.value) {
            case 'warm':
              ctx.globalCompositeOperation = 'source-over'
              ctx.fillStyle = 'rgba(255, 150, 0, 0.15)'
              ctx.fillRect(0, 0, canvas.width, canvas.height)
              break
            case 'cool':
              ctx.globalCompositeOperation = 'source-over'
              ctx.fillStyle = 'rgba(0, 150, 255, 0.15)'
              ctx.fillRect(0, 0, canvas.width, canvas.height)
              break
            case 'vintage':
              const vintageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
              const vintageDataArr = vintageData.data
              for (let i = 0; i < vintageDataArr.length; i += 4) {
                vintageDataArr[i] = vintageDataArr[i] * 1.2
                vintageDataArr[i + 1] = vintageDataArr[i + 1] * 0.9
                vintageDataArr[i + 2] = vintageDataArr[i + 2] * 0.8
              }
              ctx.putImageData(vintageData, 0, 0)
              break
            case 'grayscale':
              const grayscaleData = ctx.getImageData(0, 0, canvas.width, canvas.height)
              const grayscaleDataArr = grayscaleData.data
              for (let i = 0; i < grayscaleDataArr.length; i += 4) {
                const avg =
                  (grayscaleDataArr[i] + grayscaleDataArr[i + 1] + grayscaleDataArr[i + 2]) / 3
                grayscaleDataArr[i] = avg
                grayscaleDataArr[i + 1] = avg
                grayscaleDataArr[i + 2] = avg
              }
              ctx.putImageData(grayscaleData, 0, 0)
              break
            case 'sepia':
              const sepiaData = ctx.getImageData(0, 0, canvas.width, canvas.height)
              const sepiaDataArr = sepiaData.data
              for (let i = 0; i < sepiaDataArr.length; i += 4) {
                const r = sepiaDataArr[i]
                const g = sepiaDataArr[i + 1]
                const b = sepiaDataArr[i + 2]
                sepiaDataArr[i] = Math.min(255, r * 0.393 + g * 0.769 + b * 0.189)
                sepiaDataArr[i + 1] = Math.min(255, r * 0.349 + g * 0.686 + b * 0.168)
                sepiaDataArr[i + 2] = Math.min(255, r * 0.272 + g * 0.534 + b * 0.131)
              }
              ctx.putImageData(sepiaData, 0, 0)
              break
            case 'clarity':
              // 清晰度增强 (类似于锐化但更平滑)
              const clarityData = ctx.getImageData(0, 0, canvas.width, canvas.height)
              const originalData = new Uint8ClampedArray(clarityData.data)
              const clarityDataArr = clarityData.data

              for (let y = 1; y < canvas.height - 1; y++) {
                for (let x = 1; x < canvas.width - 1; x++) {
                  const idx = (y * canvas.width + x) * 4

                  for (let c = 0; c < 3; c++) {
                    const current = originalData[idx + c]
                    const up = originalData[((y - 1) * canvas.width + x) * 4 + c]
                    const down = originalData[((y + 1) * canvas.width + x) * 4 + c]
                    const left = originalData[(y * canvas.width + (x - 1)) * 4 + c]
                    const right = originalData[(y * canvas.width + (x + 1)) * 4 + c]

                    const diff = current * 2 - (up + down + left + right) / 4
                    clarityDataArr[idx + c] = Math.min(255, Math.max(0, current + diff * 0.3))
                  }
                }
              }

              ctx.putImageData(clarityData, 0, 0)
              break
            case 'vivid':
              // 鲜艳效果 (增加对比度和饱和度)
              const vividData = ctx.getImageData(0, 0, canvas.width, canvas.height)
              const vividDataArr = vividData.data

              for (let i = 0; i < vividDataArr.length; i += 4) {
                // 增加对比度
                vividDataArr[i] = Math.min(255, Math.max(0, (vividDataArr[i] - 128) * 1.2 + 128))
                vividDataArr[i + 1] = Math.min(
                  255,
                  Math.max(0, (vividDataArr[i + 1] - 128) * 1.2 + 128),
                )
                vividDataArr[i + 2] = Math.min(
                  255,
                  Math.max(0, (vividDataArr[i + 2] - 128) * 1.2 + 128),
                )

                // 增加饱和度
                const avg = (vividDataArr[i] + vividDataArr[i + 1] + vividDataArr[i + 2]) / 3
                vividDataArr[i] = Math.min(
                  255,
                  Math.max(0, vividDataArr[i] + (vividDataArr[i] - avg) * 0.3),
                )
                vividDataArr[i + 1] = Math.min(
                  255,
                  Math.max(0, vividDataArr[i + 1] + (vividDataArr[i + 1] - avg) * 0.3),
                )
                vividDataArr[i + 2] = Math.min(
                  255,
                  Math.max(0, vividDataArr[i + 2] + (vividDataArr[i + 2] - avg) * 0.3),
                )
              }

              ctx.putImageData(vividData, 0, 0)
              break
            case 'dreamy':
              // 梦幻效果 (增加曝光和柔光)
              ctx.globalCompositeOperation = 'source-over'

              // 绘制轻微的发光效果
              ctx.shadowColor = 'rgba(255, 255, 255, 0.3)'
              ctx.shadowBlur = 10
              ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

              // 增加淡紫色调
              ctx.globalCompositeOperation = 'overlay'
              ctx.fillStyle = 'rgba(180, 180, 255, 0.15)'
              ctx.fillRect(0, 0, canvas.width, canvas.height)

              // 重置合成模式
              ctx.globalCompositeOperation = 'source-over'
              break
          }
        }

        // 转换为URL
        processedImageUrl.value = canvas.toDataURL('image/jpeg', 0.9)
        console.log(
          '滤镜应用完成，已更新处理后URL',
          processedImageUrl.value.substring(0, 30) + '...',
        )

        // Test if image is valid by preloading it
        const testImg = new Image()
        testImg.onload = () => {
          console.log('处理后图片已成功加载，尺寸:', testImg.width, 'x', testImg.height)
        }
        testImg.onerror = (e) => {
          console.error('处理后图片加载失败:', e)
          // Fallback to original image in case of failure
          processedImageUrl.value = imageUrl.value
        }
        testImg.src = processedImageUrl.value
      } catch (error) {
        console.error('应用滤镜时出错:', error)
        // Fallback to original image
        processedImageUrl.value = imageUrl.value
      }
    }

    // 下载处理后的图片
    const downloadProcessedImage = () => {
      if (!processedImageUrl.value) return

      const link = document.createElement('a')
      link.href = processedImageUrl.value
      link.download = 'edited_image.jpg'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }

    // 重置所有设置
    const resetAllSettings = () => {
      brightness.value = 0
      contrast.value = 0
      saturation.value = 0
      sharpness.value = 0
      selectedFilter.value = 'none'
      isCropping.value = false
      cropArea.left = 0
      cropArea.top = 0
      cropArea.width = 0
      cropArea.height = 0
      currentCropRatio.value = 'free'

      if (imageLoaded.value) {
        nextTick(() => {
          applyFilters()
        })
      }
    }

    const toggleProcessedView = () => {
      console.log('切换视图, 之前值:', showProcessed.value)

      // Crucial fix: apply filters before changing view if needed
      if (!showProcessed.value && imageLoaded.value) {
        // We're switching TO processed view, ensure we have a processed image
        if (!processedImageUrl.value) {
          console.log('应用滤镜生成处理后的图片...')
          applyFilters()
        }

        // Only change to processed view if we actually have a processed image
        if (processedImageUrl.value) {
          showProcessed.value = true
          console.log('切换到处理后视图, URL存在:', !!processedImageUrl.value)
        } else {
          console.error('无法切换视图 - 处理后的图片不存在')
        }
      } else {
        // Switching TO original view is always safe
        showProcessed.value = false
        console.log('切换到原图视图')
      }
    }

    // 裁剪功能
    const startCropping = () => {
      isCropping.value = !isCropping.value

      if (isCropping.value && originalImage.value) {
        // 初始化裁剪区域
        const rect = originalImage.value.getBoundingClientRect()
        const size = Math.min(rect.width, rect.height) * 0.8

        cropArea.left = (rect.width - size) / 2
        cropArea.top = (rect.height - size) / 2
        cropArea.width = size
        cropArea.height = size
      }
    }

    const setCropRatio = (ratio: string) => {
      currentCropRatio.value = ratio

      if (originalImage.value) {
        const rect = originalImage.value.getBoundingClientRect()
        const currentWidth = cropArea.width
        let newHeight = currentWidth

        // 根据比例调整高度
        if (ratio !== 'free') {
          const [w, h] = ratio.split(':').map(Number)
          newHeight = currentWidth * (h / w)

          // 确保裁剪区域不超出图片
          if (cropArea.top + newHeight > rect.height) {
            newHeight = rect.height - cropArea.top
            cropArea.width = newHeight * (w / h)
          }
        }

        cropArea.height = newHeight
      }
    }

    const startDragCrop = (event: MouseEvent) => {
      if (!originalImage.value) return

      isDraggingCrop = true
      startX = event.clientX
      startY = event.clientY
      startCropArea = { ...cropArea }

      document.addEventListener('mousemove', moveCrop)
      document.addEventListener('mouseup', stopDragCrop)
    }

    const moveCrop = (event: MouseEvent) => {
      if (!isDraggingCrop || !originalImage.value) return

      const rect = originalImage.value.getBoundingClientRect()
      const deltaX = event.clientX - startX
      const deltaY = event.clientY - startY

      let newLeft = startCropArea.left + deltaX
      let newTop = startCropArea.top + deltaY

      // 约束在图片边界内
      newLeft = Math.max(0, Math.min(rect.width - startCropArea.width, newLeft))
      newTop = Math.max(0, Math.min(rect.height - startCropArea.height, newTop))

      cropArea.left = newLeft
      cropArea.top = newTop
    }

    const startResizeCrop = (event: MouseEvent, direction: string) => {
      if (!originalImage.value) return

      isResizingCrop = true
      resizeDirection = direction
      startX = event.clientX
      startY = event.clientY
      startCropArea = { ...cropArea }

      document.addEventListener('mousemove', resizeCrop)
      document.addEventListener('mouseup', stopResizeCrop)
      event.preventDefault()
    }

    const resizeCrop = (event: MouseEvent) => {
      if (!isResizingCrop || !originalImage.value) return

      const rect = originalImage.value.getBoundingClientRect()
      const deltaX = event.clientX - startX
      const deltaY = event.clientY - startY

      let newWidth = startCropArea.width
      let newHeight = startCropArea.height
      let newLeft = startCropArea.left
      let newTop = startCropArea.top

      // 处理不同方向的调整
      if (resizeDirection.includes('e')) {
        newWidth = Math.max(30, startCropArea.width + deltaX)
        newWidth = Math.min(newWidth, rect.width - startCropArea.left)
      } else if (resizeDirection.includes('w')) {
        const maxLeftDelta = startCropArea.width - 30
        const leftDelta = Math.max(-maxLeftDelta, Math.min(startCropArea.left, deltaX))
        newLeft = startCropArea.left + leftDelta
        newWidth = startCropArea.width - leftDelta
      }

      if (resizeDirection.includes('s')) {
        newHeight = Math.max(30, startCropArea.height + deltaY)
        newHeight = Math.min(newHeight, rect.height - startCropArea.top)
      } else if (resizeDirection.includes('n')) {
        const maxTopDelta = startCropArea.height - 30
        const topDelta = Math.max(-maxTopDelta, Math.min(startCropArea.top, deltaY))
        newTop = startCropArea.top + topDelta
        newHeight = startCropArea.height - topDelta
      }

      // 保持比例约束
      if (currentCropRatio.value !== 'free') {
        const [w, h] = currentCropRatio.value.split(':').map(Number)
        const ratio = w / h

        if (resizeDirection.includes('n') || resizeDirection.includes('s')) {
          newWidth = newHeight * ratio
        } else {
          newHeight = newWidth / ratio
        }

        // 确保不超出边界
        if (newLeft + newWidth > rect.width) {
          newWidth = rect.width - newLeft
          newHeight = newWidth / ratio
        }

        if (newTop + newHeight > rect.height) {
          newHeight = rect.height - newTop
          newWidth = newHeight * ratio
        }
      }

      cropArea.left = newLeft
      cropArea.top = newTop
      cropArea.width = newWidth
      cropArea.height = newHeight
    }

    const stopDragCrop = () => {
      isDraggingCrop = false
      document.removeEventListener('mousemove', moveCrop)
      document.removeEventListener('mouseup', stopDragCrop)
    }

    const stopResizeCrop = () => {
      isResizingCrop = false
      document.removeEventListener('mousemove', resizeCrop)
      document.removeEventListener('mouseup', stopResizeCrop)
    }

    const applyCrop = () => {
      if (!imageUrl.value || !originalImage.value) return

      // 创建裁剪canvas
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      if (!ctx) return

      const img = originalImage.value
      const imgRect = img.getBoundingClientRect()

      // 计算实际图像上的裁剪区域比例
      const scaleX = img.naturalWidth / imgRect.width
      const scaleY = img.naturalHeight / imgRect.height

      const cropX = cropArea.left * scaleX
      const cropY = cropArea.top * scaleY
      const cropWidth = cropArea.width * scaleX
      const cropHeight = cropArea.height * scaleY

      // 设置canvas尺寸为裁剪尺寸
      canvas.width = cropWidth
      canvas.height = cropHeight

      // 在canvas上绘制裁剪后的图像
      ctx.drawImage(img, cropX, cropY, cropWidth, cropHeight, 0, 0, cropWidth, cropHeight)

      // 更新图像URL
      imageUrl.value = canvas.toDataURL('image/jpeg')
      isCropping.value = false

      // 重新应用滤镜到裁剪后的图像
      nextTick(() => {
        applyFilters()
      })
    }

    const onImageLoad = () => {
      console.log('onImageLoad triggered')
      console.log('原始图片已加载')
      imageLoaded.value = true

      try {
        // Create a basic processed version immediately
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        if (ctx && originalImage.value) {
          canvas.width = originalImage.value.naturalWidth
          canvas.height = originalImage.value.naturalHeight
          ctx.drawImage(originalImage.value, 0, 0)
          processedImageUrl.value = canvas.toDataURL('image/jpeg', 0.9)
          console.log('成功创建初始处理图片')
        }
      } catch (error) {
        console.error('创建初始处理图片出错:', error)
      }
    }

    // Add this debug flag
    const debugMode = ref(true) // Set to false in production

    // Add a debug function to force creation of processed image
    const forceCreateProcessed = () => {
      if (!originalImage.value) {
        console.error('原图不存在，无法强制创建处理图')
        return
      }

      try {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        if (ctx && originalImage.value) {
          canvas.width = originalImage.value.naturalWidth
          canvas.height = originalImage.value.naturalHeight
          ctx.drawImage(originalImage.value, 0, 0)

          // Add a visible mark to confirm this is a new image
          ctx.fillStyle = 'rgba(255,0,0,0.3)'
          ctx.fillRect(20, 20, 50, 50)

          processedImageUrl.value = canvas.toDataURL('image/jpeg', 0.9)
          console.log('强制创建的处理图已更新')
        }
      } catch (error) {
        console.error('强制创建处理图出错:', error)
      }
    }

    // 事件监听器清理
    onMounted(() => {
      window.addEventListener('resize', () => {
        if (isCropping.value && originalImage.value) {
          // 窗口调整大小时重置裁剪区域
          const rect = originalImage.value.getBoundingClientRect()
          const size = Math.min(rect.width, rect.height) * 0.8

          cropArea.left = (rect.width - size) / 2
          cropArea.top = (rect.height - size) / 2
          cropArea.width = size
          cropArea.height = size
        }
      })
    })

    onUnmounted(() => {
      document.removeEventListener('mousemove', moveCrop)
      document.removeEventListener('mouseup', stopDragCrop)
      document.removeEventListener('mousemove', resizeCrop)
      document.removeEventListener('mouseup', stopResizeCrop)
    })

    watch(
      () => imageUrl.value,
      (newVal) => {
        console.log('imageUrl changed:', newVal)
      },
    )
    watch(
      () => processedImageUrl.value,
      (newVal) => {
        console.log('processedImageUrl changed:', newVal)
      },
    )
    watch(
      () => showProcessed.value,
      (newVal) => {
        console.log('showProcessed changed:', newVal)
      },
    )

    return {
      imageUrl,
      processedImageUrl,
      originalImage,
      processedImage,
      showProcessed,
      brightness,
      contrast,
      saturation,
      sharpness,
      selectedFilter,
      filters,
      isCropping,
      cropBox,
      cropArea,
      cropRatios,
      currentCropRatio,
      handleImageUpload,
      applyFilter,
      applyFilters,
      downloadProcessedImage,
      resetAllSettings,
      startCropping,
      setCropRatio,
      startDragCrop,
      startResizeCrop,
      applyCrop,
      onImageLoad,
      imageLoaded,
      toggleProcessedView,
      debugMode,
      forceCreateProcessed,
    }
  },
})
</script>

<style scoped>
/* 自定义滑块样式 */
input[type='range'] {
  -webkit-appearance: none;
  height: 6px;
  border-radius: 3px;
  background: #f5f5f5;
  outline: none;
  padding: 0;
  margin: 0;
}

input[type='range']::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #2e8b57;
  cursor: pointer;
  transition: all 0.15s ease-in-out;
}

input[type='range']::-webkit-slider-thumb:hover {
  background: #006400;
  transform: scale(1.1);
}

input[type='range']::-moz-range-thumb {
  width: 16px;
  height: 16px;
  border: 0;
  border-radius: 50%;
  background: #2e8b57;
  cursor: pointer;
  transition: all 0.15s ease-in-out;
}

input[type='range']::-moz-range-thumb:hover {
  background: #006400;
  transform: scale(1.1);
}

/* 确保裁剪区域的显示正确 */
.booking-calendar {
  user-select: none;
}
</style>
