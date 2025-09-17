// Database service - Connected to Prisma MongoDB backend

// Use environment variable when available; otherwise fallback to deployed backend
const API_BASE_URL = (import.meta && import.meta.env && import.meta.env.VITE_API_BASE_URL)
  ? `${import.meta.env.VITE_API_BASE_URL.replace(/\/$/, '')}/api`
  : 'https://qcm-backend-ln5c.onrender.com/api'

class DB {
  // Helper function to get token from cookies or local storage
  getTokenFromCookies() {
    try {
      // First try to get token from cookies
      const cookies = document.cookie.split(';')
      for (let cookie of cookies) {
        const [name, value] = cookie.trim().split('=')
        if (name === 'token' || name === 'accessToken' || name === 'authToken') {
          console.log('Token found in cookies:', name)
          return value
        }
      }
      
      // If not in cookies, try localStorage
      const token = localStorage.getItem('token') || 
                   localStorage.getItem('accessToken') ||
                   localStorage.getItem('authToken')
      
      if (token) {
        console.log('Token found in localStorage')
        return token
      }
      
      console.log('No authentication token found')
      return null
    } catch (error) {
      console.error('Error reading authentication token:', error)
      return null
    }
  }

  // Common headers for all requests
  getRequestHeaders() {
    try {
      // Get token from localStorage
      const token = localStorage.getItem('authToken') || localStorage.getItem('token');
      
      const headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      };
      
      if (token && token.trim() !== '') {
        // Only send the standard Authorization header to minimize CORS issues
        headers['Authorization'] = `Bearer ${token}`;
      } else {
        // Leave without auth header if no token present
      }
      
      return headers;
    } catch (error) {
      console.error('Error in getRequestHeaders:', error);
      return {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      };
    }
  }

  // Handle API errors consistently
  async handleErrorResponse(response) {
    const contentType = response.headers.get('content-type')
    let errorData
    
    try {
      errorData = contentType?.includes('application/json') 
        ? await response.json() 
        : await response.text()
    } catch (e) {
      errorData = { error: 'Failed to parse error response' }
    }
    
    const error = new Error(
      errorData.message || errorData.error || `Request failed with status ${response.status}`
    )
    error.status = response.status
    error.data = errorData
    
    // Handle specific error cases
    if (response.status === 401) {
      // Clear local auth state on 401
      if (typeof window !== 'undefined' && window.dispatch) {
        try {
          const { logout } = require('../redux/user.slice').default
          window.dispatch(logout())
          // Redirect to login if we're not already there
          if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/signin')) {
            window.location.href = '/signin?sessionExpired=true'
          }
        } catch (e) {
          console.error('Error during auth cleanup:', e)
        }
      }
    }
    
    console.error('API Error:', {
      status: response.status,
      statusText: response.statusText,
      url: response.url,
      errorData
    })
    
    throw error
  }

  // Log request details for debugging
  logRequest(method, url, data) {
    if (process.env.NODE_ENV !== 'production') {
      console.group(`API ${method} ${url}`)
      console.log('Request data:', data)
      console.groupEnd()
    }
  }

  // Log response details for debugging
  logResponse(response, data) {
    if (process.env.NODE_ENV !== 'production') {
      console.group(`API Response ${response.status} ${response.url}`)
      console.log('Status:', response.status, response.statusText)
      console.log('Headers:', Object.fromEntries([...response.headers.entries()]))
      console.log('Response data:', data)
      console.groupEnd()
    }
  }

  async insert({ collectionId, data = {} }) {
    try {
      console.log('DB Service - Insert Operation');
      
      // Map collection types to appropriate endpoints
      let endpoint = '';
      if (collectionId.includes('quiz') && !collectionId.includes('leaderboard')) {
        endpoint = '/quiz/create';
      } else if (collectionId.includes('leaderboard')) {
        endpoint = '/quiz/score';
      } else if (collectionId.includes('user')) {
        endpoint = '/user/profile';
      } else {
        throw new Error(`Unsupported collection: ${collectionId}`);
      }
      
      const url = `${API_BASE_URL}${endpoint}`;
      
      // Get headers with auth token
      const headers = this.getRequestHeaders();
      
      // Prepare fetch options with credentials
      const options = {
        method: 'POST',
        headers: {
          ...headers,
          'Content-Type': 'application/json'
        },
        // No credentials needed when using Bearer tokens
        body: JSON.stringify(data)
      };
      
      console.log('Sending request to:', url);
      
      // Make the request
      const response = await fetch(url, options);
      
      // Check for HTTP error status
      if (!response.ok) {
        console.error('Request failed with status:', response.status);
        const error = await this.handleErrorResponse(response);
        throw error;
      }
      
      // Parse and return response
      const responseData = await response.json();
      return responseData;
      
    } catch (error) {
      console.error('Error in insert method:', error);
      // Map network errors (often CORS/preflight) to a clearer message
      if (error instanceof TypeError || (error.message && error.message.includes('Failed to fetch'))) {
        const networkError = new Error('Network error: Failed to reach server. This can be caused by CORS or the server being down. Please check backend CORS (allow Authorization header and credentials), endpoint path, and server availability.');
        networkError.cause = error;
        throw networkError;
      }
      if (error.status === 401) {
        // Clear any invalid tokens
        localStorage.removeItem('token');
        localStorage.removeItem('authToken');
        // Notify the app of auth failure
        window.dispatchEvent(new Event('unauthorized'));
      }
      throw error;
    }
  }

  async select({ collectionId, queries = [] }) {
    try {
      // Map collection types to appropriate endpoints
      let endpoint = ''
      if (collectionId.includes('quiz') && !collectionId.includes('leaderboard')) {
        endpoint = '/quiz'
      } else if (collectionId.includes('leaderboard')) {
        endpoint = '/quiz/leaderboard'
      } else if (collectionId.includes('user')) {
        endpoint = '/user'
      }
      
      // Add query parameters if any
      const queryString = queries.length > 0 
        ? `?${new URLSearchParams(queries).toString()}` 
        : ''
      
      const url = `${API_BASE_URL}${endpoint}${queryString}`
      const options = {
        method: 'GET',
        headers: this.getRequestHeaders(),
        // No credentials needed when using Bearer tokens
      }
      
      this.logRequest('GET', url, null)
      const response = await fetch(url, options)
      
      if (!response.ok) {
        return this.handleErrorResponse(response)
      }
      
      const responseData = await response.json().catch(() => ({}))
      this.logResponse(response, responseData)
      
      return responseData
    } catch (error) {
      console.error('Select error:', error)
      throw error
    }
  }

  async update({ collectionId, id, data = {} }) {
    try {
      // Map collection types to appropriate endpoints
      let endpoint = ''
      if (collectionId.includes('quiz') && !collectionId.includes('leaderboard')) {
        endpoint = `/quiz/${id}`
      } else if (collectionId.includes('leaderboard')) {
        endpoint = `/quiz/score/${id}`
      } else if (collectionId.includes('user')) {
        endpoint = `/user/${id}`
      }
      
      const url = `${API_BASE_URL}${endpoint}`
      const options = {
        method: 'PUT',
        headers: this.getRequestHeaders(),
        credentials: 'include',
        body: JSON.stringify(data)
      }
      
      this.logRequest('PUT', url, data)
      const response = await fetch(url, options)
      
      if (!response.ok) {
        return this.handleErrorResponse(response)
      }
      
      const responseData = await response.json().catch(() => ({}))
      this.logResponse(response, responseData)
      
      return responseData
    } catch (error) {
      console.error('Update error:', error)
      throw error
    }
  }

  async delete({ collectionId, id }) {
    try {
      // Map collection types to appropriate endpoints
      let endpoint = ''
      if (collectionId.includes('quiz') && !collectionId.includes('leaderboard')) {
        endpoint = `/quiz/${id}`
      } else if (collectionId.includes('leaderboard')) {
        endpoint = `/quiz/score/${id}`
      } else if (collectionId.includes('user')) {
        endpoint = `/user/${id}`
      }
      
      const url = `${API_BASE_URL}${endpoint}`
      const options = {
        method: 'DELETE',
        headers: this.getRequestHeaders(),
        credentials: 'include'
      }
      
      this.logRequest('DELETE', url, null)
      const response = await fetch(url, options)
      
      if (!response.ok) {
        return this.handleErrorResponse(response)
      }
      
      // Some DELETE endpoints might not return content
      let responseData = {}
      try {
        responseData = await response.json()
        this.logResponse(response, responseData)
      } catch (e) {
        // No content is acceptable for DELETE
        if (response.status !== 204) {
          console.warn('Unexpected response format from DELETE:', response)
        }
      }
      
      return responseData
    } catch (error) {
      console.error('Delete error:', error)
      throw error
    }
    console.warn('DB service: delete method not implemented yet')
    return null
  }
}

const dbService = new DB()
export default dbService
