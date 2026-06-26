// server/src/app.js

// What is this file?
// The EXPRESS APP setup file.
// This is where we register all middleware and routes.
// Keeping this separate from server.js is a best practice —
// it lets you import the app in tests without starting a real server.

import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'

// Load environment variables from .env file
// Must be called before accessing process.env anywhere
dotenv.config()

const app = express()

// ─── MIDDLEWARE ────────────────────────────────────────────────────────────────
// Middleware runs on EVERY request, in order, before hitting your routes.
// Think of it as a pipeline: Request → [helmet] → [cors] → [json parser] → Route Handler

// helmet() sets secure HTTP response headers.
// Examples: prevents browsers from sniffing MIME types, enables XSS filters, etc.
app.use(helmet())

// cors() allows your React frontend (different origin) to call this API.
// In production, you'd replace * with your actual frontend domain.
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,  // Allow cookies to be sent cross-origin
}))

// express.json() parses incoming JSON request bodies.
// Without this, req.body would be undefined when your frontend sends JSON.
app.use(express.json())

// cookieParser() parses cookies attached to requests.
// Without this, req.cookies would be undefined.
app.use(cookieParser())

// ─── ROUTES ────────────────────────────────────────────────────────────────────
// We'll add routes here as we build each feature.
// Example structure (don't add yet):
// import authRoutes from './routes/auth.routes.js'
// app.use('/api/auth', authRoutes)

// ─── HEALTH CHECK ──────────────────────────────────────────────────────────────
// A simple route to verify the server is running.
// Visit http://localhost:3000/api/health in your browser to test.
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'AI Career Companion API is running',
    timestamp: new Date().toISOString()
  })
})

export default app