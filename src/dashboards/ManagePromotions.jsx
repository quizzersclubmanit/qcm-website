import React, { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import drivesService from "../api/drives.service"
import { isAdminUser } from "../utils/authUtils"
import AdminNav from "./AdminNav"
import toast from "react-hot-toast"
import {
  FiTrendingUp,
  FiPlus,
  FiDownload,
  FiSearch,
  FiRefreshCw,
  FiCalendar,
  FiMapPin,
  FiPhone,
  FiMail,
  FiUser,
  FiUsers,
  FiCheckCircle,
  FiClock,
  FiEdit2,
  FiTrash2,
  FiFileText
} from "react-icons/fi"

const BHOPAL_COLLEGES_SUGGESTIONS = [
  "MANIT Bhopal",
  "LNCT Main Campus, Bhopal",
  "LNCT University, Kolar",
  "IISER Bhopal",
  "NLIU Bhopal (National Law)",
  "BSSS College, Bhopal",
  "Oriental College of Technology (OCT)",
  "Sagar Institute of Science & Tech (SISTec)",
  "Sagar Institute (SIRT) Ayodhya Bypass",
  "UIT RGPV Campus, Bhopal",
  "Barkatullah University Institute (BUIT)",
  "TIT Main Campus, Anand Nagar",
  "RKDF University, Gandhi Nagar",
  "Jagran Lakecity University (JLU)",
  "AIIMS Bhopal",
  "National Institute of Fashion Technology (NIFT) Bhopal",
  "Sam Global University",
  "IEHE Bhopal (Institute for Excellence in Higher Education)"
]

const STATUS_CONFIG = {
  PLANNED: {
    label: "Planned",
    bg: "bg-blue-50 text-blue-700 border-blue-200",
    icon: FiClock,
  },
  IN_PROGRESS: {
    label: "In Progress",
    bg: "bg-amber-50 text-amber-800 border-amber-200",
    icon: FiRefreshCw,
  },
  COMPLETED: {
    label: "Completed",
    bg: "bg-emerald-50 text-emerald-800 border-emerald-300",
    icon: FiCheckCircle,
  },
  CANCELLED: {
    label: "Cancelled",
    bg: "bg-slate-100 text-slate-600 border-slate-200",
    icon: FiClock,
  },
}

const ManagePromotions = () => {
  const { data: user } = useSelector((state) => state.user)
  const isAdmin = isAdminUser(user)

  const [drives, setDrives] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [exporting, setExporting] = useState(false)

  // Create / Edit Modal
  const [modalOpen, setModalOpen] = useState(false)
  const [editingDrive, setEditingDrive] = useState(null)
  const [formData, setFormData] = useState({
    college: "",
    campusLocation: "Bhopal",
    driveDate: new Date().toISOString().slice(0, 10),
    status: "PLANNED",
    leadMember: "",
    volunteers: "",
    contactPerson: "",
    contactPhone: "",
    contactEmail: "",
    expectedFootfall: 0,
    classroomPitches: 0,
    postersDistributed: 0,
    teamsRegisteredEstimate: 0,
    notes: "",
  })
  const [saving, setSaving] = useState(false)

  const loadDrives = async () => {
    setLoading(true)
    try {
      const res = await drivesService.listPromoDrives({
        search: search.trim(),
        status: statusFilter,
      })
      setDrives(res.drives || [])
      setStats(res.stats || null)
    } catch (err) {
      toast.error(err.message || "Failed to load promotional drives")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadDrives()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter])

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    loadDrives()
  }

  const handleExport = async () => {
    setExporting(true)
    try {
      await drivesService.exportPromoDrives()
      toast.success("Promotional drives exported to CSV")
    } catch (err) {
      toast.error(err.message || "Export failed")
    } finally {
      setExporting(false)
    }
  }

  const openCreateModal = () => {
    setEditingDrive(null)
    setFormData({
      college: "",
      campusLocation: "Bhopal",
      driveDate: new Date().toISOString().slice(0, 10),
      status: "PLANNED",
      leadMember: user?.name || "QCM Core",
      volunteers: "",
      contactPerson: "",
      contactPhone: "",
      contactEmail: "",
      expectedFootfall: 0,
      classroomPitches: 0,
      postersDistributed: 0,
      teamsRegisteredEstimate: 0,
      notes: "",
    })
    setModalOpen(true)
  }

  const openEditModal = (drive) => {
    setEditingDrive(drive)
    setFormData({
      college: drive.college || "",
      campusLocation: drive.campusLocation || "Bhopal",
      driveDate: drive.driveDate ? drive.driveDate.slice(0, 10) : "",
      status: drive.status || "PLANNED",
      leadMember: drive.leadMember || "",
      volunteers: Array.isArray(drive.volunteers) ? drive.volunteers.join(", ") : "",
      contactPerson: drive.contactPerson || "",
      contactPhone: drive.contactPhone || "",
      contactEmail: drive.contactEmail || "",
      expectedFootfall: drive.expectedFootfall || 0,
      classroomPitches: drive.classroomPitches || 0,
      postersDistributed: drive.postersDistributed || 0,
      teamsRegisteredEstimate: drive.teamsRegisteredEstimate || 0,
      notes: drive.notes || "",
    })
    setModalOpen(true)
  }

  const handleSaveDrive = async (e) => {
    e.preventDefault()
    if (!formData.college.trim()) {
      toast.error("College name is required")
      return
    }

    setSaving(true)
    const payload = {
      ...formData,
      volunteers: formData.volunteers
        ? formData.volunteers.split(",").map((s) => s.trim()).filter(Boolean)
        : [],
    }

    try {
      if (editingDrive) {
        await drivesService.updatePromoDrive(editingDrive._id, payload)
        toast.success(`Updated drive for ${formData.college}`)
      } else {
        await drivesService.createPromoDrive(payload)
        toast.success(`Scheduled promotional drive for ${formData.college}`)
      }
      setModalOpen(false)
      loadDrives()
    } catch (err) {
      toast.error(err.message || "Failed to save promotional drive")
    } finally {
      setSaving(false)
    }
  }

  const handleQuickStatusChange = async (driveId, newStatus) => {
    try {
      await drivesService.updatePromoDrive(driveId, { status: newStatus })
      toast.success(`Status updated to ${newStatus}`)
      setDrives((prev) =>
        prev.map((d) => (d._id === driveId ? { ...d, status: newStatus } : d))
      )
      loadDrives()
    } catch (err) {
      toast.error(err.message || "Failed to update status")
    }
  }

  const handleDeleteDrive = async (driveId, collegeName) => {
    if (!window.confirm(`Are you sure you want to delete the drive record for "${collegeName}"?`)) {
      return
    }
    try {
      await drivesService.deletePromoDrive(driveId)
      toast.success(`Deleted drive for ${collegeName}`)
      setDrives((prev) => prev.filter((d) => d._id !== driveId))
      loadDrives()
    } catch (err) {
      toast.error(err.message || "Failed to delete drive")
    }
  }

  return (
    <div className="min-h-screen bg-[#F4F8FC] text-slate-800 font-['Poppins',sans-serif]">
      <AdminNav activeTab="promotions" />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Top Header & Actions */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-blue-950 flex items-center gap-2">
              <FiTrendingUp className="text-blue-600" />
              Promotional Drives Tracker (Bhopal Colleges)
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Track on-ground college visits, classroom pitches, posters, and campus outreach for QBIT'26.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleExport}
              disabled={exporting}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white hover:bg-blue-50 text-blue-900 border border-blue-200 transition-colors flex items-center gap-1.5 shadow-2xs"
            >
              <FiDownload className="text-xs" />
              <span>{exporting ? "Exporting..." : "Export CSV"}</span>
            </button>

            <button
              onClick={openCreateModal}
              className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer"
            >
              <FiPlus className="text-xs" />
              <span>Schedule New Drive</span>
            </button>
          </div>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="bg-white p-3 rounded-xl border border-blue-100 shadow-2xs">
            <div className="text-[11px] font-semibold text-slate-500">Total Drives</div>
            <div className="text-lg font-black text-blue-950 mt-1">
              {stats?.totalDrives ?? drives.length}
            </div>
          </div>
          <div className="bg-white p-3 rounded-xl border border-blue-100 shadow-2xs">
            <div className="text-[11px] font-semibold text-emerald-700">Completed</div>
            <div className="text-lg font-black text-emerald-700 mt-1">
              {stats?.completedDrives ?? 0}
            </div>
          </div>
          <div className="bg-white p-3 rounded-xl border border-blue-100 shadow-2xs">
            <div className="text-[11px] font-semibold text-blue-700">Planned</div>
            <div className="text-lg font-black text-blue-700 mt-1">
              {stats?.plannedDrives ?? 0}
            </div>
          </div>
          <div className="bg-white p-3 rounded-xl border border-blue-100 shadow-2xs">
            <div className="text-[11px] font-semibold text-slate-500">Classroom Pitches</div>
            <div className="text-lg font-black text-blue-950 mt-1">
              {stats?.totalClassroomPitches ?? 0}
            </div>
          </div>
          <div className="bg-white p-3 rounded-xl border border-blue-100 shadow-2xs">
            <div className="text-[11px] font-semibold text-slate-500">Posters Placed</div>
            <div className="text-lg font-black text-blue-950 mt-1">
              {stats?.totalPosters ?? 0}
            </div>
          </div>
          <div className="bg-white p-3 rounded-xl border border-blue-100 shadow-2xs">
            <div className="text-[11px] font-semibold text-blue-700">Est. Teams Yield</div>
            <div className="text-lg font-black text-blue-900 mt-1">
              {stats?.totalEstimatedTeams ?? 0}
            </div>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white p-3 rounded-xl border border-blue-100 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
          <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-80">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
            <input
              type="text"
              placeholder="Search college, location, POC, lead..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-blue-200 text-xs focus:outline-none focus:border-blue-600"
            />
          </form>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <label className="text-xs text-slate-500 font-medium">Status:</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg border border-blue-200 text-xs text-slate-700 bg-white focus:outline-none focus:border-blue-600"
            >
              <option value="">All Statuses</option>
              <option value="PLANNED">Planned</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>

            <button
              onClick={loadDrives}
              disabled={loading}
              className="px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:text-blue-900 hover:bg-blue-50 border border-blue-200"
              title="Refresh list"
            >
              <FiRefreshCw className={`text-xs ${loading ? "animate-spin" : ""}`} />
            </button>
          </div>
        </div>

        {/* Drives List */}
        <div className="bg-white rounded-xl border border-blue-100 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-blue-50/70 border-b border-blue-100 text-blue-950 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-2.5 px-4">College & Location</th>
                  <th className="py-2.5 px-4">Date & Status</th>
                  <th className="py-2.5 px-4">Lead & Volunteers</th>
                  <th className="py-2.5 px-4">Campus POC</th>
                  <th className="py-2.5 px-4">Impact Metrics</th>
                  <th className="py-2.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-blue-50">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-400">
                      Loading promotional drives...
                    </td>
                  </tr>
                ) : drives.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-500">
                      No promotional drives recorded yet. Click "Schedule New Drive" to add Bhopal campuses!
                    </td>
                  </tr>
                ) : (
                  drives.map((drive) => {
                    const statusInfo =
                      STATUS_CONFIG[drive.status] || STATUS_CONFIG.PLANNED
                    return (
                      <tr key={drive._id} className="hover:bg-blue-50/40 transition-colors">
                        {/* College & Location */}
                        <td className="py-3 px-4">
                          <div className="font-bold text-blue-950 text-xs">
                            {drive.college}
                          </div>
                          <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                            <FiMapPin className="text-[10px] text-blue-500" />
                            <span>{drive.campusLocation || "Bhopal"}</span>
                          </div>
                        </td>

                        {/* Date & Status */}
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-1 text-slate-600 font-medium">
                            <FiCalendar className="text-[10px] text-blue-500" />
                            <span>
                              {drive.driveDate
                                ? new Date(drive.driveDate).toLocaleDateString("en-IN", {
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric",
                                  })
                                : "TBD"}
                            </span>
                          </div>
                          <div className="mt-1">
                            <select
                              value={drive.status || "PLANNED"}
                              onChange={(e) =>
                                handleQuickStatusChange(drive._id, e.target.value)
                              }
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full border cursor-pointer ${statusInfo.bg}`}
                            >
                              <option value="PLANNED">Planned</option>
                              <option value="IN_PROGRESS">In Progress</option>
                              <option value="COMPLETED">Completed</option>
                              <option value="CANCELLED">Cancelled</option>
                            </select>
                          </div>
                        </td>

                        {/* Lead & Volunteers */}
                        <td className="py-3 px-4 text-slate-700">
                          <div className="font-semibold text-blue-900 flex items-center gap-1">
                            <FiUser className="text-[10px]" />
                            <span>{drive.leadMember || "QCM Core"}</span>
                          </div>
                          {drive.volunteers && drive.volunteers.length > 0 && (
                            <div className="text-[10px] text-slate-500 truncate max-w-[150px] mt-0.5" title={drive.volunteers.join(", ")}>
                              Volunteers: {drive.volunteers.join(", ")}
                            </div>
                          )}
                        </td>

                        {/* POC Info */}
                        <td className="py-3 px-4 text-slate-600 text-[11px]">
                          {drive.contactPerson ? (
                            <>
                              <div className="font-medium text-slate-800">{drive.contactPerson}</div>
                              {drive.contactPhone && (
                                <a
                                  href={`tel:${drive.contactPhone}`}
                                  className="text-[10px] text-blue-600 hover:underline flex items-center gap-1 mt-0.5"
                                >
                                  <FiPhone className="text-[9px]" />
                                  <span>{drive.contactPhone}</span>
                                </a>
                              )}
                            </>
                          ) : (
                            <span className="text-slate-400 italic">No POC added</span>
                          )}
                        </td>

                        {/* Impact Metrics */}
                        <td className="py-3 px-4">
                          <div className="flex flex-wrap items-center gap-1.5 text-[10px]">
                            <span className="px-1.5 py-0.5 bg-blue-50 text-blue-800 rounded font-medium border border-blue-100" title="Classroom pitches">
                              📢 {drive.classroomPitches || 0} Pitches
                            </span>
                            <span className="px-1.5 py-0.5 bg-slate-50 text-slate-700 rounded font-medium border border-slate-200" title="Posters put up">
                              🖼️ {drive.postersDistributed || 0} Posters
                            </span>
                            <span className="px-1.5 py-0.5 bg-emerald-50 text-emerald-800 rounded font-bold border border-emerald-200" title="Estimated teams">
                              👥 {drive.teamsRegisteredEstimate || 0} Teams
                            </span>
                          </div>
                          {drive.notes && (
                            <div className="text-[10px] text-slate-400 italic truncate max-w-[180px] mt-1" title={drive.notes}>
                              "{drive.notes}"
                            </div>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => openEditModal(drive)}
                              className="p-1.5 rounded-lg text-slate-500 hover:text-blue-700 hover:bg-blue-50 transition-colors"
                              title="Edit Drive Details"
                            >
                              <FiEdit2 className="text-xs" />
                            </button>
                            {isAdmin && (
                              <button
                                onClick={() =>
                                  handleDeleteDrive(drive._id, drive.college)
                                }
                                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                                title="Delete Drive Record"
                              >
                                <FiTrash2 className="text-xs" />
                              </button>
                            )}
                          </div>
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

      {/* Create / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-blue-950/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-blue-100 shadow-xl max-w-lg w-full p-5 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-blue-50 pb-3">
              <h3 className="font-bold text-blue-950 text-sm flex items-center gap-2">
                <FiTrendingUp className="text-blue-600" />
                <span>{editingDrive ? "Edit Promotional Drive" : "Schedule College Promotional Drive"}</span>
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-base"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveDrive} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  College / Institute Name *
                </label>
                <input
                  type="text"
                  required
                  list="bhopalCollegesList"
                  placeholder="e.g. LNCT Main Campus, Bhopal"
                  value={formData.college}
                  onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-lg border border-blue-200 text-xs focus:outline-none focus:border-blue-600"
                />
                <datalist id="bhopalCollegesList">
                  {BHOPAL_COLLEGES_SUGGESTIONS.map((c) => (
                    <option key={c} value={c} />
                  ))}
                </datalist>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Campus Location / Area
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Raisen Road / Neelbad / MP Nagar"
                    value={formData.campusLocation}
                    onChange={(e) => setFormData({ ...formData, campusLocation: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg border border-blue-200 text-xs focus:outline-none focus:border-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Drive Date
                  </label>
                  <input
                    type="date"
                    value={formData.driveDate}
                    onChange={(e) => setFormData({ ...formData, driveDate: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg border border-blue-200 text-xs focus:outline-none focus:border-blue-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Drive Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg border border-blue-200 text-xs focus:outline-none focus:border-blue-600"
                  >
                    <option value="PLANNED">Planned</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="COMPLETED">Completed</option>
                    <option value="CANCELLED">Cancelled</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Lead Organizer (Club Member)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Rahul Sharma"
                    value={formData.leadMember}
                    onChange={(e) => setFormData({ ...formData, leadMember: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg border border-blue-200 text-xs focus:outline-none focus:border-blue-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Accompanying Volunteers (comma separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Priya, Aman, Saurabh"
                  value={formData.volunteers}
                  onChange={(e) => setFormData({ ...formData, volunteers: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-lg border border-blue-200 text-xs focus:outline-none focus:border-blue-600"
                />
              </div>

              {/* Campus POC */}
              <div className="pt-2 border-t border-blue-50">
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Campus Point of Contact (POC)
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <input
                      type="text"
                      placeholder="POC Name (Prof / Student Head)"
                      value={formData.contactPerson}
                      onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                      className="w-full px-3 py-1.5 rounded-lg border border-blue-200 text-xs focus:outline-none focus:border-blue-600"
                    />
                  </div>
                  <div>
                    <input
                      type="tel"
                      placeholder="POC Contact Phone"
                      value={formData.contactPhone}
                      onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                      className="w-full px-3 py-1.5 rounded-lg border border-blue-200 text-xs focus:outline-none focus:border-blue-600"
                    />
                  </div>
                </div>
              </div>

              {/* Outreach Metrics */}
              <div className="pt-2 border-t border-blue-50">
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Outreach Statistics
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <div>
                    <label className="text-[10px] text-slate-500">Pitches</label>
                    <input
                      type="number"
                      min="0"
                      value={formData.classroomPitches}
                      onChange={(e) => setFormData({ ...formData, classroomPitches: e.target.value })}
                      className="w-full px-2 py-1 rounded border border-blue-200 text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-500">Posters</label>
                    <input
                      type="number"
                      min="0"
                      value={formData.postersDistributed}
                      onChange={(e) => setFormData({ ...formData, postersDistributed: e.target.value })}
                      className="w-full px-2 py-1 rounded border border-blue-200 text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-500">Footfall</label>
                    <input
                      type="number"
                      min="0"
                      value={formData.expectedFootfall}
                      onChange={(e) => setFormData({ ...formData, expectedFootfall: e.target.value })}
                      className="w-full px-2 py-1 rounded border border-blue-200 text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-500">Est. Teams</label>
                    <input
                      type="number"
                      min="0"
                      value={formData.teamsRegisteredEstimate}
                      onChange={(e) => setFormData({ ...formData, teamsRegisteredEstimate: e.target.value })}
                      className="w-full px-2 py-1 rounded border border-blue-200 text-xs"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Key Feedback & Notes
                </label>
                <textarea
                  rows="2"
                  placeholder="e.g. Great reception in CS dept, exams starting next week, follow up on WhatsApp group"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-lg border border-blue-200 text-xs focus:outline-none focus:border-blue-600"
                />
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
                  disabled={saving}
                  className="px-4 py-1.5 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white transition-colors shadow-2xs"
                >
                  {saving ? "Saving..." : editingDrive ? "Update Drive" : "Schedule Drive"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default ManagePromotions
