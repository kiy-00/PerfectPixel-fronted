import axios from 'axios'

// Use environment variable for API base URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

// 创建axios实例
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 请求拦截器 - 添加认证token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// 用户相关API
export const userAPI = {
  // 登录 - 确保请求与后端API预期相匹配
  login: (usernameOrEmail: string, password: string) => {
    return apiClient.post('/User/login', {
      usernameOrEmail: usernameOrEmail,
      password: password,
    })
  },

  // 注册
  register: (registerData: {
    Username: string
    Email: string
    Password: string
    FirstName?: string
    LastName?: string
    PhoneNumber?: string
    Roles?: string[]
  }) => {
    return apiClient.post('/User/register', registerData)
  },

  // 获取当前用户信息
  getCurrentUser: () => {
    return apiClient.get('/User/current')
  },

  // 获取用户的摄影师ID
  getPhotographerId: (userId: number) => {
    return apiClient.get(`/User/${userId}/photographer-id`)
  },

  // 获取用户的修图师ID
  getRetoucherId: (userId: number) => {
    return apiClient.get(`/User/${userId}/retoucher-id`)
  },

  // 获取指定用户的公开信息
  getUserPublicProfile: (userId: number) => {
    return apiClient.get(`/User/${userId}`)
  },

  // 关注用户
  followUser: (userId: number) => {
    return apiClient.post(`/Follow/${userId}`)
  },

  // 取消关注用户
  unfollowUser: (userId: number) => {
    return apiClient.delete(`/Follow/${userId}`)
  },

  // 你可以在这里添加更多用户相关API
}

// 修图作品集相关API
export const retoucherPortfolioAPI = {
  // 创建修图作品集 - 更新参数类型确保category匹配后端枚举
  create: (portfolioData: {
    title: string
    description: string
    category: string // 值必须是: 'Portrait', 'Wedding', 'Fashion', 'Product', 'Event', 'Landscape', 'Other'
    isPublic: boolean
  }) => {
    console.log('调用创建作品集API:', portfolioData)
    return apiClient.post('/retoucher-portfolios', portfolioData)
  },

  // 上传作品集封面图片
  uploadCover: (portfolioId: number, file: File) => {
    // 创建FormData对象用于文件上传
    const formData = new FormData()
    formData.append('file', file)

    // 注意这里需要特殊的headers配置，因为是文件上传
    return apiClient.post(`/retoucher-portfolios/${portfolioId}/cover`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },

  // 获取修图师的公开作品集
  getPublicPortfolios: (retoucherId: number) => {
    return apiClient.get(`/retoucher-portfolios/retoucher/${retoucherId}/public`)
  },

  // 获取修图师的私密作品集(简化版)
  getPrivatePortfolios: (retoucherId: number) => {
    return apiClient.get(`/retoucher-portfolios/retoucher/${retoucherId}/private-simple`)
  },

  // 获取单个作品集详情
  getPortfolioById: (portfolioId: number) => {
    return apiClient.get(`/retoucher-portfolios/${portfolioId}`)
  },

  // 上传修图前后对比作品项
  uploadBeforeAfterImages: (portfolioId: number, formData: FormData) => {
    return apiClient.post(`/retoucher-portfolios/${portfolioId}/before-after`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },

  // 添加删除作品集的方法
  deletePortfolio: (portfolioId: number) => {
    return apiClient.delete(`/retoucher-portfolios/${portfolioId}`)
  },

  // 更新作品集信息
  updatePortfolio: (
    portfolioId: number,
    portfolioData: {
      title: string
      description: string
      category: string
      isPublic: boolean
    },
  ) => {
    return apiClient.put(`/retoucher-portfolios/${portfolioId}`, portfolioData)
  },

  // 更多修图作品集API可以在这里添加
}

// 摄影作品集相关API
export const photographerPortfolioAPI = {
  // 获取摄影师的公开作品集
  getPublicPortfolios: (photographerId: number) => {
    return apiClient.get(`/photographer-portfolios/photographer/${photographerId}/public`)
  },

  // 更多摄影作品集API可以在这里添加
}

// 修图师相关API
export const retoucherAPI = {
  // 获取所有已验证的修图师
  getVerifiedRetouchers: () => {
    console.log('调用getVerifiedRetouchers API')
    return apiClient.get('/Retoucher?verifiedOnly=true')
  },

  // 搜索修图师 v2 - 支持价格区间过滤
  searchRetouchersV2: (keyword: string, minPrice?: number, maxPrice?: number) => {
    console.log('调用searchRetouchersV2 API, 参数:', { keyword, minPrice, maxPrice })

    // 构建查询参数, keyword是必填字段
    const params: any = {
      keyword: keyword || ' ', // 如果没有关键词，传递空格字符作为占位符
      verifiedOnly: true,
    }

    // 添加可选的价格参数
    if (minPrice !== undefined && minPrice !== null) {
      params.minPrice = minPrice
    }

    if (maxPrice !== undefined && maxPrice !== null) {
      params.maxPrice = maxPrice
    }

    console.log('发送给后端的参数:', params)

    return apiClient.get(`/Retoucher/search/v2`, { params })
  },

  // 获取单个修图师信息
  getRetoucherById: (retoucherId: number) => {
    return apiClient.get(`/Retoucher/${retoucherId}`)
  },

  // 其他修图师相关API可以在这里添加
}

// 摄影师相关API
export const photographerAPI = {
  // 获取单个摄影师信息
  getPhotographerById: (photographerId: number) => {
    return apiClient.get(`/Photographer/${photographerId}`)
  },

  // 其他摄影师相关API可以在这里添加
}

export default apiClient
