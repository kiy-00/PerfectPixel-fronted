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
      usernameOrEmail: usernameOrEmail, // 匹配后端接口的参数命名
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

  // 你可以在这里添加更多用户相关API
}

export default apiClient
