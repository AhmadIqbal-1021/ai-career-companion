// client/src/pages/TermsPage.jsx

import { Link } from 'react-router-dom'
import { Briefcase } from 'lucide-react'
import SEO from '../components/SEO'

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 py-16 px-4">
      <SEO title="Terms of Service" />
      <div className="max-w-2xl mx-auto">
        <Link to="/" className="inline-flex items-center gap-2 mb-8">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Briefcase className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-gray-900 dark:text-white">CareerAI</span>
        </Link>

        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Terms of Service</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mb-8">Last updated: July 2026</p>

        <div className="space-y-6 text-gray-600 dark:text-gray-400">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Acceptance of Terms</h2>
            <p className="text-sm leading-relaxed">By using CareerAI, you agree to these terms. CareerAI is a portfolio project built for educational purposes and to help students manage their job search.</p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Use of Service</h2>
            <p className="text-sm leading-relaxed">You may use CareerAI for personal, non-commercial purposes. You are responsible for maintaining the confidentiality of your account credentials.</p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">AI Features</h2>
            <p className="text-sm leading-relaxed">AI-generated content including resume analysis, cover letters, and interview questions are suggestions only. CareerAI makes no guarantees about the accuracy or effectiveness of AI-generated content.</p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Limitation of Liability</h2>
            <p className="text-sm leading-relaxed">CareerAI is provided as-is without warranties. We are not liable for any outcomes related to job applications or career decisions made using this platform.</p>
          </div>
        </div>

        <Link to="/" className="inline-block mt-8 text-sm text-blue-600 dark:text-blue-400 hover:underline">
          Back to home
        </Link>
      </div>
    </div>
  )
}