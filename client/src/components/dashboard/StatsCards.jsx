// client/src/components/dashboard/StatsCards.jsx

import { motion } from 'framer-motion'
import { Briefcase, MessageSquare, XCircle, Trophy, TrendingUp, Bookmark } from 'lucide-react'

const statConfig = [
  { key: 'total', label: 'Total', icon: Briefcase, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-950/40' },
  { key: 'applied', label: 'Applied', icon: TrendingUp, color: 'text-purple-600', bg: 'bg-purple-50 dark:bg-purple-950/40' },
  { key: 'interviews', label: 'Interviews', icon: MessageSquare, color: 'text-yellow-600', bg: 'bg-yellow-50 dark:bg-yellow-950/40' },
  { key: 'offers', label: 'Offers', icon: Trophy, color: 'text-green-600', bg: 'bg-green-50 dark:bg-green-950/40' },
  { key: 'rejections', label: 'Rejections', icon: XCircle, color: 'text-red-600', bg: 'bg-red-50 dark:bg-red-950/40' },
  { key: 'saved', label: 'Saved', icon: Bookmark, color: 'text-gray-600', bg: 'bg-gray-100 dark:bg-gray-800' },
]

export default function StatsCards({ stats }) {
  if (!stats) return null

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {statConfig.map((config, index) => {
        const Icon = config.icon
        return (
          <motion.div
            key={config.key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4"
          >
            <div className={`w-8 h-8 ${config.bg} rounded-lg flex items-center justify-center mb-3`}>
              <Icon className={`w-4 h-4 ${config.color}`} />
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {stats[config.key] || 0}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              {config.label}
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}