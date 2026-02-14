import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useNotification } from '../contexts/NotificationContext';

export function Settings() {
  const [isEditingCompany, setIsEditingCompany] = useState(false);
  const [isEditingUser, setIsEditingUser] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [showPasswords, setShowPasswords] = useState(false);
  const [theme, setTheme] = useState(() => localStorage.getItem('arento_theme') || 'light');
  const [userId, setUserId] = useState<string | null>(null);
  const [clientId, setClientId] = useState<string | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const { addNotification } = useNotification();
  const [originalCompanyData, setOriginalCompanyData] = useState({
    name: '',
    gst: '',
    mobile: '',
    address: '',
    logo: '',
    headline: ''
  });
  const [originalUserData, setOriginalUserData] = useState({
    username: '',
    email: '',
    birthdate: '',
    role: ''
  });

  useEffect(() => {
    const userData = localStorage.getItem('arento_user');
    if (userData) {
      const parsed = JSON.parse(userData);
      setUserId(parsed.user_id);
      setClientId(parsed.client_id);
      loadClientData(parsed.client_id);
      loadUserData(parsed.user_id);
    }
  }, []);

  const loadClientData = async (clientId: string) => {
    if (!supabase) return;
    const { data } = await supabase
      .from('clients')
      .select('*')
      .eq('client_id', clientId)
      .single();
    if (data) {
      const clientData = {
        name: data.company_name || '',
        gst: data.gst_number || '',
        mobile: data.mobile_number || '',
        address: data.office_address || '',
        logo: data.company_logo || '',
        headline: data.billing_headline || ''
      };
      setCompanyData(clientData);
      setOriginalCompanyData(clientData);
      // Update localStorage with fresh DB data
      updateLocalStorageCompanyData(data);
    }
  };

  const updateLocalStorageCompanyData = (clientData: any) => {
    const storedUser = localStorage.getItem('arento_user');
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      parsed.company_name = clientData.company_name || '';
      parsed.company_mobile = clientData.mobile_number || '';
      parsed.company_address = clientData.office_address || '';
      parsed.company_logo = clientData.company_logo || '';
      parsed.company_headline = clientData.billing_headline || '';
      parsed.company_gst = clientData.gst_number || '';
      localStorage.setItem('arento_user', JSON.stringify(parsed));
    }
  };

  const loadUserData = async (userId: string) => {
    if (!supabase) return;
    const { data } = await supabase
      .from('users')
      .select('*')
      .eq('user_id', userId)
      .single();
    if (data) {
      const userData = {
        username: data.user_fullname || '',
        email: data.user_email || '',
        birthdate: '',
        role: data.role || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      };
      setUserData(userData);
      setOriginalUserData({
        username: userData.username,
        email: userData.email,
        birthdate: userData.birthdate,
        role: userData.role
      });
    }
  };

  const handleLogoUpload = async (file: File) => {
    if (!supabase || !clientId) return null;
    
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${clientId}.${fileExt}`;
      
      console.log('Uploading logo:', { fileName, fileSize: file.size, fileType: file.type });
      
      // Delete old file if exists
      await supabase.storage.from('company-logos').remove([fileName]);
      
      // Upload new file
      const { data, error } = await supabase.storage
        .from('company-logos')
        .upload(fileName, file, { 
          cacheControl: '3600',
          upsert: true 
        });
      
      if (error) {
        console.error('Upload error:', error);
        addNotification('Upload Failed', `Error: ${error.message}`);
        return null;
      }
      
      console.log('Upload successful:', data);
      
      // Get public URL
      const { data: urlData } = supabase.storage
        .from('company-logos')
        .getPublicUrl(fileName);
      
      console.log('Public URL:', urlData.publicUrl);
      return urlData.publicUrl;
    } catch (err) {
      console.error('Upload exception:', err);
      addNotification('Upload Failed', 'An unexpected error occurred.');
      return null;
    }
  };

  const hasCompanyChanges = () => {
    return (
      companyData.name !== originalCompanyData.name ||
      companyData.gst !== originalCompanyData.gst ||
      companyData.mobile !== originalCompanyData.mobile ||
      companyData.address !== originalCompanyData.address ||
      companyData.headline !== originalCompanyData.headline ||
      logoFile !== null
    );
  };

  const hasUserChanges = () => {
    return (
      userData.username !== originalUserData.username ||
      userData.email !== originalUserData.email ||
      userData.birthdate !== originalUserData.birthdate
    );
  };

  const handleCompanySave = async () => {
    if (!supabase || !clientId) return;
    let logoUrl = companyData.logo;
    
    if (logoFile) {
      const uploadedUrl = await handleLogoUpload(logoFile);
      if (uploadedUrl) {
        logoUrl = uploadedUrl;
      } else {
        addNotification('Upload Failed', 'Failed to upload logo. Please try again.');
        return;
      }
    }
    
    const { error } = await supabase
      .from('clients')
      .update({
        company_name: companyData.name,
        gst_number: companyData.gst,
        mobile_number: companyData.mobile,
        office_address: companyData.address,
        company_logo: logoUrl,
        billing_headline: companyData.headline
      })
      .eq('client_id', clientId);
      
    if (!error) {
      // Update local state with new logo URL
      setCompanyData({ ...companyData, logo: logoUrl });
      setOriginalCompanyData({ ...companyData, logo: logoUrl });
      
      // Update localStorage with complete company data
      const storedUser = localStorage.getItem('arento_user');
      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        parsed.company_name = companyData.name;
        parsed.company_mobile = companyData.mobile;
        parsed.company_address = companyData.address;
        parsed.company_logo = logoUrl;
        parsed.company_headline = companyData.headline;
        parsed.company_gst = companyData.gst;
        localStorage.setItem('arento_user', JSON.stringify(parsed));
      }
      
      setIsEditingCompany(false);
      setLogoFile(null);
      window.dispatchEvent(new Event('storage'));
      addNotification('Settings Updated!', 'Company settings have been saved successfully.');
    } else {
      console.error('Database update error:', error);
      addNotification('Update Failed', 'Failed to save company settings. Please try again.');
    }
  };

  const handleUserSave = async () => {
    if (!supabase || !userId) return;

    // If user is trying to change password
    if (userData.currentPassword || userData.newPassword || userData.confirmPassword) {
      // Validate all password fields are filled
      if (!userData.currentPassword || !userData.newPassword || !userData.confirmPassword) {
        addNotification('Validation Error', 'Please fill all password fields to change password.');
        return;
      }

      // Validate new password matches confirm password
      if (userData.newPassword !== userData.confirmPassword) {
        addNotification('Validation Error', 'New password and confirm password do not match.');
        return;
      }

      // Verify current password
      const { data: user } = await supabase
        .from('users')
        .select('user_password')
        .eq('user_id', userId)
        .single();

      if (!user || user.user_password !== userData.currentPassword) {
        addNotification('Authentication Failed', 'Current password is incorrect.');
        return;
      }

      // Update password along with other fields
      const { error } = await supabase
        .from('users')
        .update({
          user_fullname: userData.username,
          user_email: userData.email,
          user_password: userData.newPassword
        })
        .eq('user_id', userId);

      if (!error) {
        // Update localStorage
        const storedUser = localStorage.getItem('arento_user');
        if (storedUser) {
          const parsed = JSON.parse(storedUser);
          parsed.user_fullname = userData.username;
          parsed.user_email = userData.email;
          localStorage.setItem('arento_user', JSON.stringify(parsed));
        }
        // Clear password fields
        setUserData(prev => ({
          ...prev,
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        }));
        setIsEditingUser(false);
        setIsChangingPassword(false);
        window.dispatchEvent(new Event('storage'));
        addNotification('Settings Updated!', 'User settings and password have been changed successfully.');
      } else {
        addNotification('Update Failed', 'Failed to save user settings. Please try again.');
      }
    } else {
      // Update only username and email (no password change)
      const { error } = await supabase
        .from('users')
        .update({
          user_fullname: userData.username,
          user_email: userData.email
        })
        .eq('user_id', userId);

      if (!error) {
        const storedUser = localStorage.getItem('arento_user');
        if (storedUser) {
          const parsed = JSON.parse(storedUser);
          parsed.user_fullname = userData.username;
          parsed.user_email = userData.email;
          localStorage.setItem('arento_user', JSON.stringify(parsed));
        }
        setIsEditingUser(false);
        setIsChangingPassword(false);
        window.dispatchEvent(new Event('storage'));
        addNotification('Settings Updated!', 'User settings have been saved successfully.');
      } else {
        addNotification('Update Failed', 'Failed to save user settings. Please try again.');
      }
    }
  };

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('arento_theme', theme);
  }, [theme]);

  const [companyData, setCompanyData] = useState({
    name: 'Shree Ram Auto Parts',
    gst: '27AABCU9603R1ZM',
    mobile: '9324641323',
    address: 'Shop No. 3, Vishnu Niwas, Haridas Nagar, R.M. Bhattad Road, Opp. Pulse Hospital, Borivali (W), Mumbai - 400092',
    logo: '/client_logo.png',
    headline: '|| श्री गणेशाय नमः ||'
  });

  const [userData, setUserData] = useState({
    username: 'ayush_rana',
    email: 'ayush@arentoapp.com',
    birthdate: '1995-06-15',
    role: 'Owner',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  return (
    <div className="space-y-6">
      {/* Company Settings */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-[#072741]" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Company Settings
            </h2>
            <p className="text-xs text-gray-500 mt-1" style={{ fontFamily: 'Inter, sans-serif' }}>
              Only owners can modify these settings
            </p>
          </div>
          {!isEditingCompany && (
            <button
              onClick={() => setIsEditingCompany(true)}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
              title="Edit Company Settings"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#348ADC" strokeWidth="2">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
            </button>
          )}
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                Company Name
              </label>
              <input
                type="text"
                value={companyData.name}
                onChange={(e) => setCompanyData({ ...companyData, name: e.target.value })}
                disabled={!isEditingCompany}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#348ADC] disabled:bg-gray-50 disabled:text-gray-600"
                style={{ fontFamily: 'Inter, sans-serif' }}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                GST Number
              </label>
              <input
                type="text"
                value={companyData.gst}
                onChange={(e) => setCompanyData({ ...companyData, gst: e.target.value })}
                disabled={!isEditingCompany}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#348ADC] disabled:bg-gray-50 disabled:text-gray-600"
                style={{ fontFamily: 'Inter, sans-serif' }}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                Mobile Number
              </label>
              <input
                type="text"
                value={companyData.mobile}
                onChange={(e) => setCompanyData({ ...companyData, mobile: e.target.value })}
                disabled={!isEditingCompany}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#348ADC] disabled:bg-gray-50 disabled:text-gray-600"
                style={{ fontFamily: 'Inter, sans-serif' }}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                Billing Headline
              </label>
              <input
                type="text"
                value={companyData.headline}
                onChange={(e) => setCompanyData({ ...companyData, headline: e.target.value })}
                disabled={!isEditingCompany}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#348ADC] disabled:bg-gray-50 disabled:text-gray-600"
                style={{ fontFamily: 'Inter, sans-serif' }}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
              Office Address
            </label>
            <textarea
              value={companyData.address}
              onChange={(e) => setCompanyData({ ...companyData, address: e.target.value })}
              disabled={!isEditingCompany}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#348ADC] disabled:bg-gray-50 disabled:text-gray-600"
              style={{ fontFamily: 'Inter, sans-serif' }}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
              Company Logo
            </label>
            <div className="flex items-center gap-4">
              <img 
                src={logoFile ? URL.createObjectURL(logoFile) : companyData.logo} 
                alt="Company Logo" 
                className="h-16 w-16 object-contain border border-gray-200 rounded-lg p-2" 
              />
              {isEditingCompany && (
                <div className="flex flex-col gap-2">
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/jpg"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setLogoFile(file);
                      }
                    }}
                    className="text-sm text-gray-700"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  />
                  {logoFile && (
                    <span className="text-xs text-green-600" style={{ fontFamily: 'Inter, sans-serif' }}>
                      New logo selected: {logoFile.name}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>

          {isEditingCompany && (
            <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
              <button
                onClick={handleCompanySave}
                disabled={!hasCompanyChanges()}
                className="px-6 py-2 bg-[#348ADC] hover:bg-[#2a6fb0] text-white rounded-lg text-sm font-medium transition shadow-sm disabled:bg-gray-300 disabled:cursor-not-allowed"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                Save Changes
              </button>
              <button
                onClick={() => {
                  setIsEditingCompany(false);
                  setLogoFile(null);
                }}
                className="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>

      {/* User Settings */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-[#072741]" style={{ fontFamily: 'Poppins, sans-serif' }}>
              User Settings
            </h2>
            <p className="text-xs text-gray-500 mt-1" style={{ fontFamily: 'Inter, sans-serif' }}>
              Manage your personal account settings
            </p>
          </div>
          {!isEditingUser && (
            <button
              onClick={() => setIsEditingUser(true)}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
              title="Edit User Settings"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#348ADC" strokeWidth="2">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
            </button>
          )}
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                Username
              </label>
              <input
                type="text"
                value={userData.username}
                onChange={(e) => setUserData({ ...userData, username: e.target.value })}
                disabled={!isEditingUser}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#348ADC] disabled:bg-gray-50 disabled:text-gray-600"
                style={{ fontFamily: 'Inter, sans-serif' }}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                Email Address
              </label>
              <input
                type="email"
                value={userData.email}
                onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                disabled={!isEditingUser}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#348ADC] disabled:bg-gray-50 disabled:text-gray-600"
                style={{ fontFamily: 'Inter, sans-serif' }}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                Birthdate
              </label>
              <input
                type="date"
                value={userData.birthdate}
                onChange={(e) => setUserData({ ...userData, birthdate: e.target.value })}
                disabled={!isEditingUser}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#348ADC] disabled:bg-gray-50 disabled:text-gray-600"
                style={{ fontFamily: 'Inter, sans-serif' }}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                Role
              </label>
              <input
                type="text"
                value={userData.role}
                disabled
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm bg-gray-50 text-gray-600"
                style={{ fontFamily: 'Inter, sans-serif' }}
              />
            </div>
          </div>

          {isEditingUser && (
            <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
              <button
                onClick={handleUserSave}
                disabled={!hasUserChanges()}
                className="px-6 py-2 bg-[#348ADC] hover:bg-[#2a6fb0] text-white rounded-lg text-sm font-medium transition shadow-sm disabled:bg-gray-300 disabled:cursor-not-allowed"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                Save Changes
              </button>
              <button
                onClick={() => {
                  setIsEditingUser(false);
                  setIsChangingPassword(false);
                  setUserData({ ...userData, currentPassword: '', newPassword: '', confirmPassword: '' });
                }}
                className="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Change Password Section */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-[#072741]" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Change Password
            </h2>
            <p className="text-xs text-gray-500 mt-1" style={{ fontFamily: 'Inter, sans-serif' }}>
              Update your account password
            </p>
          </div>
          {!isChangingPassword && (
            <button
              onClick={() => setIsChangingPassword(true)}
              className="px-4 py-2 bg-[#348ADC] hover:bg-[#2a6fb0] text-white rounded-lg text-sm font-medium transition shadow-sm"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              Change Password
            </button>
          )}
        </div>

        {isChangingPassword && (
          <div className="p-6 space-y-6">
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>
                Fill all fields to update your password
              </div>
              <button
                type="button"
                onClick={() => setShowPasswords(!showPasswords)}
                className="text-sm text-[#348ADC] hover:text-[#2a6fb0] font-medium transition"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                {showPasswords ? 'Hide' : 'Show'}
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Current Password *
                </label>
                <input
                  type={showPasswords ? "text" : "password"}
                  value={userData.currentPassword}
                  onChange={(e) => setUserData({ ...userData, currentPassword: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#348ADC]"
                  placeholder="Enter current password"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                  New Password *
                </label>
                <input
                  type={showPasswords ? "text" : "password"}
                  value={userData.newPassword}
                  onChange={(e) => setUserData({ ...userData, newPassword: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#348ADC]"
                  placeholder="Enter new password"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Confirm New Password *
                </label>
                <input
                  type={showPasswords ? "text" : "password"}
                  value={userData.confirmPassword}
                  onChange={(e) => setUserData({ ...userData, confirmPassword: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#348ADC]"
                  placeholder="Confirm new password"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                />
              </div>
            </div>

            <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
              <button
                onClick={handleUserSave}
                disabled={!userData.currentPassword || !userData.newPassword || !userData.confirmPassword}
                className="px-6 py-2 bg-[#348ADC] hover:bg-[#2a6fb0] text-white rounded-lg text-sm font-medium transition shadow-sm disabled:bg-gray-300 disabled:cursor-not-allowed"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                Update Password
              </button>
              <button
                onClick={() => {
                  setIsChangingPassword(false);
                  setUserData({ ...userData, currentPassword: '', newPassword: '', confirmPassword: '' });
                }}
                className="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Appearance Settings */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-[#072741]" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Appearance
          </h2>
          <p className="text-xs text-gray-500 mt-1" style={{ fontFamily: 'Inter, sans-serif' }}>
            Customize your interface theme
          </p>
        </div>

        <div className="p-6">
          <label className="block text-sm font-medium text-gray-700 mb-3" style={{ fontFamily: 'Inter, sans-serif' }}>
            Theme
          </label>
          <div className="grid grid-cols-2 gap-4 max-w-md">
            <button
              onClick={() => setTheme('light')}
              className={`p-4 border-2 rounded-lg transition ${
                theme === 'light'
                  ? 'border-[#348ADC] bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-white border border-gray-300 flex items-center justify-center">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#348ADC" strokeWidth="2">
                    <circle cx="12" cy="12" r="5" />
                    <line x1="12" y1="1" x2="12" y2="3" />
                    <line x1="12" y1="21" x2="12" y2="23" />
                    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                    <line x1="1" y1="12" x2="3" y2="12" />
                    <line x1="21" y1="12" x2="23" y2="12" />
                    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                  </svg>
                </div>
                <div className="text-left">
                  <div className="text-sm font-semibold text-[#072741]" style={{ fontFamily: 'Inter, sans-serif' }}>Light</div>
                  <div className="text-xs text-gray-500" style={{ fontFamily: 'Inter, sans-serif' }}>Default theme</div>
                </div>
              </div>
            </button>

            <button
              onClick={() => setTheme('dark')}
              className={`p-4 border-2 rounded-lg transition ${
                theme === 'dark'
                  ? 'border-[#348ADC] bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gray-800 border border-gray-700 flex items-center justify-center">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#348ADC" strokeWidth="2">
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                  </svg>
                </div>
                <div className="text-left">
                  <div className="text-sm font-semibold text-[#072741]" style={{ fontFamily: 'Inter, sans-serif' }}>Dark</div>
                  <div className="text-xs text-gray-500" style={{ fontFamily: 'Inter, sans-serif' }}>Eye-friendly</div>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
