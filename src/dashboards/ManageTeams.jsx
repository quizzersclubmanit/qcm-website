import { useEffect, useState, useMemo } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { logout } from "../redux/user.slice"
import authService from "../api/auth.service"
import qbitService, { QBIT_SHEET_URL } from "../api/qbit.service"
import toast from "react-hot-toast"
import qcmLogo from "../assets/qcm-logo.png"
import { floatingMarks, gradientLogo } from "../assets/assets"
import AdminNav from "./AdminNav"
import {
  FiUsers,
  FiSearch,
  FiDownload,
  FiRefreshCw,
  FiExternalLink,
  FiFilter,
  FiCalendar,
  FiChevronDown,
  FiChevronUp,
  FiPhone,
  FiMail,
  FiBookOpen,
  FiCheck,
  FiCopy,
  FiX,
  FiLogOut,
  FiShield,
  FiDatabase,
  FiArrowLeft,
  FiZap,
  FiEdit2,
  FiTrash2,
  FiCheckCircle,
  FiAlertTriangle,
  FiTag
} from "react-icons/fi"

const PAGE_SIZE = 20

const SORT_OPTIONS = [
  { label: "Newest first", sortBy: "createdAt", sortOrder: "desc" },
  { label: "Oldest first", sortBy: "createdAt", sortOrder: "asc" },
  { label: "Team A–Z", sortBy: "teamName", sortOrder: "asc" },
  { label: "College A–Z", sortBy: "college", sortOrder: "asc" }
]

