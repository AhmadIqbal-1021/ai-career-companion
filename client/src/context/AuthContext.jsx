// client/src/context/AuthContext.jsx

import { createContext, useContext, useState, useEffect } from 'react'
import { authService, setAuthToken } from "../services/authService";

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [accessToken, setAccessToken] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  // On app load, try to restore session using refresh token cookie
  useEffect(() => {
    const restoreSession = async () => {
      try {
        // Ask server to give us a new access token using the refresh cookie
        const res = await authService.refresh()
        const { accessToken: newToken } = res.data

        setAccessToken(newToken)
        setAuthToken(newToken)

        // Get user data with the new token
        const userRes = await authService.getMe()
        setUser(userRes.data.user)
      } catch (err) {
        // No valid session — user needs to log in
        setUser(null)
        setAccessToken(null)
      } finally {
        setIsLoading(false)
      }
    }

    restoreSession()
  }, [])

  const login = async (credentials) => {
    const res = await authService.login(credentials)
    const { accessToken: newToken, user: userData } = res.data

    setAccessToken(newToken)
    setAuthToken(newToken)
    setUser(userData)

    return res.data
  }

  const register = async (credentials) => {
    const res = await authService.register(credentials)
    const { accessToken: newToken, user: userData } = res.data

    setAccessToken(newToken)
    setAuthToken(newToken)
    setUser(userData)

    return res.data
  }

  const logout = async () => {
    try {
      await authService.logout()
    } catch (err) {
      // Logout even if server call fails
    }
    setUser(null)
    setAccessToken(null)
    setAuthToken(null)
  }

  return (
    <AuthContext.Provider value={{
      user,
      accessToken,
      isLoading,
      login,
      register,
      logout,
      isAuthenticated: !!user,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used inside AuthProvider')
  return context
}