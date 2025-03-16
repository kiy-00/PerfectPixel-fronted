<template>
  <div class="bg-neutral min-h-screen pb-10">
    <!-- 页面标题区域 -->
    <div class="bg-primary text-white px-6 py-4 shadow-md">
      <div class="container mx-auto">
        <div class="flex justify-between items-center">
          <div>
            <h1 class="text-2xl font-bold">确认订单</h1>
            <p class="text-sm text-green-light mt-1">确认您的修图订单信息，提交后将通知修图师</p>
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
                class="w-10 h-10 rounded-full bg-neutral-dark text-white flex items-center justify-center text-lg font-bold"
              >
                1
              </div>
              <span class="mt-2 text-sm text-neutral-dark font-medium">上传照片</span>
            </div>
            <div class="h-1 flex-1 bg-neutral-dark mx-2"></div>
            <div class="flex flex-col items-center">
              <div
                class="w-10 h-10 rounded-full bg-neutral-dark text-white flex items-center justify-center text-lg font-bold"
              >
                2
              </div>
              <span class="mt-2 text-sm text-neutral-dark font-medium">填写要求</span>
            </div>
            <div class="h-1 flex-1 bg-primary mx-2"></div>
            <div class="flex flex-col items-center">
              <div
                class="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center text-lg font-bold"
              >
                3
              </div>
              <span class="mt-2 text-sm text-primary font-medium">确认订单</span>
            </div>
          </div>
        </div>

        <!-- 订单信息确认区域 -->
        <div class="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 class="text-xl font-semibold text-neutral-dark mb-6">订单确认</h2>

          <div class="mb-8">
            <h3 class="font-semibold text-neutral-dark mb-3">订单信息</h3>
            <div class="border border-neutral rounded-md divide-y divide-neutral">
              <div class="flex p-4">
                <div class="w-1/3 text-neutral-dark font-medium">照片数量</div>
                <div class="w-2/3 text-neutral-dark">1 张</div>
              </div>
              <div class="flex p-4">
                <div class="w-1/3 text-neutral-dark font-medium">具体要求</div>
                <div class="w-2/3 text-neutral-dark">{{ orderInfo.requirements }}</div>
              </div>
            </div>
          </div>

          <!-- 价格详情 -->
          <div class="mb-8">
            <h3 class="font-semibold text-neutral-dark mb-3">价格详情</h3>
            <div class="bg-neutral-light p-4 rounded-md">
              <div class="flex justify-between mb-2">
                <span class="text-neutral-dark">基础费用</span>
                <span class="font-medium">¥{{ orderInfo.price }}</span>
              </div>
              <div class="border-t border-neutral my-2"></div>
              <div class="flex justify-between font-bold text-lg">
                <span class="text-neutral-dark">总计</span>
                <span class="text-primary">¥{{ orderInfo.price }}</span>
              </div>
            </div>
          </div>

          <!-- 照片预览 -->
          <div class="mb-8">
            <h3 class="font-semibold text-neutral-dark mb-3">照片预览</h3>
            <div v-if="orderInfo.photoUrl" class="flex justify-center">
              <div class="max-w-md w-full">
                <img :src="orderInfo.photoUrl" class="w-full rounded-lg object-contain max-h-64" />
                <div class="mt-2">
                  <h4 class="font-medium text-neutral-dark">{{ orderInfo.photoTitle }}</h4>
                  <p class="text-sm text-neutral-dark">{{ orderInfo.photoDescription }}</p>
                  <div class="mt-2 text-xs text-neutral-dark">
                    临时照片ID: {{ orderInfo.photoId }}
                  </div>
                </div>
              </div>
            </div>
            <div v-else class="flex justify-center">
              <div
                class="w-full max-w-md h-64 bg-neutral bg-opacity-20 rounded-lg flex items-center justify-center"
              >
                <p class="text-neutral-dark">无法预览照片，请返回上一步</p>
              </div>
            </div>
          </div>

          <!-- 确认勾选 -->
          <div class="mb-6">
            <label class="flex items-center cursor-pointer">
              <input type="checkbox" v-model="isConfirmed" class="mr-2" />
              <span class="text-neutral-dark">我确认以上信息准确无误，并同意平台的服务条款</span>
            </label>
          </div>

          <!-- 操作按钮 -->
          <div class="flex justify-between">
            <button
              @click="$router.go(-1)"
              class="px-6 py-3 bg-neutral text-neutral-dark rounded-md hover:bg-neutral-light transition-colors font-medium"
            >
              返回修改
            </button>
            <button
              @click="submitOrder"
              :disabled="!isConfirmed || isSubmitting"
              :class="[
                'px-6 py-3 rounded-md font-medium transition-colors',
                isConfirmed && !isSubmitting
                  ? 'bg-primary text-white hover:bg-green-dark'
                  : 'bg-neutral-light text-neutral-dark cursor-not-allowed',
              ]"
            >
              {{ isSubmitting ? '提交中...' : '确认提交订单' }}
            </button>
          </div>
        </div>

        <!-- 订单提交说明 -->
        <div class="bg-white rounded-lg shadow-md p-6">
          <h3 class="font-semibold text-lg text-neutral-dark mb-4">订单说明</h3>
          <ul class="list-disc list-inside space-y-2 text-neutral-dark">
            <li>提交订单后，系统将通知修图师进行处理</li>
            <li>修图师将在3-5个工作日内完成修图</li>
            <li>您可以在"我的订单"中查看订单状态和与修图师沟通</li>
            <li>如对修图结果不满意，可在收到成品后3天内申请修改</li>
            <li>
              如有问题，请联系客服：<span class="text-primary">support@perfectpixel.com</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import apiClient from '../services/apiService'

