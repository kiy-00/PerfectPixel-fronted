<template>
  <div class="flex h-screen bg-neutral">
    <!-- 侧边栏 -->
    <SideBar class="hidden md:block" />

    <!-- 主要内容 -->
    <div class="flex-1 flex flex-col overflow-hidden">
      <!-- 页面标题区域 -->
      <div class="bg-primary text-white px-6 py-4 shadow-md">
        <div class="container mx-auto">
          <div class="flex justify-between items-center">
            <div>
              <h1 class="text-2xl font-bold">我的订单</h1>
              <p class="text-sm text-green-light mt-1">查看和管理您的订单</p>
            </div>
          </div>
        </div>
      </div>

      <!-- 滚动内容区域 -->
      <div class="flex-1 overflow-y-auto">
        <div class="container mx-auto px-4 mt-8">
          <div class="bg-white rounded-lg shadow-md">
            <!-- 订单类型选项卡 -->
            <div class="border-b border-neutral">
              <div class="flex overflow-x-auto">
                <button
                  v-for="(tab, index) in filteredTabs"
                  :key="index"
                  @click="activeTab = tab.value"
                  :class="[
                    'px-6 py-4 font-medium whitespace-nowrap',
                    activeTab === tab.value
                      ? 'text-primary border-b-2 border-primary'
                      : 'text-neutral-dark hover:text-primary',
                  ]"
                >
                  {{ tab.label }}
                  <span
                    v-if="tab.count !== undefined"
                    class="ml-2 px-2 py-1 text-xs rounded-full bg-neutral-light text-neutral-dark"
                    >{{ tab.count }}</span
                  >
                </button>
              </div>
            </div>

            <!-- 订单内容区域 -->
            <div class="p-6">
              <!-- 加载状态 -->
              <div v-if="loading" class="flex justify-center py-12">
                <div class="text-center">
                  <div
                    class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"
                  ></div>
                  <p class="mt-4 text-neutral-dark">正在加载订单数据...</p>
                </div>
              </div>

              <!-- 错误状态 -->
              <div v-else-if="error" class="py-12 text-center">
                <div class="text-error text-lg mb-3">加载失败</div>
                <p class="text-neutral-dark mb-6">{{ error }}</p>
                <button
                  @click="fetchOrders"
                  class="px-4 py-2 bg-primary text-white rounded-md hover:bg-green-dark transition-colors"
                >
                  重新加载
                </button>
              </div>

              <!-- 我发布的修图订单 -->
              <div v-else-if="activeTab === 'retouch-orders-placed'">
                <div v-if="retouchOrdersPlaced.length > 0">
                  <div class="overflow-x-auto">
                    <table class="min-w-full divide-y divide-neutral">
                      <thead>
                        <tr>
                          <th
                            class="px-6 py-3 text-left text-xs font-medium text-neutral-dark uppercase tracking-wider"
                          >
                            订单号
                          </th>
                          <th
                            class="px-6 py-3 text-left text-xs font-medium text-neutral-dark uppercase tracking-wider"
                          >
                            修图师
                          </th>
                          <th
                            class="px-6 py-3 text-left text-xs font-medium text-neutral-dark uppercase tracking-wider"
                          >
                            创建日期
                          </th>
                          <th
                            class="px-6 py-3 text-left text-xs font-medium text-neutral-dark uppercase tracking-wider"
                          >
                            金额
                          </th>
                          <th
                            class="px-6 py-3 text-left text-xs font-medium text-neutral-dark uppercase tracking-wider"
                          >
                            状态
                          </th>
                          <th
                            class="px-6 py-3 text-left text-xs font-medium text-neutral-dark uppercase tracking-wider"
                          >
                            支付状态
                          </th>
                          <th
                            class="px-6 py-3 text-left text-xs font-medium text-neutral-dark uppercase tracking-wider"
                          >
                            操作
                          </th>
                        </tr>
                      </thead>
                      <tbody class="bg-white divide-y divide-neutral">
                        <tr v-for="order in retouchOrdersPlaced" :key="order.orderId">
                          <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-primary">
                            {{ order.orderId }}
                          </td>
                          <td class="px-6 py-4 whitespace-nowrap text-sm text-neutral-dark">
                            {{ order.retoucherName }}
                          </td>
                          <td class="px-6 py-4 whitespace-nowrap text-sm text-neutral-dark">
                            {{ formatDate(order.createdAt) }}
                          </td>
                          <td class="px-6 py-4 whitespace-nowrap text-sm text-neutral-dark">
                            ¥{{ order.price }}
                          </td>
                          <td class="px-6 py-4 whitespace-nowrap">
                            <span
                              :class="[
                                'px-2 py-1 text-xs rounded-full',
                                getStatusClass(order.status),
                              ]"
                            >
                              {{ getStatusText(order.status) }}
                            </span>
                          </td>
                          <td class="px-6 py-4 whitespace-nowrap">
                            <button
                              v-if="order.status === 'Completed' && !order.isPaid"
                              @click="openPaymentModal('RetouchOrder', order.orderId, order.price)"
                              class="px-2 py-1 bg-primary text-white text-xs rounded hover:bg-green-dark transition-colors"
                            >
                              去支付
                            </button>
                            <span v-else-if="order.isPaid" class="text-sm text-green-600"
                              >已支付</span
                            >
                            <span v-else class="text-sm text-neutral-dark">-</span>
                          </td>
                          <td class="px-6 py-4 whitespace-nowrap text-sm text-neutral-dark">
                            <button
                              @click="viewOrderDetails(order.orderId)"
                              class="text-primary hover:text-green-dark"
                            >
                              查看详情
                            </button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                <div v-else class="text-center py-12">
                  <div class="text-neutral-dark mb-4">您还没有发布任何修图订单</div>
                  <router-link
                    to="/retouch-service"
                    class="px-6 py-2 bg-primary text-white rounded-md hover:bg-green-dark transition-colors"
                  >
                    去寻找修图师
                  </router-link>
                </div>
              </div>

              <!-- 我发布的摄影预约 -->
              <div v-else-if="activeTab === 'photography-orders-placed'">
                <div v-if="photographyOrdersPlaced.length > 0">
                  <div class="overflow-x-auto">
                    <table class="min-w-full divide-y divide-neutral">
                      <thead>
                        <tr>
                          <th
                            class="px-6 py-3 text-left text-xs font-medium text-neutral-dark uppercase tracking-wider"
                          >
                            预约号
                          </th>
                          <th
                            class="px-6 py-3 text-left text-xs font-medium text-neutral-dark uppercase tracking-wider"
                          >
                            摄影师
                          </th>
                          <th
                            class="px-6 py-3 text-left text-xs font-medium text-neutral-dark uppercase tracking-wider"
                          >
                            预约日期
                          </th>
                          <th
                            class="px-6 py-3 text-left text-xs font-medium text-neutral-dark uppercase tracking-wider"
                          >
                            金额
                          </th>
                          <th
                            class="px-6 py-3 text-left text-xs font-medium text-neutral-dark uppercase tracking-wider"
                          >
                            状态
                          </th>
                          <th
                            class="px-6 py-3 text-left text-xs font-medium text-neutral-dark uppercase tracking-wider"
                          >
                            支付状态
                          </th>
                          <th
                            class="px-6 py-3 text-left text-xs font-medium text-neutral-dark uppercase tracking-wider"
                          >
                            操作
                          </th>
                        </tr>
                      </thead>
                      <tbody class="bg-white divide-y divide-neutral">
                        <tr v-for="booking in photographyOrdersPlaced" :key="booking.bookingId">
                          <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-primary">
                            {{ booking.bookingId }}
                          </td>
                          <td class="px-6 py-4 whitespace-nowrap text-sm text-neutral-dark">
                            {{ booking.photographerName }}
                          </td>
                          <td class="px-6 py-4 whitespace-nowrap text-sm text-neutral-dark">
                            {{ formatDate(booking.bookingDate) }}
                          </td>
                          <td class="px-6 py-4 whitespace-nowrap text-sm text-neutral-dark">
                            ¥{{ booking.initialAmount }}
                          </td>
                          <td class="px-6 py-4 whitespace-nowrap">
                            <span
                              :class="[
                                'px-2 py-1 text-xs rounded-full',
                                getStatusClass(booking.status),
                              ]"
                            >
                              {{ getStatusText(booking.status) }}
                            </span>
                          </td>
                          <td class="px-6 py-4 whitespace-nowrap">
                            <button
                              v-if="booking.status === 'Completed' && !booking.isPaid"
                              @click="
                                openPaymentModal(
                                  'Booking',
                                  booking.bookingId,
                                  booking.initialAmount,
                                )
                              "
                              class="px-2 py-1 bg-primary text-white text-xs rounded hover:bg-green-dark transition-colors"
                            >
                              去支付
                            </button>
                            <span v-else-if="booking.isPaid" class="text-sm text-green-600"
                              >已支付</span
                            >
                            <span v-else class="text-sm text-neutral-dark">-</span>
                          </td>
                          <td class="px-6 py-4 whitespace-nowrap text-sm text-neutral-dark">
                            <button
                              @click="viewBookingDetails(booking.bookingId)"
                              class="text-primary hover:text-green-dark"
                            >
                              查看详情
                            </button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                <div v-else class="text-center py-12">
                  <div class="text-neutral-dark mb-4">您还没有发布任何摄影预约</div>
                  <router-link
                    to="/photography-service"
                    class="px-6 py-2 bg-primary text-white rounded-md hover:bg-green-dark transition-colors"
                  >
                    去寻找摄影师
                  </router-link>
                </div>
              </div>

              <!-- 我收到的修图订单 -->
              <div v-else-if="activeTab === 'retouch-orders-received'">
                <div v-if="isRetoucher">
                  <div v-if="retouchOrdersReceived.length > 0">
                    <div class="overflow-x-auto">
                      <table class="min-w-full divide-y divide-neutral">
                        <thead>
                          <tr>
                            <th
                              class="px-6 py-3 text-left text-xs font-medium text-primary uppercase tracking-wider"
                            >
                              订单号
                            </th>
                            <th
                              class="px-6 py-3 text-left text-xs font-medium text-neutral-dark uppercase tracking-wider"
                            >
                              客户
                            </th>
                            <th
                              class="px-6 py-3 text-left text-xs font-medium text-neutral-dark uppercase tracking-wider"
                            >
                              创建日期
                            </th>
                            <th
                              class="px-6 py-3 text-left text-xs font-medium text-neutral-dark uppercase tracking-wider"
                            >
                              金额
                            </th>
                            <th
                              class="px-6 py-3 text-left text-xs font-medium text-neutral-dark uppercase tracking-wider"
                            >
                              状态
                            </th>
                            <th
                              class="px-6 py-3 text-left text-xs font-medium text-neutral-dark uppercase tracking-wider"
                            >
                              支付状态
                            </th>
                            <th
                              class="px-6 py-3 text-left text-xs font-medium text-neutral-dark uppercase tracking-wider"
                            >
                              操作
                            </th>
                          </tr>
                        </thead>
                        <tbody class="bg-white divide-y divide-neutral">
                          <tr v-for="order in retouchOrdersReceived" :key="order.orderId">
                            <td
                              class="px-6 py-4 whitespace-nowrap text-sm font-medium text-primary"
                            >
                              {{ order.orderId }}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-neutral-dark">
                              {{ order.username }}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-neutral-dark">
                              {{ formatDate(order.createdAt) }}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-neutral-dark">
                              ¥{{ order.price }}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                              <span
                                :class="[
                                  'px-2 py-1 text-xs rounded-full',
                                  getStatusClass(order.status),
                                ]"
                              >
                                {{ getStatusText(order.status) }}
                              </span>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                              <span v-if="order.isPaid" class="text-sm text-green-600">已支付</span>
                              <span
                                v-else-if="order.status === 'Completed'"
                                class="text-sm text-yellow-600"
                                >等待支付</span
                              >
                              <span v-else class="text-sm text-neutral-dark">-</span>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-neutral-dark">
                              <button
                                @click="processOrder(order.orderId)"
                                class="text-primary hover:text-green-dark"
                              >
                                处理订单
                              </button>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <div v-else class="text-center py-12">
                    <div class="text-neutral-dark mb-4">您还没有收到任何修图订单</div>
                    <p class="text-sm text-neutral-dark">
                      完善您的修图师资料，提高曝光度，获得更多订单
                    </p>
                  </div>
                </div>
                <div v-else class="text-center py-12">
                  <div class="text-neutral-dark text-lg mb-3">您还不是认证修图师</div>
                  <p class="text-sm text-neutral-dark mb-6">
                    成为认证修图师可以接受修图订单，获得专业收入
                  </p>
                  <router-link
                    to="/retoucher-certification"
                    class="px-6 py-3 bg-primary text-white rounded-md hover:bg-green-dark transition-colors"
                  >
                    去认证修图师
                  </router-link>
                </div>
              </div>

              <!-- 我收到的摄影预约 -->
              <div v-else-if="activeTab === 'photography-orders-received'">
                <div v-if="isPhotographer">
                  <div v-if="photographyOrdersReceived.length > 0">
                    <div class="overflow-x-auto">
                      <table class="min-w-full divide-y divide-neutral">
                        <thead>
                          <tr>
                            <th
                              class="px-6 py-3 text-left text-xs font-medium text-neutral-dark uppercase tracking-wider"
                            >
                              预约号
                            </th>
                            <th
                              class="px-6 py-3 text-left text-xs font-medium text-neutral-dark uppercase tracking-wider"
                            >
                              客户
                            </th>
                            <th
                              class="px-6 py-3 text-left text-xs font-medium text-neutral-dark uppercase tracking-wider"
                            >
                              预约日期
                            </th>
                            <th
                              class="px-6 py-3 text-left text-xs font-medium text-neutral-dark uppercase tracking-wider"
                            >
                              金额
                            </th>
                            <th
                              class="px-6 py-3 text-left text-xs font-medium text-neutral-dark uppercase tracking-wider"
                            >
                              状态
                            </th>
                            <th
                              class="px-6 py-3 text-left text-xs font-medium text-neutral-dark uppercase tracking-wider"
                            >
                              支付状态
                            </th>
                            <th
                              class="px-6 py-3 text-left text-xs font-medium text-neutral-dark uppercase tracking-wider"
                            >
                              操作
                            </th>
                          </tr>
                        </thead>
                        <tbody class="bg-white divide-y divide-neutral">
                          <tr v-for="booking in photographyOrdersReceived" :key="booking.bookingId">
                            <td
                              class="px-6 py-4 whitespace-nowrap text-sm font-medium text-primary"
                            >
                              {{ booking.bookingId }}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-neutral-dark">
                              {{ booking.username }}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-neutral-dark">
                              {{ formatDate(booking.bookingDate) }}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-neutral-dark">
                              ¥{{ booking.initialAmount }}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                              <span
                                :class="[
                                  'px-2 py-1 text-xs rounded-full',
                                  getStatusClass(booking.status),
                                ]"
                              >
                                {{ getStatusText(booking.status) }}
                              </span>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                              <span v-if="booking.isPaid" class="text-sm text-green-600"
                                >已支付</span
                              >
                              <span
                                v-else-if="booking.status === 'Completed'"
                                class="text-sm text-yellow-600"
                                >等待支付</span
                              >
                              <span v-else class="text-sm text-neutral-dark">-</span>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-neutral-dark">
                              <button
                                @click="processOrder(booking.bookingId)"
                                class="text-primary hover:text-green-dark"
                              >
                                处理预约
                              </button>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <div v-else class="text-center py-12">
                    <div class="text-neutral-dark mb-4">您还没有收到任何摄影预约</div>
                    <p class="text-sm text-neutral-dark">
                      完善您的摄影师资料，提高曝光度，获得更多预约
                    </p>
                  </div>
                </div>
                <div v-else class="text-center py-12">
                  <div class="text-neutral-dark text-lg mb-3">您还不是认证摄影师</div>
                  <p class="text-sm text-neutral-dark mb-6">
                    成为认证摄影师可以接受摄影预约，获得专业收入
                  </p>
                  <router-link
                    to="/photographer-certification"
                    class="px-6 py-3 bg-primary text-white rounded-md hover:bg-green-dark transition-colors"
                  >
                    去认证摄影师
                  </router-link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- 支付方式选择模态框 -->
  <div
    v-if="showPaymentModal"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
  >
    <div class="bg-white rounded-lg p-6 w-full max-w-md">
      <h3 class="text-lg font-semibold text-neutral-dark mb-4">选择支付方式</h3>

      <!-- 订单信息 -->
      <div class="mb-6 p-4 bg-neutral-light bg-opacity-50 rounded-md">
        <div class="flex justify-between mb-2">
          <span class="text-neutral-dark">订单类型：</span>
          <span class="font-medium">{{
            paymentDetails.orderType === 'Booking' ? '摄影预约' : '修图订单'
          }}</span>
        </div>
        <div class="flex justify-between mb-2">
          <span class="text-neutral-dark">订单编号：</span>
          <span class="font-medium">{{ paymentDetails.orderId }}</span>
        </div>
        <div class="flex justify-between">
          <span class="text-neutral-dark">支付金额：</span>
          <span class="font-medium text-primary">¥{{ paymentDetails.amount }}</span>
        </div>
      </div>

      <!-- 支付方式选择 -->
      <div class="mb-6">
        <div class="text-sm text-neutral-dark mb-2">请选择支付方式：</div>
        <div class="grid grid-cols-2 gap-3">
          <button
            v-for="method in paymentMethods"
            :key="method.value"
            @click="selectPaymentMethod(method.value)"
            :class="[
              'flex items-center justify-center p-3 border rounded-md',
              selectedPaymentMethod === method.value
                ? 'border-primary bg-green-50'
                : 'border-neutral hover:border-primary',
            ]"
          >
            <span class="mr-2">{{ method.icon }}</span>
            <span>{{ method.label }}</span>
          </button>
        </div>
      </div>

      <!-- 操作按钮 -->
      <div class="flex justify-end space-x-3">
        <button
          @click="closePaymentModal"
          class="px-4 py-2 border border-neutral text-neutral-dark rounded-md hover:bg-neutral-light transition-colors"
        >
          取消
        </button>
        <button
          @click="createPayment"
          :disabled="!selectedPaymentMethod || isProcessingPayment"
          :class="[
            'px-4 py-2 rounded-md transition-colors',
            selectedPaymentMethod && !isProcessingPayment
              ? 'bg-primary text-white hover:bg-green-dark'
              : 'bg-neutral-light text-neutral-dark cursor-not-allowed',
          ]"
        >
          <span v-if="isProcessingPayment">处理中...</span>
          <span v-else>确认支付</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from 'vue'
