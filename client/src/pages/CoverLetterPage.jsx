// client/src/pages/CoverLetterPage.jsx

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, Loader2, Copy, Check, Sparkles } from 'lucide-react'
import DashboardLayout from '../layouts/DashboardLayout'
import { aiService } from '../services/aiService'
import toast from 'react-hot-toast'
import { useAIUsage } from '../hooks/useAIUsage'
import AIUsageBadge from '../components/dashboard/AIUsageBadge'

export default function CoverLetterPage() {
  const [formData, setFormData] = useState({
    companyName: '',
    position: '',
    jobDescription: '',
    resumeText: '',
  })
  const [result, setResult] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const { usage, decrementUsage } = useAIUsage()

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleGenerate = async () => {
    if (!formData.companyName || !formData.position || !formData.resumeText || !formData.jobDescription) {
      toast.error('Please fill all fields')
      return
    }
    setIsLoading(true)
    setResult(null)
    try {
      const res = await aiService.generateCoverLetter(formData)
      setResult(res.data)
      decrementUsage() // update counter
      toast.success('Cover letter generated!')
    } catch (err) {
      const message = err.response?.data?.message || 'Generation failed. Please try again.'
    const code = err.response?.data?.code
    if (code === 'AI_RATE_LIMIT_EXCEEDED') {
      toast.error(message, { duration: 5000 })
    } else if (code === 'SERVICE_BUSY') {
      toast.error(message, { duration: 5000 })
    } else {
      toast.error(message)
    }
    } finally {
      setIsLoading(false)
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(result.coverLetter)
    setCopied(true)
    toast.success('Copied to clipboard!')
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">

        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Mail className="w-6 h-6 text-blue-600" />
            Cover Letter Generator   
          <div className="flex items-center justify-between">            
            <AIUsageBadge usage={usage} />
          </div>
          </h1>
          
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            Generate a tailored cover letter in seconds
          </p>
        </div>
        
          

        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 space-y-4">

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Company Name</label>
              <input
                name="companyName" value={formData.companyName} onChange={handleChange}
                placeholder="Google"
                className="w-full px-4 py-2.5 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Position</label>
              <input
                name="position" value={formData.position} onChange={handleChange}
                placeholder="Software Engineer Intern"
                className="w-full px-4 py-2.5 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Job Description</label>
            <textarea
              name="jobDescription" value={formData.jobDescription} onChange={handleChange}
              placeholder="Paste the job description here..."
              rows={5}
              className="w-full px-4 py-3 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Your Resume</label>
            <textarea
              name="resumeText" value={formData.resumeText} onChange={handleChange}
              placeholder="Paste your resume text here..."
              rows={6}
              className="w-full px-4 py-3 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none font-mono"
            />
          </div>

          <button
            onClick={handleGenerate}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-3 rounded-lg transition-colors text-sm"
          >
            {isLoading ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Generating...</>
            ) : (
              <><Sparkles className="w-4 h-4" /> Generate Cover Letter</>
            )}
          </button>
        </div>

        <AnimatePresence>
          {result && !isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">Generated Cover Letter</h3>
                  {result.subject && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      Subject: {result.subject}
                    </p>
                  )}
                </div>
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white border border-gray-200 dark:border-gray-700 px-3 py-1.5 rounded-lg transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-5 text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap font-serif">
                {result.coverLetter}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  )
}