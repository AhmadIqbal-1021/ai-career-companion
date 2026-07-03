// client/src/components/dashboard/DiscoveryCard.jsx

import { motion } from 'framer-motion'
import {
  ExternalLink, Edit2, Trash2, MapPin, Calendar, Wifi,
  BriefcaseBusiness, MessageCircle, Globe, Briefcase, ClipboardList, Link2
} from 'lucide-react'

const SOURCE_LABELS = {
  linkedin: { label: 'LinkedIn', Icon: BriefcaseBusiness, color: 'bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400' },
  whatsapp: { label: 'WhatsApp', Icon: MessageCircle, color: 'bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-400' },
  company_website: { label: 'Company', Icon: Globe, color: 'bg-purple-50 dark:bg-purple-950/30 text-purple-700 dark:text-purple-400' },
  rozee: { label: 'Rozee.pk', Icon: Briefcase, color: 'bg-orange-50 dark:bg-orange-950/30 text-orange-700 dark:text-orange-400' },
  mustakbil: { label: 'Mustakbil', Icon: ClipboardList, color: 'bg-yellow-50 dark:bg-yellow-950/30 text-yellow-700 dark:text-yellow-400' },
  other: { label: 'Other', Icon: Link2, color: 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400' },
}

const STATUS_STYLES = {
  saved: 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400',
  applied: 'bg-blue-100 dark:bg-blue-950/50 text-blue-700 dark:text-blue-400',
  expired: 'bg-red-100 dark:bg-red-950/50 text-red-700 dark:text-red-400',
}

// Computes whether deadline is approaching (within 7 days)
const isDeadlineSoon = (deadline) => {
  if (!deadline) return false
  const days = Math.ceil((new Date(deadline) - new Date()) / (1000 * 60 * 60 * 24))
  return days <= 7 && days >= 0
}

// Computes whether deadline has already passed
// This is the SOURCE OF TRUTH for expired status — not a manually saved field
const isDeadlinePassed = (deadline) => {
  if (!deadline) return false
  return new Date(deadline) < new Date(new Date().toDateString())
}

export default function DiscoveryCard({ discovery, onEdit, onDelete, index }) {
  const source = SOURCE_LABELS[discovery.source] || SOURCE_LABELS.other
  const SourceIcon = source.Icon
  const deadlineSoon = isDeadlineSoon(discovery.deadline)
  const deadlinePassed = isDeadlinePassed(discovery.deadline)

  // Effective status — if deadline has passed and user hasn't applied, treat as expired visually
  const effectiveStatus = (deadlinePassed && discovery.status === 'saved') ? 'expired' : discovery.status

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      whileHover={{ y: -2 }}
      className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-5 hover:shadow-md dark:hover:shadow-gray-900/50 transition-all duration-200"
    >
      {/* Top Row */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 dark:text-white text-sm truncate">
            {discovery.title}
          </h3>
          <p className="text-gray-500 dark:text-gray-400 text-xs mt-0.5">
            {discovery.company}
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 flex-shrink-0">
          {discovery.url && (
            <a
              href={discovery.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/30 rounded-lg transition-colors cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
          <button
            onClick={() => onEdit(discovery)}
            className="p-1.5 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors cursor-pointer"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onDelete(discovery.id)}
            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Tags Row */}
      <div className="flex flex-wrap items-center gap-2 mb-3">
        {/* Source Badge */}
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${source.color}`}>
          <SourceIcon className="w-3 h-3" />
          {source.label}
        </span>

        {/* Status Badge — uses effectiveStatus so expired shows correctly */}
        <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${STATUS_STYLES[effectiveStatus]}`}>
          {effectiveStatus}
        </span>

        {/* Remote Badge */}
        {discovery.is_remote && (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-teal-50 dark:bg-teal-950/30 text-teal-700 dark:text-teal-400">
            <Wifi className="w-3 h-3" /> Remote
          </span>
        )}
      </div>

      {/* Bottom Row */}
      <div className="flex items-center gap-4 text-xs text-gray-400 dark:text-gray-500">
        {discovery.location && (
          <span className="flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            {discovery.location}
          </span>
        )}

        {discovery.deadline && (
          <span className={`flex items-center gap-1 font-medium ${
            deadlinePassed ? 'text-red-500' :
            deadlineSoon ? 'text-orange-500' :
            'text-gray-400 dark:text-gray-500'
          }`}>
            <Calendar className="w-3 h-3" />
            {deadlinePassed ? 'Expired: ' : deadlineSoon ? 'Soon: ' : ''}
            {new Date(discovery.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </span>
        )}
      </div>

      {/* Notes preview */}
      {discovery.notes && (
        <p className="mt-3 text-xs text-gray-400 dark:text-gray-500 line-clamp-2 border-t border-gray-100 dark:border-gray-800 pt-2">
          {discovery.notes}
        </p>
      )}
    </motion.div>
  )
}
