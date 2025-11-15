-- Migration: Create offers table for storing Shopee product data
-- Created: 2025-11-15
-- Description: Initial schema for storing Shopee Affiliate offer list data

-- Create main offers table
CREATE TABLE IF NOT EXISTS offers (
    offer_id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    price REAL,
    commission_rate REAL,
    commission REAL,
    link TEXT,
    image_url TEXT,
    category_name TEXT,
    updated_at INTEGER NOT NULL
);

-- Create indexes for query performance
CREATE INDEX IF NOT EXISTS idx_offers_updated_at ON offers(updated_at);
CREATE INDEX IF NOT EXISTS idx_offers_category ON offers(category_name);

-- Create migrations tracking table
CREATE TABLE IF NOT EXISTS _migrations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    applied_at INTEGER NOT NULL
);
