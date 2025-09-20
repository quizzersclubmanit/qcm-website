// Database service - Connected to Prisma MongoDB backend

// Use environment variable when available; otherwise fallback to deployed backend
const API_BASE_URL = (import.meta && import.meta.env && import.meta.env.VITE_API_BASE_URL)
  ? `${import.meta.env.VITE_API_BASE_URL.replace(/\/$/, '')}/api`
  : 'https://qcm-backend-ln5c.onrender.com/api'

console.log('DB Service initialized with API_BASE_URL:', API_BASE_URL)

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
      
      // Minimal headers to avoid CORS preflight issues
      const headers = {
        'Content-Type': 'application/json'
      };
      
      if (token && token.trim() !== '') {
        // Only send the standard Authorization header to minimize CORS issues
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      return headers;
    } catch (error) {
      console.error('Error in getRequestHeaders:', error);
      return {
        'Content-Type': 'application/json'
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
    
    // Log detailed error information for debugging
    console.error('=== API Error Details ===');
    console.error('Status:', response.status);
    console.error('URL:', response.url);
    console.error('Error Data:', errorData);
    
    // Create detailed error message
    let errorMessage = errorData.message || errorData.error || `Request failed with status ${response.status}`;
    
    // If there are validation details, include them
    if (errorData.details && Array.isArray(errorData.details)) {
      errorMessage += '\nValidation errors:\n' + errorData.details.join('\n');
    }
    
    const error = new Error(errorMessage)
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
      console.log('=== DB Service - Insert Operation ===');
      console.log('Collection ID:', collectionId);
      console.log('Data to insert:', data);
      
      // Map collection types to appropriate endpoints
      let endpoint = '';
      if (collectionId.includes('quiz') && !collectionId.includes('leaderboard')) {
        endpoint = '/quiz/create'; // Use POST to /api/quiz/create for creating quizzes
      } else if (collectionId.includes('leaderboard')) {
        endpoint = '/quiz/score';
      } else if (collectionId.includes('user')) {
        endpoint = '/user/profile';
      } else {
        throw new Error(`Unsupported collection: ${collectionId}`);
      }
      
      const url = `${API_BASE_URL}${endpoint}`;
      console.log('Target URL:', url);
      
      // Get headers with auth token
      const headers = this.getRequestHeaders();
      console.log('Request headers:', headers);
      
      // Prepare fetch options - try without credentials first to avoid CORS preflight issues
      const options = {
        method: 'POST',
        headers: headers,
        mode: 'cors', // Explicitly set CORS mode
        cache: 'no-cache', // Use cache option instead of header to avoid CORS preflight
        body: JSON.stringify(data)
      };
      
      console.log('Request options:', {
        method: options.method,
        headers: options.headers,
        bodyLength: options.body.length
      });
      
      // Make the request
      console.log('Making fetch request...');
      let response;
      
      try {
        response = await fetch(url, options);
      } catch (fetchError) {
        console.error('Fetch failed:', fetchError);
        
        // Try a simpler request without Authorization header if the first fails
        if (options.headers.Authorization) {
          console.log('Retrying without Authorization header...');
          const simpleOptions = {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            mode: 'cors',
            cache: 'no-cache',
            body: JSON.stringify(data)
          };
          
          try {
            response = await fetch(url, simpleOptions);
          } catch (retryError) {
            console.error('Retry also failed:', retryError);
            throw fetchError; // Throw original error
          }
        } else {
          throw fetchError;
        }
      }
      
      console.log('Response received:', {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries([...response.headers.entries()])
      });
      
      // Check for HTTP error status
      if (!response.ok) {
        console.error('Request failed with status:', response.status);
        const error = await this.handleErrorResponse(response);
        throw error;
      }
      
      // Parse and return response
      const responseData = await response.json();
      console.log('Response data:', responseData);
      console.log('=== Insert Operation Complete ===');
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
        endpoint = '/quiz' // GET /api/quiz works for fetching quizzes
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
        mode: 'cors',
        cache: 'no-cache'
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
        mode: 'cors',
        cache: 'no-cache',
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
        mode: 'cors',
        cache: 'no-cache'
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
