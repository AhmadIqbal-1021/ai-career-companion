// client/src/pages/ResumeAnalyzerPage.jsx

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FileText, Loader2, CheckCircle, XCircle, AlertCircle, Sparkles } from 'lucide-react'
import DashboardLayout from '../layouts/DashboardLayout'
import { aiService } from '../services/aiService'
import toast from 'react-hot-toast'
import { useAIUsage } from '../hooks/useAIUsage'
import AIUsageBadge from '../components/dashboard/AIUsageBadge'
// Score color helper
const getScoreColor = (score) => {
  if (score >= 80) return 'text-green-600 dark:text-green-400'
  if (score >= 60) return 'text-yellow-600 dark:text-yellow-400'
  return 'text-red-600 dark:text-red-400'
}

const getScoreBg = (score) => {
  if (score >= 80) return 'bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800'
  if (score >= 60) return 'bg-yellow-50 dark:bg-yellow-950/30 border-yellow-200 dark:border-yellow-800'
  return 'bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800'
}

export default function ResumeAnalyzerPage() {
  const [resumeText, setResumeText] = useState('')
  const [analysis, setAnalysis] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const { usage, decrementUsage } = useAIUsage()

  
const handleAnalyze = async () => {
  if (resumeText.trim().length < 50) {
    toast.error('Please paste your full resume text')
    return
  }
  setIsLoading(true)
  setAnalysis(null)
  try {
    const res = await aiService.analyzeResume(resumeText)
    setAnalysis(res.data.analysis)
    decrementUsage() // update counter
    toast.success('Analysis complete!')
  } catch (err) {
    // Show specific message based on error code
    const message = err.response?.data?.message || 'Analysis failed. Please try again.'
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

    


  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">

        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-blue-600" />
            AI Resume Analyzer    <AIUsageBadge usage={usage} />
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            Paste your resume and get instant AI-powered feedback
          </p>
         
        </div>

        {/* Input */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Paste Your Resume Text
          </label>
          <textarea
            value={resumeText}
            onChange={e => setResumeText(e.target.value)}
            placeholder="Paste your full resume here — work experience, skills, education, projects..."
            rows={12}
            className="w-full px-4 py-3 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none font-mono"
          />
          <div className="flex items-center justify-between mt-3">
            <span className="text-xs text-gray-400">
              {resumeText.length} characters
            </span>
            <button
              onClick={handleAnalyze}
              disabled={isLoading || resumeText.length < 50}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-sm font-medium px-6 py-2.5 rounded-lg transition-colors"
            >
              {isLoading ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Analyzing...</>
              ) : (
                <><Sparkles className="w-4 h-4" /> Analyze Resume</>
              )}
            </button>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-12 text-center">
            <Loader2 className="w-10 h-10 text-blue-600 animate-spin mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400 font-medium">AI is analyzing your resume...</p>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">This takes about 10-15 seconds</p>
          </div>
        )}

        {/* Results */}
        <AnimatePresence>
          {analysis && !isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              {/* Score Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { label: 'ATS Score', value: analysis.atsScore },
                  { label: 'Formatting', value: analysis.formattingScore },
                  { label: 'Content', value: analysis.contentScore },
                ].map(item => (
                  <div key={item.label} className={`border rounded-xl p-5 text-center ${getScoreBg(item.value)}`}>
                    <div className={`text-4xl font-bold mb-1 ${getScoreColor(item.value)}`}>
                      {item.value}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                      {item.label}
                    </div>
                    {/* Score bar */}
                    <div className="mt-3 bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                      <div
                        className={`h-1.5 rounded-full transition-all duration-1000 ${
                          item.value >= 80 ? 'bg-green-500' : 
                          item.value >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${item.value}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Summary */}
              <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-5">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-blue-600" />
                  Overall Assessment
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                  {analysis.summary}
                </p>
              </div>

              {/* Strengths + Weaknesses */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-5">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    Strengths
                  </h3>
                  <ul className="space-y-2">
                    {analysis.strengths?.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <span className="text-green-500 mt-0.5">✓</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-5">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                    <XCircle className="w-4 h-4 text-red-600" />
                    Weaknesses
                  </h3>
                  <ul className="space-y-2">
                    {analysis.weaknesses?.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <span className="text-red-500 mt-0.5">✗</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Missing Keywords */}
              <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-5">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                  Missing Keywords
                </h3>
                <div className="flex flex-wrap gap-2">
                  {analysis.missingKeywords?.map((keyword, i) => (
                    <span key={i} className="px-3 py-1 bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 rounded-full text-xs font-medium">
                      + {keyword}
                    </span>
                  ))}
                </div>
              </div>

              {/* Suggestions */}
              <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-5">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                  Actionable Suggestions
                </h3>
                <ol className="space-y-2">
                  {analysis.suggestions?.map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-gray-600 dark:text-gray-400">
                      <span className="w-5 h-5 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
                        {i + 1}
                      </span>
                      {item}
                    </li>
                  ))}
                </ol>
              </div>

            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  )
}