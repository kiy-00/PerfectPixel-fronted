<template>
  <div class="bg-neutral min-h-screen pb-10 flex items-center justify-center">
    <div class="container mx-auto px-4">
      <div class="max-w-md mx-auto bg-white rounded-lg shadow-md p-8 text-center">
        <div
          class="w-20 h-20 mx-auto bg-green-light bg-opacity-20 rounded-full flex items-center justify-center mb-6"
        >
          <svg class="w-12 h-12 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        <h1 class="text-2xl font-bold text-neutral-dark mb-4">订单提交成功！</h1>
        <p class="text-neutral-dark mb-6">
          您的修图订单已成功提交，我们已通知修图师进行处理。您可以在"我的订单"页面查看订单进度，并与修图师沟通。
        </p>

        <div class="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
          <router-link
            to="/orders"
            class="px-6 py-3 bg-primary text-white rounded-md hover:bg-green-dark transition-colors font-medium"
          >
            查看我的订单
          </router-link>
          <router-link
            to="/home"
            class="px-6 py-3 bg-neutral text-neutral-dark rounded-md hover:bg-neutral-light transition-colors font-medium"
          >
            返回首页
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'OrderSuccessView',
})
</script>
