-- server/src/config/schema.sql

-- What is this file?
-- The SQL that creates all your database tables.
-- Run this ONCE to set up your database structure.
-- Think of this as the blueprint of your entire database.

-- Enable UUID extension (for generating unique IDs)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─── USERS TABLE ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  -- UUID is better than integer IDs:
  -- 1. Cannot be guessed (security)
  -- 2. Can be generated without hitting the database
  -- 3. Safe to expose in URLs

  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  -- UNIQUE ensures no two users have the same email
  -- NOT NULL means this field is required

  password_hash VARCHAR(255) NOT NULL,
  -- We never store plain passwords, only bcrypt hashes

  is_verified BOOLEAN DEFAULT FALSE,
  -- Email verification status

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ─── APPLICATIONS TABLE ───────────────────────────────────────
CREATE TABLE IF NOT EXISTS applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  -- REFERENCES users(id) = Foreign Key relationship
  -- ON DELETE CASCADE = if user is deleted, their applications are too

  company VARCHAR(255) NOT NULL,
  position VARCHAR(255) NOT NULL,
  location VARCHAR(255),
  salary VARCHAR(100),

  status VARCHAR(50) DEFAULT 'saved' 
    CHECK (status IN ('saved', 'applied', 'interview', 'rejected', 'offer')),
  -- CHECK constraint: database rejects any other status value
  -- This is data integrity enforced at the database level

  notes TEXT,
  application_date DATE,
  job_url VARCHAR(500),

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ─── REFRESH TOKENS TABLE ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS refresh_tokens (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token VARCHAR(500) NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ─── INDEXES ──────────────────────────────────────────────────
-- Indexes speed up queries on frequently searched columns
-- Without index: database scans EVERY row to find matches (slow)
-- With index: database jumps directly to matching rows (fast)

CREATE INDEX IF NOT EXISTS idx_applications_user_id ON applications(user_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_token ON refresh_tokens(token);
-- Internship Discovery Board table
CREATE TABLE IF NOT EXISTS internship_discoveries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  title VARCHAR(255) NOT NULL,
  company VARCHAR(255) NOT NULL,
  url VARCHAR(1000),
  
  source VARCHAR(50) DEFAULT 'other'
    CHECK (source IN ('linkedin', 'whatsapp', 'company_website', 'rozee', 'mustakbil', 'other')),
  
  status VARCHAR(50) DEFAULT 'saved'
    CHECK (status IN ('saved', 'applied', 'expired')),
  
  deadline DATE,
  notes TEXT,
  is_remote BOOLEAN DEFAULT FALSE,
  location VARCHAR(255),
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for fast user queries
CREATE INDEX IF NOT EXISTS idx_discoveries_user_id ON internship_discoveries(user_id);