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
  const [sidebarWidth, setSidebarWidth] = useState('256px');

  useEffect(() => {
    const checkSidebar = () => {
      const sidebar = document.querySelector('[data-sidebar]');
      if (sidebar) {
        const width = sidebar.classList.contains('w-16') ? '64px' : '256px';
        setSidebarWidth(width);
      }
    };
    checkSidebar();
    const observer = new MutationObserver(checkSidebar);
    const sidebar = document.querySelector('[data-sidebar]');
    if (sidebar) {
      observer.observe(sidebar, { attributes: true, attributeFilter: ['class'] });
    }
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const loadUserData = () => {
      const storedUser = localStorage.getItem('arento_user');
      if (storedUser) {
        try {
          const parsed = JSON.parse(storedUser);
          setUserData(parsed);
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
    const name = userData.user_fullname || '';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const getDisplayName = () => {
    if (!userData) return 'User';
    return userData.user_fullname || 'User';
  };

  const getPageInfo = () => {
    const path = location.pathname;
    if (path.includes('dashboard')) return { title: 'Dashboard', subtext: 'Overview of your business metrics' };
    if (path.includes('inventory-analysis')) return { title: 'Inventory Analysis', subtext: 'Analyze stock levels and trends' };
    if (path.includes('sales')) return { title: 'Sales', subtext: 'Manage billing, Track revenue and product performance' };
    if (path.includes('purchases')) return { title: 'Purchases', subtext: 'Track purchase orders and expenses' };
    if (path.includes('inventory')) return { title: 'Inventory Management', subtext: 'Manage products and stock' };
    if (path.includes('settings')) return { title: 'Settings & Configurations', subtext: 'Configure your account' };
    return { title: 'Arento', subtext: 'Inventory & Billing System' };
  };

  const { title, subtext } = getPageInfo();

  return (
    <div className="fixed top-0 right-0 z-50 bg-white dark:bg-[#2d2d2d] border-b border-gray-300 dark:border-gray-700 transition-all duration-300" style={{ left: sidebarWidth, boxShadow: '0 2px 4px rgba(0,0,0,0.08)' }}>
      {/* Identity Row */}
      <div className="px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-[#348ADC] to-[#65C9D4] rounded-full shadow-md">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            <span className="text-white font-medium text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
              {userData?.company_name || 'Arento Inc'}
            </span>
          </div>
          <button
            onClick={() => alert('Add Team Members functionality coming soon!')}
            className="flex items-center gap-2 px-4 py-1.5 bg-white dark:bg-[#3d3d3d] border border-gray-200 dark:border-gray-600 hover:border-[#348ADC] hover:bg-gray-50 dark:hover:bg-[#4d4d4d] rounded-full transition-all duration-200 shadow-sm"
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

        <div className="flex items-center gap-2 bg-gray-50 dark:bg-[#3d3d3d] px-3 py-1.5 rounded-full">
          <div className="flex flex-col items-start">
            <span className="text-[#072741] dark:text-gray-200 font-medium text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
              {getDisplayName()}
            </span>
            <span className="text-[#348ADC] text-xs font-medium" style={{ fontFamily: 'Inter, sans-serif' }}>
              {userData?.role || 'User'}
            </span>
          </div>
          <div className="w-8 h-8 rounded-full bg-[#348ADC] flex items-center justify-center text-white font-medium text-xs">
            {getUserInitials()}
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-gray-200 dark:bg-gray-700 w-full"></div>

      {/* Page Header Row */}
      <div className="px-6 py-2">
        <h1 className="text-lg font-semibold text-[#072741] dark:text-gray-200" style={{ fontFamily: 'Poppins, sans-serif' }}>
          {title}
        </h1>
        <p className="text-xs text-[#072741] dark:text-gray-400 opacity-60" style={{ fontFamily: 'Inter, sans-serif' }}>
          {subtext}
        </p>
      </div>
    </div>
  );
}
