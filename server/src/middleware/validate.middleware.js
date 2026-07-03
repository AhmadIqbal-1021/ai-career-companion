// server/src/middleware/validate.middleware.js

// What is this file?
// Validates incoming request data before it reaches the controller.
// Never trust user input — always validate on the server.

import { body, validationResult } from 'express-validator'

// Reusable validation rules
export const registerValidation = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 100 }).withMessage('Name must be 2-100 characters'),

  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email format'),
    //.normalizeEmail(),

  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
    .matches(/\d/).withMessage('Password must contain a number'),
]

export const loginValidation = [
  body('email').trim().isEmail().withMessage('Invalid email'),
  body('password').notEmpty().withMessage('Password is required'),
]

// Middleware that checks validation results
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map(e => ({ field: e.path, message: e.msg }))
    })
  }
  next()
}