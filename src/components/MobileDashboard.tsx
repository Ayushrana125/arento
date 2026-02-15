import { useState } from 'react';
import { Home, Plus, BarChart3, TrendingUp, ShoppingCart, Package, AlertTriangle, User } from 'lucide-react';
import { QuickScan } from './QuickScan';
import { MobileInventoryAnalysis } from './MobileInventoryAnalysis';

export function MobileDashboard() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'entry' | 'analysis'>('entry');

  return (
    <div className="fixed inset-0 bg-white dark:bg-[#1a1a1a] flex flex-col">
      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        {activeTab === 'dashboard' && (
          <div className="h-full overflow-auto bg-gradient-to-b from-gray-50 to-white dark:from-[#0d0d0d] dark:to-[#1a1a1a]">
            {/* Premium Header with Gradient */}
            <div className="bg-gradient-to-r from-[#348ADC] via-[#2a7bc4] to-[#1e6aaf] p-5 pb-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h1 className="text-3xl font-black text-white tracking-tight">Arento</h1>
                  <p className="text-sm text-white/95 mt-1 font-medium">{localStorage.getItem('arento_user') ? JSON.parse(localStorage.getItem('arento_user')!).company_name : ''}</p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <div className="w-11 h-11 rounded-full bg-white/20 backdrop-blur-sm border-2 border-white/30 flex items-center justify-center">
                    <User size={20} className="text-white" strokeWidth={2.5} />
                  </div>
                  <p className="text-[10px] text-white/80 font-medium">{localStorage.getItem('arento_user') ? JSON.parse(localStorage.getItem('arento_user')!).user_fullname : ''}</p>
                </div>
              </div>
            </div>
            
            {/* Dashboard Content */}
            <div className="px-4 pt-4 pb-4 space-y-4">
              {/* Quick Stats - Floating Cards */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-5 rounded-2xl shadow-xl hover:shadow-2xl active:scale-95 transition-all">
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-10 h-10 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
                      <TrendingUp size={20} className="text-white" strokeWidth={2.5} />
                    </div>
                  </div>
                  <p className="text-xs text-white/90 font-medium mb-1">Today's Sales</p>
                  <p className="text-3xl font-black text-white tracking-tight">₹0</p>
                  <p className="text-[10px] text-white/80 mt-1 font-medium">0 transactions</p>
                </div>
                
                <div className="bg-gradient-to-br from-[#348ADC] to-[#2a7bc4] p-5 rounded-2xl shadow-xl hover:shadow-2xl active:scale-95 transition-all">
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-10 h-10 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
                      <ShoppingCart size={20} className="text-white" strokeWidth={2.5} />
                    </div>
                  </div>
                  <p className="text-xs text-white/90 font-medium mb-1">Today's Purchase</p>
                  <p className="text-3xl font-black text-white tracking-tight">₹0</p>
                  <p className="text-[10px] text-white/80 mt-1 font-medium">0 transactions</p>
                </div>
                
                <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-5 rounded-2xl shadow-xl hover:shadow-2xl active:scale-95 transition-all">
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-10 h-10 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
                      <Package size={20} className="text-white" strokeWidth={2.5} />
                    </div>
                  </div>
                  <p className="text-xs text-white/90 font-medium mb-1">Total Items</p>
                  <p className="text-3xl font-black text-white tracking-tight">0</p>
                  <p className="text-[10px] text-white/80 mt-1 font-medium">In inventory</p>
                </div>
                
                <div className="bg-gradient-to-br from-orange-500 to-red-500 p-5 rounded-2xl shadow-xl hover:shadow-2xl active:scale-95 transition-all">
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-10 h-10 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
                      <AlertTriangle size={20} className="text-white" strokeWidth={2.5} />
                    </div>
                  </div>
                  <p className="text-xs text-white/90 font-medium mb-1">Low Stock</p>
                  <p className="text-3xl font-black text-white tracking-tight">0</p>
                  <p className="text-[10px] text-white/80 mt-1 font-medium">Items</p>
                </div>
              </div>

              {/* Recent Activity - Premium Card */}
              <div className="bg-white dark:bg-[#1e1e1e] p-5 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-800">
                <h3 className="text-base font-black text-gray-900 dark:text-white mb-4">Recent Activity</h3>
                <div className="text-center py-10">
                  <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-3">
                    <TrendingUp size={28} className="text-gray-400" />
                  </div>
                  <p className="text-gray-400 dark:text-gray-500 text-sm font-medium">No recent activity</p>
                  <p className="text-xs text-gray-400 dark:text-gray-600 mt-1">Start making transactions</p>
                </div>
              </div>

              {/* Coming Soon - Engaging Card */}
              <div className="bg-gradient-to-br from-[#348ADC]/10 via-purple-50 to-pink-50 dark:from-[#348ADC]/10 dark:via-purple-900/10 dark:to-pink-900/10 p-6 rounded-2xl border-2 border-dashed border-[#348ADC]/30 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-[#348ADC] to-purple-500 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-xl">
                  <Home size={36} className="text-white" strokeWidth={2.5} />
                </div>
                <p className="text-gray-900 dark:text-white font-black text-lg">Full Dashboard Coming Soon</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 font-medium">Sales reports, analytics & insights</p>
              </div>
            </div>
          </div>
        )}
        {activeTab === 'entry' && <QuickScan isOpen={true} onClose={() => {}} />}
        {activeTab === 'analysis' && (
          <div className="h-full overflow-auto bg-gradient-to-b from-gray-50 to-white dark:from-[#0d0d0d] dark:to-[#1a1a1a]">
            {/* Premium Header with Gradient */}
            <div className="bg-gradient-to-r from-[#348ADC] via-[#2a7bc4] to-[#1e6aaf] p-5 pb-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h1 className="text-3xl font-black text-white tracking-tight">Arento</h1>
                  <p className="text-sm text-white/95 mt-1 font-medium">{localStorage.getItem('arento_user') ? JSON.parse(localStorage.getItem('arento_user')!).company_name : ''}</p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <div className="w-11 h-11 rounded-full bg-white/20 backdrop-blur-sm border-2 border-white/30 flex items-center justify-center">
                    <User size={20} className="text-white" strokeWidth={2.5} />
                  </div>
                  <p className="text-[10px] text-white/80 font-medium">{localStorage.getItem('arento_user') ? JSON.parse(localStorage.getItem('arento_user')!).user_fullname : ''}</p>
                </div>
              </div>
            </div>
            
            {/* Mobile-optimized Analysis */}
            <div className="px-4 pt-4 pb-4">
              <MobileInventoryAnalysis />
            </div>
          </div>
        )}
      </div>

      {/* Bottom Navigation - Instagram Style */}
      <div className="bg-white dark:bg-[#1e1e1e] border-t border-gray-200 dark:border-gray-800 px-2 py-2 safe-area-bottom z-50">
        <div className="flex items-center justify-around max-w-md mx-auto">
          {/* Dashboard */}
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex flex-col items-center justify-center p-2 rounded-xl transition ${
              activeTab === 'dashboard' ? 'text-[#348ADC]' : 'text-gray-400'
            }`}
          >
            <Home size={24} strokeWidth={activeTab === 'dashboard' ? 2.5 : 2} />
            <span className="text-xs mt-1 font-medium">Dashboard</span>
          </button>

          {/* Entry (Primary) */}
          <button
            onClick={() => setActiveTab('entry')}
            className="flex flex-col items-center justify-center -mt-6"
          >
            <div className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition ${
              activeTab === 'entry' ? 'bg-[#348ADC]' : 'bg-gray-800 dark:bg-gray-700'
            }`}>
              <Plus size={28} className="text-white" strokeWidth={2.5} />
            </div>
            <span className={`text-xs mt-1 font-medium ${
              activeTab === 'entry' ? 'text-[#348ADC]' : 'text-gray-400'
            }`}>Entry</span>
          </button>

          {/* Analysis */}
          <button
            onClick={() => setActiveTab('analysis')}
            className={`flex flex-col items-center justify-center p-2 rounded-xl transition ${
              activeTab === 'analysis' ? 'text-[#348ADC]' : 'text-gray-400'
            }`}
          >
            <BarChart3 size={24} strokeWidth={activeTab === 'analysis' ? 2.5 : 2} />
            <span className="text-xs mt-1 font-medium">Analysis</span>
          </button>
        </div>
      </div>
    </div>
  );
}
