// client/src/hooks/useDarkMode.js

// What is this file?
// A custom React hook that manages dark mode state.
// Hooks are reusable logic — any component can call useDarkMode()
// and get the current theme + a function to toggle it.

import { useState, useEffect } from 'react'

export function useDarkMode() {
  // Initialize state from localStorage, defaulting to light mode
  const [isDark, setIsDark] = useState(() => {
    // This function runs ONCE on mount to get the saved preference
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark'
    }
    return false
  })

  useEffect(() => {
    const root = document.documentElement // This is the <html> element

    if (isDark) {
      root.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      root.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }, [isDark]) // Runs every time isDark changes

  const toggle = () => setIsDark(prev => !prev)

  return { isDark, toggle }
}