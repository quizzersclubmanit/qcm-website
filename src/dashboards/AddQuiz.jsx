import authService from "../api/auth.service"
import {Container, Quiz} from "../components/components"
import { useUserContext } from "../contexts/user.context"
import { Navigate } from "react-router-dom"
import { useEffect, useState } from "react"
import "./dashboards.css"

const Admin = () => {
  const {login, loggedIn, userData, setUserData} = useUserContext()
  const [loading, setLoading] = useState(true)

  useEffect(()=>{
    authService.getCurrentUser()
    .then(user => {
      setUserData(user)
      login()
    })
    .catch(err => {
      console.error(err)
    })
    .finally(()=>{
      setLoading(false)
    })
  },[])

  if (loading) return (
    <Container className="h-screen flex justify-center items-center">
      <h1 className="text-[3vmax] font-bold">Loading...</h1>
    </Container>
  )
  if (!loggedIn) return <Navigate to="/signup" />
  if (userData.name != "admin") return <Navigate to="/" />
  return (
    <div id="add-quiz" className="londrina-solid-regular">
      <Container className="min-h-screen flex justify-center items-center">
        <Quiz/>
      </Container>
    </div>
  )
}

export default Admin