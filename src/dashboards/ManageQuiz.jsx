import dbService from "../api/db.service"
import { useEffect, useState } from "react"
import env from "../../constants"
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

  if (loading) return <Loader />
  if (quizes.length == 0)
    return <NotAvailable command="Click to add quiz" redirectURL="/admin/add" />

  return (
    <Container
      id="manage-quiz"
      className="alatsi-regular md:p-[3vmax] p-[2vmax] min-h-screen flex flex-col  items-center md:gap-0 gap-4"
    >
      <Logo className="w-[8vmax] md:w-[5vmax] sm:w-[7vmax]" />
      <SearchBar content={searchContent} setContent={setSearchContent} />
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
