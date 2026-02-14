-- Disable RLS on inventory_items table to allow access
ALTER TABLE inventory_items DISABLE ROW LEVEL SECURITY;

-- Add vendor_name column if not exists
ALTER TABLE inventory_items ADD COLUMN IF NOT EXISTS vendor_name TEXT;
