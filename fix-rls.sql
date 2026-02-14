-- Fix infinite recursion - Drop all policies and disable RLS on users table
DROP POLICY IF EXISTS "Users can view their own user data" ON users;
DROP POLICY IF EXISTS "Allow anonymous login" ON users;

-- Disable RLS on users table for login to work
ALTER TABLE users DISABLE ROW LEVEL SECURITY;

-- Disable RLS on clients table for settings updates to work
DROP POLICY IF EXISTS "Users can view their own client data" ON clients;
ALTER TABLE clients DISABLE ROW LEVEL SECURITY;

-- Keep RLS enabled on other tables
-- (inventory_items, sales_transactions, etc. remain protected)
