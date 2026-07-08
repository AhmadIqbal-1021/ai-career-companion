// client/src/pages/LandingPage.jsx

// What is this file?
// The full Landing Page assembled from individual section components.
// This file should stay clean — it just composes sections together.

import Navbar from '../components/landing/Navbar'
import HeroSection from '../components/landing/HeroSection'
import FeaturesSection from '../components/landing/FeaturesSection'
import HowItWorks from '../components/landing/HowItWorks'
import CTASection from '../components/landing/CTASection'
import Footer from '../components/landing/Footer'
import SEO from '../components/SEO'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function LandingPage() {
  const { isAuthenticated, isLoading } = useAuth()
  const navigate = useNavigate()
  // If user is already logged in, send them to dashboard
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      navigate('/dashboard', { replace: true })
    }
  }, [isAuthenticated, isLoading, navigate])
   if (isLoading) return null
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <SEO
        title="Land Your Dream Internship with AI"
        description="Track applications, analyze your resume with AI, generate tailored cover letters, and prepare for interviews — all in one place. Free forever."
        url="https://ai-career-companion-sj5i.vercel.app"
      />
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <HowItWorks />
      <CTASection />
      <Footer />
    </div>
  )
}