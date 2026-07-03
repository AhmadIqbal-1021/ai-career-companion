// client/src/pages/ApplicationsPage.jsx

import { useState } from 'react'
import { Plus } from 'lucide-react'
import DashboardLayout from '../layouts/DashboardLayout'
import ApplicationsTable from '../components/dashboard/ApplicationsTable'
import ApplicationModal from '../components/dashboard/ApplicationModal'
import { useApplications } from '../hooks/useApplications.jsx'

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
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
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