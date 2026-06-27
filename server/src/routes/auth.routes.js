// server/src/routes/auth.routes.js

// What is this file?
// Defines all /api/auth/* endpoints.
// Routes are thin — they just connect URLs to controllers.
// All logic lives in controllers and middleware.

import { Router } from 'express'
import { register, login, logout, refreshToken, getMe } from '../controllers/auth.controller.js'
import { registerValidation, loginValidation, handleValidationErrors } from '../middleware/validate.middleware.js'
import { authenticate } from '../middleware/auth.middleware.js'

const router = Router()

// POST /api/auth/register
router.post('/register', registerValidation, handleValidationErrors, register)

// POST /api/auth/login
router.post('/login', loginValidation, handleValidationErrors, login)

// POST /api/auth/logout
router.post('/logout', logout)

// POST /api/auth/refresh
router.post('/refresh', refreshToken)

// GET /api/auth/me  ← protected route
router.get('/me', authenticate, getMe)

export default router