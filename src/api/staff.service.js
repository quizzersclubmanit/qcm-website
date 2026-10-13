// Staff & Club Member Role Management Service
const getBaseApiUrl = () => {
  const envUrl = import.meta?.env?.VITE_API_BASE_URL
  if (!envUrl) return "/api"
  const clean = envUrl.replace(/\/$/, "")
  return clean.endsWith("/api") ? clean : `${clean}/api`
}

const API_BASE_URL = getBaseApiUrl()

class StaffService {
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

  async listStaff({ search = "", role = "" } = {}) {
    const params = new URLSearchParams()
    if (search) params.set("search", search)
    if (role) params.set("role", role)

    const url = `${API_BASE_URL}/user/staff${params.toString() ? `?${params.toString()}` : ""}`
    const res = await fetch(url, {
      method: "GET",
      headers: this.getRequestHeaders(),
      credentials: "include",
    })
    if (!res.ok) await this.throwApiError(res)
    return await res.json()
  }

  async assignRole({ email, userId, role }) {
    const res = await fetch(`${API_BASE_URL}/user/staff/assign`, {
      method: "POST",
      headers: this.getRequestHeaders(),
      credentials: "include",
      body: JSON.stringify({ email, userId, role }),
    })
    if (!res.ok) await this.throwApiError(res)
    return await res.json()
  }

  async updateRole(userId, role) {
    const res = await fetch(`${API_BASE_URL}/user/staff/${userId}/role`, {
      method: "PATCH",
      headers: this.getRequestHeaders(),
      credentials: "include",
      body: JSON.stringify({ role }),
    })
    if (!res.ok) await this.throwApiError(res)
    return await res.json()
  }
}

const staffService = new StaffService()
export default staffService
