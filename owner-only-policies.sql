-- Enable RLS on clients table
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;

-- Policy: Only owners can update client data
CREATE POLICY "owners_can_update_clients" ON clients
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.client_id = clients.client_id
    AND users.role = 'Owner'
  )
);

-- Policy: Everyone can read their own client data
CREATE POLICY "users_can_read_own_client" ON clients
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.client_id = clients.client_id
  )
);

-- Enable RLS on roles_management table
ALTER TABLE roles_management ENABLE ROW LEVEL SECURITY;

-- Policy: Only owners can insert roles
CREATE POLICY "owners_can_insert_roles" ON roles_management
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.client_id = roles_management.client_id
    AND users.role = 'Owner'
  )
);

-- Policy: Only owners can update roles
CREATE POLICY "owners_can_update_roles" ON roles_management
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.client_id = roles_management.client_id
    AND users.role = 'Owner'
  )
);

-- Policy: Everyone can read roles from their client
CREATE POLICY "users_can_read_own_roles" ON roles_management
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.client_id = roles_management.client_id
  )
);
