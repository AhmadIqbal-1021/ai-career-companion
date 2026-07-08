// client/src/pages/DiscoveryBoardPage.jsx

import { useState } from 'react'
import { Plus, Bookmark, Search } from 'lucide-react'
import DashboardLayout from '../layouts/DashboardLayout'
import DiscoveryCard from '../components/dashboard/DiscoveryCard'
import DiscoveryModal from '../components/dashboard/DiscoveryModal'
import { useDiscoveries } from '../hooks/useDiscoveries'
import SEO from '../components/SEO'
import { DiscoveryCardSkeleton } from '../components/ui/Skeleton'


const STATUS_FILTERS = ['all', 'saved', 'applied', 'expired']

// What is this function?
// Computes the REAL status of a discovery based on its deadline date,
// instead of trusting only the manually saved 'status' field.
// This is the single source of truth used for both display AND filtering,
// so the "Expired" filter actually works correctly.
const getEffectiveStatus = (discovery) => {
  if (discovery.status === 'applied') return 'applied'

  if (discovery.deadline) {
    const deadlinePassed = new Date(discovery.deadline) < new Date(new Date().toDateString())
    if (deadlinePassed) return 'expired'
  }

  return discovery.status || 'saved'
}

export default function DiscoveryBoardPage() {
  const { discoveries, isLoading, createDiscovery, updateDiscovery, deleteDiscovery } = useDiscoveries()

  const [modalOpen, setModalOpen] = useState(false)
  const [editData, setEditData] = useState(null)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const handleEdit = (item) => {
    setEditData(item)
    setModalOpen(true)
  }

  const handleClose = () => {
    setModalOpen(false)
    setEditData(null)
  }

  const handleSubmit = async (formData) => {
    if (editData) {
      await updateDiscovery(editData.id, formData)
    } else {
      await createDiscovery(formData)
    }
  }

  const handleDelete = async (id) => {
   
      await deleteDiscovery(id)
    
  }

  // Derived filtering — now uses effective status (deadline-aware), not raw DB status
  const filtered = discoveries.filter(d => {
    const matchesSearch =
      d.title.toLowerCase().includes(search.toLowerCase()) ||
      d.company.toLowerCase().includes(search.toLowerCase())

    const effectiveStatus = getEffectiveStatus(d)
    const matchesStatus = statusFilter === 'all' || effectiveStatus === statusFilter

    return matchesSearch && matchesStatus
  })

  // Stats — also computed using effective status for consistency
  const stats = {
    total: discoveries.length,
    saved: discoveries.filter(d => getEffectiveStatus(d) === 'saved').length,
    applied: discoveries.filter(d => getEffectiveStatus(d) === 'applied').length,
    deadlineSoon: discoveries.filter(d => {
      if (!d.deadline) return false
      const days = Math.ceil((new Date(d.deadline) - new Date()) / (1000 * 60 * 60 * 24))
      return days <= 7 && days >= 0
    }).length,
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <SEO title="Discovery Board" description="Save and track internship opportunities from LinkedIn, WhatsApp, and company websites" />

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Bookmark className="w-6 h-6 text-blue-600" />
              Internship Discovery Board
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
              Save internships from LinkedIn, WhatsApp, and anywhere else
            </p>
          </div>
          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-colors shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Save Internship
          </button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Saved', value: stats.total, color: 'text-gray-900 dark:text-white' },
            { label: 'To Apply', value: stats.saved, color: 'text-blue-600 dark:text-blue-400' },
            { label: 'Applied', value: stats.applied, color: 'text-green-600 dark:text-green-400' },
            { label: 'Deadline Soon', value: stats.deadlineSoon, color: 'text-orange-600 dark:text-orange-400' },
          ].map(stat => (
            <div key={stat.label} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4">
              <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4 space-y-3">

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by role or company..."
              className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Status filters */}
          <div className="flex flex-wrap gap-2">
            {STATUS_FILTERS.map(f => (
              <button
                key={f}
                onClick={() => setStatusFilter(f)}
                className={`px-3 py-1 rounded-full text-xs font-medium capitalize transition-colors cursor-pointer ${
                  statusFilter === f
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Loading */}
        
          
          {isLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => <DiscoveryCardSkeleton key={i} />)}
            </div>
          )}

        {/* Empty State */}
        {!isLoading && filtered.length === 0 && (
          <div className="text-center py-16 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl">
            <Bookmark className="w-12 h-12 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
            <p className="font-medium text-gray-900 dark:text-white mb-1">
              {discoveries.length === 0 ? 'No internships saved yet' : 'No results found'}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              {discoveries.length === 0
                ? 'Save internships from LinkedIn, WhatsApp groups, and company websites'
                : 'Try a different search or filter'
              }
            </p>
            {discoveries.length === 0 && (
              <button
                onClick={() => setModalOpen(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-6 py-2.5 rounded-lg transition-colors cursor-pointer"
              >
                Save Your First Internship
              </button>
            )}
          </div>
        )}

        {/* Cards Grid */}
        {!isLoading && filtered.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((discovery, index) => (
              <DiscoveryCard
                key={discovery.id}
                discovery={discovery}
                onEdit={handleEdit}
                onDelete={handleDelete}
                index={index}
              />
            ))}
          </div>
        )}

      </div>

      <DiscoveryModal
        isOpen={modalOpen}
        onClose={handleClose}
        onSubmit={handleSubmit}
        editData={editData}
      />
    </DashboardLayout>
  )
}
