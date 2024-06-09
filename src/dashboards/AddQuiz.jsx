import { Container, Quiz, Logo } from "../components/components"
import { Navigate } from "react-router-dom"
import "./dashboards.css"
import { useSelector } from "react-redux"

const Admin = () => {
  const { loggedIn, data } = useSelector((state) => state.user)

  if (!loggedIn) return <Navigate to="/signup" />
  if (data.name != "admin") return <Navigate to="/" />
  return (
    <div id="add-quiz" className="londrina-solid-regular">
      <Container className="min-h-screen flex justify-center items-center flex-col gap-5">
        <Logo className="w-[9vmax] sm:w-[5vmax]" />
        <Quiz />
      </Container>
    </div>
  )
}

export default Admin
