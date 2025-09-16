// Auth service - Connected to Prisma MongoDB backend
const API_BASE_URL = import.meta.env.API_BASE_URL || 'http://localhost:3000';

class Auth {
  async signupAndLogin({ email, password, name, phone, city, school, sex }) {
    try {
      if (name === "admin") {
        throw new Error("Name is reserved. Please enter another name")
      }
      const response = await fetch(`${API_BASE_URL}/api/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({
          email,
          password,
          name,
          phoneNo: phone, // Convert phone to phoneNo for backend
          city,
          school,
          sex
        })
      })


      const data = await response.json()

      if (!response.ok) {
        console.error(
          "Signup failed with status:",
          response.status,
          "Error:",
          data.error
        )
        throw new Error(data.error || "Signup failed")
      }

      return data.user
    } catch (error) {
      console.error("Signup error:", error)
      if (error.name === "TypeError" && error.message.includes("fetch")) {
        throw new Error(
          "Network error: Unable to connect to server. Please check your internet connection."
        )
      }
      throw error
    }
  }

  async login({ email = "", password = "" }) {
    try {
       const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({ email, password })
      })
      const data = await response.json()

      if (!response.ok) {
        console.error(
          "Login failed with status:",
          response.status,
          "Error:",
          data.error
        )
        throw new Error(data.error || "Login failed")
      }

      return data.user
    } catch (error) {
      console.error("Login error:", error)
      if (error.name === "TypeError" && error.message.includes("fetch")) {
        throw new Error(
          "Network error: Unable to connect to server. Please check your internet connection."
        )
      }
      throw error
    }
  }

  async getCurrentUser() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
        method: "GET",
        credentials: "include"
      })

      if (!response.ok) {
        throw new Error("Not authenticated")
      }

      const data = await response.json()
      return data.user
    } catch (error) {
      throw error
    }
  }

  async logout() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/logout`, {
        method: "POST",
        credentials: "include"
      })

      const data = await response.json()
      return data
    } catch (error) {
      throw error
    }
  }

  async addPhoneNumber({ phone, password }) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/phone`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({ phone })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Phone update failed")
      }

      return data.user
    } catch (error) {
      throw error
    }
  }

  async sendVerificationToken() {
    // TODO: Implement phone verification if needed
    console.warn("Phone verification not implemented yet")
    return null
  }

  async verifyToken({ userId, secret }) {
    // TODO: Implement phone verification if needed
    console.warn("Phone verification not implemented yet")
    return null
  }

  async sendEmailToken({ email }) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to send reset email")
      }

      return data
    } catch (error) {
      throw error
    }
  }

  async resetPassword({ token, newPassword }) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ token, newPassword })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to reset password")
      }

      return data
    } catch (error) {
      throw error
    }
  }
}

const authService = new Auth()
export default authService
