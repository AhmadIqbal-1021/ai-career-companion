// server/src/middleware/auth.middleware.js

// What is this file?
// Middleware that protects routes.
// Runs before any protected route handler.
// Verifies the access token and attaches user info to the request.

import { verifyAccessToken } from '../utils/jwt.js'

export const authenticate = (req, res, next) => {
  try {
    // Tokens are sent in the Authorization header:
    // Authorization: Bearer eyJhbGci...
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        success: false,
        message: 'Access token required' 
      })
    }

    // Extract token from "Bearer <token>"
    const token = authHeader.split(' ')[1]

    // Verify the token — throws if invalid or expired
    const decoded = verifyAccessToken(token)

    // Attach userId to request so controllers can use it
    req.userId = decoded.userId

    next() // proceed to the route handler
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false,
        message: 'Token expired',
        code: 'TOKEN_EXPIRED'
      })
    }
    return res.status(401).json({ 
      success: false,
      message: 'Invalid token' 
    })
  }
}