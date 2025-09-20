// Auth service - Connected to Prisma MongoDB backend

const API_BASE_URL = 'https://qcm-backend-ln5c.onrender.com'

class Auth {
  async signupAndLogin({ email, password, name, phone, city, school, sex }) {
    try {
      // Allow admin user creation for administrative purposes
      // if (name === "admin") {
      //   throw new Error("Name is reserved. Please enter another name")
      // }
      
      console.log('Frontend sending signup data:', { email, password: '***', name, phone, city, school, sex });
      console.log('API URL:', `${API_BASE_URL}/api/auth/signup`);
      
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
          phoneNo: phone, // Convert phone to phoneNo for backend
          city, 
          school, 
          sex 
        })
      })
      
      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);
      
      const data = await response.json()
      console.log('Response data:', data);
      
      if (!response.ok) {
        console.error('Signup failed with status:', response.status, 'Error:', data.error);
        throw new Error(data.error || 'Signup failed')
      }
      
      return data.user
    } catch (error) {
      console.error('Signup error:', error);
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('Network error: Unable to connect to server. Please check your internet connection.');
      }
      throw error
    }
  }

  async login({ email = "", password = "" }) {
    try {
      console.log('=== LOGIN ATTEMPT STARTED ===');
      console.log('Frontend sending login data:', { email, password: '***' });
      console.log('API URL:', `${API_BASE_URL}/api/auth/login`);
      
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, password })
      })
      
      console.log('Login response status:', response.status);
      console.log('Login response headers:', response.headers);
      
      const data = await response.json()
      console.log('Login response data:', data);
      console.log('=== LOGIN RESPONSE RECEIVED ===');
      
      if (!response.ok) {
        console.error('Login failed with status:', response.status, 'Error:', data.error);
        throw new Error(data.error || 'Login failed')
      }
      
      // Try to get the token from the response or cookies
      const token = data.token || 
                   document.cookie
                     .split('; ')
                     .find(row => row.startsWith('token='))
                     ?.split('=')[1];
      
      // Store token in localStorage for future requests
      if (token) {
        console.log('Storing token in localStorage:', token.substring(0, 10) + '...');
        localStorage.setItem('token', token);
        localStorage.setItem('authToken', token);
      } else {
        console.warn('No token received in login response');
        console.log('Available cookies:', document.cookie);
        console.log('Response data keys:', Object.keys(data));
      }
      
      return data.user
    } catch (error) {
      console.error('Login error:', error);
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('Network error: Unable to connect to server. Please check your internet connection.');
      }
      throw error
    }
  }

  async getCurrentUser() {
    try {
      console.log('Fetching current user from:', `${API_BASE_URL}/api/auth/me`);
      
      // Get token from localStorage or cookies
      const token = localStorage.getItem('token') || 
                   localStorage.getItem('authToken') ||
                   document.cookie
                     .split('; ')
                     .find(row => row.startsWith('token='))
                     ?.split('=')[1];
      
      if (!token) {
        console.warn('No authentication token found');
        return null;
      }
      
      console.log('Using token for auth/me request');
      
      const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          'Cache-Control': 'no-cache',
          'Authorization': `Bearer ${token}`
        }
      });
      
      console.log('Auth/me response status:', response.status);
      
      // If unauthorized, clear the invalid token
      if (response.status === 401) {
        console.warn('Session expired or invalid token');
        localStorage.removeItem('token');
        localStorage.removeItem('authToken');
        document.cookie = 'token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        return null;
      }
      
      if (response.status === 401) {
        console.log('Not authenticated - no valid session');
        throw new Error('Not authenticated');
      }
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Auth/me error:', response.status, errorData);
        throw new Error(errorData.error || 'Failed to fetch user data');
      }
      
      const data = await response.json();
      console.log('Current user data:', data);
      return data.user || data; // Handle both { user } and direct user object responses
    } catch (error) {
      console.error('Error in getCurrentUser:', error);
      // Only rethrow if it's not a 401 (which is expected when not logged in)
      if (error.message !== 'Not authenticated') {
        console.error('Unexpected error in getCurrentUser:', error);
      }
      throw error;
    }
  }

  async logout() {
    try {
      console.log('Initiating logout...');
      
      // Clear local storage first
      localStorage.removeItem('token');
      localStorage.removeItem('authToken');
      
      // Clear cookies
      document.cookie = 'token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
      document.cookie = 'accessToken=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
      document.cookie = 'authToken=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
      
      // Try to call the server to invalidate the session
      try {
        const response = await fetch(`${API_BASE_URL}/api/auth/logout`, {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache'
          }
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          console.error('Server logout failed:', response.status, errorData);
          // Even if server logout fails, we've already cleared local data
        }
      } catch (serverError) {
        console.error('Error during server logout:', serverError);
        // Continue with local logout even if server logout fails
      }
      
      console.log('Logout completed successfully');
      return { success: true, message: 'Logout completed successfully' };
      
    } catch (error) {
      console.error('Error during logout process:', error);
      // Ensure we still clear local data even if something else fails
      localStorage.removeItem('token');
      localStorage.removeItem('authToken');
      document.cookie = 'token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
      
      // Only throw if it's not a network error
      if (error.name !== 'TypeError' || !error.message.includes('fetch')) {
        throw error;
      }
      
      // For network errors, still resolve since we've cleared local data
      return { success: true, message: 'Local logout completed (offline mode)' };
    }
  }

  async addPhoneNumber({ phone, password }) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/phone`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ phone })
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Phone update failed')
      }
      
      return data.user
    } catch (error) {
      throw error
    }
  }

  async sendVerificationToken() {
    // TODO: Implement phone verification if needed
    console.warn('Phone verification not implemented yet')
    return null
  }

  async verifyToken({ userId, secret }) {
    // TODO: Implement phone verification if needed
    console.warn('Phone verification not implemented yet')
    return null
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

const authService = new Auth()
export default authService
