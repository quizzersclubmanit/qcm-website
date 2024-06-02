import { createContext, useContext } from "react"

const UserContext = createContext({
    userData: {
        /*_id: "",
        name: "",
        score: 0,
        ...{}*/
    },
    setUserData: (data={})=>{},
    loggedIn: false,
    login: ()=>{},
    logout: ()=>{}
})

const UserProvider = UserContext.Provider

const useUserContext = ()=>{
    return useContext(UserContext)
}

export {UserProvider, useUserContext}