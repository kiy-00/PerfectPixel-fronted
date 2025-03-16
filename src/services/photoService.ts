import apiClient from './apiService'

/**
 * 照片服务类 - 处理照片相关API
 */
export class PhotoService {
  /**
   * 上传照片
   * @param file 要上传的照片文件
   * @param title 照片标题
   * @param description 照片描述
   */
  async uploadPhoto(file: File, title: string, description: string) {
    console.log('上传照片:', { fileName: file.name, fileSize: file.size, title, description })

    const formData = new FormData()
    formData.append('file', file)
    formData.append('title', title)
    formData.append('description', description)

    const response = await apiClient.post('/Photo/upload/general', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })

    console.log('照片上传成功:', response.data)
    return response.data
  }

  /**
   * 删除照片（临时或正式照片）
   * @param photoId 照片ID
   */
  async deletePhoto(photoId: string) {
    console.log('删除照片:', { photoId })

    const response = await apiClient.delete(`/Photo/${photoId}`)

    console.log('照片删除成功')
    return response.data
  }
}

export default new PhotoService()
