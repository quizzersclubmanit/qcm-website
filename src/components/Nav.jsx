import { useNavigate, Link, useLocation } from "react-router-dom"
import { Button, DropDown, UserBtn, Logo } from "./components"
import authService from "../api/auth.service"
import { useEffect, useState, forwardRef, useRef } from "react"
import { useSelector, useDispatch } from "react-redux"
import { login, logout, setData } from "../redux/user.slice"
import { isStaffUser } from "../utils/authUtils"

const Nav = forwardRef(({ className, offModal = () => {} }, ref) => {
  const location = useLocation()
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
  const name = data?.name?.split(" ")[0] || "User"
  const isAdmin = isStaffUser(data)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const logoRef = useRef(null)
  const [showDropDown, setShowDropDown] = useState(false)
  const anchorRef = useRef(null)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  useEffect(() => {
    console.log('Nav useEffect running, checking auth...')
    
    // Skip auth check on authentication pages to prevent 401 errors
    const authPages = ['/signup', '/signin', '/reset-password', '/login']
    if (authPages.some(page => location.pathname.startsWith(page))) {
      console.log('Skipping auth check on auth page:', location.pathname)
      return
    }

    // Don't check auth if we're already logged in (from Redux state)
    if (loggedIn && data?.id) {
      console.log('User already authenticated in Redux state, skipping auth check')
      return
    }

    console.log('Calling getCurrentUser to verify session...')
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 5000) // 5 second timeout

    authService
      .getCurrentUser()
      .then((user) => {
        console.log('Auth restored successfully:', user)
        if (user && user.id) {
          dispatch(setData(user))
          dispatch(login())
        } else {
          console.warn('Invalid user data received:', user)
          // Clear any invalid user data
          dispatch(logout())
        }
      })
      .catch((error) => {
        if (error.name === 'AbortError') {
          console.warn('Auth check timed out')
        } else if (error.message !== 'Not authenticated') {
          console.error('Auth check error:', error)
        } else {
          console.log('User not authenticated, clearing any existing session')
          dispatch(logout())
        }
      })
      .finally(() => {
        clearTimeout(timeoutId)
      })

    return () => {
      controller.abort()
      clearTimeout(timeoutId)
    }
  }, [location.pathname, loggedIn, data?.id])

  return (
    <>
      <nav
        ref={ref}
        className={`poppins-regular md:items-center md:justify-between justify-around gap-3 flex md:flex-row flex-col items-center md:overflow-y-hidden h-[50vh] lg:h-[15vh] w-full ${className}`}
      >
        <Logo
          ref={logoRef}
          className="hidden md:block md:w-[3vmax] w-[5vmax] cursor-default"
        />
        <div className="tabs-bar flex flex-col gap-[2vw] mt-0 pt-0 md:flex-row h-22 items-center px-2 rounded-2xl">
          {tabs.map((tab, index) =>
            tab.to.startsWith("#") ? (
              <a
                key={index}
                href={`/${tab.to}`}
                className="hover:text-yellow-400 transition-all text-base no-underline text-black 
                border-2 rounded-[25px] py-[5px] px-[10px] 
                md:hover:scale-125 md:text-white md:border-none md:rounded-none md:p-2"
                style={{ borderColor: "currentColor" }}
                onClick={offModal}
              >
                {tab.name}
              </a>
            ) : (
              <Link
                key={index}
                to={tab.to}
                className="hover:text-yellow-400 transition-all text-base no-underline text-black 
                border-2 rounded-[25px] py-[5px] px-[10px] 
                md:hover:scale-125 md:text-white md:border-none md:rounded-none md:p-2"
                style={{ borderColor: "currentColor" }}
                onClick={offModal}
              >
                {tab.name}
              </Link>
            )
          )}
        </div>
        {loggedIn ? (
          <div ref={anchorRef} className="flex sm:flex-row flex-col relative">
            {/* <Button
              label="IQC Preparation Booklet"
              onClick={() =>
                window.open(
                  "https://drive.google.com/file/d/1fDRrSJycHoWlM-ZH6m_JbdgeDR0aIswT/view?usp=sharing",
                  "_blank"
                )
              }
              className="poppins-regular flex items-center md:gap-2 sm:bg-[#E5E5E5] rounded-lg md:p-2 justify-center gap-3 py-1 overflow-y-hidden sm:border-none border border-black p-2"
            /> */}
            <UserBtn
              name={name}
              showDropDown={showDropDown}
              setShowDropDown={setShowDropDown}
            />
            <DropDown
              user={isAdmin ? "admin" : name}
              visible={showDropDown}
              onClose={() => setShowDropDown(false)}
              anchorRef={anchorRef}
            />
          </div>
        ) : (
          <div className="flex sm:flex-row flex-col gap-2 items-center">
            <Button
              label="Login"
              className="poppins-medium py-2 px-4 text-sm flex items-center justify-center text-white/90 rounded-full border border-white/60 bg-transparent hover:bg-white hover:text-blue-900 transition-all duration-200"
              onClick={() => {
                navigate("/signin")
              }}
            />
            <Button
              label="Sign Up"
              className="poppins-semibold py-2 px-5 text-sm flex items-center justify-center text-white rounded-full bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-900/20 border border-blue-500 transition-all duration-200"
              onClick={() => {
                navigate("/signup")
              }}
            />
          </div>
        )}
      </nav>
    </>
  )
})

export default Nav


