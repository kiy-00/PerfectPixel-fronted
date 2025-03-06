<template>
  <div class="booking-calendar">
    <!-- 日历头部控制区 -->
    <div class="flex items-center justify-between mb-6">
      <div class="flex items-center">
        <h2 class="text-xl font-semibold text-neutral-dark">{{ currentMonthYear }}</h2>
        <div class="relative ml-4">
          <button
            @click="showMonthPicker = !showMonthPicker"
            class="inline-flex items-center px-3 py-1.5 border border-green-light rounded-md text-sm font-medium text-neutral-dark hover:bg-green-light hover:bg-opacity-10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            选择月份
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-4 w-4 ml-1"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clip-rule="evenodd"
              />
            </svg>
          </button>

          <!-- 月份选择器下拉菜单 -->
          <div
            v-if="showMonthPicker"
            class="absolute z-10 mt-1 w-56 bg-white shadow-lg rounded-md ring-1 ring-black ring-opacity-5 p-2"
          >
            <div class="grid grid-cols-3 gap-2">
              <button
                v-for="(month, index) in months"
                :key="index"
                @click="selectMonth(index)"
                :class="[
                  'px-2 py-1.5 text-sm rounded-md',
                  currentMonth === index
                    ? 'bg-primary text-white'
                    : 'text-neutral-dark hover:bg-green-light hover:bg-opacity-20',
                ]"
              >
                {{ month }}
              </button>
            </div>
            <div class="flex justify-between mt-2 pt-2 border-t border-green-light">
              <button
                @click="changeYear(-1)"
                class="px-2 py-1 text-sm text-neutral-dark hover:text-primary"
              >
                上一年
              </button>
              <span class="px-2 py-1 text-sm font-medium">{{ currentYear }}</span>
              <button
                @click="changeYear(1)"
                class="px-2 py-1 text-sm text-neutral-dark hover:text-primary"
              >
                下一年
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="flex space-x-2">
        <button
          @click="prevMonth"
          class="p-2 rounded-full text-neutral-dark hover:bg-green-light hover:bg-opacity-10 focus:outline-none"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
              clip-rule="evenodd"
            />
          </svg>
        </button>
        <button
          @click="currentDate = new Date()"
          class="px-3 py-1 text-sm rounded-md text-neutral-dark hover:bg-green-light hover:bg-opacity-10 focus:outline-none"
        >
          今天
        </button>
        <button
          @click="nextMonth"
          class="p-2 rounded-full text-neutral-dark hover:bg-green-light hover:bg-opacity-10 focus:outline-none"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
              clip-rule="evenodd"
            />
          </svg>
        </button>
      </div>
    </div>

    <!-- 日历主体 -->
    <div class="bg-white rounded-lg overflow-hidden">
      <!-- 星期表头 -->
      <div class="grid grid-cols-7 border-b border-green-light">
        <div
          v-for="day in weekdays"
          :key="day"
          class="px-2 py-3 text-center text-sm font-medium text-neutral-dark"
        >
          {{ day }}
        </div>
      </div>

      <!-- 日期网格 -->
      <div class="grid grid-cols-7 auto-rows-fr border-b border-green-light">
        <div
          v-for="(date, index) in calendarDays"
          :key="index"
          :class="[
            'relative px-2 py-3 border-r border-t border-green-light',
            (index + 1) % 7 === 0 ? 'border-r-0' : '',
            date.isCurrentMonth
              ? 'bg-white'
              : 'bg-neutral bg-opacity-30 text-neutral-dark text-opacity-60',
            isToday(date.date) ? 'bg-green-light bg-opacity-10' : '',
            hasBooking(date.date) ? 'booking-date' : '',
          ]"
        >
          <div class="flex items-center justify-between">
            <span
              :class="[
                'text-sm font-medium',
                date.isCurrentMonth ? 'text-neutral-dark' : 'text-neutral-dark text-opacity-50',
                isToday(date.date) ? 'text-primary' : '',
              ]"
            >
              {{ date.date.getDate() }}
            </span>

            <!-- 预约指示器 -->
            <div v-if="hasBooking(date.date)" class="h-2 w-2 rounded-full bg-primary"></div>
          </div>

          <!-- 预约内容 -->
          <div v-if="hasBooking(date.date)" class="mt-1">
            <div
              v-for="(booking, bookingIndex) in getBookingsForDate(date.date)"
              :key="bookingIndex"
              class="text-xs py-0.5 px-1.5 mb-1 rounded truncate bg-primary bg-opacity-10 text-primary border-l-2 border-primary"
            >
              {{ booking.title }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 预约指示说明 -->
    <div class="flex justify-end items-center mt-4">
      <div class="flex items-center text-xs text-neutral-dark">
        <span class="inline-block h-3 w-3 rounded-full bg-primary mr-1"></span>
        有预约
      </div>
      <div class="flex items-center text-xs text-neutral-dark ml-4">
        <span class="inline-block h-3 w-3 rounded-full bg-green-light mr-1"></span>
        今天
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, watch } from 'vue'