export default defineComponent({
  name: 'RetouchOrderConfirmView',
  setup() {
    const router = useRouter()
    const route = useRoute()

    const isConfirmed = ref(false)
    const isSubmitting = ref(false)
    const debugLogs = ref<string[]>([]) // 用于记录调试信息

    // 添加调试日志
    const addDebugLog = (message: string, data?: any) => {
      const timestamp = new Date().toISOString()
      const logEntry = `${timestamp}: ${message}` + (data ? ` - ${JSON.stringify(data)}` : '')
      debugLogs.value.push(logEntry)
      console.log(logEntry)
    }

    // 处理从路由获取的订单信息
    const orderInfo = ref({
      retoucherId: 0,
      photoId: '',
      requirements: '',
      photoUrl: '',
      photoTitle: '',
      photoDescription: '',
      price: 50,
    })

    // 从URL查询参数获取订单信息
    onMounted(() => {
      try {
        addDebugLog('开始加载订单信息')
        const orderInfoStr = route.query.orderInfo as string
        if (orderInfoStr) {
          orderInfo.value = JSON.parse(orderInfoStr)
          addDebugLog('成功解析订单信息', {
            retoucherId: orderInfo.value.retoucherId,
            photoId: orderInfo.value.photoId,
            // 将长字段截断
            requirements: orderInfo.value.requirements?.substring(0, 50) + '...',
            photoTitle: orderInfo.value.photoTitle,
          })
        } else {
          addDebugLog('URL中没有找到订单信息')
        }
      } catch (error) {
        addDebugLog('解析订单信息失败', error)
        // 如果解析失败，返回上一步
        router.go(-1)
      }
    })

    // 提交订单 - 简化版本，不再转换临时照片
    const submitOrder = async () => {
      if (!isConfirmed.value || isSubmitting.value) return

      isSubmitting.value = true
      addDebugLog('开始提交订单')

      try {
        // 直接创建修图订单，使用之前上传的photoId
        addDebugLog('正在创建修图订单', {
          retoucherId: orderInfo.value.retoucherId,
          photoId: orderInfo.value.photoId,
        })

        const orderResponse = await apiClient.post('/RetouchOrder', {
          retoucherId: orderInfo.value.retoucherId,
          photoId: orderInfo.value.photoId,
          requirements: orderInfo.value.requirements,
        })

        addDebugLog('订单创建成功', {
          orderId: orderResponse.data.orderId,
        })

        // 清理本地存储
        localStorage.removeItem('retouch-order-form-data')
        localStorage.removeItem('perfectpixel-photo')

        addDebugLog('本地缓存已清理')

        // 跳转到成功页面
        router.push({
          path: '/order-success',
          query: {
            orderId: orderResponse.data.orderId,
          },
        })
      } catch (error) {
        console.error('订单提交失败:', error)
        addDebugLog('订单提交失败', error)
        alert('订单提交失败，请稍后重试')
      } finally {
        isSubmitting.value = false
      }
    }

    return {
      orderInfo,
      isConfirmed,
      isSubmitting,
      submitOrder,
      debugLogs,
    }
  },
})
</script>
