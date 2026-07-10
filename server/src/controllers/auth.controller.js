// server/src/controllers/auth.controller.js

// What is this file?
// Handles all authentication logic:
// register, login, logout, refresh token.
// Controllers receive requests and send responses.
// They delegate database work to models/queries.

import bcrypt from 'bcryptjs'
import { query } from '../config/db.js'

import crypto from 'crypto'
import { sendPasswordResetEmail } from '../services/email.service.js'
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
  httpOnly: true,
  secure: true, // Always true — Render uses HTTPS
  sameSite: 'none', // Required for cross-domain cookies
  maxAge: 7 * 24 * 60 * 60 * 1000
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
  secure: true, // Always true — Render uses HTTPS
  sameSite: 'none', // Required for cross-domain cookies
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







// ─── FORGOT PASSWORD ──────────────────────────────────────────
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body

    // 1. Find user — always return success even if email not found
    // This prevents email enumeration attacks
    const result = await query(
      'SELECT id, email FROM users WHERE email = $1',
      [email]
    )

    // Always send success response — don't reveal if email exists
    if (result.rows.length === 0) {
      return res.json({
        success: true,
        message: 'If an account with that email exists, a reset link has been sent.'
      })
    }

    const user = result.rows[0]

    // 2. Generate a secure random token
    // crypto.randomBytes(32) generates 32 random bytes
    // toString('hex') converts to a 64 character hex string
    const resetToken = crypto.randomBytes(32).toString('hex')

    // 3. Set expiry to 1 hour from now
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000)

    // 4. Delete any existing reset tokens for this user
    await query(
      'DELETE FROM password_reset_tokens WHERE user_id = $1',
      [user.id]
    )

    // 5. Save new token to database
    await query(
      'INSERT INTO password_reset_tokens (user_id, token, expires_at) VALUES ($1, $2, $3)',
      [user.id, resetToken, expiresAt]
    )

    // 6. Build reset URL pointing to frontend
    const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`

    // 7. Send email
    await sendPasswordResetEmail(user.email, resetUrl)

    res.json({
      success: true,
      message: 'If an account with that email exists, a reset link has been sent.'
    })

  } catch (err) {
    console.error('Forgot password error:', err)
    res.status(500).json({ success: false, message: 'Server error' })
  }
}

// ─── RESET PASSWORD ───────────────────────────────────────────
export const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body

    // 1. Find the token in database
    const result = await query(
      `SELECT prt.*, u.email 
       FROM password_reset_tokens prt
       JOIN users u ON u.id = prt.user_id
       WHERE prt.token = $1 
         AND prt.expires_at > NOW()
         AND prt.used = FALSE`,
      [token]
    )

    if (result.rows.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Reset link is invalid or has expired. Please request a new one.'
      })
    }

    const resetRecord = result.rows[0]

    // 2. Hash the new password
    const passwordHash = await bcrypt.hash(password, 12)

    // 3. Update user's password
    await query(
      'UPDATE users SET password_hash = $1, updated_at = NOW() WHERE id = $2',
      [passwordHash, resetRecord.user_id]
    )

    // 4. Mark token as used so it can't be reused
    await query(
      'UPDATE password_reset_tokens SET used = TRUE WHERE token = $1',
      [token]
    )

    // 5. Delete all refresh tokens for this user — force re-login
    await query(
      'DELETE FROM refresh_tokens WHERE user_id = $1',
      [resetRecord.user_id]
    )

    res.json({
      success: true,
      message: 'Password reset successfully. Please log in with your new password.'
    })

  } catch (err) {
    console.error('Reset password error:', err)
    res.status(500).json({ success: false, message: 'Server error' })
  }
}