import { Client, Account, ID, OAuthProvider } from "appwrite"
import env from "../../env"

const client = new Client().setEndpoint(env.apiEndpoint).setProject(env.projectId)
const account = new Account(client)

class Auth{
    async signup({email="", password="", name=""}){
        try {
            const res = await account.create(ID.unique(), email, password, name)
            if (res) await account.createEmailPasswordSession(email, password)
            return res
        } catch (error) {
            throw error
        }
    }

    createSessionWithGoogle({home}){
        const successURL = `${home}`, failureURL = `${home}/signup`
        account.createOAuth2Session(
            OAuthProvider.Google,
            successURL,
            failureURL
        )
    }

    async login({email="", password=""}){
        try {
            const res = await account.createEmailPasswordSession(email, password)
            return res
        } catch (error) {
            throw error
        }
    }

    async getCurrentUser(){
        try {
            const res = await account.get()
            return res
        } catch (error) {
            throw error
        }
    }

    async logout(){
        try {
            const res = await account.deleteSessions()
            return res
        } catch (error) {
            throw error
        }
    }
}

const authService = new Auth
export default authService