// Promotional Drives and Sponsorship Pipeline Service
const getBaseApiUrl = () => {
  const envUrl = import.meta?.env?.VITE_API_BASE_URL
  if (!envUrl) return "/api"
  const clean = envUrl.replace(/\/$/, "")
  return clean.endsWith("/api") ? clean : `${clean}/api`
}

const API_BASE_URL = getBaseApiUrl()

class DrivesService {
  getRequestHeaders(extra = {}) {
    const token =
      localStorage.getItem("authToken") || localStorage.getItem("token")
    const headers = { "Content-Type": "application/json", ...extra }
    if (token && token.trim() !== "") {
      headers["Authorization"] = `Bearer ${token}`
    }
    return headers
  }

  async throwApiError(response) {
    const contentType = response.headers.get("content-type")
    let errorData
    try {
      errorData = contentType?.includes("application/json")
        ? await response.json()
        : await response.text()
    } catch {
      errorData = { error: "Failed to parse error response" }
    }
    const message =
      (errorData && (errorData.message || errorData.error)) ||
      `Request failed with status ${response.status}`
    const error = new Error(
      typeof message === "string" ? message : JSON.stringify(message)
    )
    error.status = response.status
    error.data = errorData
    if (response.status === 401) {
      localStorage.removeItem("token")
      localStorage.removeItem("authToken")
      window.dispatchEvent(new Event("unauthorized"))
    }
    throw error
  }

  /* ================= PROMOTIONAL DRIVES ================= */

  async listPromoDrives({ search = "", status = "", sortBy = "driveDate", sortOrder = "desc" } = {}) {
    const params = new URLSearchParams()
    if (search) params.set("search", search)
    if (status) params.set("status", status)
    if (sortBy) params.set("sortBy", sortBy)
    if (sortOrder) params.set("sortOrder", sortOrder)

    const url = `${API_BASE_URL}/drives/promo${params.toString() ? `?${params.toString()}` : ""}`
    const res = await fetch(url, {
      method: "GET",
      headers: this.getRequestHeaders(),
      credentials: "include",
    })
    if (!res.ok) await this.throwApiError(res)
    return await res.json()
  }

  async createPromoDrive(data) {
    const res = await fetch(`${API_BASE_URL}/drives/promo`, {
      method: "POST",
      headers: this.getRequestHeaders(),
      credentials: "include",
      body: JSON.stringify(data),
    })
    if (!res.ok) await this.throwApiError(res)
    return await res.json()
  }

  async updatePromoDrive(id, data) {
    const res = await fetch(`${API_BASE_URL}/drives/promo/${id}`, {
      method: "PATCH",
      headers: this.getRequestHeaders(),
      credentials: "include",
      body: JSON.stringify(data),
    })
    if (!res.ok) await this.throwApiError(res)
    return await res.json()
  }

  async deletePromoDrive(id) {
    const res = await fetch(`${API_BASE_URL}/drives/promo/${id}`, {
      method: "DELETE",
      headers: this.getRequestHeaders(),
      credentials: "include",
    })
    if (!res.ok) await this.throwApiError(res)
    return await res.json()
  }

  async exportPromoDrives() {
    const token =
      localStorage.getItem("authToken") || localStorage.getItem("token")
    const headers = {}
    if (token) headers["Authorization"] = `Bearer ${token}`

    const res = await fetch(`${API_BASE_URL}/drives/promo/export`, {
      method: "GET",
      headers,
      credentials: "include",
    })
    if (!res.ok) await this.throwApiError(res)

    const blob = await res.blob()
    const downloadUrl = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = downloadUrl
    a.download = `qbit26_promotional_drives_${new Date().toISOString().slice(0, 10)}.csv`
    document.body.appendChild(a)
    a.click()
    a.remove()
    window.URL.revokeObjectURL(downloadUrl)
    return true
  }

  /* ================= SPONSORSHIP PIPELINE ================= */

  async listSponsors({ search = "", status = "", category = "", sortBy = "createdAt", sortOrder = "desc" } = {}) {
    const params = new URLSearchParams()
    if (search) params.set("search", search)
    if (status) params.set("status", status)
    if (category) params.set("category", category)
    if (sortBy) params.set("sortBy", sortBy)
    if (sortOrder) params.set("sortOrder", sortOrder)

    const url = `${API_BASE_URL}/drives/sponsors${params.toString() ? `?${params.toString()}` : ""}`
    const res = await fetch(url, {
      method: "GET",
      headers: this.getRequestHeaders(),
      credentials: "include",
    })
    if (!res.ok) await this.throwApiError(res)
    return await res.json()
  }

  async createSponsor(data) {
    const res = await fetch(`${API_BASE_URL}/drives/sponsors`, {
      method: "POST",
      headers: this.getRequestHeaders(),
      credentials: "include",
      body: JSON.stringify(data),
    })
    if (!res.ok) await this.throwApiError(res)
    return await res.json()
  }

  async updateSponsor(id, data) {
    const res = await fetch(`${API_BASE_URL}/drives/sponsors/${id}`, {
      method: "PATCH",
      headers: this.getRequestHeaders(),
      credentials: "include",
      body: JSON.stringify(data),
    })
    if (!res.ok) await this.throwApiError(res)
    return await res.json()
  }

  async deleteSponsor(id) {
    const res = await fetch(`${API_BASE_URL}/drives/sponsors/${id}`, {
      method: "DELETE",
      headers: this.getRequestHeaders(),
      credentials: "include",
    })
    if (!res.ok) await this.throwApiError(res)
    return await res.json()
  }

  async exportSponsors() {
    const token =
      localStorage.getItem("authToken") || localStorage.getItem("token")
    const headers = {}
    if (token) headers["Authorization"] = `Bearer ${token}`

    const res = await fetch(`${API_BASE_URL}/drives/sponsors/export`, {
      method: "GET",
      headers,
      credentials: "include",
    })
    if (!res.ok) await this.throwApiError(res)

    const blob = await res.blob()
    const downloadUrl = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = downloadUrl
    a.download = `qbit26_sponsorship_pipeline_${new Date().toISOString().slice(0, 10)}.csv`
    document.body.appendChild(a)
    a.click()
    a.remove()
    window.URL.revokeObjectURL(downloadUrl)
    return true
  }
}

const drivesService = new DrivesService()
export default drivesService
