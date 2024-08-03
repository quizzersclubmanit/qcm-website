import { useParams, Link } from "react-router-dom"
import { Container, Button } from "../components/components"
import { useSelector } from "react-redux"
import { timeLimits } from "../../constants"

const Instructions = () => {
  const { sec } = useParams()
  const { data } = useSelector((state) => state.user)
  return (
    // <>
    //   <div>{sec}</div>
    //   <Link to={`/quiz/play/${sec}`}>Start Quiz</Link>
    // </>
    <Container className="bg-gray-100 flex justify-center items-center h-screen">
      <div className="bg-white p-10 rounded-lg shadow-lg w-3/4 min-h-1/2 flex items-center">
        <div className="w-1/2 flex flex-col gap-5">
          <h1 className="text-xl font-semibold">Hey {data.name},</h1>
          <h2 className="text-2xl font-bold mt-2">Welcome to the Quiz</h2>
          <div className="mt-4">
            <p className="text-sm">
              <strong>Quiz Duration:</strong> {timeLimits[sec - 1]} minutes
            </p>
            <p className="text-sm">
              <strong>Section:</strong> {sec}
            </p>
          </div>
        </div>
        <div className="w-1/2 flex flex-col gap-5">
          <h2 className="text-xl font-semibold">Instructions</h2>
          <hr />
          <ol className="list-decimal list-inside mt-2 text-gray-700">
            <li>
              This is a timed test. Please make sure you are not interrupted
              during the test, as the timer cannot be paused once started.
            </li>
            <li>Please ensure you have a stable internet connection.</li>
          </ol>
          <Link
            className="background-blue text-center text-white px-4 py-2 rounded-lg
          mr-4 mt-6"
            to={`/quiz/play/${sec}`}
          >
            Start Quiz
          </Link>
        </div>
      </div>
    </Container>
  )
}

export default Instructions
