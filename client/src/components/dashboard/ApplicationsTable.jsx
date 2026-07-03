// client/src/components/dashboard/ApplicationsTable.jsx

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Edit2, Trash2, ExternalLink, Search } from 'lucide-react'

const STATUS_STYLES = {
  saved:      'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400',
  applied:    'bg-blue-100 dark:bg-blue-950/50 text-blue-700 dark:text-blue-400',
  interview:  'bg-yellow-100 dark:bg-yellow-950/50 text-yellow-700 dark:text-yellow-400',
  offer:      'bg-green-100 dark:bg-green-950/50 text-green-700 dark:text-green-400',
  rejected:   'bg-red-100 dark:bg-red-950/50 text-red-700 dark:text-red-400',
}

export default function ApplicationsTable({ applications, onEdit, onDelete }) {
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')

  // Derived state — no useState needed for filtered list
  const filtered = applications.filter(app => {
    const matchesSearch = 
      app.company.toLowerCase().includes(search.toLowerCase()) ||
      app.position.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = filterStatus === 'all' || app.status === filterStatus
    return matchesSearch && matchesStatus
  })

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden">

      {/* Toolbar */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search company or position..."
            className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value)}
          className="px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Status</option>
          <option value="saved">Saved</option>
          <option value="applied">Applied</option>
          <option value="interview">Interview</option>
          <option value="offer">Offer</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {/* Empty State */}
      {filtered.length === 0 && (
        <div className="text-center py-16">
          <div className="text-4xl mb-3">📋</div>
          <p className="text-gray-500 dark:text-gray-400 font-medium">
            {applications.length === 0 ? 'No applications yet' : 'No results found'}
          </p>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
            {applications.length === 0 ? 'Add your first application to get started' : 'Try a different search or filter'}
          </p>
        </div>
      )}

      {/* Table */}
      {filtered.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-800">
                {['Company', 'Position', 'Location', 'Status', 'Date', 'Actions'].map(h => (
                  <th key={h} className="text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider px-4 py-3">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {filtered.map((app, index) => (
                <motion.tr
                  key={app.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.03 }}
                  className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                >
                  <td className="px-4 py-3">
                    <div className="font-medium text-sm text-gray-900 dark:text-white">{app.company}</div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{app.position}</td>
                  <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-500">{app.location || '—'}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${STATUS_STYLES[app.status]}`}>
                      {app.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-500">
                    {app.application_date 
                      ? new Date(app.application_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                      : '—'}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      {app.job_url && (
                        <a href={app.job_url} target="_blank" rel="noopener noreferrer"
                          className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/30 rounded-lg transition-colors">
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                      <button onClick={() => onEdit(app)}
                        className="p-1.5 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => onDelete(app.id)}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}