const ManageTeams = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { data: user } = useSelector((state) => state.user)

  const [teams, setTeams] = useState([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState(null)
  const [expandedId, setExpandedId] = useState(null)
  const [copiedKey, setCopiedKey] = useState(null)

  // Filters
  const [search, setSearch] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")
  const [college, setCollege] = useState("")
  const [statusFilter, setStatusFilter] = useState("") // "" | "CONFIRMED" | "CHECKED_IN"
  const [from, setFrom] = useState("")
  const [to, setTo] = useState("")
  const [sortIdx, setSortIdx] = useState(0)

  // Meta & stats
  const [stats, setStats] = useState(null)
  const [syncStatus, setSyncStatus] = useState(null)
  const [syncing, setSyncing] = useState(false)
  const [exporting, setExporting] = useState(false)

  // Modals
  const [editingTeam, setEditingTeam] = useState(null)
  const [editForm, setEditForm] = useState(null)
  const [savingEdit, setSavingEdit] = useState(false)

  const [deletingTeam, setDeletingTeam] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const [duplicatesModalOpen, setDuplicatesModalOpen] = useState(false)
  const [duplicatesLoading, setDuplicatesLoading] = useState(false)
  const [duplicatesResult, setDuplicatesResult] = useState(null)

  // Debounce free-text search (triggers backend fuzzy search)
  useEffect(() => {
    const t = setTimeout(() => {
      setPage(1)
      setDebouncedSearch(search)
    }, 350)
    return () => clearTimeout(t)
  }, [search])

  const buildParams = useMemo(() => {
    return (overrides = {}) => {
      const p = {
        search: debouncedSearch,
        college,
        status: statusFilter,
        from,
        to,
        sortBy: SORT_OPTIONS[sortIdx].sortBy,
        sortOrder: SORT_OPTIONS[sortIdx].sortOrder,
        page,
        limit: PAGE_SIZE,
        ...overrides
      }
      return p
    }
  }, [debouncedSearch, college, statusFilter, from, to, sortIdx, page])

  const loadTeams = async () => {
    setLoading(true)
    setLoadError(null)
    try {
      const res = await qbitService.listTeams(buildParams())
      setTeams(res.teams || [])
      setTotal(res.total ?? 0)
      setTotalPages(res.totalPages ?? 1)
    } catch (error) {
      console.error("Failed to load teams:", error)
      setLoadError(error.message || "Failed to load teams")
      toast.error(error.message || "Could not fetch teams")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadTeams()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch, college, statusFilter, from, to, sortIdx, page])

  const loadMeta = async () => {
    try {
      const [s, sync] = await Promise.all([
        qbitService.getStats().catch(() => null),
        qbitService.getSyncStatus().catch(() => null)
      ])
      if (s) setStats(s)
      if (sync) setSyncStatus(sync)
    } catch (error) {
      console.error("Meta loading error:", error)
    }
  }

  useEffect(() => {
    loadMeta()
  }, [])

  const resetFilters = () => {
    setSearch("")
    setDebouncedSearch("")
    setCollege("")
    setStatusFilter("")
    setFrom("")
    setTo("")
    setSortIdx(0)
    setPage(1)
  }

  const handleExport = async () => {
    setExporting(true)
    try {
      const { filename } = await qbitService.exportTeams(buildParams())
      toast.success(`Downloaded ${filename}`)
    } catch (error) {
      console.error(error)
      toast.error(error.message || "Export failed")
    } finally {
      setExporting(false)
    }
  }

  const handleSync = async () => {
    setSyncing(true)
    try {
      const res = await qbitService.syncSheet()
      toast.success(
        `Sheet synced: ${res.totalTeams ?? 0} teams (${res.memberRows ?? 0} rows)`
      )
      loadMeta()
    } catch (error) {
      console.error(error)
      toast.error(error.message || "Failed to sync sheet")
    } finally {
      setSyncing(false)
    }
  }

  const handleLogout = async () => {
    try {
      await authService.logout()
      dispatch(logout())
      toast.success("Logged out successfully")
      navigate("/")
    } catch (err) {
      console.error("Logout error:", err)
      dispatch(logout())
      navigate("/")
    }
  }

  // Quick Check-in Toggle
  const handleToggleCheckin = async (team, e) => {
    e.stopPropagation()
    const newCheckedIn = !team.checkedIn
    const tid = team._id || team.id

    // Optimistic UI update
    setTeams((prev) =>
      prev.map((t) =>
        (t._id || t.id) === tid
          ? {
              ...t,
              checkedIn: newCheckedIn,
              status: newCheckedIn ? "CHECKED_IN" : "CONFIRMED",
              checkedInAt: newCheckedIn ? new Date().toISOString() : null
            }
          : t
      )
    )

    try {
      const res = await qbitService.checkinTeam(tid, { checkedIn: newCheckedIn })
      toast.success(
        newCheckedIn
          ? `✓ Team "${team.teamName}" checked in`
          : `Check-in reverted for "${team.teamName}"`
      )
      if (res.team) {
        setTeams((prev) =>
          prev.map((t) => ((t._id || t.id) === tid ? { ...t, ...res.team } : t))
        )
      }
      loadMeta()
    } catch (error) {
      // Revert optimistic update
      setTeams((prev) =>
        prev.map((t) =>
          (t._id || t.id) === tid ? { ...t, checkedIn: !newCheckedIn } : t
        )
      )
      toast.error(error.message || "Failed to update check-in status")
    }
  }

  // Open Edit Modal
  const openEditModal = (team, e) => {
    e.stopPropagation()
    setEditingTeam(team)
    setEditForm({
      teamName: team.teamName || "",
      college: team.college || "",
      email: team.email || team.members?.[0]?.email || "",
      notes: team.notes || "",
      status: team.status || "CONFIRMED",
      members: (team.members || []).map((m) => ({
        name: m.name || "",
        phone: m.phone || "",
        course: m.course || "",
        email: m.email || team.email || ""
      }))
    })
  }

  // Save Edit
  const handleSaveEdit = async (e) => {
    e.preventDefault()
    if (!editingTeam) return
    const tid = editingTeam._id || editingTeam.id
    setSavingEdit(true)

    try {
      const res = await qbitService.updateTeam(tid, editForm)
      toast.success(`Updated "${res.team?.teamName || editForm.teamName}"`)
      setTeams((prev) =>
        prev.map((t) => ((t._id || t.id) === tid ? { ...t, ...res.team } : t))
      )
      setEditingTeam(null)
      setEditForm(null)
      loadMeta()
    } catch (error) {
      toast.error(error.message || "Failed to save changes")
    } finally {
      setSavingEdit(false)
    }
  }

  // Confirm Delete
  const handleConfirmDelete = async () => {
    if (!deletingTeam) return
    const tid = deletingTeam._id || deletingTeam.id
    setDeleting(true)

    try {
      await qbitService.deleteTeam(tid)
      toast.success(`Deleted team "${deletingTeam.teamName}"`)
      setTeams((prev) => prev.filter((t) => (t._id || t.id) !== tid))
      setTotal((prev) => Math.max(0, prev - 1))
      setDeletingTeam(null)
      loadMeta()
    } catch (error) {
      toast.error(error.message || "Failed to delete team")
    } finally {
      setDeleting(false)
    }
  }

  // Check Duplicates
  const handleCheckDuplicates = async () => {
    setDuplicatesModalOpen(true)
    setDuplicatesLoading(true)
    try {
      const res = await qbitService.getDuplicates()
      setDuplicatesResult(res)
    } catch (error) {
      toast.error(error.message || "Failed to scan for duplicate participants")
    } finally {
      setDuplicatesLoading(false)
    }
  }

  const copyToClipboard = (text, key) => {
    if (!text) return
    navigator.clipboard.writeText(text)
    setCopiedKey(key)
    toast.success("Copied to clipboard", { duration: 1500 })
    setTimeout(() => {
      setCopiedKey((prev) => (prev === key ? null : prev))
    }, 2000)
  }

  const copyTeamSummary = (team) => {
    const summary = [
      `QBIT'26 Registration Pass`,
      `Pass Code: ${team.registrationCode || "—"}`,
      `Team: ${team.teamName}`,
      `College: ${team.college}`,
      `Team Email: ${team.email || team.members?.[0]?.email || "—"}`,
      `Status: ${team.checkedIn ? "CHECKED IN" : team.status || "CONFIRMED"}`,
      `Registered: ${formatDate(team.createdAt)}`,
      "",
      "Members (4):",
      ...(team.members || []).map(
        (m, i) =>
          `${i + 1}. ${m.name} | Phone: ${m.phone} | Course: ${m.course}`
      )
    ].join("\n")

    copyToClipboard(summary, `team-summary-${team._id || team.teamName}`)
  }

  const formatDate = (d) => {
    if (!d) return "—"
    const dt = new Date(d)
    return isNaN(dt.getTime())
      ? "—"
      : dt.toLocaleString("en-IN", {
          day: "numeric",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit"
        })
  }

  const hasActiveFilters = Boolean(
    debouncedSearch || college || statusFilter || from || to || sortIdx !== 0
  )

  return (
    <div className="min-h-screen text-slate-100 font-['Poppins',sans-serif] relative overflow-hidden">
      {/* Fixed Fullscreen Background Image */}
      <div
        className="fixed inset-0 pointer-events-none -z-20"
        style={{
          backgroundImage: "url('/bg-gradient.png')",
          backgroundPosition: "center center",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
        }}
      />

      {/* Hero background overlay from pages.css with blur */}
      <div
        className="fixed inset-0 pointer-events-none -z-10"
        style={{
          backgroundColor: "rgba(8, 20, 28, 0.72)",
          backdropFilter: "blur(2px)",
          WebkitBackdropFilter: "blur(2px)",
        }}
      />

      {/* Floating question marks from Hero */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden opacity-35 select-none">
        <img
          src={floatingMarks}
          alt=""
          className="absolute -left-10 top-0 h-full w-auto max-w-none object-cover"
        />
      </div>

      {/* Large Q logo watermark from Hero (without the bulb & hand) */}
      <div className="fixed -right-16 top-1/2 -translate-y-1/2 pointer-events-none -z-10 opacity-20 hidden lg:block select-none">
        <img
          src={gradientLogo}
          alt=""
          className="w-[520px] h-[520px] object-contain"
        />
      </div>

      {/* Top Header Navbar */}
      <AdminNav
        activeTab="teams"
        actions={
          <button
            onClick={handleCheckDuplicates}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-white/10 hover:bg-white/15 text-slate-200 border border-white/15 transition-all shadow-xs cursor-pointer"
            title="Detect any duplicate participant emails or phones across teams"
          >
            <FiAlertTriangle className="text-xs text-amber-300" />
            <span>Duplicate Scanner</span>
          </button>
        }
      />

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col gap-4">
        {/* SUPER COMPACT STATS STRIP - Transparent Glass Box */}
        <section className="bg-slate-900/40 backdrop-blur-md border border-white/10 rounded-xl p-3 sm:px-4 shadow-sm">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 divide-y sm:divide-y-0 sm:divide-x divide-white/10 items-center">
            {/* Stat 1: Teams */}
            <div className="flex items-center gap-2.5 px-2 py-1">
              <div className="w-8 h-8 rounded-lg bg-blue-600/20 text-blue-200 flex items-center justify-center flex-shrink-0 border border-blue-400/30">
                <FiUsers className="text-sm" />
              </div>
              <div className="min-w-0">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-lg sm:text-xl font-bold text-white">
                    {stats?.totalTeams ?? total}
                  </span>
                  <span className="text-[11px] font-medium text-white/80 uppercase tracking-wider">
                    Teams
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 font-medium truncate">Registered</p>
              </div>
            </div>

            {/* Stat 2: Participants */}
            <div className="flex items-center gap-2.5 px-2 py-1 sm:pl-4">
              <div className="w-8 h-8 rounded-lg bg-blue-600/20 text-blue-200 flex items-center justify-center flex-shrink-0 border border-blue-400/30">
                <FiUsers className="text-sm" />
              </div>
              <div className="min-w-0">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-lg sm:text-xl font-bold text-white">
                    {stats?.totalParticipants ?? "—"}
                  </span>
                  <span className="text-[11px] font-medium text-white/80 uppercase tracking-wider">
                    Members
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 font-medium truncate">4 per team</p>
              </div>
            </div>

            {/* Stat 3: Checked In Live Counter */}
            <div className="flex items-center gap-2.5 px-2 py-1 sm:pl-4">
              <div className="w-8 h-8 rounded-lg bg-emerald-600/20 text-emerald-200 flex items-center justify-center flex-shrink-0 border border-emerald-400/30">
                <FiCheckCircle className="text-sm" />
              </div>
              <div className="min-w-0">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-lg sm:text-xl font-bold text-emerald-300">
                    {stats?.checkedInTeams ?? 0}
                  </span>
                  <span className="text-[11px] font-medium text-white/80 uppercase tracking-wider">
                    Checked In
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 font-medium truncate">At Venue Desk</p>
              </div>
            </div>

            {/* Stat 4: Google Sheet Status */}
            <div className="flex items-center justify-between gap-2 px-2 py-1 sm:pl-4">
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      syncStatus?.configured ? "bg-emerald-400" : "bg-blue-400"
                    }`}
                  ></span>
                  <span className="text-xs font-semibold text-white truncate">Google Sheet</span>
                </div>
                <p className="text-[11px] text-slate-300 truncate" title={syncStatus?.lastSyncAt}>
                  {syncStatus?.lastSyncAt ? formatDate(syncStatus.lastSyncAt) : "Live Auto-Sync"}
                </p>
              </div>
              <button
                onClick={handleSync}
                disabled={syncing}
                className="px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/15 text-slate-200 text-[11px] font-medium border border-white/15 transition-colors flex items-center gap-1 cursor-pointer flex-shrink-0"
                title="Sync MongoDB to Google Sheet"
              >
                <FiRefreshCw className={`text-[10px] ${syncing ? "animate-spin" : ""}`} />
                <span>{syncing ? "Syncing" : "Sync"}</span>
              </button>
            </div>
          </div>
        </section>

        {/* COMPACT TOOLBAR & FILTERS - Transparent Glass Box */}
        <section className="bg-slate-900/40 backdrop-blur-md border border-white/10 rounded-xl p-3 sm:p-4 shadow-sm flex flex-col gap-3">
          {/* Actions Strip */}
          <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-white/10">
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={handleExport}
                disabled={exporting || total === 0}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium bg-blue-600 hover:bg-blue-500 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm border border-blue-400/30 cursor-pointer"
                title="Download filtered registrations in Excel format (.xlsx)"
              >
                <FiDownload className={`text-xs ${exporting ? "animate-bounce" : ""}`} />
                <span>{exporting ? "Exporting…" : "Export .xlsx"}</span>
              </button>

              {QBIT_SHEET_URL && (
                <a
                  href={QBIT_SHEET_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-white/10 hover:bg-white/15 text-white border border-white/15 transition-all"
                >
                  <FiDatabase className="text-xs text-blue-300" />
                  <span>Open Sheet</span>
                  <FiExternalLink className="text-[10px]" />
                </a>
              )}

              <button
                onClick={() => {
                  loadTeams()
                  loadMeta()
                  toast.success("Refreshed", { duration: 1000 })
                }}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium bg-white/10 hover:bg-white/15 text-white border border-white/15 transition-all cursor-pointer"
                title="Reload registrations"
              >
                <FiRefreshCw className={`text-xs ${loading ? "animate-spin" : ""}`} />
                <span>Refresh</span>
              </button>
            </div>

            <div className="flex items-center gap-2 text-xs text-white/80">
              <span>
                Showing <strong className="text-white font-semibold">{teams.length}</strong> of{" "}
                <strong className="text-white font-semibold">{total}</strong> teams
              </span>
              {hasActiveFilters && (
                <button
                  onClick={resetFilters}
                  className="text-blue-300 hover:text-white font-medium cursor-pointer ml-1 underline"
                >
                  Reset filters
                </button>
              )}
            </div>
          </div>

          {/* Search & Filter Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2.5 items-center">
            {/* Free-text fuzzy search (Elasticsearch style) */}
            <div className="md:col-span-2 relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 text-xs" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Fuzzy search code, team, member, college..."
                className="w-full bg-slate-950/40 backdrop-blur-sm text-white placeholder-slate-400 pl-8 pr-7 py-2 rounded-lg border border-white/15 focus:border-blue-400 focus:bg-slate-900/60 focus:outline-none text-xs transition-all"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-0.5"
                  title="Clear search"
                >
                  <FiX className="text-xs" />
                </button>
              )}
            </div>

            {/* College filter */}
            <div className="relative">
              <FiBookOpen className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 text-xs" />
              <input
                type="text"
                value={college}
                onChange={(e) => {
                  setPage(1)
                  setCollege(e.target.value)
                }}
                placeholder="Filter by college"
                className="w-full bg-slate-950/40 backdrop-blur-sm text-white placeholder-slate-400 pl-8 pr-3 py-2 rounded-lg border border-white/15 focus:border-blue-400 focus:bg-slate-900/60 focus:outline-none text-xs transition-all"
              />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => {
                  setPage(1)
                  setStatusFilter(e.target.value)
                }}
                className="w-full bg-slate-950/40 backdrop-blur-sm text-white px-3 py-2 rounded-lg border border-white/15 focus:border-blue-400 focus:bg-slate-900/60 focus:outline-none text-xs appearance-none cursor-pointer"
              >
                <option value="" className="bg-slate-900 text-white">All Statuses</option>
                <option value="CHECKED_IN" className="bg-slate-900 text-white">Checked In (Venue)</option>
                <option value="CONFIRMED" className="bg-slate-900 text-white">Confirmed</option>
              </select>
              <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 text-xs pointer-events-none" />
            </div>

            {/* Date range from */}
            <div className="relative">
              <FiCalendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 text-xs" />
              <input
                type="date"
                value={from}
                onChange={(e) => {
                  setPage(1)
                  setFrom(e.target.value)
                }}
                className="w-full bg-slate-950/40 backdrop-blur-sm text-white pl-8 pr-2 py-2 rounded-lg border border-white/15 focus:border-blue-400 focus:bg-slate-900/60 focus:outline-none text-xs transition-all"
                title="Registered from"
              />
            </div>

            {/* Sort Dropdown */}
            <div className="relative">
              <select
                value={sortIdx}
                onChange={(e) => {
                  setPage(1)
                  setSortIdx(Number(e.target.value))
                }}
                className="w-full bg-slate-950/40 backdrop-blur-sm text-white px-3 py-2 rounded-lg border border-white/15 focus:border-blue-400 focus:bg-slate-900/60 focus:outline-none text-xs appearance-none cursor-pointer"
              >
                {SORT_OPTIONS.map((opt, i) => (
                  <option key={i} value={i} className="bg-slate-900 text-white">
                    {opt.label}
                  </option>
                ))}
              </select>
              <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 text-xs pointer-events-none" />
            </div>
          </div>

          {/* Fuzzy Search Info Indicator */}
          {debouncedSearch && (
            <div className="flex items-center gap-1.5 text-[11px] text-blue-200 bg-blue-600/20 px-3 py-1.5 rounded-lg border border-blue-400/30">
              <FiZap className="text-blue-300 text-xs flex-shrink-0" />
              <span>
                Fuzzy search active for <strong className="text-white">"{debouncedSearch}"</strong> (typo-tolerant match across code, team name, college, members)
              </span>
            </div>
          )}
        </section>

        {/* Load Error Banner */}
        {loadError && (
          <div className="bg-rose-50 border border-rose-200 text-rose-800 px-4 py-3 rounded-xl flex items-center justify-between gap-3 text-xs">
            <div>
              <p className="font-semibold">Unable to fetch teams from server</p>
              <p className="text-rose-600 mt-0.5">{loadError}</p>
            </div>
            <button
              onClick={loadTeams}
              className="px-3 py-1 rounded bg-rose-600 text-white font-semibold hover:bg-rose-700 transition-colors"
            >
              Retry
            </button>
          </div>
        )}

        {/* TEAMS LIST */}
        <section className="flex flex-col gap-2.5">
          {loading ? (
            <div className="bg-white border border-blue-100 rounded-xl p-10 text-center flex flex-col items-center justify-center gap-2.5 shadow-xs">
              <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-slate-600 font-medium text-xs">Loading registrations...</p>
            </div>
          ) : teams.length === 0 ? (
            /* Clean Transparent Empty State */
            <div className="bg-slate-900/40 backdrop-blur-md border border-white/10 rounded-xl p-10 sm:p-14 text-center flex flex-col items-center justify-center gap-3 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-blue-600/20 border border-blue-400/30 text-blue-200 flex items-center justify-center">
                <FiUsers className="text-xl" />
              </div>
              <div className="max-w-sm">
                <h3 className="text-base font-bold text-white">
                  {hasActiveFilters ? "No teams match your filters" : "No teams registered yet"}
                </h3>
                <p className="text-slate-300 text-xs mt-1 leading-relaxed">
                  {hasActiveFilters
                    ? "Try adjusting your search query or reset filters to see all teams."
                    : "When teams submit the registration form, their details and registration codes will appear here."}
                </p>
              </div>
              {hasActiveFilters ? (
                <button
                  onClick={resetFilters}
                  className="px-4 py-2 rounded-full text-xs font-medium bg-blue-600 hover:bg-blue-500 text-white transition-all cursor-pointer shadow-sm"
                >
                  Clear all filters
                </button>
              ) : (
                <Link
                  to="/signup"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium bg-blue-600 hover:bg-blue-500 text-white transition-all shadow-sm border border-blue-400/30"
                >
                  <span>Open Registration Form</span>
                  <FiExternalLink className="text-xs" />
                </Link>
              )}
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {/* Teams Header row for large screens */}
              <div className="hidden md:grid grid-cols-12 gap-3 px-5 py-1 text-[11px] font-semibold uppercase tracking-wider text-white/70">
                <div className="col-span-4">Pass Code / Team Name</div>
                <div className="col-span-3">College</div>
                <div className="col-span-2">Desk Status</div>
                <div className="col-span-3 text-right">Actions</div>
              </div>

              {/* Team Cards - Transparent Glass Box */}
              {teams.map((team, idx) => {
                const id = team._id || team.id || team.teamName || idx
                const expanded = expandedId === id
                const memberNames = (team.members || []).map((m) => m.name).filter(Boolean).join(", ")
                const isChecked = team.checkedIn || team.status === "CHECKED_IN"

                return (
                  <div
                    key={id}
                    className={`backdrop-blur-md border rounded-xl transition-all duration-150 overflow-hidden shadow-sm ${
                      expanded
                        ? "border-blue-400/70 bg-slate-900/60 ring-1 ring-blue-400/30"
                        : isChecked
                        ? "border-emerald-500/30 bg-emerald-950/20 hover:bg-emerald-950/30"
                        : "border-white/10 bg-slate-900/35 hover:bg-slate-900/50 hover:border-white/20"
                    }`}
                  >
                    {/* Header Row */}
                    <div
                      onClick={() => setExpandedId(expanded ? null : id)}
                      className="p-3 sm:px-4 cursor-pointer flex flex-col md:grid md:grid-cols-12 gap-2.5 md:gap-3 items-start md:items-center select-none"
                    >
                      {/* Code + Team Name */}
                      <div className="md:col-span-4 flex items-center gap-2.5 w-full min-w-0">
                        <span className="w-6 h-6 rounded-md bg-white/10 text-white font-bold text-[11px] flex items-center justify-center flex-shrink-0 border border-white/15">
                          {(page - 1) * PAGE_SIZE + idx + 1}
                        </span>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            {team.registrationCode && (
                              <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-full bg-blue-600/20 text-blue-200 border border-blue-400/30">
                                {team.registrationCode}
                              </span>
                            )}
                            <h4 className="font-semibold text-sm text-white truncate">
                              {team.teamName}
                            </h4>
                          </div>
                          {memberNames && (
                            <p className="text-[11px] text-slate-200 truncate mt-0.5" title={memberNames}>
                              {memberNames}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* College */}
                      <div className="md:col-span-3 w-full text-xs text-white">
                        <div className="flex items-center gap-1.5 truncate">
                          <FiBookOpen className="text-blue-300 flex-shrink-0 text-xs" />
                          <span className="truncate font-medium text-slate-200" title={team.college}>
                            {team.college}
                          </span>
                        </div>
                      </div>

                      {/* Desk Status Badge */}
                      <div className="md:col-span-2 text-xs">
                        {isChecked ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-emerald-500/20 text-emerald-200 border border-emerald-400/30">
                            <FiCheckCircle className="text-xs text-emerald-300" />
                            <span>Checked In</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-white/10 text-white border border-white/15">
                            <span>Confirmed</span>
                          </span>
                        )}
                      </div>

                      {/* Actions: Quick Check In + Expand */}
                      <div className="md:col-span-3 w-full flex items-center justify-between md:justify-end gap-2">
                        {/* Quick Check-in button */}
                        <button
                          type="button"
                          onClick={(e) => handleToggleCheckin(team, e)}
                          className={`px-3 py-1 rounded-md text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5 shadow-xs ${
                            isChecked
                              ? "bg-emerald-900/40 hover:bg-rose-900/40 text-emerald-200 hover:text-rose-200 border border-emerald-500/40 hover:border-rose-500/40"
                              : "bg-blue-600 hover:bg-blue-500 text-white border border-blue-400/30"
                          }`}
                          title={isChecked ? "Click to undo check-in" : "Mark team checked in at venue"}
                        >
                          <FiCheck className="text-xs" />
                          <span>{isChecked ? "Undo Check-In" : "Check In"}</span>
                        </button>

                        <button
                          type="button"
                          className="w-7 h-7 rounded-md bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
                          aria-label={expanded ? "Collapse team" : "Expand team"}
                        >
                          {expanded ? <FiChevronUp className="text-sm" /> : <FiChevronDown className="text-sm" />}
                        </button>
                      </div>
                    </div>

                    {/* Expanded Members & Edit Section - Transparent Glass Box */}
                    {expanded && (
                      <div className="border-t border-white/10 bg-slate-950/45 backdrop-blur-md p-4 sm:p-5 flex flex-col gap-3">
                        <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-white/10">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-[11px] uppercase font-semibold tracking-wider text-white/90">
                              Team Members (4)
                            </span>
                            {team.registrationCode && (
                              <span className="text-xs font-mono font-medium text-blue-200 bg-blue-600/20 px-2 py-0.5 rounded-full border border-blue-400/30">
                                Pass: {team.registrationCode}
                              </span>
                            )}
                            {(team.email || team.members?.[0]?.email) && (
                              <a
                                href={`mailto:${team.email || team.members?.[0]?.email}`}
                                className="inline-flex items-center gap-1.5 text-xs text-blue-300 hover:text-white bg-blue-900/30 px-2.5 py-0.5 rounded-full border border-blue-400/30 transition-colors"
                                title="Team Contact Email"
                              >
                                <FiMail className="text-[10px]" />
                                <span className="font-mono">{team.email || team.members?.[0]?.email}</span>
                              </a>
                            )}
                          </div>

                          <div className="flex items-center gap-1.5">
                            {/* Edit Button */}
                            <button
                              onClick={(e) => openEditModal(team, e)}
                              className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-white/10 hover:bg-white/20 text-white border border-white/15 transition-all cursor-pointer"
                              title="Edit team or member information"
                            >
                              <FiEdit2 className="text-xs" />
                              <span>Edit</span>
                            </button>

                            {/* Delete Button */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                setDeletingTeam(team)
                              }}
                              className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium text-rose-300 hover:text-white hover:bg-rose-900/30 border border-rose-500/40 transition-all cursor-pointer"
                              title="Delete registration"
                            >
                              <FiTrash2 className="text-xs" />
                              <span>Delete</span>
                            </button>

                            {/* Copy Summary Button */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                copyTeamSummary(team)
                              }}
                              className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-white/10 hover:bg-white/20 text-white border border-white/15 transition-all cursor-pointer"
                              title="Copy full team summary"
                            >
                              {copiedKey === `team-summary-${team._id || team.teamName}` ? (
                                <>
                                  <FiCheck className="text-emerald-400 text-xs" />
                                  <span className="text-emerald-300 font-medium">Copied</span>
                                </>
                              ) : (
                                <>
                                  <FiCopy className="text-xs" />
                                  <span>Copy Summary</span>
                                </>
                              )}
                            </button>
                          </div>
                        </div>

                        {/* Internal Admin Notes strip if present */}
                        {(team.notes || team.checkedInAt) && (
                          <div className="bg-slate-900/50 rounded-lg p-3 border border-white/10 flex flex-wrap items-center gap-4 text-xs text-white">
                            {team.checkedInAt && (
                              <div className="flex items-center gap-1">
                                <strong className="text-white font-semibold">Checked in at:</strong>
                                <span className="text-slate-200">{formatDate(team.checkedInAt)}</span>
                                {team.checkedInBy && <span className="text-slate-300">({team.checkedInBy})</span>}
                              </div>
                            )}
                            {team.notes && (
                              <div className="flex items-center gap-1 w-full text-slate-200 italic">
                                <strong className="text-white font-semibold not-italic">Notes:</strong>
                                <span>{team.notes}</span>
                              </div>
                            )}
                          </div>
                        )}

                        {/* 4 Member Cards - Transparent Glass */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                          {(team.members || []).map((member, mIdx) => (
                            <div
                              key={mIdx}
                              className="rounded-lg p-3 flex flex-col justify-between gap-2 border bg-slate-900/40 backdrop-blur-sm border-white/10 text-white shadow-xs"
                            >
                              <div>
                                <div className="flex items-center justify-between gap-1 mb-1.5">
                                  <span className="text-[9px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-600/20 text-blue-200 border border-blue-400/30">
                                    Member {mIdx + 1}
                                  </span>
                                </div>
                                <h5 className="font-semibold text-sm text-white truncate">
                                  {member.name}
                                </h5>
                                <p className="text-[11px] text-slate-200 flex items-center gap-1 mt-0.5 truncate">
                                  <FiBookOpen className="text-blue-300 text-[10px] flex-shrink-0" />
                                  <span className="truncate">{member.course || "—"}</span>
                                </p>
                              </div>

                              <div className="space-y-1 pt-2 border-t border-white/10 text-[11px]">
                                {/* Phone */}
                                <div className="flex items-center justify-between text-slate-200">
                                  <a
                                    href={`tel:${member.phone}`}
                                    className="flex items-center gap-1.5 hover:text-white transition-colors truncate"
                                    title="Call"
                                  >
                                    <FiPhone className="text-blue-300 text-[10px] flex-shrink-0" />
                                    <span>{member.phone}</span>
                                  </a>
                                  <button
                                    onClick={() => copyToClipboard(member.phone, `phone-${id}-${mIdx}`)}
                                    className="text-slate-300 hover:text-white p-0.5"
                                    title="Copy phone"
                                  >
                                    {copiedKey === `phone-${id}-${mIdx}` ? (
                                      <FiCheck className="text-emerald-400" />
                                    ) : (
                                      <FiCopy className="text-[10px]" />
                                    )}
                                  </button>
                                </div>

                                {/* Email */}
                                <div className="flex items-center justify-between text-slate-200">
                                  <a
                                    href={`mailto:${member.email}`}
                                    className="flex items-center gap-1.5 hover:text-white transition-colors truncate max-w-[85%]"
                                    title="Email"
                                  >
                                    <FiMail className="text-blue-300 text-[10px] flex-shrink-0" />
                                    <span className="truncate">{member.email}</span>
                                  </a>
                                  <button
                                    onClick={() => copyToClipboard(member.email, `email-${id}-${mIdx}`)}
                                    className="text-slate-300 hover:text-white p-0.5"
                                    title="Copy email"
                                  >
                                    {copiedKey === `email-${id}-${mIdx}` ? (
                                      <FiCheck className="text-emerald-400" />
                                    ) : (
                                      <FiCopy className="text-[10px]" />
                                    )}
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </section>

        {/* COMPACT PAGINATION - Transparent Glass Box */}
        {teams.length > 0 && (
          <section className="flex items-center justify-between gap-2 bg-slate-900/40 backdrop-blur-md border border-white/10 rounded-xl px-4 py-2.5 shadow-sm text-white">
            <div className="text-xs text-white/80">
              Page <strong className="text-white font-semibold">{page}</strong> of{" "}
              <strong className="text-white font-semibold">{totalPages}</strong> ({total} total)
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => {
                  setPage((p) => Math.max(1, p - 1))
                  window.scrollTo({ top: 0, behavior: "smooth" })
                }}
                disabled={page <= 1}
                className="px-3 py-1 rounded-full text-xs font-medium bg-white/10 hover:bg-white/20 text-white border border-white/15 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
              >
                Previous
              </button>

              <span className="px-2.5 py-0.5 text-xs font-medium text-white bg-white/10 rounded-md border border-white/15">
                {page} / {totalPages}
              </span>

              <button
                onClick={() => {
                  setPage((p) => Math.min(totalPages, p + 1))
                  window.scrollTo({ top: 0, behavior: "smooth" })
                }}
                disabled={page >= totalPages}
                className="px-3 py-1 rounded-full text-xs font-medium bg-white/10 hover:bg-white/20 text-white border border-white/15 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
              >
                Next
              </button>
            </div>
          </section>
        )}
      </main>

      {/* EDIT TEAM MODAL */}
      {editingTeam && editForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-slate-900/95 backdrop-blur-xl rounded-xl max-w-2xl w-full p-6 shadow-2xl border border-white/20 my-8 text-white">
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
              <div>
                <h3 className="text-base font-bold text-white">Edit Team Details</h3>
                <p className="text-xs text-slate-300">
                  {editingTeam.registrationCode ? `Pass Code: ${editingTeam.registrationCode}` : "Update team and members"}
                </p>
              </div>
              <button
                onClick={() => setEditingTeam(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
              >
                <FiX className="text-lg" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-200 mb-1">Team Name</label>
                  <input
                    type="text"
                    required
                    value={editForm.teamName}
                    onChange={(e) => setEditForm({ ...editForm, teamName: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-950/60 border border-white/15 text-white text-xs focus:outline-none focus:border-blue-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-200 mb-1">College</label>
                  <input
                    type="text"
                    required
                    value={editForm.college}
                    onChange={(e) => setEditForm({ ...editForm, college: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-950/60 border border-white/15 text-white text-xs focus:outline-none focus:border-blue-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-200 mb-1">Team Email</label>
                  <input
                    type="email"
                    required
                    value={editForm.email}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-950/60 border border-white/15 text-white text-xs focus:outline-none focus:border-blue-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-200 mb-1">Admin Notes</label>
                <input
                  type="text"
                  placeholder="e.g. Fee verified, special arrangement, late arrival"
                  value={editForm.notes}
                  onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-950/60 border border-white/15 text-white text-xs focus:outline-none focus:border-blue-400 placeholder-slate-400"
                />
              </div>

              {/* Members */}
              <div className="pt-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-white/90 mb-2">
                  Members (4)
                </h4>
                <div className="space-y-3">
                  {editForm.members.map((m, idx) => (
                    <div key={idx} className="p-3 rounded-lg bg-slate-950/50 border border-white/10 space-y-2">
                      <div className="text-[11px] font-semibold text-blue-300">Member {idx + 1}</div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <input
                          type="text"
                          placeholder="Full Name"
                          required
                          value={m.name}
                          onChange={(e) => {
                            const newM = [...editForm.members]
                            newM[idx].name = e.target.value
                            setEditForm({ ...editForm, members: newM })
                          }}
                          className="px-2.5 py-1.5 rounded-md border border-white/15 text-xs bg-slate-900 text-white focus:border-blue-400"
                        />
                        <input
                          type="tel"
                          placeholder="Phone"
                          required
                          value={m.phone}
                          onChange={(e) => {
                            const newM = [...editForm.members]
                            newM[idx].phone = e.target.value
                            setEditForm({ ...editForm, members: newM })
                          }}
                          className="px-2.5 py-1.5 rounded-md border border-white/15 text-xs bg-slate-900 text-white focus:border-blue-400"
                        />
                        <input
                          type="text"
                          placeholder="Course"
                          required
                          value={m.course}
                          onChange={(e) => {
                            const newM = [...editForm.members]
                            newM[idx].course = e.target.value
                            setEditForm({ ...editForm, members: newM })
                          }}
                          className="px-2.5 py-1.5 rounded-md border border-white/15 text-xs bg-slate-900 text-white focus:border-blue-400"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setEditingTeam(null)}
                  className="px-4 py-1.5 rounded-full text-xs font-medium text-slate-300 hover:bg-white/10 border border-white/15"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingEdit}
                  className="px-4 py-1.5 rounded-full text-xs font-medium bg-blue-600 hover:bg-blue-500 text-white shadow-sm border border-blue-400/30"
                >
                  {savingEdit ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deletingTeam && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900/95 backdrop-blur-xl rounded-xl max-w-md w-full p-6 shadow-2xl border border-rose-500/40 text-white">
            <div className="w-12 h-12 rounded-xl bg-rose-600/20 text-rose-300 border border-rose-500/30 flex items-center justify-center mb-3">
              <FiTrash2 className="text-xl" />
            </div>
            <h3 className="text-base font-bold text-white">Delete Registration?</h3>
            <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
              Are you sure you want to permanently delete team <strong className="text-white">"{deletingTeam.teamName}"</strong> from {deletingTeam.college}? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-2 mt-5">
              <button
                type="button"
                onClick={() => setDeletingTeam(null)}
                className="px-4 py-1.5 rounded-full text-xs font-medium text-slate-300 hover:bg-white/10 border border-white/15"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={deleting}
                className="px-4 py-1.5 rounded-full text-xs font-medium bg-rose-600 hover:bg-rose-500 text-white shadow-sm"
              >
                {deleting ? "Deleting..." : "Yes, Delete Team"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DUPLICATE PARTICIPANTS MODAL */}
      {duplicatesModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-slate-900/95 backdrop-blur-xl rounded-xl max-w-xl w-full p-6 shadow-2xl border border-white/20 my-8 text-white">
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
              <div className="flex items-center gap-2">
                <FiAlertTriangle className="text-amber-300 text-lg" />
                <h3 className="text-base font-bold text-white">Duplicate Contact Scanner</h3>
              </div>
              <button
                onClick={() => setDuplicatesModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
              >
                <FiX className="text-lg" />
              </button>
            </div>

            {duplicatesLoading ? (
              <div className="p-8 text-center flex flex-col items-center justify-center gap-2">
                <div className="w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-xs text-slate-300">Scanning all registered participants for duplicate phones & emails...</p>
              </div>
            ) : duplicatesResult?.totalConflicts === 0 ? (
              <div className="p-8 text-center flex flex-col items-center justify-center gap-2 text-emerald-400">
                <FiCheckCircle className="text-3xl text-emerald-400" />
                <p className="font-bold text-sm text-emerald-300">No duplicate participants found!</p>
                <p className="text-xs text-slate-300">All registered member phones and emails across colleges are completely unique.</p>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="bg-amber-950/40 border border-amber-800/40 text-amber-200 p-3 rounded-lg text-xs">
                  Found <strong className="text-white">{duplicatesResult?.totalConflicts}</strong> shared contact(s) across{" "}
                  <strong className="text-white">{duplicatesResult?.affectedTeamsCount}</strong> teams. In quizzing tournaments, a contestant may only represent one team.
                </div>

                <div className="max-h-72 overflow-y-auto space-y-2">
                  {duplicatesResult?.conflicts?.map((c, i) => (
                    <div key={i} className="p-3 rounded-lg bg-slate-950/50 border border-white/10 text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-white">
                          {c.memberName || "Contestant"} ({c.type}: {c.value})
                        </span>
                        <span className="text-[10px] uppercase font-medium px-2 py-0.5 rounded-full bg-amber-600/20 text-amber-200 border border-amber-400/30">
                          Conflict
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-200">
                        Present in: <strong className="text-blue-300">{c.teamA.name}</strong> ({c.teamA.code || "No code"}) and{" "}
                        <strong className="text-blue-300">{c.teamB.name}</strong> ({c.teamB.code || "No code"})
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-end pt-4 border-t border-white/10 mt-4">
              <button
                type="button"
                onClick={() => setDuplicatesModalOpen(false)}
                className="px-4 py-1.5 rounded-full text-xs font-medium bg-blue-600 hover:bg-blue-500 text-white shadow-sm border border-blue-400/30"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ManageTeams
