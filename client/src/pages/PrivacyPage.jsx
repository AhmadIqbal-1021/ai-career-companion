// client/src/pages/PrivacyPage.jsx

import { Link } from 'react-router-dom'
import { Briefcase } from 'lucide-react'
import SEO from '../components/SEO'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 py-16 px-4">
      <SEO title="Privacy Policy" />
      <div className="max-w-2xl mx-auto">
        <Link to="/" className="inline-flex items-center gap-2 mb-8">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Briefcase className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-gray-900 dark:text-white">CareerAI</span>
        </Link>

        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Privacy Policy</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mb-8">Last updated: July 2026</p>

        <div className="prose dark:prose-invert max-w-none space-y-6 text-gray-600 dark:text-gray-400">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Information We Collect</h2>
            <p className="text-sm leading-relaxed">We collect information you provide directly to us, such as your name, email address, and password when you register. We also collect the career-related data you enter, including job applications, resume text, and notes.</p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">How We Use Your Information</h2>
            <p className="text-sm leading-relaxed">We use your information to provide and improve CareerAI, process your requests, and send you service-related communications. Resume text submitted for AI analysis is sent to Google Gemini API and is not stored permanently.</p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Data Security</h2>
            <p className="text-sm leading-relaxed">Your password is hashed using bcrypt and never stored in plain text. We use JWT tokens with HttpOnly cookies for secure authentication. All data is transmitted over HTTPS.</p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Contact</h2>
            <p className="text-sm leading-relaxed">For privacy-related questions, contact us at <Link href="mailto:ahmadiqbal1021412@gmail.com" className="text-blue-600 hover:underline">your@email.com</Link></p>
          </div>
        </div>

        <Link to="/" className="inline-block mt-8 text-sm text-blue-600 dark:text-blue-400 hover:underline">
          Back to home
        </Link>
      </div>
    </div>
  )
}