import { useUserStore } from '../stores/userStore'
import { useRouter } from 'vue-router'
import apiClient from '../services/apiService'
import SideBar from '../components/SideBar.vue'

interface OrderTab {
  label: string
  value: string
  count?: number
}

export default defineComponent({
  name: 'MyOrdersView',
  components: {
    SideBar,
  },
  setup() {
    const router = useRouter()
    const userStore = useUserStore()
    const loading = ref(false)
    const error = ref('')
    const activeTab = ref('retouch-orders-placed')

    // 用户角色
    const isRetoucher = computed(() => userStore.isRetoucher)
    const isPhotographer = computed(() => userStore.isPhotographer)

    // 订单数据
    const retouchOrdersPlaced = ref<any[]>([])
    const photographyOrdersPlaced = ref<any[]>([])
    const retouchOrdersReceived = ref<any[]>([])
    const photographyOrdersReceived = ref<any[]>([])

    // 标签页定义
    const allTabs = ref<OrderTab[]>([
      { label: '我的修图订单', value: 'retouch-orders-placed' },
      { label: '我的摄影预约', value: 'photography-orders-placed' },
      { label: '我收到的修图订单', value: 'retouch-orders-received' },
      { label: '我收到的摄影预约', value: 'photography-orders-received' },
    ])

    // 根据用户角色过滤标签页
    const filteredTabs = computed(() => {
      // 基本标签对所有用户可见
      const tabs = [
        allTabs.value[0], // 我的修图订单
        allTabs.value[1], // 我的摄影预约
      ]

      // 根据用户角色添加额外标签
      if (isRetoucher.value) {
        tabs.push({ ...allTabs.value[2] }) // 使用展开运算符创建副本，避免引用问题
      }

      if (isPhotographer.value) {
        tabs.push({ ...allTabs.value[3] }) // 使用展开运算符创建副本，避免引用问题
      }

      return tabs
    })

    // 获取订单状态对应的CSS类
    const getStatusClass = (status: string): string => {
      switch (status) {
        case 'Pending':
          return 'bg-yellow-100 text-yellow-800'
        case 'Processing':
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
        case 'Processing':
          return '处理中'
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

    // 获取所有订单数据
    const fetchOrders = async () => {
      loading.value = true
      error.value = ''

      try {
        // 获取修图订单
        console.log('正在获取用户修图订单...')
        try {
          const retouchOrderResponse = await apiClient.get('/RetouchOrder/user')
          retouchOrdersPlaced.value = retouchOrderResponse.data
          console.log(
            `获取到${retouchOrdersPlaced.value.length}条修图订单:`,
            retouchOrdersPlaced.value,
          )
          allTabs.value[0].count = retouchOrdersPlaced.value.length

          // 获取每个修图订单的支付状态
          await Promise.all(
            retouchOrdersPlaced.value.map((order) =>
              fetchOrderPaymentStatus('RetouchOrder', order.orderId, order),
            ),
          )
        } catch (err) {
          console.error('获取修图订单失败:', err)
          retouchOrdersPlaced.value = []
          allTabs.value[0].count = 0
        }

        // 获取摄影预约
        console.log('正在获取用户摄影预约...')
        try {
          const bookingResponse = await apiClient.get('/Booking/user')
          photographyOrdersPlaced.value = bookingResponse.data
          console.log(
            `获取到${photographyOrdersPlaced.value.length}条摄影预约:`,
            photographyOrdersPlaced.value,
          )
          allTabs.value[1].count = photographyOrdersPlaced.value.length

          // 获取每个摄影预约的支付状态
          await Promise.all(
            photographyOrdersPlaced.value.map((booking) =>
              fetchOrderPaymentStatus('Booking', booking.bookingId, booking),
            ),
          )
        } catch (err) {
          console.error('获取摄影预约失败:', err)
          photographyOrdersPlaced.value = []
          allTabs.value[1].count = 0
        }

        // 如果用户是修图师，获取收到的修图订单
        if (userStore.isRetoucher) {
          console.log('当前用户是修图师，正在获取收到的修图订单...')
          try {
            const retoucherOrderResponse = await apiClient.get('/RetouchOrder/retoucher')
            retouchOrdersReceived.value = retoucherOrderResponse.data
            console.log(
              `获取到${retouchOrdersReceived.value.length}条收到的修图订单:`,
              retouchOrdersReceived.value,
            )
            allTabs.value[2].count = retouchOrdersReceived.value.length

            // 获取每个收到的修图订单的支付状态
            await Promise.all(
              retouchOrdersReceived.value.map((order) =>
                fetchOrderPaymentStatus('RetouchOrder', order.orderId, order),
              ),
            )
          } catch (err) {
            console.error('获取修图师收到的订单失败:', err)
            retouchOrdersReceived.value = []
            allTabs.value[2].count = 0
          }
        }

        // 如果用户是摄影师，获取收到的摄影预约
        if (userStore.isPhotographer) {
          console.log('当前用户是摄影师，正在获取收到的摄影预约...')
          try {
            const photographerBookingResponse = await apiClient.get('/Booking/photographer')
            photographyOrdersReceived.value = photographerBookingResponse.data
            console.log(
              `获取到${photographyOrdersReceived.value.length}条收到的摄影预约:`,
              photographyOrdersReceived.value,
            )
            allTabs.value[3].count = photographyOrdersReceived.value.length

            // 获取每个收到的摄影预约的支付状态
            await Promise.all(
              photographyOrdersReceived.value.map((booking) =>
                fetchOrderPaymentStatus('Booking', booking.bookingId, booking),
              ),
            )
          } catch (err) {
            console.error('获取摄影师收到的预约失败:', err)
            photographyOrdersReceived.value = []
            allTabs.value[3].count = 0
          }
        }
      } catch (err: any) {
        console.error('获取订单数据失败:', err)
        error.value = '获取订单数据失败，请稍后再试'
      } finally {
        loading.value = false
      }
    }

    // 获取单个订单的支付状态
    const fetchOrderPaymentStatus = async (orderType: string, orderId: number, orderObj: any) => {
      try {
        const response = await apiClient.get(`/Payment/order/${orderType}/${orderId}`)
        const payments = response.data

        // 检查是否有已完成的支付
        const hasCompletedPayment = payments.some((payment: any) => payment.status === 'Completed')

        // 更新订单对象的支付状态
        orderObj.isPaid = hasCompletedPayment

        return hasCompletedPayment
      } catch (err) {
        console.error(`获取订单 ${orderType}/${orderId} 的支付状态失败:`, err)
        // 默认为未支付
        orderObj.isPaid = false
        return false
      }
    }

    // 查看订单详情
    const viewOrderDetails = (orderId: string) => {
      router.push(`/retouch-order/${orderId}`)
    }

    // 查看摄影预约详情
    const viewBookingDetails = (bookingId: string) => {
      router.push(`/photography-booking/${bookingId}`)
    }

    // 处理订单（修图师/摄影师视角）
    const processOrder = (orderId: string) => {
      // 针对修图订单和摄影预约使用不同的路由
      if (activeTab.value === 'retouch-orders-received') {
        router.push(`/retouch-order-process/${orderId}`)
      } else if (activeTab.value === 'photography-orders-received') {
        // 对于摄影预约，使用专门的处理路由
        router.push(`/photography-booking-process/${orderId}`)
      } else {
        router.push(`/order-process/${orderId}`) // 原有的通用路径，后续可以改为摄影专用
      }
    }

    // 支付相关
    const showPaymentModal = ref(false)
    const selectedPaymentMethod = ref('')
    const isProcessingPayment = ref(false)
    const paymentDetails = ref({
      orderType: '',
      orderId: 0,
      amount: 0,
    })

    // 支付方式列表
    const paymentMethods = [
      { value: 'Wechat', label: '微信支付', icon: '📱' },
      { value: 'Alipay', label: '支付宝', icon: '💰' },
      { value: 'BankTransfer', label: '银行转账', icon: '🏦' },
      { value: 'CreditCard', label: '信用卡', icon: '💳' },
    ]

    // 打开支付模态框
    const openPaymentModal = (orderType: string, orderId: number, amount: number) => {
      paymentDetails.value = {
        orderType,
        orderId,
        amount,
      }
      selectedPaymentMethod.value = ''
      showPaymentModal.value = true
    }

    // 关闭支付模态框
    const closePaymentModal = () => {
      showPaymentModal.value = false
    }

    // 选择支付方式
    const selectPaymentMethod = (method: string) => {
      selectedPaymentMethod.value = method
    }

    // 创建支付记录
    const createPayment = async () => {
      if (!selectedPaymentMethod.value) {
        alert('请选择支付方式')
        return
      }

      try {
        isProcessingPayment.value = true

        // 构建请求体
        const paymentData = {
          orderType: paymentDetails.value.orderType,
          orderId: paymentDetails.value.orderId,
          paymentMethod: selectedPaymentMethod.value,
        }

        console.log('创建支付记录，参数:', paymentData)

        // 步骤1: 调用API创建支付
        const response = await apiClient.post('/Payment', paymentData)
        console.log('支付记录创建成功:', response.data)

        // 获取支付ID
        const paymentId = response.data.paymentId

        // 步骤2: 自动将支付状态更新为已完成（课程演示用）
        // 生成模拟的交易ID
        const mockTransactionId = `TX-${Date.now()}-${Math.floor(Math.random() * 1000)}`

        // 调用支付状态更新API
        const updateResponse = await apiClient.put(`/Payment/${paymentId}/status`, {
          status: 'Completed',
          transactionId: mockTransactionId,
        })

        console.log('支付状态已更新为已完成:', updateResponse.data)

        // 关闭模态框
        closePaymentModal()

        // 显示成功消息
        alert(`支付成功！交易编号: ${mockTransactionId}`)

        // 重新加载订单数据以更新支付状态
        await fetchOrders()
      } catch (err) {
        console.error('支付处理失败:', err)
        alert('支付失败，请稍后重试')
      } finally {
        isProcessingPayment.value = false
      }
    }

    // 组件挂载时获取订单数据
    onMounted(async () => {
      loading.value = true

      try {
        // 尝试恢复用户会话，而不是立即检查用户是否已登录
        // userStore.initializeUser() 会尝试从本地存储加载用户信息
        const userLoaded = await userStore.initializeUser()

        if (userLoaded) {
          // 用户已登录，获取订单数据
          await fetchOrders()
        } else if (!userStore.isAuthenticated) {
          // 只有在确认用户未登录后才重定向到登录页
          router.push('/login')
        }
      } catch (error) {
        console.error('初始化用户信息失败:', error)
      } finally {
        loading.value = false
      }
    })

    return {
      loading,
      error,
      activeTab,
      filteredTabs,
      isRetoucher,
      isPhotographer,
      retouchOrdersPlaced,
      photographyOrdersPlaced,
      retouchOrdersReceived,
      photographyOrdersReceived,
      getStatusClass,
      getStatusText,
      formatDate,
      fetchOrders,
      fetchOrderPaymentStatus,
      viewOrderDetails,
      viewBookingDetails,
      processOrder,
      showPaymentModal,
      selectedPaymentMethod,
      isProcessingPayment,
      paymentDetails,
      paymentMethods,
      openPaymentModal,
      closePaymentModal,
      selectPaymentMethod,
      createPayment,
    }
  },
})
</script>
