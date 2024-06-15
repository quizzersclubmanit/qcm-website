import { useNavigate } from "react-router-dom"
import { Button, DropDown } from "./components"
import authService from "../api/auth.service"
import { useEffect, useState, forwardRef, useRef } from "react"
import { useSelector, useDispatch } from "react-redux"
import { login, setData } from "../redux/user.slice"
import { IoIosArrowDropdownCircle } from "react-icons/io"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"

const UserBtn = forwardRef(({ name, showDropDown, setShowDropDown }, ref) => {
  const { contextSafe } = useGSAP()

  const animateDropDown = contextSafe((cond) => {
    if (cond) {
      gsap.to(ref.current, {
        opacity: 1,
        transform: "translateY(0)",
        ease: "back.out"
      })
    } else {
      gsap.to(ref.current, {
        opacity: 0,
        transform: "translateY(-100%)",
        ease: "back.in"
      })
    }
  })

  useEffect(() => {
    return () => {
      setShowDropDown(false)
    }
  }, [])

  return (
    <div className="flex items-center justify-between md:gap-2 md:bg-white rounded md:p-2 pr-10 pl-1 py-1 overflow-y-hidden">
      <span className="uppercase text-black">{name}</span>
      <IoIosArrowDropdownCircle
        className="text-xl cursor-pointer"
        onClick={() => {
          setShowDropDown((prev) => !prev)
          animateDropDown(!showDropDown)
        }}
      />
    </div>
  )
})

const Nav = forwardRef(({ className }, ref) => {
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
        className={`md:items-center gap-3 md:justify-between justify-around w-3/4 flex md:flex-row flex-col md:overflow-y-hidden md:pl-10 md:h-[12vh] ${className}`}
      >
        <div className="tabs-bar flex flex-col gap-[4vw] md:flex-row h-full md:items-center md:bg-[#000000a6] px-2 rounded-2xl">
          {tabs.map((tab, index) => (
            <a
              key={index}
              href={tab.to}
              className="hover:text-yellow-400 trwi transition-all p-2 rounded-lg text-lg no-underline hover:scale-125 md:text-white text-black"
            >
              {tab.name}
            </a>
          ))}
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
            className="py-2 px-3 text-lg shadow-lg bg-gray-50 text-black rounded-lg hover:bg-gray-100 overflow-y-hidden"
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
