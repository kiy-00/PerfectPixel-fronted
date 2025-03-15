<template>
  <div class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
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
            <span class="text-white text-sm font-medium">{{ retoucher.rating }}</span>
            <svg
              class="h-4 w-4 text-white ml-1"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
              />
            </svg>
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
          @click="selectRetoucher"
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

// 为UI定义的修图师数据接口
export interface RetoucherCardData {
  id: number
  name: string
  rating: number
  price: number
  categories: string[]
  description: string
  coverImage: string
  experience: string
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
    const selectRetoucher = () => {
      emit('select', props.retoucher)
    }

    return {
      selectRetoucher,
    }
  },
})
</script>
