import { Client, Databases, ID, Query } from "appwrite"
import env from "../../constants"

class DB {
  client = new Client()
  databases

  constructor() {
    this.client.setEndpoint(env.apiEndpoint).setProject(env.projectId)
    this.databases = new Databases(this.client)
  }

  async insert({ collectionId, data = {} }) {
    try {
      const res = await this.databases.createDocument(
        env.dbId,
        collectionId,
        ID.unique(),
        data
      )
      return res
    } catch (error) {
      throw error
    }
  }

  async select({ collectionId, queries = [] }) {
    try {
      const res = await this.databases.listDocuments(env.dbId, collectionId, [
        ...queries,
        Query.limit(5000)
      ])
      return res.documents
    } catch (error) {
      throw error
    }
  }

  async update({ collectionId, documentId, changes = {} }) {
    try {
      const res = await this.databases.updateDocument(
        env.dbId,
        collectionId,
        documentId,
        changes
      )
      return res
    } catch (error) {
      throw error
    }
  }

  async delete({ collectionId, documentId }) {
    try {
      const res = await this.databases.deleteDocument(
        env.dbId,
        collectionId,
        documentId
      )
      return res
    } catch (error) {
      throw error
    }
  }
}

const dbService = new DB()
export default dbService
