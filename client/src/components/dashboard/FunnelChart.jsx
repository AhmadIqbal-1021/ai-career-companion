// client/src/components/dashboard/FunnelChart.jsx

// What is this file?
// A horizontal bar chart showing the application funnel:
// Applied → Interview → Offer
// Shows conversion at each stage of the hiring process.

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell
} from 'recharts'

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 shadow-lg">
        <p className="text-sm font-medium text-gray-900 dark:text-white">{label}</p>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {payload[0].value} applications
        </p>
      </div>
    )
  }
  return null
}

export default function FunnelChart({ stats }) {
  if (!stats) return null

  const data = [
    { stage: 'Applied', value: parseInt(stats.applied) || 0, color: '#3B82F6' },
    { stage: 'Interview', value: parseInt(stats.interviews) || 0, color: '#F59E0B' },
    { stage: 'Offer', value: parseInt(stats.offers) || 0, color: '#10B981' },
  ]

  const isEmpty = data.every(d => d.value === 0)

  if (isEmpty) {
    return (
      <div className="flex items-center justify-center h-48 text-gray-400 dark:text-gray-500 text-sm">
        No pipeline data yet
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart
        data={data}
        margin={{ top: 5, right: 10, left: -20, bottom: 0 }}
        barSize={40}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" horizontal={true} vertical={false} />
        <XAxis
          dataKey="stage"
          tick={{ fontSize: 12, fill: '#9CA3AF' }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          allowDecimals={false}
          tick={{ fontSize: 11, fill: '#9CA3AF' }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} />
        <Bar dataKey="value" radius={[6, 6, 0, 0]}>
          {data.map((entry, index) => (
            <Cell key={index} fill={entry.color} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}