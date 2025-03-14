import { defineStore } from 'pinia'
import { reactive } from 'vue'
import apiClient from '../services/apiService'

export interface PhotographerCertificationState {
  // Step 1: Basic Information
  experience: string
  equipment: string
  city: string
  specialties: string[]
  bio: string

  // Step 2: Portfolio Links
  mainPortfolio: string
  instagram: string
  flickr: string
  fivehundredpx: string
  weibo: string
  portfolioDescription: string
}

export const usePhotographerCertificationStore = defineStore('photographerCertification', () => {
  const certificationData = reactive<PhotographerCertificationState>({
    // Step 1: Basic Information
    experience: '',
    equipment: '',
    city: '',
    specialties: [],
    bio: '',

    // Step 2: Portfolio Links
    mainPortfolio: '',
    instagram: '',
    flickr: '',
    fivehundredpx: '',
    weibo: '',
    portfolioDescription: '',
  })

  // Save Step 1 Data
  const saveBasicInfo = (data: Partial<PhotographerCertificationState>) => {
    Object.assign(certificationData, data)
  }

  // Save Step 2 Data
  const savePortfolioInfo = (data: Partial<PhotographerCertificationState>) => {
    Object.assign(certificationData, data)
  }

  // Submit Application to API
  const submitApplication = async () => {
    try {
      // Prepare portfolio links for submission
      const portfolioLinks = []
      if (certificationData.mainPortfolio) portfolioLinks.push(certificationData.mainPortfolio)
      if (certificationData.instagram) portfolioLinks.push(certificationData.instagram)
      if (certificationData.flickr) portfolioLinks.push(certificationData.flickr)
      if (certificationData.fivehundredpx) portfolioLinks.push(certificationData.fivehundredpx)
      if (certificationData.weibo) portfolioLinks.push(certificationData.weibo)

      // Format data for API - match exactly what the backend expects
      const requestData = {
        roleType: 'Photographer', // 确保这个枚举值与后端定义匹配
        applicationData: {
          // 确保每个字段都有值，防止无效请求
          experience: certificationData.experience || '未指定',
          equipment: certificationData.equipment || '未指定',
          specialties:
            certificationData.specialties.length > 0
              ? certificationData.specialties.join(',')
              : '未指定',
          city: certificationData.city || '未指定',
          bio: certificationData.bio || '未指定',
          portfolio:
            portfolioLinks.length > 0
              ? portfolioLinks.join(', ')
              : certificationData.mainPortfolio || '未提供',
          portfolioDescription: certificationData.portfolioDescription || '未提供',
        },
      }

      console.log('提交的申请数据:', JSON.stringify(requestData, null, 2))

      // 使用apiClient发送请求
      const response = await apiClient.post('/RoleApplication', requestData)
      console.log('申请提交成功:', response.data)
      return response.data
    } catch (error: any) {
      // 增强错误日志，帮助调试
      console.error('Failed to submit application:', error)
      if (error.response) {
        // 服务器响应了请求，但状态码不在 2xx 范围内
        console.error('错误响应数据:', error.response.data)
        console.error('错误响应状态:', error.response.status)
        console.error('错误响应头:', error.response.headers)

        // 如果后端返回了详细错误信息，提供给用户
        if (error.response.data && typeof error.response.data === 'object') {
          const errorMessage = error.response.data.message || JSON.stringify(error.response.data)
          throw new Error(`提交失败: ${errorMessage}`)
        }
      }
      throw error
    }
  }

  return {
    certificationData,
    saveBasicInfo,
    savePortfolioInfo,
    submitApplication,
  }
})
