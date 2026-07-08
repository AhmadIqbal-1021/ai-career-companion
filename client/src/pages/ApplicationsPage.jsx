// client/src/pages/ApplicationsPage.jsx

import { useState } from 'react'
import { Plus } from 'lucide-react'
import DashboardLayout from '../layouts/DashboardLayout'
import ApplicationsTable from '../components/dashboard/ApplicationsTable'
import ApplicationModal from '../components/dashboard/ApplicationModal'
import { useApplications } from '../hooks/useApplications.jsx'
import SEO from '../components/SEO'
import { TableRowSkeleton } from '../components/ui/Skeleton'

export default function ApplicationsPage() {
  const {
    applications,
    isLoading,
    createApplication,
    updateApplication,
    deleteApplication
  } = useApplications()

  const [modalOpen, setModalOpen] = useState(false)
  const [editData, setEditData] = useState(null)

  const handleEdit = (app) => {
    setEditData(app)
    setModalOpen(true)
  }

  const handleClose = () => {
    setModalOpen(false)
    setEditData(null)
  }

  const handleSubmit = async (formData) => {
    if (editData) {
      await updateApplication(editData.id, formData)
    } else {
      await createApplication(formData)
    }
  }

  const handleDelete = async (id) => {
    await deleteApplication(id)
  }
if (isLoading) {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="w-36 h-7 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse mb-2" />
            <div className="w-48 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden">
          <div className="p-4 border-b border-gray-200 dark:border-gray-800">
            <div className="w-full h-9 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
          </div>
          {[...Array(5)].map((_, i) => <TableRowSkeleton key={i} />)}
        </div>
      </div>
    </DashboardLayout>
  )
}

  return (
    
    <DashboardLayout>
      
      <SEO title="Applications" />  
      <div className="space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Applications
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
              {applications.length} total applications tracked
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

        {/* Full Table */}
        <ApplicationsTable
          applications={applications}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

      </div>

      <ApplicationModal
        isOpen={modalOpen}
        onClose={handleClose}
        onSubmit={handleSubmit}
        editData={editData}
      />
    </DashboardLayout>
  )
}