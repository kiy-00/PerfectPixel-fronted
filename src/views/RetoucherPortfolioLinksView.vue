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
                class="w-10 h-10 rounded-full bg-neutral-dark text-white flex items-center justify-center text-lg font-bold"
              >
                1
              </div>
              <span class="mt-2 text-sm text-neutral-dark font-medium">修图师信息</span>
            </div>
            <div class="h-1 flex-1 bg-neutral-dark mx-2"></div>
            <div class="flex flex-col items-center">
              <div
                class="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center text-lg font-bold"
              >
                2
              </div>
              <span class="mt-2 text-sm text-primary font-medium">上传作品集链接</span>
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
          <h2 class="text-xl font-semibold text-neutral-dark mb-6">作品集链接</h2>

          <form @submit.prevent="submitForm">
            <!-- 主要作品集链接 -->
            <div class="mb-6">
              <label for="mainPortfolio" class="block text-neutral-dark mb-2">
                主要作品集链接 <span class="text-error">*</span>
              </label>
              <p class="text-sm text-neutral-dark mb-4">
                请提供您的主要修图作品集网站链接（如个人网站、Behance、500px等）
              </p>
              <div class="flex">
                <div
                  class="w-1/4 bg-neutral-light border border-neutral border-r-0 rounded-l-md px-4 py-2 flex items-center"
                >
                  <span class="text-neutral-dark">网址</span>
                </div>
                <input
                  type="url"
                  id="mainPortfolio"
                  v-model="formData.mainPortfolio"
                  class="w-3/4 px-4 py-2 border border-neutral rounded-r-md focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                  placeholder="https://your-portfolio.com"
                />
              </div>
            </div>

            <!-- 其他链接 -->
            <div class="mb-6">
              <label class="block text-neutral-dark mb-4">其他链接（可选）</label>

              <div v-for="(link, index) in formData.otherLinks" :key="index" class="mb-3">
                <div class="flex">
                  <div
                    class="w-1/4 bg-neutral-light border border-neutral border-r-0 rounded-l-md px-4 py-2 flex items-center"
                  >
                    <span class="text-neutral-dark">链接 {{ index + 1 }}</span>
                  </div>
                  <input
                    type="url"
                    v-model="formData.otherLinks[index]"
                    class="w-3/4 px-4 py-2 border border-neutral rounded-r-md focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="https://... (可选)"
                  />
                </div>
              </div>

              <button
                type="button"
                @click="addLink"
                class="mt-2 px-4 py-2 border border-primary text-primary rounded-md hover:bg-green-light hover:bg-opacity-20 transition-colors"
              >
                <span class="mr-2">+</span>添加更多链接
              </button>
            </div>

            <!-- 作品描述 -->
            <div class="mb-6">
              <label for="portfolioDescription" class="block text-neutral-dark mb-2">
                作品集描述 <span class="text-error">*</span>
              </label>
              <p class="text-sm text-neutral-dark mb-4">请简要描述您的修图风格与特色</p>
              <textarea
                id="portfolioDescription"
                v-model="formData.portfolioDescription"
                rows="4"
                class="w-full px-4 py-2 border border-neutral rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                required
                placeholder="请描述您的修图特色、擅长风格等（200字以内）"
                maxlength="200"
              ></textarea>
              <div class="text-right text-sm text-neutral-dark mt-1">
                {{ formData.portfolioDescription.length }}/200
              </div>
            </div>

            <!-- 导航按钮 -->
            <div class="flex justify-between">
              <router-link
                to="/retoucher-certification"
                class="px-6 py-3 bg-neutral text-neutral-dark rounded-md hover:bg-neutral-light transition-colors font-medium"
              >
                上一步
              </router-link>
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
          <h3 class="font-semibold text-lg text-neutral-dark mb-4">上传说明</h3>
          <ul class="list-disc list-inside space-y-2 text-neutral-dark">
            <li>您的作品集链接是评审团队了解您修图风格的重要途径</li>
            <li>请确保您提供的链接可以正常访问，并且包含足够的作品展示您的技术</li>
            <li>至少需要提供一个主要作品集链接</li>
            <li>第三步将需要您确认所有信息并提交认证申请</li>
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
  name: 'RetoucherPortfolioLinksView',
  setup() {
    const router = useRouter()
    const certStore = useRetoucherCertificationStore()

    const formData = reactive({
      mainPortfolio: certStore.certificationData.mainPortfolio || '',
      otherLinks: [...certStore.certificationData.otherLinks] || [],
      portfolioDescription: certStore.certificationData.portfolioDescription || '',
    })

    const addLink = () => {
      formData.otherLinks.push('')
    }

    const submitForm = () => {
      // 表单验证
      if (!formData.mainPortfolio.trim()) {
        alert('请填写主要作品集链接')
        return
      }

      // 确保是有效的URL
      try {
        new URL(formData.mainPortfolio)
      } catch (e) {
        alert('请提供有效的主要作品集链接')
        return
      }

      // 其他链接如果填写了也需要验证
      for (const [index, link] of formData.otherLinks.entries()) {
        if (link.trim()) {
          try {
            new URL(link)
          } catch (e) {
            alert(`链接 ${index + 1} 格式不正确，请提供有效的URL`)
            return
          }
        }
      }

      if (!formData.portfolioDescription.trim()) {
        alert('请填写作品集描述')
        return
      }

      // 过滤掉空链接
      const filteredLinks = formData.otherLinks.filter((link) => link.trim() !== '')

      certStore.savePortfolioInfo({
        mainPortfolio: formData.mainPortfolio,
        otherLinks: filteredLinks,
        portfolioDescription: formData.portfolioDescription,
      })
      router.push('/retoucher-certification/verification')
    }

    return {
      formData,
      addLink,
      submitForm,
    }
  },
})
</script>
