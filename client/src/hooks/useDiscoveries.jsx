// client/src/hooks/useDiscoveries.jsx

import { useState, useEffect, useCallback } from 'react'
import { discoveriesService } from '../services/discoveriesService'
import toast from 'react-hot-toast'

export function useDiscoveries() {
  const [discoveries, setDiscoveries] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchDiscoveries = useCallback(async () => {
    try {
      setIsLoading(true)
      const res = await discoveriesService.getAll()
      setDiscoveries(res.data.discoveries)
    } catch (err) {
      toast.error('Failed to load discoveries')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchDiscoveries()
  }, [fetchDiscoveries])

  const createDiscovery = async (data) => {
    try {
      const res = await discoveriesService.create(data)
      setDiscoveries(prev => [res.data.discovery, ...prev])
      toast.success('Internship saved!')
      return res.data.discovery
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save')
      throw err
    }
  }

  const updateDiscovery = async (id, data) => {
    const previous = discoveries
    setDiscoveries(prev =>
      prev.map(d => d.id === id ? { ...d, ...data } : d)
    )
    try {
      const res = await discoveriesService.update(id, data)
      setDiscoveries(prev =>
        prev.map(d => d.id === id ? res.data.discovery : d)
      )
      toast.success('Updated!')
    } catch (err) {
      setDiscoveries(previous)
      toast.error('Failed to update')
      throw err
    }
  }

  // Replace deleteDiscovery with:
const deleteDiscovery = async (id) => {
  const deletedItem = discoveries.find(d => d.id === id)
  setDiscoveries(prev => prev.filter(d => d.id !== id))

  let undone = false

  toast(
    (t) => (
      <div className="flex items-center gap-3">
        <span className="text-sm">Internship removed</span>
        <button
          onClick={() => {
            undone = true
            setDiscoveries(prev => [deletedItem, ...prev])
            toast.dismiss(t.id)
          }}
          className="text-blue-600 font-medium text-sm hover:underline cursor-pointer"
        >
          Undo
        </button>
      </div>
    ),
    { duration: 5000 }
  )

  setTimeout(async () => {
    if (!undone) {
      try {
        await discoveriesService.delete(id)
      } catch (err) {
        setDiscoveries(prev => [deletedItem, ...prev])
        toast.error('Failed to remove internship')
      }
    }
  }, 5000)
}
  return {
    discoveries,
    isLoading,
    createDiscovery,
    updateDiscovery,
    deleteDiscovery,
    refetch: fetchDiscoveries,
  }
}   