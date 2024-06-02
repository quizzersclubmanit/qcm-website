import { Client, Account, ID, OAuthProvider } from "appwrite"
import env from "../../env"

class Auth{
    client = new Client()
    account

    constructor(){
        this.client
        .setEndpoint(env.apiEndpoint)
        .setProject(env.projectId)
        
        this.account = new Account(this.client)
    }

    async signup({email="", password="", name=""}){
        try {
            const res = await this.account.create(ID.unique(), email, password, name)
            if (res) this.login({email, password})
            return res
        } catch (error) {
            throw error
        }
    }

    signupWithGoogle({home}){
        const successURL = `${home}`, failureURL = `${home}/signup`
        this.account.createOAuth2Session(
            OAuthProvider.Google,
            successURL,
            failureURL
        )
    }

    async login({email="", password=""}){
        try {
            const res = await this.account.createEmailPasswordSession(email, password)
            return res
        } catch (error) {
            throw error
        }
    }

    async getCurrentUser(){
        try {
            const res = await this.account.get()
            return res
        } catch (error) {
            throw error
        }
    }

    async logout(){
        try {
            const res = await this.account.deleteSessions()
            return res
        } catch (error) {
            throw error
        }
    }
}

const authService = new Auth
export default authService