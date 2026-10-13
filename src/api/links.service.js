// Service for Google Sheets and Google Drive links management
const getBaseApiUrl = () => {
  const envUrl = import.meta?.env?.VITE_API_BASE_URL
  if (!envUrl) return "/api"
  const clean = envUrl.replace(/\/$/, "")
  return clean.endsWith("/api") ? clean : `${clean}/api`
}

const API_BASE_URL = getBaseApiUrl()

class LinksService {
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

  async listLinks({ type = "", search = "", category = "" } = {}) {
    const params = new URLSearchParams()
    if (type) params.set("type", type)
    if (search) params.set("search", search)
    if (category) params.set("category", category)

    const url = `${API_BASE_URL}/links${params.toString() ? `?${params.toString()}` : ""}`
    const res = await fetch(url, {
      method: "GET",
      headers: this.getRequestHeaders(),
      credentials: "include",
    })
    if (!res.ok) await this.throwApiError(res)
    return await res.json()
  }

  async createLink({ title, url, type, category, description }) {
    const res = await fetch(`${API_BASE_URL}/links`, {
      method: "POST",
      headers: this.getRequestHeaders(),
      credentials: "include",
      body: JSON.stringify({ title, url, type, category, description }),
    })
    if (!res.ok) await this.throwApiError(res)
    return await res.json()
  }

  async updateLink(id, data) {
    const res = await fetch(`${API_BASE_URL}/links/${id}`, {
      method: "PATCH",
      headers: this.getRequestHeaders(),
      credentials: "include",
      body: JSON.stringify(data),
    })
    if (!res.ok) await this.throwApiError(res)
    return await res.json()
  }

  async deleteLink(id) {
    const res = await fetch(`${API_BASE_URL}/links/${id}`, {
      method: "DELETE",
      headers: this.getRequestHeaders(),
      credentials: "include",
    })
    if (!res.ok) await this.throwApiError(res)
    return await res.json()
  }
}

const linksService = new LinksService()
export default linksService
