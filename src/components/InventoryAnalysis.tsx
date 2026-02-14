import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

type ViewMode = 'card' | 'table';
type Status = 'Healthy' | 'Low' | 'Critical';

interface InventoryItem {
  name: string;
  sku: string;
  quantity: number;
  min_stock: number;
  normal_stock: number;
  category: string;
}

export function InventoryAnalysis() {
  const [viewMode, setViewMode] = useState<ViewMode>('card');
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [inventoryData, setInventoryData] = useState<InventoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [cardScale, setCardScale] = useState(100);

  const loadInventory = async () => {
    const userData = localStorage.getItem('arento_user');
    if (!userData) return;

    const { client_id: clientId } = JSON.parse(userData);

    const { data } = await supabase
      .from('inventory_items')
      .select('name, sku, quantity, min_stock, normal_stock, category')
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
    const ratio = item.quantity / item.min_stock;
    if (ratio <= 1) return 'Critical';
    if (ratio <= 1.5) return 'Low';
    return 'Healthy';
  };

  const getProgressPercentage = (item: InventoryItem) => {
    return Math.min((item.quantity / item.normal_stock) * 100, 100);
  };

  const getCardBackground = (percentage: number) => {
    if (percentage === 0) return 'bg-red-200';
    if (percentage <= 20) return 'bg-red-100';
    if (percentage <= 30) return 'bg-red-50';
    if (percentage <= 40) return 'bg-orange-100';
    if (percentage <= 50) return 'bg-yellow-100';
    if (percentage <= 60) return 'bg-yellow-50';
    if (percentage <= 70) return 'bg-lime-100';
    if (percentage <= 80) return 'bg-lime-50';
    return 'bg-green-100';
  };

  const filteredData = inventoryData
    .filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           item.sku.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
      const matchesStatus = statusFilter === 'all' || getStatus(item) === statusFilter;
      return matchesSearch && matchesCategory && matchesStatus;
    })
    .sort((a, b) => {
      const ratioA = a.quantity / a.min_stock;
      const ratioB = b.quantity / b.min_stock;
      return ratioA - ratioB;
    });

  const statusCounts = {
    healthy: inventoryData.filter(item => getStatus(item) === 'Healthy').length,
    low: inventoryData.filter(item => getStatus(item) === 'Low').length,
    critical: inventoryData.filter(item => getStatus(item) === 'Critical').length,
  };

  const categories = ['all', ...Array.from(new Set(inventoryData.map(item => item.category)))];

  const cardWidth = (200 * cardScale) / 100;
  const cardHeight = (240 * cardScale) / 100;
  const fontSize = cardScale / 100;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#348ADC] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-semibold">Loading analysis...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-4">
        <div className="bg-white border border-gray-200 rounded-full p-0.5 flex gap-0.5 shadow-sm">
          <button
            onClick={() => setViewMode('card')}
            className={`rounded-full px-2.5 py-1 text-xs font-medium transition ${
              viewMode === 'card'
                ? 'bg-[#348ADC] text-white shadow-sm'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            Card
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`rounded-full px-2.5 py-1 text-xs font-medium transition ${
              viewMode === 'table'
                ? 'bg-[#348ADC] text-white shadow-sm'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            Table
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setStatusFilter(statusFilter === 'Healthy' ? 'all' : 'Healthy')}
            className={`rounded-lg border px-3 py-1.5 flex items-center gap-2 transition-all ${
              statusFilter === 'Healthy' 
                ? 'bg-green-100 border-green-300 shadow-sm' 
                : 'bg-white border-gray-200 hover:border-green-300'
            }`}
          >
            <span className="text-sm font-semibold text-green-600" style={{ fontFamily: 'Poppins, sans-serif' }}>
              {statusCounts.healthy}
            </span>
            <span className="text-xs text-gray-500" style={{ fontFamily: 'Inter, sans-serif' }}>Healthy</span>
          </button>

          <button
            onClick={() => setStatusFilter(statusFilter === 'Low' ? 'all' : 'Low')}
            className={`rounded-lg border px-3 py-1.5 flex items-center gap-2 transition-all ${
              statusFilter === 'Low' 
                ? 'bg-yellow-100 border-yellow-300 shadow-sm' 
                : 'bg-white border-gray-200 hover:border-yellow-300'
            }`}
          >
            <span className="text-sm font-semibold text-yellow-600" style={{ fontFamily: 'Poppins, sans-serif' }}>
              {statusCounts.low}
            </span>
            <span className="text-xs text-gray-500" style={{ fontFamily: 'Inter, sans-serif' }}>Low</span>
          </button>

          <button
            onClick={() => setStatusFilter(statusFilter === 'Critical' ? 'all' : 'Critical')}
            className={`rounded-lg border px-3 py-1.5 flex items-center gap-2 transition-all ${
              statusFilter === 'Critical' 
                ? 'bg-red-100 border-red-300 shadow-sm' 
                : 'bg-white border-gray-200 hover:border-red-300'
            }`}
          >
            <span className="text-sm font-semibold text-red-600" style={{ fontFamily: 'Poppins, sans-serif' }}>
              {statusCounts.critical}
            </span>
            <span className="text-xs text-gray-500" style={{ fontFamily: 'Inter, sans-serif' }}>Critical</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-2">
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-2.5 py-1.5 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-[#348ADC] focus:border-transparent"
            style={{ fontFamily: 'Inter, sans-serif' }}
          />

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-2.5 py-1.5 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-[#348ADC] focus:border-transparent"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>
                {cat === 'all' ? 'All' : cat}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-2.5 py-1.5 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-[#348ADC] focus:border-transparent"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            <option value="all">All</option>
            <option value="Healthy">Healthy</option>
            <option value="Low">Low</option>
            <option value="Critical">Critical</option>
          </select>

          <button
            onClick={() => {
              setSearchTerm('');
              setCategoryFilter('all');
              setStatusFilter('all');
            }}
            className="px-2.5 py-1.5 border border-gray-300 text-gray-600 rounded text-xs hover:bg-gray-50 transition"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            Clear
          </button>
        </div>
      </div>

      {viewMode === 'card' && (
        <div className="grid grid-cols-[repeat(auto-fill,200px)] gap-3">
          {filteredData.map((item, idx) => {
            const status = getStatus(item);
            const progress = getProgressPercentage(item);
            const isLowOrCritical = status === 'Low' || status === 'Critical';
            
            return (
              <div
                key={idx}
                className={`relative rounded-2xl border-2 p-5 hover:shadow-xl transition-all duration-200 cursor-pointer group w-[200px] h-[240px] flex flex-col ${
                  getCardBackground(progress)
                } ${
                  status === 'Critical' ? 'border-red-400 shadow-red-100' : 
                  status === 'Low' ? 'border-yellow-400 shadow-yellow-100' : 
                  'border-gray-200 hover:border-[#348ADC]'
                }`}
              >
                <div className={`absolute top-2 right-2 px-2 py-0.5 rounded-full text-xs font-bold ${
                  status === 'Critical' ? 'bg-red-100 text-red-700' :
                  status === 'Low' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-green-100 text-green-700'
                }`} style={{ fontFamily: 'Inter, sans-serif' }}>
                  {status}
                </div>

                <div className="mb-3 pr-12">
                  <h3 className="text-sm font-bold text-[#072741] mb-1 leading-tight line-clamp-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    {item.name}
                  </h3>
                  <p className="text-xs text-gray-400 font-mono">{item.sku}</p>
                </div>

                <div className="flex-1 flex flex-col justify-center mb-3">
                  <div className="flex items-baseline gap-1 mb-2 justify-center">
                    <span className={`text-3xl font-bold ${
                      status === 'Critical' ? 'text-red-600' :
                      status === 'Low' ? 'text-yellow-600' :
                      'text-[#348ADC]'
                    }`} style={{ fontFamily: 'Poppins, sans-serif' }}>
                      {item.quantity}
                    </span>
                  </div>
                  
                  <div className="relative w-full bg-white/50 rounded-full h-2 overflow-hidden">
                    <div
                      className={`absolute top-0 left-0 h-full rounded-full transition-all duration-500 ${
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
                    >
                      <div className="absolute inset-0 bg-white/20"></div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                  <div className="text-center">
                    <div className="text-xs text-gray-400 mb-0.5" style={{ fontFamily: 'Inter, sans-serif' }}>Min</div>
                    <div className="text-sm font-bold text-gray-700" style={{ fontFamily: 'Poppins, sans-serif' }}>{item.min_stock}</div>
                  </div>
                  <div className="w-px h-6 bg-gray-200"></div>
                  <div className="text-center">
                    <div className="text-xs text-gray-400 mb-0.5" style={{ fontFamily: 'Inter, sans-serif' }}>Normal</div>
                    <div className="text-sm font-bold text-gray-700" style={{ fontFamily: 'Poppins, sans-serif' }}>{item.normal_stock}</div>
                  </div>
                </div>

                {isLowOrCritical && (
                  <div className={`absolute -top-1 -right-1 w-4 h-4 rounded-full animate-pulse ${
                    status === 'Critical' ? 'bg-red-500' : 'bg-yellow-500'
                  }`}>
                    <div className={`absolute inset-0 rounded-full animate-ping ${
                      status === 'Critical' ? 'bg-red-500' : 'bg-yellow-500'
                    }`}></div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {viewMode === 'table' && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-auto">
          <table className="w-full" style={{ fontFamily: 'Inter, sans-serif' }}>
            <thead className="sticky top-0 bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left text-xs font-semibold text-gray-600 px-4 py-3">Item Name</th>
                <th className="text-left text-xs font-semibold text-gray-600 px-4 py-3">SKU</th>
                <th className="text-left text-xs font-semibold text-gray-600 px-4 py-3">Quantity</th>
                <th className="text-left text-xs font-semibold text-gray-600 px-4 py-3">Minimum</th>
                <th className="text-left text-xs font-semibold text-gray-600 px-4 py-3">Normal</th>
                <th className="text-left text-xs font-semibold text-gray-600 px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item, idx) => {
                const status = getStatus(item);
                return (
                  <tr
                    key={idx}
                    className={`border-b border-gray-100 hover:bg-gray-50 transition ${
                      status === 'Critical' ? 'bg-red-50' :
                      status === 'Low' ? 'bg-yellow-50' :
                      ''
                    }`}
                  >
                    <td className="px-4 py-3 text-sm text-[#072741] font-medium">{item.name}</td>
                    <td className="px-4 py-3 text-xs text-gray-600">{item.sku}</td>
                    <td className="px-4 py-3 text-sm text-[#072741] font-semibold">{item.quantity}</td>
                    <td className="px-4 py-3 text-xs text-gray-600">{item.min_stock}</td>
                    <td className="px-4 py-3 text-xs text-gray-600">{item.normal_stock}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-medium ${
                        status === 'Critical' ? 'text-red-600' :
                        status === 'Low' ? 'text-yellow-600' :
                        'text-green-600'
                      }`}>
                        {status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
