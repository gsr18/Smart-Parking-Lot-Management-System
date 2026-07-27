-- V6: Add layout_config column to companies table
-- Stores JSON configuration of parking layout (floors + grid templates) per company

ALTER TABLE companies
    ADD COLUMN IF NOT EXISTS layout_config TEXT NULL;
