import { useState, useRef, useEffect } from "react"
import { useNavigate, Link, useLocation } from "react-router-dom"
import { RxHamburgerMenu } from "react-icons/rx"
import { useSelector, useDispatch } from "react-redux"
import { qcmLogoSm } from "../assets/assets"
import { isStaffUser } from "../utils/authUtils"
import { login, logout, setData } from "../redux/user.slice"
import authService from "../api/auth.service"
import { error as logError } from "../utils/log.js"
import { UserBtn, DropDown } from "./components"
import Nav from "./Nav"
import MobileDrawer from "./MobileDrawer"

const Header = () => {
  const [showTabModal, setShowTabModal] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch()

  const { data, loggedIn } = useSelector((state) => state.user)
  const name = data?.name?.split(" ")[0] || "User"
  const isAdmin = isStaffUser(data)
  const [showDropDown, setShowDropDown] = useState(false)
  const anchorRef = useRef(null)

  useEffect(() => {
    const authPages = ["/signup", "/signin", "/reset-password", "/login"]
    if (authPages.some((page) => location.pathname.startsWith(page))) {
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
        if (error.name !== "AbortError" && error.message !== "Not authenticated") {
          logError("Auth check error:", error)
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

  return (
    <header className="fixed top-0 left-0 right-0 w-full z-50 bg-[#0d222e]/85 backdrop-blur-xl border-b border-white/[0.08] shadow-[0_4px_25px_rgba(0,0,0,0.35)] transition-colors duration-200">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-8 h-16 sm:h-20 flex items-center justify-between">
        
        {/* Brand Logo & Name */}
        <Link to="/" className="flex items-center gap-3 group flex-shrink-0">
          <img
            src={qcmLogoSm}
            alt="Quizzers' Club MANIT Logo"
            width="42"
            height="42"
            className="w-9 h-9 sm:w-11 sm:h-11 object-contain drop-shadow transition-transform duration-300 group-hover:scale-105"
          />
          <div className="flex flex-col text-left leading-tight">
            <span className="font-extrabold text-white text-base sm:text-lg tracking-tight group-hover:text-[#fe9c02] transition-colors">
              Quizzers&apos; Club
            </span>
            <span className="text-[10px] sm:text-[11px] font-semibold text-[#fe9c02] tracking-wider uppercase">
              MANIT Bhopal
            </span>
          </div>
        </Link>

        {/* Center Desktop Navigation */}
        <Nav className="hidden md:flex items-center gap-6 lg:gap-8 mx-4" />

        {/* Right CTA / Auth Controls */}
        <div className="flex items-center gap-3 flex-shrink-0">
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
            <button
              type="button"
              onClick={() => navigate("/signup")}
              className="inline-flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-bold text-[#0c1e28] bg-[#fe9c02] hover:bg-amber-400 shadow-md shadow-[#fe9c02]/20 hover:shadow-lg hover:shadow-[#fe9c02]/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
            >
              <span>Register</span>
              <span aria-hidden="true">&rarr;</span>
            </button>
          )}

          {/* Mobile Hamburger Button */}
          <button
            type="button"
            onClick={() => setShowTabModal(true)}
            aria-label="Open navigation menu"
            className="md:hidden w-10 h-10 rounded-xl flex items-center justify-center bg-white/10 text-white hover:text-[#fe9c02] hover:bg-white/15 transition-colors focus:outline-none"
          >
            <RxHamburgerMenu className="text-xl" />
          </button>
        </div>

        <MobileDrawer
          open={showTabModal}
          onClose={() => setShowTabModal(false)}
        />
      </div>
    </header>
  )
}

export default Header
