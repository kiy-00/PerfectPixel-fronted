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
                v-if="portfolio.photographerId === userStore.photographerId"
                class="flex items-center"
              >
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
            <p>摄影师ID: {{ portfolio.photographerId }}</p>
            <p>存储的摄影师ID: {{ userStore.photographerId }}</p>
            <p>
              是否是作品所有者:
              {{ portfolio.photographerId === userStore.photographerId ? '是' : '否' }}
            </p>
            <p>
              原始类型比较: {{ typeof portfolio.photographerId }} vs
              {{ typeof userStore.photographerId }}
            </p>
            <p>
              数值比较:
              {{
                Number(portfolio.photographerId) === Number(userStore.photographerId)
                  ? '相等'
                  : '不相等'
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
                <p>{{ portfolio.description || '暂无描述' }}</p>
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
                <div
                  v-if="portfolio.location"
                  class="px-3 py-1 rounded-full bg-neutral bg-opacity-20 text-neutral-dark text-sm"
                >
                  {{ portfolio.location }}
                </div>
              </div>

              <div v-if="portfolio.photographerId === userStore.photographerId" class="mt-6">
                <!-- 修改"更多操作"按钮为下拉菜单 -->
                <div class="relative inline-block">
                  <button
                    @click="showMoreOptions = !showMoreOptions"
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
                  <!-- 下拉菜单 -->
                  <div
                    v-if="showMoreOptions"
                    class="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10"
                  >
                    <div class="py-1" role="menu">
                      <button
                        @click="openCoverUpload"
                        class="flex items-center w-full px-4 py-2 text-sm text-neutral-dark hover:bg-green-light hover:bg-opacity-10"
                        role="menuitem"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          class="h-4 w-4 mr-2"
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
                        上传封面图片
                      </button>
                      <button
                        @click="openEditModal"
                        class="flex items-center w-full px-4 py-2 text-sm text-neutral-dark hover:bg-green-light hover:bg-opacity-10"
                        role="menuitem"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          class="h-4 w-4 mr-2"
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
                      </button>
                      <!-- 添加删除作品集按钮 -->
                      <button
                        @click="openDeleteConfirmation"
                        class="flex items-center w-full px-4 py-2 text-sm text-error hover:bg-error hover:bg-opacity-10"
                        role="menuitem"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          class="h-4 w-4 mr-2"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                        删除作品集
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 摄影师信息 -->
          <div class="p-6 border-t border-green-light">
            <h2 class="text-lg font-bold text-neutral-dark mb-4">摄影师信息</h2>
            <div class="flex items-center">
              <div
                class="h-12 w-12 rounded-full bg-primary text-white flex items-center justify-center text-xl font-bold"
              >
                {{
                  portfolio.photographerName
                    ? portfolio.photographerName.charAt(0).toUpperCase()
                    : '?'
                }}
              </div>
              <div class="ml-4">
                <h3 class="text-lg font-medium text-neutral-dark">
                  {{ portfolio.photographerName }}
                </h3>
                <p class="text-sm text-neutral-dark">摄影师</p>
              </div>
            </div>
          </div>

          <!-- 作品集操作按钮区域 -->
          <div
            class="p-4 border-t border-green-light"
            v-if="
              Number(portfolio.photographerId) === Number(userStore.photographerId) ||
              forceOwnership
            "
          >
            <div v-if="isDevelopment" class="bg-yellow-100 p-2 mb-4 rounded">
              <p>调试: 显示按钮区域 - 条件成立</p>
              <p>作品集摄影师ID: {{ portfolio.photographerId }}</p>
              <p>用户摄影师ID: {{ userStore.photographerId }}</p>
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
            </div>
          </div>
          <div v-else-if="isDevelopment" class="p-4 border-t border-red-300 bg-red-50">
            <p>调试: 按钮区域未显示 - 条件不成立</p>
            <p>
              作品集摄影师ID: {{ portfolio.photographerId }} ({{ typeof portfolio.photographerId }})
            </p>
            <p>
              用户摄影师ID: {{ userStore.photographerId }} ({{ typeof userStore.photographerId }})
            </p>
            <p>
              比较结果:
              {{ portfolio.photographerId === userStore.photographerId ? '相等' : '不相等' }}
            </p>
            <p>
              数字比较:
              {{
                Number(portfolio.photographerId) === Number(userStore.photographerId)
                  ? '相等'
                  : '不相等'
              }}
            </p>
            <p>强制所有权开关: {{ forceOwnership ? '开启' : '关闭' }}</p>
          </div>
        </div>

        <!-- 作品列表 -->
        <div class="mt-8">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-2xl font-bold text-neutral-dark">
              作品列表 ({{ portfolio.items?.length || 0 }})
            </h2>
          </div>

          <!-- 空状态 -->
          <div
            v-if="!portfolio.items || portfolio.items.length === 0"
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
            <p class="text-neutral-dark mb-4">此作品集还没有添加任何摄影作品</p>
          </div>

          <!-- 作品网格 -->
          <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <div
              v-for="item in portfolio.items"
              :key="item.itemId"
              class="relative group rounded-lg overflow-hidden cursor-pointer bg-white shadow-md"
              @click="openPhotoDetail(item)"
            >
              <div class="aspect-square bg-neutral-dark bg-opacity-10">
                <img
                  :src="getImageUrl(item.imageUrl)"
                  :alt="item.title || '摄影作品'"
                  class="w-full h-full object-cover transition-transform group-hover:scale-105 duration-300"
                />
              </div>

              <!-- 图片信息覆盖层 - 移除标题，只保留描述 -->
              <div
                class="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3"
              >
                <p class="text-sm text-white/90 line-clamp-2">
                  {{ item.description || '无描述' }}
                </p>
              </div>

              <!-- 如果是封面，显示标识 -->
              <div
                v-if="item.isPortfolioCover"
                class="absolute top-2 right-2 bg-primary text-white text-xs px-2 py-1 rounded-md shadow"
              >
                封面
              </div>

              <!-- 作品项删除按钮 -->
              <div v-if="isOwnPortfolio" class="absolute bottom-2 right-2">
                <button
                  @click.stop="deletePortfolioItem(item)"
                  class="bg-red-500 text-white rounded-full p-1 hover:bg-red-600 focus:outline-none"
                  title="删除作品项"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-4 w-4"
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
            </div>
          </div>
        </div>
      </div>
    </template>

    <!-- 上传照片模态框 -->
    <div
      v-if="showUploadModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <div class="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div class="p-6">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-xl font-bold text-neutral-dark">上传摄影作品</h2>
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
          <form @submit.prevent="uploadPhotographyImages">
            <!-- 错误提示 -->
            <div v-if="uploadError" class="mb-4 p-3 bg-error bg-opacity-10 text-error rounded-md">
              {{ uploadError }}
            </div>

            <!-- 图片上传区域 -->
            <div class="mb-4">
              <label class="block text-sm font-medium text-neutral-dark mb-1">
                照片 <span class="text-error">*</span>
              </label>
              <div class="border-2 border-dashed border-neutral rounded-md p-4 text-center">
                <!-- 显示多个图片预览 -->
                <div v-if="selectedFiles.length > 0" class="grid grid-cols-2 gap-2 mb-2">
                  <div v-for="(file, index) in selectedFiles" :key="index" class="relative">
                    <img
                      :src="filePreviewUrls[index]"
                      class="max-h-40 mx-auto object-cover"
                      :alt="`预览 ${index + 1}`"
                    />
                    <button
                      type="button"
                      @click="removeFile(index)"
                      class="absolute top-0 right-0 bg-error text-white rounded-full p-1"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-4 w-4"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                          clip-rule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
                <label class="cursor-pointer flex flex-col items-center justify-center py-4">
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
                  <span class="text-neutral-dark">点击选择照片（可多选）</span>
                  <input
                    type="file"
                    ref="imageInput"
                    @change="handleImagesChange"
                    accept="image/*"
                    class="hidden"
                    multiple
                    required
                  />
                </label>
                <div v-if="selectedFiles.length > 0" class="mt-2 text-sm text-primary">
                  已选择 {{ selectedFiles.length }} 张照片
                </div>
              </div>
            </div>

            <!-- 公共标题 (所有图片) -->
            <div class="mb-4">
              <label for="title" class="block text-sm font-medium text-neutral-dark mb-1">
                公共标题 (可选)
              </label>
              <input
                type="text"
                id="title"
                v-model="uploadForm.title"
                class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="输入作品标题（将应用于所有图片）"
              />
            </div>

            <!-- 公共描述 (所有图片) -->
            <div class="mb-4">
              <label for="description" class="block text-sm font-medium text-neutral-dark mb-1">
                公共描述 (可选)
              </label>
              <textarea
                id="description"
                v-model="uploadForm.description"
                class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                rows="3"
                placeholder="描述拍摄过程或特点（将应用于所有图片）"
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
                :disabled="isUploading || selectedFiles.length === 0"
              >
                <span v-if="isUploading">上传中... ({{ uploadProgressText }})</span>
                <span v-else>上传作品</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- 添加封面上传模态框 -->
    <div
      v-if="showCoverUploadModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <div class="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div class="p-6">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-xl font-bold text-neutral-dark">上传作品集封面</h2>
            <button @click="closeCoverUploadModal" class="text-neutral-dark hover:text-error">
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

          <!-- 封面上传表单 -->
          <form @submit.prevent="uploadCoverImage">
            <!-- 错误提示 -->
            <div
              v-if="coverUploadError"
              class="mb-4 p-3 bg-error bg-opacity-10 text-error rounded-md"
            >
              {{ coverUploadError }}
            </div>

            <!-- 封面图片 -->
            <div class="mb-4">
              <label class="block text-sm font-medium text-neutral-dark mb-1">
                封面图片 <span class="text-error">*</span>
              </label>
              <div class="border-2 border-dashed border-neutral rounded-md p-4 text-center">
                <div v-if="coverImagePreview" class="mb-2">
                  <img :src="coverImagePreview" class="max-h-40 mx-auto" alt="封面预览" />
                  <button
                    type="button"
                    @click="removeCover"
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
                  <span class="text-neutral-dark">点击选择封面图片</span>
                  <input
                    type="file"
                    ref="coverImageInput"
                    @change="handleCoverImageChange"
                    accept="image/*"
                    class="hidden"
                    required
                  />
                </label>
              </div>
              <p class="text-xs text-neutral-dark mt-1">
                建议选择横向图片，比例16:9最佳，最大文件大小5MB
              </p>
            </div>

            <!-- 按钮区域 -->
            <div class="flex justify-end space-x-3 mt-6">
              <button
                type="button"
                @click="closeCoverUploadModal"
                class="px-4 py-2 border border-neutral-dark text-neutral-dark rounded-md hover:bg-neutral hover:bg-opacity-10"
              >
                取消
              </button>
              <button
                type="submit"
                class="px-4 py-2 bg-primary text-white rounded-md hover:bg-green-dark"
                :disabled="isCoverUploading || !coverImage"
              >
                <span v-if="isCoverUploading">上传中...</span>
                <span v-else>上传封面</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- 添加删除确认模态框 -->
    <div
      v-if="showDeleteModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <div class="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div class="p-6">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-xl font-bold text-neutral-dark">确认删除作品集</h2>
            <button @click="closeDeleteModal" class="text-neutral-dark hover:text-error">
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

          <div class="mb-6">
            <div class="bg-error bg-opacity-10 p-4 rounded-md mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-6 w-6 text-error mx-auto mb-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <p class="text-center text-error font-medium">此操作不可撤销</p>
            </div>

            <p class="text-neutral-dark mb-2">
              您确定要删除作品集 <span class="font-bold">{{ portfolio?.title }}</span> 吗？
            </p>
            <p class="text-sm text-neutral-dark">
              删除作品集将同时删除其中包含的所有作品，这些数据将无法恢复。
            </p>
          </div>

          <!-- 错误提示 -->
          <div v-if="deleteError" class="mb-4 p-3 bg-error bg-opacity-10 text-error rounded-md">
            {{ deleteError }}
          </div>

          <!-- 按钮区域 -->
          <div class="flex justify-end space-x-3">
            <button
              type="button"
              @click="closeDeleteModal"
              class="px-4 py-2 border border-neutral-dark text-neutral-dark rounded-md hover:bg-neutral hover:bg-opacity-10"
            >
              取消
            </button>
            <button
              type="button"
              @click="confirmDelete"
              class="px-4 py-2 bg-error text-white rounded-md hover:bg-opacity-80"
              :disabled="isDeleting"
            >
              <span v-if="isDeleting">删除中...</span>
              <span v-else>确认删除</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 添加编辑作品集模态框 -->
    <div
      v-if="showEditModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <div class="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div class="p-6">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-xl font-bold text-neutral-dark">编辑作品集</h2>
            <button @click="closeEditModal" class="text-neutral-dark hover:text-error">
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

          <!-- 编辑表单 -->
          <form @submit.prevent="submitEditForm">
            <!-- 错误提示 -->
            <div v-if="editError" class="mb-4 p-3 bg-error bg-opacity-10 text-error rounded-md">
              {{ editError }}
            </div>

            <!-- 作品集标题 -->
            <div class="mb-4">
              <label for="edit-title" class="block text-sm font-medium text-neutral-dark mb-1">
                作品集标题 <span class="text-error">*</span>
              </label>
              <input
                type="text"
                id="edit-title"
                v-model="editForm.title"
                class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="输入作品集标题"
                required
              />
            </div>

            <!-- 作品集描述 -->
            <div class="mb-4">
              <label
                for="edit-description"
                class="block text-sm font-medium text-neutral-dark mb-1"
              >
                作品集描述
              </label>
              <textarea
                id="edit-description"
                v-model="editForm.description"
                class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                rows="4"
                placeholder="描述你的作品集..."
              ></textarea>
            </div>

            <!-- 作品集分类 -->
            <div class="mb-4">
              <label for="edit-category" class="block text-sm font-medium text-neutral-dark mb-1">
                作品集分类 <span class="text-error">*</span>
              </label>
              <select
                id="edit-category"
                v-model="editForm.category"
                class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                required
              >
                <option value="Portrait">人像摄影</option>
                <option value="Wedding">婚礼摄影</option>
                <option value="Fashion">时尚摄影</option>
                <option value="Product">产品摄影</option>
                <option value="Event">活动摄影</option>
                <option value="Landscape">风景摄影</option>
                <option value="Street">街头摄影</option>
                <option value="Architecture">建筑摄影</option>
                <option value="Food">美食摄影</option>
                <option value="Other">其他</option>
              </select>
            </div>

            <!-- 拍摄地点 -->
            <div class="mb-4">
              <label for="edit-location" class="block text-sm font-medium text-neutral-dark mb-1">
                拍摄地点
              </label>
              <input
                type="text"
                id="edit-location"
                v-model="editForm.location"
                class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="输入拍摄地点"
              />
            </div>

            <!-- 公开状态 -->
            <div class="mb-6">
              <label class="flex items-center">
                <input
                  type="checkbox"
                  v-model="editForm.isPublic"
                  class="h-4 w-4 text-primary rounded focus:ring-primary border-gray-300"
                />
                <span class="ml-2 text-sm text-neutral-dark">公开作品集</span>
              </label>
              <p class="text-xs text-neutral-dark mt-1">
                公开的作品集将在平台上展示，所有用户都可以查看
              </p>
            </div>

            <!-- 按钮区域 -->
            <div class="flex justify-end space-x-3 mt-6">
              <button
                type="button"
                @click="closeEditModal"
                class="px-4 py-2 border border-neutral-dark text-neutral-dark rounded-md hover:bg-neutral hover:bg-opacity-10"
              >
                取消
              </button>
              <button
                type="submit"
                class="px-4 py-2 bg-primary text-white rounded-md hover:bg-green-dark"
                :disabled="isEditing"
              >
                <span v-if="isEditing">保存中...</span>
                <span v-else>保存修改</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- 照片详情模态框 -->
    <div
      v-if="selectedPhoto && showPhotoModal"
      class="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center p-4 md:p-8"
    >
      <div class="bg-white rounded-lg w-full max-w-4xl max-h-full overflow-hidden flex flex-col">
        <div class="flex justify-between items-center p-4 border-b">
          <!-- <h3 class="font-semibold text-lg text-neutral-dark">
            {{ selectedPhoto.title || '照片详情' }}
          </h3> -->
          <button @click="closePhotoModal" class="text-neutral-dark hover:text-error">
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
        <div class="flex-1 overflow-auto p-4">
          <div class="flex flex-col md:flex-row gap-6">
            <div class="md:w-2/3 bg-neutral-dark bg-opacity-10 rounded-lg overflow-hidden">
              <img
                :src="selectedPhoto ? getImageUrl(selectedPhoto.imageUrl) : ''"
                class="w-full h-auto"
                alt="照片详情"
              />
            </div>
            <div class="md:w-1/3">
              <!-- <h4 class="font-medium text-neutral-dark">{{ selectedPhoto.title || '无标题' }}</h4>
              <p class="mt-2 text-neutral-dark">{{ selectedPhoto.description || '无描述' }}</p>

              <div class="mt-4 pt-4 border-t">
                <p v-if="selectedPhoto.metadata" class="text-sm text-neutral-dark">
                  <span class="font-medium">元数据:</span> {{ selectedPhoto.metadata }}
                </p>
                <p class="text-sm text-neutral-dark mt-2">
                  <span class="font-medium">上传时间:</span>
                  {{ formatDate(selectedPhoto.createdAt) }}
                </p>
              </div> -->

              <!-- 照片操作按钮 - 只显示删除按钮 -->
              <div v-if="isOwnPortfolio" class="mt-6 space-y-2">
                <!-- 移除"设为封面"按钮 -->
                <button
                  @click="deletePhoto(selectedPhoto)"
                  class="w-full px-4 py-2 border border-error text-error rounded-md hover:bg-error hover:bg-opacity-10 transition-colors flex items-center justify-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-4 w-4 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                  删除照片
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted, onClickOutside } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '../stores/userStore'
import { photographerPortfolioAPI } from '../services/apiService'
import { getAssetUrl } from '../utils/urlUtils'

export default defineComponent({
  name: 'PhotographerPortfolioDetailView',
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
    const portfolio = ref<any | null>(null)

    // 照片详情模态框
    const selectedPhoto = ref<any>(null)
    const showPhotoModal = ref(false)

    // 上传模态框
    const showUploadModal = ref(false)
    const isUploading = ref(false)
    const uploadError = ref('')
    const imageInput = ref<HTMLInputElement | null>(null)

    // 新增变量用于多图片上传
    const selectedFiles = ref<File[]>([])
    const filePreviewUrls = ref<string[]>([])
    const uploadProgressText = ref('')

    // 上传表单数据
    const uploadForm = ref({
      title: '',
      description: '',
      metadata: '',
    })

    // 下拉菜单状态
    const showMoreOptions = ref(false)

    // 封面上传相关状态
    const showCoverUploadModal = ref(false)
    const isCoverUploading = ref(false)
    const coverUploadError = ref('')
    const coverImagePreview = ref('')
    const coverImage = ref<File | null>(null)
    const coverImageInput = ref<HTMLInputElement | null>(null)

    // 删除相关状态
    const showDeleteModal = ref(false)
    const isDeleting = ref(false)
    const deleteError = ref('')

    // 编辑模态框相关状态
    const showEditModal = ref(false)
    const isEditing = ref(false)
    const editError = ref('')
    const editForm = ref({
      title: '',
      description: '',
      category: '',
      location: '',
      isPublic: false,
    })

    // 获取作品集详情
    const fetchPortfolioDetails = async () => {
      const portfolioId = Number(route.params.id)
      if (!portfolioId) {
        error.value = '无效的作品集ID'
        loading.value = false
        return
      }

      try {
        console.log(`获取作品集详情，ID: ${portfolioId}`)
        loading.value = true
        const response = await photographerPortfolioAPI.getPortfolioById(portfolioId)
        portfolio.value = response.data
        console.log('作品集详情获取成功:', portfolio.value.title)

        // 调试信息 - 打印ID比较
        if (isDevelopment.value) {
          console.log('==== ID 比较调试 ====')
          console.log(
            '作品集摄影师ID:',
            portfolio.value.photographerId,
            typeof portfolio.value.photographerId,
          )
          console.log('用户摄影师ID:', userStore.photographerId, typeof userStore.photographerId)
          console.log('直接比较:', portfolio.value.photographerId === userStore.photographerId)
          console.log(
            '数值比较:',
            Number(portfolio.value.photographerId) === Number(userStore.photographerId),
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

    // 是否是作品集所有者
    const isOwnPortfolio = computed(() => {
      return (
        userStore.isPhotographer &&
        portfolio.value &&
        Number(portfolio.value.photographerId) === Number(userStore.photographerId)
      )
    })

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
        Portrait: '人像摄影',
        Wedding: '婚礼摄影',
        Landscape: '风景摄影',
        Street: '街头摄影',
        Product: '产品摄影',
        Fashion: '时尚摄影',
        Food: '美食摄影',
        Architecture: '建筑摄影',
        Event: '活动摄影',
        Other: '其他',
      }

      return categoryMap[category] || category
    }

    // 处理图片URL
    const getImageUrl = (url: string | null) => {
      return getAssetUrl(url)
    }

    // 关闭上传模态框
    const closeUploadModal = () => {
      showUploadModal.value = false
      resetUploadForm()
    }

    // 重置上传表单
    const resetUploadForm = () => {
      uploadForm.value = {
        title: '',
        description: '',
        metadata: '',
      }
      // 清除所有选择的文件和预览
      selectedFiles.value = []
      filePreviewUrls.value = []
      uploadError.value = ''
      uploadProgressText.value = ''
    }

    // 处理多图片选择
    const handleImagesChange = (event: Event) => {
      const input = event.target as HTMLInputElement
      if (input.files && input.files.length > 0) {
        // 将FileList转换为数组
        const newFiles = Array.from(input.files)

        // 为每个文件创建预览URL
        newFiles.forEach((file) => {
          selectedFiles.value.push(file)

          const reader = new FileReader()
          reader.onload = (e) => {
            filePreviewUrls.value.push(e.target?.result as string)
          }
          reader.readAsDataURL(file)
        })
      }
    }

    // 移除单个文件
    const removeFile = (index: number) => {
      selectedFiles.value.splice(index, 1)
      filePreviewUrls.value.splice(index, 1)

      // 如果移除后没有文件了，清空input
      if (selectedFiles.value.length === 0 && imageInput.value) {
        imageInput.value.value = ''
      }
    }

    // 批量上传图片
    const uploadPhotographyImages = async () => {
      if (!portfolio.value) return

      // 验证必须有图片
      if (selectedFiles.value.length === 0) {
        uploadError.value = '请至少选择一张照片'
        return
      }

      try {
        isUploading.value = true
        uploadError.value = ''
        uploadProgressText.value = '准备中...'

        const portfolioId = portfolio.value.portfolioId
        const formData = new FormData()

        // 添加所有选择的图片
        selectedFiles.value.forEach((file, index) => {
          formData.append('files', file)
        })

        // 添加标题和描述（可选）
        if (uploadForm.value.title) {
          formData.append('title', uploadForm.value.title)
        }

        if (uploadForm.value.description) {
          formData.append('description', uploadForm.value.description)
        }

        if (uploadForm.value.metadata) {
          formData.append('metadata', uploadForm.value.metadata)
        }

        console.log(`准备批量上传 ${selectedFiles.value.length} 张照片到作品集 #${portfolioId}`)
        uploadProgressText.value = `上传中 (0/${selectedFiles.value.length})`

        // 发送API请求 - 使用批量上传端点
        const response = await photographerPortfolioAPI.uploadPhoto(portfolioId, formData)
        console.log('批量上传成功:', response.data)

        // 关闭模态框
        closeUploadModal()

        // 刷新作品集详情
        await fetchPortfolioDetails()
      } catch (err: any) {
        console.error('上传照片失败:', err)

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
        uploadProgressText.value = ''
      }
    }

    // 处理封面图片选择
    const handleCoverImageChange = (event: Event) => {
      const input = event.target as HTMLInputElement
      if (input.files && input.files[0]) {
        const file = input.files[0]

        // 验证文件大小（最大5MB）
        if (file.size > 5 * 1024 * 1024) {
          coverUploadError.value = '图片大小不能超过5MB'
          return
        }

        coverImage.value = file

        // 创建预览
        const reader = new FileReader()
        reader.onload = (e) => {
          coverImagePreview.value = e.target?.result as string
        }
        reader.readAsDataURL(file)
      }
    }

    // 移除封面图片
    const removeCover = () => {
      coverImage.value = null
      coverImagePreview.value = ''
      if (coverImageInput.value) {
        coverImageInput.value.value = ''
      }
    }

    // 关闭封面上传模态框
    const closeCoverUploadModal = () => {
      showCoverUploadModal.value = false
      coverImage.value = null
      coverImagePreview.value = ''
      coverUploadError.value = ''
    }

    // 上传封面图片
    const uploadCoverImage = async () => {
      if (!portfolio.value || !coverImage.value) {
        coverUploadError.value = '请选择封面图片'
        return
      }

      try {
        isCoverUploading.value = true
        coverUploadError.value = ''

        const portfolioId = portfolio.value.portfolioId

        console.log(`准备上传封面图片到作品集 #${portfolioId}`)

        // 调用API上传封面
        await photographerPortfolioAPI.uploadCover(portfolioId, coverImage.value)
        console.log('封面上传成功')

        // 关闭模态框
        closeCoverUploadModal()

        // 刷新作品集详情
        await fetchPortfolioDetails()
      } catch (err: any) {
        console.error('上传封面图片失败:', err)

        if (err.response?.status === 401) {
          coverUploadError.value = '登录已过期，请重新登录'
        } else if (err.response?.status === 403) {
          coverUploadError.value = '您没有权限上传到此作品集'
        } else if (err.response?.status === 400) {
          coverUploadError.value = err.response.data.message || '请求参数错误'
        } else {
          coverUploadError.value = '上传失败，请稍后再试'
        }
      } finally {
        isCoverUploading.value = false
      }
    }

    // 打开删除确认模态框
    const openDeleteConfirmation = () => {
      showDeleteModal.value = true
      showMoreOptions.value = false
    }

    // 关闭删除确认模态框
    const closeDeleteModal = () => {
      showDeleteModal.value = false
      deleteError.value = ''
    }

    // 确认删除作品集
    const confirmDelete = async () => {
      if (!portfolio.value) return

      try {
        isDeleting.value = true
        deleteError.value = ''

        const portfolioId = portfolio.value.portfolioId

        console.log(`准备删除作品集 #${portfolioId}`)

        // 调用API删除作品集
        await photographerPortfolioAPI.deletePortfolio(portfolioId)
        console.log('作品集删除成功')

        // 关闭模态框并跳转回作品集列表页面
        closeDeleteModal()
        router.push('/portfolio')
      } catch (err: any) {
        console.error('删除作品集失败:', err)

        if (err.response?.status === 401) {
          deleteError.value = '登录已过期，请重新登录'
        } else if (err.response?.status === 403) {
          deleteError.value = '您没有权限删除此作品集'
        } else {
          deleteError.value = '删除失败，请稍后再试'
        }
      } finally {
        isDeleting.value = false
      }
    }

    // 打开编辑模态框
    const openEditModal = () => {
      if (!portfolio.value) return

      // 填充表单数据
      editForm.value = {
        title: portfolio.value.title,
        description: portfolio.value.description || '',
        category: portfolio.value.category,
        location: portfolio.value.location || '',
        isPublic: portfolio.value.isPublic,
      }

      showEditModal.value = true
      showMoreOptions.value = false
    }

    // 关闭编辑模态框
    const closeEditModal = () => {
      showEditModal.value = false
      editError.value = ''
    }

    // 提交编辑表单
    const submitEditForm = async () => {
      if (!portfolio.value) return

      try {
        isEditing.value = true
        editError.value = ''

        const portfolioId = portfolio.value.portfolioId

        // 确保至少填写了必填字段
        if (!editForm.value.title.trim()) {
          editError.value = '作品集标题不能为空'
          isEditing.value = false
          return
        }

        console.log(`准备更新作品集 #${portfolioId} 的信息`, editForm.value)

        // 调用API更新作品集
        await photographerPortfolioAPI.updatePortfolio(portfolioId, {
          title: editForm.value.title,
          description: editForm.value.description,
          category: editForm.value.category,
          location: editForm.value.location,
          isPublic: editForm.value.isPublic,
        })

        console.log('作品集更新成功')

        // 关闭模态框
        closeEditModal()

        // 重新获取作品集数据以显示最新信息
        await fetchPortfolioDetails()
      } catch (err: any) {
        console.error('更新作品集失败:', err)

        if (err.response?.status === 401) {
          editError.value = '登录已过期，请重新登录'
        } else if (err.response?.status === 403) {
          editError.value = '您没有权限编辑此作品集'
        } else if (err.response?.status === 400) {
          editError.value = err.response.data.message || '请求参数错误'
        } else {
          editError.value = '更新失败，请稍后再试'
        }
      } finally {
        isEditing.value = false
      }
    }

    // 设置照片为封面
    const setAsCover = async (photo: any) => {
      if (!portfolio.value || !photo || photo.isPortfolioCover) return

      try {
        console.log(`设置照片 #${photo.itemId} 为封面`)

        // 调用API设置封面
        await photographerPortfolioAPI.setItemAsCover(portfolio.value.portfolioId, photo.itemId)
        console.log('封面设置成功')

        // 关闭照片详情模态框
        showPhotoModal.value = false

        // 刷新作品集详情
        await fetchPortfolioDetails()
      } catch (err: any) {
        console.error('设置封面失败:', err)
        alert('设置封面失败，请稍后再试')
      }
    }

    // 删除照片
    const deletePhoto = async (photo: any) => {
      if (!portfolio.value || !photo) return

      if (!confirm('确定要删除此照片吗？此操作无法撤销。')) {
        return
      }

      try {
        console.log(`删除照片 #${photo.itemId}`)

        // 调用API删除照片
        await photographerPortfolioAPI.deletePortfolioItem(photo.itemId)
        console.log('照片删除成功')

        // 关闭照片详情模态框
        showPhotoModal.value = false

        // 刷新作品集详情
        await fetchPortfolioDetails()
      } catch (err: any) {
        console.error('删除照片失败:', err)
        alert('删除照片失败，请稍后再试')
      }
    }

    // 打开照片详情模态框
    const openPhotoDetail = (photo: any) => {
      selectedPhoto.value = photo
      showPhotoModal.value = true
    }

    // 关闭照片详情模态框
    const closePhotoModal = () => {
      showPhotoModal.value = false
      setTimeout(() => {
        selectedPhoto.value = null
      }, 300)
    }

    // 打开封面上传模态框
    const openCoverUpload = () => {
      showCoverUploadModal.value = true
      showMoreOptions.value = false
    }

    // 删除作品项的函数
    const deletePortfolioItem = async (item: any) => {
      if (!confirm('确定要删除该作品项吗？此操作不可撤销。')) return
      try {
        console.log(`删除作品项：${item.itemId}`)
        await photographerPortfolioAPI.deletePortfolioItem(item.itemId)
        alert('作品项删除成功')
        await fetchPortfolioDetails()
      } catch (err: any) {
        console.error('删除作品项失败:', err)
        alert('删除作品项失败，请稍后再试')
      }
    }

    // 点击外部关闭下拉菜单
    onMounted(() => {
      document.addEventListener('click', (event) => {
        const target = event.target as HTMLElement
        if (!target.closest('.relative') && showMoreOptions.value) {
          showMoreOptions.value = false
        }
      })
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
            photographerId: userStore.photographerId,
          })
        }

        // 第二步：如果是摄影师但没有ID，尝试获取ID
        if (userStore.isAuthenticated && userStore.isPhotographer && !userStore.photographerId) {
          console.log('是摄影师但ID未设置，尝试获取摄影师ID')
          if (userStore.userInfo?.userId) {
            await userStore.fetchUserRoleIds(userStore.userInfo.userId)
            console.log('获取摄影师ID后:', userStore.photographerId)
          } else {
            console.error('无法获取摄影师ID：用户ID不存在')
          }
        }

        // 第三步：获取作品集详情
        await fetchPortfolioDetails()
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
        console.log('是否是摄影师:', userStore.isPhotographer)
        console.log('摄影师ID:', userStore.photographerId, typeof userStore.photographerId)
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
      // 调试变量
      isDevelopment,
      forceOwnership,
      // 上传相关属性和方法
      showUploadModal,
      isUploading,
      uploadError,
      imageInput,
      uploadForm,
      closeUploadModal,
      uploadPhotographyImages, // 更新为批量上传函数
      selectedFiles, // 新增
      filePreviewUrls, // 新增
      handleImagesChange, // 新增
      removeFile, // 新增
      uploadProgressText, // 新增
      // 下拉菜单相关
      showMoreOptions,
      // 封面上传相关
      showCoverUploadModal,
      isCoverUploading,
      coverUploadError,
      coverImagePreview,
      coverImage,
      coverImageInput,
      handleCoverImageChange,
      removeCover,
      closeCoverUploadModal,
      uploadCoverImage,
      openCoverUpload,
      // 删除相关
      showDeleteModal,
      isDeleting,
      deleteError,
      openDeleteConfirmation,
      closeDeleteModal,
      confirmDelete,
      // 编辑作品集相关
      showEditModal,
      isEditing,
      editError,
      editForm,
      openEditModal,
      closeEditModal,
      submitEditForm,
      // 照片详情相关
      selectedPhoto,
      showPhotoModal,
      openPhotoDetail,
      closePhotoModal,
      // 照片操作相关
      isOwnPortfolio,
      setAsCover,
      deletePhoto,
      deletePortfolioItem, // added delete method
    }
  },
})
</script>
