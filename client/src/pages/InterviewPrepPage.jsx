// client/src/pages/InterviewPrepPage.jsx

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageSquare, Loader2, ChevronDown, ChevronUp, Sparkles, Lightbulb } from 'lucide-react'
import DashboardLayout from '../layouts/DashboardLayout'
import { aiService } from '../services/aiService'
import toast from 'react-hot-toast'
import { useAIUsage } from '../hooks/useAIUsage'
import AIUsageBadge from '../components/dashboard/AIUsageBadge'
// Collapsible question card
function QuestionCard({ question, tip, index }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
      >
        <div className="flex items-start gap-3">
          <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
            {index + 1}
          </span>
          <span className="text-sm font-medium text-gray-900 dark:text-white">{question}</span>
        </div>
        {open ? <ChevronUp className="w-4 h-4 text-gray-400 flex-shrink-0" /> : <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />}
      </button>
      {open && (
        <div className="px-4 pb-3 pt-0 border-t border-gray-100 dark:border-gray-700">
          <div className="flex items-start gap-2 text-sm text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/30 rounded-lg px-3 py-2 mt-2">
            <Lightbulb className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>{tip}</span>
          </div>
        </div>
      )}
    </div>
  )
}

export default function InterviewPrepPage() {
  const [formData, setFormData] = useState({ position: '', company: '', resumeText: '' })
  const [result, setResult] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const { usage, decrementUsage } = useAIUsage()
  const handleGenerate = async () => {
    if (!formData.position) {
      toast.error('Position is required')
      return
    }
    setIsLoading(true)
    setResult(null)
    try {
      const res = await aiService.generateInterviewQuestions(formData)
      setResult(res.data)
      decrementUsage() // update counter
      toast.success('Questions generated!')
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

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto space-y-6">

        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <MessageSquare className="w-6 h-6 text-blue-600" />
            Interview Prep  <AIUsageBadge usage={usage} />
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            AI-generated questions tailored to your role and resume
          </p>
        </div>

        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Position *</label>
              <input
                value={formData.position}
                onChange={e => setFormData(p => ({ ...p, position: e.target.value }))}
                placeholder="Software Engineer Intern"
                className="w-full px-4 py-2.5 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Company</label>
              <input
                value={formData.company}
                onChange={e => setFormData(p => ({ ...p, company: e.target.value }))}
                placeholder="Google (optional)"
                className="w-full px-4 py-2.5 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Resume (optional — improves relevance)</label>
            <textarea
              value={formData.resumeText}
              onChange={e => setFormData(p => ({ ...p, resumeText: e.target.value }))}
              placeholder="Paste your resume for more personalized questions..."
              rows={4}
              className="w-full px-4 py-3 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>
          <button
            onClick={handleGenerate}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-3 rounded-lg transition-colors text-sm cursor-pointer disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Generating Questions...</>
            ) : (
              <><Sparkles className="w-4 h-4" /> Generate Interview Questions</>
            )}
          </button>
        </div>

        <AnimatePresence>
          {result && !isLoading && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">

              {/* HR Questions */}
              <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-5">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 bg-purple-500 rounded-full" />
                  HR & Behavioral Questions
                </h3>
                <div className="space-y-2">
                  {result.hrQuestions?.map((q, i) => (
                    <QuestionCard key={i} question={q.question} tip={q.tip} index={i} />
                  ))}
                </div>
              </div>

              {/* Technical Questions */}
              <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-5">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full" />
                  Technical Questions
                </h3>
                <div className="space-y-2">
                  {result.technicalQuestions?.map((q, i) => (
                    <QuestionCard key={i} question={q.question} tip={q.tip} index={i} />
                  ))}
                </div>
              </div>

              {/* Questions to Ask */}
              <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-5">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full" />
                  Questions to Ask the Interviewer
                </h3>
                <ul className="space-y-2">
                  {result.questionsToAsk?.map((q, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <span className="text-green-500 mt-0.5">→</span>
                      {q}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Preparation Tips */}
              <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-xl p-5">
                <h3 className="font-semibold text-blue-900 dark:text-blue-300 mb-3">
                  Preparation Checklist
                </h3>
                <ul className="space-y-2">
                  {result.preparation?.map((tip, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-blue-800 dark:text-blue-300">
                      <span className="mt-0.5">☐</span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>

            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  )
}
