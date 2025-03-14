<template>
  <div class="flex flex-col items-center justify-center min-h-screen w-full bg-green-light">
    <div class="container max-w-6xl px-4 py-12">
      <h1 class="text-4xl font-bold text-center text-green-dark mb-8">PixelPerfect</h1>

      <!-- 2D Carousel -->
      <div
        class="relative w-full max-w-4xl mx-auto h-120 mb-16 overflow-hidden rounded-lg shadow-xl"
      >
        <!-- Carousel Images -->
        <div
          class="flex transition-transform duration-500 h-full"
          :style="{ transform: `translateX(-${currentSlide * 100}%)` }"
        >
          <div
            v-for="(slide, index) in slides"
            :key="index"
            class="w-full h-full flex-shrink-0 relative"
          >
            <img :src="slide.image" :alt="slide.category" class="w-full h-full object-cover" />
            <div class="absolute bottom-0 w-full bg-primary/80 text-white text-center py-2">
              {{ slide.category }}
            </div>
          </div>
        </div>

        <!-- Arrow Navigation -->
        <button
          @click="prevSlide"
          class="absolute left-4 top-1/2 -translate-y-1/2 bg-white/50 hover:bg-white/80 text-green-dark w-10 h-10 rounded-full flex items-center justify-center shadow-md z-10"
        >
          <span class="text-2xl">&lsaquo;</span>
        </button>
        <button
          @click="nextSlide"
          class="absolute right-4 top-1/2 -translate-y-1/2 bg-white/50 hover:bg-white/80 text-green-dark w-10 h-10 rounded-full flex items-center justify-center shadow-md z-10"
        >
          <span class="text-2xl">&rsaquo;</span>
        </button>

        <!-- Dot Navigation -->
        <div class="absolute bottom-14 left-0 right-0 flex justify-center gap-2">
          <button
            v-for="(_, index) in slides"
            :key="index"
            @click="goToSlide(index)"
            class="w-3 h-3 rounded-full"
            :class="currentSlide === index ? 'bg-primary' : 'bg-white/50 hover:bg-white/80'"
          ></button>
        </div>
      </div>

      <!-- Auth Buttons -->
      <div class="flex flex-col sm:flex-row justify-center items-center gap-6 mt-12">
        <button
          @click="goLogin"
          class="px-8 py-3 bg-primary hover:bg-green-dark text-white rounded-lg font-medium transform transition-all duration-300 hover:scale-105 shadow-lg min-w-40"
        >
          登录
        </button>
        <button
          @click="goRegister"
          class="px-8 py-3 bg-green-accent hover:bg-green-dark text-white rounded-lg font-medium transform transition-all duration-300 hover:scale-105 shadow-lg min-w-40"
        >
          注册
        </button>
      </div>

      <div class="text-center mt-8 text-neutral-dark opacity-75">
        寻找最适合你的摄影师，创造难忘的瞬间
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'

export default defineComponent({
  name: 'StartView',
  setup() {
    const router = useRouter()
    const currentSlide = ref(0)
    let autoplayInterval: number | null = null

    const slides = [
      { image: '/images/carousel/nature.jpg', category: '自然风景' },
      { image: '/images/carousel/portrait.jpg', category: '人像摄影' },
      { image: '/images/carousel/wedding.jpg', category: '婚礼摄影' },
      { image: '/images/carousel/fashion.jpg', category: '时尚摄影' },
      { image: '/images/carousel/commercial.jpg', category: '商业摄影' },
    ]

    const goToSlide = (index: number) => {
      currentSlide.value = index
    }

    const nextSlide = () => {
      currentSlide.value = (currentSlide.value + 1) % slides.length
    }

    const prevSlide = () => {
      currentSlide.value = (currentSlide.value - 1 + slides.length) % slides.length
    }

    const startAutoplay = () => {
      autoplayInterval = window.setInterval(() => {
        nextSlide()
      }, 5000) // Change slide every 5 seconds
    }

    const stopAutoplay = () => {
      if (autoplayInterval) {
        clearInterval(autoplayInterval)
        autoplayInterval = null
      }
    }

    onMounted(() => {
      startAutoplay()
    })

    onBeforeUnmount(() => {
      stopAutoplay()
    })

    const goLogin = () => router.push('/login')
    const goRegister = () => router.push('/register')

    return {
      currentSlide,
      slides,
      goToSlide,
      nextSlide,
      prevSlide,
      goLogin,
      goRegister,
    }
  },
})
</script>
