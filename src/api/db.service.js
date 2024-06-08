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

    async insert({collectionId, data={}}){
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

    async fetchAll({collectionId, userId=""}){
        let query = []
        if (collectionId == env.scoreId)
            query.push(Query.equal("userId", userId))
        try {
            const res = this.databases.listDocuments(
                env.dbId,
                collectionId,
                query
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