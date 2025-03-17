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
              <h3 class="text-lg leading-6 font-medium text-gray-900">
                {{ modalTitle }}
              </h3>
              <div class="mt-4">
                <form @submit.prevent="saveChanges">
                  <!-- 摄影师表单 -->
                  <div v-if="profileType === 'photographer'" class="space-y-4">
                    <div class="grid grid-cols-1 gap-4">
                      <div>
                        <label class="block text-sm font-medium text-gray-700">摄影经验</label>
                        <textarea
                          v-model="formData.experience"
                          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                          rows="2"
                        ></textarea>
                      </div>

                      <div>
                        <label class="block text-sm font-medium text-gray-700">摄影设备</label>
                        <textarea
                          v-model="formData.equipmentInfo"
                          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                          rows="2"
                        ></textarea>
                      </div>

                      <div>
                        <label class="block text-sm font-medium text-gray-700">常驻地</label>
                        <input
                          type="text"
                          v-model="formData.location"
                          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                        />
                      </div>

                      <div class="grid grid-cols-2 gap-4">
                        <div>
                          <label class="block text-sm font-medium text-gray-700"
                            >最低价格 (¥)</label
                          >
                          <input
                            type="number"
                            v-model="formData.priceRangeMin"
                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                          />
                        </div>
                        <div>
                          <label class="block text-sm font-medium text-gray-700"
                            >最高价格 (¥)</label
                          >
                          <input
                            type="number"
                            v-model="formData.priceRangeMax"
                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- 修图师表单 -->
                  <div v-else-if="profileType === 'retoucher'" class="space-y-4">
                    <div class="grid grid-cols-1 gap-4">
                      <div>
                        <label class="block text-sm font-medium text-gray-700">专业领域</label>
                        <textarea
                          v-model="formData.expertise"
                          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                          rows="2"
                        ></textarea>
                      </div>

                      <div>
                        <label class="block text-sm font-medium text-gray-700">使用软件</label>
                        <textarea
                          v-model="formData.software"
                          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                          rows="2"
                        ></textarea>
                      </div>

                      <div>
                        <label class="block text-sm font-medium text-gray-700">单张价格 (¥)</label>
                        <input
                          type="number"
                          v-model="formData.pricePerPhoto"
                          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                        />
                      </div>
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
          >
            保存
          </button>
          <button
            @click="closeModal"
            type="button"
            class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
          >
            取消
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch, computed } from 'vue'

export default defineComponent({
  name: 'ProfessionalProfileModal',
  props: {
    isOpen: {
      type: Boolean,
      required: true,
    },
    profileType: {
      type: String,
      required: true,
      validator: (value: string) => ['photographer', 'retoucher'].includes(value),
    },
    profileData: {
      type: Object,
      required: true,
    },
  },
  emits: ['close', 'save'],
  setup(props, { emit }) {
    // 表单数据
    const formData = ref({} as any)

    // 当模态框打开或数据更改时，初始化表单数据
    watch(
      () => [props.isOpen, props.profileData],
      () => {
        if (props.isOpen && props.profileData) {
          formData.value = { ...props.profileData }
        }
      },
      { immediate: true },
    )

    // 模态框标题
    const modalTitle = computed(() => {
      return props.profileType === 'photographer' ? '更新摄影师资料' : '更新修图师资料'
    })

    // 关闭模态框
    const closeModal = () => {
      emit('close')
    }

    // 保存更改
    const saveChanges = () => {
      emit('save', formData.value)
      closeModal()
    }

    return {
      formData,
      modalTitle,
      closeModal,
      saveChanges,
    }
  },
})
</script>
