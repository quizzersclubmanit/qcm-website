import { useNavigate } from "react-router-dom"
import { Button, Container } from "./components"
import authService from "../api/auth.service"
import { useEffect, useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { login, logout, setData } from "../redux/user.slice"
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
    },
    {
      name: "Sponsors",
      to: "#sponsors"
    }
  ]
  const { data, loggedIn } = useSelector((state) => state.user)
  const name = data.name?.split(" ")[0] || "User"
  const buttons = [
    {
      label: "Logout",
      f: () => {
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
      },
      visible: true
    },
    {
      label: "Play Quiz",
      f: () => {
        navigate("/quiz/play")
      },
      visible: true
    },
    {
      label: "Add Quiz",
      f: () => {
        navigate("/admin/add")
      },
      visible: name == "admin"
    },
    {
      label: "Manage Quiz",
      f: () => {
        navigate("/admin/manage")
      },
      visible: name == "admin"
    }
  ]
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [showDropDown, setShowDropDown] = useState(false)

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
    <Container
      element="nav"
      className={`items-center gap-2 md:justify-between justify-around w-3/4 sm:flex ${hidden && "hidden"}`}
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
        <div className="flex border border-black sm:border-none py-1 px-3 rounded sm:flex-col flex-row gap-1 justify-between items-center">
          <div className="flex items-center gap-2 borde p-2">
            <span className="uppercase text-sm">{name}</span>
            <IoIosArrowDropdownCircle
              className="text-xl cursor-pointer"
              onClick={() => {
                setShowDropDown((prev) => !prev)
              }}
            />
          </div>

          <div
            className={`drop-down-menu fixed sm:w-[20vw] sm:min-h-[20vh] w-[50vw] sm:top-1/4 top-full sm:right-10 right-7 text-black sm:bg-white transparent-white shadow-lg rounded-lg flex flex-col items-center justify-evenly gap-3 p-4 ${!showDropDown && "hidden"}`}
          >
            {buttons.map((btn, index) => (
              <Button
                key={index}
                label={btn.label}
                onClick={btn.f}
                className={`${!btn.visible && "hidden"} text-lg border border-blue-800 w-full py-2 rounded-lg hover:bg-gray-50`}
              />
            ))}
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
    </Container>
  )
}

export default Nav
