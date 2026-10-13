import React from "react"
import { Link, useNavigate } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { logout } from "../redux/user.slice"
import authService from "../api/auth.service"
import { isAdminUser } from "../utils/authUtils"
import qcmLogo from "../assets/qcm-logo-sm.png"
import {
  FiUsers,
  FiFileText,
  FiFolder,
  FiArrowLeft,
  FiLogOut,
  FiExternalLink
} from "react-icons/fi"
import { SiGooglesheets, SiGoogledrive } from "react-icons/si"

const AdminNav = ({ activeTab = "teams", actions = null }) => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { data: user } = useSelector((state) => state.user)
  const isAdmin = isAdminUser(user)

  const handleLogout = async () => {
    try {
      await authService.logout()
      dispatch(logout())
      navigate("/signin")
    } catch {
      dispatch(logout())
      navigate("/signin")
    }
  }

  // Exactly 3 clean tabs: Teams & Check-in, Sheet Manager, Drive Links
  const tabs = [
    {
      id: "teams",
      label: "Teams & Check-In",
      path: "/admin/teams",
      icon: FiUsers,
    },
    {
      id: "sheets",
      label: "Sheet Manager",
      path: "/admin/sheets",
      icon: SiGooglesheets,
    },
    {
      id: "drives",
      label: "Drive Links",
      path: "/admin/drives",
      icon: SiGoogledrive,
    },
  ]

  return (
    <header className="sticky top-0 z-30 bg-[#0a1a23]/80 backdrop-blur-md border-b border-white/10 shadow-md text-white font-['Poppins',sans-serif]">
      {/* Top tier: Brand, User info, global actions */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-white/5">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Link to="/" className="flex items-center gap-2.5 group">
            <img src={qcmLogo} alt="QCM Logo" width="32" height="32" className="w-8 h-8 object-contain" />
            <div className="flex items-center gap-2">
              <span className="text-white font-extrabold text-base tracking-tight">
                QBIT'26
              </span>
              <span className="bg-blue-900/40 text-blue-200 text-[10px] font-semibold uppercase px-2.5 py-0.5 rounded-full tracking-wider border border-blue-700/40">
                Manage
              </span>
            </div>
          </Link>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
          {actions}

          <Link
            to="/signup"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium bg-blue-600 hover:bg-blue-700 text-white transition-all shadow-sm border border-blue-500/30"
            title="Open public registration page"
          >
            <span>Registration Form</span>
            <FiExternalLink className="text-xs" />
          </Link>

          <Link
            to="/"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-white/10 hover:bg-white/15 text-slate-200 border border-white/15 transition-all"
          >
            <FiArrowLeft className="text-xs" />
            <span className="hidden sm:inline">Website</span>
          </Link>

          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium text-slate-300 hover:text-white hover:bg-white/10 border border-slate-700 transition-all cursor-pointer"
            title="Log out"
          >
            <FiLogOut className="text-xs" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>

      {/* Bottom tier: Exactly 3 clean navigation tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex space-x-2 py-2 no-scrollbar">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <Link
                key={tab.id}
                to={tab.path}
                className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-slate-300 hover:text-white hover:bg-white/5"
                }`}
              >
                <Icon className={`text-sm ${isActive ? "text-white" : "text-slate-400"}`} />
                <span>{tab.label}</span>
              </Link>
            )
          })}
        </nav>
      </div>
    </header>
  )
}

export default AdminNav
