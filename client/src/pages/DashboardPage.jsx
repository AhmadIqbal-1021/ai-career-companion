// client/src/pages/DashboardPage.jsx

import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Plus, ArrowRight, TrendingUp ,Sun } from 'lucide-react'
import DashboardLayout from '../layouts/DashboardLayout'
import StatsCards from '../components/dashboard/StatsCards'
import StatusDonutChart from '../components/dashboard/StatusDonutChart'
import TimelineChart from '../components/dashboard/TimelineChart'
import FunnelChart from '../components/dashboard/FunnelChart'
import ApplicationModal from '../components/dashboard/ApplicationModal'
import { useApplications } from '../hooks/useApplications.jsx'
import { applicationService } from '../services/applicationService'
import { useAuth } from '../context/AuthContext'
import SEO from '../components/SEO'
import { StatCardSkeleton, ChartSkeleton, TableRowSkeleton } from '../components/ui/Skeleton'


export default function DashboardPage() {
  const { user } = useAuth()
  const {
    applications,
    stats,
    isLoading,
    createApplication,
  } = useApplications()

  const [modalOpen, setModalOpen] = useState(false)
  const [chartData, setChartData] = useState(null)

  // Fetch chart data separately
  useEffect(() => {
    applicationService.getChartData()
      .then(res => setChartData(res.data))
      .catch(() => {})
  }, [applications]) // refetch when applications change

  const handleSubmit = async (formData) => {
    await createApplication(formData)
    // Refetch chart data after adding application
  applicationService.getChartData()
    .then(res => setChartData(res.data))
    .catch(() => {})
  }

  const recentApplications = applications.slice(0, 5)

  const STATUS_STYLES = {
    saved:     'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400',
    applied:   'bg-blue-100 dark:bg-blue-950/50 text-blue-700 dark:text-blue-400',
    interview: 'bg-yellow-100 dark:bg-yellow-950/50 text-yellow-700 dark:text-yellow-400',
    offer:     'bg-green-100 dark:bg-green-950/50 text-green-700 dark:text-green-400',
    rejected:  'bg-red-100 dark:bg-red-950/50 text-red-700 dark:text-red-400',
  }
if (isLoading) {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header skeleton */}
        <div className="flex items-center justify-between">
          <div>
            <div className="w-48 h-7 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse mb-2" />
            <div className="w-32 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          </div>
        </div>

        {/* Stats skeleton */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[...Array(6)].map((_, i) => <StatCardSkeleton key={i} />)}
        </div>

        {/* Charts skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => <ChartSkeleton key={i} />)}
        </div>

        {/* Table skeleton */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800">
            <div className="w-32 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          </div>
          {[...Array(4)].map((_, i) => <TableRowSkeleton key={i} />)}
        </div>
      </div>
    </DashboardLayout>
  )
}

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <SEO title="Dashboard" />

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
              
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Good morning, {user?.name?.split(' ')[0]} 
              <Sun className="inline ml-1 w-8 h-7 -translate-y-0.5 text-amber-500" />
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
              Here is your job search overview
            </p>
          </div>
          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-colors shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Add Application
          </button>
        </div>

        {/* Stats */}
        <StatsCards stats={stats} />

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

          {/* Donut Chart */}
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-5">
            <h2 className="font-semibold text-gray-900 dark:text-white text-sm mb-4 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-blue-600" />
              Status Breakdown
            </h2>
            <StatusDonutChart data={chartData?.statusData} />
          </div>

          {/* Timeline Chart */}
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-5">
            <h2 className="font-semibold text-gray-900 dark:text-white text-sm mb-4 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-blue-600" />
              Applications Over Time
            </h2>
            <TimelineChart data={chartData?.timelineData} />
          </div>

          {/* Funnel Chart */}
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-5">
            <h2 className="font-semibold text-gray-900 dark:text-white text-sm mb-4 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-blue-600" />
              Hiring Funnel
            </h2>
            <FunnelChart stats={stats} />
          </div>
        </div>

        {/* Recent Applications */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-800">
            <h2 className="font-semibold text-gray-900 dark:text-white text-sm">
              Recent Applications
            </h2>
            <Link
              to="/dashboard/applications"
              className="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
            >
              View all
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {recentApplications.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                No applications yet
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 mb-4">
                Start tracking your job search
              </p>
              <button
                onClick={() => setModalOpen(true)}
                className="text-sm text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
              >
                Add your first application
              </button>
            </div>
          )}

          {recentApplications.length > 0 && (
            <div className="divide-y divide-gray-100 dark:divide-gray-800">
              {recentApplications.map(app => (
                <div key={app.id} className="flex items-center justify-between px-5 py-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {app.company}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {app.position}
                    </p>
                  </div>
                  <span className={`ml-3 px-2.5 py-0.5 rounded-full text-xs font-medium capitalize flex-shrink-0 ${STATUS_STYLES[app.status]}`}>
                    {app.status}
                  </span>
                </div>
              ))}
            </div>
          )}

          {applications.length > 5 && (
            <div className="px-5 py-3 border-t border-gray-100 dark:border-gray-800">
              <Link
                to="/dashboard/applications"
                className="text-xs text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
              >
                View all {applications.length} applications →
              </Link>
            </div>
          )}
        </div>

      </div>

      <ApplicationModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        editData={null}
      />
    </DashboardLayout>
  )
}