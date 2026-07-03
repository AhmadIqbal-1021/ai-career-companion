// client/src/components/dashboard/ApplicationModal.jsx

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Loader2 } from 'lucide-react'

const STATUS_OPTIONS = [
  { value: 'saved', label: 'Saved', color: 'bg-gray-100 text-gray-700' },
  { value: 'applied', label: 'Applied', color: 'bg-blue-100 text-blue-700' },
  { value: 'interview', label: 'Interview', color: 'bg-yellow-100 text-yellow-700' },
  { value: 'offer', label: 'Offer', color: 'bg-green-100 text-green-700' },
  { value: 'rejected', label: 'Rejected', color: 'bg-red-100 text-red-700' },
]

const EMPTY_FORM = {
  company: '', position: '', location: '',
  salary: '', status: 'saved', notes: '',
  application_date: '', job_url: ''
}

export default function ApplicationModal({ isOpen, onClose, onSubmit, editData }) {
  const [formData, setFormData] = useState(EMPTY_FORM)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (editData) {
      setFormData({
        company: editData.company || '',
        position: editData.position || '',
        location: editData.location || '',
        salary: editData.salary || '',
        status: editData.status || 'saved',
        notes: editData.notes || '',
        application_date: editData.application_date?.split('T')[0] || '',
        job_url: editData.job_url || '',
      })
    } else {
      setFormData(EMPTY_FORM)
    }
  }, [editData, isOpen])

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      await onSubmit(formData)
      onClose()
    } catch (err) {
      // Error handled in hook
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm cursor-pointer"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-lg bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800 overflow-hidden"
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-800">
              <h2 className="font-semibold text-gray-900 dark:text-white">
                {editData ? 'Edit Application' : 'Add Application'}
              </h2>
              <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 transition-colors cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">

              {/* Status Pills */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Status</label>
                <div className="flex flex-wrap gap-2">
                  {STATUS_OPTIONS.map(opt => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, status: opt.value }))}
                      className={`px-3 py-1 rounded-full text-xs font-medium transition-all cursor-pointer
                        ${formData.status === opt.value
                          ? opt.color + ' ring-2 ring-offset-1 ring-blue-500'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-500'}`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Company + Position */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Company *</label>
                  <input
                    name="company" value={formData.company} onChange={handleChange}
                    placeholder="Google" required
                    className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Position *</label>
                  <input
                    name="position" value={formData.position} onChange={handleChange}
                    placeholder="Software Engineer" required
                    className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Location + Salary */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Location</label>
                  <input
                    name="location" value={formData.location} onChange={handleChange}
                    placeholder="Remote / Lahore"
                    className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Salary</label>
                  <input
                    name="salary" value={formData.salary} onChange={handleChange}
                    placeholder="PKR 80,000"
                    className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Date + URL */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Date Applied</label>
                  <input
                    type="date" name="application_date"
                    value={formData.application_date} onChange={handleChange}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Job URL</label>
                  <input
                    name="job_url" value={formData.job_url} onChange={handleChange}
                    placeholder="linkedin.com/..."
                    className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Notes</label>
                <textarea
                  name="notes" value={formData.notes} onChange={handleChange}
                  placeholder="Recruiter name, interview notes, follow-up reminders..."
                  rows={3}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm cursor-pointer disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</>
                ) : (
                  editData ? 'Save Changes' : 'Add Application'
                )}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
