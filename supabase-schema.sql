-- Arento Database Schema
-- Run this in Supabase SQL Editor

-- 1. Clients Table
CREATE TABLE clients (
  client_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name TEXT NOT NULL,
  mobile_number TEXT,
  gst_number TEXT,
  billing_headline TEXT,
  office_address TEXT,
  company_logo TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Users Table
CREATE TABLE users (
  user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES clients(client_id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Inventory Items Table
CREATE TABLE inventory_items (
  inventory_item_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES clients(client_id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  sku TEXT NOT NULL,
  category TEXT,
  unit TEXT,
  quantity INTEGER DEFAULT 0,
  min_stock INTEGER DEFAULT 0,
  normal_stock INTEGER DEFAULT 0,
  cost_price DECIMAL(10,2) DEFAULT 0,
  selling_price DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(client_id, sku)
);

-- 4. Sales Transactions Table
CREATE TABLE sales_transactions (
  sales_transaction_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES clients(client_id) ON DELETE CASCADE,
  invoice_number TEXT NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(client_id, invoice_number)
);

-- 5. Sales Transaction Items Table
CREATE TABLE sales_transaction_items (
  sales_transaction_item_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sales_transaction_id UUID NOT NULL REFERENCES sales_transactions(sales_transaction_id) ON DELETE CASCADE,
  inventory_item_id UUID NOT NULL REFERENCES inventory_items(inventory_item_id) ON DELETE RESTRICT,
  quantity INTEGER NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL
);

-- 6. Stock Movements Table
CREATE TABLE stock_movements (
  stock_movement_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES clients(client_id) ON DELETE CASCADE,
  inventory_item_id UUID NOT NULL REFERENCES inventory_items(inventory_item_id) ON DELETE CASCADE,
  sales_transaction_id UUID REFERENCES sales_transactions(sales_transaction_id) ON DELETE SET NULL,
  movement_type TEXT NOT NULL,
  quantity_change INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Purchase Transactions Table
CREATE TABLE purchase_transactions (
  purchase_transaction_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES clients(client_id) ON DELETE CASCADE,
  invoice_number TEXT NOT NULL,
  vendor_name TEXT,
  total_amount DECIMAL(10,2) NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(client_id, invoice_number)
);

-- 8. Purchase Transaction Items Table
CREATE TABLE purchase_transaction_items (
  purchase_transaction_item_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  purchase_transaction_id UUID NOT NULL REFERENCES purchase_transactions(purchase_transaction_id) ON DELETE CASCADE,
  inventory_item_id UUID NOT NULL REFERENCES inventory_items(inventory_item_id) ON DELETE RESTRICT,
  quantity INTEGER NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL
);

-- Indexes for performance
CREATE INDEX idx_users_client_id ON users(client_id);
CREATE INDEX idx_inventory_items_client_id ON inventory_items(client_id);
CREATE INDEX idx_sales_transactions_client_id ON sales_transactions(client_id);
CREATE INDEX idx_sales_transaction_items_transaction_id ON sales_transaction_items(sales_transaction_id);
CREATE INDEX idx_purchase_transactions_client_id ON purchase_transactions(client_id);
CREATE INDEX idx_purchase_transaction_items_transaction_id ON purchase_transaction_items(purchase_transaction_id);
CREATE INDEX idx_stock_movements_client_id ON stock_movements(client_id);
CREATE INDEX idx_stock_movements_inventory_item_id ON stock_movements(inventory_item_id);

-- Trigger to update inventory_items.updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_inventory_items_updated_at
BEFORE UPDATE ON inventory_items
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales_transaction_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchase_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchase_transaction_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE stock_movements ENABLE ROW LEVEL SECURITY;

-- RLS Policies (users can only access their own client's data)
CREATE POLICY "Users can view their own client data" ON clients
  FOR SELECT USING (client_id IN (SELECT client_id FROM users WHERE email = auth.jwt()->>'email'));

CREATE POLICY "Users can view their own user data" ON users
  FOR SELECT USING (email = auth.jwt()->>'email' OR client_id IN (SELECT client_id FROM users WHERE email = auth.jwt()->>'email'));

CREATE POLICY "Users can view their client's inventory" ON inventory_items
  FOR ALL USING (client_id IN (SELECT client_id FROM users WHERE email = auth.jwt()->>'email'));

CREATE POLICY "Users can view their client's sales" ON sales_transactions
  FOR ALL USING (client_id IN (SELECT client_id FROM users WHERE email = auth.jwt()->>'email'));

CREATE POLICY "Users can view their client's sales items" ON sales_transaction_items
  FOR ALL USING (sales_transaction_id IN (SELECT sales_transaction_id FROM sales_transactions WHERE client_id IN (SELECT client_id FROM users WHERE email = auth.jwt()->>'email')));

CREATE POLICY "Users can view their client's stock movements" ON stock_movements
  FOR ALL USING (client_id IN (SELECT client_id FROM users WHERE email = auth.jwt()->>'email'));

CREATE POLICY "Users can view their client's purchases" ON purchase_transactions
  FOR ALL USING (client_id IN (SELECT client_id FROM users WHERE email = auth.jwt()->>'email'));

CREATE POLICY "Users can view their client's purchase items" ON purchase_transaction_items
  FOR ALL USING (purchase_transaction_id IN (SELECT purchase_transaction_id FROM purchase_transactions WHERE client_id IN (SELECT client_id FROM users WHERE email = auth.jwt()->>'email')));
