-- Flyway Migration V2: Initial Seed Data
-- Smart Parking Lot Management System

-- Insert Default Roles
INSERT INTO roles (id, name) VALUES (1, 'ROLE_ADMIN') ON DUPLICATE KEY UPDATE name=name;
INSERT INTO roles (id, name) VALUES (2, 'ROLE_STAFF') ON DUPLICATE KEY UPDATE name=name;

-- Seed Parking Slots across 3 Floors
-- Floor 1: Car Slots (A-101 to A-110), Bike Slots (B-101 to B-105), Truck Slots (T-101 to T-103)
INSERT INTO parking_slot (id, slot_number, slot_type, floor_number, status) VALUES
(1, 'A-101', 'CAR', 1, 'OCCUPIED'),
(2, 'A-102', 'CAR', 1, 'OCCUPIED'),
(3, 'A-103', 'CAR', 1, 'AVAILABLE'),
(4, 'A-104', 'CAR', 1, 'AVAILABLE'),
(5, 'A-105', 'CAR', 1, 'AVAILABLE'),
(6, 'A-106', 'CAR', 1, 'AVAILABLE'),
(7, 'A-107', 'CAR', 1, 'DISABLED'),
(8, 'A-108', 'CAR', 1, 'AVAILABLE'),
(9, 'A-109', 'CAR', 1, 'AVAILABLE'),
(10, 'A-110', 'CAR', 1, 'AVAILABLE'),

(11, 'B-101', 'BIKE', 1, 'OCCUPIED'),
(12, 'B-102', 'BIKE', 1, 'AVAILABLE'),
(13, 'B-103', 'BIKE', 1, 'AVAILABLE'),
(14, 'B-104', 'BIKE', 1, 'AVAILABLE'),
(15, 'B-105', 'BIKE', 1, 'AVAILABLE'),

(16, 'T-101', 'TRUCK', 1, 'OCCUPIED'),
(17, 'T-102', 'TRUCK', 1, 'AVAILABLE'),
(18, 'T-103', 'TRUCK', 1, 'AVAILABLE'),

-- Floor 2: Car Slots (A-201 to A-208), Bike Slots (B-201 to B-205)
(19, 'A-201', 'CAR', 2, 'AVAILABLE'),
(20, 'A-202', 'CAR', 2, 'AVAILABLE'),
(21, 'A-203', 'CAR', 2, 'AVAILABLE'),
(22, 'A-204', 'CAR', 2, 'AVAILABLE'),
(23, 'A-205', 'CAR', 2, 'AVAILABLE'),
(24, 'A-206', 'CAR', 2, 'AVAILABLE'),
(25, 'A-207', 'CAR', 2, 'AVAILABLE'),
(26, 'A-208', 'CAR', 2, 'AVAILABLE'),

(27, 'B-201', 'BIKE', 2, 'AVAILABLE'),
(28, 'B-202', 'BIKE', 2, 'AVAILABLE'),
(29, 'B-203', 'BIKE', 2, 'AVAILABLE'),
(30, 'B-204', 'BIKE', 2, 'AVAILABLE'),
(31, 'B-205', 'BIKE', 2, 'AVAILABLE'),

-- Floor 3: VIP & Reserve Slots (A-301 to A-305)
(32, 'A-301', 'CAR', 3, 'AVAILABLE'),
(33, 'A-302', 'CAR', 3, 'AVAILABLE'),
(34, 'A-303', 'CAR', 3, 'AVAILABLE'),
(35, 'A-304', 'CAR', 3, 'AVAILABLE'),
(36, 'A-305', 'CAR', 3, 'AVAILABLE')
ON DUPLICATE KEY UPDATE slot_number=slot_number;

-- Seed Initial Demo Vehicles
INSERT INTO vehicle (id, vehicle_number, vehicle_type, owner_name, owner_contact, created_at, updated_at) VALUES
(1, 'PB10AB1234', 'CAR', 'Rahul Sharma', '+919876543210', '2026-07-24 10:00:00', '2026-07-24 10:00:00'),
(2, 'CH01CC5678', 'CAR', 'Priya Verma', '+919812345678', '2026-07-24 11:30:00', '2026-07-24 11:30:00'),
(3, 'DL03XY9999', 'BIKE', 'Amit Patel', '+919988776655', '2026-07-24 12:15:00', '2026-07-24 12:15:00'),
(4, 'HR26DQ1111', 'TRUCK', 'Vikram Singh', '+919711223344', '2026-07-24 09:00:00', '2026-07-24 09:00:00')
ON DUPLICATE KEY UPDATE vehicle_number=vehicle_number;

-- Seed Initial Active Parking Sessions
INSERT INTO parking_session (id, vehicle_id, slot_id, owner_name, owner_contact, entry_time, status, parking_fee) VALUES
(100, 1, 1, 'Rahul Sharma', '+919876543210', '2026-07-24 10:00:00', 'ACTIVE', 0.00),
(101, 2, 2, 'Priya Verma', '+919812345678', '2026-07-24 11:30:00', 'ACTIVE', 0.00),
(102, 3, 11, 'Amit Patel', '+919988776655', '2026-07-24 12:15:00', 'ACTIVE', 0.00),
(103, 4, 16, 'Vikram Singh', '+919711223344', '2026-07-24 09:00:00', 'ACTIVE', 0.00)
ON DUPLICATE KEY UPDATE status=status;
