import { useParams, Link } from "react-router-dom"

const Instructions = () => {
  const { sec } = useParams()
  return (
    <>
      <div>{sec}</div>
      <Link to={`/quiz/play/${sec}`}>Start Quiz</Link>
    </>
  )
}

export default Instructions
