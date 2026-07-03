// server/src/controllers/ai.controller.js

// What is this file?
// Handles all AI-related HTTP requests.
// Receives data from frontend, calls gemini.service.js, returns results.

import { 
  analyzeResume, 
  analyzeJobMatch,
  generateCoverLetter,
  generateInterviewQuestions
} from '../services/gemini.service.js'

// ─── RESUME ANALYZER ──────────────────────────────────────────
export const resumeAnalyzer = async (req, res) => {
  try {
    const { resumeText } = req.body

    if (!resumeText || resumeText.trim().length < 50) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid resume with at least 50 characters'
      })
    }

    const analysis = await analyzeResume(resumeText)

    res.json({ success: true, analysis })
  } catch (err) {
    console.error('Resume analyzer error:', err)
    res.status(500).json({ 
      success: false, 
      message: 'AI analysis failed. Please try again.' 
    })
  }
}

// ─── JOB MATCH ────────────────────────────────────────────────
export const jobMatchAnalyzer = async (req, res) => {
  try {
    const { resumeText, jobDescription } = req.body

    if (!resumeText || !jobDescription) {
      return res.status(400).json({
        success: false,
        message: 'Both resume and job description are required'
      })
    }

    const analysis = await analyzeJobMatch(resumeText, jobDescription)

    res.json({ success: true, analysis })
  } catch (err) {
    console.error('Job match error:', err)
    res.status(500).json({ 
      success: false, 
      message: 'AI analysis failed. Please try again.' 
    })
  }
}

// ─── COVER LETTER ─────────────────────────────────────────────
export const coverLetterGenerator = async (req, res) => {
  try {
    const { resumeText, jobDescription, companyName, position } = req.body

    if (!resumeText || !jobDescription || !companyName || !position) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      })
    }

    const result = await generateCoverLetter(resumeText, jobDescription, companyName, position)

    res.json({ success: true, ...result })
  } catch (err) {
    console.error('Cover letter error:', err)
    res.status(500).json({ 
      success: false, 
      message: 'AI generation failed. Please try again.' 
    })
  }
}

// ─── INTERVIEW PREP ───────────────────────────────────────────
export const interviewPrep = async (req, res) => {
  try {
    const { position, company, resumeText } = req.body

    if (!position) {
      return res.status(400).json({
        success: false,
        message: 'Position is required'
      })
    }

    const questions = await generateInterviewQuestions(
      position, 
      company || 'the company', 
      resumeText || ''
    )

    res.json({ success: true, ...questions })
  } catch (err) {
    console.error('Interview prep error:', err)
    res.status(500).json({ 
      success: false, 
      message: 'AI generation failed. Please try again.' 
    })
  }
}