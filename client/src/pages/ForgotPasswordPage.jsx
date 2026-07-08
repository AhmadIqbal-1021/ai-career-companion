// client/src/pages/ForgotPasswordPage.jsx

import { Link } from 'react-router-dom'
import { Briefcase, Mail } from 'lucide-react'
import { motion } from 'framer-motion'
import SEO from '../components/SEO'

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center px-4">
      <SEO title="Forgot Password" />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md text-center"
      >
        <Link to="/" className="inline-flex items-center gap-2 mb-8">
          <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center">
            <Briefcase className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-gray-900 dark:text-white text-xl">CareerAI</span>
        </Link>

        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-8 shadow-sm">
          <div className="w-14 h-14 bg-blue-50 dark:bg-blue-950/50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Mail className="w-7 h-7 text-blue-600" />
          </div>

          <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            Password Reset
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
            Password reset via email is coming soon. For now, please contact us directly and we will help you regain access to your account.
          </p>

          <Link
            href="mailto:ahmadiqbal1021412@gmail.com"
            className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg transition-colors text-sm mb-3 cursor-pointer"
          >
            Contact Support
          </Link>

          <Link
            to="/login"
            className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
          >
            Back to login
          </Link>
        </div>
      </motion.div>
    </div>
  )
}