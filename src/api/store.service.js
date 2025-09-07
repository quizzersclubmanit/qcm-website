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
    // TODO: Implement alternative file preview method
    console.warn('Store service: fetchFilePreview method disabled - Appwrite backend removed')
    return null
  }
}

const storeService = new Store()
export default storeService
