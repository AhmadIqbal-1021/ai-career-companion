// client/src/components/landing/FeaturesSection.jsx

import { motion } from 'framer-motion'
import { 
  LayoutDashboard, FileSearch, Mail, 
  MessageSquare, Bookmark, TrendingUp 
} from 'lucide-react'

const features = [
  {
    icon: LayoutDashboard,
    title: 'Application Tracker',
    description: 'Track every application with status, notes, salary, and deadlines in a clean Kanban-style board.',
    color: 'text-blue-600 dark:text-blue-400',
    bg: 'bg-blue-50 dark:bg-blue-950/50',
  },
  {
    icon: FileSearch,
    title: 'AI Resume Analyzer',
    description: 'Upload your CV and get an ATS score, missing keywords, and actionable improvement suggestions.',
    color: 'text-purple-600 dark:text-purple-400',
    bg: 'bg-purple-50 dark:bg-purple-950/50',
  },
  {
    icon: Mail,
    title: 'Cover Letter Generator',
    description: 'Paste a job description and get a tailored, professional cover letter in seconds.',
    color: 'text-green-600 dark:text-green-400',
    bg: 'bg-green-50 dark:bg-green-950/50',
  },
  {
    icon: MessageSquare,
    title: 'Interview Prep AI',
    description: 'Practice with AI-generated HR and technical questions specific to your target role.',
    color: 'text-orange-600 dark:text-orange-400',
    bg: 'bg-orange-50 dark:bg-orange-950/50',
  },
  {
    icon: Bookmark,
    title: 'Internship Discovery',
    description: 'Save internship links from LinkedIn, WhatsApp groups, and company websites in one place.',
    color: 'text-pink-600 dark:text-pink-400',
    bg: 'bg-pink-50 dark:bg-pink-950/50',
  },
  {
    icon: TrendingUp,
    title: 'Career Analytics',
    description: 'Visualize your job search with charts showing application trends, response rates, and more.',
    color: 'text-cyan-600 dark:text-cyan-400',
    bg: 'bg-cyan-50 dark:bg-cyan-950/50',
  },
]

export default function FeaturesSection() {
  return (
    <section id="features" className="py-24 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <p className="text-blue-600 dark:text-blue-400 font-medium text-sm uppercase 
                        tracking-wider mb-3">
            Everything You Need
          </p>
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Your entire job search,<br />in one platform
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-lg max-w-xl mx-auto">
            Stop juggling spreadsheets, notes, and tabs. CareerAI brings everything together.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                // whileHover creates the lift effect on hover
                whileHover={{ y: -4 }}
                className="bg-white dark:bg-gray-800/50 
                           border border-gray-200 dark:border-gray-700/50
                           rounded-2xl p-6 
                           hover:border-gray-300 dark:hover:border-gray-600
                           hover:shadow-lg dark:hover:shadow-gray-900/50
                           transition-shadow duration-300 cursor-default"
              >
                <div className={`w-10 h-10 ${feature.bg} rounded-xl 
                                flex items-center justify-center mb-4`}>
                  <Icon className={`w-5 h-5 ${feature.color}`} />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
