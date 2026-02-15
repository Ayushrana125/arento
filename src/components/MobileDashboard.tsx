import { useState } from 'react';
import { Home, Plus, BarChart3 } from 'lucide-react';
import { QuickScan } from './QuickScan';
import { MobileInventoryAnalysis } from './MobileInventoryAnalysis';

export function MobileDashboard() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'entry' | 'analysis'>('entry');

  return (
    <div className="fixed inset-0 bg-white dark:bg-[#1a1a1a] flex flex-col">
      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        {activeTab === 'dashboard' && (
          <div className="h-full overflow-auto bg-gray-50 dark:bg-[#0d0d0d]">
            {/* Mobile Header */}
            <div className="bg-[#6366f1] p-5 sticky top-0 z-10">
              <h1 className="text-2xl font-bold text-white">Dashboard</h1>
              <p className="text-sm text-white/80 mt-0.5">Overview</p>
            </div>
            
            {/* Dashboard Content */}
            <div className="p-4 space-y-4">
              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white dark:bg-[#1e1e1e] p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Today's Sales</p>
                  <p className="text-2xl font-bold text-green-600">₹0</p>
                  <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-1">0 transactions</p>
                </div>
                <div className="bg-white dark:bg-[#1e1e1e] p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Today's Purchase</p>
                  <p className="text-2xl font-bold text-blue-600">₹0</p>
                  <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-1">0 transactions</p>
                </div>
                <div className="bg-white dark:bg-[#1e1e1e] p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Total Items</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">0</p>
                  <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-1">In inventory</p>
                </div>
                <div className="bg-white dark:bg-[#1e1e1e] p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Low Stock</p>
                  <p className="text-2xl font-bold text-orange-600">0</p>
                  <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-1">Items</p>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white dark:bg-[#1e1e1e] p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
                <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3">Recent Activity</h3>
                <div className="text-center py-8">
                  <p className="text-gray-400 dark:text-gray-500 text-sm">No recent activity</p>
                </div>
              </div>

              {/* Coming Soon */}
              <div className="bg-white dark:bg-[#1e1e1e] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 text-center">
                <div className="w-16 h-16 bg-[#6366f1]/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Home size={32} className="text-[#6366f1]" />
                </div>
                <p className="text-gray-600 dark:text-gray-400 font-medium">Full Dashboard Coming Soon</p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">Sales reports, analytics, and more</p>
              </div>
            </div>
          </div>
        )}
        {activeTab === 'entry' && <QuickScan isOpen={true} onClose={() => {}} />}
        {activeTab === 'analysis' && (
          <div className="h-full overflow-auto bg-gray-50 dark:bg-[#0d0d0d]">
            {/* Mobile Header */}
            <div className="bg-[#6366f1] p-5 sticky top-0 z-10">
              <h1 className="text-2xl font-bold text-white">Inventory Analysis</h1>
              <p className="text-sm text-white/80 mt-0.5">Stock Overview</p>
            </div>
            
            {/* Mobile-optimized Analysis */}
            <div className="p-4">
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
              activeTab === 'dashboard' ? 'text-[#6366f1]' : 'text-gray-400'
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
              activeTab === 'entry' ? 'bg-[#6366f1]' : 'bg-gray-800 dark:bg-gray-700'
            }`}>
              <Plus size={28} className="text-white" strokeWidth={2.5} />
            </div>
            <span className={`text-xs mt-1 font-medium ${
              activeTab === 'entry' ? 'text-[#6366f1]' : 'text-gray-400'
            }`}>Entry</span>
          </button>

          {/* Analysis */}
          <button
            onClick={() => setActiveTab('analysis')}
            className={`flex flex-col items-center justify-center p-2 rounded-xl transition ${
              activeTab === 'analysis' ? 'text-[#6366f1]' : 'text-gray-400'
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
