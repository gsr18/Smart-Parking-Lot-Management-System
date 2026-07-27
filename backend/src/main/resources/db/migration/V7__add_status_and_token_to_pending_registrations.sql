-- V7: Add status, approval_token, and rejection_reason columns to pending_registrations table

ALTER TABLE pending_registrations ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'PENDING';
ALTER TABLE pending_registrations ADD COLUMN IF NOT EXISTS approval_token VARCHAR(64) NULL;
ALTER TABLE pending_registrations ADD COLUMN IF NOT EXISTS rejection_reason VARCHAR(255) NULL;
