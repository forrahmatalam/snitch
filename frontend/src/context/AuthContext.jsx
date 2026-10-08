import { createContext, useContext, useEffect, useState } from 'react'
import { apiRequest, getTokenRole } from '../services/api'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [role, setRole] = useState('user')
  const [loading, setLoading] = useState(true)

  const saveSession = (userData, token) => {
    localStorage.setItem('accessToken', token)
    setUser(userData)
    setRole(getTokenRole(token))
  }

  const login = async (details) => {
    const result = await apiRequest('/auth/login', { method: 'POST', body: JSON.stringify(details) })
    saveSession(result.data.user, result.data.accessToken)
    return result.message
  }

  const register = async (details) => {
    const result = await apiRequest('/auth/register', { method: 'POST', body: JSON.stringify(details) })
    saveSession(result.data.user, result.data.accessToken)
    return result.message
  }

  const logout = () => {
    localStorage.removeItem('accessToken')
    setUser(null)
    setRole('user')
  }

  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('accessToken')
      if (!token) { setLoading(false); return }
      try {
        const result = await apiRequest('/auth/me')
        setUser(result.data.user)
        setRole(getTokenRole(token))
      } catch {
        try {
          const result = await apiRequest('/auth/refresh', { method: 'POST' })
          saveSession(result.data.user, result.data.accessToken)
        } catch { logout() }
      } finally { setLoading(false) }
    }
    loadUser()
  }, [])

  return <AuthContext.Provider value={{ user, role, loading, login, register, logout }}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  return useContext(AuthContext)
}
