-- Add vendor_name column to inventory_items table
ALTER TABLE inventory_items ADD COLUMN IF NOT EXISTS vendor_name TEXT;
