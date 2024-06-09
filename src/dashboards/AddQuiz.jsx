import authService from "../api/auth.service"
import { Container, Quiz } from "../components/components"
import { Navigate } from "react-router-dom"
import { useEffect, useState } from "react"
import "./dashboards.css"
import { useSelector, useDispatch } from "react-redux"
import { login, setData } from "../redux/user.slice"

const Admin = () => {
  const { loggedIn, data } = useSelector((state) => state.user)
  const [loading, setLoading] = useState(true)
  const dispatch = useDispatch()

  useEffect(() => {
    authService
      .getCurrentUser()
      .then((user) => {
        dispatch(setData(user))
        dispatch(login())
      })
      .catch((err) => {
        console.error(err)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  if (loading)
    return (
      <Container className="h-screen flex justify-center items-center">
        <h1 className="text-[3vmax] font-bold">Loading...</h1>
      </Container>
    )
  if (!loggedIn) return <Navigate to="/signup" />
  if (data.name != "admin") return <Navigate to="/" />
  return (
    <div id="add-quiz" className="londrina-solid-regular">
      <Container className="min-h-screen flex justify-center items-center">
        <Quiz />
      </Container>
    </div>
  )
}

export default Admin
