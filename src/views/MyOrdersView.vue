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
                            操作
                          </th>
                        </tr>
                      </thead>
                      <tbody class="bg-white divide-y divide-neutral">
                        <tr v-for="order in photographyOrdersPlaced" :key="order.id">
                          <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-primary">
                            {{ order.orderNumber }}
                          </td>
                          <td class="px-6 py-4 whitespace-nowrap text-sm text-neutral-dark">
                            {{ order.photographerName }}
                          </td>
                          <td class="px-6 py-4 whitespace-nowrap text-sm text-neutral-dark">
                            {{ formatDate(order.appointmentDate) }}
                          </td>
                          <td class="px-6 py-4 whitespace-nowrap text-sm text-neutral-dark">
                            ¥{{ order.amount }}
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
                          <td class="px-6 py-4 whitespace-nowrap text-sm text-neutral-dark">
                            <button
                              @click="viewOrderDetails(order.id)"
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
                    to="/photographers"
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
                              操作
                            </th>
                          </tr>
                        </thead>
                        <tbody class="bg-white divide-y divide-neutral">
                          <tr v-for="order in photographyOrdersReceived" :key="order.id">
                            <td
                              class="px-6 py-4 whitespace-nowrap text-sm font-medium text-primary"
                            >
                              {{ order.orderNumber }}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-neutral-dark">
                              {{ order.customerName }}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-neutral-dark">
                              {{ formatDate(order.appointmentDate) }}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-neutral-dark">
                              ¥{{ order.amount }}
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
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-neutral-dark">
                              <button
                                @click="processOrder(order.id)"
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
      const tabs = [...allTabs.value.slice(0, 2)] // 前两个标签对所有用户可见

      // 如果是修图师，添加"我收到的修图订单"标签
      if (isRetoucher.value) {
        tabs.push(allTabs.value[2])
      }

      // 如果是摄影师，添加"我收到的摄影预约"标签
      if (isPhotographer.value) {
        tabs.push(allTabs.value[3])
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
        // 获取修图订单 - 使用正确的API端点
        console.log('正在获取用户修图订单...')
        const retouchOrderResponse = await apiClient.get('/RetouchOrder/user')

        // 保存获取到的订单数据
        retouchOrdersPlaced.value = retouchOrderResponse.data
        console.log(
          `获取到${retouchOrdersPlaced.value.length}条修图订单:`,
          retouchOrdersPlaced.value,
        )

        // 如果用户是修图师，获取收到的修图订单
        if (isRetoucher.value) {
          console.log('当前用户是修图师，正在获取收到的修图订单...')
          try {
            const retoucherOrderResponse = await apiClient.get('/RetouchOrder/retoucher')
            retouchOrdersReceived.value = retoucherOrderResponse.data
            console.log(
              `获取到${retouchOrdersReceived.value.length}条收到的修图订单:`,
              retouchOrdersReceived.value,
            )
            allTabs.value[2].count = retouchOrdersReceived.value.length
          } catch (err) {
            console.error('获取修图师收到的订单失败:', err)
            retouchOrdersReceived.value = []
            allTabs.value[2].count = 0
          }
        }

        // 暂时清空其他类型的订单列表 - 后续可以根据实际API添加
        photographyOrdersPlaced.value = []
        photographyOrdersReceived.value = []

        // 更新标签页计数
        allTabs.value[0].count = retouchOrdersPlaced.value.length
        allTabs.value[1].count = 0 // 暂无摄影预约数据

        if (isRetoucher.value) {
          allTabs.value[2].count = retouchOrdersReceived.value.length
        }

        if (isPhotographer.value) {
          allTabs.value[3].count = 0 // 暂无收到的摄影预约数据
        }
      } catch (err: any) {
        console.error('获取订单数据失败:', err)
        error.value = '获取订单数据失败，请稍后再试'
      } finally {
        loading.value = false
      }
    }

    // 查看订单详情
    const viewOrderDetails = (orderId: string) => {
      router.push(`/retouch-order/${orderId}`)
    }

    // 处理订单（修图师/摄影师视角）
    const processOrder = (orderId: string) => {
      // 针对修图订单和摄影预约使用不同的路由
      if (activeTab.value === 'retouch-orders-received') {
        router.push(`/retouch-order-process/${orderId}`)
      } else {
        router.push(`/order-process/${orderId}`) // 原有的通用路径，后续可以改为摄影专用
      }
    }

    // 组件挂载时获取订单数据
    onMounted(() => {
      fetchOrders()
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
      viewOrderDetails,
      processOrder,
    }
  },
})
</script>
