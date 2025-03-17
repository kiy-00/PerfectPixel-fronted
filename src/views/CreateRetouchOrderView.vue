<template>
  <div class="bg-neutral min-h-screen pb-10">
    <!-- 页面标题区域 -->
    <div class="bg-primary text-white px-6 py-4 shadow-md">
      <div class="container mx-auto">
        <div class="flex justify-between items-center">
          <div>
            <h1 class="text-2xl font-bold">创建修图订单</h1>
            <p class="text-sm text-green-light mt-1">
              填写您的修图需求，帮助修图师更好地理解您的期望
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
                class="w-10 h-10 rounded-full bg-neutral-dark text-white flex items-center justify-center text-lg font-bold"
              >
                1
              </div>
              <span class="mt-2 text-sm text-neutral-dark font-medium">上传照片</span>
            </div>
            <div class="h-1 flex-1 bg-primary mx-2"></div>
            <div class="flex flex-col items-center">
              <div
                class="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center text-lg font-bold"
              >
                2
              </div>
              <span class="mt-2 text-sm text-primary font-medium">填写要求</span>
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

        <!-- 照片预览 -->
        <div class="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 class="text-xl font-semibold text-neutral-dark mb-4">照片预览</h2>
          <div class="flex justify-center">
            <!-- 显示上一步上传的临时照片 -->
            <div v-if="photoUrl" class="max-w-md w-full">
              <div class="flex flex-col">
                <img :src="photoUrl" class="rounded-lg w-full max-h-64 object-contain" />
                <div class="mt-4">
                  <h3 class="font-semibold text-neutral-dark">{{ photoTitle }}</h3>
                  <p class="text-sm text-neutral-dark mt-1">{{ photoDescription }}</p>
                  <p class="text-xs text-neutral-dark mt-2">临时照片ID: {{ photoId }}</p>
                </div>
              </div>
            </div>
            <!-- 如果没有照片数据，显示占位符 -->
            <div
              v-else
              class="w-full max-w-md h-64 bg-neutral bg-opacity-20 rounded-lg flex items-center justify-center"
            >
              <p class="text-neutral-dark">照片预览（无法获取照片数据，请返回上一步）</p>
            </div>
          </div>
        </div>

        <!-- 订单表单 -->
        <div class="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 class="text-xl font-semibold text-neutral-dark mb-6">修图要求</h2>

          <form @submit.prevent="submitForm">
            <!-- 具体要求描述 -->
            <div class="mb-6">
              <label for="requirements" class="block text-neutral-dark mb-2">
                具体要求描述 <span class="text-error">*</span>
              </label>
              <textarea
                id="requirements"
                v-model="orderForm.requirements"
                rows="5"
                class="w-full px-4 py-2 border border-neutral rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="请详细描述您的修图需求，例如：修饰皮肤，调整光影，调整色调等"
                required
              ></textarea>
              <p class="text-sm text-neutral-dark mt-1">请至少填写 20 个字符</p>
            </div>

            <!-- 按钮区域 -->
            <div class="flex justify-between items-center">
              <button
                type="button"
                @click="$router.go(-1)"
                class="px-6 py-3 bg-neutral text-neutral-dark rounded-md hover:bg-neutral-light transition-colors font-medium"
              >
                上一步
              </button>
              <button
                type="submit"
                class="px-6 py-3 bg-primary text-white rounded-md hover:bg-green-dark transition-colors font-medium"
              >
                下一步
              </button>
            </div>
          </form>
        </div>

        <!-- 订单说明 -->
        <div class="bg-white rounded-lg shadow-md p-6">
          <h3 class="font-semibold text-lg text-neutral-dark mb-4">订单说明</h3>
          <ul class="list-disc list-inside space-y-2 text-neutral-dark">
            <li>请尽量详细描述您的具体要求，以便修图师准确理解您的需求</li>
            <li>您可以描述期望的修图效果、色调风格、需要修饰的具体部位等</li>
            <li>若有特殊需求或急需作品，修图师会通过系统消息与您联系</li>
            <li>标准交付时间为3-5个工作日</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

export default defineComponent({
  name: 'CreateRetouchOrderView',
  setup() {
    const router = useRouter()
    const route = useRoute()

    // 从URL获取参数
    const retoucherId = Number(route.query.retoucherId)
    const photoId = route.query.photoId as string
    const photoUrl = route.query.photoUrl as string
    // 解码从URL获取的标题和描述
    const photoTitle = ref(decodeURIComponent((route.query.photoTitle as string) || ''))
    const photoDescription = ref(decodeURIComponent((route.query.photoDescription as string) || ''))

    console.log('加载照片信息:', {
      retoucherId,
      photoId,
      photoUrl,
      photoTitle: photoTitle.value,
      photoDescription: photoDescription.value,
    })

    // 检查是否有所有必要的参数
    if (!retoucherId || !photoId || !photoUrl) {
      console.error('缺少必要参数:', { retoucherId, photoId, photoUrl })
    }

    // 订单表单数据 - 简化版
    const orderForm = ref({
      requirements: '',
    })

    // 从本地存储读取之前可能保存的订单数据
    onMounted(() => {
      try {
        const savedFormData = localStorage.getItem('retouch-order-form-data')
        if (savedFormData) {
          const parsedData = JSON.parse(savedFormData)
          // 只有当photoId匹配时才恢复数据
          if (parsedData.photoId === photoId) {
            orderForm.value.requirements = parsedData.requirements || ''
            console.log('从本地存储恢复订单表单数据:', parsedData)
          } else {
            console.log('本地存储的订单数据与当前照片不匹配，不恢复')
          }
        }
      } catch (error) {
        console.error('恢复表单数据失败:', error)
      }
    })

    // 表单提交
    const submitForm = () => {
      // 表单验证
      if (!orderForm.value.requirements || orderForm.value.requirements.length < 20) {
        alert('请至少填写20个字符的具体要求描述')
        return
      }

      // 保存表单数据到本地存储
      localStorage.setItem(
        'retouch-order-form-data',
        JSON.stringify({
          photoId,
          requirements: orderForm.value.requirements,
          savedAt: new Date().toISOString(),
        }),
      )
      console.log('保存订单表单数据到本地存储')

      // 从URL参数中获取returnTo，如果存在则传递下去
      const returnTo = route.query.returnTo as string

      // 构建订单信息对象
      const orderInfo = {
        retoucherId,
        photoId,
        requirements: orderForm.value.requirements,
        // 传递照片信息
        photoUrl,
        photoTitle: photoTitle.value,
        photoDescription: photoDescription.value,
      }

      console.log('导航到确认页，传递订单信息:', orderInfo)

      // 导航到确认页面，传递订单信息
      const query: any = {
        orderInfo: JSON.stringify(orderInfo),
      }

      // 如果有returnTo参数，传递下去
      if (returnTo) {
        query.returnTo = returnTo
      }

      router.push({
        path: '/retouch-order-confirm',
        query,
      })
    }

    return {
      photoUrl,
      photoId,
      photoTitle,
      photoDescription,
      orderForm,
      submitForm,
    }
  },
})
</script>
