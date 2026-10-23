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
  `flex items-center gap-3.5 w-full px-4 py-3 rounded-2xl text-[13px] font-semibold transition-all duration-200 border ${
    active
      ? "bg-[#fe9c02]/20 backdrop-blur-md border-[#fe9c02]/40 text-[#fe9c02] shadow-[0_0_15px_rgba(254,156,2,0.15)]"
      : "border-transparent text-slate-300 hover:bg-white/10 hover:text-white"
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
      {/* Dark Scrim */}
      <div
        aria-hidden="true"
        onClick={onClose}
        className={`fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm transition-opacity duration-300 ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      {/* Drawer Panel */}
      <aside
        className={`fixed right-0 top-0 bottom-0 z-[70] w-[82vw] max-w-[320px] flex flex-col shadow-[0_0_50px_rgba(0,0,0,0.85)] border-l border-white/15 text-white transition-transform duration-300 ease-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
        style={{
          background: "linear-gradient(180deg, #07131b 0%, #050b10 100%)"
        }}
        aria-hidden={!open}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <Logo className="w-9 h-9" />
            <div className="leading-tight">
              <p className="poppins-bold text-white text-sm">Quizzers&apos; Club</p>
              <p className="text-[10px] text-[#fe9c02] font-bold tracking-widest uppercase">NIT Bhopal</p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close menu"
            className="w-8 h-8 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors border border-white/10"
          >
            <FaTimes className="text-xs" />
          </button>
        </div>

        {/* Links */}
        <nav className="flex-1 overflow-y-auto px-3.5 py-4 flex flex-col gap-1.5">
          <p className="px-3 pt-1 pb-2 text-[10px] font-bold tracking-[0.2em] text-[#fe9c02] uppercase">
            Menu
          </p>
          {TABS.map(({ name: tabName, to, Icon }) =>
            to.startsWith("#") ? (
              <a
                key={tabName}
                href={`/${to}`}
                onClick={onClose}
                className={rowClass(isActive(to))}
              >
                <Icon className="text-base shrink-0" />
                <span>{tabName}</span>
              </a>
            ) : (
              <Link
                key={tabName}
                to={`/${to}`}
                onClick={onClose}
                className={rowClass(isActive(to))}
              >
                <Icon className="text-base shrink-0" />
                <span>{tabName}</span>
              </Link>
            )
          )}

          {loggedIn && isAdmin && (
            <>
              <p className="px-3 pt-4 pb-2 text-[10px] font-bold tracking-[0.2em] text-slate-400 uppercase">
                Admin Area
              </p>
              <Link
                to="/admin/manage-teams"
                onClick={onClose}
                className={rowClass(isActive("admin/manage-teams"))}
              >
                Manage Teams
              </Link>
              <button onClick={handleDownloadTeams} className={rowClass(false)}>
                <FaDownload className="text-base shrink-0" />
                <span>Download Teams (.xlsx)</span>
              </button>
            </>
          )}
        </nav>

        {/* Footer CTA */}
        <div className="p-4 border-t border-white/10 bg-black/25">
          {loggedIn ? (
            <button
              onClick={handleLogout}
              className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-full text-xs font-bold uppercase tracking-wider bg-red-500/15 text-red-300 hover:bg-red-500/25 transition-colors border border-red-500/20"
            >
              <FaSignOutAlt />
              <span>Logout</span>
            </button>
          ) : (
            <div className="flex flex-col gap-2.5">
              <button
                type="button"
                onClick={go(() => navigate("/signup"))}
                className="btn-shimmer w-full py-3.5 px-4 rounded-full text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-amber-400 via-[#fe9c02] to-amber-500 hover:from-amber-300 hover:to-amber-400 text-[#060e14] flex items-center justify-center gap-2 shadow-lg shadow-[#fe9c02]/25 active:scale-[0.98] transition-all"
              >
                <FaUserPlus className="text-sm" />
                <span>Register for Q-BIT &apos;26</span>
              </button>

              <button
                type="button"
                onClick={go(() => navigate("/signin"))}
                className="text-xs text-center text-slate-400 hover:text-white transition-colors py-1"
              >
                Already have an account?{" "}
                <span className="text-[#fe9c02] font-semibold underline underline-offset-2">
                  Sign In
                </span>
              </button>
            </div>
          )}
        </div>
      </aside>
    </div>,
    document.querySelector("#modal")
  )
}

export default MobileDrawer
