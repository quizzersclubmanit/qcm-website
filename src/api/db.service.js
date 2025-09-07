// Database service - Connected to Prisma MongoDB backend

const API_BASE_URL = 'https://qcm-backend-ln5c.onrender.com/api'

class DB {
  async insert({ collectionId, data = {} }) {
    try {
      // Map collection types to appropriate endpoints
      let endpoint = ''
      if (collectionId.includes('quiz')) {
        endpoint = '/quiz/score'
      } else if (collectionId.includes('user')) {
        endpoint = '/user/profile'
      }
      
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(data)
      })
      
      if (!response.ok) {
        throw new Error('Insert failed')
      }
      
      return await response.json()
    } catch (error) {
      throw error
    }
  }

  async select({ collectionId, queries = [] }) {
    try {
      // Map collection types to appropriate endpoints
      let endpoint = ''
      if (collectionId.includes('leaderboard') || collectionId.includes('quiz')) {
        endpoint = '/quiz/leaderboard'
      } else if (collectionId.includes('user')) {
        endpoint = '/user/profile'
      }
      
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'GET',
        credentials: 'include'
      })
      
      if (!response.ok) {
        return []
      }
      
      const data = await response.json()
      return Array.isArray(data) ? data : [data]
    } catch (error) {
      console.warn('DB service: select method error:', error)
      return []
    }
  }

  async update({ collectionId, documentId, changes = {} }) {
    try {
      let endpoint = ''
      if (collectionId.includes('user')) {
        endpoint = '/user/profile'
      }
      
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(changes)
      })
      
      if (!response.ok) {
        throw new Error('Update failed')
      }
      
      return await response.json()
    } catch (error) {
      throw error
    }
  }

  async delete({ collectionId, documentId }) {
    // TODO: Implement delete functionality if needed
    console.warn('DB service: delete method not implemented yet')
    return null
  }
}

const dbService = new DB()
export default dbService
