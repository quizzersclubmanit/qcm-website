// Storage service - Appwrite backend calls removed

class Store {
  async uploadFile({ file }) {
    // TODO: Implement alternative file storage method
    console.warn('Store service: uploadFile method disabled - Appwrite backend removed')
    return null
  }

  async deleteFile({ fileId }) {
    // TODO: Implement alternative file storage method
    console.warn('Store service: deleteFile method disabled - Appwrite backend removed')
    return null
  }

  fetchFilePreview({ fileId, bucketId }) {
    // For now, return the fileId as URL if it's already a URL, otherwise return null
    if (fileId && (fileId.startsWith('http') || fileId.startsWith('/'))) {
      return fileId
    }
    // If it's a file ID, we might need to construct a URL or return a placeholder
    console.warn('Store service: fetchFilePreview method - no file storage configured')
    return null
  }
}

const storeService = new Store()
export default storeService
