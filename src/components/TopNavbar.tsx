import { useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';

interface UserData {
  first_name?: string;
  last_name?: string;
  company_name?: string;
  [key: string]: any;
}

export function TopNavbar() {
  const location = useLocation();
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    const loadUserData = () => {
      const storedUser = localStorage.getItem('arento_user');
      if (storedUser) {
        try {
          setUserData(JSON.parse(storedUser));
        } catch (error) {
          console.error('Error parsing user data:', error);
        }
      }
    };

    loadUserData();
    window.addEventListener('storage', loadUserData);
    return () => window.removeEventListener('storage', loadUserData);
  }, []);

  const getUserInitials = () => {
    if (!userData) return 'US';
    if (userData.first_name && userData.last_name) {
      return `${userData.first_name[0]}${userData.last_name[0]}`.toUpperCase();
    }
    return 'US';
  };

  const getDisplayName = () => {
    if (!userData) return 'User';
    if (userData.first_name && userData.last_name) {
      return `${userData.first_name} ${userData.last_name}`;
    }
    return userData.username || 'User';
  };

  const getPageInfo = () => {
    const path = location.pathname;
    if (path.includes('dashboard')) return { title: 'Dashboard', subtext: 'Overview of your business metrics' };
    if (path.includes('inventory-analysis')) return { title: 'Inventory Analysis', subtext: 'Analyze stock levels and trends' };
    if (path.includes('sales')) return { title: 'Sales', subtext: 'Manage billing and invoices' };
    if (path.includes('purchases')) return { title: 'Purchases', subtext: 'Track purchase orders and expenses' };
    if (path.includes('inventory')) return { title: 'Inventory Management', subtext: 'Manage products and stock' };
    if (path.includes('settings')) return { title: 'Settings & Configurations', subtext: 'Configure your account' };
    return { title: 'Arento', subtext: 'Inventory & Billing System' };
  };

  const { title, subtext } = getPageInfo();

  return (
    <>
      {/* Top Bar - Company & User Info */}
      <div className="bg-white px-6 py-3 flex items-center justify-between border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-[#348ADC] to-[#65C9D4] rounded-full shadow-md">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            <span className="text-white font-medium text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
              {userData?.company_name || 'Arento Inc'}
            </span>
          </div>
          <button
            onClick={() => alert('Add Team Members functionality coming soon!')}
            className="flex items-center gap-2 px-4 py-1.5 bg-white border border-gray-200 hover:border-[#348ADC] hover:bg-gray-50 rounded-full transition-all duration-200 shadow-sm"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#348ADC" strokeWidth="2">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <line x1="19" y1="8" x2="19" y2="14"></line>
              <line x1="22" y1="11" x2="16" y2="11"></line>
            </svg>
            <span className="text-sm font-medium text-[#348ADC]">Add Team Members</span>
          </button>
        </div>

        <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-full">
          <span className="text-[#072741] font-medium text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
            {getDisplayName()}
          </span>
          <div className="w-8 h-8 rounded-full bg-[#348ADC] flex items-center justify-center text-white font-medium text-xs">
            {getUserInitials()}
          </div>
        </div>
      </div>

      {/* Page Title Bar */}
      <div className="bg-white px-6 py-2 flex items-center justify-between border-b border-gray-200">
        <div>
          <h1 className="text-lg font-semibold text-[#072741]" style={{ fontFamily: 'Poppins, sans-serif' }}>
            {title}
          </h1>
          <p className="text-xs text-[#072741] opacity-60" style={{ fontFamily: 'Inter, sans-serif' }}>
            {subtext}
          </p>
        </div>
      </div>
    </>
  );
}
