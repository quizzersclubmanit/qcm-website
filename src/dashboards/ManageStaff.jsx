import React, { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import staffService from "../api/staff.service"
import { isAdminUser } from "../utils/authUtils"
import AdminNav from "./AdminNav"
import toast from "react-hot-toast"
import {
  FiShield,
  FiUserPlus,
  FiSearch,
  FiRefreshCw,
  FiCheck,
  FiUsers,
  FiAward,
  FiCheckCircle,
  FiInfo
} from "react-icons/fi"

const ROLE_DESCRIPTIONS = {
  SUPER_ADMIN: {
    label: "Super Admin",
    bg: "bg-blue-100 text-blue-900 border-blue-300",
    desc: "Complete operational control, Google Sheets sync, role assignments, and deletions.",
  },
  ADMIN: {
    label: "Club Admin",
    bg: "bg-blue-100 text-blue-900 border-blue-300",
    desc: "Full event operations, role management, team editing, and financial pipeline.",
  },
  ORGANIZER: {
    label: "Core Organizer",
    bg: "bg-sky-100 text-sky-800 border-sky-300",
    desc: "Manage college drives, sponsorship leads, edit teams, and export reports.",
  },
  COORDINATOR: {
    label: "Desk Coordinator",
    bg: "bg-indigo-100 text-indigo-800 border-indigo-300",
    desc: "Fast desk search, team check-in, verify attendance at venue desk.",
  },
  MEMBER: {
    label: "Club Member",
    bg: "bg-slate-100 text-slate-700 border-slate-300",
    desc: "View registered teams, colleges list, and outreach status.",
  },
  USER: {
    label: "Participant",
    bg: "bg-gray-100 text-gray-600 border-gray-200",
    desc: "Public user account with standard quiz access.",
  },
}

const ALL_ROLES = ["ADMIN", "ORGANIZER", "COORDINATOR", "MEMBER", "USER"]

const ManageStaff = () => {
  const { data: currentUser } = useSelector((state) => state.user)
  const isSuperOrAdmin = isAdminUser(currentUser)

  const [staff, setStaff] = useState([])
  const [roleCounts, setRoleCounts] = useState({})
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [roleFilter, setRoleFilter] = useState("")
  const [updatingId, setUpdatingId] = useState(null)

  // Assign Role Modal
  const [modalOpen, setModalOpen] = useState(false)
  const [assignForm, setAssignForm] = useState({
    email: "",
    role: "COORDINATOR",
  })
  const [submitting, setSubmitting] = useState(false)

  const loadStaff = async () => {
    setLoading(true)
    try {
      const res = await staffService.listStaff({
        search: search.trim(),
        role: roleFilter,
      })
      setStaff(res.users || [])
      setRoleCounts(res.roleCounts || {})
    } catch (err) {
      toast.error(err.message || "Failed to load club members")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadStaff()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roleFilter])

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    loadStaff()
  }

  const handleRoleChange = async (userId, newRole) => {
    if (!isSuperOrAdmin) {
      toast.error("Only Admins can change member roles")
      return
    }
    setUpdatingId(userId)
    try {
      await staffService.updateRole(userId, newRole)
      toast.success(`Role updated to ${newRole}`)
      setStaff((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
      )
      loadStaff()
    } catch (err) {
      toast.error(err.message || "Failed to update role")
    } finally {
      setUpdatingId(null)
    }
  }

  const handleAssignSubmit = async (e) => {
    e.preventDefault()
    if (!assignForm.email.trim()) {
      toast.error("Please enter user email")
      return
    }
    setSubmitting(true)
    try {
      const res = await staffService.assignRole(assignForm)
      toast.success(res.message || "Role assigned successfully")
      setModalOpen(false)
      setAssignForm({ email: "", role: "COORDINATOR" })
      loadStaff()
    } catch (err) {
      toast.error(err.message || "Failed to assign role. Make sure user has registered.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#F4F8FC] text-slate-800 font-['Poppins',sans-serif]">
      <AdminNav activeTab="members" />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Title & Action Strip */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-blue-950 flex items-center gap-2">
              <FiShield className="text-blue-600" />
              Club Members & Staff Roles
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Grant specific permissions to QCM coordinators, desk volunteers, and organizers for QBIT'26.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={loadStaff}
              disabled={loading}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white hover:bg-blue-50 text-blue-900 border border-blue-200 transition-colors flex items-center gap-1.5 shadow-2xs"
            >
              <FiRefreshCw className={`text-xs ${loading ? "animate-spin" : ""}`} />
              <span>Refresh</span>
            </button>

            {isSuperOrAdmin && (
              <button
                onClick={() => setModalOpen(true)}
                className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer"
              >
                <FiUserPlus className="text-xs" />
                <span>Assign Staff Role</span>
              </button>
            )}
          </div>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3">
          <div className="bg-white p-3 rounded-xl border border-blue-100 shadow-2xs">
            <div className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
              <FiUsers className="text-blue-500 text-xs" />
              Total Staff
            </div>
            <div className="text-lg font-black text-blue-950 mt-1">
              {(roleCounts.ADMIN || 0) +
                (roleCounts.SUPER_ADMIN || 0) +
                (roleCounts.ORGANIZER || 0) +
                (roleCounts.COORDINATOR || 0) +
                (roleCounts.MEMBER || 0)}
            </div>
          </div>

          <div className="bg-white p-3 rounded-xl border border-blue-100 shadow-2xs">
            <div className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
              <FiShield className="text-blue-600 text-xs" />
              Admins
            </div>
            <div className="text-lg font-black text-blue-900 mt-1">
              {(roleCounts.ADMIN || 0) + (roleCounts.SUPER_ADMIN || 0)}
            </div>
          </div>

          <div className="bg-white p-3 rounded-xl border border-blue-100 shadow-2xs">
            <div className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
              <FiAward className="text-sky-600 text-xs" />
              Organizers
            </div>
            <div className="text-lg font-black text-sky-900 mt-1">
              {roleCounts.ORGANIZER || 0}
            </div>
          </div>

          <div className="bg-white p-3 rounded-xl border border-blue-100 shadow-2xs">
            <div className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
              <FiCheckCircle className="text-indigo-600 text-xs" />
              Desk Coordinators
            </div>
            <div className="text-lg font-black text-indigo-900 mt-1">
              {roleCounts.COORDINATOR || 0}
            </div>
          </div>

          <div className="bg-white p-3 rounded-xl border border-blue-100 shadow-2xs col-span-2 sm:col-span-1">
            <div className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
              <FiUsers className="text-slate-600 text-xs" />
              Club Members
            </div>
            <div className="text-lg font-black text-slate-900 mt-1">
              {roleCounts.MEMBER || 0}
            </div>
          </div>
        </div>

        {/* Roles Permission Reference Strip */}
        <div className="bg-blue-50/60 rounded-xl p-3 border border-blue-200/70 text-xs space-y-2">
          <div className="flex items-center gap-1.5 font-bold text-blue-950">
            <FiInfo className="text-blue-600 text-sm" />
            <span>Role Permissions Overview:</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-[11px] text-slate-600">
            <div className="bg-white p-2 rounded-lg border border-blue-100">
              <strong className="text-blue-900">ADMIN:</strong> Full control, Google Sheet sync, delete teams & drives, assign roles.
            </div>
            <div className="bg-white p-2 rounded-lg border border-blue-100">
              <strong className="text-sky-900">ORGANIZER:</strong> Manage promotional drives, sponsorship leads, edit teams, duplicate scanner.
            </div>
            <div className="bg-white p-2 rounded-lg border border-blue-100">
              <strong className="text-indigo-900">COORDINATOR:</strong> Fast venue desk check-in, search/fuzzy search teams, verify college IDs.
            </div>
            <div className="bg-white p-2 rounded-lg border border-blue-100">
              <strong className="text-slate-900">MEMBER:</strong> View registered teams, browse Bhopal promotional colleges and targets.
            </div>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-white p-3 rounded-xl border border-blue-100 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
          <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-80">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
            <input
              type="text"
              placeholder="Search member name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-blue-200 text-xs focus:outline-none focus:border-blue-600"
            />
          </form>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <label className="text-xs text-slate-500 font-medium">Role:</label>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg border border-blue-200 text-xs text-slate-700 bg-white focus:outline-none focus:border-blue-600"
            >
              <option value="">All Roles</option>
              <option value="ADMIN">Admin</option>
              <option value="ORGANIZER">Organizer</option>
              <option value="COORDINATOR">Coordinator</option>
              <option value="MEMBER">Member</option>
              <option value="USER">User (Public)</option>
            </select>
          </div>
        </div>

        {/* Staff Table */}
        <div className="bg-white rounded-xl border border-blue-100 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-blue-50/70 border-b border-blue-100 text-blue-950 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-2.5 px-4">Member Name</th>
                  <th className="py-2.5 px-4">Email</th>
                  <th className="py-2.5 px-4">Phone / City</th>
                  <th className="py-2.5 px-4">Current Role</th>
                  <th className="py-2.5 px-4 text-right">Role Assignment</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-blue-50">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-400">
                      Loading staff members...
                    </td>
                  </tr>
                ) : staff.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-500">
                      No members found matching criteria.
                    </td>
                  </tr>
                ) : (
                  staff.map((user) => {
                    const roleInfo =
                      ROLE_DESCRIPTIONS[user.role] || ROLE_DESCRIPTIONS.USER
                    const isSelf = user.id === currentUser?.id
                    return (
                      <tr key={user.id} className="hover:bg-blue-50/40 transition-colors">
                        <td className="py-2.5 px-4 font-semibold text-blue-950">
                          {user.name || "Anonymous Member"}
                          {isSelf && (
                            <span className="ml-2 text-[10px] text-blue-600 font-normal">
                              (You)
                            </span>
                          )}
                        </td>
                        <td className="py-2.5 px-4 text-slate-600 font-mono text-[11px]">
                          {user.email}
                        </td>
                        <td className="py-2.5 px-4 text-slate-500">
                          {user.phoneNo || "—"} {user.city ? `(${user.city})` : ""}
                        </td>
                        <td className="py-2.5 px-4">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${roleInfo.bg}`}
                          >
                            {roleInfo.label}
                          </span>
                        </td>
                        <td className="py-2.5 px-4 text-right">
                          {isSuperOrAdmin ? (
                            <select
                              value={user.role || "USER"}
                              disabled={updatingId === user.id || isSelf}
                              onChange={(e) => handleRoleChange(user.id, e.target.value)}
                              className="px-2 py-1 rounded border border-blue-200 text-xs bg-white text-slate-700 hover:border-blue-400 focus:outline-none focus:border-blue-600 disabled:opacity-50 cursor-pointer"
                            >
                              {ALL_ROLES.map((r) => (
                                <option key={r} value={r}>
                                  {r}
                                </option>
                              ))}
                            </select>
                          ) : (
                            <span className="text-[11px] text-slate-400">View Only</span>
                          )}
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Assign Role Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-blue-950/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-blue-100 shadow-xl max-w-md w-full p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-blue-50 pb-3">
              <h3 className="font-bold text-blue-950 text-sm flex items-center gap-2">
                <FiUserPlus className="text-blue-600" />
                Assign Role to Club Member
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-base"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAssignSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  User Registered Email
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. volunteer@manit.ac.in"
                  value={assignForm.email}
                  onChange={(e) =>
                    setAssignForm({ ...assignForm, email: e.target.value })
                  }
                  className="w-full px-3 py-1.5 rounded-lg border border-blue-200 text-xs focus:outline-none focus:border-blue-600"
                />
                <p className="text-[10px] text-slate-400 mt-1">
                  User must already have registered an account on the website.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Role to Assign
                </label>
                <select
                  value={assignForm.role}
                  onChange={(e) =>
                    setAssignForm({ ...assignForm, role: e.target.value })
                  }
                  className="w-full px-3 py-1.5 rounded-lg border border-blue-200 text-xs focus:outline-none focus:border-blue-600"
                >
                  <option value="COORDINATOR">COORDINATOR (Venue Desk Check-in)</option>
                  <option value="ORGANIZER">ORGANIZER (Drives & Team Edits)</option>
                  <option value="MEMBER">MEMBER (Club Read Access)</option>
                  <option value="ADMIN">ADMIN (Full Operations Control)</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-blue-50">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-1.5 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white transition-colors flex items-center gap-1.5 shadow-2xs"
                >
                  <FiCheck className="text-xs" />
                  <span>{submitting ? "Assigning..." : "Confirm Role"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default ManageStaff
