// server/src/middleware/aiRateLimit.middleware.js

// What is this file?
// A custom middleware that limits each user to 20 AI requests per day.
// This runs BEFORE any AI controller function.
// It checks the ai_usage table, blocks if limit reached, increments if allowed.

import { query } from '../config/db.js'

const DAILY_LIMIT = 20

export const checkAIRateLimit = async (req, res, next) => {
  try {
    const userId = req.userId // set by authenticate middleware

    // Try to insert a new row for today
    // ON CONFLICT means: if a row already exists for this user+date,
    // increment the count instead of inserting
    const result = await query(
      `INSERT INTO ai_usage (user_id, date, request_count)
       VALUES ($1, CURRENT_DATE, 1)
       ON CONFLICT (user_id, date)
       DO UPDATE SET request_count = ai_usage.request_count + 1
       RETURNING request_count`,
      [userId]
    )

    const count = result.rows[0].request_count

    // If they've exceeded the limit, decrement back and block
    if (count > DAILY_LIMIT) {
      // Decrement back since we incremented before checking
      await query(
        `UPDATE ai_usage SET request_count = request_count - 1
         WHERE user_id = $1 AND date = CURRENT_DATE`,
        [userId]
      )

      return res.status(429).json({
        success: false,
        message: `Daily AI limit reached. You have used ${DAILY_LIMIT} AI requests today. Limit resets at midnight.`,
        code: 'AI_RATE_LIMIT_EXCEEDED',
        limit: DAILY_LIMIT,
        resetAt: 'midnight'
      })
    }

    // Attach remaining count to request so controller can pass it to frontend
    req.aiRequestsRemaining = DAILY_LIMIT - count
    next()

  } catch (err) {
    console.error('AI rate limit error:', err)
    // If rate limit check fails, let the request through rather than blocking
    // We don't want a DB error to break AI features entirely
    next()
  }
}

// Separate endpoint to check current usage without making an AI call
export const getAIUsage = async (req, res) => {
  try {
    const result = await query(
      `SELECT request_count FROM ai_usage
       WHERE user_id = $1 AND date = CURRENT_DATE`,
      [req.userId]
    )

    const used = result.rows[0]?.request_count || 0

    res.json({
      success: true,
      used,
      limit: DAILY_LIMIT,
      remaining: DAILY_LIMIT - used,
    })
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' })
  }
}