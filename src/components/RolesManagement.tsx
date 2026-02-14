import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface RolesManagementProps {
  clientId: string | null;
  addNotification: (title: string, message: string) => void;
  userRole: string;
}

export function RolesManagement({ clientId, addNotification, userRole }: RolesManagementProps) {
  const [roles, setRoles] = useState<any[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [editingRole, setEditingRole] = useState<any>(null);
  const [newRoleName, setNewRoleName] = useState('');
  const [newRoleDescription, setNewRoleDescription] = useState('');
  const [permissions, setPermissions] = useState({
    addSalesPurchase: false,
    addInventory: false,
    modifyDeleteInventory: false,
    exportInventory: false,
  });

  const isOwner = userRole?.toLowerCase() === 'owner';

  useEffect(() => {
    if (clientId) {
      loadRoles();
    }
  }, [clientId]);

  const loadRoles = async () => {
    if (!supabase || !clientId) return;
    const { data } = await supabase
      .from('roles_management')
      .select('*')
      .eq('client_id', clientId)
      .order('role_name');
    
    if (data) {
      // Sort to show Owner first, then others alphabetically
      const sorted = data.sort((a, b) => {
        if (a.role_name.toLowerCase() === 'owner') return -1;
        if (b.role_name.toLowerCase() === 'owner') return 1;
        return a.role_name.localeCompare(b.role_name);
      });
      setRoles(sorted);
    }
  };

  const handleCreateRole = async () => {
    if (!isOwner) {
      addNotification('Access Denied', 'Only owners can create roles.');
      return;
    }

    if (!newRoleName.trim()) {
      addNotification('Validation Error', 'Please enter a role name.');
      return;
    }

    if (roles.some(r => r.role_name.toLowerCase() === newRoleName.trim().toLowerCase())) {
      addNotification('Validation Error', 'This role already exists.');
      return;
    }

    const { error } = await supabase
      .from('roles_management')
      .insert({
        client_id: clientId,
        role_name: newRoleName.trim(),
        role_description: newRoleDescription.trim(),
        add_sales_purchase: permissions.addSalesPurchase ? 0 : 1,
        add_inventory: permissions.addInventory ? 0 : 1,
        modify_delete_inventory: permissions.modifyDeleteInventory ? 0 : 1,
        export_inventory: permissions.exportInventory ? 0 : 1,
      });

    if (error) {
      addNotification('Error', 'Failed to create role.');
      return;
    }

    addNotification('Role Created!', `Role "${newRoleName}" has been created successfully.`);
    setNewRoleName('');
    setNewRoleDescription('');
    setPermissions({
      addSalesPurchase: false,
      addInventory: false,
      modifyDeleteInventory: false,
      exportInventory: false,
    });
    setIsCreating(false);
    loadRoles();
  };

  const handleEditRole = (role: any) => {
    if (!isOwner) {
      addNotification('Access Denied', 'Only owners can edit roles.');
      return;
    }
    setEditingRole(role);
    setNewRoleName(role.role_name);
    setNewRoleDescription(role.role_description || '');
    setPermissions({
      addSalesPurchase: role.add_sales_purchase === 0,
      addInventory: role.add_inventory === 0,
      modifyDeleteInventory: role.modify_delete_inventory === 0,
      exportInventory: role.export_inventory === 0,
    });
  };

  const handleUpdateRole = async () => {
    if (!isOwner) {
      addNotification('Access Denied', 'Only owners can update roles.');
      return;
    }

    if (!newRoleName.trim()) {
      addNotification('Validation Error', 'Please enter a role name.');
      return;
    }

    const { error } = await supabase
      .from('roles_management')
      .update({
        role_name: newRoleName.trim(),
        role_description: newRoleDescription.trim(),
        add_sales_purchase: permissions.addSalesPurchase ? 0 : 1,
        add_inventory: permissions.addInventory ? 0 : 1,
        modify_delete_inventory: permissions.modifyDeleteInventory ? 0 : 1,
        export_inventory: permissions.exportInventory ? 0 : 1,
      })
      .eq('role_id', editingRole.role_id);

    if (error) {
      addNotification('Error', 'Failed to update role.');
      return;
    }

    addNotification('Role Updated!', `Role "${newRoleName}" has been updated successfully.`);
    setEditingRole(null);
    setNewRoleName('');
    setNewRoleDescription('');
    setPermissions({
      addSalesPurchase: false,
      addInventory: false,
      modifyDeleteInventory: false,
      exportInventory: false,
    });
    loadRoles();
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
      <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-[#072741]" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Roles Management
          </h2>
          <p className="text-xs text-gray-500 mt-1" style={{ fontFamily: 'Inter, sans-serif' }}>
            Create and manage user roles for your organization
          </p>
        </div>
        {!isCreating && !editingRole && isOwner && (
          <button
            onClick={() => setIsCreating(true)}
            className="px-4 py-2 bg-[#348ADC] hover:bg-[#2a6fb0] text-white rounded-lg text-sm font-medium transition shadow-sm"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            + Create Role
          </button>
        )}
      </div>

      <div className="p-6 space-y-4">
        {editingRole && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-[#072741] mb-3" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Edit Role
            </h3>
            <div className="space-y-3">
              <input
                type="text"
                value={newRoleName}
                onChange={(e) => setNewRoleName(e.target.value)}
                placeholder="Role name (e.g., Manager, Staff)"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#348ADC]"
                style={{ fontFamily: 'Inter, sans-serif' }}
              />
              <input
                type="text"
                value={newRoleDescription}
                onChange={(e) => setNewRoleDescription(e.target.value)}
                placeholder="Brief description of this role"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#348ADC]"
                style={{ fontFamily: 'Inter, sans-serif' }}
              />
              
              <div className="bg-white rounded-lg p-3 border border-gray-200">
                <p className="text-xs font-semibold text-[#072741] mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>Permissions</p>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-xs text-gray-700 cursor-pointer" style={{ fontFamily: 'Inter, sans-serif' }}>
                    <input type="checkbox" checked={permissions.addSalesPurchase} onChange={(e) => setPermissions({...permissions, addSalesPurchase: e.target.checked})} className="w-4 h-4 text-[#348ADC] rounded" />
                    Add Sales and Purchase Entry
                  </label>
                  <label className="flex items-center gap-2 text-xs text-gray-700 cursor-pointer" style={{ fontFamily: 'Inter, sans-serif' }}>
                    <input type="checkbox" checked={permissions.addInventory} onChange={(e) => setPermissions({...permissions, addInventory: e.target.checked})} className="w-4 h-4 text-[#348ADC] rounded" />
                    Add Inventory
                  </label>
                  <label className="flex items-center gap-2 text-xs text-gray-700 cursor-pointer" style={{ fontFamily: 'Inter, sans-serif' }}>
                    <input type="checkbox" checked={permissions.modifyDeleteInventory} onChange={(e) => setPermissions({...permissions, modifyDeleteInventory: e.target.checked})} className="w-4 h-4 text-[#348ADC] rounded" />
                    Modify and Delete Inventory
                  </label>
                  <label className="flex items-center gap-2 text-xs text-gray-700 cursor-pointer" style={{ fontFamily: 'Inter, sans-serif' }}>
                    <input type="checkbox" checked={permissions.exportInventory} onChange={(e) => setPermissions({...permissions, exportInventory: e.target.checked})} className="w-4 h-4 text-[#348ADC] rounded" />
                    Export Inventory Data
                  </label>
                </div>
              </div>

              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => {
                    setEditingRole(null);
                    setNewRoleName('');
                    setNewRoleDescription('');
                    setPermissions({
                      addSalesPurchase: false,
                      addInventory: false,
                      modifyDeleteInventory: false,
                      exportInventory: false,
                    });
                  }}
                  className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateRole}
                  className="px-3 py-1.5 bg-[#348ADC] hover:bg-[#2a6fb0] text-white rounded-lg text-sm font-medium transition"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  Update
                </button>
              </div>
            </div>
          </div>
        )}

        {isCreating && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-[#072741] mb-3" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Create New Role
            </h3>
            <div className="space-y-3">
              <input
                type="text"
                value={newRoleName}
                onChange={(e) => setNewRoleName(e.target.value)}
                placeholder="Role name (e.g., Manager, Staff)"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#348ADC]"
                style={{ fontFamily: 'Inter, sans-serif' }}
              />
              <input
                type="text"
                value={newRoleDescription}
                onChange={(e) => setNewRoleDescription(e.target.value)}
                placeholder="Brief description of this role"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#348ADC]"
                style={{ fontFamily: 'Inter, sans-serif' }}
              />
              
              <div className="bg-white rounded-lg p-3 border border-gray-200">
                <p className="text-xs font-semibold text-[#072741] mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>Permissions</p>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-xs text-gray-700 cursor-pointer" style={{ fontFamily: 'Inter, sans-serif' }}>
                    <input type="checkbox" checked={permissions.addSalesPurchase} onChange={(e) => setPermissions({...permissions, addSalesPurchase: e.target.checked})} className="w-4 h-4 text-[#348ADC] rounded" />
                    Add Sales and Purchase Entry
                  </label>
                  <label className="flex items-center gap-2 text-xs text-gray-700 cursor-pointer" style={{ fontFamily: 'Inter, sans-serif' }}>
                    <input type="checkbox" checked={permissions.addInventory} onChange={(e) => setPermissions({...permissions, addInventory: e.target.checked})} className="w-4 h-4 text-[#348ADC] rounded" />
                    Add Inventory
                  </label>
                  <label className="flex items-center gap-2 text-xs text-gray-700 cursor-pointer" style={{ fontFamily: 'Inter, sans-serif' }}>
                    <input type="checkbox" checked={permissions.modifyDeleteInventory} onChange={(e) => setPermissions({...permissions, modifyDeleteInventory: e.target.checked})} className="w-4 h-4 text-[#348ADC] rounded" />
                    Modify and Delete Inventory
                  </label>
                  <label className="flex items-center gap-2 text-xs text-gray-700 cursor-pointer" style={{ fontFamily: 'Inter, sans-serif' }}>
                    <input type="checkbox" checked={permissions.exportInventory} onChange={(e) => setPermissions({...permissions, exportInventory: e.target.checked})} className="w-4 h-4 text-[#348ADC] rounded" />
                    Export Inventory Data
                  </label>
                </div>
              </div>

              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => {
                    setIsCreating(false);
                    setNewRoleName('');
                    setNewRoleDescription('');
                    setPermissions({
                      addSalesPurchase: false,
                      addInventory: false,
                      modifyDeleteInventory: false,
                      exportInventory: false,
                    });
                  }}
                  className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateRole}
                  className="px-3 py-1.5 bg-[#348ADC] hover:bg-[#2a6fb0] text-white rounded-lg text-sm font-medium transition"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  Add Role
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-3">
          {roles.length === 0 ? (
            <div className="text-center py-8 text-gray-500" style={{ fontFamily: 'Inter, sans-serif' }}>
              No roles found. Click "Create Role" to add one.
            </div>
          ) : (
            roles.map((role, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-[#348ADC] transition"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#348ADC]/10 flex items-center justify-center">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#348ADC" strokeWidth="2">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-[#072741]" style={{ fontFamily: 'Inter, sans-serif' }}>
                      {role.role_name}
                    </div>
                    <div className="text-xs text-gray-500" style={{ fontFamily: 'Inter, sans-serif' }}>
                      {role.role_description || 'No description'}
                      {role.role_name.toLowerCase() === 'owner' && ' • Default role'}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleEditRole(role)}
                  disabled={!isOwner}
                  className={`px-3 py-1.5 text-[#348ADC] hover:bg-[#348ADC]/10 rounded-lg text-sm font-medium transition ${!isOwner ? 'opacity-50 cursor-not-allowed' : ''}`}
                  style={{ fontFamily: 'Inter, sans-serif' }}
                  title={!isOwner ? 'Only owners can edit roles' : ''}
                >
                  Edit
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
