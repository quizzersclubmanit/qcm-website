import dbService from "../api/db.service"
import { useEffect, useState } from "react"
import env from "../../env"
import {
  Container,
  QuizRibbon,
  SearchBar,
  Logo
} from "../components/components"
import { Link } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { setQuizes } from "../redux/quiz.slice"

const ManageQuiz = () => {
  const quizes = useSelector((state) => state.quizes)
  const [loading, setLoading] = useState(true)
  const [searchContent, setSearchContent] = useState("")
  const dispatch = useDispatch()

  useEffect(() => {
    dbService
      .select({ collectionId: env.quizId })
      .then((res) => {
        dispatch(setQuizes(res))
      })
      .catch((err) => {
        console.error(err)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  if (loading)
    return (
      <Container className="h-screen flex justify-center items-center">
        <h1 className="text-[3vmax] font-bold">Loading...</h1>
      </Container>
    )
  return (
    <Container
      id="manage-quiz"
      className="londrina-solid-regular sm:p-[3vmax] p-[2vmax] min-h-screen flex flex-col  items-center sm:gap-0 gap-4"
    >
      <Logo className="w-[8vmax] sm:w-[5vmax]" />
      <SearchBar content={searchContent} setContent={setSearchContent} />
      <div className="flex flex-col items-center gap-3 w-full">
        {quizes.length > 0 ? (
          quizes
            .filter((quiz) =>
              quiz.question.toLowerCase().includes(searchContent.toLowerCase())
            )
            .map((quiz, index) => <QuizRibbon key={index} quiz={quiz} />)
        ) : (
          <>
            <h1 className="text-[3vmax] font-bold">No questions added yet</h1>
            <Link to="/admin/add" className="text-white">
              Add Questions
            </Link>
          </>
        )}
      </div>
    </Container>
  )
}

export default ManageQuiz
