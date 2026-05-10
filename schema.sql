-- AI Career Assistant Schema
-- Tables for personas, resumes, job analyses, and Runway integration

-- Create personas table
CREATE TABLE IF NOT EXISTS personas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  name VARCHAR(255) NOT NULL,
  title VARCHAR(255),
  bio TEXT,
  skills TEXT[] DEFAULT '{}',
  experience_years INT,
  target_roles TEXT[] DEFAULT '{}',
  avatar_url VARCHAR(500),
  is_active BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES neon_auth."user"(id) ON DELETE CASCADE
);

-- Create resumes table
CREATE TABLE IF NOT EXISTS resumes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  persona_id UUID NOT NULL,
  original_filename VARCHAR(255) NOT NULL,
  file_url VARCHAR(500),
  raw_text TEXT,
  parsed_data JSONB,
  skills TEXT[] DEFAULT '{}',
  experience JSONB,
  education JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES neon_auth."user"(id) ON DELETE CASCADE,
  FOREIGN KEY (persona_id) REFERENCES personas(id) ON DELETE CASCADE
);

-- Create job_analyses table
CREATE TABLE IF NOT EXISTS job_analyses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  persona_id UUID NOT NULL,
  job_title VARCHAR(255) NOT NULL,
  company_name VARCHAR(255),
  job_description TEXT,
  job_url VARCHAR(500),
  extracted_from_dom BOOLEAN DEFAULT false,
  compatibility_score FLOAT,
  skill_gaps JSONB,
  matching_skills TEXT[] DEFAULT '{}',
  analysis_details JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (persona_id) REFERENCES personas(id) ON DELETE CASCADE
);

-- Create runway_sessions table
CREATE TABLE IF NOT EXISTS runway_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  persona_id UUID,
  runway_character_id VARCHAR(255),
  runway_session_id VARCHAR(255),
  session_type VARCHAR(50), -- 'voice', 'text', 'practice'
  transcript TEXT,
  duration_seconds INT,
  notes JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  ended_at TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES neon_auth."user"(id) ON DELETE CASCADE,
  FOREIGN KEY (persona_id) REFERENCES personas(id) ON DELETE SET NULL
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS personas_user_id_idx ON personas(user_id);
CREATE INDEX IF NOT EXISTS personas_is_active_idx ON personas(is_active);
CREATE INDEX IF NOT EXISTS resumes_user_id_idx ON resumes(user_id);
CREATE INDEX IF NOT EXISTS resumes_persona_id_idx ON resumes(persona_id);
CREATE INDEX IF NOT EXISTS job_analyses_persona_id_idx ON job_analyses(persona_id);
CREATE INDEX IF NOT EXISTS runway_sessions_user_id_idx ON runway_sessions(user_id);
CREATE INDEX IF NOT EXISTS runway_sessions_persona_id_idx ON runway_sessions(persona_id);
