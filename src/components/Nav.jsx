import { useNavigate, Link } from "react-router-dom"
import { Button, DropDown, UserBtn,Logo } from "./components"
import authService from "../api/auth.service"
import { useEffect, useState, forwardRef, useRef } from "react"
import { useSelector, useDispatch } from "react-redux"
import { login, setData } from "../redux/user.slice"

const Nav = forwardRef(({ className, offModal = () => {} }, ref) => {
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
      to: "team"
    },
    {
      name: "Sponsors",
      to: "#sponsors"
    },
    {
      name: "Contact Us",
      to: "#contacts"
    }
  ]
  const { data, loggedIn } = useSelector((state) => state.user)
  const name = data.name?.split(" ")[0] || "User"
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const logoRef = useRef(null)
  const [showDropDown, setShowDropDown] = useState(false)
  const dropDownRef = useRef(null)
 

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
    <>
      <nav
        ref={ref}
        className={`font-Arimo md:items-center w-full md:justify-between justify-between flex md:flex-row flex-col items-center md:overflow-y-hidden md:h-[12vh] ${className}`}
      >
         <Logo ref={logoRef} className="hidden md:block md:w-[3vmax] w-[10vmin] " />
        <div className="tabs-bar flex flex-col gap-[2vw] mt-0 pt-0 md:flex-row h-full items-center px-2 rounded-2xl">
          {tabs.map((tab, index) =>
            tab.to.startsWith("#") ? (
              <a
                key={index}
                href={tab.to}
                className="hover:text-yellow-400 md:hover:scale-125 transition-all p-2 rounded-lg text-base no-underline md:text-white font-xs text-black"
                onClick={offModal}
              >
                {tab.name}
              </a>
            ) : (
              <Link
                key={index}
                to={tab.to}
                className="hover:text-yellow-400 md:hover:scale-125 transition-all p-2 rounded-lg text-base no-underline md:text-white text-black"
                onClick={offModal}
              >
                {tab.name}
              </Link>
            )
          )}
        </div>
        {loggedIn ? (
          <UserBtn
            name={name}
            showDropDown={showDropDown}
            setShowDropDown={setShowDropDown}
            ref={dropDownRef}
          />
        ) : (
          <Button
            label="Signup"
            className="poppins-regular ml-2vmax py-1 px-5 text-sm text-white rounded-3xl border-2 border-white overflow-y-hidden"
            onClick={() => {
              navigate("signup")
            }}
          />
        )}
      </nav>
      <DropDown ref={dropDownRef} user={name} visible={showDropDown} />
    </>
  )
})

export default Nav
