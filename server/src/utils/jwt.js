// server/src/utils/jwt.js

// What is this file?
// Helper functions for creating and verifying JWT tokens.
// Centralized here so if we change token logic, we change it once.

import jwt from 'jsonwebtoken'

export const generateAccessToken = (userId) => {
  return jwt.sign(
    { userId },                          // payload — what to encode
    process.env.JWT_SECRET,              // secret — used to sign
    { expiresIn: process.env.JWT_EXPIRES_IN || '15m' }
  )
}

export const generateRefreshToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d' }
  )
}

export const verifyAccessToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET)
  // throws JsonWebTokenError if invalid
  // throws TokenExpiredError if expired
}

export const verifyRefreshToken = (token) => {
  return jwt.verify(token, process.env.JWT_REFRESH_SECRET)
}