// client/src/App.jsx

import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { Toaster } from 'react-hot-toast'
import ProtectedRoute from './components/ProtectedRoute'

import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import DashboardPage from './pages/DashboardPage'
import ResumeAnalyzerPage from './pages/ResumeAnalyzerPage'
import CoverLetterPage from './pages/CoverLetterPage'
import InterviewPrepPage from './pages/InterviewPrepPage'
import DiscoveryBoardPage from './pages/DiscoveryBoardPage'
import ApplicationsPage from './pages/ApplicationsPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import PrivacyPage from './pages/PrivacyPage'
import TermsPage from './pages/TermsPage'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            className: 'dark:bg-gray-800 dark:text-white',
            duration: 3000,
          }}
        />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          {/* Dashboard home — shows overview + application tracker table */}
          <Route path="/dashboard" element={
            <ProtectedRoute><DashboardPage /></ProtectedRoute>
          } />

          {/*
            FIX for Issue 3:
            The sidebar links to /dashboard/applications, but this route
            was never registered — it only existed inside the sidebar's
            navItems array, not in the router. That mismatch is exactly
            why React Router fell through to the 404 catch-all route.

            Since DashboardPage already contains the application tracker,
            we simply point this URL to the SAME page component.
            This is a common, valid pattern — one component, multiple URLs.
          */}
          <Route path="/dashboard/applications" element={
  <ProtectedRoute><ApplicationsPage /></ProtectedRoute>
} />

          <Route path="/dashboard/discoveries" element={
            <ProtectedRoute><DiscoveryBoardPage /></ProtectedRoute>
          } />
          <Route path="/dashboard/resume-analyzer" element={
            <ProtectedRoute><ResumeAnalyzerPage /></ProtectedRoute>
          } />
          <Route path="/dashboard/cover-letter" element={
            <ProtectedRoute><CoverLetterPage /></ProtectedRoute>
          } />
          <Route path="/dashboard/interview-prep" element={
            <ProtectedRoute><InterviewPrepPage /></ProtectedRoute>
          } />

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
