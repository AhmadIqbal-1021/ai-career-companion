// server/src/controllers/applications.controller.js

import { query } from '../config/db.js'

// ─── GET ALL APPLICATIONS ─────────────────────────────────────
export const getApplications = async (req, res) => {
  try {
    // req.userId comes from the authenticate middleware
    // Users can only see THEIR applications — never others'
    const result = await query(
      `SELECT * FROM applications 
       WHERE user_id = $1 
       ORDER BY created_at DESC`,
      [req.userId]
    )

    res.json({ 
      success: true, 
      applications: result.rows,
      count: result.rows.length
    })
  } catch (err) {
    console.error('Get applications error:', err)
    res.status(500).json({ success: false, message: 'Server error' })
  }
}

// ─── GET SINGLE APPLICATION ───────────────────────────────────
export const getApplication = async (req, res) => {
  try {
    const { id } = req.params

    const result = await query(
      `SELECT * FROM applications 
       WHERE id = $1 AND user_id = $2`,
      [id, req.userId]
      // The AND user_id = $2 is critical for security
      // Without it, any logged-in user could view anyone's application
      // by guessing the ID — called an IDOR (Insecure Direct Object Reference)
    )

    if (result.rows.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Application not found' 
      })
    }

    res.json({ success: true, application: result.rows[0] })
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' })
  }
}

// ─── CREATE APPLICATION ───────────────────────────────────────
export const createApplication = async (req, res) => {
  try {
    const { 
      company, position, location, 
      salary, status, notes, 
      application_date, job_url 
    } = req.body

    const result = await query(
      `INSERT INTO applications 
        (user_id, company, position, location, salary, status, notes, application_date, job_url)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      // [req.userId, company, position, location, salary, 
      //  status || 'saved', notes, application_date, job_url]
      [req.userId, company, position, location, salary,
 status || 'saved', notes, application_date || null, job_url]
    )


    res.status(201).json({ 
      success: true, 
      application: result.rows[0] 
    })
  } catch (err) {
    console.error('Create application error:', err)
    res.status(500).json({ success: false, message: 'Server error' })
  }
}

// ─── UPDATE APPLICATION ───────────────────────────────────────
export const updateApplication = async (req, res) => {
  try {
    const { id } = req.params
    const { 
      company, position, location, 
      salary, status, notes, 
      application_date, job_url 
    } = req.body

    const result = await query(
      `UPDATE applications 
       SET company = COALESCE($1, company),
           position = COALESCE($2, position),
           location = COALESCE($3, location),
           salary = COALESCE($4, salary),
           status = COALESCE($5, status),
           notes = COALESCE($6, notes),
           application_date = COALESCE($7, application_date),
           job_url = COALESCE($8, job_url),
           updated_at = NOW()
       WHERE id = $9 AND user_id = $10
       RETURNING *`,
      // COALESCE returns the first non-null value
      // So if company is not sent, COALESCE(null, company) keeps the old value
      [company, position, location, salary, status, 
       notes, 
application_date || null, job_url, id, req.userId]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Application not found' 
      })
    }

    res.json({ success: true, application: result.rows[0] })
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' })
  }
}

// ─── DELETE APPLICATION ───────────────────────────────────────
export const deleteApplication = async (req, res) => {
  try {
    const { id } = req.params

    const result = await query(
      `DELETE FROM applications 
       WHERE id = $1 AND user_id = $2
       RETURNING id`,
      [id, req.userId]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Application not found' 
      })
    }

    res.json({ success: true, message: 'Application deleted' })
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' })
  }
}

// ─── GET STATS ────────────────────────────────────────────────
export const getStats = async (req, res) => {
  try {
    const result = await query(
      `SELECT 
         COUNT(*) as total,
         COUNT(*) FILTER (WHERE status = 'applied') as applied,
         COUNT(*) FILTER (WHERE status = 'interview') as interviews,
         COUNT(*) FILTER (WHERE status = 'offer') as offers,
         COUNT(*) FILTER (WHERE status = 'rejected') as rejections,
         COUNT(*) FILTER (WHERE status = 'saved') as saved
       FROM applications
       WHERE user_id = $1`,
      [req.userId]
    )

    const stats = result.rows[0]

    // Calculate success rate — offers / (applied + interview + rejected + offers)
    const total = parseInt(stats.total)
    const offers = parseInt(stats.offers)
    const successRate = total > 0 
      ? Math.round((offers / total) * 100) 
      : 0

    res.json({ 
      success: true, 
      stats: { ...stats, successRate }
    })
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' })
  }
}
// Add this new export at the bottom of applications.controller.js

// ─── GET CHART DATA ───────────────────────────────────────────
export const getChartData = async (req, res) => {
  try {
    // Applications by status — for donut chart
    const statusResult = await query(
      `SELECT status, COUNT(*) as count
       FROM applications
       WHERE user_id = $1
       GROUP BY status`,
      [req.userId]
    )

    // Applications per week for last 8 weeks — for timeline chart
    const timelineResult = await query(
      `SELECT 
         TO_CHAR(DATE_TRUNC('week', created_at), 'Mon DD') as week,
         COUNT(*) as count
       FROM applications
       WHERE user_id = $1
         AND created_at >= NOW() - INTERVAL '8 weeks'
       GROUP BY DATE_TRUNC('week', created_at)
       ORDER BY DATE_TRUNC('week', created_at)`,
      [req.userId]
    )

    res.json({
      success: true,
      statusData: statusResult.rows,
      timelineData: timelineResult.rows,
    })
  } catch (err) {
    console.error('Chart data error:', err)
    res.status(500).json({ success: false, message: 'Server error' })
  }
}