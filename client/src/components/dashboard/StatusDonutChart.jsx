// client/src/components/dashboard/StatusDonutChart.jsx

// What is this file?
// A donut chart showing the breakdown of application statuses.
// Uses Recharts PieChart with innerRadius to create the donut hole effect.

import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const STATUS_COLORS = {
  saved:     '#6B7280',
  applied:   '#3B82F6',
  interview: '#F59E0B',
  offer:     '#10B981',
  rejected:  '#EF4444',
}

const STATUS_LABELS = {
  saved:     'Saved',
  applied:   'Applied',
  interview: 'Interview',
  offer:     'Offer',
  rejected:  'Rejected',
}

// Custom tooltip that appears when hovering over a slice
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 shadow-lg">
        <p className="text-sm font-medium text-gray-900 dark:text-white">
          {STATUS_LABELS[payload[0].name] || payload[0].name}
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {payload[0].value} applications
        </p>
      </div>
    )
  }
  return null
}

export default function StatusDonutChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-gray-400 dark:text-gray-500 text-sm">
        No data yet — add applications to see chart
      </div>
    )
  }

  // Transform database rows into recharts format
  const chartData = data.map(row => ({
    name: row.status,
    value: parseInt(row.count),
    color: STATUS_COLORS[row.status] || '#6B7280'
  }))

  return (
    <ResponsiveContainer width="100%" height={220}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          innerRadius={55}   // innerRadius creates the donut hole
          outerRadius={85}
          paddingAngle={3}   // small gap between slices
          dataKey="value"
        >
          {chartData.map((entry, index) => (
            <Cell key={index} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend
          formatter={(value) => STATUS_LABELS[value] || value}
          iconType="circle"
          iconSize={8}
          wrapperStyle={{ fontSize: '12px' }}
        />
      </PieChart>
    </ResponsiveContainer>
  )
}