<template>
  <div class="bg-neutral min-h-screen pb-10">
    <!-- 顶部导航和标题 -->
    <div class="bg-primary text-white px-6 py-4 shadow-md">
      <div class="container mx-auto">
        <div class="flex justify-between items-center">
          <div>
            <h1 class="text-2xl font-bold">创建修图作品集</h1>
            <p class="text-sm text-green-light mt-1">添加新的修图作品集，展示您的专业修图技能</p>
          </div>
          <router-link
            to="/portfolio"
            class="px-4 py-2 bg-white text-primary rounded-md hover:bg-green-light transition-colors"
          >
            返回作品集
          </router-link>
        </div>
      </div>
    </div>

    <div class="container mx-auto px-4 mt-8">
      <div class="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
        <!-- 错误提示 -->
        <div v-if="error" class="mb-6 p-4 bg-error bg-opacity-10 border border-error rounded-md">
          <p class="text-error">{{ error }}</p>
        </div>

        <!-- 第一步：创建作品集基本信息 -->
        <form @submit.prevent="handleSubmit" class="space-y-6" v-if="!isSuccess">
          <h2 class="text-lg font-medium text-primary">步骤1：创建作品集基本信息</h2>

          <!-- 作品集标题 -->
          <div>
            <label for="title" class="block text-sm font-medium text-neutral-dark"
              >作品集标题 <span class="text-error">*</span></label
            >
            <input
              type="text"
              id="title"
              v-model="formData.title"
              class="mt-1 block w-full rounded-md border border-neutral bg-white py-2 px-3 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="例如：时尚人像修图"
              required
            />
          </div>

          <!-- 作品集描述 -->
          <div>
            <label for="description" class="block text-sm font-medium text-neutral-dark"
              >作品集描述 <span class="text-error">*</span></label
            >
            <textarea
              id="description"
              v-model="formData.description"
              rows="3"
              class="mt-1 block w-full rounded-md border border-neutral bg-white py-2 px-3 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="描述这个作品集的特点和风格..."
              required
            ></textarea>
          </div>

          <!-- 作品集分类 -->
          <div>
            <label for="category" class="block text-sm font-medium text-neutral-dark"
              >作品集分类 <span class="text-error">*</span></label
            >
            <select
              id="category"
              v-model="formData.categoryDisplay"
              class="mt-1 block w-full rounded-md border border-neutral bg-white py-2 px-3 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              required
            >
              <option value="" disabled>请选择分类</option>
              <option v-for="category in categories" :key="category.value" :value="category.label">
                {{ category.label }}
              </option>
            </select>
            <p class="text-xs text-neutral-dark mt-1">请选择一个与您作品内容最匹配的分类</p>
          </div>

          <!-- 是否公开 -->
          <div class="flex items-start">
            <div class="flex items-center h-5">
              <input
                id="isPublic"
                type="checkbox"
                v-model="formData.isPublic"
                class="h-4 w-4 rounded border-neutral text-primary focus:ring-primary"
              />
            </div>
            <div class="ml-3 text-sm">
              <label for="isPublic" class="font-medium text-neutral-dark">公开作品集</label>
              <p class="text-neutral-dark">公开的作品集将在您的个人主页和搜索结果中显示</p>
            </div>
          </div>

          <!-- 提交按钮 -->
          <div class="flex justify-end space-x-3">
            <router-link
              to="/portfolio"
              class="px-4 py-2 border border-neutral-dark text-neutral-dark rounded-md hover:bg-neutral hover:bg-opacity-10 transition-colors"
            >
              取消
            </router-link>
            <button
              type="submit"
              class="px-6 py-2 bg-primary text-white rounded-md hover:bg-green-dark transition-colors disabled:bg-neutral disabled:cursor-not-allowed"
              :disabled="isLoading"
            >
              <span v-if="isLoading">创建中...</span>
              <span v-else>创建作品集</span>
            </button>
          </div>
        </form>

        <!-- 第二步：上传封面图片（创建成功后显示） -->
        <div v-if="isSuccess && createdPortfolioId" class="space-y-6">
          <div class="mb-6 p-4 bg-primary bg-opacity-10 border border-primary rounded-md">
            <p class="text-primary font-medium">作品集已创建成功！现在您可以添加封面图片</p>
          </div>

          <h2 class="text-lg font-medium text-primary">步骤2：上传作品集封面</h2>

          <form @submit.prevent="uploadCoverImage" class="space-y-6">
            <!-- 封面图片上传区域 -->
            <div>
              <label class="block text-sm font-medium text-neutral-dark"
                >作品集封面图片 <span class="text-error">*</span></label
              >
              <div
                class="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-neutral border-dashed rounded-md"
              >
                <div class="space-y-1 text-center">
                  <div v-if="previewImage" class="mb-4">
                    <img :src="previewImage" alt="预览图" class="mx-auto h-32 object-cover" />
                  </div>
                  <div v-else class="flex justify-center">
                    <svg
                      class="mx-auto h-12 w-12 text-neutral-dark"
                      stroke="currentColor"
                      fill="none"
                      viewBox="0 0 48 48"
                    >
                      <path
                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                  </div>
                  <div class="flex text-sm text-neutral-dark justify-center">
                    <label
                      for="file-upload"
                      class="relative cursor-pointer bg-white rounded-md font-medium text-primary hover:text-green-dark focus-within:outline-none"
                    >
                      <span>上传图片</span>
                      <input
                        id="file-upload"
                        name="file-upload"
                        type="file"
                        class="sr-only"
                        accept="image/*"
                        @change="handleFileChange"
                      />
                    </label>
                    <p class="pl-1">或拖放图片到此处</p>
                  </div>
                  <p class="text-xs text-neutral-dark">支持PNG, JPG, GIF格式，最大5MB</p>
                </div>
              </div>
            </div>

            <!-- 上传按钮 -->
            <div class="flex justify-end space-x-3">
              <button
                type="button"
                @click="skipCoverUpload"
                class="px-4 py-2 border border-neutral-dark text-neutral-dark rounded-md hover:bg-neutral hover:bg-opacity-10 transition-colors"
              >
                稍后添加
              </button>
              <button
                type="submit"
                class="px-6 py-2 bg-primary text-white rounded-md hover:bg-green-dark transition-colors"
                :disabled="uploadLoading || !formData.coverImageFile"
              >
                <span v-if="uploadLoading">上传中...</span>
                <span v-else>上传封面</span>
              </button>
            </div>
          </form>
        </div>

        <!-- 全部完成后的成功提示 -->
        <div v-if="isSuccess && !showCoverForm" class="space-y-6">
          <div class="mb-6 p-4 bg-primary bg-opacity-10 border border-primary rounded-md">
            <p class="text-primary font-medium">作品集创建完成！</p>
            <p class="text-green-dark text-sm mt-1">
              您可以在作品集列表中查看并添加具体的作品内容。
            </p>
          </div>

          <div class="flex justify-center space-x-4">
            <router-link
              :to="`/portfolio`"
              class="px-6 py-3 bg-primary text-white rounded-md hover:bg-green-dark transition-colors"
            >
              查看我的作品集
            </router-link>
            <button
              @click="resetForm"
              class="px-6 py-3 border border-primary text-primary rounded-md hover:bg-green-light hover:bg-opacity-10 transition-colors"
            >
              创建另一个作品集
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, onMounted, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/userStore'
import { retoucherPortfolioAPI } from '../services/apiService'

