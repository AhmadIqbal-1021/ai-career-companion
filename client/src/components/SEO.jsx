// client/src/components/SEO.jsx

// What is this file?
// A reusable component that sets page-specific meta tags.
// Every page imports this and passes its own title/description.
// react-helmet-async injects these into the <head> of the HTML document.

import { Helmet } from 'react-helmet-async'

const DEFAULT_DESCRIPTION = 'CareerAI helps students and job seekers track applications, analyze resumes with AI, generate cover letters, and prepare for interviews — all in one place.'

const DEFAULT_IMAGE = 'https://ai-career-companion-sj5i.vercel.app/og-image.png'

export default function SEO({ 
  title, 
  description = DEFAULT_DESCRIPTION,
  image = DEFAULT_IMAGE,
  url,
}) {
  const fullTitle = title 
    ? `${title} — CareerAI` 
    : 'CareerAI — Land Your Dream Internship with AI'

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="robots" content="index, follow" />
      <meta name="author" content="CareerAI" />

      {/* Open Graph — used by LinkedIn, Facebook, WhatsApp */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:image" content={image} />
      {url && <meta property="og:url" content={url} />}
      <meta property="og:site_name" content="CareerAI" />

      {/* Twitter Card — used by Twitter/X */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Theme color — browser tab color on mobile */}
      <meta name="theme-color" content="#2563EB" />
    </Helmet>
  )
}