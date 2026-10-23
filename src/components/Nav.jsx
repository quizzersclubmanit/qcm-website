import { Link, useLocation } from "react-router-dom"
import { DropDown, UserBtn } from "./components"
import authService from "../api/auth.service"
import { useEffect, useState, forwardRef, useRef } from "react"
import { useSelector, useDispatch } from "react-redux"
import { login, logout, setData } from "../redux/user.slice"
import { isStaffUser } from "../utils/authUtils"
import { error as logError } from "../utils/log.js"

const Nav = forwardRef(({ className = "", offModal = () => {} }, ref) => {
  const location = useLocation()
  const dispatch = useDispatch()

  const tabs = [
    { name: "Home", to: "/#hero", hash: "#hero" },
    { name: "About", to: "/#about", hash: "#about" },
    { name: "Events", to: "/#events", hash: "#events" },
    { name: "Team", to: "/team" },
    { name: "FAQs", to: "/faqs" },
    { name: "Sponsors", to: "/#sponsors", hash: "#sponsors" },
    { name: "Contact", to: "/#contacts", hash: "#contacts" }
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
      {/* Navigation Links with animated indicator */}
      <div className="flex items-center gap-0.5 lg:gap-1 bg-white/5 p-1 rounded-full border border-white/5">
        {tabs.map((tab) => {
          const isActive = tab.hash
            ? location.pathname === "/" && location.hash === tab.hash
            : location.pathname === tab.to

          return (
            <Link
              key={tab.name}
              to={tab.to}
              onClick={(e) => handleTabClick(e, tab.to)}
              className={`relative px-3 py-1 rounded-full text-xs lg:text-sm font-semibold transition-all duration-200 ${
                isActive
                  ? "text-[#FCA311] bg-white/10 shadow-sm"
                  : "text-slate-200 hover:text-white hover:bg-white/10"
              }`}
            >
              {tab.name}
            </Link>
          )
        })}
      </div>

      {/* User Dropdown if Authenticated */}
      {loggedIn && (
        <div ref={anchorRef} className="relative ml-2">
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
      )}
    </nav>
  )
})

Nav.displayName = "Nav"

export default Nav