export default defineComponent({
  name: 'BookingCalendar',
  setup() {
    // 当前日期和月份
    const currentDate = ref(new Date())
    const showMonthPicker = ref(false)

    // 星期和月份名称
    const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
    const months = [
      '一月',
      '二月',
      '三月',
      '四月',
      '五月',
      '六月',
      '七月',
      '八月',
      '九月',
      '十月',
      '十一月',
      '十二月',
    ]

    // 计算属性：当前年月
    const currentYear = computed(() => currentDate.value.getFullYear())
    const currentMonth = computed(() => currentDate.value.getMonth())
    const currentMonthYear = computed(() => {
      return `${currentYear.value}年${currentMonth.value + 1}月`
    })

    // 日历天数计算
    const calendarDays = computed(() => {
      const year = currentYear.value
      const month = currentMonth.value

      // 获取当月第一天和最后一天
      const firstDay = new Date(year, month, 1)
      const lastDay = new Date(year, month + 1, 0)

      // 计算需要显示的上个月的天数
      const daysFromPrevMonth = firstDay.getDay()

      // 计算需要显示的下个月的天数
      const daysInMonth = lastDay.getDate()
      const totalDaysToShow = Math.ceil((daysFromPrevMonth + daysInMonth) / 7) * 7
      const daysFromNextMonth = totalDaysToShow - daysFromPrevMonth - daysInMonth

      // 生成日历数据
      const calendarDays = []

      // 添加上个月的日期
      const prevMonth = month === 0 ? 11 : month - 1
      const prevMonthYear = month === 0 ? year - 1 : year
      const prevMonthLastDay = new Date(prevMonthYear, prevMonth + 1, 0).getDate()

      for (let i = prevMonthLastDay - daysFromPrevMonth + 1; i <= prevMonthLastDay; i++) {
        calendarDays.push({
          date: new Date(prevMonthYear, prevMonth, i),
          isCurrentMonth: false,
        })
      }

      // 添加当月的日期
      for (let i = 1; i <= daysInMonth; i++) {
        calendarDays.push({
          date: new Date(year, month, i),
          isCurrentMonth: true,
        })
      }

      // 添加下个月的日期
      const nextMonth = month === 11 ? 0 : month + 1
      const nextMonthYear = month === 11 ? year + 1 : year

      for (let i = 1; i <= daysFromNextMonth; i++) {
        calendarDays.push({
          date: new Date(nextMonthYear, nextMonth, i),
          isCurrentMonth: false,
        })
      }

      return calendarDays
    })

    // 导航至前一个月
    const prevMonth = () => {
      const newDate = new Date(currentDate.value)
      newDate.setMonth(newDate.getMonth() - 1)
      currentDate.value = newDate
    }

    // 导航至后一个月
    const nextMonth = () => {
      const newDate = new Date(currentDate.value)
      newDate.setMonth(newDate.getMonth() + 1)
      currentDate.value = newDate
    }

    // 选择月份
    const selectMonth = (month: number) => {
      const newDate = new Date(currentDate.value)
      newDate.setMonth(month)
      currentDate.value = newDate
      showMonthPicker.value = false
    }

    // 改变年份
    const changeYear = (delta: number) => {
      const newDate = new Date(currentDate.value)
      newDate.setFullYear(newDate.getFullYear() + delta)
      currentDate.value = newDate
    }

    // 检查是否为今天
    const isToday = (date: Date) => {
      const today = new Date()
      return (
        date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear()
      )
    }

    // 模拟预约数据
    const bookings = ref([
      {
        id: 1,
        title: '人像写真',
        date: '2025-03-10',
        time: '14:00-16:00',
      },
      {
        id: 2,
        title: '产品样片',
        date: '2025-03-10',
        time: '09:30-11:30',
      },
      {
        id: 3,
        title: '婚纱外景',
        date: '2025-03-20',
        time: '15:00-18:00',
      },
      {
        id: 4,
        title: '时尚写真',
        date: '2025-03-15',
        time: '13:00-15:00',
      },
    ])

    // 检查日期是否有预约
    const hasBooking = (date: Date) => {
      const dateString = formatDate(date)
      return bookings.value.some((booking) => booking.date === dateString)
    }

    // 获取日期的预约
    const getBookingsForDate = (date: Date) => {
      const dateString = formatDate(date)
      return bookings.value.filter((booking) => booking.date === dateString)
    }

    // 日期格式化函数
    const formatDate = (date: Date) => {
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      return `${year}-${month}-${day}`
    }

    // 点击外部关闭月份选择器
    const closeMonthPicker = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (showMonthPicker.value && !target.closest('.relative')) {
        showMonthPicker.value = false
      }
    }

    // 添加和移除事件监听器
    watch(showMonthPicker, (value) => {
      if (value) {
        document.addEventListener('click', closeMonthPicker)
      } else {
        document.removeEventListener('click', closeMonthPicker)
      }
    })

    return {
      currentDate,
      currentYear,
      currentMonth,
      currentMonthYear,
      showMonthPicker,
      weekdays,
      months,
      calendarDays,
      prevMonth,
      nextMonth,
      selectMonth,
      changeYear,
      isToday,
      hasBooking,
      getBookingsForDate,
    }
  },
})
</script>

<style scoped>
.booking-date {
  position: relative;
}

.booking-date::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 3px;
  background-color: #2e8b57; /* primary color */
  opacity: 0.5;
}
</style>
