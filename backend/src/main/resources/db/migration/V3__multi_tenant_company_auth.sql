-- V3: Multi-Tenant Company Schema & Pending OTP Registrations

-- 1. Create Companies Table
CREATE TABLE IF NOT EXISTS companies (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    company_code VARCHAR(50) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 2. Insert Default Demo Company
INSERT INTO companies (id, name, company_code, created_at, updated_at)
VALUES (1, 'SmartParking Enterprise', 'COMP-DEFAULT-001', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON DUPLICATE KEY UPDATE name=name;

-- 3. Add company_id and approved_by_admin columns to Users Table
ALTER TABLE users ADD COLUMN company_id BIGINT NULL;
ALTER TABLE users ADD COLUMN approved_by_admin BOOLEAN DEFAULT TRUE;

-- Add Foreign Key Constraint to Companies
ALTER TABLE users ADD CONSTRAINT fk_user_company FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE SET NULL;

-- 4. Create Pending Registrations Table for OTP Verification & Admin Approvals
CREATE TABLE IF NOT EXISTS pending_registrations (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(100) NOT NULL,
    otp_code VARCHAR(10) NOT NULL,
    user_type VARCHAR(20) NOT NULL, -- 'ADMIN' or 'STAFF'
    company_name VARCHAR(100) NULL,
    company_id BIGINT NULL,
    full_name VARCHAR(100) NOT NULL,
    username VARCHAR(50) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    approved_by_admin BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
