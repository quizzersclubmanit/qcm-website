import { Client, Databases, ID } from "appwrite"
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

    async insert({collectionId, title, content, status=true, featuredImage, userId}){
        try {
            const res = await this.databases.createDocument(
                env.dbId,
                collectionId,
                ID.unique(),
                {title, content, status, featuredImage, userId}
            )
            return res
        } catch (error) {
            throw error
        }
    }

    async fetchOne({userId}){
        try {
            const res = await this.databases.getDocument(
                env.dbId,
                env.scoreId,
                userId
            )
            return res
        } catch (error) {
            throw error
        }
    }

    async fetchAll({collectionId}){
        try {
            const res = this.databases.listDocuments(
                env.dbId,
                collectionId
            )
            return res
        } catch (error) {
            throw error
        }
    }

    async update({collectionId, documentId, changes={}}){
        try {
            const res = this.databases.updateDocument(
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

    async delete({collectionId, documentId}){
        try {
            const res = this.databases.deleteDocument(
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

const dbService = new DB
export default dbService