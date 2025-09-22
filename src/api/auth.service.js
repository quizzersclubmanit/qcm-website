const API_BASE_URL = 'https://qcm-backend-ln5c.onrender.com'
class Auth {
  async signupAndLogin({ email, password, name, phone, city, school, sex }) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          email,
          password,
          name,
          phoneNo: phone, // backend expects phoneNo
          city,
          school,
          sex
        })
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);

      const data = await response.json();
      console.log('Response data:', data);

      if (!response.ok) {
        console.error('Signup failed with status:', response.status, 'Error:', data.error);
        throw new Error(data.error || 'Signup failed');
      }

      return data.user;
    } catch (error) {
      console.error('Signup error:', error);
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('Network error: Unable to connect to server. Please check your internet connection.');
      }
      throw error;
    }
  }

  async login({ email = "", password = "" }) {
    try {
      console.log('=== LOGIN ATTEMPT STARTED ===');
      console.log('Frontend sending login data:', { email, password: '***' });

      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, password })
      });

      console.log('Login response status:', response.status);
      const data = await response.json();
      console.log('Login response data:', data);
      console.log('=== LOGIN RESPONSE RECEIVED ===');

      if (!response.ok) {
        console.error('Login failed with status:', response.status, 'Error:', data.error);
        throw new Error(data.error || 'Login failed');
      }

      return data.user;
    } catch (error) {
      console.error('Login error:', error);
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('Network error: Unable to connect to server. Please check your internet connection.');
      }
      throw error;
    }
  }

  async getCurrentUser() {
    try {
      console.log("Fetching current user from:", `${API_BASE_URL}/api/auth/me`);

      const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
        method: "GET",
        credentials: "include",  // sends session cookie
        headers: {
          "Accept": "application/json"
        }
      });

      console.log("Auth/me response status:", response.status);

      if (!response.ok) {
        if (response.status === 401) {
          console.log("Not authenticated - session invalid or expired");
          return null;
        }
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to fetch user data");
      }

      const data = await response.json();
      console.log("Current user data:", data);
      return data.user || null;
    } catch (error) {
      console.error("Error in getCurrentUser:", error);
      return null;
    }
  }

  async logout() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/logout`, {
        method: "POST",
        credentials: "include", // send session cookie
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to logout");
      }

      console.log("Logged out successfully");
      return true;
    } catch (error) {
      console.error("Logout error:", error);
      return false;
    }
  }

  async addPhoneNumber({ phone }) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/phone`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ phone })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Phone update failed');
      }

      return data.user;
    } catch (error) {
      throw error;
    }
  }

  async sendVerificationToken() {
    console.warn('Phone verification not implemented yet');
    return null;
  }

  async verifyToken({ userId, secret }) {
    console.warn('Phone verification not implemented yet');
    return null;
  }

  async sendEmailToken({ email }) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send reset email');
      }

      return data;
    } catch (error) {
      throw error;
    }
  }

  async resetPassword({ token, newPassword }) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, newPassword })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to reset password');
      }

      return data;
    } catch (error) {
      throw error;
    }
  }
}

const authService = new Auth();
export default authService;
