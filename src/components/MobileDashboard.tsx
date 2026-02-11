import { useState, useEffect } from 'react';
import { SalePanel } from './SalePanel';
import { PurchasePanel } from './PurchasePanel';
import { StockAdjustmentPanel } from './StockAdjustmentPanel';

export function MobileDashboard() {
  const [userData, setUserData] = useState<any>(null);
  const [isSalePanelOpen, setIsSalePanelOpen] = useState(false);
  const [isPurchasePanelOpen, setIsPurchasePanelOpen] = useState(false);
  const [isStockAdjustmentPanelOpen, setIsStockAdjustmentPanelOpen] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('arento_user');
    if (storedUser) {
      try {
        setUserData(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
  }, []);

  const getDisplayName = () => {
    if (!userData) return 'User';
    if (userData.first_name && userData.last_name) {
      return `${userData.first_name} ${userData.last_name}`;
    }
    return userData.username || 'User';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="px-4 py-4">
          <h1 className="text-2xl font-bold text-[#072741] mb-1" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Arento
          </h1>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500" style={{ fontFamily: 'Inter, sans-serif' }}>
                {userData?.company_name || 'Company'}
              </p>
              <p className="text-sm font-medium text-[#072741]" style={{ fontFamily: 'Inter, sans-serif' }}>
                {getDisplayName()}
              </p>
            </div>
            <button
              onClick={() => {
                localStorage.removeItem('arento_user');
                window.location.href = '/';
              }}
              className="text-sm text-red-600 hover:text-red-700 font-medium px-3 py-1.5 border border-red-300 rounded-lg hover:bg-red-50 transition"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="p-4 space-y-3">
        <button
          onClick={() => setIsSalePanelOpen(true)}
          className="w-full bg-gradient-to-r from-[#348ADC] to-[#65C9D4] text-white py-4 rounded-xl shadow-lg active:scale-95 transition-transform"
        >
          <div className="flex items-center justify-center gap-3">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="9" cy="21" r="1"/>
              <circle cx="20" cy="21" r="1"/>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
            </svg>
            <span className="text-lg font-semibold" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Add Sale
            </span>
          </div>
          <p className="text-xs text-white/80 mt-1" style={{ fontFamily: 'Inter, sans-serif' }}>
            Press S or tap here
          </p>
        </button>

        <button
          onClick={() => setIsPurchasePanelOpen(true)}
          className="w-full bg-white text-[#072741] py-4 rounded-xl shadow-md border-2 border-gray-200 active:scale-95 transition-transform"
        >
          <div className="flex items-center justify-center gap-3">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
              <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
              <line x1="12" y1="22.08" x2="12" y2="12"/>
            </svg>
            <span className="text-lg font-semibold" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Add Purchase
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1" style={{ fontFamily: 'Inter, sans-serif' }}>
            Press P or tap here
          </p>
        </button>

        <button
          onClick={() => setIsStockAdjustmentPanelOpen(true)}
          className="w-full bg-white text-[#072741] py-4 rounded-xl shadow-md border-2 border-gray-200 active:scale-95 transition-transform"
        >
          <div className="flex items-center justify-center gap-3">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
            </svg>
            <span className="text-lg font-semibold" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Stock Adjustment
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1" style={{ fontFamily: 'Inter, sans-serif' }}>
            Press K or tap here
          </p>
        </button>
      </div>

      <SalePanel isOpen={isSalePanelOpen} onClose={() => setIsSalePanelOpen(false)} />
      <PurchasePanel isOpen={isPurchasePanelOpen} onClose={() => setIsPurchasePanelOpen(false)} />
      <StockAdjustmentPanel isOpen={isStockAdjustmentPanelOpen} onClose={() => setIsStockAdjustmentPanelOpen(false)} />
    </div>
  );
}
