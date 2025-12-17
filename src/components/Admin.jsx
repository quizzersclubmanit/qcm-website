import { useSelector } from "react-redux"
import { Outlet } from "react-router-dom"
import { Navigate } from "react-router-dom"

const Admin = () => {
  const { loggedIn, data } = useSelector((state) => state.user)

  if (!loggedIn) return <Navigate to="/signup" />
  
  // Check if user is admin - either by name or email or a specific admin field
  const isAdmin = data.name === "admin" || 
                  data.email === "admin@qcm.com" || 
                  data.email === "admin@admin.com" ||
                  data.isAdmin === true ||
                  (data.email && data.email.toLowerCase().includes("admin"))
  
  if (!isAdmin) return <Navigate to="/" />
  return <Outlet />
}

export default Admin
