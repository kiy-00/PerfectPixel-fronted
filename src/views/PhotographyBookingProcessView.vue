<template>
  <div class="bg-neutral min-h-screen pb-10">
    <!-- 页面标题区域 -->
    <div class="bg-primary text-white px-6 py-4 shadow-md">
      <div class="container mx-auto">
        <div class="flex justify-between items-center">
          <div>
            <h1 class="text-2xl font-bold">处理摄影预约</h1>
            <p class="text-sm text-green-light mt-1">处理预约流程，更新状态，完成预约</p>
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
          <p class="mt-4 text-neutral-dark">正在加载预约信息...</p>
        </div>
      </div>

      <!-- 错误状态 -->
      <div v-else-if="error" class="bg-white rounded-lg shadow-md p-6 text-center">
        <div class="text-error text-lg mb-3">加载失败</div>
        <p class="text-neutral-dark mb-6">{{ error }}</p>
        <button
          @click="fetchBookingDetails"
          class="px-4 py-2 bg-primary text-white rounded-md hover:bg-green-dark transition-colors"
        >
          重新加载
        </button>
      </div>

      <!-- 预约详情 -->
      <div v-else-if="bookingDetails" class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <!-- 左侧预约信息 -->
        <div class="md:col-span-2">
          <div class="bg-white rounded-lg shadow-md p-6 mb-6">
            <div class="flex justify-between items-center mb-6">
              <h2 class="text-xl font-semibold text-neutral-dark">预约信息</h2>
              <div class="flex items-center">
                <span
                  :class="['px-3 py-1 text-sm rounded-full', getStatusClass(bookingDetails.status)]"
                >
                  {{ getStatusText(bookingDetails.status) }}
                </span>
                <span class="ml-2 text-sm text-neutral-dark"
                  >预约号: {{ bookingDetails.bookingId }}</span
                >
              </div>
            </div>

            <div class="border border-neutral rounded-md divide-y divide-neutral mb-6">
              <div class="flex p-4">
                <div class="w-1/3 text-neutral-dark font-medium">客户</div>
                <div class="w-2/3 text-primary">{{ bookingDetails.username }}</div>
              </div>
              <div class="flex p-4">
                <div class="w-1/3 text-neutral-dark font-medium">预约日期</div>
                <div class="w-2/3 text-neutral-dark">
                  {{ formatDate(bookingDetails.bookingDate) }}
                </div>
              </div>
              <div class="flex p-4">
                <div class="w-1/3 text-neutral-dark font-medium">拍摄地点</div>
                <div class="w-2/3 text-neutral-dark">{{ bookingDetails.location }}</div>
              </div>
              <div class="flex p-4">
                <div class="w-1/3 text-neutral-dark font-medium">照片数量</div>
                <div class="w-2/3 text-neutral-dark">{{ bookingDetails.photoCount }}张</div>
              </div>
              <div class="flex p-4">
                <div class="w-1/3 text-neutral-dark font-medium">拍摄需求</div>
                <div class="w-2/3 text-neutral-dark whitespace-pre-wrap">
                  {{ bookingDetails.requirements }}
                </div>
              </div>
              <div class="flex p-4">
                <div class="w-1/3 text-neutral-dark font-medium">金额</div>
                <div class="w-2/3 text-primary font-semibold">
                  ¥{{ bookingDetails.initialAmount }}
                </div>
              </div>
              <div class="flex p-4">
                <div class="w-1/3 text-neutral-dark font-medium">创建日期</div>
                <div class="w-2/3 text-neutral-dark">
                  {{ formatDate(bookingDetails.createdAt) }}
                </div>
              </div>
            </div>

            <!-- 预约状态更新按钮 -->
            <div class="mb-6">
              <h3 class="text-lg font-semibold text-neutral-dark mb-4">更新预约状态</h3>
              <div class="flex flex-wrap gap-3">
                <button
                  v-if="canAccept"
                  @click="updateStatus('Confirmed')"
                  class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                >
                  接受预约
                </button>
                <button
                  v-if="canReject"
                  @click="updateStatus('Cancelled')"
                  class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                >
                  拒绝预约
                </button>
                <button
                  v-if="canStartProcess"
                  @click="updateStatus('InProgress')"
                  class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  开始拍摄
                </button>
                <button
                  v-if="canComplete"
                  @click="showCompletionForm = true"
                  class="px-4 py-2 bg-primary text-white rounded-md hover:bg-green-dark transition-colors"
                >
                  完成预约
                </button>
              </div>
            </div>

            <!-- 完成预约表单 - 上传照片 -->
            <div v-if="showCompletionForm" class="mb-6 border border-neutral p-4 rounded-md">
              <h3 class="text-lg font-semibold text-neutral-dark mb-4">上传照片</h3>
              <p class="text-sm text-neutral-dark mb-4">
                请上传拍摄的照片，客户将可以在订单完成后查看这些照片。
              </p>

              <div class="mb-4">
                <label class="block text-neutral-dark mb-2">照片（可多选）</label>
                <div
                  class="border-2 border-dashed border-neutral p-6 rounded-md text-center cursor-pointer"
                  @click="triggerFileInput"
                  @dragover.prevent
                  @drop.prevent="handleFileDrop"
                >
                  <div v-if="selectedFiles.length === 0">
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
                    <p class="text-xs text-neutral-dark mt-1">
                      最多可上传{{ bookingDetails.photoCount }}张照片
                    </p>
                  </div>
                  <div v-else class="text-left">
                    <h4 class="text-neutral-dark font-medium mb-2">
                      已选择{{ selectedFiles.length }}张照片
                    </h4>
                    <ul class="space-y-2 max-h-40 overflow-y-auto">
                      <li
                        v-for="(file, index) in selectedFiles"
                        :key="index"
                        class="flex items-center"
                      >
                        <svg
                          class="h-5 w-5 text-green-600 mr-2"
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
                        <span class="text-sm text-neutral-dark">{{ file.name }}</span>
                        <button
                          type="button"
                          @click.stop="removeFile(index)"
                          class="ml-2 text-red-600 hover:text-red-800 text-sm"
                        >
                          移除
                        </button>
                      </li>
                    </ul>
                    <div v-if="selectedFiles.length < bookingDetails.photoCount" class="mt-3">
                      <button
                        @click.stop="triggerFileInput"
                        class="text-sm text-primary hover:text-green-dark"
                      >
                        添加更多照片
                      </button>
                    </div>
                  </div>
                </div>
                <input
                  type="file"
                  ref="fileInput"
                  class="hidden"
                  accept="image/jpeg,image/png"
                  multiple
                  @change="handleFileSelect"
                />
              </div>

              <div class="mb-4">
                <label class="block text-neutral-dark mb-2">备注信息</label>
                <textarea
                  v-model="completionComment"
                  class="w-full px-3 py-2 border border-neutral rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  rows="3"
                  placeholder="可以添加拍摄过程中的备注信息，例如特殊要求如何实现、天气情况等..."
                ></textarea>
              </div>

              <!-- 新增公开设置 -->
              <div class="mb-4 flex items-center">
                <input
                  id="isPublic"
                  type="checkbox"
                  v-model="isPublic"
                  class="h-4 w-4 text-primary focus:ring-green-400 border-neutral rounded"
                />
                <label for="isPublic" class="ml-2 block text-sm text-neutral-dark">
                  将这些照片设为公开
                </label>
              </div>

              <div class="mb-3 text-sm text-neutral-dark">
                <div class="flex items-start">
                  <span class="text-primary mr-2">•</span>
                  上传的照片将作为拍摄成果交付给客户
                </div>
                <div class="flex items-start">
                  <span class="text-primary mr-2">•</span>
                  请确保照片质量良好，符合客户预期
                </div>
                <div class="flex items-start">
                  <span class="text-primary mr-2">•</span>
                  完成预约后，客户将可以查看和下载这些照片
                </div>
              </div>

              <div class="flex justify-end space-x-3 mt-4">
                <button
                  type="button"
                  @click="showCompletionForm = false"
                  class="px-4 py-2 border border-neutral text-neutral-dark rounded-md hover:bg-neutral-light transition-colors"
                >
                  取消
                </button>
                <button
                  type="button"
                  @click="completeBookingWithPhotos"
                  :disabled="selectedFiles.length === 0"
                  :class="[
                    'px-4 py-2 rounded-md transition-colors',
                    selectedFiles.length > 0
                      ? 'bg-primary text-white hover:bg-green-dark'
                      : 'bg-neutral-light text-neutral-dark cursor-not-allowed',
                  ]"
                >
                  提交并完成预约
                </button>
              </div>
            </div>

            <!-- 服务明细 -->
            <div class="mb-6">
              <h3 class="text-lg font-semibold text-neutral-dark mb-4">服务明细</h3>
              <div class="border border-neutral rounded-md overflow-hidden">
                <table class="min-w-full divide-y divide-neutral">
                  <thead class="bg-neutral-light">
                    <tr>
                      <th
                        class="px-6 py-3 text-left text-xs font-medium text-neutral-dark uppercase tracking-wider"
                      >
                        服务项目
                      </th>
                      <th
                        class="px-6 py-3 text-left text-xs font-medium text-neutral-dark uppercase tracking-wider"
                      >
                        描述
                      </th>
                      <th
                        class="px-6 py-3 text-right text-xs font-medium text-neutral-dark uppercase tracking-wider"
                      >
                        价格
                      </th>
                    </tr>
                  </thead>
                  <tbody class="bg-white divide-y divide-neutral">
                    <tr v-for="service in bookingDetails.services" :key="service.serviceId">
                      <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-neutral-dark">
                        {{ service.serviceName }}
                      </td>
                      <td class="px-6 py-4 text-sm text-neutral-dark">
                        {{ service.description }}
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-right text-primary">
                        ¥{{ service.price }}
                      </td>
                    </tr>
                    <tr class="bg-neutral-light">
                      <td colspan="2" class="px-6 py-4 text-right font-medium text-neutral-dark">
                        总计
                      </td>
                      <td class="px-6 py-4 text-right font-bold text-primary">
                        ¥{{ bookingDetails.initialAmount }}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <!-- 预约进度时间轴 -->
            <div>
              <h3 class="text-lg font-semibold text-neutral-dark mb-4">预约进度</h3>

              <div class="relative pl-8">
                <!-- 垂直线 -->
                <div class="absolute left-0 top-0 bottom-0 w-0.5 bg-neutral-light"></div>

                <!-- 创建预约 -->
                <div class="relative mb-6 pl-8">
                  <div
                    class="absolute left-0 -translate-x-1/2 w-4 h-4 rounded-full bg-primary"
                  ></div>
                  <div class="mb-1 font-medium text-neutral-dark">预约创建</div>
                  <div class="text-sm text-neutral-dark">
                    {{ formatDate(bookingDetails.createdAt) }}
                  </div>
                </div>

                <!-- 摄影师确认 -->
                <div class="relative mb-6 pl-8">
                  <div
                    class="absolute left-0 -translate-x-1/2 w-4 h-4 rounded-full"
                    :class="bookingDetails.status !== 'Pending' ? 'bg-primary' : 'bg-neutral'"
                  ></div>
                  <div
                    class="mb-1 font-medium"
                    :class="
                      bookingDetails.status !== 'Pending' ? 'text-neutral-dark' : 'text-neutral'
                    "
                  >
                    摄影师确认
                  </div>
                  <div class="text-sm text-neutral-dark">
                    {{
                      bookingDetails.status === 'Pending'
                        ? '等待中'
                        : bookingDetails.status === 'Cancelled' && previousStatus === 'Pending'
                          ? '已拒绝'
                          : '已确认'
                    }}
                  </div>
                </div>

                <!-- 拍摄日期 -->
                <div class="relative mb-6 pl-8">
                  <div
                    class="absolute left-0 -translate-x-1/2 w-4 h-4 rounded-full"
                    :class="
                      bookingDetails.status === 'InProgress' ||
                      bookingDetails.status === 'Completed'
                        ? 'bg-primary'
                        : 'bg-neutral'
                    "
                  ></div>
                  <div
                    class="mb-1 font-medium"
                    :class="
                      bookingDetails.status === 'InProgress' ||
                      bookingDetails.status === 'Completed'
                        ? 'text-neutral-dark'
                        : 'text-neutral'
                    "
                  >
                    开始拍摄
                  </div>
                  <div class="text-sm text-neutral-dark">
                    {{
                      bookingDetails.status === 'InProgress' ||
                      bookingDetails.status === 'Completed'
                        ? formatDate(bookingDetails.bookingDate)
                        : '等待中'
                    }}
                  </div>
                </div>

                <!-- 预约完成 -->
                <div class="relative pl-8">
                  <div
                    class="absolute left-0 -translate-x-1/2 w-4 h-4 rounded-full"
                    :class="bookingDetails.status === 'Completed' ? 'bg-primary' : 'bg-neutral'"
                  ></div>
                  <div
                    class="mb-1 font-medium"
                    :class="
                      bookingDetails.status === 'Completed' ? 'text-neutral-dark' : 'text-neutral'
                    "
                  >
                    预约完成
                  </div>
                  <div class="text-sm text-neutral-dark">
                    {{
                      bookingDetails.status === 'Completed'
                        ? formatDate(bookingDetails.updatedAt)
                        : '等待中'
                    }}
                  </div>
                </div>

                <!-- 取消状态 (仅在订单已取消时显示) -->
                <div v-if="bookingDetails.status === 'Cancelled'" class="relative mt-6 pl-8">
                  <div
                    class="absolute left-0 -translate-x-1/2 w-4 h-4 rounded-full bg-red-500"
                  ></div>
                  <div class="mb-1 font-medium text-red-500">预约已取消</div>
                  <div class="text-sm text-neutral-dark">
                    {{ formatDate(bookingDetails.updatedAt) }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 右侧客户信息和备注 -->
        <div class="md:col-span-1">
          <div class="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 class="text-xl font-semibold text-neutral-dark mb-4">客户信息</h2>
            <div class="flex items-center mb-4">
              <div
                class="w-16 h-16 bg-neutral-light rounded-full mr-4 flex-shrink-0 flex items-center justify-center text-2xl text-primary"
              >
                {{
                  bookingDetails.username ? bookingDetails.username.charAt(0).toUpperCase() : '?'
                }}
              </div>
              <div>
                <div class="font-medium text-primary">{{ bookingDetails.username }}</div>
                <div class="text-sm text-neutral-dark mt-1">客户</div>
              </div>
            </div>
            <div class="mt-4">
              <router-link
                :to="`/user/${bookingDetails.userId}`"
                class="text-primary hover:text-green-dark text-sm"
              >
                查看客户资料
              </router-link>
            </div>
          </div>

          <!-- 天气提醒 - 如果是户外拍摄可能有用 -->
          <div v-if="isOutdoorShoot" class="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 class="text-lg font-semibold text-neutral-dark mb-2">拍摄日天气预报</h2>
            <p class="text-sm text-neutral-dark mb-4">
              室外拍摄受天气影响较大，建议提前关注天气状况。
            </p>
            <div class="flex justify-center">
              <a
                :href="`https://weather.com/zh-CN/weather/tenday/l/${bookingDetails.location}`"
                target="_blank"
                class="px-4 py-2 bg-neutral-light text-neutral-dark rounded-md hover:bg-neutral transition-colors text-sm"
              >
                查看拍摄地点天气
              </a>
            </div>
          </div>

          <!-- 摄影师注意事项 -->
          <div class="bg-white rounded-lg shadow-md p-6">
            <h2 class="text-lg font-semibold text-neutral-dark mb-2">注意事项</h2>
            <ul class="text-sm text-neutral-dark space-y-2">
              <li class="flex items-start">
                <span class="text-primary mr-2">•</span>
                及时与客户确认预约细节和要求
              </li>
              <li class="flex items-start">
                <span class="text-primary mr-2">•</span>
                准备好相机设备和必要配件
              </li>
              <li class="flex items-start">
                <span class="text-primary mr-2">•</span>
                预留充足的时间抵达拍摄地点
              </li>
              <li class="flex items-start">
                <span class="text-primary mr-2">•</span>
                如需取消或更改，请提前48小时通知客户
              </li>
              <li class="flex items-start">
                <span class="text-primary mr-2">•</span>
                拍摄完成后7天内交付照片
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import apiClient from '../services/apiService'

export default defineComponent({
  name: 'PhotographyBookingProcessView',
  setup() {
    const route = useRoute()
    const router = useRouter()
    const bookingId = ref(route.params.id as string)
    const bookingDetails = ref<any>(null)
    const loading = ref(true)
    const error = ref('')
    const previousStatus = ref<string>('')

    // 计算属性 - 是否是户外拍摄
    const isOutdoorShoot = computed(() => {
      if (!bookingDetails.value) return false
      const location = bookingDetails.value.location?.toLowerCase() || ''
      const requirements = bookingDetails.value.requirements?.toLowerCase() || ''

      const outdoorKeywords = [
        '户外',
        '公园',
        '海边',
        '沙滩',
        '花海',
        '山',
        '湖',
        '外景',
        'outdoor',
      ]

      return outdoorKeywords.some(
        (keyword) => location.includes(keyword) || requirements.includes(keyword),
      )
    })

    // 状态按钮显示逻辑
    const canAccept = computed(() => {
      return bookingDetails.value && bookingDetails.value.status === 'Pending'
    })

    const canReject = computed(() => {
      return (
        bookingDetails.value &&
        (bookingDetails.value.status === 'Pending' || bookingDetails.value.status === 'Confirmed')
      )
    })

    const canStartProcess = computed(() => {
      return bookingDetails.value && bookingDetails.value.status === 'Confirmed'
    })

    const canComplete = computed(() => {
      return bookingDetails.value && bookingDetails.value.status === 'InProgress'
    })

    // 获取预约状态对应的CSS类
    const getStatusClass = (status: string): string => {
      switch (status) {
        case 'Pending':
          return 'bg-yellow-100 text-yellow-800'
        case 'Confirmed':
          return 'bg-green-100 text-green-800'
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

    // 获取预约状态对应的文字
    const getStatusText = (status: string): string => {
      switch (status) {
        case 'Pending':
          return '待确认'
        case 'Confirmed':
          return '已确认'
        case 'InProgress':
          return '拍摄中'
        case 'Completed':
          return '已完成'
        case 'Cancelled':
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

    // 获取预约详情
    const fetchBookingDetails = async () => {
      loading.value = true
      error.value = ''

      try {
        console.log(`正在获取摄影预约详情，预约ID: ${bookingId.value}`)
        const response = await apiClient.get(`/Booking/${bookingId.value}`)
        // 保存前一个状态，用于UI展示
        if (bookingDetails.value) {
          previousStatus.value = bookingDetails.value.status
        }
        bookingDetails.value = response.data
        console.log('获取到预约详情:', bookingDetails.value)
      } catch (err: any) {
        console.error('获取预约详情失败:', err)
        error.value = '获取预约详情失败，请稍后再试'
      } finally {
        loading.value = false
      }
    }

    // 更新预约状态
    const updateStatus = async (newStatus: string) => {
      if (!bookingDetails.value) return

      // 如果是完成操作，显示上传表单而不是直接更新状态
      if (newStatus === 'Completed') {
        showCompletionForm.value = true
        return
      }

      const confirmMessages = {
        Confirmed: '确认接受此预约吗？',
        InProgress: '确认开始拍摄吗？',
        Cancelled: '确认取消此预约吗？',
      }

      if (!confirm(confirmMessages[newStatus as keyof typeof confirmMessages])) {
        return
      }

      loading.value = true

      try {
        console.log(`正在更新预约 ${bookingId.value} 状态为: ${newStatus}`)
        previousStatus.value = bookingDetails.value.status // 保存前一个状态
        await apiClient.put(`/Booking/${bookingId.value}/status`, { status: newStatus })

        console.log('预约状态更新成功')
        bookingDetails.value.status = newStatus
        alert(`预约状态已成功更新为: ${getStatusText(newStatus)}`)

        // 重新获取最新数据
        await fetchBookingDetails()
      } catch (err) {
        console.error('更新预约状态失败:', err)
        alert('更新预约状态失败，请稍后重试')
      } finally {
        loading.value = false
      }
    }

    // 照片上传相关
    const showCompletionForm = ref(false)
    const fileInput = ref<HTMLInputElement | null>(null)
    const selectedFiles = ref<File[]>([])
    const completionComment = ref('')
    const isPublic = ref(false) // 新增照片公开设置
    const uploadStatus = ref<'idle' | 'uploading' | 'success' | 'error'>('idle')

    // 文件上传相关方法
    const triggerFileInput = () => {
      if (fileInput.value) {
        fileInput.value.click()
      }
    }

    const handleFileSelect = (event: Event) => {
      const target = event.target as HTMLInputElement
      if (target.files && target.files.length > 0) {
        const newFiles = Array.from(target.files)

        // 验证文件类型
        const validFiles = newFiles.filter((file) => validateImageFile(file))

        // 只添加有效文件
        if (validFiles.length > 0) {
          // 确保不超过预约要求的照片数量
          const totalFiles = [...selectedFiles.value, ...validFiles]
          if (totalFiles.length > (bookingDetails.value?.photoCount || 10)) {
            alert(`最多只能上传${bookingDetails.value?.photoCount || 10}张照片`)
            selectedFiles.value = totalFiles.slice(0, bookingDetails.value?.photoCount || 10)
          } else {
            selectedFiles.value = totalFiles
          }
        }

        // 提示如果有无效文件
        if (validFiles.length < newFiles.length) {
          alert('部分文件格式不支持，已过滤。仅支持JPG和PNG格式')
        }

        // 重置input以便下次选择同样的文件
        target.value = ''
      }
    }

    const handleFileDrop = (event: DragEvent) => {
      if (event.dataTransfer?.files && event.dataTransfer.files.length > 0) {
        const newFiles = Array.from(event.dataTransfer.files)

        // 验证文件类型
        const validFiles = newFiles.filter((file) => validateImageFile(file))

        // 只添加有效文件
        if (validFiles.length > 0) {
          // 确保不超过预约要求的照片数量
          const totalFiles = [...selectedFiles.value, ...validFiles]
          if (totalFiles.length > (bookingDetails.value?.photoCount || 10)) {
            alert(`最多只能上传${bookingDetails.value?.photoCount || 10}张照片`)
            selectedFiles.value = totalFiles.slice(0, bookingDetails.value?.photoCount || 10)
          } else {
            selectedFiles.value = totalFiles
          }
        }

        // 提示如果有无效文件
        if (validFiles.length < newFiles.length) {
          alert('部分文件格式不支持，已过滤。仅支持JPG和PNG格式')
        }
      }
    }

    const validateImageFile = (file: File): boolean => {
      const validTypes = ['image/jpeg', 'image/png']
      return validTypes.includes(file.type)
    }

    const removeFile = (index: number) => {
      selectedFiles.value.splice(index, 1)
    }

    // 完成预约并上传照片
    const completeBookingWithPhotos = async () => {
      if (selectedFiles.value.length === 0) {
        alert('请至少上传一张照片')
        return
      }

      try {
        loading.value = true
        uploadStatus.value = 'uploading'

        // 第一步：批量上传照片
        // 创建FormData对象用于提交照片
        const formData = new FormData()

        // 添加请求信息
        formData.append('request.BookingId', bookingId.value)
        formData.append('request.IsPublic', isPublic.value.toString())

        // 添加所有照片文件
        selectedFiles.value.forEach((file) => {
          formData.append('files', file)
        })

        console.log(`正在上传照片，数量: ${selectedFiles.value.length}, 公开: ${isPublic.value}`)

        // 批量上传照片
        const uploadResponse = await apiClient.post('/Photo/batch-upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })

        console.log('照片上传成功:', uploadResponse.data)
        uploadStatus.value = 'success'

        // 第二步：更新预约状态为已完成
        await apiClient.put(`/Booking/${bookingId.value}/status`, {
          status: 'Completed',
          comment: completionComment.value || '拍摄已完成，照片已上传',
        })

        console.log('预约状态已更新为已完成')

        alert('照片上传成功，预约已完成')

        // 更新状态和UI
        showCompletionForm.value = false
        bookingDetails.value.status = 'Completed'

        // 重新获取最新数据
        await fetchBookingDetails()
      } catch (err) {
        console.error('完成预约失败:', err)
        uploadStatus.value = 'error'
        alert('完成预约失败，请稍后重试')
      } finally {
        loading.value = false
      }
    }

    onMounted(() => {
      fetchBookingDetails()
    })

    return {
      bookingDetails,
      loading,
      error,
      isOutdoorShoot,
      canAccept,
      canReject,
      canStartProcess,
      canComplete,
      getStatusClass,
      getStatusText,
      formatDate,
      fetchBookingDetails,
      updateStatus,
      previousStatus,
      showCompletionForm,
      fileInput,
      selectedFiles,
      completionComment,
      triggerFileInput,
      handleFileSelect,
      handleFileDrop,
      removeFile,
      completeBookingWithPhotos,
      isPublic,
      uploadStatus,
    }
  },
})
</script>
