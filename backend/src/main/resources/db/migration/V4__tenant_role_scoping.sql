-- V4: Multi-Tenant Company & Staff Role Data Isolation

-- 1. Add company_id to parking_slot
ALTER TABLE parking_slot ADD COLUMN company_id BIGINT NULL;
ALTER TABLE parking_slot ADD CONSTRAINT fk_slot_company FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE;

-- 2. Add company_id and staff_id to parking_session
ALTER TABLE parking_session ADD COLUMN company_id BIGINT NULL;
ALTER TABLE parking_session ADD COLUMN staff_id BIGINT NULL;
ALTER TABLE parking_session ADD CONSTRAINT fk_session_company FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE;
ALTER TABLE parking_session ADD CONSTRAINT fk_session_staff FOREIGN KEY (staff_id) REFERENCES users(id) ON DELETE SET NULL;

-- 3. Add company_id to vehicle
ALTER TABLE vehicle ADD COLUMN company_id BIGINT NULL;
ALTER TABLE vehicle ADD CONSTRAINT fk_vehicle_company FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE;

-- 4. Associate initial seed data with default company (ID 1)
UPDATE parking_slot SET company_id = 1 WHERE company_id IS NULL;
UPDATE parking_session SET company_id = 1 WHERE company_id IS NULL;
UPDATE vehicle SET company_id = 1 WHERE company_id IS NULL;
