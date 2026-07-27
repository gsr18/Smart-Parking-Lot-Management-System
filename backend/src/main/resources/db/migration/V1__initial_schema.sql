-- Flyway Migration V1: Initial Database Schema
-- Smart Parking Lot Management System

CREATE TABLE IF NOT EXISTS roles (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    enabled BOOLEAN NOT NULL DEFAULT TRUE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS user_roles (
    user_id BIGINT NOT NULL,
    role_id BIGINT NOT NULL,
    PRIMARY KEY (user_id, role_id),
    CONSTRAINT fk_user_roles_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_user_roles_role FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS vehicle (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    vehicle_number VARCHAR(20) NOT NULL UNIQUE,
    vehicle_type VARCHAR(20) NOT NULL,
    owner_name VARCHAR(100) NOT NULL,
    owner_contact VARCHAR(15) NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_vehicle_number (vehicle_number),
    INDEX idx_vehicle_type (vehicle_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS parking_slot (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    slot_number VARCHAR(20) NOT NULL UNIQUE,
    slot_type VARCHAR(20) NOT NULL,
    floor_number INT NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'AVAILABLE',
    version BIGINT NOT NULL DEFAULT 0,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_slot_number (slot_number),
    INDEX idx_slot_status (status),
    INDEX idx_slot_type (slot_type),
    INDEX idx_slot_floor (floor_number),
    INDEX idx_slot_status_type (status, slot_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS parking_session (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    vehicle_id BIGINT NOT NULL,
    slot_id BIGINT NOT NULL,
    owner_name VARCHAR(100) NOT NULL,
    owner_contact VARCHAR(15) NOT NULL,
    entry_time DATETIME NOT NULL,
    exit_time DATETIME NULL,
    duration_minutes INT NULL,
    parking_fee DECIMAL(10, 2) NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_session_vehicle FOREIGN KEY (vehicle_id) REFERENCES vehicle(id),
    CONSTRAINT fk_session_slot FOREIGN KEY (slot_id) REFERENCES parking_slot(id),
    INDEX idx_session_status (status),
    INDEX idx_session_entry_time (entry_time),
    INDEX idx_session_vehicle (vehicle_id),
    INDEX idx_session_slot (slot_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS receipt (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    receipt_number VARCHAR(30) NOT NULL UNIQUE,
    parking_session_id BIGINT NOT NULL UNIQUE,
    generated_time DATETIME NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_receipt_session FOREIGN KEY (parking_session_id) REFERENCES parking_session(id),
    INDEX idx_receipt_number (receipt_number)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
