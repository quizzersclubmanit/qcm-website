import { useEffect } from "react"
import { createPortal } from "react-dom"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import {
  FaHome,
  FaInfoCircle,
  FaQuestionCircle,
  FaCalendarAlt,
  FaUsers,
  FaHandshake,
  FaEnvelope,
  FaTimes,
  FaSignOutAlt,
  FaDownload,
  FaUserPlus
} from "react-icons/fa"
import authService from "../api/auth.service"
import qbitService from "../api/qbit.service"
import { logout as logoutAction } from "../redux/user.slice"
import toast from "react-hot-toast"
import Logo from "./Logo"
import Button from "./Button"
import { isStaffUser } from "../utils/authUtils"

const TABS = [
  { name: "Home", to: "#hero", Icon: FaHome },
  { name: "About", to: "#about", Icon: FaInfoCircle },
  { name: "Events", to: "#events", Icon: FaCalendarAlt },
  { name: "Team", to: "team", Icon: FaUsers },
  { name: "FAQs", to: "faqs", Icon: FaQuestionCircle },
  { name: "Sponsors", to: "#sponsors", Icon: FaHandshake },
  { name: "Contact Us", to: "#contacts", Icon: FaEnvelope }
]

const rowClass = (active) =>
  `flex items-center gap-4 w-full px-4 py-3 rounded-xl text-left transition-colors border ${
    active
      ? "bg-[#fe9c02]/20 backdrop-blur-md border-[#fe9c02]/40 text-[#fe9c02] font-semibold shadow-sm"
      : "border-transparent text-white/85 hover:bg-white/10 hover:text-white"
  }`

// eslint-disable-next-line react/prop-types
const MobileDrawer = ({ open = false, onClose = () => {} }) => {
  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { data, loggedIn } = useSelector((state) => state.user)
  const isAdmin = isStaffUser(data)

  // Lock body scroll + Escape to close while open
  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"
    const onKey = (e) => {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener("keydown", onKey)
    }
  }, [open, onClose])

  const isActive = (to) => {
    if (to.startsWith("#")) {
      return location.pathname === "/" && (location.hash === to || (!location.hash && to === "#hero"))
    }
    return location.pathname.includes(to)
  }

  const go = (fn) => () => {
    onClose()
    setTimeout(fn, 60)
  }

  const handleLogout = async () => {
    const ok = window.confirm("Are you sure you want to logout?")
    if (!ok) return
    onClose()
    const toastId = toast.loading("Logging out...")
    try {
      await authService.logout()
      dispatch(logoutAction())
      toast.success("Successfully logged out", { id: toastId })
    } catch (error) {
      console.error("Logout error:", error)
      dispatch(logoutAction())
      toast.error("Logged out locally, but server logout failed", { id: toastId })
    } finally {
      setTimeout(() => {
        window.location.href = "/"
      }, 800)
    }
  }

  const handleDownloadTeams = () => {
    onClose()
    qbitService.exportTeams({}).catch((error) => {
      console.error(error)
      toast.error(error.message)
    })
  }

  return createPortal(
    <div className="md:hidden">
      {/* Scrim */}
      <div
        aria-hidden="true"
        onClick={onClose}
        className={`fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />
      {/* Panel */}
      <aside
        className={`fixed right-0 top-0 bottom-0 z-[70] w-[78vw] max-w-[320px] flex flex-col shadow-2xl border-l border-white/15 text-white transition-transform duration-300 ease-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
        style={{
          background: "linear-gradient(180deg, #07131b 0%, #0a1c27 100%)"
        }}
        aria-hidden={!open}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <Logo className="w-[9vw] max-w-[38px]" />
            <div className="leading-tight">
              <p className="poppins-bold text-white">Quizzers&apos; Club</p>
              <p className="text-xs text-[#fe9c02] font-semibold uppercase tracking-wider">NIT Bhopal</p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close menu"
            className="w-9 h-9 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20 transition-colors"
          >
            <FaTimes />
          </button>
        </div>

        {/* Links */}
        <nav className="flex-1 overflow-y-auto px-3 py-3 flex flex-col gap-1">
          <p className="px-4 pt-1 pb-2 text-[11px] font-bold tracking-widest text-[#fe9c02] uppercase">
            Navigation
          </p>
          {TABS.map(({ name: tabName, to, Icon }) =>
            to.startsWith("#") ? (
              <a
                key={tabName}
                href={`/${to}`}
                onClick={onClose}
                className={rowClass(isActive(to))}
              >
                <Icon className="text-lg shrink-0" />
                {tabName}
              </a>
            ) : (
              <Link
                key={tabName}
                to={`/${to}`}
                onClick={onClose}
                className={rowClass(isActive(to))}
              >
                <Icon className="text-lg shrink-0" />
                {tabName}
              </Link>
            )
          )}

          {loggedIn && isAdmin && (
            <>
              <p className="px-4 pt-4 pb-2 text-[11px] font-bold tracking-widest text-slate-400 uppercase">
                Admin
              </p>
              <Link
                to="/admin/manage-teams"
                onClick={onClose}
                className={rowClass(isActive("admin/manage-teams"))}
              >
                Manage Teams
              </Link>
              <button onClick={handleDownloadTeams} className={rowClass(false)}>
                <FaDownload className="text-lg shrink-0" />
                Download Teams (.xlsx)
              </button>
            </>
          )}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-white/10">
          {loggedIn ? (
            <button
              onClick={handleLogout}
              className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl font-bold bg-red-500/15 text-red-300 hover:bg-red-500/25 transition-colors"
            >
              <FaSignOutAlt /> Logout
            </button>
          ) : (
            <div className="flex gap-2">
              <Button
                label="Register for Q-BIT"
                onClick={go(() => navigate("/signup"))}
                className="w-full py-3 rounded-full text-xs font-bold uppercase tracking-wider bg-[#fe9c02] text-[#060e14] hover:bg-amber-400 flex items-center justify-center gap-2 shadow-md shadow-[#fe9c02]/25"
              >
                <FaUserPlus /> Register for Q-BIT
              </Button>
            </div>
          )}
        </div>
      </aside>
    </div>,
    document.querySelector("#modal")
  )
}

export default MobileDrawer
