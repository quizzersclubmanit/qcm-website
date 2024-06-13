import { useSelector } from "react-redux"
import { Outlet } from "react-router-dom"
import { Navigate } from "react-router-dom"

const Admin = () => {
  const { loggedIn, data } = useSelector((state) => state.user)

  if (!loggedIn) return <Navigate to="/signup" />
  if (data.name != "admin") return <Navigate to="/" />
  return <Outlet />
}

export default Admin
