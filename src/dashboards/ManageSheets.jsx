import React, { useEffect, useState } from "react"
import AdminNav from "./AdminNav"
import linksService from "../api/links.service"
import { QBIT_SHEET_URL } from "../api/qbit.service"
import toast from "react-hot-toast"
import {
  FiSearch,
  FiPlus,
  FiExternalLink,
  FiCopy,
  FiEdit2,
  FiTrash2,
  FiCheck,
  FiRefreshCw
} from "react-icons/fi"
import { SiGooglesheets } from "react-icons/si"
import { floatingMarks, gradientLogo } from "../assets/assets"

const ManageSheets = () => {
  const [sheets, setSheets] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [copiedId, setCopiedId] = useState(null)

  // Add / Edit Modal
  const [modalOpen, setModalOpen] = useState(false)
  const [editingSheet, setEditingSheet] = useState(null)
  const [formData, setFormData] = useState({
    title: "",
    url: "",
    description: "",
  })
  const [submitting, setSubmitting] = useState(false)

  const loadSheets = async () => {
    setLoading(true)
    try {
      const res = await linksService.listLinks({
        type: "SHEET",
        search: search.trim(),
      })

      // If database has 0 sheets and QBIT_SHEET_URL is configured, auto-seed the master sheet
      if ((!res.links || res.links.length === 0) && !search && QBIT_SHEET_URL) {
        try {
          await linksService.createLink({
            title: "QBIT'26 Master Registrations Sheet",
            url: QBIT_SHEET_URL,
            type: "SHEET",
            description: "Live synced spreadsheet of registered colleges and teams",
          })
          const refreshed = await linksService.listLinks({ type: "SHEET" })
          setSheets(refreshed.links || [])
          return
        } catch {
          // ignore auto-seed error
        }
      }

      setSheets(res.links || [])
    } catch (err) {
      toast.error(err.message || "Failed to load sheets")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadSheets()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    loadSheets()
  }

  const openAddModal = () => {
    setEditingSheet(null)
    setFormData({
      title: "",
      url: "",
      description: "",
    })
    setModalOpen(true)
  }

  const openEditModal = (sheet, e) => {
    e.stopPropagation()
    setEditingSheet(sheet)
    setFormData({
      title: sheet.title || "",
      url: sheet.url || "",
      description: sheet.description || "",
    })
    setModalOpen(true)
  }

  const handleSave = async (e) => {
    e.preventDefault()
    if (!formData.title.trim() || !formData.url.trim()) {
      toast.error("Title and URL are required")
      return
    }

    setSubmitting(true)
    try {
      if (editingSheet) {
        await linksService.updateLink(editingSheet._id, formData)
        toast.success(`Updated "${formData.title}"`)
      } else {
        await linksService.createLink({ ...formData, type: "SHEET" })
        toast.success(`Added sheet "${formData.title}"`)
      }
      setModalOpen(false)
      loadSheets()
    } catch (err) {
      toast.error(err.message || "Failed to save sheet")
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (sheet, e) => {
    e.stopPropagation()
    if (!window.confirm(`Delete sheet "${sheet.title}" from list?`)) return

    try {
      await linksService.deleteLink(sheet._id)
      toast.success(`Deleted "${sheet.title}"`)
      setSheets((prev) => prev.filter((s) => s._id !== sheet._id))
    } catch (err) {
      toast.error(err.message || "Failed to delete sheet")
    }
  }

  const handleCopyLink = (sheet, e) => {
    e.stopPropagation()
    navigator.clipboard.writeText(sheet.url)
    setCopiedId(sheet._id)
    toast.success("Sheet URL copied to clipboard")
    setTimeout(() => setCopiedId(null), 2000)
  }

  const handleOpenSheet = (url) => {
    window.open(url, "_blank", "noopener,noreferrer")
  }

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

      <AdminNav activeTab="sheets" />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-5">
        {/* Header Title & Actions */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2.5">
              <SiGooglesheets className="text-emerald-400 text-2xl" />
              <span>Google Sheet Manager</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-200 mt-1">
              All promotional drive sheets, sponsorship trackers, and operations sheets in one single place.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={loadSheets}
              disabled={loading}
              className="px-3 py-1.5 rounded-full text-xs font-medium bg-white/10 hover:bg-white/20 text-white border border-white/15 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <FiRefreshCw className={`text-xs ${loading ? "animate-spin" : ""}`} />
              <span>Refresh</span>
            </button>

            <button
              onClick={openAddModal}
              className="px-3.5 py-1.5 rounded-full text-xs font-medium bg-blue-600 hover:bg-blue-500 text-white transition-all flex items-center gap-1.5 shadow-sm border border-blue-400/30 cursor-pointer"
            >
              <FiPlus className="text-sm" />
              <span>Add Sheet</span>
            </button>
          </div>
        </div>

        {/* Search Bar - Transparent Glass Box */}
        <div className="bg-slate-900/40 backdrop-blur-md border border-white/10 rounded-xl p-3 shadow-sm">
          <form onSubmit={handleSearchSubmit} className="relative w-full">
            <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300 text-sm" />
            <input
              type="text"
              placeholder="Search sheet by name or purpose..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-lg bg-slate-950/40 backdrop-blur-sm border border-white/15 text-white placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:border-blue-400 focus:bg-slate-900/60 transition-all"
            />
          </form>
        </div>

        {/* Sheets Grid */}
        {loading ? (
          <div className="text-center py-16 text-slate-300 text-sm animate-pulse">
            Loading Google Sheets...
          </div>
        ) : sheets.length === 0 ? (
          <div className="bg-slate-900/40 backdrop-blur-md border border-white/10 rounded-xl p-12 text-center space-y-3">
            <SiGooglesheets className="text-4xl text-emerald-400 mx-auto" />
            <h3 className="text-white font-bold text-base">No Google Sheets Found</h3>
            <p className="text-xs text-slate-200 max-w-md mx-auto">
              Add your promotional sheets, sponsorship lists, or venue check-in sheets by clicking "Add Sheet".
            </p>
            <button
              onClick={openAddModal}
              className="mt-2 px-4 py-1.5 rounded-full text-xs font-medium bg-blue-600 hover:bg-blue-500 text-white inline-flex items-center gap-1.5 shadow-sm border border-blue-400/30 cursor-pointer"
            >
              <FiPlus />
              <span>Add Your First Sheet</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {sheets.map((sheet) => (
              <div
                key={sheet._id}
                onClick={() => handleOpenSheet(sheet.url)}
                className="group relative bg-slate-900/40 hover:bg-slate-900/60 backdrop-blur-md border border-white/10 hover:border-white/20 rounded-xl p-4 transition-all duration-150 shadow-sm flex flex-col justify-between cursor-pointer"
              >
                <div className="space-y-2.5">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg bg-emerald-600/20 border border-emerald-400/30 flex items-center justify-center shrink-0">
                      <SiGooglesheets className="text-emerald-300 text-lg" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-semibold text-white text-sm group-hover:text-blue-300 transition-colors line-clamp-2">
                        {sheet.title}
                      </h3>
                      {sheet.description && (
                        <p className="text-xs text-slate-200 mt-1 line-clamp-2">
                          {sheet.description}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium text-blue-300 group-hover:underline">
                    <span>Open Sheet</span>
                    <FiExternalLink className="text-xs" />
                  </span>

                  <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                    <button
                      type="button"
                      onClick={(e) => handleCopyLink(sheet, e)}
                      className="p-1.5 rounded-md text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
                      title="Copy Sheet URL"
                    >
                      {copiedId === sheet._id ? (
                        <FiCheck className="text-emerald-400 text-xs" />
                      ) : (
                        <FiCopy className="text-xs" />
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={(e) => openEditModal(sheet, e)}
                      className="p-1.5 rounded-md text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
                      title="Edit Sheet"
                    >
                      <FiEdit2 className="text-xs" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => handleDelete(sheet, e)}
                      className="p-1.5 rounded-md text-slate-300 hover:text-rose-300 hover:bg-rose-900/20 transition-colors"
                      title="Delete Sheet"
                    >
                      <FiTrash2 className="text-xs" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Add / Edit Sheet Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900/95 backdrop-blur-xl border border-white/20 rounded-xl shadow-2xl max-w-md w-full p-5 space-y-4 text-white">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <SiGooglesheets className="text-emerald-400" />
                <span>{editingSheet ? "Edit Google Sheet" : "Add Google Sheet"}</span>
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="text-slate-400 hover:text-white text-base"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-200 mb-1">
                  Sheet Title / Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Bhopal Promotional Drives 2026"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-950/60 border border-white/15 text-white text-xs focus:outline-none focus:border-blue-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-200 mb-1">
                  Google Sheet URL Link *
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://docs.google.com/spreadsheets/d/..."
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-950/60 border border-white/15 text-white text-xs focus:outline-none focus:border-blue-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-200 mb-1">
                  Description / Purpose (Optional)
                </label>
                <textarea
                  rows="2"
                  placeholder="e.g. Colleges covered, campus POC numbers, volunteer assignments"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-950/60 border border-white/15 text-white text-xs focus:outline-none focus:border-blue-400 placeholder-slate-400"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-3.5 py-1.5 rounded-full text-xs font-medium text-slate-300 hover:bg-white/10 border border-white/15"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-1.5 rounded-full text-xs font-medium bg-blue-600 hover:bg-blue-500 text-white transition-all shadow-sm border border-blue-400/30"
                >
                  {submitting ? "Saving..." : editingSheet ? "Update Sheet" : "Save Sheet"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default ManageSheets
