// server/src/config/migrate.js

// What is this file?
// A one-time script to create all database tables.
// Run with: node src/config/migrate.js

import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import pool from './db.js'

const __dirname = dirname(fileURLToPath(import.meta.url))

const sql = readFileSync(join(__dirname, 'schema.sql'), 'utf8')

try {
  await pool.query(sql)
  console.log('All tables created successfully')
  process.exit(0)
} catch (err) {
  console.error('Migration failed:', err.message)
  process.exit(1)
}