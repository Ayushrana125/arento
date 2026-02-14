import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface UserManagementProps {
  clientId: string | null;
  addNotification: (title: string, message: string) => void;
  userRole: string;
}

export function UserManagement({ clientId, addNotification, userRole }: UserManagementProps) {
  const [users, setUsers] = useState<any[]>([]);
  const [roles, setRoles] = useState<any[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [newUser, setNewUser] = useState({
    fullName: '',
    email: '',
    password: '',
    role: ''
  });

  const isOwner = userRole?.toLowerCase() === 'owner';

  useEffect(() => {
    if (clientId) {
      loadUsers();
      loadRoles();
    }
  }, [clientId]);

  const loadUsers = async () => {
    if (!supabase || !clientId) return;
    const { data } = await supabase
      .from('users')
      .select('*')
      .eq('client_id', clientId)
      .order('user_fullname');
    
    if (data) {
      setUsers(data);
    }
  };

  const loadRoles = async () => {
    if (!supabase || !clientId) return;
    const { data } = await supabase
      .from('roles_management')
      .select('role_name')
      .eq('client_id', clientId)
      .order('role_name');
    
    if (data) {
      setRoles(data);
    }
  };

  const generatePassword = () => {
    const lowercase = 'abcdefghijkmnpqrstuvwxyz';
    const uppercase = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
    const numbers = '23456789';
    const symbols = '!@#$%&*+=?';
    const allChars = lowercase + uppercase + numbers + symbols;
    
    let password = '';
    // Ensure at least one of each type
    password += lowercase[Math.floor(Math.random() * lowercase.length)];
    password += uppercase[Math.floor(Math.random() * uppercase.length)];
    password += numbers[Math.floor(Math.random() * numbers.length)];
    password += symbols[Math.floor(Math.random() * symbols.length)];
    
    // Fill remaining characters (total 16)
    for (let i = 4; i < 16; i++) {
      password += allChars.charAt(Math.floor(Math.random() * allChars.length));
    }
    
    // Shuffle the password
    password = password.split('').sort(() => Math.random() - 0.5).join('');
    setNewUser({ ...newUser, password });
  };

  const handleCreateUser = async () => {
    if (!isOwner) {
      addNotification('Access Denied', 'Only owners can create users.');
      return;
    }

    if (!newUser.fullName.trim() || !newUser.email.trim() || !newUser.password.trim() || !newUser.role) {
      addNotification('Validation Error', 'Please fill all fields.');
      return;
    }

    const { error } = await supabase
      .from('users')
      .insert({
        client_id: clientId,
        user_fullname: newUser.fullName.trim(),
        user_email: newUser.email.trim(),
        user_password: newUser.password,
        role: newUser.role
      });

    if (error) {
      addNotification('Error', 'Failed to create user.');
      return;
    }

    addNotification('User Created!', `User "${newUser.fullName}" has been created successfully.`);
    setNewUser({ fullName: '', email: '', password: '', role: '' });
    setIsCreating(false);
    loadUsers();
  };

  const handleEditUser = (user: any) => {
    if (!isOwner) {
      addNotification('Access Denied', 'Only owners can edit users.');
      return;
    }
    setEditingUser(user);
    setNewUser({
      fullName: user.user_fullname,
      email: user.user_email,
      password: '',
      role: user.role
    });
  };

  const handleUpdateUser = async () => {
    if (!isOwner) {
      addNotification('Access Denied', 'Only owners can update users.');
      return;
    }

    if (!newUser.fullName.trim() || !newUser.email.trim() || !newUser.role) {
      addNotification('Validation Error', 'Please fill all required fields.');
      return;
    }

    const updateData: any = {
      user_fullname: newUser.fullName.trim(),
      user_email: newUser.email.trim(),
      role: newUser.role
    };

    // Only update password if provided
    if (newUser.password.trim()) {
      updateData.user_password = newUser.password;
    }

    const { error } = await supabase
      .from('users')
      .update(updateData)
      .eq('user_id', editingUser.user_id);

    if (error) {
      addNotification('Error', 'Failed to update user.');
      return;
    }

    addNotification('User Updated!', `User "${newUser.fullName}" has been updated successfully.`);
    setEditingUser(null);
    setNewUser({ fullName: '', email: '', password: '', role: '' });
    loadUsers();
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
      <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-[#072741]" style={{ fontFamily: 'Poppins, sans-serif' }}>
            User Management
          </h2>
          <p className="text-xs text-gray-500 mt-1" style={{ fontFamily: 'Inter, sans-serif' }}>
            Manage users and assign roles
          </p>
        </div>
        {!isCreating && !editingUser && isOwner && (
          <button
            onClick={() => setIsCreating(true)}
            className="px-4 py-2 bg-[#348ADC] hover:bg-[#2a6fb0] text-white rounded-lg text-sm font-medium transition shadow-sm"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            + Add User
          </button>
        )}
      </div>

      <div className="p-6 space-y-4">
        {editingUser && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-[#072741] mb-3" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Edit User
            </h3>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1" style={{ fontFamily: 'Inter, sans-serif' }}>
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={newUser.fullName}
                    onChange={(e) => setNewUser({ ...newUser, fullName: e.target.value })}
                    placeholder="Enter full name"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#348ADC]"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1" style={{ fontFamily: 'Inter, sans-serif' }}>
                    Role *
                  </label>
                  <select
                    value={newUser.role}
                    onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#348ADC]"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  >
                    <option value="">Select role</option>
                    {roles.map((role, index) => (
                      <option key={index} value={role.role_name}>
                        {role.role_name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Email Address *
                </label>
                <input
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  placeholder="Enter email address"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#348ADC]"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Password (leave blank to keep current)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newUser.password}
                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                    placeholder="Enter new password"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#348ADC]"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  />
                  <button
                    onClick={generatePassword}
                    className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                    title="Auto-generate password"
                  >
                    Generate
                  </button>
                </div>
              </div>

              <div className="flex gap-2 justify-end pt-2">
                <button
                  onClick={() => {
                    setEditingUser(null);
                    setNewUser({ fullName: '', email: '', password: '', role: '' });
                  }}
                  className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateUser}
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
              Add New User
            </h3>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1" style={{ fontFamily: 'Inter, sans-serif' }}>
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={newUser.fullName}
                    onChange={(e) => setNewUser({ ...newUser, fullName: e.target.value })}
                    placeholder="Enter full name"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#348ADC]"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1" style={{ fontFamily: 'Inter, sans-serif' }}>
                    Role *
                  </label>
                  <select
                    value={newUser.role}
                    onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#348ADC]"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  >
                    <option value="">Select role</option>
                    {roles.map((role, index) => (
                      <option key={index} value={role.role_name}>
                        {role.role_name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Email Address *
                </label>
                <input
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  placeholder="Enter email address"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#348ADC]"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Password *
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newUser.password}
                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                    placeholder="Enter password"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#348ADC]"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  />
                  <button
                    onClick={generatePassword}
                    className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                    title="Auto-generate password"
                  >
                    Generate
                  </button>
                </div>
              </div>

              <div className="flex gap-2 justify-end pt-2">
                <button
                  onClick={() => {
                    setIsCreating(false);
                    setNewUser({ fullName: '', email: '', password: '', role: '' });
                  }}
                  className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateUser}
                  className="px-3 py-1.5 bg-[#348ADC] hover:bg-[#2a6fb0] text-white rounded-lg text-sm font-medium transition"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  Add User
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-3">
          {users.length === 0 ? (
            <div className="text-center py-8 text-gray-500" style={{ fontFamily: 'Inter, sans-serif' }}>
              No users found. Click "Add User" to create one.
            </div>
          ) : (
            users.map((user, index) => (
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
                      {user.user_fullname}
                    </div>
                    <div className="text-xs text-gray-500" style={{ fontFamily: 'Inter, sans-serif' }}>
                      {user.user_email} • {user.role}
                    </div>
                  </div>
                </div>
                {isOwner && (
                  <button
                    onClick={() => handleEditUser(user)}
                    className="px-3 py-1.5 text-[#348ADC] hover:bg-[#348ADC]/10 rounded-lg text-sm font-medium transition"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  >
                    Edit
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
