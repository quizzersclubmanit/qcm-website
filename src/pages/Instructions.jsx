import { useParams, Link } from "react-router-dom"
import { Container } from "../components/components"
import { useSelector } from "react-redux"
import { timeLimits } from "../../constants"
import { instructions } from "../assets/qcmData.json"

const Instructions = () => {
  const { sec } = useParams()
  const { data } = useSelector((state) => state.user)
  const instrs = [
    {
      key: "Quiz Duration",
      value: `${timeLimits[sec - 1]} minutes`
    },
    {
      key: "Section",
      value: sec
    },
    {
      key: "Problem Type",
      value: instructions[`section-${sec}`].type
    },
    {
      key: "Marking Scheme",
      value: instructions[`section-${sec}`]["marking-scheme"]
    }
  ]

  return (
    <Container className="bg-yellow-500 flex justify-center items-center min-h-screen sm:px-2">
      <div className="bg-white p-10 sm:rounded-lg shadow-lg sm:w-3/4 min-h-1/2 flex sm:flex-row flex-col gap-5 items-center">
        <div className="sm:w-1/2 flex flex-col sm:gap-5">
          <h1 className="text-xl font-semibold">Hey {data.name},</h1>
          <h2 className="text-2xl font-bold mt-2">Welcome to the Quiz</h2>
          <ul className="text-gray-700 text-sm leading-relaxed">
            {instrs.map((obj, index) => (
              <li key={index}>
                <strong>{obj.key}:</strong> {obj.value}
              </li>
            ))}
          </ul>
        </div>
        <div className="sm:w-1/2 flex flex-col gap-5">
          <h2 className="text-xl font-semibold">Instructions</h2>
          <hr />
          <ul className="mt-2 text-gray-700 leading-relaxed">
            {Object.keys(instructions.general).map((key, index) => (
              <li key={index}>
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
