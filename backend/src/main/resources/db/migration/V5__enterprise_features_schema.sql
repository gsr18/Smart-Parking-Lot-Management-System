-- =========================================================
-- Flyway Migration V5: Enterprise SmartParking System Schema
-- =========================================================

-- 1. Staff Shift Management Table
CREATE TABLE IF NOT EXISTS staff_shifts (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    company_id BIGINT NOT NULL,
    start_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    end_time TIMESTAMP NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    checkins_count INT NOT NULL DEFAULT 0,
    checkouts_count INT NOT NULL DEFAULT 0,
    revenue_collected DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    notes VARCHAR(255) NULL,
    CONSTRAINT fk_shift_user FOREIGN KEY (user_id) REFERENCES users(id),
    CONSTRAINT fk_shift_company FOREIGN KEY (company_id) REFERENCES companies(id)
);

CREATE INDEX idx_shift_user_status ON staff_shifts(user_id, status);
CREATE INDEX idx_shift_company_status ON staff_shifts(company_id, status);

-- 2. Incident Reporting Table
CREATE TABLE IF NOT EXISTS incidents (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    incident_number VARCHAR(50) NOT NULL UNIQUE,
    company_id BIGINT NOT NULL,
    reported_by_user_id BIGINT NOT NULL,
    slot_id BIGINT NULL,
    vehicle_number VARCHAR(20) NULL,
    type VARCHAR(50) NOT NULL,
    priority VARCHAR(20) NOT NULL DEFAULT 'MEDIUM',
    notes TEXT NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'OPEN',
    admin_notes TEXT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP NULL,
    CONSTRAINT fk_incident_company FOREIGN KEY (company_id) REFERENCES companies(id),
    CONSTRAINT fk_incident_reporter FOREIGN KEY (reported_by_user_id) REFERENCES users(id),
    CONSTRAINT fk_incident_slot FOREIGN KEY (slot_id) REFERENCES parking_slot(id)
);

CREATE INDEX idx_incident_company_status ON incidents(company_id, status);

-- 3. Maintenance Requests Table
CREATE TABLE IF NOT EXISTS maintenance_requests (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    company_id BIGINT NOT NULL,
    slot_id BIGINT NOT NULL,
    reported_by_user_id BIGINT NOT NULL,
    issue_type VARCHAR(50) NOT NULL,
    notes TEXT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    approved_by_user_id BIGINT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_maint_company FOREIGN KEY (company_id) REFERENCES companies(id),
    CONSTRAINT fk_maint_slot FOREIGN KEY (slot_id) REFERENCES parking_slot(id),
    CONSTRAINT fk_maint_reporter FOREIGN KEY (reported_by_user_id) REFERENCES users(id),
    CONSTRAINT fk_maint_approver FOREIGN KEY (approved_by_user_id) REFERENCES users(id)
);

-- 4. Vehicle Watchlist Table
CREATE TABLE IF NOT EXISTS vehicle_watchlist (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    company_id BIGINT NOT NULL,
    vehicle_number VARCHAR(20) NOT NULL,
    category VARCHAR(30) NOT NULL DEFAULT 'BLACK_LISTED',
    reason TEXT NOT NULL,
    outstanding_dues DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_watchlist_company FOREIGN KEY (company_id) REFERENCES companies(id),
    CONSTRAINT uk_company_vehicle UNIQUE (company_id, vehicle_number)
);

-- 5. Vehicle Reservations Table
CREATE TABLE IF NOT EXISTS reservations (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    company_id BIGINT NOT NULL,
    vehicle_number VARCHAR(20) NOT NULL,
    slot_id BIGINT NOT NULL,
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'CONFIRMED',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_res_company FOREIGN KEY (company_id) REFERENCES companies(id),
    CONSTRAINT fk_res_slot FOREIGN KEY (slot_id) REFERENCES parking_slot(id)
);

-- 6. Dynamic Pricing Policy Table
CREATE TABLE IF NOT EXISTS pricing_policies (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    company_id BIGINT NOT NULL UNIQUE,
    car_hourly_rate DECIMAL(10,2) NOT NULL DEFAULT 50.00,
    bike_hourly_rate DECIMAL(10,2) NOT NULL DEFAULT 20.00,
    truck_hourly_rate DECIMAL(10,2) NOT NULL DEFAULT 120.00,
    peak_multiplier DECIMAL(4,2) NOT NULL DEFAULT 1.20,
    weekend_multiplier DECIMAL(4,2) NOT NULL DEFAULT 1.15,
    lost_ticket_fee DECIMAL(10,2) NOT NULL DEFAULT 500.00,
    peak_start_hour INT NOT NULL DEFAULT 18,
    peak_end_hour INT NOT NULL DEFAULT 22,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_pricing_company FOREIGN KEY (company_id) REFERENCES companies(id)
);

-- 7. Admin Mandatory Audit Logs Table
CREATE TABLE IF NOT EXISTS admin_audit_logs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    company_id BIGINT NOT NULL,
    admin_user_id BIGINT NOT NULL,
    action_type VARCHAR(50) NOT NULL,
    entity_name VARCHAR(50) NOT NULL,
    entity_id BIGINT NULL,
    reason TEXT NOT NULL,
    timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_audit_company FOREIGN KEY (company_id) REFERENCES companies(id),
    CONSTRAINT fk_audit_admin FOREIGN KEY (admin_user_id) REFERENCES users(id)
);

CREATE INDEX idx_audit_company_time ON admin_audit_logs(company_id, timestamp);

-- 8. Add emergency_mode flag to companies table
ALTER TABLE companies ADD COLUMN IF NOT EXISTS emergency_mode BOOLEAN DEFAULT FALSE;
