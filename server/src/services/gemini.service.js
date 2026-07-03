// server/src/services/gemini.service.js

import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })

const askGemini = async (prompt) => {
  try {
    const result = await model.generateContent(prompt)
    const text = result.response.text()
    const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
    return JSON.parse(cleaned)
  } catch (err) {
    // Detect Google's quota exceeded error specifically
    // and throw a clean, identifiable error instead of a raw crash
    if (err.status === 429) {
      const quotaError = new Error('Gemini API quota exceeded')
      quotaError.code = 'GEMINI_QUOTA_EXCEEDED'
      throw quotaError
    }
    throw err
  }
}

export const analyzeResume = async (resumeText) => {
  const prompt = `
You are a senior ATS (Applicant Tracking System) expert and career coach with 10 years of experience reviewing resumes for top tech companies.

Analyze the following resume and return ONLY a valid JSON object. No markdown, no explanation, just pure JSON.

Return exactly this structure:
{
  "atsScore": <number between 0-100>,
  "summary": "<2-3 sentence overall assessment of the resume>",
  "strengths": ["<strength 1>", "<strength 2>", "<strength 3>"],
  "weaknesses": ["<weakness 1>", "<weakness 2>"],
  "missingKeywords": ["<important keyword missing from resume>"],
  "suggestions": ["<specific actionable suggestion 1>", "<suggestion 2>", "<suggestion 3>"],
  "formattingScore": <number between 0-100>,
  "contentScore": <number between 0-100>
}

Resume to analyze:
${resumeText}
`
  return await askGemini(prompt)
}

export const analyzeJobMatch = async (resumeText, jobDescription) => {
  const prompt = `
You are an expert career counselor and technical recruiter.

Compare the following resume against the job description and return ONLY a valid JSON object. No markdown, no explanation, just pure JSON.

Return exactly this structure:
{
  "matchScore": <number between 0-100>,
  "summary": "<2-3 sentence assessment of how well the candidate fits>",
  "matchingSkills": ["<skill that matches>"],
  "missingSkills": ["<required skill not in resume>"],
  "strengths": ["<reason this candidate is strong for the role>"],
  "improvements": ["<specific thing to add or improve to get this job>"]
}

Resume:
${resumeText}

Job Description:
${jobDescription}
`
  return await askGemini(prompt)
}

export const generateCoverLetter = async (resumeText, jobDescription, companyName, position) => {
  const prompt = `
You are an expert career coach who writes compelling, personalized cover letters.

Write a professional cover letter for the following candidate applying to ${companyName} for the ${position} position.

The cover letter should:
- Be 3-4 paragraphs
- Sound human and genuine, not robotic
- Reference specific details from both the resume and job description
- Show enthusiasm for the specific company
- End with a confident call to action

Return ONLY a valid JSON object with no markdown:
{
  "coverLetter": "<the full cover letter text with \\n for line breaks>",
  "subject": "<suggested email subject line>"
}

Resume:
${resumeText}

Job Description:
${jobDescription}
`
  return await askGemini(prompt)
}

export const generateInterviewQuestions = async (position, company, resumeText) => {
  const prompt = `
You are a senior technical interviewer at ${company} hiring for ${position}.

Generate comprehensive interview preparation material and return ONLY a valid JSON object. No markdown, no explanation, just pure JSON.

Return exactly this structure:
{
  "hrQuestions": [
    { "question": "<HR/behavioral question>", "tip": "<how to answer this question>" }
  ],
  "technicalQuestions": [
    { "question": "<technical question>", "tip": "<what the interviewer is looking for>" }
  ],
  "questionsToAsk": ["<smart question candidate should ask interviewer>"],
  "preparation": ["<specific thing to prepare before the interview>"]
}

Generate 5 HR questions, 5 technical questions, 3 questions to ask, and 3 preparation tips.

Position: ${position}
Company: ${company}
Candidate Resume: ${resumeText}
`
  return await askGemini(prompt)
}