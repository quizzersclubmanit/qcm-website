import { RiPencilFill } from "react-icons/ri"
import { MdDelete } from "react-icons/md"
import dbService from "../api/db.service"
import env from "../../env"
import { Modal, Quiz, Container } from "./components"
import { useState } from "react"
import { deleteQuiz } from "../redux/quiz.slice"
import { useDispatch } from "react-redux"
import toast from "react-hot-toast"

const QuizRibbon = ({ quiz = {} }) => {
  const [showQuizModal, setShowQuizModal] = useState(false)
  const dispatch = useDispatch()

  return (
    <Container
      className="flex items-center sm:w-1/2 w-full justify-between pl-3 bg-white"
      style={{
        borderTopLeftRadius: "10px",
        borderBottomLeftRadius: "10px"
      }}
    >
      <p className="text-xl w-[90%] continue-text">Q. {quiz.question}?</p>
      <div className="flex">
        <RiPencilFill
          className="text-[3vmax] cursor-pointer bg-yellow-400 sm:p-2"
          onClick={() => {
            setShowQuizModal(true)
          }}
        />
        <MdDelete
          className="text-[3vmax] cursor-pointer bg-red-500 sm:p-2"
          onClick={() => {
            dbService
              .delete({
                collectionId: env.quizId,
                documentId: quiz.$id
              })
              .then(() => {
                dispatch(deleteQuiz(quiz.$id))
                toast.success("Quiz Deleted Successfully")
              })
              .catch((error) => {
                console.error(error)
                toast.error(error.message)
              })
          }}
        />
      </div>
      {showQuizModal && (
        <Modal setShowModal={setShowQuizModal}>
          <Quiz quiz={quiz} setShowModal={setShowQuizModal} />
        </Modal>
      )}
    </Container>
  )
}

export default QuizRibbon