export default defineComponent({
  name: 'RetoucherPortfolioCreateView',
  setup() {
    const router = useRouter()
    const userStore = useUserStore()

    // 状态变量
    const isLoading = ref(false)
    const uploadLoading = ref(false)
    const isSuccess = ref(false)
    const error = ref('')
    const previewImage = ref('')
    const newTag = ref('')
    const createdPortfolioId = ref<number | null>(null)

    // 计算属性 - 控制是否显示封面表单
    const showCoverForm = computed(() => {
      return isSuccess.value && createdPortfolioId.value !== null
    })

    // 修图作品分类选项 - 修改为与后端枚举匹配
    const categories = [
      { value: 'Portrait', label: '人像修图' },
      { value: 'Wedding', label: '婚礼修图' },
      { value: 'Fashion', label: '时尚修图' },
      { value: 'Product', label: '产品修图' },
      { value: 'Event', label: '活动修图' },
      { value: 'Landscape', label: '风景修图' },
      { value: 'Other', label: '其他' },
    ]

    // 分类中英文映射
    const getCategoryValue = (displayName: string): string => {
      const category = categories.find((item) => item.label === displayName)
      return category ? category.value : 'Other' // 默认返回Other
    }

    // 表单数据
    const formData = reactive({
      title: '',
      description: '',
      categoryDisplay: '', // 显示给用户看的中文分类
      category: '', // 实际提交给API的英文分类
      tags: [] as string[],
      isPublic: true,
      coverImageUrl: '',
      coverImageFile: null as File | null,
    })

    // 监听categoryDisplay变化，同步更新category
    watch(
      () => formData.categoryDisplay,
      (newValue) => {
        formData.category = getCategoryValue(newValue)
      },
    )

    // 检查是否是修图师
    onMounted(() => {
      // 如果不是修图师，重定向到作品集页面
      if (!userStore.isAuthenticated) {
        router.push('/login')
        return
      }

      if (!userStore.isRetoucher) {
        router.push('/portfolio')
        return
      }
    })

    // 添加标签
    const addTag = () => {
      if (!newTag.value.trim()) return
      if (formData.tags.length >= 10) {
        error.value = '最多只能添加10个标签'
        return
      }
      if (!formData.tags.includes(newTag.value.trim())) {
        formData.tags.push(newTag.value.trim())
      }
      newTag.value = ''
    }

    // 移除标签
    const removeTag = (index: number) => {
      formData.tags.splice(index, 1)
    }

    // 处理文件上传
    const handleFileChange = (event: Event) => {
      const input = event.target as HTMLInputElement
      if (!input.files || input.files.length === 0) return

      const file = input.files[0]

      // 检查文件类型
      if (!file.type.match('image.*')) {
        error.value = '请上传图片文件'
        return
      }

      // 检查文件大小
      if (file.size > 10 * 1024 * 1024) {
        error.value = '图片大小不能超过10MB'
        return
      }

      // 存储文件并创建预览
      formData.coverImageFile = file
      const reader = new FileReader()
      reader.onload = (e) => {
        if (e.target) {
          previewImage.value = e.target.result as string
        }
      }
      reader.readAsDataURL(file)
    }

    // 提交表单 - 创建作品集
    const handleSubmit = async () => {
      try {
        error.value = ''
        isLoading.value = true

        // 表单验证
        if (!formData.title) {
          error.value = '请输入作品集标题'
          return
        }

        if (!formData.description) {
          error.value = '请输入作品集描述'
          return
        }

        if (!formData.categoryDisplay) {
          error.value = '请选择作品集分类'
          return
        }

        // 确保category已经被设置为对应的英文值
        formData.category = getCategoryValue(formData.categoryDisplay)

        // 创建作品集 - 使用简化的请求体格式，使用英文category值
        const portfolioData = {
          title: formData.title,
          description: formData.description,
          category: formData.category, // 使用英文分类值
          isPublic: formData.isPublic,
        }

        console.log('正在创建作品集:', portfolioData)
        const response = await retoucherPortfolioAPI.create(portfolioData)
        console.log('作品集创建成功:', response.data)

        // 保存返回的portfolioId
        isSuccess.value = true
        createdPortfolioId.value = response.data.portfolioId
        console.log(`已保存作品集ID: ${createdPortfolioId.value}`)
      } catch (err: any) {
        console.error('创建作品集失败:', err)
        if (err.response?.status === 400) {
          error.value = err.response?.data?.message || '请求参数错误'
        } else if (err.response?.status === 401) {
          error.value = '登录已过期，请重新登录'
        } else {
          error.value = '创建作品集失败，请稍后再试'
        }
      } finally {
        isLoading.value = false
      }
    }

    // 上传封面图片
    const uploadCoverImage = async () => {
      if (!formData.coverImageFile) {
        error.value = '请选择封面图片'
        return
      }

      if (!createdPortfolioId.value) {
        error.value = '无法获取作品集ID，请重新创建作品集'
        return
      }

      try {
        uploadLoading.value = true
        error.value = ''

        console.log(`开始上传封面图片到作品集 #${createdPortfolioId.value}`)

        // 调用API上传封面图片
        const response = await retoucherPortfolioAPI.uploadCover(
          createdPortfolioId.value,
          formData.coverImageFile,
        )

        console.log('封面上传成功:', response.data)

        // 完成上传，显示最终成功页面
        createdPortfolioId.value = null
      } catch (err: any) {
        console.error('上传封面图片失败:', err)
        if (err.response?.status === 400) {
          error.value = err.response?.data?.message || '上传文件无效'
        } else if (err.response?.status === 401) {
          error.value = '登录已过期，请重新登录'
        } else if (err.response?.status === 403) {
          error.value = '您无权修改此作品集'
        } else if (err.response?.status === 404) {
          error.value = '未找到作品集，请重试'
        } else {
          error.value = '上传封面图片失败，请重试'
        }
      } finally {
        uploadLoading.value = false
      }
    }

    // 跳过封面上传
    const skipCoverUpload = () => {
      createdPortfolioId.value = null
    }

    // 重置表单 - 创建新作品集
    const resetForm = () => {
      formData.title = ''
      formData.description = ''
      formData.categoryDisplay = ''
      formData.category = ''
      formData.tags = []
      formData.isPublic = true
      formData.coverImageUrl = ''
      formData.coverImageFile = null
      previewImage.value = ''
      isSuccess.value = false
      error.value = ''
      createdPortfolioId.value = null
    }

    return {
      formData,
      isLoading,
      uploadLoading,
      isSuccess,
      error,
      previewImage,
      newTag,
      categories,
      createdPortfolioId,
      showCoverForm,
      handleFileChange,
      handleSubmit,
      uploadCoverImage,
      skipCoverUpload,
      resetForm,
    }
  },
})
</script>
