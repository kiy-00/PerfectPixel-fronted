<template>
  <div class="bg-neutral min-h-screen pb-10">
    <!-- 页面标题区域 -->
    <div class="bg-primary text-white px-6 py-4 shadow-md">
      <div class="container mx-auto">
        <div class="flex justify-between items-center">
          <div>
            <h1 class="text-2xl font-bold">摄影师认证</h1>
            <p class="text-sm text-green-light mt-1">
              完成认证后可以展示您的摄影作品集，接受约拍邀请，获得专业收入
            </p>
          </div>
          <router-link
            to="/profile"
            class="px-4 py-2 bg-white text-primary rounded-md hover:bg-green-light transition-colors"
          >
            返回个人资料
          </router-link>
        </div>
      </div>
    </div>

    <!-- 主要内容区域 -->
    <div class="container mx-auto px-4 mt-8">
      <div class="max-w-3xl mx-auto">
        <!-- 认证步骤指示器 -->
        <div class="bg-white rounded-lg shadow-md p-6 mb-6">
          <div class="flex items-center justify-between">
            <div class="flex flex-col items-center">
              <div
                class="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center text-lg font-bold"
              >
                1
              </div>
              <span class="mt-2 text-sm text-primary font-medium">摄影师信息</span>
            </div>
            <div class="h-1 flex-1 bg-primary mx-2"></div>
            <div class="flex flex-col items-center">
              <div
                class="w-10 h-10 rounded-full bg-neutral-dark text-white flex items-center justify-center text-lg font-bold"
              >
                2
              </div>
              <span class="mt-2 text-sm text-neutral-dark font-medium">上传作品集链接</span>
            </div>
            <div class="h-1 flex-1 bg-neutral-dark mx-2"></div>
            <div class="flex flex-col items-center">
              <div
                class="w-10 h-10 rounded-full bg-neutral-dark text-white flex items-center justify-center text-lg font-bold"
              >
                3
              </div>
              <span class="mt-2 text-sm text-neutral-dark font-medium">提交审核</span>
            </div>
          </div>
        </div>

        <!-- 表单区域 -->
        <div class="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 class="text-xl font-semibold text-neutral-dark mb-6">摄影师信息</h2>

          <form @submit.prevent="submitForm">
            <!-- 姓名 -->
            <div class="mb-6">
              <label for="fullName" class="block text-neutral-dark mb-2"
                >真实姓名 <span class="text-error">*</span></label
              >
              <input
                type="text"
                id="fullName"
                v-model="formData.fullName"
                class="w-full px-4 py-2 border border-neutral rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                required
                placeholder="请输入您的真实姓名"
              />
            </div>

            <!-- 电话号码 -->
            <div class="mb-6">
              <label for="phone" class="block text-neutral-dark mb-2"
                >联系电话 <span class="text-error">*</span></label
              >
              <input
                type="tel"
                id="phone"
                v-model="formData.phone"
                class="w-full px-4 py-2 border border-neutral rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                required
                placeholder="请输入您的联系电话"
              />
            </div>

            <!-- 城市 -->
            <div class="mb-6">
              <label for="city" class="block text-neutral-dark mb-2"
                >所在城市 <span class="text-error">*</span></label
              >
              <input
                type="text"
                id="city"
                v-model="formData.city"
                class="w-full px-4 py-2 border border-neutral rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                required
                placeholder="请输入您的所在城市"
              />
            </div>

            <!-- 擅长领域 -->
            <div class="mb-6">
              <label class="block text-neutral-dark mb-2"
                >擅长领域 <span class="text-error">*</span></label
              >
              <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div
                  v-for="field in specialtyFields"
                  :key="field.value"
                  :class="[
                    'border rounded-md px-4 py-3 cursor-pointer flex items-center',
                    formData.specialties.includes(field.value)
                      ? 'border-primary bg-green-light bg-opacity-20'
                      : 'border-neutral hover:border-primary',
                  ]"
                  @click="toggleSpecialty(field.value)"
                >
                  <input
                    type="checkbox"
                    :id="field.value"
                    :value="field.value"
                    v-model="formData.specialties"
                    class="mr-2"
                  />
                  <label :for="field.value" class="cursor-pointer flex-grow">{{
                    field.label
                  }}</label>
                </div>
              </div>
            </div>

            <!-- 个人简介 -->
            <div class="mb-6">
              <label for="bio" class="block text-neutral-dark mb-2"
                >个人简介 <span class="text-error">*</span></label
              >
              <textarea
                id="bio"
                v-model="formData.bio"
                rows="5"
                class="w-full px-4 py-2 border border-neutral rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                required
                placeholder="请描述您的摄影经验、风格特点等"
              ></textarea>
            </div>

            <!-- 移除作品集链接部分 -->

            <!-- 提交按钮 -->
            <div class="flex justify-end">
              <button
                type="submit"
                class="px-6 py-3 bg-primary text-white rounded-md hover:bg-green-dark transition-colors font-medium"
              >
                下一步
              </button>
            </div>
          </form>
        </div>

        <!-- 申请说明 -->
        <div class="bg-white rounded-lg shadow-md p-6">
          <h3 class="font-semibold text-lg text-neutral-dark mb-4">申请须知</h3>
          <ul class="list-disc list-inside space-y-2 text-neutral-dark">
            <li>请确保提交的专业信息真实准确，以便我们更好地了解您的摄影风格</li>
            <li>作品集链接将在第二步提供，请确保您有可分享的作品集网站或社交媒体账号</li>
            <li>第三步将需要您提供更详细的拍摄风格和约拍价格等信息</li>
            <li>认证通过后，您将获得摄影师专属标识，可以接受平台用户的约拍邀请</li>
            <li>
              如有疑问，请联系客服：<span class="text-primary">support@perfectpixel.com</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/userStore'

export default defineComponent({
  name: 'PhotographerCertificationView',
  setup() {
    const router = useRouter()
    const userStore = useUserStore()

    // 表单数据
    const formData = reactive({
      experience: '',
      equipment: '',
      city: '',
      specialties: [] as string[],
      bio: '',
    })

    // 擅长领域选项
    const specialtyFields = [
      { label: '人像摄影', value: 'portrait' },
      { label: '婚礼摄影', value: 'wedding' },
      { label: '风景摄影', value: 'landscape' },
      { label: '街拍', value: 'street' },
      { label: '产品摄影', value: 'product' },
      { label: '活动摄影', value: 'event' },
      { label: '建筑摄影', value: 'architecture' },
      { label: '时尚摄影', value: 'fashion' },
      { label: '美食摄影', value: 'food' },
    ]

    // 切换擅长领域选择
    const toggleSpecialty = (value: string) => {
      const index = formData.specialties.indexOf(value)
      if (index === -1) {
        formData.specialties.push(value)
      } else {
        formData.specialties.splice(index, 1)
      }
    }

    // 移除了身份证上传相关函数

    // 提交表单
    const submitForm = () => {
      // 这里可以添加表单验证逻辑
      if (formData.specialties.length === 0) {
        alert('请至少选择一个擅长领域')
        return
      }

      // TODO: 提交表单数据到后端API
      console.log('提交的表单数据:', formData)

      // 导航到上传作品集链接页面
      router.push('/photographer-certification/portfolio-links')
    }

    return {
      formData,
      specialtyFields,
      toggleSpecialty,
      submitForm,
    }
  },
})
</script>
