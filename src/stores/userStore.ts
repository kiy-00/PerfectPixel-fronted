import { defineStore } from 'pinia'
import { userAPI } from '../services/apiService'

// 定义用户信息接口
export interface UserInfo {
  userId: number
  username: string
  email: string
  firstName: string | null
  lastName: string | null
  phoneNumber: string | null
  biography: string | null
  roles: string[]
  createdAt: string
  lastLogin: string
  followersCount: number
  followingCount: number
  token?: string
}

export const useUserStore = defineStore('user', {
  state: () => ({
    userInfo: null as UserInfo | null,
    isLoading: false,
    error: null as Error | null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.userInfo,
    isPhotographer: (state) => state.userInfo?.roles.includes('Photographer') || false,
    isRetoucher: (state) => state.userInfo?.roles.includes('Retoucher') || false,
    isAdmin: (state) => state.userInfo?.roles.includes('Admin') || false,
    isRegularUser: (state) => state.userInfo?.roles.includes('Regular') || false,
    userRoles: (state) => state.userInfo?.roles || [],

    // 格式化角色显示
    formattedRoles: (state) => {
      if (!state.userInfo) return '游客'

      const roleMap: Record<string, string> = {
        Regular: '普通用户',
        Admin: '管理员',
        Photographer: '摄影师',
        Retoucher: '修图师',
      }

      // 筛选非普通用户角色
      const nonRegularRoles = state.userInfo.roles.filter((role) => role !== 'Regular')

      if (nonRegularRoles.length > 0) {
        // 如果有非普通用户角色，显示这些角色
        return nonRegularRoles.map((role) => roleMap[role] || role).join('、')
      } else if (state.userInfo.roles.includes('Regular')) {
        // 如果只有普通用户角色，显示"普通用户"
        return '普通用户'
      } else {
        return '普通用户'
      }
    },

    // 得到用户名称的首字母，用于头像显示
    userInitial: (state) => {
      if (!state.userInfo?.username) return '?'
      return state.userInfo.username.charAt(0).toUpperCase()
    },

    // 格式化全名
    fullName: (state) => {
      if (!state.userInfo) return ''

      if (state.userInfo.firstName && state.userInfo.lastName) {
        return `${state.userInfo.firstName} ${state.userInfo.lastName}`
      } else if (state.userInfo.firstName) {
        return state.userInfo.firstName
      } else if (state.userInfo.lastName) {
        return state.userInfo.lastName
      } else {
        return ''
      }
    },
  },

  actions: {
    // 获取用户信息
    async fetchUserInfo() {
      // 如果已经在加载中，则不重复发起请求
      if (this.isLoading) return

      this.isLoading = true
      this.error = null

      try {
        console.log('正在从API获取用户信息...')
        const response = await userAPI.getCurrentUser()
        this.userInfo = response.data
        console.log('获取用户信息成功:', this.userInfo)
        return response.data
      } catch (error: any) {
        console.error('获取用户信息失败:', error)
        this.error = error
        this.clearUserData() // 清除可能过期的用户数据
        throw error
      } finally {
        this.isLoading = false
      }
    },

    // 从本地存储加载用户信息
    loadUserFromStorage() {
      const userStr = sessionStorage.getItem('user') || localStorage.getItem('user')

      if (userStr) {
        try {
          const userData = JSON.parse(userStr)
          this.userInfo = userData
          console.log('已从存储中加载用户数据:', {
            username: this.userInfo?.username,
            roles: this.userInfo?.roles,
          })
          return true
        } catch (error) {
          console.error('解析存储的用户数据失败:', error)
          return false
        }
      }
      return false
    },

    // 尝试恢复用户会话
    async initializeUser() {
      // 首先尝试从存储中加载
      const loadedFromStorage = this.loadUserFromStorage()

      // 如果本地存储有 token 但没有完整用户信息，则尝试从 API 获取
      if (!loadedFromStorage) {
        const token = sessionStorage.getItem('token') || localStorage.getItem('token')
        if (token) {
          try {
            await this.fetchUserInfo()
            return true
          } catch (error) {
            console.error('初始化用户信息失败:', error)
            return false
          }
        }
      }

      return loadedFromStorage
    },

    // 更新用户信息
    updateUserInfo(userData: Partial<UserInfo>) {
      if (!this.userInfo) return

      this.userInfo = { ...this.userInfo, ...userData }

      // 同时更新存储
      if (sessionStorage.getItem('user')) {
        sessionStorage.setItem('user', JSON.stringify(this.userInfo))
      }
      if (localStorage.getItem('user')) {
        localStorage.setItem('user', JSON.stringify(this.userInfo))
      }
    },

    // 保存登录信息
    saveLoginInfo(userData: UserInfo, token: string, remember: boolean = false) {
      // 确保所有字段都被完整保存，使用API返回的完整数据
      this.userInfo = {
        userId: userData.userId,
        username: userData.username,
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        phoneNumber: userData.phoneNumber,
        biography: userData.biography,
        roles: userData.roles,
        createdAt: userData.createdAt,
        lastLogin: userData.lastLogin,
        followersCount: userData.followersCount,
        followingCount: userData.followingCount,
        token: token,
      }

      // 选择存储位置
      const storage = remember ? localStorage : sessionStorage

      // 先清除现有数据
      localStorage.removeItem('user')
      localStorage.removeItem('token')
      sessionStorage.removeItem('user')
      sessionStorage.removeItem('token')

      // 存储新数据
      storage.setItem('user', JSON.stringify(this.userInfo))
      storage.setItem('token', token)

      console.log(`已存储完整用户数据至${remember ? 'localStorage' : 'sessionStorage'}`, {
        username: this.userInfo.username,
        roles: this.userInfo.roles,
        fields: Object.keys(this.userInfo),
      })
    },

    // 清除用户数据（登出）
    clearUserData() {
      this.userInfo = null
      localStorage.removeItem('user')
      localStorage.removeItem('token')
      sessionStorage.removeItem('user')
      sessionStorage.removeItem('token')
      console.log('已清除用户数据')
    },

    // 用户登出
    logout() {
      this.clearUserData()
      // 可以在这里添加其他登出逻辑，如重定向到登录页
      console.log('用户已登出')
    },
  },
})
