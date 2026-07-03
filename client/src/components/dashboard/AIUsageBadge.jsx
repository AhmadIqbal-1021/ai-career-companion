
// client/src/components/dashboard/AIUsageBadge.jsx

// What is this file?
// A small badge shown on every AI page displaying how many
// requests the user has left today. Transparent about limits = good UX.

import { Sparkles } from 'lucide-react'

export default function AIUsageBadge({ usage }) {
  if (!usage) return null

  const percentage = (usage.remaining / usage.limit) * 100
  const color = percentage > 50
    ? 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800'
    : percentage > 20
    ? 'text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-950/30 border-yellow-200 dark:border-yellow-800'
    : 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800'

  return (
    <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${color}`}>
      <Sparkles className="w-3 h-3" />
      {usage.remaining} AI requests left today
    </div>
  )
}