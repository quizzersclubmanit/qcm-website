// Storage service - Connected to backend API

const API_BASE_URL = 'https://qcm-backend-ln5c.onrender.com/api'

class Store {
  // Helper function to get token
  getToken() {
    return localStorage.getItem('authToken') || localStorage.getItem('token')
  }

  async uploadFile({ file }) {
    try {
      console.log('=== Store Service - Upload File ===')
      console.log('File to upload:', file)
      
      if (!file || file === "NOFILE") {
        console.log('No file to upload or NOFILE placeholder')
        return { id: null, $id: null }
      }

      // Check if file is valid
      if (!file.name || !file.type) {
        console.error('Invalid file object:', file)
        throw new Error('Invalid file object')
      }

      const token = this.getToken()
      if (!token) {
        throw new Error('Authentication token not found')
      }

      // Create FormData for file upload
      const formData = new FormData()
      formData.append('file', file)
      formData.append('type', 'quiz-image') // Specify upload type

      console.log('Uploading file:', file.name, 'Size:', file.size, 'Type:', file.type)

      const response = await fetch(`${API_BASE_URL}/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
          // Don't set Content-Type for FormData, let browser set it with boundary
        },
        body: formData
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error('Upload failed:', response.status, errorText)
        
        // If upload endpoint doesn't exist, try alternative approach
        if (response.status === 404) {
          console.log('Upload endpoint not found, using base64 fallback')
          return await this.uploadFileAsBase64(file)
        }
        
        throw new Error(`Upload failed: ${response.status} ${errorText}`)
      }

      const result = await response.json()
      console.log('Upload successful:', result)
      
      // Return in format expected by existing code
      return {
        $id: result.fileId || result.id || result.url,
        id: result.fileId || result.id || result.url,
        url: result.url || result.fileUrl
      }
    } catch (error) {
      console.error('Error uploading file:', error)
      throw error
    }
  }

  async deleteFile({ fileId }) {
    try {
      if (!fileId) return null

      const token = this.getToken()
      if (!token) {
        throw new Error('Authentication token not found')
      }

      const response = await fetch(`${API_BASE_URL}/upload/${fileId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        console.error('Delete failed:', response.status)
        return null
      }

      return await response.json()
    } catch (error) {
      console.error('Error deleting file:', error)
      return null
    }
  }

  // Compress and resize image before converting to base64
  async compressImage(file, maxWidth = 800, maxHeight = 600, quality = 0.8) {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      const img = new Image()
      
      img.onload = () => {
        // Calculate new dimensions
        let { width, height } = img
        
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height)
          width *= ratio
          height *= ratio
        }
        
        // Set canvas dimensions
        canvas.width = width
        canvas.height = height
        
        // Draw and compress image
        ctx.drawImage(img, 0, 0, width, height)
        
        // Convert to blob with compression
        canvas.toBlob(
          (blob) => {
            if (blob) {
              console.log(`Image compressed: ${file.size} → ${blob.size} bytes (${Math.round((1 - blob.size/file.size) * 100)}% reduction)`)
              resolve(blob)
            } else {
              reject(new Error('Failed to compress image'))
            }
          },
          file.type,
          quality
        )
      }
      
      img.onerror = () => reject(new Error('Failed to load image'))
      img.src = URL.createObjectURL(file)
    })
  }

  // Fallback method to convert file to base64 data URL with compression
  async uploadFileAsBase64(file) {
    try {
      console.log('Original file size:', file.size, 'bytes')
      
      // Compress image if it's too large
      let processedFile = file
      if (file.size > 50000) { // If larger than 50KB
        console.log('Compressing large image...')
        processedFile = await this.compressImage(file)
      }
      
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => {
          const base64String = reader.result
          console.log('File converted to base64, final length:', base64String.length)
          resolve({
            $id: base64String,
            id: base64String,
            url: base64String
          })
        }
        reader.onerror = () => reject(new Error('Failed to read file'))
        reader.readAsDataURL(processedFile)
      })
    } catch (error) {
      console.error('Error in uploadFileAsBase64:', error)
      throw error
    }
  }

  fetchFilePreview({ fileId, bucketId }) {
    // If fileId is already a URL, return it
    if (fileId && (fileId.startsWith('http') || fileId.startsWith('/') || fileId.startsWith('data:'))) {
      return fileId
    }
    
    // If it's a file ID, construct the URL
    if (fileId) {
      return `${API_BASE_URL}/files/${fileId}`
    }
    
    return null
  }
}

const storeService = new Store()
export default storeService
