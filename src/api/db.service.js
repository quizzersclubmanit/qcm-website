import { Client, Databases, ID, Query } from "appwrite"
import env from "../../env"

class DB{
    client = new Client()
    databases

    constructor(){
        this.client
        .setEndpoint(env.apiEndpoint)
        .setProject(env.projectId)

        this.databases = new Databases(this.client)
    }

    async insert({title, content, status=true, featuredImage, userId}){
        try {
            const res = await this.databases.createDocument(
                env.dbId,
                env.collectionId,
                ID.unique(),
                {title, content, status, featuredImage, userId}
            )
            return res
        } catch (error) {
            throw error
        }
    }

    async fetchAll(){
        try {
            const res = this.databases.listDocuments(
                env.dbId,
                env.collectionId,
                // [Query.equal("status","active")]
            )
            return res
        } catch (error) {
            throw error
        }
    }

    async update({documentId, changes={}}){
        try {
            const res = this.databases.updateDocument(
                env.dbId,
                env.collectionId,
                documentId,
                changes
            )
            return res
        } catch (error) {
            throw error
        }
    }

    async delete({documentId}){
        try {
            const res = this.databases.deleteDocument(
                env.dbId,
                env.collectionId,
                documentId
            )
            return res
        } catch (error) {
            throw error
        }
    }
}

const dbService = new DB
export default dbService