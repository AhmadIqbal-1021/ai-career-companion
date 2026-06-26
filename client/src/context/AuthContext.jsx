// client/src/context/AuthContext.jsx

// What is this file?
// Global authentication state for the entire app.
// Any component can call useAuth() to get the current user
// or call login/logout functions.

import { createContext, useContext, useState, useEffect } from 'react'

// Step 1: Create the context object
const AuthContext = createContext(null)

// Step 2: Create the Provider component
// This wraps your entire app and makes auth state available everywhere
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  // Check if user is already logged in when app first loads
  // We'll check localStorage for now — later we'll verify with the server
  useEffect(() => {
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setIsLoading(false)
  }, [])

  const login = (userData) => {
    setUser(userData)
    localStorage.setItem('user', JSON.stringify(userData))
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('user')
  }

  const value = {
    user,
    isLoading,
    login,
    logout,
    isAuthenticated: !!user, // !! converts to boolean: null → false, object → true
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

// Step 3: Custom hook for easy access
// Instead of importing useContext + AuthContext everywhere,
// components just call useAuth()
export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider')
  }
  return context
}