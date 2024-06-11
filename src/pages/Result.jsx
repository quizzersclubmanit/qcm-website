import "./pages.css"
import { useParams, useNavigate } from "react-router-dom"
import { Container, Button } from "../components/components"

const Result = () => {
  const { score } = useParams()
  const navigate = useNavigate()

  return (
    <Container className="h-screen bg-blue-500 flex flex-col justify-center items-center gap-4 londrina-solid-regular">
      <h1 className="text-[7vmax] text-yellow-400">Score: {score}</h1>
      <Button
        className="bg-white p-2 rounded-lg"
        label="Back to home page"
        onClick={() => {
          navigate("/")
        }}
      />
    </Container>
  )
}

export default Result
