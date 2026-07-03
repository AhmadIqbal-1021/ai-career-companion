// client/src/components/dashboard/DiscoveryModal.jsx

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X, Loader2, BriefcaseBusiness, MessageCircle, Globe,
  Briefcase, ClipboardList, Link2
} from 'lucide-react'

const SOURCE_OPTIONS = [
  { value: 'linkedin', label: 'LinkedIn', Icon: BriefcaseBusiness },
  { value: 'whatsapp', label: 'WhatsApp', Icon: MessageCircle },
  { value: 'company_website', label: 'Company Site', Icon: Globe },
  { value: 'rozee', label: 'Rozee.pk', Icon: Briefcase },
  { value: 'mustakbil', label: 'Mustakbil', Icon: ClipboardList },
  { value: 'other', label: 'Other', Icon: Link2 },
]

const STATUS_OPTIONS = [
  { value: 'saved', label: 'Saved', color: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300' },
  { value: 'applied', label: 'Applied', color: 'bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-400' },
  { value: 'expired', label: 'Expired', color: 'bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-400' },
]

const EMPTY_FORM = {
  title: '', company: '', url: '',
  source: 'linkedin', status: 'saved',
  deadline: '', notes: '', is_remote: false, location: ''
}

export default function DiscoveryModal({ isOpen, onClose, onSubmit, editData }) {
  const [formData, setFormData] = useState(EMPTY_FORM)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (editData) {
      setFormData({
        title: editData.title || '',
        company: editData.company || '',
        url: editData.url || '',
        source: editData.source || 'linkedin',
        status: editData.status || 'saved',
        deadline: editData.deadline?.split('T')[0] || '',
        notes: editData.notes || '',
        is_remote: editData.is_remote || false,
        location: editData.location || '',
      })
    } else {
      setFormData(EMPTY_FORM)
    }
  }, [editData, isOpen])

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setFormData(prev => ({ ...prev, [e.target.name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      await onSubmit(formData)
      onClose()
    } catch (err) {
      // handled in hook
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
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-lg bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-800">
              <h2 className="font-semibold text-gray-900 dark:text-white">
                {editData ? 'Edit Discovery' : 'Save Internship'}
              </h2>
              <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">

              {/* Source Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Where did you find this?
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {SOURCE_OPTIONS.map(opt => {
                    const Icon = opt.Icon
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, source: opt.value }))}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium border transition-all cursor-pointer
                          ${formData.source === opt.value
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400'
                            : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-300'
                          }`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                        {opt.label}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Status</label>
                <div className="flex gap-2">
                  {STATUS_OPTIONS.map(opt => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, status: opt.value }))}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer
                        ${formData.status === opt.value
                          ? opt.color + ' ring-2 ring-offset-1 ring-blue-500'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-500'
                        }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Title + Company */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Role Title *</label>
                  <input
                    name="title" value={formData.title} onChange={handleChange}
                    placeholder="Software Engineer Intern" required
                    className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Company *</label>
                  <input
                    name="company" value={formData.company} onChange={handleChange}
                    placeholder="Google" required
                    className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* URL */}
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Job URL</label>
                <input
                  name="url" value={formData.url} onChange={handleChange}
                  placeholder="https://linkedin.com/jobs/..."
                  className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Location + Deadline */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Location</label>
                  <input
                    name="location" value={formData.location} onChange={handleChange}
                    placeholder="Lahore / Remote"
                    className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Deadline</label>
                  <input
                    type="date" name="deadline"
                    value={formData.deadline} onChange={handleChange}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Remote Toggle */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox" name="is_remote"
                  id="is_remote" checked={formData.is_remote}
                  onChange={handleChange}
                  className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 cursor-pointer"
                />
                <label htmlFor="is_remote" className="text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
                  Remote position
                </label>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Notes</label>
                <textarea
                  name="notes" value={formData.notes} onChange={handleChange}
                  placeholder="Requirements, salary range, referral contact..."
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
                  editData ? 'Save Changes' : 'Save Internship'
                )}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
