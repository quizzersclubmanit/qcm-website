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
  const [isScrolled, setIsScrolled] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch()

  const { data, loggedIn } = useSelector((state) => state.user)
  const name = data?.name?.split(" ")[0] || "User"
  const isAdmin = isStaffUser(data)
  const [showDropDown, setShowDropDown] = useState(false)
  const anchorRef = useRef(null)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15)
    }
    handleScroll()
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

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
    <header className="fixed top-0 left-0 right-0 w-full z-50 px-3 sm:px-6 pt-2.5 sm:pt-4 pointer-events-none transition-all duration-300">
      <div
        className={`w-full max-w-6xl mx-auto pointer-events-auto h-16 sm:h-[68px] px-4 sm:px-6 flex items-center justify-between rounded-2xl md:rounded-full border transition-all duration-300 ${
          isScrolled
            ? "bg-[#060d13]/92 backdrop-blur-2xl border-white/20 shadow-[0_14px_45px_rgba(0,0,0,0.75),0_0_20px_rgba(254,156,2,0.08)] py-2"
            : "bg-[#07131b]/85 backdrop-blur-xl border-white/15 shadow-[0_8px_32px_rgba(0,0,0,0.55)] py-2.5"
        }`}
      >
        {/* Brand Logo & Name */}
        <Link to="/" className="flex items-center gap-3 group flex-shrink-0">
          <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center p-1 group-hover:border-[#fe9c02]/40 group-hover:bg-[#fe9c02]/10 transition-all duration-300 shadow-sm">
            <img
              src={qcmLogoSm}
              alt="QCM Logo"
              width="40"
              height="40"
              className="w-full h-full object-contain drop-shadow transition-transform duration-300 group-hover:scale-105"
            />
          </div>
          <div className="flex flex-col text-left leading-tight">
            <span className="font-extrabold text-white text-sm sm:text-base tracking-tight group-hover:text-[#fe9c02] transition-colors">
              Quizzers&apos; Club
            </span>
            <span className="text-[10px] sm:text-[11px] font-bold text-[#fe9c02] tracking-widest uppercase">
              MANIT Bhopal
            </span>
          </div>
        </Link>

        {/* Center Desktop Navigation */}
        <Nav className="hidden md:flex items-center mx-2 lg:mx-4" />

        {/* Right CTA / Auth Controls */}
        <div className="flex items-center gap-2.5 sm:gap-3 flex-shrink-0">
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
              className="btn-shimmer inline-flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-bold text-[#060e14] bg-gradient-to-r from-amber-400 via-[#fe9c02] to-amber-500 hover:from-amber-300 hover:to-amber-400 shadow-md shadow-[#fe9c02]/25 hover:shadow-lg hover:shadow-[#fe9c02]/40 hover:scale-[1.03] active:scale-[0.98] transition-all duration-200"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#060e14] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#060e14]"></span>
              </span>
              <span>Register</span>
              <span aria-hidden="true">&rarr;</span>
            </button>
          )}

          {/* Mobile Hamburger Button */}
          <button
            type="button"
            onClick={() => setShowTabModal(true)}
            aria-label="Open navigation menu"
            className="md:hidden w-10 h-10 rounded-full flex items-center justify-center bg-white/10 text-white hover:text-[#fe9c02] hover:bg-white/20 border border-white/10 transition-colors focus:outline-none"
          >
            <RxHamburgerMenu className="text-lg" />
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
