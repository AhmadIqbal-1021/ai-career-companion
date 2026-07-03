import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'
import rateLimit from 'express-rate-limit'
import authRoutes from './routes/auth.routes.js'
import applicationRoutes from './routes/applications.routes.js'
import aiRoutes from './routes/ai.routes.js'
import discoveriesRoutes from './routes/discoveries.routes.js'

dotenv.config()

const app = express()

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { success: false, message: 'Too many attempts, try again later' }
})

app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' }
}))

app.use(cors({
  // In production, allow your Vercel domain
  // We read it from environment variable
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}))

app.options('*', cors())
app.use(express.json())
app.use(cookieParser())

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'AI Career Companion API is running',
    environment: process.env.NODE_ENV || 'development'
  })
})

app.use('/api/auth', authLimiter, authRoutes)
app.use('/api/applications', applicationRoutes)
app.use('/api/ai', aiRoutes)
app.use('/api/discoveries', discoveriesRoutes)

export default app