// client/src/App.jsx

import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'

import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import DashboardPage from './pages/DashboardPage'

function App() {
  return (
    // BrowserRouter enables URL-based routing
    <BrowserRouter>
      {/* AuthProvider wraps everything so all components can access auth state */}
      <AuthProvider>
        <Routes>
          {/* Public routes — anyone can visit */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected routes — only logged in users */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          } />

          {/* 404 fallback */}
          <Route path="*" element={
            <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-950">
              <div className="text-center">
                <h1 className="text-6xl font-bold text-gray-900 dark:text-white mb-4">404</h1>
                <p className="text-gray-500 mb-6">Page not found</p>
                <a href="/" className="text-blue-600 hover:underline">Go home</a>
              </div>
            </div>
          } />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App