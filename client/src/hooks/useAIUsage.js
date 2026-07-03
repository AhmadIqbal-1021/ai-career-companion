// client/src/hooks/useAIUsage.js

// What is this file?
// Fetches and exposes the user's current AI usage for the day.
// Any AI page can call this to show remaining requests.

import { useState, useEffect } from 'react'
import API from '../services/authService'

export function useAIUsage() {
  const [usage, setUsage] = useState(null)

  useEffect(() => {
    API.get('/ai/usage')
      .then(res => setUsage(res.data))
      .catch(() => {})
  }, [])

  // Call this after every successful AI request to update the counter
  const decrementUsage = () => {
    setUsage(prev => prev ? { ...prev, remaining: prev.remaining - 1, used: prev.used + 1 } : prev)
  }

  return { usage, decrementUsage }
}