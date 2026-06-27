// server/src/config/db.js

// What is this file?
// Creates and exports a PostgreSQL connection pool.
// A "pool" maintains multiple open connections to the database,
// reusing them instead of opening a new connection on every request.
// Opening a connection is expensive (100-300ms). Pooling keeps them ready.

import pg from 'pg'
import dotenv from 'dotenv'

dotenv.config()

const { Pool } = pg

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // For Neon or any cloud PostgreSQL, SSL is required
  ssl: process.env.NODE_ENV === 'production' 
    ? { rejectUnauthorized: false } 
    : false
})

// Test the connection when server starts
pool.connect((err, client, release) => {
  if (err) {
    console.error('Database connection error:', err.message)
  } else {
    console.log('PostgreSQL connected successfully')
    release() // release the client back to the pool
  }
})

// query() is a helper so we don't call pool.query() everywhere
// Usage: db.query('SELECT * FROM users WHERE id = $1', [userId])
export const query = (text, params) => pool.query(text, params)

export default pool