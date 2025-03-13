<template>
  <div class="bg-neutral min-h-screen pb-10">
    <!-- 加载中状态 -->
    <div v-if="loading" class="flex justify-center items-center h-screen">
      <div class="text-center">
        <div
          class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"
        ></div>
        <p class="mt-4 text-neutral-dark">正在加载作品集...</p>
      </div>
    </div>

    <!-- 错误提示 -->
    <div v-else-if="error" class="flex justify-center items-center h-screen">
      <div class="text-center bg-white p-8 rounded-lg shadow-md">
        <div class="text-error text-xl mb-4">加载失败</div>
        <p class="text-neutral-dark mb-6">{{ error }}</p>
        <router-link
          to="/portfolio"
          class="px-4 py-2 bg-primary text-white rounded-md hover:bg-green-dark transition-colors"
        >
          返回作品集列表
        </router-link>
      </div>
    </div>

    <!-- 作品集内容 -->
    <template v-else-if="portfolio">
      <!-- 顶部导航和标题 -->
      <div class="bg-primary text-white px-6 py-4 shadow-md">
        <div class="container mx-auto">
          <div class="flex justify-between items-center">
            <div>
              <h1 class="text-2xl font-bold">{{ portfolio.title }}</h1>
              <p class="text-sm text-green-light mt-1">
                {{ getCategoryName(portfolio.category) }} · {{ formatDate(portfolio.createdAt) }}
              </p>
            </div>
            <div class="flex items-center space-x-3">
              <span
                v-if="portfolio.retoucherId === userStore.retoucherId"
                class="flex items-center"
              >
                <button
                  class="px-4 py-2 bg-green-dark text-white rounded-md hover:bg-opacity-80 transition-colors mr-2"
                >
                  编辑作品集
                </button>
              </span>
              <router-link
                to="/portfolio"
                class="px-4 py-2 bg-white text-primary rounded-md hover:bg-green-light transition-colors"
              >
                返回作品集列表
              </router-link>
            </div>
          </div>
        </div>
      </div>

      <!-- 添加调试区域 -->
      <div
        v-if="isDevelopment"
        class="container mx-auto mt-8 p-4 bg-error bg-opacity-10 rounded-lg"
      >
        <h3 class="font-bold text-error mb-2">调试信息:</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-red">
          <div>
            <p><strong>用户认证:</strong></p>
            <p>用户已登录: {{ userStore.isAuthenticated ? '是' : '否' }}</p>
            <p>用户ID: {{ userStore.userInfo?.userId || '无' }}</p>
            <p>用户名: {{ userStore.userInfo?.username || '无' }}</p>
            <p>用户角色: {{ userStore.userInfo?.roles?.join(', ') || '无' }}</p>
          </div>
          <div>
            <p><strong>作品集信息:</strong></p>
            <p>作品集ID: {{ portfolio.portfolioId }}</p>
            <p>修图师ID: {{ portfolio.retoucherId }}</p>
            <p>存储的修图师ID: {{ userStore.retoucherId }}</p>
            <p>
              是否是作品所有者: {{ portfolio.retoucherId === userStore.retoucherId ? '是' : '否' }}
            </p>
            <p>
              原始类型比较: {{ typeof portfolio.retoucherId }} vs {{ typeof userStore.retoucherId }}
            </p>
            <p>
              数值比较:
              {{
                Number(portfolio.retoucherId) === Number(userStore.retoucherId) ? '相等' : '不相等'
              }}
            </p>
          </div>
        </div>

        <!-- 强制显示按钮（仅用于测试） -->
        <div class="mt-4 p-4 border border-error rounded-lg">
          <h4 class="font-bold mb-2">调试控制:</h4>
          <div class="flex space-x-4 mb-2">
            <button
              @click="showUploadModal = true"
              class="px-4 py-2 bg-error text-white rounded-md"
            >
              强制显示上传模态框
            </button>
            <button
              @click="forceOwnership = !forceOwnership"
              class="px-4 py-2 bg-error text-white rounded-md"
            >
              {{ forceOwnership ? '关闭' : '开启' }}作品所有权
            </button>
          </div>
          <p>当前强制所有权状态: {{ forceOwnership ? '开启' : '关闭' }}</p>
        </div>
      </div>

      <!-- 主要内容区域 -->
      <div class="container mx-auto px-4 mt-8">
        <div class="bg-white rounded-lg shadow-md overflow-hidden">
          <!-- 作品集封面和描述 -->
          <div class="flex flex-col lg:flex-row">
            <div class="lg:w-1/2">
              <div class="aspect-video relative">
                <img
                  v-if="portfolio.coverImageUrl"
                  :src="getImageUrl(portfolio.coverImageUrl)"
                  :alt="portfolio.title"
                  class="w-full h-full object-cover"
                />
                <div
                  v-else
                  class="w-full h-full bg-neutral-dark bg-opacity-10 flex items-center justify-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-16 w-16 text-neutral-dark opacity-30"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>

                <!-- 公开/私密标识 -->
                <div
                  :class="[
                    'absolute top-4 right-4 px-3 py-1 text-sm rounded-md',
                    portfolio.isPublic ? 'bg-primary text-white' : 'bg-white text-neutral-dark',
                  ]"
                >
                  {{ portfolio.isPublic ? '已公开' : '未公开' }}
                </div>
              </div>
            </div>
            <div class="lg:w-1/2 p-6">
              <h2 class="text-2xl font-bold text-neutral-dark">关于此作品集</h2>
              <div class="mt-4 text-neutral-dark">
                <p>{{ portfolio.description }}</p>
              </div>

              <div class="mt-6 flex flex-wrap gap-2">
                <div class="px-3 py-1 rounded-full bg-primary bg-opacity-10 text-primary text-sm">
                  {{ getCategoryName(portfolio.category) }}
                </div>
                <div
                  class="px-3 py-1 rounded-full bg-neutral bg-opacity-20 text-neutral-dark text-sm"
                >
                  {{ portfolio.items?.length || 0 }} 张作品
                </div>
                <div
                  class="px-3 py-1 rounded-full bg-neutral bg-opacity-20 text-neutral-dark text-sm"
                >
                  {{ formatDate(portfolio.createdAt) }} 创建
                </div>
              </div>

              <div v-if="portfolio.retoucherId === userStore.retoucherId" class="mt-6">
                <button
                  @click="showUploadModal = true"
                  class="px-4 py-2 border border-primary text-primary rounded-md hover:bg-green-light hover:bg-opacity-10 transition-colors mr-2"
                >
                  <span class="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-4 w-4 mr-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                    添加新作品
                  </span>
                </button>
                <button
                  class="px-4 py-2 border border-primary text-primary rounded-md hover:bg-green-light hover:bg-opacity-10 transition-colors"
                >
                  <span class="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-4 w-4 mr-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"
                      />
                    </svg>
                    更多操作
                  </span>
                </button>
              </div>
            </div>
          </div>

          <!-- 修图师信息 -->
          <div class="p-6 border-t border-green-light">
            <h2 class="text-lg font-bold text-neutral-dark mb-4">修图师信息</h2>
            <div class="flex items-center">
              <div
                class="h-12 w-12 rounded-full bg-primary text-white flex items-center justify-center text-xl font-bold"
              >
                {{
                  portfolio.retoucherName ? portfolio.retoucherName.charAt(0).toUpperCase() : '?'
                }}
              </div>
              <div class="ml-4">
                <h3 class="text-lg font-medium text-neutral-dark">{{ portfolio.retoucherName }}</h3>
                <p class="text-sm text-neutral-dark">修图师</p>
              </div>
            </div>
          </div>

          <!-- 作品集操作按钮区域 - 修改判断条件并添加调试信息 -->
          <div
            class="p-4 border-t border-green-light"
            v-if="Number(portfolio.retoucherId) === Number(userStore.retoucherId) || forceOwnership"
          >
            <div v-if="isDevelopment" class="bg-yellow-100 p-2 mb-4 rounded">
              <p>调试: 显示按钮区域 - 条件成立</p>
              <p>作品集修图师ID: {{ portfolio.retoucherId }}</p>
              <p>用户修图师ID: {{ userStore.retoucherId }}</p>
            </div>

            <h2 class="text-lg font-bold text-neutral-dark mb-4">作品集操作</h2>
            <div class="flex space-x-4">
              <button
                @click="showUploadModal = true"
                class="px-4 py-2 bg-primary text-white rounded-md hover:bg-green-dark transition-colors"
              >
                <span class="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-4 w-4 mr-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                  添加新作品
                </span>
              </button>
              <button
                class="px-4 py-2 border border-primary text-primary rounded-md hover:bg-green-light hover:bg-opacity-10 transition-colors"
              >
                <span class="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-4 w-4 mr-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                    />
                  </svg>
                  编辑作品集
                </span>
              </button>
            </div>
          </div>
          <div v-else-if="isDevelopment" class="p-4 border-t border-red-300 bg-red-50">
            <p>调试: 按钮区域未显示 - 条件不成立</p>
            <p>作品集修图师ID: {{ portfolio.retoucherId }} ({{ typeof portfolio.retoucherId }})</p>
            <p>用户修图师ID: {{ userStore.retoucherId }} ({{ typeof userStore.retoucherId }})</p>
            <p>
              比较结果: {{ portfolio.retoucherId === userStore.retoucherId ? '相等' : '不相等' }}
            </p>
            <p>
              数字比较:
              {{
                Number(portfolio.retoucherId) === Number(userStore.retoucherId) ? '相等' : '不相等'
              }}
            </p>
            <p>强制所有权开关: {{ forceOwnership ? '开启' : '关闭' }}</p>
          </div>
        </div>

        <!-- 作品列表 -->
        <div class="mt-8">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-2xl font-bold text-neutral-dark">
              作品列表 ({{ formattedPortfolioItems.length || 0 }})
            </h2>
            <!-- 添加悬浮的上传按钮 -->
            <button
              v-if="
                Number(portfolio.retoucherId) === Number(userStore.retoucherId) || forceOwnership
              "
              @click="showUploadModal = true"
              class="px-4 py-2 bg-primary text-white rounded-md hover:bg-green-dark transition-colors"
            >
              添加新作品
            </button>
          </div>

          <!-- 空状态 -->
          <div
            v-if="!formattedPortfolioItems || formattedPortfolioItems.length === 0"
            class="bg-white rounded-lg shadow-md p-8 text-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-16 w-16 mx-auto text-neutral-dark opacity-50 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <h3 class="text-lg font-medium text-neutral-dark mb-2">暂无作品</h3>
            <p class="text-neutral-dark mb-4">此作品集还没有添加任何修图作品</p>
          </div>

          <!-- 作品网格 -->
          <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <!-- 只显示是成对的项目，非封面图 -->
            <div
              v-for="item in formattedPortfolioItems"
              :key="item.id"
              class="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <!-- 修图前后对比 -->
              <div class="flex flex-col md:flex-row">
                <!-- 修图前 -->
                <div class="md:w-1/2 relative">
                  <img
                    v-if="item.beforeImageUrl"
                    :src="getImageUrl(item.beforeImageUrl)"
                    alt="修图前"
                    class="w-full aspect-square object-cover"
                  />
                  <div
                    v-else
                    class="w-full aspect-square bg-neutral bg-opacity-10 flex items-center justify-center"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-12 w-12 text-neutral-dark opacity-30"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <div
                    class="absolute top-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded"
                  >
                    修图前
                  </div>
                </div>

                <!-- 修图后 -->
                <div class="md:w-1/2 relative">
                  <img
                    v-if="item.afterImageUrl"
                    :src="getImageUrl(item.afterImageUrl)"
                    alt="修图后"
                    class="w-full aspect-square object-cover"
                  />
                  <div
                    v-else
                    class="w-full aspect-square bg-neutral bg-opacity-10 flex items-center justify-center"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-12 w-12 text-neutral-dark opacity-30"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <div
                    class="absolute top-2 left-2 bg-primary text-white text-xs px-2 py-1 rounded"
                  >
                    修图后
                  </div>
                </div>
              </div>

              <!-- 作品信息 -->
              <div class="p-4">
                <h3 class="font-medium text-lg text-neutral-dark">
                  {{ item.title || '未命名作品' }}
                </h3>
                <p v-if="item.description" class="text-sm text-neutral-dark mt-1">
                  {{ item.description }}
                </p>
                <div class="text-xs text-neutral-dark mt-2">
                  {{ formatDate(item.createdAt) }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>

    <!-- 上传修图前后对比图的模态框 -->
    <div
      v-if="showUploadModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <div class="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div class="p-6">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-xl font-bold text-neutral-dark">上传修图前后对比</h2>
            <button @click="closeUploadModal" class="text-neutral-dark hover:text-error">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <!-- 上传表单 -->
          <form @submit.prevent="uploadBeforeAfterImages">
            <!-- 错误提示 -->
            <div v-if="uploadError" class="mb-4 p-3 bg-error bg-opacity-10 text-error rounded-md">
              {{ uploadError }}
            </div>

            <!-- 修图前图片 -->
            <div class="mb-4">
              <label class="block text-sm font-medium text-neutral-dark mb-1">
                修图前图片 <span class="text-neutral-dark">(可选)</span>
              </label>
              <div class="border-2 border-dashed border-neutral rounded-md p-4 text-center">
                <div v-if="beforeImagePreview" class="mb-2">
                  <img :src="beforeImagePreview" class="max-h-40 mx-auto" alt="修图前预览" />
                  <button
                    type="button"
                    @click="removeBefore"
                    class="mt-2 text-error text-sm hover:underline"
                  >
                    移除
                  </button>
                </div>
                <label v-else class="cursor-pointer flex flex-col items-center justify-center py-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-10 w-10 text-neutral-dark opacity-50 mb-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <span class="text-neutral-dark">点击选择修图前图片</span>
                  <input
                    type="file"
                    ref="beforeImageInput"
                    @change="handleBeforeImageChange"
                    accept="image/*"
                    class="hidden"
                  />
                </label>
              </div>
            </div>

            <!-- 修图后图片 (必选) -->
            <div class="mb-4">
              <label class="block text-sm font-medium text-neutral-dark mb-1">
                修图后图片 <span class="text-error">*</span>
              </label>
              <div class="border-2 border-dashed border-neutral rounded-md p-4 text-center">
                <div v-if="afterImagePreview" class="mb-2">
                  <img :src="afterImagePreview" class="max-h-40 mx-auto" alt="修图后预览" />
                  <button
                    type="button"
                    @click="removeAfter"
                    class="mt-2 text-error text-sm hover:underline"
                  >
                    移除
                  </button>
                </div>
                <label v-else class="cursor-pointer flex flex-col items-center justify-center py-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-10 w-10 text-neutral-dark opacity-50 mb-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <span class="text-neutral-dark">点击选择修图后图片</span>
                  <input
                    type="file"
                    ref="afterImageInput"
                    @change="handleAfterImageChange"
                    accept="image/*"
                    class="hidden"
                    required
                  />
                </label>
              </div>
            </div>

            <!-- 标题 -->
            <div class="mb-4">
              <label for="title" class="block text-sm font-medium text-neutral-dark mb-1">
                作品标题
              </label>
              <input
                type="text"
                id="title"
                v-model="uploadForm.title"
                class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="输入作品标题"
              />
            </div>

            <!-- 描述 -->
            <div class="mb-4">
              <label for="description" class="block text-sm font-medium text-neutral-dark mb-1">
                作品描述
              </label>
              <textarea
                id="description"
                v-model="uploadForm.description"
                class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                rows="3"
                placeholder="描述修图过程或特点..."
              ></textarea>
            </div>

            <!-- 按钮区域 -->
            <div class="flex justify-end space-x-3 mt-6">
              <button
                type="button"
                @click="closeUploadModal"
                class="px-4 py-2 border border-neutral-dark text-neutral-dark rounded-md hover:bg-neutral hover:bg-opacity-10"
              >
                取消
              </button>
              <button
                type="submit"
                class="px-4 py-2 bg-primary text-white rounded-md hover:bg-green-dark"
                :disabled="isUploading || !uploadForm.afterImage"
              >
                <span v-if="isUploading">上传中...</span>
                <span v-else>上传作品</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '../stores/userStore'
import { retoucherPortfolioAPI } from '../services/apiService'
import { getAssetUrl } from '../utils/urlUtils'

// 作品集接口
interface RetoucherPortfolio {
  retoucherId: number
  retoucherName: string
  portfolioId: number
  title: string
  description: string
  category: string
  isPublic: boolean
  createdAt: string
  updatedAt: string
  coverImageUrl: string | null
  coverThumbnailUrl: string | null
  items: PortfolioItem[]
}

// 作品项接口
interface PortfolioItem {
  itemId: number
  portfolioId: number
  portfolioType: string
  imagePath: string
  imageUrl: string
  thumbnailUrl: string | null
  title: string
  description: string
  metadata: string
  createdAt: string
  isBeforeImage: boolean
  afterImageId: number | null
  afterImage: any | null
  isPortfolioCover: boolean
  beforeImageUrl: string | null
  beforeThumbnailUrl: string | null
  afterImageUrl: string | null
  afterThumbnailUrl: string | null
}

// 处理后的作品项接口
interface FormattedPortfolioItem {
  id: string
  title: string
  description: string
  createdAt: string
  beforeImageUrl: string | null
  afterImageUrl: string | null
}

export default defineComponent({
  name: 'RetoucherPortfolioDetailView',
  setup() {
    const route = useRoute()
    const router = useRouter()
    const userStore = useUserStore()

    // 添加开发环境检测和调试变量
    const isDevelopment = ref(process.env.NODE_ENV === 'development')
    const forceOwnership = ref(false)

    // 状态变量
    const loading = ref(true)
    const error = ref('')
    const portfolio = ref<RetoucherPortfolio | null>(null)

    // 上传模态框
    const showUploadModal = ref(false)
    const isUploading = ref(false)
    const uploadError = ref('')
    const beforeImagePreview = ref('')
    const afterImagePreview = ref('')
    const beforeImageInput = ref<HTMLInputElement | null>(null)
    const afterImageInput = ref<HTMLInputElement | null>(null)

    // 上传表单数据
    const uploadForm = ref({
      beforeImage: null as File | null,
      afterImage: null as File | null,
      title: '',
      description: '',
      orderIndex: 0,
    })

    // 关闭上传模态框
    const closeUploadModal = () => {
      showUploadModal.value = false
      resetUploadForm()
    }

    // 重置上传表单
    const resetUploadForm = () => {
      uploadForm.value = {
        beforeImage: null,
        afterImage: null,
        title: '',
        description: '',
        orderIndex: 0,
      }
      beforeImagePreview.value = ''
      afterImagePreview.value = ''
      uploadError.value = ''
    }

    // 处理修图前图片选择
    const handleBeforeImageChange = (event: Event) => {
      const input = event.target as HTMLInputElement
      if (input.files && input.files[0]) {
        const file = input.files[0]
        uploadForm.value.beforeImage = file

        // 创建预览
        const reader = new FileReader()
        reader.onload = (e) => {
          beforeImagePreview.value = e.target?.result as string
        }
        reader.readAsDataURL(file)
      }
    }

    // 处理修图后图片选择
    const handleAfterImageChange = (event: Event) => {
      const input = event.target as HTMLInputElement
      if (input.files && input.files[0]) {
        const file = input.files[0]
        uploadForm.value.afterImage = file

        // 创建预览
        const reader = new FileReader()
        reader.onload = (e) => {
          afterImagePreview.value = e.target?.result as string
        }
        reader.readAsDataURL(file)
      }
    }

    // 移除修图前图片
    const removeBefore = () => {
      uploadForm.value.beforeImage = null
      beforeImagePreview.value = ''
      if (beforeImageInput.value) {
        beforeImageInput.value.value = ''
      }
    }

    // 移除修图后图片
    const removeAfter = () => {
      uploadForm.value.afterImage = null
      afterImagePreview.value = ''
      if (afterImageInput.value) {
        afterImageInput.value.value = ''
      }
    }

    // 上传修图前后对比图
    const uploadBeforeAfterImages = async () => {
      if (!portfolio.value) return

      // 验证必须有修图后的图片
      if (!uploadForm.value.afterImage) {
        uploadError.value = '请选择修图后的图片'
        return
      }

      try {
        isUploading.value = true
        uploadError.value = ''

        const portfolioId = portfolio.value.portfolioId
        const formData = new FormData()

        // 添加修图后图片（必选）
        formData.append('afterImage', uploadForm.value.afterImage)

        // 添加修图前图片（可选）
        if (uploadForm.value.beforeImage) {
          formData.append('beforeImage', uploadForm.value.beforeImage)
        }

        // 添加标题和描述（可选）
        if (uploadForm.value.title) {
          formData.append('title', uploadForm.value.title)
        }

        if (uploadForm.value.description) {
          formData.append('description', uploadForm.value.description)
        }

        // 添加排序索引（可选）
        formData.append('orderIndex', uploadForm.value.orderIndex.toString())

        console.log(`准备上传修图前后对比到作品集 #${portfolioId}`)

        // 发送API请求
        const response = await retoucherPortfolioAPI.uploadBeforeAfterImages(portfolioId, formData)
        console.log('上传成功:', response.data)

        // 关闭模态框
        closeUploadModal()

        // 刷新作品集详情
        await fetchPortfolioDetail()
      } catch (err: any) {
        console.error('上传修图前后对比图失败:', err)

        if (err.response?.status === 401) {
          uploadError.value = '登录已过期，请重新登录'
        } else if (err.response?.status === 403) {
          uploadError.value = '您没有权限上传到此作品集'
        } else if (err.response?.status === 400) {
          uploadError.value = err.response.data.message || '请求参数错误'
        } else {
          uploadError.value = '上传失败，请稍后再试'
        }
      } finally {
        isUploading.value = false
      }
    }

    // 获取作品集详情
    const fetchPortfolioDetail = async () => {
      const portfolioId = Number(route.params.id)
      if (!portfolioId) {
        error.value = '无效的作品集ID'
        loading.value = false
        return
      }

      try {
        console.log(`获取作品集详情，ID: ${portfolioId}`)
        loading.value = true
        const response = await retoucherPortfolioAPI.getPortfolioById(portfolioId)
        portfolio.value = response.data
        console.log('作品集详情获取成功:', portfolio.value.title)

        // 调试信息 - 打印ID比较
        if (isDevelopment.value) {
          console.log('==== ID 比较调试 ====')
          console.log(
            '作品集修图师ID:',
            portfolio.value.retoucherId,
            typeof portfolio.value.retoucherId,
          )
          console.log('用户修图师ID:', userStore.retoucherId, typeof userStore.retoucherId)
          console.log('直接比较:', portfolio.value.retoucherId === userStore.retoucherId)
          console.log(
            '数值比较:',
            Number(portfolio.value.retoucherId) === Number(userStore.retoucherId),
          )
          console.log('====================')
        }
      } catch (err: any) {
        console.error('获取作品集详情失败:', err)
        if (err.response?.status === 404) {
          error.value = '作品集不存在或已被删除'
        } else if (err.response?.status === 403) {
          error.value = '您没有权限查看此作品集'
        } else {
          error.value = '获取作品集详情失败，请稍后再试'
        }
      } finally {
        loading.value = false
      }
    }

    // 格式化日期
    const formatDate = (dateString: string) => {
      try {
        const date = new Date(dateString)
        return new Intl.DateTimeFormat('zh-CN', {
          year: 'numeric',
          month: 'numeric',
          day: 'numeric',
        }).format(date)
      } catch (e) {
        return dateString
      }
    }

    // 获取分类名称
    const getCategoryName = (category: string) => {
      const categoryMap: Record<string, string> = {
        Portrait: '人像修图',
        Wedding: '婚礼修图',
        Fashion: '时尚修图',
        Product: '产品修图',
        Event: '活动修图',
        Landscape: '风景修图',
        Other: '其他',
      }

      return categoryMap[category] || category
    }

    // 处理图片URL
    const getImageUrl = (url: string | null) => {
      return getAssetUrl(url)
    }

    // 格式化作品集项目，处理修图前后图片对
    const formattedPortfolioItems = computed(() => {
      if (!portfolio.value || !portfolio.value.items) return []

      const items = portfolio.value.items
      const result: FormattedPortfolioItem[] = []
      const processedIds = new Set<number>()

      // 先处理所有带有 isBeforeImage 标记的项目
      for (const item of items) {
        // 跳过已处理的项和封面图
        if (processedIds.has(item.itemId) || item.isPortfolioCover) {
          continue
        }

        // 如果是修图前图片且有对应的修图后图片
        if (item.isBeforeImage && item.afterImageId) {
          const afterItem = items.find((i) => i.itemId === item.afterImageId)
          if (afterItem) {
            result.push({
              id: `before-after-${item.itemId}-${afterItem.itemId}`,
              title: afterItem.title || item.title || '',
              description: afterItem.description || item.description || '',
              createdAt: item.createdAt,
              beforeImageUrl: item.imageUrl,
              afterImageUrl: afterItem.imageUrl,
            })

            processedIds.add(item.itemId)
            processedIds.add(afterItem.itemId)
          }
        }
        // 如果直接是"修图后"项，并且包含beforeImageUrl
        else if (!item.isBeforeImage && item.beforeImageUrl) {
          result.push({
            id: `after-${item.itemId}`,
            title: item.title || '',
            description: item.description || '',
            createdAt: item.createdAt,
            beforeImageUrl: item.beforeImageUrl,
            afterImageUrl: item.imageUrl,
          })

          processedIds.add(item.itemId)
        }
      }

      console.log(`处理后的作品项: ${result.length}项`, result)
      return result
    })

    // 组件挂载时加载数据
    onMounted(async () => {
      console.log('组件挂载，开始初始化数据')
      loading.value = true

      try {
        // 第一步：确保用户信息已初始化
        if (!userStore.isAuthenticated) {
          console.log('用户未登录，尝试从本地存储恢复会话')
          await userStore.initializeUser()
          console.log('会话恢复后状态:', {
            isAuthenticated: userStore.isAuthenticated,
            retoucherId: userStore.retoucherId,
          })
        }

        // 第二步：如果是修图师但没有ID，尝试获取ID
        if (userStore.isAuthenticated && userStore.isRetoucher && !userStore.retoucherId) {
          console.log('是修图师但ID未设置，尝试获取修图师ID')
          if (userStore.userInfo?.userId) {
            await userStore.fetchUserRoleIds(userStore.userInfo.userId)
            console.log('获取修图师ID后:', userStore.retoucherId)
          } else {
            console.error('无法获取修图师ID：用户ID不存在')
          }
        }

        // 第三步：获取作品集详情
        await fetchPortfolioDetail()
      } catch (err) {
        console.error('初始化过程出错:', err)
        error.value = '初始化数据失败，请刷新页面重试'
      } finally {
        loading.value = false
      }

      // 调试信息
      if (isDevelopment.value) {
        console.log('==== 用户状态调试 ====')
        console.log('用户已登录:', userStore.isAuthenticated)
        console.log('用户信息:', userStore.userInfo)
        console.log('用户角色:', userStore.userInfo?.roles)
        console.log('是否是修图师:', userStore.isRetoucher)
        console.log('修图师ID:', userStore.retoucherId, typeof userStore.retoucherId)
        console.log('====================')
      }
    })

    return {
      portfolio,
      loading,
      error,
      userStore,
      formatDate,
      getCategoryName,
      getImageUrl,
      // 新增调试变量
      isDevelopment,
      forceOwnership,
      // 上传相关属性和方法
      showUploadModal,
      isUploading,
      uploadError,
      beforeImagePreview,
      afterImagePreview,
      beforeImageInput,
      afterImageInput,
      uploadForm,
      closeUploadModal,
      handleBeforeImageChange,
      handleAfterImageChange,
      removeBefore,
      removeAfter,
      uploadBeforeAfterImages,
      formattedPortfolioItems,
    }
  },
})
</script>
