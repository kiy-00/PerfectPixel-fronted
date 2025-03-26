import apiClient from './apiService'

// 图像处理相关API
export const imageProcessingAPI = {
  // 应用滤镜
  applyFilter: (file: File, filterType: string) => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('filterType', filterType)

    return apiClient.post('/ImageProcessing/filter', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },

  // 添加水印
  addWatermark: (file: File, text: string, opacity: number, position: number) => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('text', text)
    formData.append('opacity', opacity.toString())
    formData.append('position', position.toString())

    return apiClient.post('/ImageProcessing/watermark', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },

  // 人脸检测
  detectFaces: (file: File) => {
    const formData = new FormData()
    formData.append('file', file)

    return apiClient.post('/ImageProcessing/detect-faces', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },

  // 图像质量分析
  analyzeQuality: (file: File) => {
    const formData = new FormData()
    formData.append('file', file)

    return apiClient.post('/ImageProcessing/analyze-quality', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },
}

export default imageProcessingAPI
