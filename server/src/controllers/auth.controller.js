// server/src/controllers/auth.controller.js

// What is this file?
// Handles all authentication logic:
// register, login, logout, refresh token.
// Controllers receive requests and send responses.
// They delegate database work to models/queries.

import bcrypt from 'bcryptjs'
import { query } from '../config/db.js'
import { 
  generateAccessToken, 
  generateRefreshToken,
  verifyRefreshToken 
} from '../utils/jwt.js'

// ─── REGISTER ─────────────────────────────────────────────────
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body

    // 1. Check if email already exists
    const existingUser = await query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    )

    if (existingUser.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email already exists'
      })
    }

    // 2. Hash the password
    // 12 salt rounds = secure but still fast enough
    const passwordHash = await bcrypt.hash(password, 12)

    // 3. Insert user into database
    const result = await query(
      `INSERT INTO users (name, email, password_hash) 
       VALUES ($1, $2, $3) 
       RETURNING id, name, email, created_at`,
      [name, email, passwordHash]
    )

    const user = result.rows[0]

    // 4. Generate tokens
    const accessToken = generateAccessToken(user.id)
    const refreshToken = generateRefreshToken(user.id)

    // 5. Save refresh token in database
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
    await query(
      'INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES ($1, $2, $3)',
      [user.id, refreshToken, expiresAt]
    )

    // 6. Set refresh token as HttpOnly cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,     // JavaScript cannot read this cookie
      secure: process.env.NODE_ENV === 'production', // HTTPS only in production
      sameSite: 'strict', // Prevents CSRF attacks
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days in milliseconds
    })

    // 7. Send access token and user data in response
    res.status(201).json({
      success: true,
      message: 'Account created successfully',
      accessToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      }
    })

  } catch (err) {
    console.error('Register error:', err)
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    })
  }
}

// ─── LOGIN ────────────────────────────────────────────────────
export const login = async (req, res) => {
  try {
    const { email, password } = req.body

    // 1. Find user by email
    const result = await query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    )

    if (result.rows.length === 0) {
      // Important: use the same error message for wrong email AND wrong password
      // This prevents "user enumeration" attacks where attackers discover valid emails
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      })
    }

    const user = result.rows[0]

    // 2. Compare password with hash
    const isValidPassword = await bcrypt.compare(password, user.password_hash)

    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      })
    }

    // 3. Generate tokens
    const accessToken = generateAccessToken(user.id)
    const refreshToken = generateRefreshToken(user.id)

    // 4. Save refresh token
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    await query(
      'INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES ($1, $2, $3)',
      [user.id, refreshToken, expiresAt]
    )

    // 5. Set cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    })

    res.json({
      success: true,
      accessToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      }
    })

  } catch (err) {
    console.error('Login error:', err)
    res.status(500).json({ success: false, message: 'Server error' })
  }
}

// ─── REFRESH TOKEN ────────────────────────────────────────────
export const refreshToken = async (req, res) => {
  try {
    // Refresh token comes from the HttpOnly cookie automatically
    const token = req.cookies.refreshToken

    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'Refresh token not found' 
      })
    }

    // 1. Verify the token cryptographically
    const decoded = verifyRefreshToken(token)

    // 2. Check it exists in database (not revoked)
    const result = await query(
      'SELECT * FROM refresh_tokens WHERE token = $1 AND expires_at > NOW()',
      [token]
    )

    if (result.rows.length === 0) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid or expired refresh token' 
      })
    }

    // 3. Issue new access token
    const accessToken = generateAccessToken(decoded.userId)

    res.json({ success: true, accessToken })

  } catch (err) {
    res.status(401).json({ success: false, message: 'Invalid refresh token' })
  }
}

// ─── LOGOUT ───────────────────────────────────────────────────
export const logout = async (req, res) => {
  try {
    const token = req.cookies.refreshToken

    if (token) {
      // Delete from database — token is now invalid even if someone has it
      await query('DELETE FROM refresh_tokens WHERE token = $1', [token])
    }

    // Clear the cookie
    res.clearCookie('refreshToken')

    res.json({ success: true, message: 'Logged out successfully' })

  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' })
  }
}

// ─── GET CURRENT USER ─────────────────────────────────────────
export const getMe = async (req, res) => {
  try {
    // req.userId was attached by the authenticate middleware
    const result = await query(
      'SELECT id, name, email, is_verified, created_at FROM users WHERE id = $1',
      [req.userId]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found' })
    }

    res.json({ success: true, user: result.rows[0] })

  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' })
  }
}