// Q-Bit registrations service — admin view / export / Google Sheet sync.
// Talks to the Prisma/Mongoose backend (routes/qbit.js):
//   GET  /api/qbit/admin/teams          paginated + filterable list
//   GET  /api/qbit/admin/teams/export   same filters -> .xlsx download
//   GET  /api/qbit/admin/teams/stats    dashboard counters
//   POST /api/qbit/admin/teams/sync-sheet   full Google Sheet reconcile
//   GET  /api/qbit/admin/teams/sync-status  sync health
//
// Conventions mirror db.service.js: base URL from VITE_API_BASE_URL with the
// same fallback, Bearer JWT from localStorage, cors + no-cache.

const getBaseApiUrl = () => {
  const envUrl = import.meta?.env?.VITE_API_BASE_URL
  if (!envUrl) return "/api"
  const clean = envUrl.replace(/\/$/, "")
  return clean.endsWith("/api") ? clean : `${clean}/api`
}

const API_BASE_URL = getBaseApiUrl()

// Public link to the mirrored Google Sheet. Set VITE_QBIT_SHEET_URL to show
// an "Open Sheet" button; left empty the button hides itself.
export const QBIT_SHEET_URL =
  (import.meta && import.meta.env && import.meta.env.VITE_QBIT_SHEET_URL) || ""

class QbitService {
  getRequestHeaders(extra = {}) {
    const token =
      localStorage.getItem("authToken") || localStorage.getItem("token")
    const headers = { "Content-Type": "application/json", ...extra }
    if (token && token.trim() !== "") {
      headers["Authorization"] = `Bearer ${token}`
    }
    return headers
  }

  // Parse an error response the same way db.service does
  async throwApiError(response) {
    const contentType = response.headers.get("content-type")
    let errorData
    try {
      errorData = contentType?.includes("application/json")
        ? await response.json()
        : await response.text()
    } catch (e) {
      errorData = { error: "Failed to parse error response" }
    }
    const message =
      (errorData && (errorData.message || errorData.error)) ||
      `Request failed with status ${response.status}`
    const error = new Error(typeof message === "string" ? message : JSON.stringify(message))
    error.status = response.status
    error.data = errorData
    if (response.status === 401) {
      localStorage.removeItem("token")
      localStorage.removeItem("authToken")
      window.dispatchEvent(new Event("unauthorized"))
    }
    throw error
  }

  // Drop empty params so the backend sees a clean query string
  buildQuery(params = {}) {
    const cleaned = {}
    for (const [k, v] of Object.entries(params)) {
      if (v !== undefined && v !== null && String(v).trim() !== "") {
        cleaned[k] = v
      }
    }
    const qs = new URLSearchParams(cleaned).toString()
    return qs ? `?${qs}` : ""
  }

  async listTeams(params = {}) {
    const url = `${API_BASE_URL}/qbit/admin/teams${this.buildQuery(params)}`
    const response = await fetch(url, {
      method: "GET",
      headers: this.getRequestHeaders(),
      credentials: "include",
      mode: "cors",
      cache: "no-cache"
    })
    if (!response.ok) await this.throwApiError(response)
    return response.json().catch(() => ({}))
  }

  async getStats(params = {}) {
    const url = `${API_BASE_URL}/qbit/admin/teams/stats${this.buildQuery(params)}`
    const response = await fetch(url, {
      method: "GET",
      headers: this.getRequestHeaders(),
      credentials: "include",
      mode: "cors",
      cache: "no-cache"
    })
    if (!response.ok) await this.throwApiError(response)
    return response.json().catch(() => ({}))
  }

  async getSyncStatus() {
    const url = `${API_BASE_URL}/qbit/admin/teams/sync-status`
    const response = await fetch(url, {
      method: "GET",
      headers: this.getRequestHeaders(),
      credentials: "include",
      mode: "cors",
      cache: "no-cache"
    })
    if (!response.ok) await this.throwApiError(response)
    return response.json().catch(() => ({}))
  }

  async syncSheet() {
    const url = `${API_BASE_URL}/qbit/admin/teams/sync-sheet`
    const response = await fetch(url, {
      method: "POST",
      headers: this.getRequestHeaders(),
      credentials: "include",
      mode: "cors",
      cache: "no-cache"
    })
    if (!response.ok) await this.throwApiError(response)
    return response.json().catch(() => ({}))
  }

  // Download the .xlsx export for the given filters via a temp <a> element
  async exportTeams(params = {}) {
    // Pagination never applies to exports — strip it so the full filter set downloads
    const filters = { ...params }
    delete filters.page
    delete filters.limit
    const url = `${API_BASE_URL}/qbit/admin/teams/export${this.buildQuery(filters)}`
    const response = await fetch(url, {
      method: "GET",
      headers: this.getRequestHeaders({ Accept: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }),
      credentials: "include",
      mode: "cors",
      cache: "no-cache"
    })
    if (!response.ok) await this.throwApiError(response)
    const blob = await response.blob()

    // Prefer the server's filename, fall back to a dated one
    let filename = `qbit-teams-${new Date().toISOString().slice(0, 10)}.xlsx`
    const disposition = response.headers.get("content-disposition")
    if (disposition) {
      const match = disposition.match(/filename="?([^";]+)"?/)
      if (match) filename = match[1]
    }

    const objectUrl = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = objectUrl
    a.download = filename
    document.body.appendChild(a)
    a.click()
    a.remove()
    window.URL.revokeObjectURL(objectUrl)
    return { filename }
  }

  async getTeam(id) {
    const url = `${API_BASE_URL}/qbit/admin/teams/${id}`
    const response = await fetch(url, {
      method: "GET",
      headers: this.getRequestHeaders(),
      credentials: "include",
      mode: "cors",
      cache: "no-cache"
    })
    if (!response.ok) await this.throwApiError(response)
    return response.json().catch(() => ({}))
  }

  async updateTeam(id, data) {
    const url = `${API_BASE_URL}/qbit/admin/teams/${id}`
    const response = await fetch(url, {
      method: "PATCH",
      headers: this.getRequestHeaders({ "Content-Type": "application/json" }),
      credentials: "include",
      mode: "cors",
      cache: "no-cache",
      body: JSON.stringify(data)
    })
    if (!response.ok) await this.throwApiError(response)
    return response.json().catch(() => ({}))
  }

  async deleteTeam(id) {
    const url = `${API_BASE_URL}/qbit/admin/teams/${id}`
    const response = await fetch(url, {
      method: "DELETE",
      headers: this.getRequestHeaders(),
      credentials: "include",
      mode: "cors",
      cache: "no-cache"
    })
    if (!response.ok) await this.throwApiError(response)
    return response.json().catch(() => ({}))
  }

  async checkinTeam(id, payload = {}) {
    const url = `${API_BASE_URL}/qbit/admin/teams/${id}/checkin`
    const response = await fetch(url, {
      method: "POST",
      headers: this.getRequestHeaders({ "Content-Type": "application/json" }),
      credentials: "include",
      mode: "cors",
      cache: "no-cache",
      body: JSON.stringify(payload)
    })
    if (!response.ok) await this.throwApiError(response)
    return response.json().catch(() => ({}))
  }

  async getDuplicates() {
    const url = `${API_BASE_URL}/qbit/admin/teams/duplicates`
    const response = await fetch(url, {
      method: "GET",
      headers: this.getRequestHeaders(),
      credentials: "include",
      mode: "cors",
      cache: "no-cache"
    })
    if (!response.ok) await this.throwApiError(response)
    return response.json().catch(() => ({}))
  }
}

const qbitService = new QbitService()
export default qbitService

