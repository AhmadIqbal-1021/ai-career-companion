# 🎓 CareerAI — AI Career Companion

**A full-stack SaaS platform that helps students track job applications and get AI-powered career guidance.**

[![Live Demo](https://img.shields.io/badge/demo-live-brightgreen)](https://ai-career-companion-sj5i.vercel.app)
[![Backend](https://img.shields.io/badge/API-Railway-blueviolet)](https://ai-career-companion-production.up.railway.app)
[![License](https://img.shields.io/badge/license-MIT-blue)](#license)

🔗 **Live App:** https://ai-career-companion-sj5i.vercel.app
🔗 **API:** https://ai-career-companion-production.up.railway.app
📦 **Repo:** https://github.com/AhmadIqbal-1/ai-career-companion

---

## 📖 Overview

CareerAI is a full-stack SaaS application built to help students and early-career job seekers organize their job search and get AI-assisted career prep — all in one dashboard. Users can log job applications, track deadlines, get AI-driven job-match analysis, and manage their entire job hunt without spreadsheets.

The project was built to be **production-grade**, not a tutorial clone: secure JWT authentication with refresh-token rotation, rate-limited AI usage, hardened HTTP headers, input validation, and a real CI/CD deployment across Vercel, Railway, and Neon Postgres.

---

## 🖼️ Screenshots

| Landing Page | Dashboard |
|---|---|
| ![Landing](./screenshots/landing.png) | ![Dashboard](./screenshots/dashboard.png) |

| Applications Tracker | Discovery Board |
|---|---|
| ![Applications](./screenshots/applications.png) | ![Discovery Board](./screenshots/discovery-board.png) |

| AI Resume Analyzer | AI Cover Letter Generator |
|---|---|
| ![Resume Analyzer](./screenshots/resume-analyzer.png) | ![Cover Letter](./screenshots/cover-letter.png) |

| AI Interview Prep |
|---|
| ![Interview Prep](./screenshots/interview-prep.png) |

---

## ✨ Features

- 🔐 **Secure Authentication** — JWT access tokens (15-min expiry) + HttpOnly refresh-token cookies, immune to XSS token theft
- 📊 **Dashboard Overview** — At-a-glance stats (total, applied, interviews, offers, rejections) with status breakdown, applications-over-time, and hiring-funnel charts via Recharts
- 📋 **Application Tracking** — Full CRUD for job applications with search, status filtering, and optimistic UI updates
- 🔖 **Discovery Board** — Save internship/job leads from LinkedIn, WhatsApp, or anywhere else before formally applying
- 🧠 **AI Resume Analyzer** — Gemini-powered resume scoring across ATS compatibility, formatting, and content, with a detailed strengths/weaknesses breakdown
- ✉️ **AI Cover Letter Generator** — Generates a tailored cover letter from a job description, company, position, and the user's resume
- 🎤 **AI Interview Prep** — Generates role-specific interview questions, questions to ask the interviewer, and a personalized preparation checklist
- 🚦 **AI Usage Quotas** — Daily rate-limiting middleware (shown live in the UI, e.g. "2 AI requests left today") to control AI API costs per user
- ⏱️ **Smart Deadline Status** — Computed (not stored) expiry status based on live deadline dates
- 🌗 **Light/Dark Mode** — Full theme toggle across the entire dashboard
- 📱 **Responsive UI** — Built with Tailwind CSS and Framer Motion for smooth, mobile-friendly interactions
- 🔒 **Hardened Security** — Helmet security headers, input validation/sanitization, and rate limiting throughout

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React 18 + Vite | Core UI framework & build tooling |
| Tailwind CSS v4 | Styling |
| Framer Motion | Animations |
| React Router v6 | Client-side routing |
| Recharts | Dashboard charts |
| Axios | HTTP client |
| react-helmet-async | SEO meta tags |

### Backend
| Technology | Purpose |
|---|---|
| Node.js 18.x + Express.js v4 | API server |
| PostgreSQL (`pg`) | Primary database, connection pooled |
| jsonwebtoken (HS256) | Access/refresh token auth |
| bcryptjs | Password hashing (12 salt rounds) |
| express-validator | Input validation & sanitization |
| express-rate-limit | API and AI usage rate limiting |
| helmet | Security HTTP headers |
| @google/generative-ai | Gemini AI integration (`gemini-2.5-flash`) |
| @getbrevo/brevo | Transactional email via HTTP API |

### Infrastructure
| Service | Role |
|---|---|
| Vercel | Frontend hosting & deployment |
| Railway | Backend hosting & deployment |
| Neon | Managed PostgreSQL database |

---

## 🏗️ Architecture & Key Decisions

- **Token strategy:** short-lived JWT access tokens live in React state (memory only, never `localStorage`), while long-lived refresh tokens are stored in `HttpOnly` cookies — protecting against both XSS and casual token theft.
- **Cross-domain auth:** cookies use `sameSite: "none"` + `secure: true` to work across the Vercel (frontend) ↔ Railway (backend) domain split.
- **Proxy-aware:** `app.set("trust proxy", 1)` is required for Express to correctly read client IPs behind Railway's load balancer (critical for rate limiting to work correctly).
- **Email delivery:** Brevo's HTTP API is used instead of SMTP, since Railway blocks outbound SMTP ports (465/587).
- **Optimistic UI:** the UI updates immediately on user action, then confirms with the API in the background, rolling back on failure — this keeps the app feeling instant.
- **Derived status, not stored status:** an application's "expired" status is computed live from its deadline (`getEffectiveStatus()`) rather than written to the database, so it's always accurate without a background job.
- **Idempotent AI usage tracking:** `ai_usage` table uses `ON CONFLICT DO UPDATE` (upsert) to maintain one row per user per day.
- **Partial updates:** update queries use `COALESCE` so only the fields actually provided by the client are overwritten.

---

## 📁 Project Structure

```
ai-career-companion/
├── client/                          # React frontend
│   ├── src/
│   │   ├── main.jsx                 # Entry point (HelmetProvider wrapper)
│   │   ├── App.jsx                  # All routes
│   │   ├── context/
│   │   │   └── AuthContext.jsx      # Global auth state
│   │   ├── services/
│   │   │   └── authService.js       # Axios instance + auth API calls
│   │   ├── hooks/
│   │   │   ├── useApplications.jsx  # Application CRUD + optimistic updates
│   │   │   └── useDiscoveries.jsx   # Discovery CRUD + undo delete
│   │   └── layouts/
│   │       └── DashboardLayout.jsx  # Sidebar navigation
│   ├── vite.config.js
│   ├── vercel.json                  # SPA routing rewrite rule
│   └── .env                         # VITE_API_URL
│
└── server/                          # Express backend
    ├── src/
    │   ├── app.js                   # Middleware & route registration
    │   ├── config/
    │   │   ├── db.js                # PostgreSQL connection pool
    │   │   └── schema.sql           # Table definitions
    │   ├── middleware/
    │   │   ├── auth.middleware.js       # JWT verification
    │   │   └── aiRateLimit.middleware.js # Daily AI quota enforcement
    │   └── services/
    │       ├── gemini.service.js    # Gemini prompts
    │       └── email.service.js     # Brevo email sending
    ├── server.js                    # HTTP server entry point
    └── .env                         # Environment variables
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18.x or higher
- A PostgreSQL database (e.g. [Neon](https://neon.tech))
- A [Google Gemini API key](https://ai.google.dev/)
- A [Brevo](https://www.brevo.com/) account for transactional email

### 1. Clone the repository
```bash
git clone https://github.com/AhmadIqbal-1/ai-career-companion.git
cd ai-career-companion
```

### 2. Backend setup
```bash
cd server
npm install
```

Create a `server/.env` file:
```env
PORT=5000
DATABASE_URL=postgres://user:password@host/dbname
JWT_ACCESS_SECRET=your_access_token_secret
JWT_REFRESH_SECRET=your_refresh_token_secret
GEMINI_API_KEY=your_gemini_api_key
BREVO_API_KEY=your_brevo_api_key
CLIENT_URL=http://localhost:5173
```

Run the schema against your database:
```bash
psql $DATABASE_URL -f src/config/schema.sql
```

Start the backend:
```bash
npm run dev
```

### 3. Frontend setup
```bash
cd ../client
npm install
```

Create a `client/.env` file:
```env
VITE_API_URL=http://localhost:5000
```

Start the frontend:
```bash
npm run dev
```

The app will be running at `http://localhost:5173`.

---

## 🔑 Environment Variables Reference

| Variable | Location | Description |
|---|---|---|
| `DATABASE_URL` | server | PostgreSQL connection string |
| `JWT_ACCESS_SECRET` | server | Secret for signing short-lived access tokens |
| `JWT_REFRESH_SECRET` | server | Secret for signing refresh tokens |
| `GEMINI_API_KEY` | server | Google Gemini API key |
| `BREVO_API_KEY` | server | Brevo transactional email API key |
| `CLIENT_URL` | server | Frontend origin, used for CORS & cookie settings |
| `VITE_API_URL` | client | Backend API base URL |

---

## 📡 Key API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/register` | Create a new account |
| `POST` | `/api/auth/login` | Authenticate and receive access token + refresh cookie |
| `POST` | `/api/auth/refresh` | Exchange refresh cookie for a new access token |
| `POST` | `/api/auth/logout` | Invalidate refresh token |
| `GET` | `/api/applications` | List the authenticated user's job applications |
| `POST` | `/api/applications` | Create a new application entry |
| `PATCH` | `/api/applications/:id` | Update an application (partial update via `COALESCE`) |
| `DELETE` | `/api/applications/:id` | Delete an application |
| `GET` | `/api/discoveries` | List saved job discoveries |
| `POST` | `/api/discoveries` | Save a new discovered internship/job lead |
| `POST` | `/api/ai/job-match` | Get AI-generated job-match analysis (rate-limited) |
| `POST` | `/api/ai/resume-analyzer` | Get an AI-generated ATS/formatting/content resume score (rate-limited) |
| `POST` | `/api/ai/cover-letter` | Generate a tailored cover letter from a job description + resume (rate-limited) |
| `POST` | `/api/ai/interview-prep` | Generate role-specific interview questions and a prep checklist (rate-limited) |

---

## 🔒 Security

- Passwords hashed with **bcrypt** (12 salt rounds)
- **JWT access/refresh token rotation** with HttpOnly, Secure, SameSite=None cookies
- **Helmet** for secure HTTP headers
- **express-validator** for input sanitization on every write endpoint
- **express-rate-limit** on auth and AI endpoints to prevent abuse
- Environment-based secrets — no credentials committed to source control

---

## 🗺️ Roadmap

- [ ] Dedicated Job Match Analyzer page (backend endpoint exists, frontend UI in progress)
- [ ] Email verification on registration
- [ ] Admin panel (user & usage analytics)
- [ ] Subscription/pricing tiers
- [ ] Deadline reminder emails
- [ ] Export applications to PDF
- [ ] Browser extension for one-click job saving from LinkedIn

---

## 👤 Author

**Muhammad Ahmad Iqbal**
Full-Stack Web Developer · Software Engineering Student, COMSATS University Islamabad

- 📧 ahmadiqbal1021412@gmail.com
- 🐙 [GitHub](https://github.com/AhmadIqbal-1)

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](./LICENSE) file for details.
