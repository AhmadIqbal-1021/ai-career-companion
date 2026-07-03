// client/src/layouts/DashboardLayout.jsx

import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
   LogOut, 
  Menu, X, User
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useDarkMode } from '../hooks/useDarkMode'
import { Sun, Moon } from 'lucide-react'


import { LayoutDashboard, Briefcase, FileText, Mail, MessageSquare, Bookmark } from 'lucide-react'

const navItems = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Applications', href: '/dashboard/applications', icon: Briefcase },
  { label: 'Discovery Board', href: '/dashboard/discoveries', icon: Bookmark },
  { label: 'Resume Analyzer', href: '/dashboard/resume-analyzer', icon: FileText },
  { label: 'Cover Letter', href: '/dashboard/cover-letter', icon: Mail },
  { label: 'Interview Prep', href: '/dashboard/interview-prep', icon: MessageSquare },
]

export default function DashboardLayout({ children }) {
  const { user, logout } = useAuth()
  const { isDark, toggle } = useDarkMode()
  const navigate = useNavigate()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  const Sidebar = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-2 px-4 py-5 border-b border-gray-200 dark:border-gray-800">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
          <Briefcase className="w-4 h-4 text-white" />
        </div>
        <span className="font-bold text-gray-900 dark:text-white">CareerAI</span>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map(item => {
          const Icon = item.icon
          const isActive = location.pathname === item.href
          return (
            <Link
              key={item.href}
              to={item.href}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-200
                ${isActive 
                  ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400' 
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
                }`}
            >
              <Icon className="w-4 h-4" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* Bottom — User + Actions */}
      <div className="px-3 py-4 border-t border-gray-200 dark:border-gray-800 space-y-1">
        <button
          onClick={toggle}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          {isDark ? 'Light Mode' : 'Dark Mode'}
        </button>

        <div className="flex items-center gap-3 px-3 py-2.5">
          <div className="w-7 h-7 bg-blue-600 rounded-full flex items-center justify-center">
            <User className="w-3.5 h-3.5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{user?.name}</p>
            <p className="text-xs text-gray-400 truncate">{user?.email}</p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-600 dark:text-gray-400 hover:bg-red-50 dark:hover:bg-red-950/30 hover:text-red-600 dark:hover:text-red-400 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </div>
  )

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-950 overflow-hidden">

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-60 border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 flex-shrink-0">
        <Sidebar />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <motion.aside
            initial={{ x: -240 }}
            animate={{ x: 0 }}
            className="absolute left-0 top-0 bottom-0 w-60 bg-white dark:bg-gray-900 z-50"
          >
            <Sidebar />
          </motion.aside>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Mobile Topbar */}
        <header className="md:hidden flex items-center justify-between px-4 py-3 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
          <button onClick={() => setSidebarOpen(true)}>
            <Menu className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
          <span className="font-bold text-gray-900 dark:text-white">CareerAI</span>
          <div className="w-5" />
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}