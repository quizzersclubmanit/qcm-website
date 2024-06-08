import { RiPencilFill } from "react-icons/ri"
import { MdDelete } from "react-icons/md"
import dbService from "../api/db.service"
import { useQuizContext } from "../contexts/quiz.context"
import env from "../../env"
import { Modal, Quiz } from "./components"
import { useState } from "react"

const QuizRibbon = ({ quiz = {} }) => {
  const { deleteQuiz } = useQuizContext()
  const [showQuizModal, setShowQuizModal] = useState(false)

  return (
    <div
      className="flex items-center w-1/2 justify-between pl-3 bg-white"
      style={{
        borderTopLeftRadius: "10px",
        borderBottomLeftRadius: "10px"
      }}
    >
      <p className="text-xl w-[90%] continue-text">Q. {quiz.question}?</p>
      <div className="flex">
        <RiPencilFill
          className="text-[3vmax] cursor-pointer bg-yellow-400 p-2"
          onClick={() => {
            setShowQuizModal(true)
          }}
        />
        <MdDelete
          className="text-[3vmax] cursor-pointer bg-red-500 p-2"
          onClick={() => {
            dbService
              .delete({
                collectionId: env.quizId,
                documentId: quiz.$id
              })
              .then(() => {
                deleteQuiz(quiz.$id)
              })
          }}
        />
      </div>
      {showQuizModal && (
        <Modal setShowModal={setShowQuizModal}>
          <Quiz quiz={quiz} setShowModal={setShowQuizModal} />
        </Modal>
      )}
    </div>
  )
}

export default QuizRibbon
