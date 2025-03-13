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
  photographerId?: number | null
  retoucherId?: number | null
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

    // 额外添加摄影师ID和修图师ID的getter
    photographerId: (state) => state.userInfo?.photographerId || null,
    retoucherId: (state) => state.userInfo?.retoucherId || null,

    // 判断用户是否有专业ID
    hasPhotographerId: (state) =>
      state.userInfo?.photographerId !== undefined && state.userInfo?.photographerId !== null,
    hasRetoucherId: (state) =>
      state.userInfo?.retoucherId !== undefined && state.userInfo?.retoucherId !== null,
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

    // 获取用户的摄影师和修图师ID (如果有)
    async fetchUserRoleIds(userId: number) {
      try {
        let photographerId = null
        let retoucherId = null

        // 如果用户是摄影师，获取摄影师ID
        if (this.isPhotographer) {
          try {
            console.log('正在获取摄影师ID...')
            const photographerResponse = await userAPI.getPhotographerId(userId)
            photographerId = photographerResponse.data.photographerId
            console.log('获取到摄影师ID:', photographerId)
          } catch (error) {
            console.error('获取摄影师ID失败:', error)
          }
        }

        // 如果用户是修图师，获取修图师ID
        if (this.isRetoucher) {
          try {
            console.log('正在获取修图师ID...')
            const retoucherResponse = await userAPI.getRetoucherId(userId)
            retoucherId = retoucherResponse.data.retoucherId
            console.log('获取到修图师ID:', retoucherId, typeof retoucherId)
          } catch (error) {
            console.error('获取修图师ID失败:', error)
          }
        }

        // 将ID更新到用户信息中
        if (this.userInfo) {
          this.userInfo = {
            ...this.userInfo,
            photographerId: photographerId !== null ? Number(photographerId) : null,
            retoucherId: retoucherId !== null ? Number(retoucherId) : null,
          }

          console.log('用户信息已更新，包含角色ID:', {
            photographerId: this.userInfo.photographerId,
            retoucherId: this.userInfo.retoucherId,
            typePID: typeof this.userInfo.photographerId,
            typeRID: typeof this.userInfo.retoucherId,
          })

          // 确保存储也被更新
          this.updateUserStorage()
        }

        return { photographerId, retoucherId }
      } catch (error) {
        console.error('获取用户角色ID失败:', error)
        throw error
      }
    },

    // 更新本地存储中的用户信息
    updateUserStorage() {
      if (!this.userInfo) return

      // 确保在存储前转换ID为数字类型
      const userToStore = {
        ...this.userInfo,
        photographerId:
          this.userInfo.photographerId !== null ? Number(this.userInfo.photographerId) : null,
        retoucherId: this.userInfo.retoucherId !== null ? Number(this.userInfo.retoucherId) : null,
      }

      if (sessionStorage.getItem('user')) {
        sessionStorage.setItem('user', JSON.stringify(userToStore))
        console.log('更新sessionStorage中的用户信息，修图师ID:', userToStore.retoucherId)
      }
      if (localStorage.getItem('user')) {
        localStorage.setItem('user', JSON.stringify(userToStore))
        console.log('更新localStorage中的用户信息，修图师ID:', userToStore.retoucherId)
      }
    },

    // 从本地存储加载用户信息
    loadUserFromStorage() {
      const userStr = sessionStorage.getItem('user') || localStorage.getItem('user')

      if (userStr) {
        try {
          const parsedUser = JSON.parse(userStr)

          // 确保数值类型的一致性
          if (parsedUser.photographerId) {
            parsedUser.photographerId = Number(parsedUser.photographerId)
          }
          if (parsedUser.retoucherId) {
            parsedUser.retoucherId = Number(parsedUser.retoucherId)
          }

          this.userInfo = parsedUser
          console.log(
            '从存储加载用户信息成功，修图师ID:',
            this.userInfo.retoucherId,
            typeof this.userInfo.retoucherId,
          )
          return true
        } catch (error) {
          console.error('解析存储中的用户信息失败:', error)
        }
      }
      return false
    },

    // 尝试恢复用户会话
    async initializeUser() {
      // 首先尝试从存储中加载
      const loadedFromStorage = this.loadUserFromStorage()
      console.log('尝试从存储加载用户状态:', loadedFromStorage ? '成功' : '失败')

      // 如果本地存储有 token 但没有完整用户信息，则尝试从 API 获取
      if (!loadedFromStorage) {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token')
        if (token) {
          try {
            console.log('找到token，尝试从API获取用户信息')
            const response = await userAPI.getCurrentUser()
            const userData = response.data
            userData.token = token
            this.userInfo = userData

            // 获取用户角色ID
            if (
              (this.isPhotographer && !this.photographerId) ||
              (this.isRetoucher && !this.retoucherId)
            ) {
              console.log('用户有专业角色，但缺少角色ID，尝试获取角色ID')
              await this.fetchUserRoleIds(userData.userId)
            }

            return true
          } catch (error) {
            console.error('恢复用户会话失败:', error)
            // 清除无效的token
            localStorage.removeItem('token')
            sessionStorage.removeItem('token')
            return false
          }
        }
      } else if (this.isAuthenticated) {
        // 如果从存储加载成功，但缺少角色ID，尝试获取
        if (
          (this.isPhotographer && !this.photographerId) ||
          (this.isRetoucher && !this.retoucherId)
        ) {
          console.log('从存储加载用户成功，但缺少角色ID，尝试获取角色ID')
          await this.fetchUserRoleIds(this.userInfo!.userId)
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
    async saveLoginInfo(userData: UserInfo, token: string, remember: boolean = false) {
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
        // 确保ID被正确格式化为数字
        photographerId:
          userData.photographerId !== undefined ? Number(userData.photographerId) : null,
        retoucherId: userData.retoucherId !== undefined ? Number(userData.retoucherId) : null,
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

      console.log(`已存储基本用户数据至${remember ? 'localStorage' : 'sessionStorage'}`, {
        username: this.userInfo.username,
        roles: this.userInfo.roles,
        photographerId: this.userInfo.photographerId,
        retoucherId: this.userInfo.retoucherId,
      })

      // 如果用户有摄影师或修图师角色但ID未设置，获取相应的ID
      if (
        (this.isPhotographer && !this.userInfo.photographerId) ||
        (this.isRetoucher && !this.userInfo.retoucherId)
      ) {
        console.log('用户有专业角色但ID未设置，尝试获取角色ID...')
        const { photographerId, retoucherId } = await this.fetchUserRoleIds(this.userInfo.userId)

        // 获取后再次保存到存储中
        this.updateUserStorage()
      }
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
