import { NavLink, useNavigate } from "react-router-dom"
import { Button } from "./components"
import authService from "../api/auth.service"
import { useEffect } from "react"
import { FaCircleUser } from "react-icons/fa6"
import { useSelector, useDispatch } from "react-redux"
import { login, logout, setData } from "../redux/user.slice"

const Nav = ({ hidden = false }) => {
  const tabs = [
    {
      name: "Home",
      to: "/#hero"
    },
    {
      name: "About",
      to: "/#about"
    },
    {
      name: "Events",
      to: "/#events"
    },
    {
      name: "Team",
      to: "/#gallery"
    }
  ]
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { data, loggedIn } = useSelector((state) => state.user)

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
  }, [])

  return (
    <nav
      className={`items-center gap-2 md:justify-between justify-around w-3/4 md:w-1/2 ${hidden ? "hidden" : ""} sm:flex`}
    >
      <div className="flex flex-col gap-[4vw] my-3 sm:flex-row sm:my-0">
        {tabs.map((tab, index) => (
          <NavLink
            key={index}
            to={tab.to}
            className="hover:bg-white hover:text-gray-500 sm:hover:text-gray-300 trwi transition-all p-2 rounded-lg sm:hover:bg-inherit text-lg"
          >
            {tab.name}
          </NavLink>
        ))}
      </div>
      {loggedIn ? (
        <div
          className="flex border border-black sm:border-none p-1 rounded sm:flex-col flex-row gap-1 items-center cursor-pointer"
          onClick={() => {
            const proceedToLogout = confirm("Proceed to Logout?")
            if (!proceedToLogout) return
            authService
              .logout()
              .then(() => {
                dispatch(logout())
              })
              .catch((err) => {
                alert(err.message) // Hot Toast
                console.error(err)
              })
          }}
        >
          <FaCircleUser style={{ fontSize: "2.5vmax" }} />
          <span>{data.name?.split(" ")[0] || "User"}</span>
        </div>
      ) : (
        <Button
          label="Signup"
          className="py-2 px-3 text-lg shadow-lg bg-white text-black rounded-lg hover:bg-gray-100"
          onClick={() => {
            navigate("signup")
          }}
        />
      )}
    </nav>
  )
}

export default Nav
