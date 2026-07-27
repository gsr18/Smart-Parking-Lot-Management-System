-- V8: Database Cleanup & Performance Index Optimization for High Scalability (10k+ Users)

-- 1. Remove any dummy/seed user accounts to allow fresh self-signup
DELETE FROM user_roles;
DELETE FROM users;
DELETE FROM pending_registrations;

-- 2. Add Scalability Performance Indexes
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_company ON users(company_id);

CREATE INDEX IF NOT EXISTS idx_pending_email ON pending_registrations(email);
CREATE INDEX IF NOT EXISTS idx_pending_company ON pending_registrations(company_id);
CREATE INDEX IF NOT EXISTS idx_pending_token ON pending_registrations(approval_token);

CREATE INDEX IF NOT EXISTS idx_slot_company ON parking_slot(company_id);
CREATE INDEX IF NOT EXISTS idx_session_company_status ON parking_session(company_id, status);
