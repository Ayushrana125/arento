import { useState, useEffect } from 'react';

export function Settings() {
  const [isEditingCompany, setIsEditingCompany] = useState(false);
  const [isEditingUser, setIsEditingUser] = useState(false);
  const [theme, setTheme] = useState(() => localStorage.getItem('arento_theme') || 'light');

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
    role: 'Owner'
  });

  const handleCompanySave = () => {
    setIsEditingCompany(false);
    alert('Company settings saved successfully!');
  };

  const handleUserSave = () => {
    setIsEditingUser(false);
    alert('User settings saved successfully!');
  };

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
              <img src={companyData.logo} alt="Company Logo" className="h-16 w-16 object-contain border border-gray-200 rounded-lg p-2" />
              {isEditingCompany && (
                <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Update Logo
                </button>
              )}
            </div>
          </div>

          {isEditingCompany && (
            <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
              <button
                onClick={handleCompanySave}
                className="px-6 py-2 bg-[#348ADC] hover:bg-[#2a6fb0] text-white rounded-lg text-sm font-medium transition shadow-sm"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                Save Changes
              </button>
              <button
                onClick={() => setIsEditingCompany(false)}
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
                className="px-6 py-2 bg-[#348ADC] hover:bg-[#2a6fb0] text-white rounded-lg text-sm font-medium transition shadow-sm"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                Save Changes
              </button>
              <button
                onClick={() => setIsEditingUser(false)}
                className="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                Cancel
              </button>
            </div>
          )}
        </div>
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
