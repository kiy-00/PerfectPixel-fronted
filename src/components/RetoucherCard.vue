<template>
  <div
    class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
    @click="navigateToDetail"
  >
    <!-- 修图师封面图像 -->
    <div class="h-48 overflow-hidden relative">
      <img
        src="/images/retoucher/spring.jpg"
        :alt="retoucher.name"
        class="w-full h-full object-cover"
      />
      <div
        class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4"
      >
        <div class="flex justify-between items-end">
          <h3 class="text-white font-bold text-lg">{{ retoucher.name }}</h3>
          <div class="flex items-center bg-primary rounded-full px-2 py-1">
            <span class="text-white text-sm font-medium">¥{{ retoucher.price }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 修图师信息 -->
    <div class="p-5">
      <!-- 擅长领域 -->
      <div class="mb-4">
        <h4 class="text-xs text-neutral-dark font-medium mb-2">擅长领域</h4>
        <div class="flex flex-wrap gap-1">
          <span
            v-for="(category, index) in retoucher.categories"
            :key="index"
            class="inline-block px-2 py-1 bg-green-light bg-opacity-20 text-primary text-xs rounded-md"
          >
            {{ category }}
          </span>
        </div>
      </div>

      <!-- 简介 -->
      <p class="text-sm text-neutral-dark mb-4 line-clamp-2">{{ retoucher.description }}</p>

      <!-- 价格和选择按钮 -->
      <div class="flex justify-between items-center">
        <div>
          <span class="text-xs text-neutral-dark">起价</span>
          <div class="text-lg font-bold text-primary">¥{{ retoucher.price }}</div>
        </div>
        <button
          @click.stop="selectRetoucher"
          class="px-4 py-2 bg-primary text-white rounded-md hover:bg-green-dark transition-colors"
        >
          选择修图师
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { useRouter } from 'vue-router'

// 为UI定义的修图师数据接口
export interface RetoucherCardData {
  id: number
  name: string
  price: number
  categories: string[]
  description: string
  coverImage: string
  experience: string
  rating?: number // 保留但标记为可选，以便兼容现有数据
}

export default defineComponent({
  name: 'RetoucherCard',
  props: {
    retoucher: {
      type: Object as PropType<RetoucherCardData>,
      required: true,
    },
  },
  setup(props, { emit }) {
    const router = useRouter()

    const selectRetoucher = () => {
      emit('select', props.retoucher)
    }

    // Fix: Update to use the correct route name 'user-detail' instead of 'RetoucherDetail'
    const navigateToDetail = () => {
      router.push({ name: 'user-detail', params: { id: props.retoucher.id } })
    }

    return {
      selectRetoucher,
      navigateToDetail,
    }
  },
})
</script>
