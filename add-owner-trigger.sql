-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS trigger_create_default_owner_role ON clients;

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

-- Insert Owner role for all existing clients
INSERT INTO roles_management (client_id, role_name, role_description, add_sales_purchase, add_inventory, modify_delete_inventory, export_inventory)
SELECT 
    client_id, 
    'Owner', 
    'Default role with full access', 
    0, 0, 0, 0
FROM clients
ON CONFLICT (client_id, role_name) DO NOTHING;
