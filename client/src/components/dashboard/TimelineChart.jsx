// client/src/components/dashboard/TimelineChart.jsx

// What is this file?
// An area chart showing applications added per week over the last 8 weeks.
// Area charts are great for showing trends over time.

import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer
} from 'recharts'

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 shadow-lg">
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Week of {label}</p>
        <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
          {payload[0].value} applications
        </p>
      </div>
    )
  }
  return null
}

export default function TimelineChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-gray-400 dark:text-gray-500 text-sm">
        No data yet — add applications to see timeline
      </div>
    )
  }

  // Transform data — ensure count is a number not a string
  const chartData = data.map(row => ({
    week: row.week,
    count: parseInt(row.count)
  }))

  return (
    <ResponsiveContainer width="100%" height={220}>
      <AreaChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
        {/* Gradient fill definition */}
        <defs>
          <linearGradient id="blueGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
          </linearGradient>
        </defs>

        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />

        <XAxis
          dataKey="week"
          tick={{ fontSize: 11, fill: '#9CA3AF' }}
          axisLine={false}
          tickLine={false}
        />

        <YAxis
          allowDecimals={false}
          tick={{ fontSize: 11, fill: '#9CA3AF' }}
          axisLine={false}
          tickLine={false}
        />

        <Tooltip content={<CustomTooltip />} />

        <Area
          type="monotone"
          dataKey="count"
          stroke="#3B82F6"
          strokeWidth={2}
          fill="url(#blueGradient)"
          dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
          activeDot={{ r: 6 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}