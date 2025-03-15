import { defineStore } from 'pinia'
import { reactive } from 'vue'
import apiClient from '../services/apiService'

interface RetoucherCertificationState {
  // Step 1: Basic Info
  experience: string
  techniques: string
  city: string
  specialties: string[]
  bio: string

  // Step 2: Portfolio Links
  mainPortfolio: string
  otherLinks: string[]
  portfolioDescription: string
}

export const useRetoucherCertificationStore = defineStore('retoucherCertification', () => {
  const certificationData = reactive<RetoucherCertificationState>({
    experience: '',
    techniques: '',
    city: '',
    specialties: [],
    bio: '',

    mainPortfolio: '',
    otherLinks: [],
    portfolioDescription: '',
  })

  const saveBasicInfo = (data: Partial<RetoucherCertificationState>) => {
    Object.assign(certificationData, data)
  }

  const savePortfolioInfo = (data: Partial<RetoucherCertificationState>) => {
    Object.assign(certificationData, data)
  }

  const submitApplication = async () => {
    try {
      if (!certificationData.mainPortfolio || !certificationData.portfolioDescription) {
        throw new Error('缺少必填信息，请检查后再提交')
      }
      const requestData = {
        roleType: 'Retoucher',
        applicationData: {
          experience: certificationData.experience,
          techniques: certificationData.techniques,
          city: certificationData.city,
          specialties: certificationData.specialties.join(','),
          bio: certificationData.bio,
          portfolio: [certificationData.mainPortfolio, ...certificationData.otherLinks].join(', '),
          portfolioDescription: certificationData.portfolioDescription,
        },
      }
      // ...existing code to submit via apiClient...
      const response = await apiClient.post('/RoleApplication', requestData)
      console.log('修图师申请提交成功:', response.data)
      return response.data
    } catch (error: any) {
      console.error('修图师申请提交失败:', error)
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
