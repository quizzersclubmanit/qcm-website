import { useParams, Link } from "react-router-dom"
import { Container } from "../components/components"
import { useSelector } from "react-redux"
import { timeLimits } from "../../constants"
import { instructions } from "../assets/qcmData.json"

const Instructions = () => {
  const { sec } = useParams()
  const { data } = useSelector((state) => state.user)
  return (
    <Container className="bg-gray-100 flex justify-center items-center min-h-screen px-2">
      <div className="bg-white p-10 rounded-lg shadow-lg sm:w-3/4 min-h-1/2 flex sm:flex-row flex-col gap-5 items-center">
        <div className="sm:w-1/2 flex flex-col sm:gap-5">
          <h1 className="text-xl font-semibold">Hey {data.name},</h1>
          <h2 className="text-2xl font-bold mt-2">Welcome to the Quiz</h2>
          <div className="mt-4">
            <p className="text-sm">
              <strong>Quiz Duration:</strong> {timeLimits[sec - 1]} minutes
            </p>
            <p className="text-sm">
              <strong>Section:</strong> {sec}
            </p>
            <p className="text-sm">
              <strong>Problem Type:</strong>{" "}
              {instructions[`section-${sec}`].type}
            </p>
            <p className="text-sm">
              <strong>Marking Scheme:</strong>{" "}
              {instructions[`section-${sec}`]["marking-scheme"]}
            </p>
          </div>
        </div>
        <div className="sm:w-1/2 flex flex-col gap-5">
          <h2 className="text-xl font-semibold">Instructions</h2>
          <hr />
          <ul className="list-inside mt-2 text-gray-700 list-disc">
            {Object.keys(instructions.general).map((key, index) => (
              <li className="list-none" key={index}>
                <strong>{key}:</strong> {instructions.general[key]}
              </li>
            ))}
          </ul>
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
