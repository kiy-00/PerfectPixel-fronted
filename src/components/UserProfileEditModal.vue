<template>
  <div v-if="isOpen" class="fixed inset-0 overflow-y-auto z-50">
    <div
      class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0"
    >
      <!-- 背景遮罩 -->
      <div class="fixed inset-0 transition-opacity" aria-hidden="true">
        <div class="absolute inset-0 bg-gray-500 opacity-75" @click="closeModal"></div>
      </div>

      <!-- 模态框内容 -->
      <div
        class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
      >
        <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
          <div class="sm:flex sm:items-start">
            <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
              <h3 class="text-lg leading-6 font-medium text-gray-900">编辑个人资料</h3>
              <div class="mt-4">
                <form @submit.prevent="saveChanges">
                  <div class="space-y-4">
                    <div class="grid grid-cols-2 gap-4">
                      <div>
                        <label class="block text-sm font-medium text-gray-700">姓</label>
                        <input
                          type="text"
                          v-model="formData.firstName"
                          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                        />
                      </div>
                      <div>
                        <label class="block text-sm font-medium text-gray-700">名</label>
                        <input
                          type="text"
                          v-model="formData.lastName"
                          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                        />
                      </div>
                    </div>

                    <div>
                      <label class="block text-sm font-medium text-gray-700">用户名</label>
                      <input
                        type="text"
                        v-model="formData.username"
                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                      />
                    </div>

                    <div>
                      <label class="block text-sm font-medium text-gray-700">电子邮箱</label>
                      <input
                        type="email"
                        v-model="formData.email"
                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                      />
                    </div>

                    <div>
                      <label class="block text-sm font-medium text-gray-700">手机号码</label>
                      <input
                        type="tel"
                        v-model="formData.phoneNumber"
                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                      />
                    </div>

                    <div>
                      <label class="block text-sm font-medium text-gray-700">个人简介</label>
                      <textarea
                        v-model="formData.biography"
                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                        rows="3"
                      ></textarea>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
        <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
          <button
            @click="saveChanges"
            type="button"
            class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary text-base font-medium text-white hover:bg-green-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary sm:ml-3 sm:w-auto sm:text-sm"
            :disabled="saving"
          >
            <span v-if="saving" class="mr-2">
              <svg
                class="animate-spin h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                ></circle>
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            </span>
            {{ saving ? '保存中...' : '保存' }}
          </button>
          <button
            @click="closeModal"
            type="button"
            class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            :disabled="saving"
          >
            取消
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue'

export default defineComponent({
  name: 'UserProfileEditModal',
  props: {
    isOpen: {
      type: Boolean,
      required: true,
    },
    userData: {
      type: [Object, null],
      required: true,
      default: () => ({}),
    },
  },
  emits: ['close', 'save'],
  setup(props, { emit }) {
    const saving = ref(false)

    // 表单数据
    const formData = ref({
      userId: null,
      username: '',
      email: '',
      firstName: '',
      lastName: '',
      phoneNumber: '',
      biography: '',
      isActive: true,
    })

    // 当模态框打开或数据更改时，初始化表单数据
    watch(
      () => [props.isOpen, props.userData],
      () => {
        if (props.isOpen && props.userData) {
          // 使用现有数据预填表单
          formData.value = {
            userId: props.userData.userId || null,
            username: props.userData.username || '',
            email: props.userData.email || '',
            firstName: props.userData.firstName || '',
            lastName: props.userData.lastName || '',
            phoneNumber: props.userData.phoneNumber || '',
            biography: props.userData.biography || '',
            isActive: props.userData.isActive !== false,
          }
        }
      },
      { immediate: true },
    )

    // 关闭模态框
    const closeModal = () => {
      if (saving.value) return
      emit('close')
    }

    // 保存更改
    const saveChanges = async () => {
      saving.value = true
      try {
        // 触发保存事件并传递表单数据
        await emit('save', formData.value)
        closeModal()
      } catch (error) {
        console.error('保存用户信息时出错:', error)
      } finally {
        saving.value = false
      }
    }

    return {
      formData,
      saving,
      closeModal,
      saveChanges,
    }
  },
})
</script>
