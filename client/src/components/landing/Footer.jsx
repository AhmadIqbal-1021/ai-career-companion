// client/src/components/landing/Footer.jsx

import { Briefcase } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-gray-950 
                       border-t border-gray-200 dark:border-gray-800 
                       py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center">
              <Briefcase className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-bold text-gray-900 dark:text-white">CareerAI</span>
          </div>

          <p className="text-sm text-gray-400 dark:text-gray-500">
            © {new Date().getFullYear()} CareerAI. Built for students, by a student.
          </p>

          <div className="flex items-center gap-6 text-sm text-gray-500 dark:text-gray-400">
            <a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Contact</a>
          </div>
        </div>
      </div>
    </footer>
  )
}