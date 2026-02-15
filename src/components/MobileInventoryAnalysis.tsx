import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Search } from 'lucide-react';

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
          <div className="w-12 h-12 border-4 border-[#6366f1] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-semibold">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Status Summary - Horizontal Scroll */}
      <div className="flex gap-2 overflow-x-auto pb-2 px-1 -mx-1 scrollbar-hide">
        <button
          onClick={() => setStatusFilter(statusFilter === 'Healthy' ? 'all' : 'Healthy')}
          className={`flex-shrink-0 px-3 py-2 rounded-xl border-2 transition ${
            statusFilter === 'Healthy' 
              ? 'bg-green-500 border-green-600 shadow-md' 
              : 'bg-white dark:bg-[#1e1e1e] border-green-200 dark:border-green-800'
          }`}
        >
          <p className={`text-xl font-bold ${statusFilter === 'Healthy' ? 'text-white' : 'text-green-600'}`}>
            {statusCounts.healthy}
          </p>
          <p className={`text-[10px] font-medium mt-0.5 ${statusFilter === 'Healthy' ? 'text-white' : 'text-gray-600 dark:text-gray-400'}`}>
            Healthy
          </p>
        </button>

        <button
          onClick={() => setStatusFilter(statusFilter === 'Low' ? 'all' : 'Low')}
          className={`flex-shrink-0 px-3 py-2 rounded-xl border-2 transition ${
            statusFilter === 'Low' 
              ? 'bg-yellow-500 border-yellow-600 shadow-md' 
              : 'bg-white dark:bg-[#1e1e1e] border-yellow-200 dark:border-yellow-800'
          }`}
        >
          <p className={`text-xl font-bold ${statusFilter === 'Low' ? 'text-white' : 'text-yellow-600'}`}>
            {statusCounts.low}
          </p>
          <p className={`text-[10px] font-medium mt-0.5 ${statusFilter === 'Low' ? 'text-white' : 'text-gray-600 dark:text-gray-400'}`}>
            Low Stock
          </p>
        </button>

        <button
          onClick={() => setStatusFilter(statusFilter === 'Critical' ? 'all' : 'Critical')}
          className={`flex-shrink-0 px-3 py-2 rounded-xl border-2 transition ${
            statusFilter === 'Critical' 
              ? 'bg-orange-500 border-orange-600 shadow-md' 
              : 'bg-white dark:bg-[#1e1e1e] border-orange-200 dark:border-orange-800'
          }`}
        >
          <p className={`text-xl font-bold ${statusFilter === 'Critical' ? 'text-white' : 'text-orange-600'}`}>
            {statusCounts.critical}
          </p>
          <p className={`text-[10px] font-medium mt-0.5 ${statusFilter === 'Critical' ? 'text-white' : 'text-gray-600 dark:text-gray-400'}`}>
            Critical
          </p>
        </button>

        <button
          onClick={() => setStatusFilter(statusFilter === 'OutOfStock' ? 'all' : 'OutOfStock')}
          className={`flex-shrink-0 px-3 py-2 rounded-xl border-2 transition ${
            statusFilter === 'OutOfStock' 
              ? 'bg-red-500 border-red-600 shadow-md' 
              : 'bg-white dark:bg-[#1e1e1e] border-red-200 dark:border-red-800'
          }`}
        >
          <p className={`text-xl font-bold ${statusFilter === 'OutOfStock' ? 'text-white' : 'text-red-600'}`}>
            {statusCounts.outOfStock}
          </p>
          <p className={`text-[10px] font-medium mt-0.5 ${statusFilter === 'OutOfStock' ? 'text-white' : 'text-gray-600 dark:text-gray-400'}`}>
            Out of Stock
          </p>
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Search items..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-2xl text-base focus:border-[#6366f1] focus:outline-none bg-white dark:bg-[#1e1e1e]"
        />
      </div>

      {/* Inventory Cards - Vertical Stack */}
      <div className="space-y-2">
        {filteredData.map((item, idx) => {
          const status = getStatus(item);
          const progress = getProgressPercentage(item);
          
          return (
            <div
              key={idx}
              className={`rounded-xl p-3 border-2 shadow-sm ${getCardBackground(progress)}`}
            >
              {/* Header */}
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 dark:text-white text-sm leading-tight line-clamp-1">
                    {item.name}
                  </h3>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">SKU: {item.sku}</p>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ml-2 flex-shrink-0 ${
                  item.quantity === 0 ? 'bg-red-500 text-white' :
                  status === 'Critical' ? 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300' :
                  status === 'Low' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-300' :
                  'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300'
                }`}>
                  {item.quantity === 0 ? 'Out' : status}
                </span>
              </div>

              {/* Quantity & Progress */}
              <div className="flex items-center gap-3 mb-2">
                <div className="flex items-baseline">
                  <span className={`text-2xl font-bold ${
                    status === 'Critical' ? 'text-red-600 dark:text-red-400' :
                    status === 'Low' ? 'text-yellow-600 dark:text-yellow-400' :
                    'text-green-600 dark:text-green-400'
                  }`}>
                    {item.quantity}
                  </span>
                  <span className="text-[10px] text-gray-500 dark:text-gray-400 ml-1">units</span>
                </div>
                
                {/* Progress Bar */}
                <div className="flex-1 relative bg-white/50 dark:bg-gray-700/50 rounded-full h-1.5 overflow-hidden">
                  <div
                    className={`absolute top-0 left-0 h-full rounded-full transition-all ${
                      progress <= 20 ? 'bg-red-500' :
                      progress <= 30 ? 'bg-red-400' :
                      progress <= 40 ? 'bg-orange-400' :
                      progress <= 50 ? 'bg-yellow-400' :
                      progress <= 60 ? 'bg-yellow-300' :
                      progress <= 70 ? 'bg-lime-400' :
                      progress <= 80 ? 'bg-green-400' :
                      'bg-green-500'
                    }`}
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              {/* Footer Stats */}
              <div className="flex justify-between items-center pt-2 border-t border-gray-200 dark:border-gray-700">
                <div className="text-center flex-1">
                  <p className="text-[10px] text-gray-500 dark:text-gray-400">Min</p>
                  <p className="text-xs font-bold text-gray-700 dark:text-gray-300">{item.min_stock}</p>
                </div>
                <div className="w-px h-6 bg-gray-200 dark:bg-gray-700"></div>
                <div className="text-center flex-1">
                  <p className="text-[10px] text-gray-500 dark:text-gray-400">Normal</p>
                  <p className="text-xs font-bold text-gray-700 dark:text-gray-300">{item.normal_stock}</p>
                </div>
                <div className="w-px h-6 bg-gray-200 dark:bg-gray-700"></div>
                <div className="text-center flex-1">
                  <p className="text-[10px] text-gray-500 dark:text-gray-400">Category</p>
                  <p className="text-xs font-bold text-gray-700 dark:text-gray-300 truncate">{item.category}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredData.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-400 dark:text-gray-500">No items found</p>
        </div>
      )}
    </div>
  );
}
