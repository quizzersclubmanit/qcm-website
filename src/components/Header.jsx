import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { RxHamburgerMenu } from "react-icons/rx"
import Logo from "./Logo"
import Nav from "./Nav"
import MobileDrawer from "./MobileDrawer"

const Header = () => {
  const [showTabModal, setShowTabModal] = useState(false)
  const navigate = useNavigate()

  return (
    <header className="fixed top-0 left-0 right-0 w-full z-50 px-3 sm:px-6 py-3 flex justify-center pointer-events-none">
      <div className="pointer-events-auto flex items-center justify-between w-full max-w-6xl mx-auto px-4 sm:px-6 py-2 rounded-full bg-[#14213D]/90 backdrop-blur-md border border-white/10 shadow-lg shadow-black/25">
        <Logo className="w-8 h-8 sm:w-9 sm:h-9 object-contain" />

        <Nav className="hidden md:flex items-center gap-1 lg:gap-2 flex-1 justify-between ml-6" />

        {/* Mobile Controls */}
        <div className="flex md:hidden items-center gap-2.5">
          <button
            type="button"
            onClick={() => navigate("/signup")}
            className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-[#FCA311] text-[#14213D] hover:bg-amber-400 transition-colors shadow-sm"
          >
            Register
          </button>
          <button
            type="button"
            onClick={() => setShowTabModal(true)}
            aria-label="Open navigation menu"
            className="p-1.5 text-white hover:text-[#FCA311] transition-colors focus:outline-none"
          >
            <RxHamburgerMenu className="text-2xl" />
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
