import { pgTable, text, varchar, uuid, timestamp, boolean, integer, real, jsonb, index } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

// Reference the neon_auth user table
export const authUser = pgTable('user', {
  id: uuid().primaryKey().default(sql`gen_random_uuid()`),
  email: varchar().notNull(),
  name: varchar(),
  image: varchar(),
}, (table) => ({
  __config: { schema: 'neon_auth' },
}));

// Personas table
export const personas = pgTable('personas', {
  id: uuid().primaryKey().default(sql`gen_random_uuid()`),
  userId: uuid('user_id').notNull(),
  name: varchar({ length: 255 }).notNull(),
  title: varchar({ length: 255 }),
  bio: text(),
  skills: text().array().default(sql`'{}'`),
  experienceYears: integer('experience_years'),
  targetRoles: text('target_roles').array().default(sql`'{}'`),
  avatarUrl: varchar({ length: 500 }),
  isActive: boolean('is_active').default(false),
  createdAt: timestamp('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp('updated_at').default(sql`CURRENT_TIMESTAMP`),
}, (table) => ({
  userIdIdx: index('personas_user_id_idx').on(table.userId),
  isActiveIdx: index('personas_is_active_idx').on(table.isActive),
}));

// Resumes table
export const resumes = pgTable('resumes', {
  id: uuid().primaryKey().default(sql`gen_random_uuid()`),
  userId: uuid('user_id').notNull(),
  personaId: uuid('persona_id').notNull(),
  originalFilename: varchar('original_filename', { length: 255 }).notNull(),
  fileUrl: varchar({ length: 500 }),
  rawText: text('raw_text'),
  parsedData: jsonb('parsed_data'),
  skills: text().array().default(sql`'{}'`),
  experience: jsonb(),
  education: jsonb(),
  createdAt: timestamp('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp('updated_at').default(sql`CURRENT_TIMESTAMP`),
}, (table) => ({
  userIdIdx: index('resumes_user_id_idx').on(table.userId),
  personaIdIdx: index('resumes_persona_id_idx').on(table.personaId),
}));

// Job Analyses table
export const jobAnalyses = pgTable('job_analyses', {
  id: uuid().primaryKey().default(sql`gen_random_uuid()`),
  personaId: uuid('persona_id').notNull(),
  jobTitle: varchar('job_title', { length: 255 }).notNull(),
  companyName: varchar('company_name', { length: 255 }),
  jobDescription: text('job_description'),
  jobUrl: varchar('job_url', { length: 500 }),
  extractedFromDom: boolean('extracted_from_dom').default(false),
  compatibilityScore: real('compatibility_score'),
  skillGaps: jsonb('skill_gaps'),
  matchingSkills: text('matching_skills').array().default(sql`'{}'`),
  analysisDetails: jsonb('analysis_details'),
  createdAt: timestamp('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp('updated_at').default(sql`CURRENT_TIMESTAMP`),
}, (table) => ({
  personaIdIdx: index('job_analyses_persona_id_idx').on(table.personaId),
}));

// Runway Sessions table
export const runwaySessions = pgTable('runway_sessions', {
  id: uuid().primaryKey().default(sql`gen_random_uuid()`),
  userId: uuid('user_id').notNull(),
  personaId: uuid('persona_id'),
  runwayCharacterId: varchar('runway_character_id', { length: 255 }),
  runwaySessionId: varchar('runway_session_id', { length: 255 }),
  sessionType: varchar('session_type', { length: 50 }),
  transcript: text(),
  durationSeconds: integer('duration_seconds'),
  notes: jsonb(),
  createdAt: timestamp('created_at').default(sql`CURRENT_TIMESTAMP`),
  endedAt: timestamp('ended_at'),
}, (table) => ({
  userIdIdx: index('runway_sessions_user_id_idx').on(table.userId),
  personaIdIdx: index('runway_sessions_persona_id_idx').on(table.personaId),
}));
