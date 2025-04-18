<template>
  <div class="bg-neutral min-h-screen pb-10">
    <!-- 页面标题区域 -->
    <div class="bg-primary text-white px-6 py-4 shadow-md">
      <div class="container mx-auto">
        <div class="flex justify-between items-center">
          <div>
            <h1 class="text-2xl font-bold">修图师认证</h1>
            <p class="text-sm text-green-light mt-1">
              完成认证后可以展示您的修图作品集，接受修图订单，获得专业收入
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
              <span class="mt-2 text-sm text-primary font-medium">修图师信息</span>
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
          <h2 class="text-xl font-semibold text-neutral-dark mb-6">修图师信息</h2>

          <form @submit.prevent="submitForm">
            <!-- 经验程度 -->
            <div class="mb-6">
              <label class="block text-neutral-dark mb-2">
                修图经验 <span class="text-error">*</span>
              </label>
              <div class="grid grid-cols-2 gap-3 text-primary">
                <div
                  v-for="option in experienceOptions"
                  :key="option.value"
                  :class="[
                    'border rounded-md px-4 py-3 cursor-pointer flex items-center justify-between',
                    formData.experience === option.value
                      ? 'border-primary bg-green-light bg-opacity-20'
                      : 'border-neutral hover:border-primary',
                  ]"
                  @click="formData.experience = option.value"
                >
                  <span>{{ option.label }}</span>
                  <input
                    type="radio"
                    :id="option.value"
                    :value="option.value"
                    v-model="formData.experience"
                    class="ml-2"
                  />
                </div>
              </div>
            </div>

            <!-- 修图技术 -->
            <div class="mb-6">
              <label for="techniques" class="block text-neutral-dark mb-2">
                修图技术 <span class="text-error">*</span>
              </label>
              <textarea
                id="techniques"
                v-model="formData.techniques"
                rows="2"
                class="w-full px-4 py-2 border border-neutral rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                required
                placeholder="请描述您使用的软件、插件等"
              ></textarea>
            </div>

            <!-- 城市 -->
            <div class="mb-6">
              <label for="city" class="block text-neutral-dark mb-2">
                所在城市 <span class="text-error">*</span>
              </label>
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
              <label class="block text-neutral-dark mb-2">
                擅长领域 <span class="text-error">*</span>
              </label>
              <div class="grid grid-cols-2 sm:grid-cols-3 gap-3 text-primary">
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
              <label for="bio" class="block text-neutral-dark mb-2">
                个人简介 <span class="text-error">*</span>
              </label>
              <textarea
                id="bio"
                v-model="formData.bio"
                rows="5"
                class="w-full px-4 py-2 border border-neutral rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                required
                placeholder="请描述您的修图经验、风格特点等"
              ></textarea>
            </div>

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
            <li>请确保提交的专业信息真实准确，以便我们更好地了解您的修图风格</li>
            <li>作品集链接将在第二步提供，请确保您有可分享的作品集网站或社交媒体账号</li>
            <li>第三步将需要您确认所有信息并提交认证申请</li>
            <li>认证通过后，您将获得修图师专属标识，可以接受平台用户的修图订单</li>
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
import { defineComponent, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useRetoucherCertificationStore } from '../stores/retoucherCertificationStore'

export default defineComponent({
  name: 'RetoucherCertificationView',
  setup() {
    const router = useRouter()
    const certStore = useRetoucherCertificationStore()

    // 经验选项
    const experienceOptions = [
      { label: '入门级（1年以下）', value: 'beginner' },
      { label: '进阶级（1-3年）', value: 'intermediate' },
      { label: '专业级（3-5年）', value: 'advanced' },
      { label: '资深级（5年以上）', value: 'expert' },
    ]

    const formData = reactive({
      experience: certStore.certificationData.experience || 'beginner',
      techniques: certStore.certificationData.techniques || '',
      city: certStore.certificationData.city || '',
      specialties: [...certStore.certificationData.specialties] || [],
      bio: certStore.certificationData.bio || '',
    })

    // 擅长领域选项
    const specialtyFields = [
      { label: '人像精修', value: 'portraitRetouch' },
      { label: '商业精修', value: 'commercialRetouch' },
      { label: '风景精修', value: 'landscapeRetouch' },
      { label: '时尚精修', value: 'fashionRetouch' },
      { label: '产品精修', value: 'productRetouch' },
      { label: '婚礼精修', value: 'weddingRetouch' },
      { label: '美食精修', value: 'foodRetouch' },
      { label: '建筑精修', value: 'architectureRetouch' },
      { label: '皮肤修饰', value: 'skinRetouch' },
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

    const submitForm = () => {
      // 表单验证
      if (!formData.experience) {
        alert('请选择修图经验')
        return
      }

      if (!formData.techniques.trim()) {
        alert('请填写修图技术')
        return
      }

      if (!formData.city.trim()) {
        alert('请填写所在城市')
        return
      }

      if (formData.specialties.length === 0) {
        alert('请至少选择一个擅长领域')
        return
      }

      if (!formData.bio.trim()) {
        alert('请填写个人简介')
        return
      }

      // 保存数据到store
      certStore.saveBasicInfo({
        experience: formData.experience,
        techniques: formData.techniques,
        city: formData.city,
        specialties: formData.specialties,
        bio: formData.bio,
      })

      // 导航到作品集链接页面
      router.push('/retoucher-certification/portfolio-links')
    }

    return {
      formData,
      experienceOptions,
      specialtyFields,
      toggleSpecialty,
      submitForm,
    }
  },
})
</script>
