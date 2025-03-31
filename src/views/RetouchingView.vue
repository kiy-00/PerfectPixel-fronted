<template>
  <div class="flex h-screen bg-neutral overflow-hidden">
    <!-- 左侧工具栏 -->
    <div class="w-72 bg-white shadow-lg h-full flex flex-col">
      <div class="px-4 py-5 border-b border-green-light">
        <h1 class="text-xl font-bold text-primary">自助修图工具</h1>
        <p class="text-sm text-green-dark">选择工具并调整参数</p>
        <!-- 添加上传图片按钮，用于触发后端接口调用 -->
        <label
          class="mt-4 block px-3 py-2 bg-primary text-white rounded-md cursor-pointer hover:bg-green-dark transition-colors"
        >
          上传图片
          <input type="file" accept="image/*" class="hidden" @change="handleImageUpload" />
        </label>
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
              @input="requestAdjustments"
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
              @input="requestAdjustments"
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
              @input="requestAdjustments"
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
              :disabled="isSharpening"
              @input="requestAdjustments"
            />
          </div>

          <button
            @click="applySharpen"
            :disabled="isSharpening"
            class="w-full p-2 border border-primary text-primary rounded-md hover:bg-green-light hover:bg-opacity-10 transition-colors relative"
          >
            <span v-if="!isSharpening">应用锐化</span>
            <span v-else class="flex items-center justify-center">
              <svg
                class="animate-spin -ml-1 mr-2 h-4 w-4 text-primary"
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
              正在锐化...
            </span>
          </button>
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

        <!-- 添加水印 -->
        <div class="mb-6">
          <h2 class="font-medium text-neutral-dark mb-3">添加水印</h2>

          <div class="mb-3">
            <input
              type="text"
              v-model="watermarkText"
              placeholder="水印文字"
              class="w-full p-2 border border-neutral rounded-md text-sm"
            />
          </div>

          <div class="mb-3">
            <label class="text-sm text-neutral-dark block mb-1">水印位置</label>
            <select
              v-model="watermarkPosition"
              class="w-full p-2 border border-neutral rounded-md text-sm"
            >
              <option value="topLeft">左上角</option>
              <option value="topRight">右上角</option>
              <option value="bottomLeft">左下角</option>
              <option value="bottomRight">右下角</option>
              <option value="center">中心</option>
            </select>
          </div>

          <!-- 添加不透明度控制 -->
          <div class="mb-3">
            <div class="flex justify-between">
              <label class="text-sm text-neutral-dark">不透明度</label>
              <span class="text-xs text-primary">{{ Math.round(watermarkOpacity * 100) }}%</span>
            </div>
            <input
              type="range"
              v-model="watermarkOpacity"
              min="0.1"
              max="1"
              step="0.1"
              class="w-full h-2 bg-neutral rounded-lg appearance-none cursor-pointer"
            />
          </div>

          <button
            @click="applyWatermark"
            class="w-full p-2 border border-primary text-primary rounded-md hover:bg-green-light hover:bg-opacity-10 transition-colors"
          >
            应用水印
          </button>
        </div>

        <!-- 调整图像大小 -->
        <div class="mb-6">
          <h2 class="font-medium text-neutral-dark mb-3">调整图像大小</h2>

          <div class="grid grid-cols-2 gap-2 mb-3">
            <div>
              <label class="text-sm text-neutral-dark block mb-1">宽度</label>
              <input
                type="number"
                v-model="resizeWidth"
                placeholder="宽度"
                class="w-full p-2 border border-neutral rounded-md text-sm"
                :disabled="isResizing"
              />
            </div>
            <div>
              <label class="text-sm text-neutral-dark block mb-1">高度</label>
              <input
                type="number"
                v-model="resizeHeight"
                placeholder="高度"
                class="w-full p-2 border border-neutral rounded-md text-sm"
                :disabled="isResizing"
              />
            </div>
          </div>

          <div class="mb-3">
            <label class="inline-flex items-center">
              <input
                type="checkbox"
                v-model="maintainAspectRatio"
                class="form-checkbox h-4 w-4 text-primary"
                :disabled="isResizing"
              />
              <span class="ml-2 text-sm text-neutral-dark">保持宽高比</span>
            </label>
          </div>

          <button
            @click="resizeImage"
            :disabled="isResizing"
            class="w-full p-2 border border-primary text-primary rounded-md hover:bg-green-light hover:bg-opacity-10 transition-colors relative"
          >
            <span v-if="!isResizing">调整大小</span>
            <span v-else class="flex items-center justify-center">
              <svg
                class="animate-spin -ml-1 mr-2 h-4 w-4 text-primary"
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
              正在处理...
            </span>
          </button>
        </div>

        <!-- 压缩图像 -->
        <div class="mb-6">
          <h2 class="font-medium text-neutral-dark mb-3">压缩图像</h2>

          <div class="mb-3">
            <div class="flex justify-between">
              <label class="text-sm text-neutral-dark">压缩质量</label>
              <span class="text-xs text-primary">{{ compressionQuality }}%</span>
            </div>
            <input
              type="range"
              v-model="compressionQuality"
              min="1"
              max="100"
              step="1"
              class="w-full h-2 bg-neutral rounded-lg appearance-none cursor-pointer"
              :disabled="isCompressing"
            />
          </div>

          <button
            @click="compressImage"
            :disabled="isCompressing"
            class="w-full p-2 border border-primary text-primary rounded-md hover:bg-green-light hover:bg-opacity-10 transition-colors relative"
          >
            <span v-if="!isCompressing">压缩图像</span>
            <span v-else class="flex items-center justify-center">
              <svg
                class="animate-spin -ml-1 mr-2 h-4 w-4 text-primary"
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
              正在压缩...
            </span>
          </button>

          <!-- 如果有压缩结果，显示压缩详情 -->
          <div
            v-if="compressionResult"
            class="mt-3 p-3 bg-neutral bg-opacity-20 rounded-md text-sm"
          >
            <div class="flex justify-between items-center mb-2">
              <span class="font-medium">压缩率:</span>
              <span class="text-primary font-bold"
                >{{ compressionResult.compressionRatio.toFixed(2) }}%</span
              >
            </div>
            <div class="mb-2">
              <div class="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                <div
                  class="h-full rounded-full bg-green-500"
                  :style="{ width: `${compressionResult.compressionRatio}%` }"
                ></div>
              </div>
            </div>
            <div class="grid grid-cols-2 gap-2 text-xs mt-2">
              <div class="flex justify-between">
                <span class="text-neutral-dark">原始大小:</span>
                <span class="text-primary">{{
                  formatFileSize(compressionResult.originalSize)
                }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-neutral-dark">压缩后大小:</span>
                <span class="text-primary">{{
                  formatFileSize(compressionResult.compressedSize)
                }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 人脸检测 -->
        <div class="mb-6">
          <h2 class="font-medium text-neutral-dark mb-3">人脸检测</h2>

          <button
            @click="detectFaces"
            class="w-full p-2 border border-primary text-primary rounded-md hover:bg-green-light hover:bg-opacity-10 transition-colors"
          >
            检测人脸
          </button>

          <div v-if="faceCount > 0" class="mt-2 text-sm text-primary text-center">
            检测到 {{ faceCount }} 个人脸
          </div>
        </div>

        <!-- 图像质量分析 -->
        <div class="mb-6">
          <h2 class="font-medium text-neutral-dark mb-3">图像质量分析</h2>

          <button
            @click="analyzeImageQuality"
            class="w-full p-2 border border-primary text-primary rounded-md hover:bg-green-light hover:bg-opacity-10 transition-colors"
            :disabled="isAnalyzing"
          >
            {{ isAnalyzing ? '分析中...' : '分析图像质量' }}
          </button>

          <div v-if="imageQualityResult" class="mt-3 p-3 bg-neutral bg-opacity-20 rounded-md">
            <div class="flex justify-between items-center mb-2">
              <span class="text-sm font-medium">质量评分:</span>
              <div class="flex items-center">
                <div class="text-lg font-bold text-primary">
                  {{ Math.round(imageQualityResult.qualityScore) }}
                </div>
                <div class="ml-1 text-xs text-primary">/100</div>
              </div>
            </div>

            <div class="mb-2">
              <div class="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                <div
                  class="h-full rounded-full"
                  :style="{
                    width: `${imageQualityResult.qualityScore}%`,
                    backgroundColor: getQualityColor(imageQualityResult.qualityScore),
                  }"
                ></div>
              </div>
            </div>

            <div class="text-sm text-center mb-3">
              <span
                :style="{ color: getQualityColor(imageQualityResult.qualityScore) }"
                class="font-medium"
                >{{ imageQualityResult.quality }}</span
              >
            </div>

            <div v-if="imageQualityResult.metadata" class="border-t border-gray-200 pt-2">
              <h3 class="text-sm font-medium mb-2 text-primary">图像详细信息</h3>
              <div class="grid grid-cols-2 gap-2 text-xs">
                <div class="flex justify-between">
                  <span class="text-neutral-dark">尺寸:</span>
                  <span class="text-primary"
                    >{{ imageQualityResult.metadata.Width }}x{{
                      imageQualityResult.metadata.Height
                    }}</span
                  >
                </div>
                <div class="flex justify-between">
                  <span class="text-neutral-dark">宽高比:</span>
                  <span class="text-primary">{{ imageQualityResult.metadata.AspectRatio }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-neutral-dark">文件大小:</span>
                  <span class="text-primary">{{ imageQualityResult.metadata.FileSize }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-neutral-dark">平均亮度:</span>
                  <span class="text-primary">{{
                    imageQualityResult.metadata.AverageBrightness
                  }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-neutral-dark">红色通道:</span>
                  <span class="text-primary">{{ imageQualityResult.metadata.AverageRed }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-neutral-dark">绿色通道:</span>
                  <span class="text-primary">{{ imageQualityResult.metadata.AverageGreen }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-neutral-dark">蓝色通道:</span>
                  <span class="text-primary">{{ imageQualityResult.metadata.AverageBlue }}</span>
                </div>
              </div>
            </div>
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

    <!-- 右侧图片显示区域 -->
    <div class="flex-1 bg-neutral-light h-full flex flex-col relative overflow-hidden">
      <div class="flex justify-between items-center px-4 py-3 bg-white shadow-sm">
        <h2 class="text-lg font-medium text-neutral-dark">图片预览</h2>
        <div class="flex items-center space-x-2">
          <button
            @click="toggleProcessedView"
            class="px-3 py-1 text-sm rounded-md bg-green-light text-primary hover:bg-primary hover:text-white transition-colors"
          >
            {{ showProcessed ? '查看原图' : '查看处理后效果' }}
          </button>
        </div>
      </div>

      <!-- 图片显示区域 -->
      <div class="flex-1 flex items-center justify-center p-4 overflow-auto">
        <div class="relative max-w-full max-h-full" v-if="imageUrl">
          <!-- 原始图片 -->
          <img
            ref="originalImage"
            :src="imageUrl"
            alt="原始图片"
            class="max-w-full max-h-full object-contain"
            :class="{ hidden: showProcessed }"
            @load="onImageLoad"
          />

          <!-- 处理后图片 -->
          <img
            v-if="processedImageUrl"
            ref="processedImage"
            :src="processedImageUrl"
            alt="处理后图片"
            class="max-w-full max-h-full object-contain"
            :class="{ hidden: !showProcessed }"
          />

          <!-- 裁剪覆盖层 -->
          <div v-if="isCropping && !showProcessed" class="absolute inset-0 bg-black bg-opacity-50">
            <div
              ref="cropBox"
              class="absolute border-2 border-white cursor-move"
              :style="{
                left: `${cropArea.left}px`,
                top: `${cropArea.top}px`,
                width: `${cropArea.width}px`,
                height: `${cropArea.height}px`,
              }"
              @mousedown="startDragCrop"
            >
              <!-- 裁剪控制点 -->
              <div
                class="absolute w-6 h-6 bg-white rounded-full -top-3 -left-3 cursor-nw-resize"
                @mousedown.stop="(e) => startResizeCrop(e, 'nw')"
              ></div>
              <div
                class="absolute w-6 h-6 bg-white rounded-full -top-3 -right-3 cursor-ne-resize"
                @mousedown.stop="(e) => startResizeCrop(e, 'ne')"
              ></div>
              <div
                class="absolute w-6 h-6 bg-white rounded-full -bottom-3 -left-3 cursor-sw-resize"
                @mousedown.stop="(e) => startResizeCrop(e, 'sw')"
              ></div>
              <div
                class="absolute w-6 h-6 bg-white rounded-full -bottom-3 -right-3 cursor-se-resize"
                @mousedown.stop="(e) => startResizeCrop(e, 'se')"
              ></div>
            </div>
          </div>
        </div>

        <!-- 无图片时的提示 -->
        <div v-else class="text-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-24 w-24 mx-auto text-neutral-light"
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
          <p class="mt-4 text-neutral-dark">请上传图片开始编辑</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, onMounted, onUnmounted, nextTick, watch } from 'vue'
// 导入图像处理服务
import { imageProcessingAPI } from '../services/imageService'

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

    // 锐化相关
    const isSharpening = ref(false)

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

      if (!imageUrl.value || !originalImage.value) {
        console.error('缺少原始图片，无法应用滤镜')
        return
      }

      // 添加加载指示器
      const loadingIndicator = ref(true)

      // 如果是无滤镜，直接使用原图
      if (
        selectedFilter.value === 'none' &&
        brightness.value === 0 &&
        contrast.value === 0 &&
        saturation.value === 0 &&
        sharpness.value === 0
      ) {
        processedImageUrl.value = imageUrl.value
        loadingIndicator.value = false
        return
      }

      console.log('调用后端应用滤镜接口...')
      console.log(
        `亮度: ${brightness.value}, 对比度: ${contrast.value}, 饱和度: ${saturation.value}, 锐化: ${sharpness.value}`,
      )

      // 本地处理模式 - 在开发环境使用canvas进行简单处理
      const useLocalProcessing = true // 设置为true模拟本地处理，设置为false使用后端API

      if (useLocalProcessing) {
        try {
          const canvas = document.createElement('canvas')
          const ctx = canvas.getContext('2d')

          if (ctx && originalImage.value) {
            // 设置canvas大小
            canvas.width = originalImage.value.naturalWidth
            canvas.height = originalImage.value.naturalHeight

            // 绘制原始图像
            ctx.drawImage(originalImage.value, 0, 0)

            // 应用简单的视觉效果以表明处理已应用
            // 亮度 - 简单模拟
            if (brightness.value !== 0) {
              ctx.fillStyle =
                brightness.value > 0
                  ? `rgba(255, 255, 255, ${Math.abs(brightness.value) / 200})`
                  : `rgba(0, 0, 0, ${Math.abs(brightness.value) / 200})`
              ctx.fillRect(0, 0, canvas.width, canvas.height)
            }

            // 对比度 - 添加一个边框作为视觉指示
            if (contrast.value !== 0) {
              const borderWidth = Math.abs(contrast.value) / 10
              ctx.strokeStyle = contrast.value > 0 ? 'rgba(0, 100, 0, 0.5)' : 'rgba(100, 0, 0, 0.5)'
              ctx.lineWidth = borderWidth
              ctx.strokeRect(
                borderWidth / 2,
                borderWidth / 2,
                canvas.width - borderWidth,
                canvas.height - borderWidth,
              )
            }

            // 滤镜效果
            if (selectedFilter.value !== 'none') {
              // 模拟不同滤镜
              switch (selectedFilter.value) {
                case 'warm':
                  ctx.fillStyle = 'rgba(255, 200, 150, 0.2)'
                  ctx.fillRect(0, 0, canvas.width, canvas.height)
                  break
                case 'cool':
                  ctx.fillStyle = 'rgba(150, 200, 255, 0.2)'
                  ctx.fillRect(0, 0, canvas.width, canvas.height)
                  break
                case 'vintage':
                  ctx.fillStyle = 'rgba(200, 180, 150, 0.3)'
                  ctx.fillRect(0, 0, canvas.width, canvas.height)
                  break
                case 'grayscale':
                  // 使用更高级的方法处理灰度
                  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
                  const data = imageData.data
                  for (let i = 0; i < data.length; i += 4) {
                    const avg = (data[i] + data[i + 1] + data[i + 2]) / 3
                    data[i] = avg // red
                    data[i + 1] = avg // green
                    data[i + 2] = avg // blue
                  }
                  ctx.putImageData(imageData, 0, 0)
                  break
                default:
                  // 其他滤镜效果，添加一个文本标记
                  ctx.font = 'bold 20px Arial'
                  ctx.fillStyle = 'rgba(255, 255, 255, 0.7)'
                  ctx.fillText(`Filter: ${selectedFilter.value}`, 20, 40)
              }
            }

            // 添加处理标记以便明确区分
            ctx.font = '14px Arial'
            ctx.fillStyle = 'rgba(255, 255, 255, 0.6)'
            ctx.fillText(`处理时间: ${new Date().toLocaleTimeString()}`, 10, canvas.height - 20)

            // 更新处理后的图片
            processedImageUrl.value = canvas.toDataURL('image/jpeg')

            // 自动切换到处理后视图
            showProcessed.value = true

            console.log('本地处理完成，已更新处理后图片')
          }
        } catch (error) {
          console.error('本地处理图片出错:', error)
          alert('处理图片时出错，请重试')
        } finally {
          loadingIndicator.value = false
        }
        return
      }

      // 以下是原有的API调用逻辑
      // 映射前端滤镜名称到后端滤镜类型
      const getBackendFilterType = (frontendFilter: string): string => {
        // ...existing code...
        const filterMap: Record<string, string> = {
          warm: 'warm',
          cool: 'cold',
          vintage: 'sepia', // 近似映射
          grayscale: 'grayscale',
          sepia: 'sepia',
          clarity: 'highcontrast', // 近似映射
          vivid: 'highcontrast', // 近似映射
          dreamy: 'blur', // 近似映射
        }
        return filterMap[frontendFilter] || 'warm' // 默认用暖色调
      }

      // 将Data URL转换为Blob
      const dataURLtoBlob = (dataurl: string): Blob => {
        // ...existing code...
        const arr = dataurl.split(',')
        const mime = arr[0].match(/:(.*?);/)![1]
        const bstr = atob(arr[1])
        let n = bstr.length
        const u8arr = new Uint8Array(n)
        while (n--) {
          u8arr[n] = bstr.charCodeAt(n)
        }
        return new Blob([u8arr], { type: mime })
      }

      try {
        // ...existing API call code...
        // 将当前图片转换为Blob并创建File对象
        const imageBlob = dataURLtoBlob(imageUrl.value)
        const imageFile = new File([imageBlob], 'image.jpg', { type: 'image/jpeg' })

        // 创建FormData对象
        const formData = new FormData()
        formData.append('file', imageFile)
        formData.append('filterType', getBackendFilterType(selectedFilter.value))

        // 显示加载状态
        const loadingMessage = '正在应用滤镜...'
        console.log(loadingMessage)

        // 使用API_BASE_URL常量作为基础URL
        const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'
        const filterUrl = `${API_BASE_URL}/ImageProcessing/filter`

        console.log('调用滤镜API:', filterUrl)

        // 调用后端API
        fetch(filterUrl, {
          method: 'POST',
          body: formData,
          // 可能需要添加认证头
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token') || sessionStorage.getItem('token') || ''}`,
          },
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error(`服务器返回错误: ${response.status}`)
            }
            return response.json()
          })
          .then((data) => {
            console.log('滤镜应用成功:', data)

            // 使用后端返回的URL更新处理后的图片
            if (data.url) {
              // 预加载图片以确保URL有效
              const testImg = new Image()
              testImg.onload = () => {
                processedImageUrl.value = data.url
                // 自动切换到处理后视图
                showProcessed.value = true
                console.log('处理后图片已成功加载:', data.url)
              }
              testImg.onerror = () => {
                console.error('处理后图片加载失败')
                processedImageUrl.value = imageUrl.value // 回退到原始图片
                alert('处理后图片加载失败，请重试')
              }
              testImg.src = data.url
            } else {
              console.error('后端未返回有效的图片URL')
              processedImageUrl.value = imageUrl.value
              alert('后端未返回有效的图片URL，请重试')
            }
          })
          .catch((error) => {
            console.error('应用滤镜失败:', error)
            processedImageUrl.value = imageUrl.value // 回退到原始图片
            alert(`应用滤镜失败: ${error.message}`)
          })
          .finally(() => {
            loadingIndicator.value = false
          })
      } catch (error) {
        console.error('准备图片数据失败:', error)
        processedImageUrl.value = imageUrl.value
        alert(`准备图片数据失败: ${error}`)
        loadingIndicator.value = false
      }
    }

    // 添加请求参数调整函数来处理亮度、对比度等
    const requestAdjustments = () => {
      // 在实际调整参数的延迟上应用限制
      if (adjustmentTimeout) {
        clearTimeout(adjustmentTimeout)
      }

      adjustmentTimeout = setTimeout(() => {
        // 先处理本地调整（如果启用）然后应用滤镜
        applyFilters()
      }, 300) // 延迟300ms避免频繁请求
    }

    // 用于限制调整请求的计时器
    let adjustmentTimeout: number | null = null

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

    // 添加水印功能
    const watermarkText = ref('')
    const watermarkPosition = ref('bottomRight')
    const watermarkOpacity = ref(0.7) // 添加不透明度控制

    // 将前端水印位置映射到API期望的位置值
    const mapPositionToApi = (position: string): number => {
      switch (position) {
        case 'topLeft':
          return 0
        case 'center':
          return 1
        case 'bottomRight':
          return 2
        // 近似位置映射
        case 'topRight':
          return 0
        case 'bottomLeft':
          return 2
        default:
          return 1
      }
    }

    const applyWatermark = () => {
      if (!imageUrl.value || !originalImage.value || !watermarkText.value) {
        alert('请先上传图片并输入水印文字')
        return
      }

      // 设置是否使用API还是本地处理
      const useApiProcessing = true // true使用API, false使用本地处理

      if (useApiProcessing) {
        try {
          console.log('调用水印API处理图像...')

          // 将Data URL转换为Blob
          const dataURLtoBlob = (dataurl: string): Blob => {
            const arr = dataurl.split(',')
            const mime = arr[0].match(/:(.*?);/)![1]
            const bstr = atob(arr[1])
            let n = bstr.length
            const u8arr = new Uint8Array(n)
            while (n--) {
              u8arr[n] = bstr.charCodeAt(n)
            }
            return new Blob([u8arr], { type: mime })
          }

          // 准备API调用数据
          const imageBlob = dataURLtoBlob(imageUrl.value)
          const imageFile = new File([imageBlob], 'image.jpg', { type: 'image/jpeg' })

          const formData = new FormData()
          formData.append('file', imageFile)
          formData.append('text', watermarkText.value)
          formData.append('opacity', watermarkOpacity.value.toString())
          formData.append('position', mapPositionToApi(watermarkPosition.value).toString())

          // 使用API_BASE_URL常量作为基础URL
          const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'
          const watermarkUrl = `${API_BASE_URL}/ImageProcessing/watermark`

          console.log('调用水印API:', watermarkUrl)

          // 调用后端API，使用完整URL
          fetch(watermarkUrl, {
            method: 'POST',
            body: formData,
            // 认证头 (实际项目需要使用正确的认证方式)
            headers: {
              // 获取认证token
              Authorization: `Bearer ${localStorage.getItem('token') || sessionStorage.getItem('token') || ''}`,
            },
          })
            .then((response) => {
              if (!response.ok) {
                throw new Error(`服务器返回错误: ${response.status}`)
              }
              return response.json()
            })
            // ...rest of the function remains the same
            .then((data) => {
              console.log('水印应用成功:', data)

              if (data.url) {
                // 预加载图片以确保URL有效
                const testImg = new Image()
                testImg.onload = () => {
                  // 更新图像URL
                  imageUrl.value = data.url
                  processedImageUrl.value = ''

                  // 重新加载图片以触发onload事件
                  nextTick(() => {
                    console.log('水印图片已成功加载，准备重新应用滤镜')
                  })
                }
                testImg.onerror = () => {
                  console.error('水印图片加载失败，降级到本地处理')
                  applyWatermarkLocally() // 降级到本地处理
                }
                testImg.src = data.url
              } else {
                console.error('后端未返回有效的图片URL')
                applyWatermarkLocally() // 降级到本地处理
              }
            })
            .catch((error) => {
              console.error('应用水印失败:', error)
              alert(`应用水印失败: ${error.message}，将使用本地处理`)
              applyWatermarkLocally() // 降级到本地处理
            })
        } catch (error) {
          console.error('准备水印数据失败:', error)
          applyWatermarkLocally() // 降级到本地处理
        }
      } else {
        applyWatermarkLocally()
      }
    }

    // 本地水印处理方法(作为备用)
    const applyWatermarkLocally = () => {
      console.log('使用本地Canvas处理水印...')

      try {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')

        if (ctx && originalImage.value) {
          canvas.width = originalImage.value.naturalWidth
          canvas.height = originalImage.value.naturalHeight

          // 绘制当前图像
          ctx.drawImage(originalImage.value, 0, 0)

          // 设置水印样式
          ctx.font = 'bold 24px Arial'
          ctx.fillStyle = `rgba(255, 255, 255, ${watermarkOpacity.value})`
          ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)'
          ctx.lineWidth = 1

          const text = watermarkText.value
          const textWidth = ctx.measureText(text).width
          let x = 20,
            y = 40

          // 根据位置调整坐标
          switch (watermarkPosition.value) {
            case 'topLeft':
              x = 20
              y = 40
              break
            case 'topRight':
              x = canvas.width - textWidth - 20
              y = 40
              break
            case 'bottomLeft':
              x = 20
              y = canvas.height - 20
              break
            case 'bottomRight':
              x = canvas.width - textWidth - 20
              y = canvas.height - 20
              break
            case 'center':
              x = (canvas.width - textWidth) / 2
              y = canvas.height / 2
              break
          }

          // 添加水印
          ctx.fillText(text, x, y)
          ctx.strokeText(text, x, y)

          // 更新图像
          imageUrl.value = canvas.toDataURL('image/jpeg')
          processedImageUrl.value = ''

          // 重新加载图片以触发onload事件
          nextTick(() => {
            applyFilters()
          })

          console.log('水印已本地应用')
        }
      } catch (error) {
        console.error('本地应用水印出错:', error)
        alert('应用水印时出错，请重试')
      }
    }

    // 调整图像大小
    const resizeWidth = ref<number | null>(null)
    const resizeHeight = ref<number | null>(null)
    const maintainAspectRatio = ref(true)
    const isResizing = ref(false)

    const resizeImage = () => {
      if (!imageUrl.value || !originalImage.value || (!resizeWidth.value && !resizeHeight.value)) {
        alert('请先上传图片并输入目标尺寸')
        return
      }

      // 确保尺寸有效
      const newWidth = resizeWidth.value || originalImage.value.naturalWidth
      const newHeight = resizeHeight.value || originalImage.value.naturalHeight

      // 保持宽高比
      let finalWidth = newWidth
      let finalHeight = newHeight

      if (maintainAspectRatio.value && originalImage.value) {
        const originalWidth = originalImage.value.naturalWidth
        const originalHeight = originalImage.value.naturalHeight

        if (resizeWidth.value && !resizeHeight.value) {
          finalHeight = Math.round((originalHeight / originalWidth) * finalWidth)
        } else if (!resizeWidth.value && resizeHeight.value) {
          finalWidth = Math.round((originalWidth / originalHeight) * finalHeight)
        }
      }

      // 设置调整尺寸的方式：API调用
      isResizing.value = true
      console.log(`开始调整图像大小为: ${finalWidth}x${finalHeight}`)

      try {
        // 将Data URL转换为Blob
        const dataURLtoBlob = (dataurl: string): Blob => {
          const arr = dataurl.split(',')
          const mime = arr[0].match(/:(.*?);/)![1]
          const bstr = atob(arr[1])
          let n = bstr.length
          const u8arr = new Uint8Array(n)
          while (n--) {
            u8arr[n] = bstr.charCodeAt(n)
          }
          return new Blob([u8arr], { type: mime })
        }

        // 准备API调用数据
        const imageBlob = dataURLtoBlob(imageUrl.value)
        const imageFile = new File([imageBlob], 'image.jpg', { type: 'image/jpeg' })

        // 使用图像服务调用API
        imageProcessingAPI
          .resizeImage(imageFile, finalWidth, finalHeight)
          .then((response) => {
            console.log('调整图像大小成功:', response.data)
            const data = response.data

            if (data.url) {
              // 预加载图片以确保URL有效
              const testImg = new Image()
              testImg.onload = () => {
                // 更新图像URL
                imageUrl.value = data.url
                processedImageUrl.value = ''

                // 显示成功消息
                alert(data.message || `图像已成功调整为 ${finalWidth}x${finalHeight}`)

                // 重新加载图片以触发onload事件
                nextTick(() => {
                  console.log('调整大小后的图片已成功加载')
                })
              }
              testImg.onerror = () => {
                console.error('调整大小后的图片加载失败，降级到本地处理')
                resizeImageLocally(finalWidth, finalHeight)
              }
              testImg.src = data.url
            } else {
              console.error('后端未返回有效的图片URL')
              resizeImageLocally(finalWidth, finalHeight)
            }
          })
          .catch((error) => {
            console.error('调整图像大小API调用失败:', error)
            alert(`调整图像大小失败: ${error.message || '未知错误'}，将使用本地处理`)
            resizeImageLocally(finalWidth, finalHeight)
          })
          .finally(() => {
            isResizing.value = false
          })
      } catch (error) {
        console.error('准备调整图像大小数据失败:', error)
        isResizing.value = false
        resizeImageLocally(finalWidth, finalHeight)
      }
    }

    // 本地调整图像大小方法(作为备用)
    const resizeImageLocally = (newWidth: number, newHeight: number) => {
      try {
        console.log('使用本地Canvas调整图像大小...')
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')

        if (ctx && originalImage.value) {
          // 设置画布大小
          canvas.width = newWidth
          canvas.height = newHeight

          // 绘制调整大小后的图像
          ctx.drawImage(originalImage.value, 0, 0, newWidth, newHeight)

          // 更新图像
          imageUrl.value = canvas.toDataURL('image/jpeg')
          processedImageUrl.value = ''

          // 重新加载图片以触发onload事件
          nextTick(() => {
            applyFilters()
          })

          console.log(`图像已本地调整至 ${newWidth}x${newHeight}`)
        }
      } catch (error) {
        console.error('本地调整图像大小出错:', error)
        alert('调整图像大小时出错，请重试')
      }
    }

    // 压缩图像
    const compressionQuality = ref(80)
    const isCompressing = ref(false)
    const compressionResult = ref<{
      message: string
      originalSize: number
      compressedSize: number
      compressionRatio: number
      photoId: number
      url: string
      thumbnailUrl: string
    } | null>(null)

    // 格式化文件大小的辅助函数
    const formatFileSize = (bytes: number): string => {
      if (bytes < 1024) return `${bytes} B`
      if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`
      return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
    }

    const compressImage = () => {
      if (!imageUrl.value || !originalImage.value) {
        alert('请先上传图片')
        return
      }

      isCompressing.value = true
      compressionResult.value = null

      try {
        // 将Data URL转换为Blob
        const dataURLtoBlob = (dataurl: string): Blob => {
          const arr = dataurl.split(',')
          const mime = arr[0].match(/:(.*?);/)![1]
          const bstr = atob(arr[1])
          let n = bstr.length
          const u8arr = new Uint8Array(n)
          while (n--) {
            u8arr[n] = bstr.charCodeAt(n)
          }
          return new Blob([u8arr], { type: mime })
        }

        // 准备API调用数据
        const imageBlob = dataURLtoBlob(imageUrl.value)
        const imageFile = new File([imageBlob], 'image.jpg', { type: 'image/jpeg' })

        // 使用图像服务调用API
        imageProcessingAPI
          .compressImage(imageFile, compressionQuality.value)
          .then((response) => {
            console.log('图像压缩成功:', response.data)
            const data = response.data

            // 保存压缩结果
            compressionResult.value = data

            if (data.url) {
              // 预加载图片以确保URL有效
              const testImg = new Image()
              testImg.onload = () => {
                // 更新图像URL
                imageUrl.value = data.url
                processedImageUrl.value = ''

                // 显示成功消息
                alert(
                  data.message || `图像已成功压缩，压缩率: ${data.compressionRatio.toFixed(2)}%`,
                )

                // 重新加载图片以触发onload事件
                nextTick(() => {
                  console.log('压缩后的图片已成功加载')
                })
              }
              testImg.onerror = () => {
                console.error('压缩后的图片加载失败，降级到本地处理')
                compressImageLocally()
              }
              testImg.src = data.url
            } else {
              console.error('后端未返回有效的图片URL')
              compressImageLocally()
            }
          })
          .catch((error) => {
            console.error('图像压缩API调用失败:', error)
            alert(`图像压缩失败: ${error.message || '未知错误'}，将使用本地处理`)
            compressImageLocally()
          })
          .finally(() => {
            isCompressing.value = false
          })
      } catch (error) {
        console.error('准备图像压缩数据失败:', error)
        isCompressing.value = false
        compressImageLocally()
      }
    }

    // 本地压缩图像方法(作为备用)
    const compressImageLocally = () => {
      try {
        console.log('使用本地Canvas压缩图像...')
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')

        if (ctx && originalImage.value) {
          canvas.width = originalImage.value.naturalWidth
          canvas.height = originalImage.value.naturalHeight

          // 绘制图像
          ctx.drawImage(originalImage.value, 0, 0)

          // 获取原始图像大小的估计值（Data URL长度的3/4作为估计）
          const originalSize = Math.floor((imageUrl.value.length * 3) / 4)

          // 以指定质量导出
          const quality = compressionQuality.value / 100
          const compressedImageUrl = canvas.toDataURL('image/jpeg', quality)

          // 获取压缩后图像大小的估计值
          const compressedSize = Math.floor((compressedImageUrl.length * 3) / 4)

          // 计算压缩率
          const compressionRatio = Math.round(
            ((originalSize - compressedSize) / originalSize) * 100,
          )

          // 创建模拟的压缩结果
          compressionResult.value = {
            message: `成功压缩图像，质量：${compressionQuality.value}%，压缩率：${compressionRatio}%`,
            originalSize: originalSize,
            compressedSize: compressedSize,
            compressionRatio: compressionRatio,
            photoId: 0,
            url: compressedImageUrl,
            thumbnailUrl: compressedImageUrl,
          }

          // 更新图像
          imageUrl.value = compressedImageUrl
          processedImageUrl.value = ''

          // 重新加载图片以触发onload事件
          nextTick(() => {
            applyFilters()
          })

          console.log(
            `图像已本地压缩至 ${compressionQuality.value}% 质量，压缩率: ${compressionRatio}%`,
          )
        }
      } catch (error) {
        console.error('本地压缩图像出错:', error)
        alert('压缩图像时出错，请重试')
      }
    }

    // 人脸检测
    const faceCount = ref(0)

    const detectFaces = () => {
      alert('人脸检测功能需要后端API支持，当前使用模拟数据')
      faceCount.value = Math.floor(Math.random() * 5) + 1
    }

    // 图像质量分析
    const imageQualityScore = ref<number | null>(null)
    const imageQualityDetails = ref<string | null>(null)

    // 图像质量分析新增变量
    const isAnalyzing = ref(false)
    const imageQualityResult = ref<{
      fileName: string
      fileSize: number
      qualityScore: number
      quality: string
      metadata: {
        Width: string
        Height: string
        AspectRatio: string
        FileSize: string
        AverageBrightness: string
        AverageRed: string
        AverageGreen: string
        AverageBlue: string
      }
    } | null>(null)

    // 根据质量分数获取对应的颜色
    const getQualityColor = (score: number): string => {
      if (score >= 80) return '#10b981' // 绿色 - 优秀
      if (score >= 60) return '#3b82f6' // 蓝色 - 良好
      if (score >= 40) return '#f59e0b' // 黄色 - 一般
      return '#ef4444' // 红色 - 较差
    }

    // 图像质量分析 - 使用API接口
    const analyzeImageQuality = () => {
      if (!imageUrl.value || !originalImage.value) {
        alert('请先上传图片')
        return
      }

      isAnalyzing.value = true
      imageQualityResult.value = null

      try {
        // 将Data URL转换为Blob
        const dataURLtoBlob = (dataurl: string): Blob => {
          const arr = dataurl.split(',')
          const mime = arr[0].match(/:(.*?);/)![1]
          const bstr = atob(arr[1])
          let n = bstr.length
          const u8arr = new Uint8Array(n)
          while (n--) {
            u8arr[n] = bstr.charCodeAt(n)
          }
          return new Blob([u8arr], { type: mime })
        }

        // 准备API调用数据
        const imageBlob = dataURLtoBlob(imageUrl.value)
        const imageFile = new File([imageBlob], 'image.jpg', { type: 'image/jpeg' })

        const formData = new FormData()
        formData.append('file', imageFile)

        // 使用API_BASE_URL常量作为基础URL
        const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'
        const qualityUrl = `${API_BASE_URL}/ImageProcessing/analyze-quality`

        console.log('调用图像质量分析API:', qualityUrl)

        // 调用后端API
        fetch(qualityUrl, {
          method: 'POST',
          body: formData,
          headers: {
            // 获取认证token
            Authorization: `Bearer ${localStorage.getItem('token') || sessionStorage.getItem('token') || ''}`,
          },
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error(`服务器返回错误: ${response.status}`)
            }
            return response.json()
          })
          .then((data) => {
            console.log('图像质量分析成功:', data)
            imageQualityResult.value = data
          })
          .catch((error) => {
            console.error('图像质量分析失败:', error)
            alert(`图像质量分析失败: ${error.message}，将使用模拟数据`)

            // 使用模拟数据作为后备
            simulateImageQuality()
          })
          .finally(() => {
            isAnalyzing.value = false
          })
      } catch (error) {
        console.error('准备图像质量分析数据失败:', error)
        isAnalyzing.value = false
        simulateImageQuality() // 使用模拟数据作为后备
      }
    }

    // 生成模拟的质量分析数据（作为后备）
    const simulateImageQuality = () => {
      const score = Math.floor(Math.random() * 30) + 60 // 生成60-90之间的分数
      let quality = '良好'

      if (score >= 80) {
        quality = '优秀'
      } else if (score >= 60) {
        quality = '良好'
      } else if (score >= 40) {
        quality = '一般'
      } else {
        quality = '较差'
      }

      // 使用当前图像尺寸
      const width = originalImage.value?.naturalWidth || 1200
      const height = originalImage.value?.naturalHeight || 800
      const aspectRatio = (width / height).toFixed(2)

      imageQualityResult.value = {
        fileName: 'image.jpg',
        fileSize: Math.floor(Math.random() * 2000000) + 500000, // 500KB - 2.5MB
        qualityScore: score,
        quality: quality,
        metadata: {
          Width: width.toString(),
          Height: height.toString(),
          AspectRatio: aspectRatio,
          FileSize: `${(Math.random() * 2 + 0.5).toFixed(2)} MB`,
          AverageBrightness: `${Math.floor(Math.random() * 30) + 55}%`,
          AverageRed: (Math.random() * 100 + 80).toFixed(1),
          AverageGreen: (Math.random() * 100 + 70).toFixed(1),
          AverageBlue: (Math.random() * 100 + 60).toFixed(1),
        },
      }
    }

    // 应用锐化功能
    const applySharpen = () => {
      if (!imageUrl.value || !originalImage.value) {
        alert('请先上传图片')
        return
      }

      isSharpening.value = true

      try {
        // 将Data URL转换为Blob
        const dataURLtoBlob = (dataurl: string): Blob => {
          const arr = dataurl.split(',')
          const mime = arr[0].match(/:(.*?);/)![1]
          const bstr = atob(arr[1])
          let n = bstr.length
          const u8arr = new Uint8Array(n)
          while (n--) {
            u8arr[n] = bstr.charCodeAt(n)
          }
          return new Blob([u8arr], { type: mime })
        }

        // 准备API调用数据
        const imageBlob = dataURLtoBlob(imageUrl.value)
        const imageFile = new File([imageBlob], 'image.jpg', { type: 'image/jpeg' })

        // 使用图像服务调用API
        imageProcessingAPI
          .sharpenImage(imageFile)
          .then((response) => {
            console.log('图像锐化成功:', response.data)
            const data = response.data

            if (data.url) {
              // 预加载图片以确保URL有效
              const testImg = new Image()
              testImg.onload = () => {
                // 更新图像URL
                imageUrl.value = data.url
                processedImageUrl.value = ''

                // 显示成功消息
                alert(data.message || '图像已成功锐化')

                // 重新加载图片以触发onload事件
                nextTick(() => {
                  console.log('锐化后的图片已成功加载')
                })
              }
              testImg.onerror = () => {
                console.error('锐化后的图片加载失败，降级到本地处理')
                applySharpenLocally()
              }
              testImg.src = data.url
            } else {
              console.error('后端未返回有效的图片URL')
              applySharpenLocally()
            }
          })
          .catch((error) => {
            console.error('图像锐化API调用失败:', error)
            alert(`图像锐化失败: ${error.message || '未知错误'}，将使用本地处理`)
            applySharpenLocally()
          })
          .finally(() => {
            isSharpening.value = false
          })
      } catch (error) {
        console.error('准备图像锐化数据失败:', error)
        isSharpening.value = false
        applySharpenLocally()
      }
    }

    // 本地锐化图像方法(作为备用)
    const applySharpenLocally = () => {
      try {
        console.log('使用本地Canvas锐化图像...')
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')

        if (ctx && originalImage.value) {
          canvas.width = originalImage.value.naturalWidth
          canvas.height = originalImage.value.naturalHeight

          // 绘制原始图像
          ctx.drawImage(originalImage.value, 0, 0)

          // 在本地简单模拟锐化效果
          // 注意：这不是真正的锐化算法，只是视觉上的模拟
          const intensity = sharpness.value / 100
          ctx.shadowColor = 'black'
          ctx.shadowBlur = 10 * intensity
          ctx.drawImage(originalImage.value, 0, 0)

          // 添加一个指示标记
          ctx.font = '14px Arial'
          ctx.fillStyle = 'rgba(255, 255, 255, 0.7)'
          ctx.fillText(`锐化程度: ${sharpness.value}% (本地模拟)`, 10, canvas.height - 20)

          // 更新图像
          imageUrl.value = canvas.toDataURL('image/jpeg')
          processedImageUrl.value = ''

          // 重新加载图片以触发onload事件
          nextTick(() => {
            applyFilters()
          })

          console.log(`图像已本地锐化, 程度: ${sharpness.value}%`)
        }
      } catch (error) {
        console.error('本地锐化图像出错:', error)
        alert('锐化图像时出错，请重试')
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
      requestAdjustments,
      watermarkText,
      watermarkPosition,
      watermarkOpacity,
      resizeWidth,
      resizeHeight,
      maintainAspectRatio,
      isResizing,
      compressionQuality,
      isCompressing,
      compressionResult,
      formatFileSize,
      compressImage,
      faceCount,
      imageQualityScore,
      imageQualityDetails,
      applyWatermark,
      resizeImage,
      compressImage,
      detectFaces,
      analyzeImageQuality,
      isAnalyzing,
      imageQualityResult,
      getQualityColor,
      isSharpening,
      applySharpen,
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
