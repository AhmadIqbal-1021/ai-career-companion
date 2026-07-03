// client/src/pages/RegisterPage.jsx

import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Briefcase, Eye, EyeOff, Loader2, Check } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  // const { login } = useAuth()
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
    setError('')
  }

  // Password strength indicator
  const passwordChecks = [
    { label: 'At least 8 characters', pass: formData.password.length >= 8 },
    { label: 'Contains a number', pass: /\d/.test(formData.password) },
    { label: 'Contains a letter', pass: /[a-zA-Z]/.test(formData.password) },
  ]
// const handleSubmit = async (e) => {
//   e.preventDefault()
//   setIsLoading(true)
//   setError('')
//   try {
//     await register(formData)
//     navigate('/dashboard')
//   } catch (err) {
//     setError(err.response?.data?.message || 'Something went wrong')
//   } finally {
//     setIsLoading(false)
//   }
// }
const handleSubmit = async (e) => {
  e.preventDefault()
  setIsLoading(true)
  setError('')

  console.log('Register form data:', formData) // ADD THIS

  try {
    const result = await register(formData)
    console.log('Register result:', result) // ADD THIS
    navigate('/dashboard')
  } catch (err) {
    console.log('Register error:', err.response?.data) // ADD THIS
    setError(err.response?.data?.message || 'Something went wrong')
  } finally {
    setIsLoading(false)
  }
}
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2">
            <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-gray-900 dark:text-white text-xl">CareerAI</span>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mt-6 mb-1">
            Create your account
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Free forever. No credit card required.
          </p>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-8 shadow-sm">

          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Full name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Ahmad Khan"
                required
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Email address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a strong password"
                  required
                  className="w-full px-4 py-2.5 pr-10 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Password strength indicators */}
              {formData.password.length > 0 && (
                <div className="mt-2 space-y-1">
                  {passwordChecks.map(check => (
                    <div key={check.label} className="flex items-center gap-2">
                      <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center ${check.pass ? 'bg-green-500' : 'bg-gray-200 dark:bg-gray-700'}`}>
                        {check.pass && <Check className="w-2 h-2 text-white" />}
                      </div>
                      <span className={`text-xs ${check.pass ? 'text-green-600 dark:text-green-400' : 'text-gray-400'}`}>
                        {check.label}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-2.5 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 text-sm mt-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                'Create account'
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 dark:text-blue-400 font-medium hover:underline">
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  )
}