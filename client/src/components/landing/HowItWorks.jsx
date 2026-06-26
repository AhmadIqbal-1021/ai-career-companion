// client/src/components/landing/HowItWorks.jsx

import { motion } from 'framer-motion'
import { UserPlus, FolderKanban, Sparkles } from 'lucide-react'

const steps = [
  {
    step: '01',
    icon: UserPlus,
    title: 'Create Your Account',
    description: 'Sign up in 30 seconds. No credit card required. Start your free career dashboard immediately.',
  },
  {
    step: '02',
    icon: FolderKanban,
    title: 'Track Your Applications',
    description: 'Add companies, set statuses, write notes. Never lose track of where you applied.',
  },
  {
    step: '03',
    icon: Sparkles,
    title: 'Let AI Do the Heavy Lifting',
    description: 'Analyze your resume, generate cover letters, and prepare for interviews with AI assistance.',
  },
]

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 bg-white dark:bg-gray-950">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-blue-600 dark:text-blue-400 font-medium text-sm uppercase tracking-wider mb-3">
            Simple Process
          </p>
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white">
            Up and running in minutes
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Connector Line (desktop only) */}
          <div className="hidden md:block absolute top-8 left-1/4 right-1/4 
                          h-px bg-gradient-to-r from-blue-200 via-blue-400 to-blue-200 
                          dark:from-blue-900 dark:via-blue-600 dark:to-blue-900" />

          {steps.map((step, index) => {
            const Icon = step.icon
            return (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.15 }}
                className="text-center relative"
              >
                {/* Step Circle */}
                <div className="w-16 h-16 bg-blue-600 rounded-2xl 
                                flex items-center justify-center mx-auto mb-6
                                shadow-lg shadow-blue-600/30">
                  <Icon className="w-7 h-7 text-white" />
                </div>
                
                <div className="text-xs font-bold text-blue-600 dark:text-blue-400 
                                tracking-widest mb-2">
                  STEP {step.step}
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white text-lg mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
                  {step.description}
                </p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}