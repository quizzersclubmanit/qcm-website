import { useEffect } from "react"
import { createPortal } from "react-dom"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import {
  FaInfoCircle,
  FaCalendarAlt,
  FaUsers,
  FaHandshake,
  FaEnvelope,
  FaTimes,
  FaSignOutAlt,
  FaDownload,
  FaSignInAlt,
  FaUserPlus
} from "react-icons/fa"
import authService from "../api/auth.service"
import qbitService from "../api/qbit.service"
import { logout as logoutAction } from "../redux/user.slice"
import toast from "react-hot-toast"
import Logo from "./Logo"
import Button from "./Button"
import { isStaffUser } from "../utils/authUtils"

// Mobile-only left slide-in navigation drawer (Material modal-drawer pattern:
// left edge, scrim, icon + label rows, account header, section labels).
// Desktop navigation is untouched — this renders only below the md breakpoint.

const TABS = [
  { name: "About", to: "#about", Icon: FaInfoCircle },
  { name: "Events", to: "#events", Icon: FaCalendarAlt },
  { name: "Team", to: "team", Icon: FaUsers },
  { name: "Sponsors", to: "#sponsors", Icon: FaHandshake },
  { name: "Contact Us", to: "#contacts", Icon: FaEnvelope }
]

const rowClass = (active) =>
  `flex items-center gap-4 w-full px-4 py-3 rounded-xl text-left transition-colors border ${
    active
      ? "bg-white/15 backdrop-blur-md border-white/25 text-white font-semibold shadow-[inset_0_1px_0_rgba(255,255,255,0.15)]"
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
      return location.pathname === "/" && location.hash === to
    }
    return location.pathname.includes(to)
  }

  const go = (fn) => () => {
    onClose()
    // Let the drawer start closing before navigating
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

  // Portaled to document.body (same #modal root as Modal): the header is a
  // fixed z-10 stacking context, so anything rendered inside it — even z-50 —
  // paints below later page content like the footer. The portal escapes that.
  // Hidden entirely on md+ screens; the desktop nav is untouched.
  return createPortal(
    <div className="md:hidden">
      {/* Scrim */}
      <div
        aria-hidden="true"
        onClick={onClose}
        className={`fixed inset-0 z-[60] bg-black/50 backdrop-blur-[2px] transition-opacity duration-300 ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />
      {/* Panel */}
      <aside
        className={`fixed right-0 top-0 bottom-0 z-[70] w-[78vw] max-w-[320px] flex flex-col shadow-2xl border-l border-white/10 text-white transition-transform duration-300 ease-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
        style={{
          background:
              "linear-gradient(rgba(10, 30, 40, 0.55), rgba(10, 30, 40, 0.65)), url('/bg-gradient.webp') no-repeat center center/cover"
        }}
        aria-hidden={!open}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <Logo className="w-[9vw] max-w-[38px]" />
            <div className="leading-tight">
              <p className="poppins-bold text-white">Quizzers&apos; Club</p>
              <p className="text-xs text-white/60">NIT Bhopal</p>
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
          <p className="px-4 pt-1 pb-2 text-xs font-bold tracking-widest text-white/40">
            MENU
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
              <p className="px-4 pt-4 pb-2 text-xs font-bold tracking-widest text-white/40">
                ADMIN
              </p>
              <Link
                to="/admin/teams"
                onClick={onClose}
                className={rowClass(location.pathname.includes("/admin/teams"))}
              >
                <FaUsers className="text-lg shrink-0" />
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
                label="Login"
                onClick={go(() => navigate("/signin"))}
                className="flex-1 py-2.5 rounded-xl text-sm font-bold bg-white text-[#163D4D] flex items-center justify-center gap-2"
              >
                <FaSignInAlt /> Login
              </Button>
              <Button
                label="Sign Up"
                onClick={go(() => navigate("/signup"))}
                className="flex-1 py-2.5 rounded-xl text-sm font-bold border-2 border-white/40 text-white flex items-center justify-center gap-2"
              >
                <FaUserPlus /> Sign Up
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
