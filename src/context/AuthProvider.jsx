// src/context/AuthProvider.jsx
import React, { createContext, useState, useEffect, useContext } from "react"

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`https://qcm-backend-ln5c.onrender.com/api/auth/me`, {
          method: "GET",
          credentials: "include", // send JWT cookie
        }) 
        console.log('Auth check response status:', res);
        if (res.ok) {
            const data = await res.json()
            console.log('Auth check response data:', data);
            setUser(data.user)
        } else {
          setUser(null)
        }
      } catch (err) {
        console.error("Auth check failed:", err)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }
    fetchUser()
  }, [])

  return (
    <AuthContext.Provider value={{ user, setUser, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
