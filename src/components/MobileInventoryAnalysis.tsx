import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Search, AlertTriangle, Check } from 'lucide-react';

type Status = 'Healthy' | 'Low' | 'Critical';

interface InventoryItem {
  name: string;
  sku: string;
  quantity: number;
  min_stock: number;
  normal_stock: number;
  category: string;
  cost_price?: number;
  selling_price?: number;
}

export function MobileInventoryAnalysis() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [inventoryData, setInventoryData] = useState<InventoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadInventory = async () => {
    const userData = localStorage.getItem('arento_user');
    if (!userData) return;

    const { client_id: clientId } = JSON.parse(userData);

    const { data } = await supabase
      .from('inventory_items')
      .select('name, sku, quantity, min_stock, normal_stock, category, cost_price, selling_price')
      .eq('client_id', clientId);

    if (data) {
      setInventoryData(data);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadInventory();
    const handleUpdate = () => loadInventory();
    window.addEventListener('inventoryUpdated', handleUpdate);
    return () => window.removeEventListener('inventoryUpdated', handleUpdate);
  }, []);

  const getStatus = (item: InventoryItem): Status => {
    if (item.quantity === 0) return 'Critical';
    const ratio = item.quantity / item.min_stock;
    if (ratio <= 1) return 'Critical';
    if (ratio <= 1.5) return 'Low';
    return 'Healthy';
  };

  const getProgressPercentage = (item: InventoryItem) => {
    return Math.min((item.quantity / item.normal_stock) * 100, 100);
  };

  const getCardBackground = (percentage: number) => {
    if (percentage === 0) return 'bg-red-200 dark:bg-red-900/30 border-red-400 dark:border-red-700';
    if (percentage <= 20) return 'bg-red-100 dark:bg-red-900/20 border-red-300 dark:border-red-800';
    if (percentage <= 30) return 'bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-800';
    if (percentage <= 40) return 'bg-orange-100 dark:bg-orange-900/20 border-orange-300 dark:border-orange-800';
    if (percentage <= 50) return 'bg-yellow-100 dark:bg-yellow-900/20 border-yellow-300 dark:border-yellow-800';
    if (percentage <= 60) return 'bg-yellow-50 dark:bg-yellow-900/10 border-yellow-200 dark:border-yellow-800';
    if (percentage <= 70) return 'bg-lime-100 dark:bg-lime-900/20 border-lime-300 dark:border-lime-800';
    if (percentage <= 80) return 'bg-lime-50 dark:bg-lime-900/10 border-lime-200 dark:border-lime-800';
    return 'bg-green-100 dark:bg-green-900/20 border-green-300 dark:border-green-800';
  };

  const filteredData = inventoryData
    .filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           item.sku.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || 
                           (statusFilter === 'OutOfStock' && item.quantity === 0) ||
                           (statusFilter !== 'OutOfStock' && getStatus(item) === statusFilter);
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      const ratioA = a.quantity / a.min_stock;
      const ratioB = b.quantity / b.min_stock;
      return ratioA - ratioB;
    });

  const statusCounts = {
    healthy: inventoryData.filter(item => getStatus(item) === 'Healthy').length,
    low: inventoryData.filter(item => getStatus(item) === 'Low').length,
    critical: inventoryData.filter(item => getStatus(item) === 'Critical' && item.quantity > 0).length,
    outOfStock: inventoryData.filter(item => item.quantity === 0).length,
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#348ADC] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-semibold">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Status Summary - 3 Cards Per Row Grid */}
      <div className="grid grid-cols-3 gap-2">
        <button
          onClick={() => setStatusFilter(statusFilter === 'Healthy' ? 'all' : 'Healthy')}
          className={`p-3 rounded-xl transition-all active:scale-95 shadow-md ${
            statusFilter === 'Healthy' 
              ? 'bg-gradient-to-br from-green-500 to-emerald-600 shadow-green-500/30' 
              : 'bg-white dark:bg-[#1e1e1e] border-2 border-green-200 dark:border-green-800'
          }`}
        >
          <p className={`text-2xl font-black leading-none ${statusFilter === 'Healthy' ? 'text-white' : 'text-green-600'}`}>
            {statusCounts.healthy}
          </p>
          <p className={`text-[9px] font-bold mt-1.5 leading-tight ${statusFilter === 'Healthy' ? 'text-white/90' : 'text-gray-600 dark:text-gray-400'}`}>
            Healthy
          </p>
        </button>

        <button
          onClick={() => setStatusFilter(statusFilter === 'Low' ? 'all' : 'Low')}
          className={`p-3 rounded-xl transition-all active:scale-95 shadow-md ${
            statusFilter === 'Low' 
              ? 'bg-gradient-to-br from-yellow-500 to-yellow-600 shadow-yellow-500/30' 
              : 'bg-white dark:bg-[#1e1e1e] border-2 border-yellow-200 dark:border-yellow-800'
          }`}
        >
          <p className={`text-2xl font-black leading-none ${statusFilter === 'Low' ? 'text-white' : 'text-yellow-600'}`}>
            {statusCounts.low}
          </p>
          <p className={`text-[9px] font-bold mt-1.5 leading-tight ${statusFilter === 'Low' ? 'text-white/90' : 'text-gray-600 dark:text-gray-400'}`}>
            Low Stock
          </p>
        </button>

        <button
          onClick={() => setStatusFilter(statusFilter === 'Critical' ? 'all' : 'Critical')}
          className={`p-3 rounded-xl transition-all active:scale-95 shadow-md ${
            statusFilter === 'Critical' 
              ? 'bg-gradient-to-br from-orange-500 to-red-500 shadow-orange-500/30' 
              : 'bg-white dark:bg-[#1e1e1e] border-2 border-orange-200 dark:border-orange-800'
          }`}
        >
          <p className={`text-2xl font-black leading-none ${statusFilter === 'Critical' ? 'text-white' : 'text-orange-600'}`}>
            {statusCounts.critical}
          </p>
          <p className={`text-[9px] font-bold mt-1.5 leading-tight ${statusFilter === 'Critical' ? 'text-white/90' : 'text-gray-600 dark:text-gray-400'}`}>
            Critical
          </p>
        </button>
      </div>

      {/* Out of Stock - Full Width */}
      <button
        onClick={() => setStatusFilter(statusFilter === 'OutOfStock' ? 'all' : 'OutOfStock')}
        className={`w-full p-3 rounded-xl transition-all active:scale-95 shadow-md flex items-center justify-between ${
          statusFilter === 'OutOfStock' 
            ? 'bg-gradient-to-br from-red-500 to-red-600 shadow-red-500/30' 
            : 'bg-white dark:bg-[#1e1e1e] border-2 border-red-200 dark:border-red-800'
        }`}
      >
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
            statusFilter === 'OutOfStock' ? 'bg-white/20' : 'bg-red-100 dark:bg-red-900/30'
          }`}>
            <AlertTriangle size={20} className={statusFilter === 'OutOfStock' ? 'text-white' : 'text-red-600'} strokeWidth={2.5} />
          </div>
          <div className="text-left">
            <p className={`text-2xl font-black leading-none ${statusFilter === 'OutOfStock' ? 'text-white' : 'text-red-600'}`}>
              {statusCounts.outOfStock}
            </p>
            <p className={`text-[9px] font-bold mt-1 ${statusFilter === 'OutOfStock' ? 'text-white/90' : 'text-gray-600 dark:text-gray-400'}`}>
              Out of Stock Items
            </p>
          </div>
        </div>
        {statusFilter === 'OutOfStock' && (
          <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
            <Check size={14} className="text-white" strokeWidth={3} />
          </div>
        )}
      </button>

      {/* Search Bar - Compact */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <input
          type="text"
          placeholder="Search items..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-3 py-3 border-2 border-[#348ADC]/30 dark:border-[#348ADC]/50 rounded-xl text-sm focus:border-[#348ADC] focus:outline-none bg-white dark:bg-[#1e1e1e] shadow-sm focus:shadow-md transition-all"
        />
      </div>

      {/* Inventory Cards - 3 Per Row Grid */}
      <div className="grid grid-cols-3 gap-2">
        {filteredData.map((item, idx) => {
          const status = getStatus(item);
          const progress = getProgressPercentage(item);
          
          return (
            <div
              key={idx}
              className={`rounded-lg p-1.5 border shadow-md hover:shadow-lg active:scale-95 transition-all ${getCardBackground(progress)}`}
            >
              {/* Status Badge */}
              <div className="flex justify-center mb-1">
                <span className={`px-1.5 py-0.5 rounded text-[7px] font-black shadow-sm ${
                  item.quantity === 0 ? 'bg-gradient-to-r from-red-500 to-red-600 text-white' :
                  status === 'Critical' ? 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300' :
                  status === 'Low' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-300' :
                  'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300'
                }`}>
                  {item.quantity === 0 ? 'OUT' : status.toUpperCase()}
                </span>
              </div>

              {/* Item Name */}
              <h3 className="font-black text-gray-900 dark:text-white text-[9px] leading-tight text-center mb-1 line-clamp-2 min-h-[22px]">
                {item.name}
              </h3>

              {/* Quantity */}
              <div className="text-center mb-1">
                <span className={`text-lg font-black leading-none ${
                  status === 'Critical' ? 'text-red-600 dark:text-red-400' :
                  status === 'Low' ? 'text-yellow-600 dark:text-yellow-400' :
                  'text-green-600 dark:text-green-400'
                }`}>
                  {item.quantity}
                </span>
              </div>

              {/* Progress Bar */}
              <div className="relative bg-white/60 dark:bg-gray-700/50 rounded-full h-1 overflow-hidden shadow-inner mb-1">
                <div
                  className={`absolute top-0 left-0 h-full rounded-full transition-all ${
                    progress <= 20 ? 'bg-gradient-to-r from-red-500 to-red-600' :
                    progress <= 30 ? 'bg-gradient-to-r from-red-400 to-red-500' :
                    progress <= 40 ? 'bg-gradient-to-r from-orange-400 to-orange-500' :
                    progress <= 50 ? 'bg-gradient-to-r from-yellow-400 to-yellow-500' :
                    progress <= 60 ? 'bg-gradient-to-r from-yellow-300 to-yellow-400' :
                    progress <= 70 ? 'bg-gradient-to-r from-lime-400 to-lime-500' :
                    progress <= 80 ? 'bg-gradient-to-r from-green-400 to-green-500' :
                    'bg-gradient-to-r from-green-500 to-emerald-600'
                  }`}
                  style={{ width: `${progress}%` }}
                />
              </div>

              {/* Percentage */}
              <p className="text-center text-[7px] font-black text-gray-600 dark:text-gray-400 mb-1">
                {Math.round(progress)}%
              </p>

              {/* Footer Stats */}
              <div className="pt-1 border-t border-gray-200/50 dark:border-gray-700/50 space-y-0.5">
                <div className="flex justify-between items-center">
                  <span className="text-[7px] text-gray-500 dark:text-gray-400 font-bold">Min</span>
                  <span className="text-[8px] font-black text-gray-700 dark:text-gray-300">{item.min_stock}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[7px] text-gray-500 dark:text-gray-400 font-bold">Max</span>
                  <span className="text-[8px] font-black text-gray-700 dark:text-gray-300">{item.normal_stock}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredData.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-3">
            <Search size={28} className="text-gray-400" />
          </div>
          <p className="text-gray-400 dark:text-gray-500 font-bold text-sm">No items found</p>
          <p className="text-xs text-gray-400 dark:text-gray-600 mt-1">Try adjusting your filters</p>
        </div>
      )}
    </div>
  );
}
