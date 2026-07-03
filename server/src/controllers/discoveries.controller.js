// server/src/controllers/discoveries.controller.js

// What is this file?
// Handles all CRUD operations for the Internship Discovery Board.
// Same pattern as applications controller — just a different table.

import { query } from '../config/db.js'

// ─── GET ALL ──────────────────────────────────────────────────
export const getDiscoveries = async (req, res) => {
  try {
    const result = await query(
      `SELECT * FROM internship_discoveries 
       WHERE user_id = $1 
       ORDER BY created_at DESC`,
      [req.userId]
    )
    res.json({ success: true, discoveries: result.rows })
  } catch (err) {
    console.error('Get discoveries error:', err)
    res.status(500).json({ success: false, message: 'Server error' })
  }
}

// ─── CREATE ───────────────────────────────────────────────────
export const createDiscovery = async (req, res) => {
  try {
    const { title, company, url, source, status, deadline, notes, is_remote, location } = req.body

    const result = await query(
      `INSERT INTO internship_discoveries 
        (user_id, title, company, url, source, status, deadline, notes, is_remote, location)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING *`,
      [req.userId, title, company, url, source || 'other', 
       status || 'saved', deadline || null, notes, is_remote || false, location]
    )

    res.status(201).json({ success: true, discovery: result.rows[0] })
  } catch (err) {
    console.error('Create discovery error:', err)
    res.status(500).json({ success: false, message: 'Server error' })
  }
}

// ─── UPDATE ───────────────────────────────────────────────────
export const updateDiscovery = async (req, res) => {
  try {
    const { id } = req.params
    const { title, company, url, source, status, deadline, notes, is_remote, location } = req.body

    const result = await query(
      `UPDATE internship_discoveries
       SET title = COALESCE($1, title),
           company = COALESCE($2, company),
           url = COALESCE($3, url),
           source = COALESCE($4, source),
           status = COALESCE($5, status),
           deadline = COALESCE($6, deadline),
           notes = COALESCE($7, notes),
           is_remote = COALESCE($8, is_remote),
           location = COALESCE($9, location),
           updated_at = NOW()
       WHERE id = $10 AND user_id = $11
       RETURNING *`,
      [title, company, url, source, status, deadline || null, 
       notes, is_remote, location, id, req.userId]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Not found' })
    }

    res.json({ success: true, discovery: result.rows[0] })
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' })
  }
}

// ─── DELETE ───────────────────────────────────────────────────
export const deleteDiscovery = async (req, res) => {
  try {
    const { id } = req.params

    const result = await query(
      `DELETE FROM internship_discoveries 
       WHERE id = $1 AND user_id = $2 
       RETURNING id`,
      [id, req.userId]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Not found' })
    }

    res.json({ success: true, message: 'Deleted successfully' })
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' })
  }
}