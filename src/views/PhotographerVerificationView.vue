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
                class="w-10 h-10 rounded-full bg-neutral-dark text-white flex items-center justify-center text-lg font-bold"
              >
                1
              </div>
              <span class="mt-2 text-sm text-neutral-dark font-medium">摄影师信息</span>
            </div>
            <div class="h-1 flex-1 bg-neutral-dark mx-2"></div>
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
                class="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center text-lg font-bold"
              >
                3
              </div>
              <span class="mt-2 text-sm text-primary font-medium">提交审核</span>
            </div>
          </div>
        </div>

        <!-- 信息确认区域 -->
        <div class="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 class="text-xl font-semibold text-neutral-dark mb-6">信息确认</h2>

          <div class="bg-neutral-light p-4 rounded-md mb-6">
            <p class="text-neutral-dark">
              请确认您所填写的信息是否正确。提交后，我们的审核团队将在3个工作日内完成审核。
            </p>
          </div>

          <div class="mb-8">
            <h3 class="font-semibold text-neutral-dark mb-3">摄影师基本信息</h3>
            <div class="border border-neutral rounded-md divide-y divide-neutral">
              <div class="flex p-4">
                <div class="w-1/3 text-neutral-dark font-medium">摄影经验</div>
                <div class="w-2/3 text-neutral-dark">
                  {{ getExperienceText(photographerInfo.experience) }}
                </div>
              </div>
              <div class="flex p-4">
                <div class="w-1/3 text-neutral-dark font-medium">摄影设备</div>
                <div class="w-2/3 text-neutral-dark">{{ photographerInfo.equipment }}</div>
              </div>
              <div class="flex p-4">
                <div class="w-1/3 text-neutral-dark font-medium">所在城市</div>
                <div class="w-2/3 text-neutral-dark">{{ photographerInfo.city }}</div>
              </div>
              <div class="flex p-4">
                <div class="w-1/3 text-neutral-dark font-medium">擅长领域</div>
                <div class="w-2/3 text-neutral-dark">
                  <span
                    v-for="(specialty, index) in getSpecialtyLabels(photographerInfo.specialties)"
                    :key="index"
                    class="inline-block px-2 py-1 bg-green-light bg-opacity-20 text-primary rounded-md mr-2 mb-2"
                  >
                    {{ specialty }}
                  </span>
                </div>
              </div>
              <div class="flex p-4">
                <div class="w-1/3 text-neutral-dark font-medium">个人简介</div>
                <div class="w-2/3 text-neutral-dark">{{ photographerInfo.bio }}</div>
              </div>
            </div>
          </div>

          <div class="mb-8">
            <h3 class="font-semibold text-neutral-dark mb-3">作品集信息</h3>
            <div class="border border-neutral rounded-md divide-y divide-neutral">
              <div class="flex p-4">
                <div class="w-1/3 text-neutral-dark font-medium">主要作品集</div>
                <div class="w-2/3 text-neutral-dark">
                  <a
                    :href="portfolioInfo.mainPortfolio"
                    target="_blank"
                    class="text-primary hover:underline"
                  >
                    {{ portfolioInfo.mainPortfolio }}
                  </a>
                </div>
              </div>
              <div class="flex p-4" v-if="portfolioInfo.instagram">
                <div class="w-1/3 text-neutral-dark font-medium">Instagram</div>
                <div class="w-2/3 text-neutral-dark">
                  <a
                    :href="portfolioInfo.instagram"
                    target="_blank"
                    class="text-primary hover:underline"
                  >
                    {{ portfolioInfo.instagram }}
                  </a>
                </div>
              </div>
              <div class="flex p-4" v-if="portfolioInfo.flickr">
                <div class="w-1/3 text-neutral-dark font-medium">Flickr</div>
                <div class="w-2/3 text-neutral-dark">
                  <a
                    :href="portfolioInfo.flickr"
                    target="_blank"
                    class="text-primary hover:underline"
                  >
                    {{ portfolioInfo.flickr }}
                  </a>
                </div>
              </div>
              <div class="flex p-4" v-if="portfolioInfo.fivehundredpx">
                <div class="w-1/3 text-neutral-dark font-medium">500px</div>
                <div class="w-2/3 text-neutral-dark">
                  <a
                    :href="portfolioInfo.fivehundredpx"
                    target="_blank"
                    class="text-primary hover:underline"
                  >
                    {{ portfolioInfo.fivehundredpx }}
                  </a>
                </div>
              </div>
              <div class="flex p-4" v-if="portfolioInfo.weibo">
                <div class="w-1/3 text-neutral-dark font-medium">微博</div>
                <div class="w-2/3 text-neutral-dark">
                  <a
                    :href="portfolioInfo.weibo"
                    target="_blank"
                    class="text-primary hover:underline"
                  >
                    {{ portfolioInfo.weibo }}
                  </a>
                </div>
              </div>
              <div class="flex p-4">
                <div class="w-1/3 text-neutral-dark font-medium">作品集描述</div>
                <div class="w-2/3 text-neutral-dark">{{ portfolioInfo.portfolioDescription }}</div>
              </div>
            </div>
          </div>

          <!-- 确认勾选 -->
          <div class="mb-6">
            <label class="flex items-center cursor-pointer">
              <input type="checkbox" v-model="isConfirmed" class="mr-2" />
              <span class="text-neutral-dark"
                >我确认所提交的信息真实有效，并同意平台对我的作品进行展示和推广</span
              >
            </label>
          </div>

          <!-- 操作按钮 -->
          <div class="flex justify-between">
            <router-link
              to="/photographer-certification/portfolio-links"
              class="px-6 py-3 bg-neutral text-neutral-dark rounded-md hover:bg-neutral-light transition-colors font-medium"
            >
              上一步
            </router-link>
            <button
              @click="submitApplication"
              :disabled="!isConfirmed"
              :class="[
                'px-6 py-3 rounded-md font-medium transition-colors',
                isConfirmed
                  ? 'bg-primary text-white hover:bg-green-dark'
                  : 'bg-neutral-light text-neutral-dark cursor-not-allowed',
              ]"
            >
              提交申请
            </button>
          </div>
        </div>

        <!-- 申请说明 -->
        <div class="bg-white rounded-lg shadow-md p-6">
          <h3 class="font-semibold text-lg text-neutral-dark mb-4">审核流程说明</h3>
          <ul class="list-disc list-inside space-y-2 text-neutral-dark">
            <li>
              申请提交后，我们将在<span class="text-primary font-medium">3个工作日内</span>完成审核
            </li>
            <li>审核结果将通过平台消息和邮件通知您</li>
            <li>审核通过后，您的摄影师主页将自动生成，您可以立即接单</li>
            <li>若审核未通过，我们会详细说明原因，您可以根据建议修改后重新提交</li>
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
  name: 'PhotographerVerificationView',
  setup() {
    const router = useRouter()
    const userStore = useUserStore()
    const isConfirmed = ref(false)
    const isSubmitting = ref(false)

    // 摄影师基本信息（实际项目中应从store获取或API请求）
    const photographerInfo = reactive({
      experience: 'advanced',
      equipment: 'Canon EOS R5, 24-70mm f/2.8, 70-200mm f/2.8',
      city: '上海',
      specialties: ['portrait', 'wedding', 'street'],
      bio: '专注人像摄影5年，擅长自然光与情绪表达，曾为多个品牌拍摄广告与产品图。',
    })

    // 作品集信息（实际项目中应从store获取或API请求）
    const portfolioInfo = reactive({
      mainPortfolio: 'https://portfolio.example.com/photos',
      instagram: 'https://instagram.com/photographer',
      flickr: '',
      fivehundredpx: 'https://500px.com/photographer',
      weibo: 'https://weibo.com/photographer',
      portfolioDescription:
        '我的作品风格注重光影与氛围的营造，擅长捕捉瞬间情绪和细节，希望通过影像传递温暖与力量。',
    })

    // 获取经验等级对应的文字
    const getExperienceText = (experience: string) => {
      const experienceMap: Record<string, string> = {
        beginner: '入门级（1年以下）',
        intermediate: '进阶级（1-3年）',
        advanced: '专业级（3-5年）',
        expert: '资深级（5年以上）',
      }
      return experienceMap[experience] || experience
    }

    // 获取擅长领域对应的标签文字
    const getSpecialtyLabels = (specialties: string[]) => {
      const specialtyMap: Record<string, string> = {
        portrait: '人像摄影',
        wedding: '婚礼摄影',
        landscape: '风景摄影',
        street: '街拍',
        product: '产品摄影',
        event: '活动摄影',
        architecture: '建筑摄影',
        fashion: '时尚摄影',
        food: '美食摄影',
      }
      return specialties.map((code) => specialtyMap[code] || code)
    }

    // 提交申请
    const submitApplication = async () => {
      if (!isConfirmed.value || isSubmitting.value) return

      isSubmitting.value = true
      try {
        // 这里应该有实际的API调用
        console.log('提交摄影师认证申请:', {
          photographer: photographerInfo,
          portfolio: portfolioInfo,
        })

        // 模拟API调用
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // 提交成功后跳转到成功页面
        router.push('/profile?certificationSubmitted=1')
      } catch (error) {
        console.error('提交申请失败:', error)
        alert('提交申请失败，请稍后重试')
      } finally {
        isSubmitting.value = false
      }
    }

    return {
      isConfirmed,
      isSubmitting,
      photographerInfo,
      portfolioInfo,
      getExperienceText,
      getSpecialtyLabels,
      submitApplication,
    }
  },
})
</script>
