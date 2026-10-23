import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { RxHamburgerMenu } from "react-icons/rx"
import { qcmLogoSm } from "../assets/assets"
import Nav from "./Nav"
import MobileDrawer from "./MobileDrawer"

const Header = () => {
  const [showTabModal, setShowTabModal] = useState(false)
  const navigate = useNavigate()

  return (
    <header className="fixed top-0 left-0 right-0 w-full z-50 px-3 sm:px-6 py-3 flex justify-center pointer-events-none">
      <div className="pointer-events-auto flex items-center justify-between w-full max-w-6xl mx-auto px-4 sm:px-6 py-2 rounded-full bg-[#14213D]/80 backdrop-blur-xl border border-white/15 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] transition-all duration-300">
        
        {/* Brand Logo & Name */}
        <Link to="/" className="flex items-center gap-2.5 group flex-shrink-0">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/10 p-1 flex items-center justify-center border border-white/20 group-hover:border-[#FCA311] transition-colors">
            <img
              src={qcmLogoSm}
              alt="QCM Logo"
              width="36"
              height="36"
              className="w-full h-full object-contain"
            />
          </div>
          <div className="flex flex-col text-left leading-none">
            <span className="font-extrabold text-sm sm:text-base text-white tracking-wider group-hover:text-[#FCA311] transition-colors">
              QCM
            </span>
            <span className="text-[9px] font-bold text-[#FCA311] tracking-widest uppercase">
              NIT Bhopal
            </span>
          </div>
        </Link>

        {/* Center Desktop Navigation */}
        <Nav className="hidden md:flex items-center gap-1 lg:gap-2 flex-1 justify-center mx-4" />

        {/* Right Action / Mobile Controls */}
        <div className="flex items-center gap-2.5 flex-shrink-0">
          <button
            type="button"
            onClick={() => navigate("/signup")}
            className="btn-shimmer inline-flex items-center gap-1.5 px-4 sm:px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider text-[#14213D] bg-gradient-to-r from-amber-400 via-[#FCA311] to-amber-500 hover:brightness-110 shadow-md shadow-[#FCA311]/25 hover:shadow-lg hover:shadow-[#FCA311]/40 hover:scale-[1.03] active:scale-[0.98] transition-all duration-200"
          >
            <span>Register</span>
            <span aria-hidden="true">&rarr;</span>
          </button>

          <button
            type="button"
            onClick={() => setShowTabModal(true)}
            aria-label="Open navigation menu"
            className="md:hidden w-8 h-8 rounded-full flex items-center justify-center bg-white/10 text-white hover:text-[#FCA311] transition-colors focus:outline-none"
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
