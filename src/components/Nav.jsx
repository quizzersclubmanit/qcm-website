import { useNavigate, Link, useLocation } from "react-router-dom"
import { Button, DropDown, UserBtn } from "./components"
import authService from "../api/auth.service"
import { useEffect, useState, forwardRef, useRef } from "react"
import { useSelector, useDispatch } from "react-redux"
import { login, logout, setData } from "../redux/user.slice"
import { isStaffUser } from "../utils/authUtils"
import { log, warn, error as logError } from "../utils/log.js"

const Nav = forwardRef(({ className = "", offModal = () => {} }, ref) => {
  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const tabs = [
    { name: "Home", to: "/#hero" },
    { name: "About", to: "/#about" },
    { name: "Events", to: "/#events" },
    { name: "Team", to: "/team" },
    { name: "FAQs", to: "/faqs" },
    { name: "Sponsors", to: "/#sponsors" },
    { name: "Contact", to: "/#contacts" }
  ]

  const { data, loggedIn } = useSelector((state) => state.user)
  const name = data?.name?.split(" ")[0] || "User"
  const isAdmin = isStaffUser(data)
  const [showDropDown, setShowDropDown] = useState(false)
  const anchorRef = useRef(null)

  useEffect(() => {
    const authPages = ['/signup', '/signin', '/reset-password', '/login']
    if (authPages.some(page => location.pathname.startsWith(page))) {
      return
    }

    if (loggedIn && data?.id) {
      return
    }

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 5000)

    authService
      .getCurrentUser()
      .then((user) => {
        if (user && user.id) {
          dispatch(setData(user))
          dispatch(login())
        } else {
          dispatch(logout())
        }
      })
      .catch((error) => {
        if (error.name !== 'AbortError' && error.message !== 'Not authenticated') {
          logError('Auth check error:', error)
        }
      })
      .finally(() => {
        clearTimeout(timeoutId)
      })

    return () => {
      controller.abort()
      clearTimeout(timeoutId)
    }
  }, [location.pathname, loggedIn, data?.id, dispatch])

  const handleTabClick = (e, to) => {
    offModal()
    if (to.startsWith("/#")) {
      const hash = to.replace("/", "")
      if (location.pathname === "/") {
        e.preventDefault()
        const el = document.querySelector(hash)
        if (el) el.scrollIntoView({ behavior: "smooth" })
      }
    }
  }

  return (
    <nav ref={ref} className={`poppins-regular ${className}`}>
      {/* Navigation Links */}
      <div className="flex items-center gap-1 lg:gap-2">
        {tabs.map((tab) => (
          <Link
            key={tab.name}
            to={tab.to}
            onClick={(e) => handleTabClick(e, tab.to)}
            className="text-slate-200 hover:text-[#FCA311] text-xs lg:text-sm font-medium px-2.5 py-1 rounded-full transition-colors duration-150 hover:bg-white/5"
          >
            {tab.name}
          </Link>
        ))}
      </div>

      {/* Auth Action */}
      <div className="flex items-center gap-3">
        {loggedIn ? (
          <div ref={anchorRef} className="relative">
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
          <Button
            label="Register"
            className="py-1.5 px-4 text-xs font-bold rounded-full bg-[#FCA311] text-[#14213D] hover:bg-amber-400 shadow-sm transition-all duration-150"
            onClick={() => {
              navigate("/signup")
            }}
          />
        )}
      </div>
    </nav>
  )
})

Nav.displayName = "Nav"

export default Nav
