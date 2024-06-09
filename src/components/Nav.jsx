import { useNavigate } from "react-router-dom"
import { Button } from "./components"
import authService from "../api/auth.service"
import { useEffect, useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { login, logout, setData } from "../redux/user.slice"
import { FaCircleUser } from "react-icons/fa6"
import { IoIosArrowDropdownCircle } from "react-icons/io"

const Nav = ({ hidden = false }) => {
  const tabs = [
    {
      name: "Home",
      to: "#hero"
    },
    {
      name: "About",
      to: "#about"
    },
    {
      name: "Events",
      to: "#events"
    },
    {
      name: "Team",
      to: "#gallery"
    }
  ]
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { data, loggedIn } = useSelector((state) => state.user)
  const [showDropDown, setShowDropDown] = useState(false)
  const name = data.name?.split(" ")[0] || "User"

  useEffect(() => {
    if (Object.keys(data).length == 0) {
      authService
        .getCurrentUser()
        .then((user) => {
          dispatch(setData(user))
          dispatch(login())
        })
        .catch((err) => {
          console.error(err)
        })
    }
  }, [])

  return (
    <nav
      className={`items-center gap-2 md:justify-between justify-around w-3/4 md:w-1/2 ${hidden ? "hidden" : ""} sm:flex`}
    >
      <div className="flex flex-col gap-[4vw] my-3 sm:flex-row sm:my-0">
        {tabs.map((tab, index) => (
          <a
            key={index}
            href={tab.to}
            className="hover:bg-white hover:text-gray-500 sm:hover:text-gray-300 trwi transition-all p-2 rounded-lg sm:hover:bg-inherit text-lg no-underline"
          >
            {tab.name}
          </a>
        ))}
      </div>
      {loggedIn ? (
        <div className="flex border border-black sm:border-none py-1 px-3 rounded sm:flex-col flex-row gap-1 justify-between items-center cursor-pointer">
          <FaCircleUser style={{ fontSize: "2.2vmax" }} />
          <div className="flex items-center gap-2">
            <span className="uppercase">{name}</span>
            <IoIosArrowDropdownCircle
              className="text-xl"
              onClick={() => {
                setShowDropDown((prev) => !prev)
              }}
            />
          </div>

          <div
            className={`fixed right-[10%] top-[20%] text-white bg-black w-[15%] rounded-lg p-4 min-h-[10%] ${showDropDown ? "flex flex-col items-center justify-center gap-3" : "hidden"}`}
          >
            <Button
              label="Logout"
              className="py-2 px-3 text-lg shadow-lg bg-white text-black rounded-lg hover:bg-gray-100"
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
            />

            {name == "admin" && (
              <>
                <Button
                  label="Add Quiz"
                  className="py-2 px-3 text-lg shadow-lg bg-white text-black rounded-lg hover:bg-gray-100"
                  onClick={() => {
                    navigate("/admin/add")
                  }}
                />
                <Button
                  label="Manage Quiz"
                  className="py-2 px-3 text-lg shadow-lg bg-white text-black rounded-lg hover:bg-gray-100"
                  onClick={() => {
                    navigate("/admin/manage")
                  }}
                />
              </>
            )}
          </div>
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
