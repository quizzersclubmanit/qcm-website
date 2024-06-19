import { Client, Storage, ID } from "appwrite"
import env from "../../constants"

class Store {
  client = new Client()
  storage

  constructor() {
    this.client.setEndpoint(env.apiEndpoint).setProject(env.projectId)

    this.storage = new Storage(this.client)
  }

  async uploadFile({ file }) {
    if (!file || typeof file == "string") return null
    try {
      const res = await this.storage.createFile(env.bucketId, ID.unique(), file)
      return res
    } catch (error) {
      throw error
    }
  }

  async deleteFile({ fileId }) {
    try {
      const res = await this.storage.deleteFile(env.bucketId, fileId)
      return res
    } catch (error) {
      throw error
    }
  }

  async fetchFile({ fileId }) {
    try {
      const res = await this.storage.getFile(env.bucketId, fileId)
      return res
    } catch (error) {
      throw error
    }
  }

  fetchFilePreview({ fileId }) {
    try {
      const res = this.storage.getFilePreview(env.bucketId, fileId)
      return res.toString()
    } catch (error) {
      throw error
    }
  }
}

const storeService = new Store()
export default storeService
