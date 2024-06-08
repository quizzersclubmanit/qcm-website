import dbService from "../api/db.service"
import authService from "../api/auth.service"
import { useEffect, useState } from "react"
import env from "../../env"
import { useQuizContext } from "../contexts/quiz.context"
import { useUserContext } from "../contexts/user.context"
import {Container, QuizRibbon, SearchBar} from "../components/components"
import { Navigate, Link } from "react-router-dom"

const ManageQuiz = () => {
  const {quizes, setQuizes} = useQuizContext()
  const {login, loggedIn, userData, setUserData} = useUserContext()
  const [loading, setLoading] = useState(true)
  const [searchContent, setSearchContent] = useState("")

  useEffect(()=>{
    authService.getCurrentUser()
    .then(user => {
      setUserData(user)
      login()
    })
    .catch(err => {
      console.error(err)
    })
    .finally(()=>{
      setLoading(false)
    })
  },[])

  useEffect(()=>{
    dbService
    .fetchAll({collectionId: env.quizId})
    .then(res => {
      setQuizes(res.documents)
    })
    .catch(err => {
      console.error(err)
    })
  },[])

  if (loading) return (
    <Container className="h-screen flex justify-center items-center">
      <h1 className="text-[3vmax] font-bold">Loading...</h1>
    </Container>
  )
  if (!loggedIn) return <Navigate to="/signup" />
  if (userData.name != "admin") return <Navigate to="/" />
  return (
   <div id="manage-quiz" className="londrina-solid-regular">
    <Container className="min-h-screen flex flex-col items-center gap-10">
      <SearchBar content={searchContent} setContent={setSearchContent}/>
      <div className="w-full flex flex-col items-center gap-3">
        {
          quizes.length > 0 ?
          quizes
          .filter(quiz => quiz.question.toLowerCase().includes(searchContent.toLowerCase()))
          .map((quiz, index)=>(
            <QuizRibbon key={index} quiz={quiz} />
          ))
          :
          <>
            <h1 className="text-[3vmax] font-bold">No questions added yet</h1>
            <Link to="/admin/add" className="text-white" >Add Questions</Link>
          </>
        }
      </div>
    </Container>
   </div>
  )
}

export default ManageQuiz