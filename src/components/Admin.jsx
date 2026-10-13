import { useSelector } from "react-redux"
import { Outlet, Navigate } from "react-router-dom"
import { isStaffUser } from "../utils/authUtils"

const Admin = () => {
  const { loggedIn, data } = useSelector((state) => state.user)

  if (!loggedIn) return <Navigate to="/signin" replace />
  
  if (!isStaffUser(data)) {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}

export default Admin
