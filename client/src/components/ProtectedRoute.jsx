// client/src/components/ProtectedRoute.jsx

// What is this file?
// A wrapper component that guards private pages.
// If user is not logged in, redirect to login.
// If user IS logged in, render the page normally.

import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth()

  // While checking auth status, show nothing (avoid flash)
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-950">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  // Not logged in → redirect to login page
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  // Logged in → render the actual page
  return children
}