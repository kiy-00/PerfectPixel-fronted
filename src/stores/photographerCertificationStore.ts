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

      // Ensure we have all required data
      if (!certificationData.experience) {
        throw new Error('缺少摄影经验信息，请返回第一步填写')
      }

      if (!certificationData.equipment || certificationData.equipment.trim() === '') {
        throw new Error('缺少摄影设备信息，请返回第一步填写')
      }

      if (!certificationData.city || certificationData.city.trim() === '') {
        throw new Error('缺少所在城市信息，请返回第一步填写')
      }

      if (certificationData.specialties.length === 0) {
        throw new Error('缺少擅长领域信息，请返回第一步填写')
      }

      if (!certificationData.bio || certificationData.bio.trim() === '') {
        throw new Error('缺少个人简介信息，请返回第一步填写')
      }

      if (portfolioLinks.length === 0) {
        throw new Error('缺少作品集链接，请返回第二步填写')
      }

      if (
        !certificationData.portfolioDescription ||
        certificationData.portfolioDescription.trim() === ''
      ) {
        throw new Error('缺少作品集描述，请返回第二步填写')
      }

      // Format data for API - match exactly what the backend expects
      const requestData = {
        roleType: 'Photographer',
        applicationData: {
          experience: certificationData.experience,
          equipment: certificationData.equipment,
          specialties: certificationData.specialties.join(','),
          city: certificationData.city,
          bio: certificationData.bio,
          portfolio: portfolioLinks.join(', '),
          portfolioDescription: certificationData.portfolioDescription,
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
