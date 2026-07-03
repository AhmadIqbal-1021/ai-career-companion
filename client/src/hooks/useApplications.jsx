// client/src/hooks/useApplications.jsx

import { useState, useEffect, useCallback } from 'react'
import { applicationService } from '../services/applicationService'
import toast from 'react-hot-toast'

export function useApplications() {
  const [applications, setApplications] = useState([])
  const [stats, setStats] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchApplications = useCallback(async () => {
    try {
      setIsLoading(true)
      const [appsRes, statsRes] = await Promise.all([
        applicationService.getAll(),
        applicationService.getStats(),
      ])
      // Promise.all runs both requests simultaneously
      // instead of sequentially — cuts loading time in half

      setApplications(appsRes.data.applications)
      setStats(statsRes.data.stats)
    } catch (err) {
      setError('Failed to load applications')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchApplications()
  }, [fetchApplications])

  const createApplication = async (data) => {
    try {
      const res = await applicationService.create(data)
      // Optimistic-style: add to local state immediately after success
      setApplications(prev => [res.data.application, ...prev])
      toast.success('Application added!')
      return res.data.application
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add application')
      throw err
    }
  }

  const updateApplication = async (id, data) => {
    // Optimistic update — update UI before API call
    const previous = applications
    setApplications(prev => 
      prev.map(app => app.id === id ? { ...app, ...data } : app)
    )
    try {
      const res = await applicationService.update(id, data)
      setApplications(prev =>
        prev.map(app => app.id === id ? res.data.application : app)
      )
      toast.success('Application updated!')
    } catch (err) {
      // Revert on failure
      setApplications(previous)
      toast.error('Failed to update application')
      throw err
    }
  }

  const deleteApplication = async (id) => {
    // Optimistic delete
    const previous = applications
    setApplications(prev => prev.filter(app => app.id !== id))
    try {
      await applicationService.delete(id)
      toast.success('Application deleted')
    } catch (err) {
      setApplications(previous)
      toast.error('Failed to delete')
      throw err
    }
  }

  return {
    applications,
    stats,
    isLoading,
    error,
    createApplication,
    updateApplication,
    deleteApplication,
    refetch: fetchApplications,
  }
}