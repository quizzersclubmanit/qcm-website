import React, { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import drivesService from "../api/drives.service"
import { isAdminUser } from "../utils/authUtils"
import AdminNav from "./AdminNav"
import toast from "react-hot-toast"
import {
  FiBriefcase,
  FiPlus,
  FiDownload,
  FiSearch,
  FiRefreshCw,
  FiPhone,
  FiMail,
  FiUser,
  FiDollarSign,
  FiCalendar,
  FiEdit2,
  FiTrash2,
  FiCheckCircle,
  FiClock,
  FiAlertCircle
} from "react-icons/fi"

const SPONSOR_STATUS_CONFIG = {
  LEAD: { label: "Lead Identified", bg: "bg-slate-100 text-slate-700 border-slate-300" },
  CONTACTED: { label: "Contacted", bg: "bg-blue-50 text-blue-700 border-blue-200" },
  PITCH_MEETING: { label: "Pitch Meeting", bg: "bg-indigo-50 text-indigo-700 border-indigo-200" },
  PROPOSAL_SENT: { label: "Proposal Sent", bg: "bg-sky-50 text-sky-700 border-sky-200" },
  NEGOTIATION: { label: "Negotiating", bg: "bg-amber-50 text-amber-800 border-amber-300" },
  CONFIRMED: { label: "Confirmed", bg: "bg-emerald-50 text-emerald-800 border-emerald-300" },
  PAYMENT_RECEIVED: { label: "Payment Received", bg: "bg-emerald-100 text-emerald-900 border-emerald-400" },
  DECLINED: { label: "Declined", bg: "bg-rose-50 text-rose-700 border-rose-200" },
}

const CATEGORY_LABELS = {
  TITLE_SPONSOR: "Title Sponsor",
  POWERED_BY: "Powered By",
  ASSOCIATE: "Associate Sponsor",
  BEVERAGE_FOOD: "Food & Beverage Partner",
  PRINTING_MERCH: "Printing & Merch Partner",
  EDTECH: "EdTech Partner",
  MEDIA_PARTNER: "Media Partner",
  OTHER: "Event Partner",
}

const ManageSponsors = () => {
  const { data: user } = useSelector((state) => state.user)
  const isAdmin = isAdminUser(user)

  const [sponsors, setSponsors] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("")
  const [exporting, setExporting] = useState(false)

  // Create / Edit Modal
  const [modalOpen, setModalOpen] = useState(false)
  const [editingSponsor, setEditingSponsor] = useState(null)
  const [formData, setFormData] = useState({
    companyName: "",
    category: "ASSOCIATE",
    contactPerson: "",
    designation: "",
    phone: "",
    email: "",
    status: "LEAD",
    leadMember: "",
    expectedAmount: 0,
    confirmedAmount: 0,
    paymentStatus: "UNPAID",
    deliverables: "",
    nextFollowUp: "",
    notes: "",
  })
  const [saving, setSaving] = useState(false)

  const loadSponsors = async () => {
    setLoading(true)
    try {
      const res = await drivesService.listSponsors({
        search: search.trim(),
        status: statusFilter,
        category: categoryFilter,
      })
      setSponsors(res.sponsors || [])
      setStats(res.stats || null)
    } catch (err) {
      toast.error(err.message || "Failed to load sponsorship pipeline")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadSponsors()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter, categoryFilter])

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    loadSponsors()
  }

  const handleExport = async () => {
    setExporting(true)
    try {
      await drivesService.exportSponsors()
      toast.success("Sponsorship pipeline exported to CSV")
    } catch (err) {
      toast.error(err.message || "Export failed")
    } finally {
      setExporting(false)
    }
  }

  const openCreateModal = () => {
    setEditingSponsor(null)
    setFormData({
      companyName: "",
      category: "ASSOCIATE",
      contactPerson: "",
      designation: "",
      phone: "",
      email: "",
      status: "LEAD",
      leadMember: user?.name || "QCM Sponsorship",
      expectedAmount: 0,
      confirmedAmount: 0,
      paymentStatus: "UNPAID",
      deliverables: "",
      nextFollowUp: "",
      notes: "",
    })
    setModalOpen(true)
  }

  const openEditModal = (sponsor) => {
    setEditingSponsor(sponsor)
    setFormData({
      companyName: sponsor.companyName || "",
      category: sponsor.category || "ASSOCIATE",
      contactPerson: sponsor.contactPerson || "",
      designation: sponsor.designation || "",
      phone: sponsor.phone || "",
      email: sponsor.email || "",
      status: sponsor.status || "LEAD",
      leadMember: sponsor.leadMember || "",
      expectedAmount: sponsor.expectedAmount || 0,
      confirmedAmount: sponsor.confirmedAmount || 0,
      paymentStatus: sponsor.paymentStatus || "UNPAID",
      deliverables: sponsor.deliverables || "",
      nextFollowUp: sponsor.nextFollowUp ? sponsor.nextFollowUp.slice(0, 10) : "",
      notes: sponsor.notes || "",
    })
    setModalOpen(true)
  }

  const handleSaveSponsor = async (e) => {
    e.preventDefault()
    if (!formData.companyName.trim()) {
      toast.error("Company name is required")
      return
    }
    if (!formData.contactPerson.trim()) {
      toast.error("Contact person name is required")
      return
    }

    setSaving(true)
    try {
      if (editingSponsor) {
        await drivesService.updateSponsor(editingSponsor._id, formData)
        toast.success(`Updated sponsor "${formData.companyName}"`)
      } else {
        await drivesService.createSponsor(formData)
        toast.success(`Added sponsor lead "${formData.companyName}"`)
      }
      setModalOpen(false)
      loadSponsors()
    } catch (err) {
      toast.error(err.message || "Failed to save sponsor lead")
    } finally {
      setSaving(false)
    }
  }

  const handleQuickStatusChange = async (sponsorId, newStatus) => {
    try {
      await drivesService.updateSponsor(sponsorId, { status: newStatus })
      toast.success(`Status updated to ${newStatus}`)
      setSponsors((prev) =>
        prev.map((s) => (s._id === sponsorId ? { ...s, status: newStatus } : s))
      )
      loadSponsors()
    } catch (err) {
      toast.error(err.message || "Failed to update status")
    }
  }

  const handleDeleteSponsor = async (sponsorId, companyName) => {
    if (!window.confirm(`Delete sponsor lead "${companyName}" from pipeline?`)) {
      return
    }
    try {
      await drivesService.deleteSponsor(sponsorId)
      toast.success(`Deleted "${companyName}"`)
      setSponsors((prev) => prev.filter((s) => s._id !== sponsorId))
      loadSponsors()
    } catch (err) {
      toast.error(err.message || "Failed to delete lead")
    }
  }

  const formatINR = (amt) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amt || 0)
  }

  return (
    <div className="min-h-screen bg-[#F4F8FC] text-slate-800 font-['Poppins',sans-serif]">
      <AdminNav activeTab="sponsors" />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Top Header & Actions */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-blue-950 flex items-center gap-2">
              <FiBriefcase className="text-blue-600" />
              Sponsorship Drives & Brand Pipeline
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Track brand pitches, title/associate sponsorships, deliverable commitments, and cash realization.
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
              <span>Add Sponsor Lead</span>
            </button>
          </div>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-white p-3 rounded-xl border border-blue-100 shadow-2xs">
            <div className="text-[11px] font-semibold text-slate-500">Total Leads</div>
            <div className="text-xl font-black text-blue-950 mt-1">
              {stats?.totalLeads ?? sponsors.length}
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">
              {stats?.confirmedLeads ?? 0} Confirmed / Paid
            </div>
          </div>

          <div className="bg-white p-3 rounded-xl border border-blue-100 shadow-2xs">
            <div className="text-[11px] font-semibold text-blue-700">Pipeline Target</div>
            <div className="text-xl font-black text-blue-900 mt-1">
              {formatINR(stats?.totalExpectedINR ?? 0)}
            </div>
            <div className="text-[10px] text-blue-500 mt-0.5">Total pitch volume</div>
          </div>

          <div className="bg-white p-3 rounded-xl border border-blue-100 shadow-2xs">
            <div className="text-[11px] font-semibold text-emerald-700">Confirmed Sponsorship</div>
            <div className="text-xl font-black text-emerald-700 mt-1">
              {formatINR(stats?.totalConfirmedINR ?? 0)}
            </div>
            <div className="text-[10px] text-emerald-600 mt-0.5">Agreed / Closed deals</div>
          </div>

          <div className="bg-white p-3 rounded-xl border border-blue-100 shadow-2xs">
            <div className="text-[11px] font-semibold text-emerald-800">Funds Received</div>
            <div className="text-xl font-black text-emerald-800 mt-1">
              {formatINR(stats?.totalReceivedINR ?? 0)}
            </div>
            <div className="text-[10px] text-emerald-600 mt-0.5">Realized into club account</div>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white p-3 rounded-xl border border-blue-100 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-3">
          <form onSubmit={handleSearchSubmit} className="relative w-full md:w-80">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
            <input
              type="text"
              placeholder="Search company, contact person, lead..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-blue-200 text-xs focus:outline-none focus:border-blue-600"
            />
          </form>

          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end">
            <div className="flex items-center gap-1.5">
              <label className="text-xs text-slate-500 font-medium">Tier:</label>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-2.5 py-1.5 rounded-lg border border-blue-200 text-xs text-slate-700 bg-white focus:outline-none focus:border-blue-600"
              >
                <option value="">All Tiers</option>
                {Object.entries(CATEGORY_LABELS).map(([k, v]) => (
                  <option key={k} value={k}>
                    {v}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-1.5">
              <label className="text-xs text-slate-500 font-medium">Status:</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-2.5 py-1.5 rounded-lg border border-blue-200 text-xs text-slate-700 bg-white focus:outline-none focus:border-blue-600"
              >
                <option value="">All Statuses</option>
                {Object.entries(SPONSOR_STATUS_CONFIG).map(([k, v]) => (
                  <option key={k} value={k}>
                    {v.label}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={loadSponsors}
              disabled={loading}
              className="px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:text-blue-900 hover:bg-blue-50 border border-blue-200"
              title="Refresh list"
            >
              <FiRefreshCw className={`text-xs ${loading ? "animate-spin" : ""}`} />
            </button>
          </div>
        </div>

        {/* Sponsor Leads Table */}
        <div className="bg-white rounded-xl border border-blue-100 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-blue-50/70 border-b border-blue-100 text-blue-950 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-2.5 px-4">Company & Tier</th>
                  <th className="py-2.5 px-4">Brand POC</th>
                  <th className="py-2.5 px-4">Account Lead</th>
                  <th className="py-2.5 px-4">Financials & Payment</th>
                  <th className="py-2.5 px-4">Pipeline Status</th>
                  <th className="py-2.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-blue-50">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-400">
                      Loading sponsorship leads...
                    </td>
                  </tr>
                ) : sponsors.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-500">
                      No sponsor leads recorded yet. Click "Add Sponsor Lead" to start pitching companies!
                    </td>
                  </tr>
                ) : (
                  sponsors.map((lead) => {
                    const statusInfo =
                      SPONSOR_STATUS_CONFIG[lead.status] || SPONSOR_STATUS_CONFIG.LEAD
                    return (
                      <tr key={lead._id} className="hover:bg-blue-50/40 transition-colors">
                        {/* Company & Tier */}
                        <td className="py-3 px-4">
                          <div className="font-bold text-blue-950 text-xs">
                            {lead.companyName}
                          </div>
                          <span className="inline-block mt-0.5 text-[10px] font-semibold text-blue-700 bg-blue-50 px-1.5 py-0.2 rounded border border-blue-100">
                            {CATEGORY_LABELS[lead.category] || lead.category}
                          </span>
                        </td>

                        {/* Brand POC */}
                        <td className="py-3 px-4 text-slate-700">
                          <div className="font-semibold text-blue-900">{lead.contactPerson}</div>
                          {lead.designation && (
                            <div className="text-[10px] text-slate-500">{lead.designation}</div>
                          )}
                          <div className="flex items-center gap-2 mt-0.5 text-[11px]">
                            {lead.phone && (
                              <a
                                href={`tel:${lead.phone}`}
                                className="text-blue-600 hover:underline flex items-center gap-1"
                              >
                                <FiPhone className="text-[9px]" />
                                <span>{lead.phone}</span>
                              </a>
                            )}
                            {lead.email && (
                              <a
                                href={`mailto:${lead.email}`}
                                className="text-slate-500 hover:text-blue-600 flex items-center gap-1"
                              >
                                <FiMail className="text-[9px]" />
                              </a>
                            )}
                          </div>
                        </td>

                        {/* Account Lead */}
                        <td className="py-3 px-4 text-slate-600 text-xs">
                          <div className="flex items-center gap-1 font-medium text-slate-800">
                            <FiUser className="text-[10px] text-blue-500" />
                            <span>{lead.leadMember || "Sponsorship Team"}</span>
                          </div>
                          {lead.nextFollowUp && (
                            <div className="text-[10px] text-amber-700 flex items-center gap-1 mt-0.5">
                              <FiClock className="text-[9px]" />
                              <span>Follow up: {new Date(lead.nextFollowUp).toLocaleDateString("en-IN")}</span>
                            </div>
                          )}
                        </td>

                        {/* Financials & Payment */}
                        <td className="py-3 px-4">
                          <div className="text-xs">
                            <span className="font-bold text-emerald-700">
                              {lead.confirmedAmount ? formatINR(lead.confirmedAmount) : "—"}
                            </span>
                            {lead.expectedAmount > 0 && !lead.confirmedAmount && (
                              <span className="text-[10px] text-slate-500">
                                Target: {formatINR(lead.expectedAmount)}
                              </span>
                            )}
                          </div>
                          <span
                            className={`inline-block mt-0.5 text-[9px] font-bold px-1.5 py-0.2 rounded ${
                              lead.paymentStatus === "COMPLETED"
                                ? "bg-emerald-100 text-emerald-800"
                                : lead.paymentStatus === "PARTIALLY_PAID"
                                ? "bg-amber-100 text-amber-800"
                                : "bg-slate-100 text-slate-600"
                            }`}
                          >
                            Payment: {lead.paymentStatus}
                          </span>
                        </td>

                        {/* Pipeline Status */}
                        <td className="py-3 px-4">
                          <select
                            value={lead.status || "LEAD"}
                            onChange={(e) =>
                              handleQuickStatusChange(lead._id, e.target.value)
                            }
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full border cursor-pointer ${statusInfo.bg}`}
                          >
                            {Object.entries(SPONSOR_STATUS_CONFIG).map(([k, v]) => (
                              <option key={k} value={k}>
                                {v.label}
                              </option>
                            ))}
                          </select>
                        </td>

                        {/* Actions */}
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => openEditModal(lead)}
                              className="p-1.5 rounded-lg text-slate-500 hover:text-blue-700 hover:bg-blue-50 transition-colors"
                              title="Edit Lead Details"
                            >
                              <FiEdit2 className="text-xs" />
                            </button>
                            {isAdmin && (
                              <button
                                onClick={() =>
                                  handleDeleteSponsor(lead._id, lead.companyName)
                                }
                                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                                title="Delete Lead"
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
                <FiBriefcase className="text-blue-600" />
                <span>{editingSponsor ? "Edit Sponsor Lead" : "Add Sponsor Lead"}</span>
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-base"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveSponsor} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Company / Brand Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Tata Consultancy Services / Toprankers"
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-lg border border-blue-200 text-xs focus:outline-none focus:border-blue-600"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Sponsorship Tier
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg border border-blue-200 text-xs focus:outline-none focus:border-blue-600"
                  >
                    {Object.entries(CATEGORY_LABELS).map(([k, v]) => (
                      <option key={k} value={k}>
                        {v}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Pipeline Stage
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg border border-blue-200 text-xs focus:outline-none focus:border-blue-600"
                  >
                    {Object.entries(SPONSOR_STATUS_CONFIG).map(([k, v]) => (
                      <option key={k} value={k}>
                        {v.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Contact Info */}
              <div className="pt-2 border-t border-blue-50">
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Brand Representative
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <input
                      type="text"
                      required
                      placeholder="Contact Person Name *"
                      value={formData.contactPerson}
                      onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                      className="w-full px-3 py-1.5 rounded-lg border border-blue-200 text-xs focus:outline-none focus:border-blue-600"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder="Designation (e.g. Marketing Lead)"
                      value={formData.designation}
                      onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                      className="w-full px-3 py-1.5 rounded-lg border border-blue-200 text-xs focus:outline-none focus:border-blue-600"
                    />
                  </div>
                  <div>
                    <input
                      type="tel"
                      placeholder="Contact Phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3 py-1.5 rounded-lg border border-blue-200 text-xs focus:outline-none focus:border-blue-600"
                    />
                  </div>
                  <div>
                    <input
                      type="email"
                      placeholder="Corporate Email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3 py-1.5 rounded-lg border border-blue-200 text-xs focus:outline-none focus:border-blue-600"
                    />
                  </div>
                </div>
              </div>

              {/* Financials & Follow-up */}
              <div className="pt-2 border-t border-blue-50">
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Financials & Internal Assignment
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div>
                    <label className="text-[10px] text-slate-500">Expected INR (₹)</label>
                    <input
                      type="number"
                      min="0"
                      value={formData.expectedAmount}
                      onChange={(e) => setFormData({ ...formData, expectedAmount: e.target.value })}
                      className="w-full px-2 py-1 rounded border border-blue-200 text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-500">Confirmed INR (₹)</label>
                    <input
                      type="number"
                      min="0"
                      value={formData.confirmedAmount}
                      onChange={(e) => setFormData({ ...formData, confirmedAmount: e.target.value })}
                      className="w-full px-2 py-1 rounded border border-blue-200 text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-500">Payment Status</label>
                    <select
                      value={formData.paymentStatus}
                      onChange={(e) => setFormData({ ...formData, paymentStatus: e.target.value })}
                      className="w-full px-2 py-1 rounded border border-blue-200 text-xs"
                    >
                      <option value="UNPAID">Unpaid</option>
                      <option value="PARTIALLY_PAID">Partially Paid</option>
                      <option value="COMPLETED">Completed</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Account Lead (Club Member)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Ankit Verma"
                    value={formData.leadMember}
                    onChange={(e) => setFormData({ ...formData, leadMember: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg border border-blue-200 text-xs focus:outline-none focus:border-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Next Follow-Up Date
                  </label>
                  <input
                    type="date"
                    value={formData.nextFollowUp}
                    onChange={(e) => setFormData({ ...formData, nextFollowUp: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg border border-blue-200 text-xs focus:outline-none focus:border-blue-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Deliverables Promised to Sponsor
                </label>
                <textarea
                  rows="2"
                  placeholder="e.g. Logo on auditorium backdrop, 2-minute sponsor pitch before final round, social media posts"
                  value={formData.deliverables}
                  onChange={(e) => setFormData({ ...formData, deliverables: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-lg border border-blue-200 text-xs focus:outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Internal Notes
                </label>
                <textarea
                  rows="2"
                  placeholder="e.g. Spoke to Regional Head, needs approval from Mumbai HQ by Wednesday"
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
                  {saving ? "Saving..." : editingSponsor ? "Update Sponsor" : "Add Sponsor"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default ManageSponsors
