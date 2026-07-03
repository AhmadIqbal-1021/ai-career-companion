// server/src/routes/ai.routes.js

import { Router } from 'express'
import {
  resumeAnalyzer,
  jobMatchAnalyzer,
  coverLetterGenerator,
  interviewPrep
} from '../controllers/ai.controller.js'
import { authenticate } from '../middleware/auth.middleware.js'
import { checkAIRateLimit, getAIUsage } from '../middleware/aiRateLimit.middleware.js'
import { body } from 'express-validator'
import { handleValidationErrors } from '../middleware/validate.middleware.js'

const router = Router()

// All AI routes require authentication
router.use(authenticate)

// Usage check endpoint — no rate limit on this one
router.get('/usage', getAIUsage)

// All AI generation routes go through rate limiter first
router.post('/resume-analyze',
  checkAIRateLimit,
  [body('resumeText').notEmpty().withMessage('Resume text is required')],
  handleValidationErrors,
  resumeAnalyzer
)

router.post('/job-match',
  checkAIRateLimit,
  [
    body('resumeText').notEmpty().withMessage('Resume is required'),
    body('jobDescription').notEmpty().withMessage('Job description is required'),
  ],
  handleValidationErrors,
  jobMatchAnalyzer
)

router.post('/cover-letter',
  checkAIRateLimit,
  [
    body('resumeText').notEmpty(),
    body('jobDescription').notEmpty(),
    body('companyName').notEmpty(),
    body('position').notEmpty(),
  ],
  handleValidationErrors,
  coverLetterGenerator
)

router.post('/interview-prep',
  checkAIRateLimit,
  [body('position').notEmpty().withMessage('Position is required')],
  handleValidationErrors,
  interviewPrep
)

export default router