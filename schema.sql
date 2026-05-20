-- ==========================================
-- ZestRoute Database Schema
-- Version: 1.0.0
-- Created: May 20, 2026
-- Target: PostgreSQL / Supabase
-- ==========================================

BEGIN;

-- 1. Create SpiceKits Table
CREATE TABLE IF NOT EXISTS spice_kits (
    id BIGSERIAL PRIMARY KEY,
    sku VARCHAR(50) UNIQUE NOT NULL,
    recipe_name VARCHAR(255) NOT NULL,
    region VARCHAR(100) NOT NULL,
    key_spices TEXT[] NOT NULL, -- Array of dry spices included in the kit
    prep_time INTEGER NOT NULL CHECK (prep_time > 0), -- Active prep time in minutes
    difficulty VARCHAR(20) NOT NULL CHECK (difficulty IN ('Easy', 'Medium', 'Hard')),
    supplier_cost DECIMAL(10, 2) NOT NULL CHECK (supplier_cost >= 0), -- Cost from Spices Inc.
    retail_price DECIMAL(10, 2) NOT NULL CHECK (retail_price >= 0), -- Base target retail price
    inventory_count INTEGER NOT NULL DEFAULT 0 CHECK (inventory_count >= 0),
    description TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Performance Indexes
-- Index on region for region-based category filtering on the storefront
CREATE INDEX IF NOT EXISTS idx_spice_kits_region ON spice_kits(region);

-- Index on sku for inventory syncing and direct lookups
CREATE INDEX IF NOT EXISTS idx_spice_kits_sku ON spice_kits(sku);

-- Partial index on active kits for efficient public storefront catalog rendering
CREATE INDEX IF NOT EXISTS idx_spice_kits_active ON spice_kits(is_active) WHERE is_active = TRUE;

-- 3. Initial Seed Data (Verified Launch Menu Recipes)
INSERT INTO spice_kits (sku, recipe_name, region, key_spices, prep_time, difficulty, supplier_cost, retail_price, inventory_count, description)
VALUES 
(
    'ZK-THAI-001', 
    'Thai Green Curry', 
    'Southeast Asia', 
    ARRAY['Green Chile', 'Lemongrass', 'Galangal', 'Makrut Lime Leaf', 'Coriander Seed', 'Cumin', 'White Pepper'], 
    15, 
    'Medium', 
    1.15, 
    5.99, 
    500, 
    'A vibrant, aromatic spice blend capturing the authentic málà balance with premium milled galangal and citrusy makrut lime leaves.'
),
(
    'ZK-MOR-002', 
    'Moroccan Chicken Tagine', 
    'North Africa', 
    ARRAY['Sweet Paprika', 'Cumin', 'Ginger', 'Turmeric', 'Cinnamon', 'Black Pepper', 'Saffron'], 
    10, 
    'Easy', 
    1.45, 
    5.99, 
    450, 
    'An earthy, warm, and sweet spice combination featuring authentic Moroccan saffron and ground ginger for rich, slow-braised complexity in 20 minutes.'
),
(
    'ZK-SZE-003', 
    'Szechuan Mapo Tofu', 
    'East Asia', 
    ARRAY['Sichuan Peppercorns', 'Dried Red Chiles', 'White Sesame Seeds', 'Five-Spice Powder'], 
    10, 
    'Medium', 
    0.95, 
    5.99, 
    400, 
    'A fiery, tongue-numbing "málà" seasoning mix featuring hand-selected Grade A coarse-ground red Sichuan peppercorns.'
),
(
    'ZK-IND-004', 
    'Indian Butter Chicken', 
    'South Asia', 
    ARRAY['Kashmiri Chili', 'Garam Masala', 'Coriander', 'Kasuri Methi', 'Cardamom'], 
    10, 
    'Easy', 
    1.20, 
    5.99, 
    600, 
    'A highly concentrated, deeply aromatic spice blend featuring vibrant red Kashmiri chili and sweet, fragrant green cardamom.'
),
(
    'ZK-MEX-005', 
    'Mexican Al Pastor Tacos', 
    'Latin America', 
    ARRAY['Achiote Powder', 'Guajillo Chile', 'Pasilla Chile', 'Mexican Oregano', 'Garlic Powder', 'Cumin'], 
    15, 
    'Easy', 
    0.85, 
    5.99, 
    350, 
    'An authentic al pastor dry rub with rich achiote and rehydrated chile notes for a perfect street-taco char in under 15 minutes.'
);

COMMIT;
