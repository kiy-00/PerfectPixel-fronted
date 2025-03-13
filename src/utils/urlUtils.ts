/**
 * URL 工具函数，用于处理各种类型的 URL
 */

// 从环境变量获取基础 URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'

// 从环境变量获取静态资源 URL，如果没有则使用主域名
const STATIC_ASSETS_URL = import.meta.env.VITE_STATIC_ASSETS_URL || ''

/**
 * 获取 API URL
 * @param path API 路径
 * @returns 完整的 API URL
 */
export function getApiUrl(path: string): string {
  // 确保路径以 / 开头
  const formattedPath = path.startsWith('/') ? path : `/${path}`
  return `${API_BASE_URL}${formattedPath}`
}

/**
 * 获取静态资源 URL
 * @param path 资源路径
 * @returns 完整的静态资源 URL
 */
export function getAssetUrl(path: string | null): string {
  if (!path) return ''

  // 如果是完整 URL（以 http 开头），直接返回
  if (path.startsWith('http')) {
    return path
  }

  // 确保路径以 / 开头
  const formattedPath = path.startsWith('/') ? path : `/${path}`

  // 将 /api 从路径开头移除（如果存在）
  const cleanPath = formattedPath.startsWith('/api/') ? formattedPath.substring(4) : formattedPath

  // 构建完整 URL
  return `${STATIC_ASSETS_URL}${cleanPath}`
}

/**
 * 判断给定的路径是否为 API 路径
 * @param path 待检查的路径
 * @returns 是否为 API 路径
 */
export function isApiPath(path: string): boolean {
  return path.includes('/api/') || path.startsWith('/api')
}
