<template>
  <div class="bg-neutral min-h-screen pb-10">
    <!-- 页面标题区域 -->
    <div class="bg-primary text-white px-6 py-4 shadow-md">
      <div class="container mx-auto">
        <div class="flex justify-between items-center">
          <div>
            <h1 class="text-2xl font-bold">处理修图订单</h1>
            <p class="text-sm text-green-light mt-1">查看订单详情，更新状态，上传修图成品</p>
          </div>
          <router-link
            to="/my-orders"
            class="px-4 py-2 bg-white text-primary rounded-md hover:bg-green-light transition-colors"
          >
            返回订单列表
          </router-link>
        </div>
      </div>
    </div>

    <!-- 主要内容区域 -->
    <div class="container mx-auto px-4 mt-8">
      <!-- 加载状态 -->
      <div v-if="loading" class="flex justify-center py-12">
        <div class="text-center">
          <div
            class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"
          ></div>
          <p class="mt-4 text-neutral-dark">正在加载订单信息...</p>
        </div>
      </div>

      <!-- 错误状态 -->
      <div v-else-if="error" class="bg-white rounded-lg shadow-md p-6 text-center">
        <div class="text-error text-lg mb-3">加载失败</div>
        <p class="text-neutral-dark mb-6">{{ error }}</p>
        <button
          @click="fetchOrderDetails"
          class="px-4 py-2 bg-primary text-white rounded-md hover:bg-green-dark transition-colors"
        >
          重新加载
        </button>
      </div>

      <!-- 订单详情 -->
      <div v-else-if="orderDetails" class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <!-- 左侧订单信息 -->
        <div class="md:col-span-2">
          <div class="bg-white rounded-lg shadow-md p-6 mb-6">
            <div class="flex justify-between items-center mb-6">
              <h2 class="text-xl font-semibold text-neutral-dark">订单信息</h2>
              <div class="flex items-center">
                <span
                  :class="['px-3 py-1 text-sm rounded-full', getStatusClass(orderDetails.status)]"
                >
                  {{ getStatusText(orderDetails.status) }}
                </span>
                <span class="ml-2 text-sm text-neutral-dark"
                  >订单号: {{ orderDetails.orderId }}</span
                >
              </div>
            </div>

            <div class="border border-neutral rounded-md divide-y divide-neutral mb-6">
              <div class="flex p-4">
                <div class="w-1/3 text-neutral-dark font-medium">客户</div>
                <div class="w-2/3 text-primary">{{ orderDetails.username }}</div>
              </div>
              <div class="flex p-4">
                <div class="w-1/3 text-neutral-dark font-medium">创建日期</div>
                <div class="w-2/3 text-neutral-dark">{{ formatDate(orderDetails.createdAt) }}</div>
              </div>
              <div class="flex p-4">
                <div class="w-1/3 text-neutral-dark font-medium">照片标题</div>
                <div class="w-2/3 text-neutral-dark">{{ orderDetails.photoTitle }}</div>
              </div>
              <div class="flex p-4">
                <div class="w-1/3 text-neutral-dark font-medium">修图要求</div>
                <div class="w-2/3 text-neutral-dark whitespace-pre-wrap">
                  {{ orderDetails.requirements }}
                </div>
              </div>
              <div class="flex p-4">
                <div class="w-1/3 text-neutral-dark font-medium">价格</div>
                <div class="w-2/3 text-primary font-semibold">¥{{ orderDetails.price }}</div>
              </div>
            </div>

            <!-- 订单状态更新 -->
            <div class="mb-6">
              <h3 class="text-lg font-semibold text-neutral-dark mb-4">更新订单状态</h3>
              <div class="flex flex-wrap gap-3">
                <button
                  v-if="canAccept"
                  @click="updateStatus('Accepted')"
                  class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                >
                  接受订单
                </button>
                <button
                  v-if="canReject"
                  @click="updateStatus('Rejected')"
                  class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                >
                  拒绝订单
                </button>
                <button
                  v-if="canStartProcessing"
                  @click="updateStatus('InProgress')"
                  class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  开始处理
                </button>
                <button
                  v-if="canComplete"
                  @click="showCompletionForm = true"
                  class="px-4 py-2 bg-primary text-white rounded-md hover:bg-green-dark transition-colors"
                >
                  完成订单
                </button>
              </div>
            </div>

            <!-- 完成订单表单 -->
            <div v-if="showCompletionForm" class="mb-6 border border-neutral p-4 rounded-md">
              <h3 class="text-lg font-semibold text-neutral-dark mb-4">上传修图成果</h3>
              <div class="mb-4">
                <label class="block text-neutral-dark mb-2">修图后照片</label>
                <div
                  class="border-2 border-dashed border-neutral p-6 rounded-md text-center cursor-pointer"
                  @click="triggerFileInput"
                  @dragover.prevent
                  @drop.prevent="handleFileDrop"
                >
                  <div v-if="!selectedFile">
                    <svg
                      class="mx-auto h-12 w-12 text-neutral-light"
                      stroke="currentColor"
                      fill="none"
                      viewBox="0 0 48 48"
                      aria-hidden="true"
                    >
                      <path
                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                    <p class="mt-2 text-sm text-neutral-dark">
                      点击或拖放文件到此处上传 (仅支持 .jpg, .png 格式)
                    </p>
                  </div>
                  <div v-else class="text-left">
                    <div class="flex items-center">
                      <svg
                        class="h-6 w-6 text-green-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span class="ml-2 text-neutral-dark">{{ selectedFile.name }}</span>
                      <button
                        type="button"
                        @click.stop="removeSelectedFile"
                        class="ml-2 text-red-600 hover:text-red-800"
                      >
                        移除
                      </button>
                    </div>
                    <div v-if="previewUrl" class="mt-2">
                      <img :src="previewUrl" class="h-48 object-contain" :alt="selectedFile.name" />
                    </div>
                  </div>
                </div>
                <input
                  type="file"
                  ref="fileInput"
                  class="hidden"
                  accept="image/jpeg,image/png"
                  @change="handleFileSelect"
                />
              </div>

              <div class="flex justify-end space-x-3">
                <button
                  type="button"
                  @click="showCompletionForm = false"
                  class="px-4 py-2 border border-neutral text-neutral-dark rounded-md hover:bg-neutral-light transition-colors"
                >
                  取消
                </button>
                <button
                  type="button"
                  @click="completeOrder"
                  :disabled="!selectedFile"
                  :class="[
                    'px-4 py-2 rounded-md transition-colors',
                    selectedFile
                      ? 'bg-primary text-white hover:bg-green-dark'
                      : 'bg-neutral-light text-neutral-dark cursor-not-allowed',
                  ]"
                >
                  提交完成
                </button>
              </div>
            </div>

            <!-- 订单进度时间轴 -->
            <div>
              <h3 class="text-lg font-semibold text-neutral-dark mb-4">订单进度</h3>

              <div class="relative pl-8">
                <!-- 垂直线 -->
                <div class="absolute left-0 top-0 bottom-0 w-0.5 bg-neutral-light"></div>

                <!-- 创建订单 -->
                <div class="relative mb-6 pl-8">
                  <div
                    class="absolute left-0 -translate-x-1/2 w-4 h-4 rounded-full bg-primary"
                  ></div>
                  <div class="mb-1 font-medium text-neutral-dark">订单创建</div>
                  <div class="text-sm text-neutral-dark">
                    {{ formatDate(orderDetails.createdAt) }}
                  </div>
                </div>

                <!-- 修图师接单 -->
                <div class="relative mb-6 pl-8">
                  <div
                    class="absolute left-0 -translate-x-1/2 w-4 h-4 rounded-full"
                    :class="orderDetails.status !== 'Pending' ? 'bg-primary' : 'bg-neutral'"
                  ></div>
                  <div
                    class="mb-1 font-medium"
                    :class="
                      orderDetails.status !== 'Pending' ? 'text-neutral-dark' : 'text-neutral'
                    "
                  >
                    修图师接单
                  </div>
                  <div class="text-sm text-neutral-dark">
                    {{ orderDetails.status !== 'Pending' ? '已接单' : '等待中' }}
                  </div>
                </div>

                <!-- 修图中 -->
                <div class="relative mb-6 pl-8">
                  <div
                    class="absolute left-0 -translate-x-1/2 w-4 h-4 rounded-full"
                    :class="
                      orderDetails.status === 'InProgress' || orderDetails.status === 'Completed'
                        ? 'bg-primary'
                        : 'bg-neutral'
                    "
                  ></div>
                  <div
                    class="mb-1 font-medium"
                    :class="
                      orderDetails.status === 'InProgress' || orderDetails.status === 'Completed'
                        ? 'text-neutral-dark'
                        : 'text-neutral'
                    "
                  >
                    修图处理中
                  </div>
                  <div class="text-sm text-neutral-dark">
                    {{
                      orderDetails.status === 'InProgress'
                        ? '进行中'
                        : orderDetails.status === 'Completed'
                          ? '已完成'
                          : '未开始'
                    }}
                  </div>
                </div>

                <!-- 订单完成 -->
                <div class="relative pl-8">
                  <div
                    class="absolute left-0 -translate-x-1/2 w-4 h-4 rounded-full"
                    :class="orderDetails.status === 'Completed' ? 'bg-primary' : 'bg-neutral'"
                  ></div>
                  <div
                    class="mb-1 font-medium"
                    :class="
                      orderDetails.status === 'Completed' ? 'text-neutral-dark' : 'text-neutral'
                    "
                  >
                    订单完成
                  </div>
                  <div class="text-sm text-neutral-dark">
                    {{
                      orderDetails.status === 'Completed'
                        ? formatDate(orderDetails.completedAt)
                        : '等待中'
                    }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 右侧照片预览 -->
        <div class="md:col-span-1">
          <div class="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 class="text-xl font-semibold text-neutral-dark mb-4">原始照片</h2>

            <div v-if="photoLoaded" class="space-y-4">
              <div class="border border-neutral rounded-lg overflow-hidden">
                <img
                  :src="photoUrl"
                  :alt="orderDetails.photoTitle"
                  class="w-full h-auto"
                  @click="openImageViewer(photoUrl)"
                />
              </div>
              <div class="text-center mt-2">
                <button
                  @click="downloadOriginalImage"
                  class="px-4 py-2 text-sm border border-primary text-primary rounded-md hover:bg-green-50 transition-colors"
                >
                  下载原图
                </button>
              </div>
            </div>

            <div v-else class="h-64 bg-neutral-light flex items-center justify-center rounded-lg">
              <p class="text-neutral-dark">加载照片中...</p>
            </div>
          </div>

          <!-- 修图后照片显示 -->
          <div
            v-if="orderDetails.status === 'Completed' && orderDetails.retouchedPhotoId"
            class="bg-white rounded-lg shadow-md p-6"
          >
            <h2 class="text-xl font-semibold text-neutral-dark mb-4">修图后照片</h2>
            <div v-if="retouchedPhotoLoaded" class="space-y-4">
              <div class="border border-neutral rounded-lg overflow-hidden">
                <img
                  :src="retouchedPhotoUrl"
                  :alt="orderDetails.retouchedPhotoTitle"
                  class="w-full h-auto"
                  @click="openImageViewer(retouchedPhotoUrl)"
                />
              </div>
              <div class="text-center mt-2">
                <button
                  @click="downloadRetouchedImage"
                  class="px-4 py-2 text-sm border border-primary text-primary rounded-md hover:bg-green-50 transition-colors"
                >
                  下载修图后照片
                </button>
              </div>
            </div>
            <div v-else class="h-64 bg-neutral-light flex items-center justify-center rounded-lg">
              <p class="text-neutral-dark">加载修图后照片中...</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 全屏图片查看器 -->
    <div
      v-if="imageViewerVisible"
      class="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center"
      @click="closeImageViewer"
    >
      <div class="relative max-w-4xl max-h-full">
        <img :src="imageViewerUrl" class="max-w-full max-h-[90vh] object-contain" />
        <button class="absolute top-4 right-4 text-white text-2xl" @click.stop="closeImageViewer">
          ×
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '../stores/userStore'
import apiClient from '../services/apiService'
import axios from 'axios'

export default defineComponent({
  name: 'RetouchOrderProcessView',
  setup() {
    const route = useRoute()
    const router = useRouter()
    const userStore = useUserStore()

    const orderId = ref(route.params.id as string)
    const orderDetails = ref<any>(null)
    const loading = ref(true)
    const error = ref('')

    // 照片相关
    const photoLoaded = ref(false)
    const photoUrl = ref('')

    // 照片查看器
    const imageViewerVisible = ref(false)
    const imageViewerUrl = ref('')

    // 完成订单相关
    const showCompletionForm = ref(false)
    const fileInput = ref<HTMLInputElement | null>(null)
    const selectedFile = ref<File | null>(null)
    const previewUrl = ref('')

    // 修图后照片相关
    const retouchedPhotoUrl = ref('')
    const retouchedPhotoLoaded = ref(false)

    // 计算属性：根据当前订单状态判断可执行的操作
    const canAccept = computed(() => {
      return orderDetails.value && orderDetails.value.status === 'Pending'
    })

    const canReject = computed(() => {
      return orderDetails.value && orderDetails.value.status === 'Pending'
    })

    const canStartProcessing = computed(() => {
      // 修改：不再使用'Accepted'状态，因为数据库中没有这个值
      return false // 这个计算属性现在没有用了
    })

    const canComplete = computed(() => {
      return orderDetails.value && orderDetails.value.status === 'InProgress'
    })

    // 获取订单状态对应的CSS类
    const getStatusClass = (status: string): string => {
      switch (status) {
        case 'Pending':
          return 'bg-yellow-100 text-yellow-800'
        case 'Accepted':
          return 'bg-green-100 text-green-800'
        case 'Rejected':
          return 'bg-red-100 text-red-800'
        case 'InProgress':
          return 'bg-blue-100 text-blue-800'
        case 'Completed':
          return 'bg-green-100 text-green-800'
        case 'Cancelled':
          return 'bg-red-100 text-red-800'
        default:
          return 'bg-neutral-light text-neutral-dark'
      }
    }

    // 获取订单状态对应的文字
    const getStatusText = (status: string): string => {
      switch (status) {
        case 'Pending':
          return '待处理'
        case 'Accepted': // 保留UI表示的'已接受'，实际不存在此数据库状态
          return '已接受'
        case 'Rejected': // 保留UI表示的'已拒绝'，实际不存在此数据库状态
          return '已拒绝'
        case 'InProgress':
          return '处理中'
        case 'Completed':
          return '已完成'
        case 'Cancelled': // 添加对应的中文展示
          return '已取消'
        default:
          return status
      }
    }

    // 格式化日期
    const formatDate = (dateString: string): string => {
      if (!dateString) return '未设置'
      const date = new Date(dateString)
      return new Intl.DateTimeFormat('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      }).format(date)
    }

    // 获取订单详情
    const fetchOrderDetails = async () => {
      loading.value = true
      error.value = ''
      photoLoaded.value = false

      try {
        console.log(`正在获取修图订单详情，订单ID: ${orderId.value}`)
        const response = await apiClient.get(`/RetouchOrder/${orderId.value}`)
        orderDetails.value = response.data
        console.log('获取到订单详情:', orderDetails.value)

        // 获取照片URL
        await fetchPhotoUrl()

        console.log('订单状态:', orderDetails.value.status)

        // 获取修图后照片URL
        if (orderDetails.value.status === 'Completed' && orderDetails.value.retouchedPhotoId) {
          await fetchRetouchedPhotoUrl()
        }
      } catch (err: any) {
        console.error('获取订单详情失败:', err)
        error.value = '获取订单详情失败，请稍后再试'
      } finally {
        loading.value = false
      }
    }

    // 获取照片URL
    const fetchPhotoUrl = async () => {
      if (!orderDetails.value || !orderDetails.value.photoId) return

      try {
        console.log(`正在获取照片信息，照片ID: ${orderDetails.value.photoId}`)
        console.log('照片路径:', orderDetails.value.photoPath)

        // 获取静态资源基础URL
        const staticAssetsUrl = import.meta.env.VITE_STATIC_ASSETS_URL || ''
        console.log('静态资源基础URL:', staticAssetsUrl)

        // 使用照片路径直接构建URL，添加uploads前缀
        if (orderDetails.value.photoPath) {
          // 检查路径是否已经包含uploads
          let photoPath = orderDetails.value.photoPath
          if (!photoPath.startsWith('http') && !photoPath.startsWith('/uploads')) {
            // 添加uploads前缀
            photoPath = `/uploads/${photoPath}`
          }

          // 构建完整URL
          photoUrl.value = photoPath.startsWith('http')
            ? photoPath
            : `${staticAssetsUrl}${photoPath}`

          console.log('构建的照片URL:', photoUrl.value)
          photoLoaded.value = true
        } else {
          // 如果没有直接路径，尝试获取照片详情
          const response = await apiClient.get(`/Photo/${orderDetails.value.photoId}`)
          console.log('获取到照片信息:', response.data)

          let imageUrl = response.data.imageUrl
          // 检查路径是否已经包含uploads
          if (!imageUrl.startsWith('http') && !imageUrl.startsWith('/uploads')) {
            // 添加uploads前缀
            imageUrl = `/uploads/${imageUrl}`
          }

          // 构建完整URL
          photoUrl.value = imageUrl.startsWith('http') ? imageUrl : `${staticAssetsUrl}${imageUrl}`

          console.log('构建的照片URL:', photoUrl.value)
          photoLoaded.value = true
        }
      } catch (err) {
        console.error('获取照片信息失败:', err)
        error.value = '获取照片信息失败，请稍后再试'
      }
    }

    // 额外获取修图后照片
    const fetchRetouchedPhotoUrl = async () => {
      try {
        console.log(`正在获取修图后照片信息，照片ID: ${orderDetails.value.retouchedPhotoId}`)
        // ...similar logic to fetchPhotoUrl...
        // build the full retouchedPhotoUrl.value
        const staticAssetsUrl = import.meta.env.VITE_STATIC_ASSETS_URL || ''
        let retouchedPhotoPath = orderDetails.value.retouchedPhotoPath
        if (!retouchedPhotoPath.startsWith('http') && !retouchedPhotoPath.startsWith('/uploads')) {
          retouchedPhotoPath = `/uploads/${retouchedPhotoPath}`
        }
        retouchedPhotoUrl.value = retouchedPhotoPath.startsWith('http')
          ? retouchedPhotoPath
          : `${staticAssetsUrl}${retouchedPhotoPath}`
        retouchedPhotoLoaded.value = true
      } catch (err) {
        console.error('加载修图后照片失败:', err)
      }
    }

    // 更新订单状态
    const updateStatus = async (newStatus: string) => {
      if (!orderDetails.value) return

      // 将UI表示的状态映射到实际的数据库枚举值
      let actualStatus: string
      let confirmMessage: string

      // 根据按钮类型映射到正确的数据库状态
      if (newStatus === 'Accepted') {
        actualStatus = 'InProgress' // 接受订单实际上设置为InProgress状态
        confirmMessage = '确认接受此订单?'
      } else if (newStatus === 'Rejected') {
        actualStatus = 'Cancelled' // 拒绝订单实际上设置为Cancelled状态
        confirmMessage = '确认拒绝此订单?'
      } else {
        actualStatus = newStatus // 其他状态不需要映射
        confirmMessage = `确认将订单状态更改为${getStatusText(newStatus)}?`
      }

      if (!confirm(confirmMessage)) {
        return // 用户取消操作
      }

      try {
        loading.value = true
        console.log(
          `正在更新订单 ${orderId.value} 状态为: ${actualStatus}（UI显示为: ${newStatus}）`,
        )

        // 调用API更新订单状态，使用映射后的实际状态值
        await apiClient.put(`/RetouchOrder/${orderId.value}/status`, { status: actualStatus })

        console.log('订单状态更新成功')
        alert(`订单状态已成功更新为: ${getStatusText(newStatus)}`)

        // 重新获取订单数据以获取最新状态
        await fetchOrderDetails()
      } catch (err) {
        console.error('更新订单状态失败:', err)
        alert('更新订单状态失败，请稍后重试')
      } finally {
        loading.value = false
      }
    }

    // 文件上传相关方法
    const triggerFileInput = () => {
      if (fileInput.value) {
        fileInput.value.click()
      }
    }

    const handleFileSelect = (event: Event) => {
      const target = event.target as HTMLInputElement
      if (target.files && target.files.length > 0) {
        const file = target.files[0]
        if (validateImageFile(file)) {
          selectedFile.value = file
          createPreview(file)
        } else {
          alert('请上传有效的图片文件 (.jpg, .jpeg, .png)')
          removeSelectedFile()
        }
      }
    }

    const handleFileDrop = (event: DragEvent) => {
      if (event.dataTransfer?.files && event.dataTransfer.files.length > 0) {
        const file = event.dataTransfer.files[0]
        if (validateImageFile(file)) {
          selectedFile.value = file
          createPreview(file)
        } else {
          alert('请上传有效的图片文件 (.jpg, .jpeg, .png)')
        }
      }
    }

    const validateImageFile = (file: File): boolean => {
      const validTypes = ['image/jpeg', 'image/png']
      return validTypes.includes(file.type)
    }

    const createPreview = (file: File) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        previewUrl.value = e.target?.result as string
      }
      reader.readAsDataURL(file)
    }

    const removeSelectedFile = () => {
      selectedFile.value = null
      previewUrl.value = ''
      if (fileInput.value) {
        fileInput.value.value = ''
      }
    }

    // 完成订单
    const completeOrder = async () => {
      if (!selectedFile.value) {
        alert('请先上传修图后的照片')
        return
      }

      try {
        loading.value = true
        const formData = new FormData()

        // 关键修改：直接添加文件对象
        formData.append('RetouchedPhoto', selectedFile.value)

        // 添加评论
        formData.append(
          'Comment',
          `修图已完成，调整了照片的光影效果、色彩平衡和细节处理，上传于${new Date().toLocaleString('zh-CN')}`,
        )

        // 使用 multipart/form-data 提交
        await apiClient.put(`/RetouchOrder/${orderId.value}/complete`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })

        // 后续处理代码保持不变
        alert('修图成果已上传，订单已完成')
        orderDetails.value.status = 'Completed'
        showCompletionForm.value = false
        await fetchOrderDetails()
      } catch (err) {
        console.error('完成订单失败:', err)
        alert('完成订单失败，请稍后重试')
      } finally {
        loading.value = false
      }
    }

    // 下载原始图片
    const downloadOriginalImage = () => {
      if (!photoUrl.value) {
        alert('照片链接不可用，无法下载')
        return
      }

      try {
        // 创建一个隐藏的a标签来触发下载
        const link = document.createElement('a')
        link.href = photoUrl.value

        // 从URL中提取文件名，如果无法提取，使用订单号和照片标题创建文件名
        let filename = ''
        try {
          // 尝试从URL中提取文件名
          const urlParts = new URL(photoUrl.value).pathname.split('/')
          filename = urlParts[urlParts.length - 1]
        } catch (e) {
          // 如果URL解析失败，使用订单信息创建文件名
          const fileExtension = photoUrl.value.toLowerCase().endsWith('.png') ? '.png' : '.jpg'
          filename = `订单${orderDetails.value.orderId}-${orderDetails.value.photoTitle}${fileExtension}`
        }

        // 设置下载的文件名
        link.download = filename

        // 添加到文档中并触发点击
        document.body.appendChild(link)
        link.click()

        // 清理DOM
        document.body.removeChild(link)

        console.log('开始下载图片:', filename)
      } catch (err) {
        console.error('下载图片失败:', err)
        alert('下载图片失败，请尝试右键点击图片并选择"图片另存为"')

        // 回退到简单的窗口打开方式
        window.open(photoUrl.value, '_blank')
      }
    }

    // 下载修图后照片
    const downloadRetouchedImage = () => {
      if (!retouchedPhotoUrl.value) {
        alert('修图后照片链接不可用，无法下载')
        return
      }

      try {
        // 创建一个隐藏的a标签来触发下载
        const link = document.createElement('a')
        link.href = retouchedPhotoUrl.value

        // 从URL中提取文件名，如果无法提取，使用订单号和照片标题创建文件名
        let filename = ''
        try {
          // 尝试从URL中提取文件名
          const urlParts = new URL(retouchedPhotoUrl.value).pathname.split('/')
          filename = urlParts[urlParts.length - 1]
        } catch (e) {
          // 如果URL解析失败，使用订单信息创建文件名
          const fileExtension = retouchedPhotoUrl.value.toLowerCase().endsWith('.png')
            ? '.png'
            : '.jpg'
          filename = `订单${orderDetails.value.orderId}-${orderDetails.value.retouchedPhotoTitle}${fileExtension}`
        }

        // 设置下载的文件名
        link.download = filename

        // 添加到文档中并触发点击
        document.body.appendChild(link)
        link.click()

        // 清理DOM
        document.body.removeChild(link)

        console.log('开始下载修图后照片:', filename)
      } catch (err) {
        console.error('下载修图后照片失败:', err)
        alert('下载修图后照片失败，请尝试右键点击照片并选择"图片另存为"')

        // 回退到简单的窗口打开方式
        window.open(retouchedPhotoUrl.value, '_blank')
      }
    }

    // 图片查看器
    const openImageViewer = (url: string) => {
      imageViewerUrl.value = url
      imageViewerVisible.value = true
      document.body.style.overflow = 'hidden' // 防止背景滚动
    }

    const closeImageViewer = () => {
      imageViewerVisible.value = false
      document.body.style.overflow = '' // 恢复滚动
    }

    onMounted(() => {
      fetchOrderDetails()
    })

    return {
      orderId,
      orderDetails,
      loading,
      error,
      photoLoaded,
      photoUrl,
      imageViewerVisible,
      imageViewerUrl,
      showCompletionForm,
      fileInput,
      selectedFile,
      previewUrl,
      retouchedPhotoUrl,
      retouchedPhotoLoaded,
      canAccept,
      canReject,
      canStartProcessing,
      canComplete,
      getStatusClass,
      getStatusText,
      formatDate,
      fetchOrderDetails,
      updateStatus,
      triggerFileInput,
      handleFileSelect,
      handleFileDrop,
      removeSelectedFile,
      completeOrder,
      downloadOriginalImage,
      downloadRetouchedImage,
      openImageViewer,
      closeImageViewer,
    }
  },
})
</script>
