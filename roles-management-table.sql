-- Create roles_management table
CREATE TABLE IF NOT EXISTS roles_management (
    role_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID NOT NULL REFERENCES clients(client_id) ON DELETE CASCADE,
    role_name VARCHAR(100) NOT NULL,
    role_description TEXT,
    add_sales_purchase SMALLINT DEFAULT 0 CHECK (add_sales_purchase IN (0, 1)),
    add_inventory SMALLINT DEFAULT 0 CHECK (add_inventory IN (0, 1)),
    modify_delete_inventory SMALLINT DEFAULT 0 CHECK (modify_delete_inventory IN (0, 1)),
    export_inventory SMALLINT DEFAULT 0 CHECK (export_inventory IN (0, 1)),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(client_id, role_name)
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_roles_management_client_id ON roles_management(client_id);

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_roles_management_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_roles_management_updated_at
    BEFORE UPDATE ON roles_management
    FOR EACH ROW
    EXECUTE FUNCTION update_roles_management_updated_at();

-- Disable RLS (since we're using custom auth)
ALTER TABLE roles_management DISABLE ROW LEVEL SECURITY;

-- Insert default Owner role for existing clients
INSERT INTO roles_management (client_id, role_name, role_description, add_sales_purchase, add_inventory, modify_delete_inventory, export_inventory)
SELECT 
    client_id, 
    'Owner', 
    'Default role with full access', 
    0, 0, 0, 0
FROM clients
ON CONFLICT (client_id, role_name) DO NOTHING;

-- Create trigger function to auto-create Owner role for new clients
CREATE OR REPLACE FUNCTION create_default_owner_role()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO roles_management (client_id, role_name, role_description, add_sales_purchase, add_inventory, modify_delete_inventory, export_inventory)
    VALUES (NEW.client_id, 'Owner', 'Default role with full access', 0, 0, 0, 0)
    ON CONFLICT (client_id, role_name) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-create Owner role when new client is inserted
CREATE TRIGGER trigger_create_default_owner_role
    AFTER INSERT ON clients
    FOR EACH ROW
    EXECUTE FUNCTION create_default_owner_role();
