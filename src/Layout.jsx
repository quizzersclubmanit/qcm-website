import { Outlet } from "react-router-dom"
import { UserProvider } from "./contexts/user.context"
import { QuizProvider } from "./contexts/quiz.context"
import { useState, useCallback } from "react"

const Layout = () => {
  const [userData, setUserData] = useState({})
  const [loggedIn, setLoggedIn] = useState(false)
  const [quizes, setQuizes] = useState([])
  
  function login() {
    setLoggedIn(true)
  }
  function logout() {
    setLoggedIn(false)
  }
  function addQuiz(quiz={}) {
    setQuizes(prev => [...prev, quiz])
  }

  const editQuiz = useCallback((quizId="", changes={})=>{
    setQuizes(prev => (
      prev.map(quiz => {
        if (quiz.$id == quizId)
          return {...quiz, ...changes}
        return quiz
      })
    ))
  },[])

  const deleteQuiz = useCallback((quizId="")=>{
    setQuizes(prev => (
      prev.filter(quiz => quiz.$id != quizId)
    ))
  },[])

  return (
    <UserProvider value={{userData, setUserData, loggedIn, login, logout}}>
      <QuizProvider value={{quizes, setQuizes, addQuiz, editQuiz, deleteQuiz}}>
        <Outlet/>
      </QuizProvider>
    </UserProvider>
  )
}

export default Layout