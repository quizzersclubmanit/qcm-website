import dbService from "../api/db.service"
import { useEffect, useState } from "react"
// import env from "../../constants" // Not needed for new backend
import {
  Container,
  QuizRibbon,
  SearchBar,
  Logo,
  Loader,
  NotAvailable
} from "../components/components"
import { useSelector, useDispatch } from "react-redux"
import { setQuizes } from "../redux/quiz.slice"

const ManageQuiz = () => {
  const quizes = useSelector((state) => state.quizes)
  const [loading, setLoading] = useState(true)
  const [searchContent, setSearchContent] = useState("")
  const dispatch = useDispatch()

  useEffect(() => {
    dbService
      .select({ collectionId: "quiz" })
      .then((res) => {
        // Handle different response formats
        const quizData = Array.isArray(res) ? res : (res.data || [])
        dispatch(setQuizes(quizData))
      })
      .catch((err) => {
        console.error(err)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  if (loading) return <Loader />
  if (quizes.length == 0)
    return <NotAvailable command="Click to add quiz" redirectURL="/admin/add" />

  return (
    <Container
      id="manage-quiz"
      className="poppins-regular background-blue md:p-[3vmax] p-[2vmax] min-h-screen flex flex-col items-center md:gap-0 gap-5"
    >
      <Logo className="w-[8vmax] md:w-[5vmax] sm:w-[7vmax] mb-9" />
      <SearchBar
        content={searchContent}
        setContent={setSearchContent}
        logo
        className="p-2 bg-white rounded-lg focus:outline-0 w-full sm:w-1/2"
      />
      <div className="flex flex-col items-center gap-3 w-full">
        {quizes
          .filter((quiz) =>
            quiz.question?.toLowerCase().includes(searchContent?.toLowerCase())
          )
          .map((quiz, index) => (
            <QuizRibbon key={index} quiz={quiz} />
          ))}
      </div>
    </Container>
  )
}

export default ManageQuiz
