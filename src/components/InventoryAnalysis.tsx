import { useState } from 'react';

type ViewMode = 'card' | 'table';
type Status = 'Healthy' | 'Low' | 'Critical';

interface InventoryItem {
  name: string;
  sku: string;
  quantity: number;
  unit: string;
  minimum: number;
  normal: number;
  category: string;
}

export function InventoryAnalysis() {
  const [viewMode, setViewMode] = useState<ViewMode>('card');
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const inventoryData: InventoryItem[] = [
    { name: 'Brake Pad Set', sku: 'BP-2024', quantity: 3, unit: 'pcs', minimum: 10, normal: 50, category: 'Brakes' },
    { name: 'Engine Oil Filter', sku: 'EOF-445', quantity: 8, unit: 'pcs', minimum: 15, normal: 60, category: 'Filters' },
    { name: 'Spark Plug', sku: 'SP-890', quantity: 18, unit: 'pcs', minimum: 20, normal: 80, category: 'Ignition' },
    { name: 'Air Filter', sku: 'AF-332', quantity: 12, unit: 'pcs', minimum: 15, normal: 50, category: 'Filters' },
    { name: 'Wiper Blade', sku: 'WB-101', quantity: 22, unit: 'pcs', minimum: 25, normal: 100, category: 'Accessories' },
    { name: 'Engine Oil 5W-30', sku: 'EO-530', quantity: 45, unit: 'L', minimum: 20, normal: 80, category: 'Fluids' },
    { name: 'Coolant', sku: 'CL-1L', quantity: 35, unit: 'L', minimum: 15, normal: 60, category: 'Fluids' },
    { name: 'Battery 12V', sku: 'BAT-12V', quantity: 8, unit: 'pcs', minimum: 5, normal: 20, category: 'Electrical' },
    { name: 'Headlight Bulb H7', sku: 'HB-H7', quantity: 28, unit: 'pcs', minimum: 30, normal: 100, category: 'Lighting' },
    { name: 'Transmission Fluid', sku: 'TF-ATF', quantity: 18, unit: 'L', minimum: 10, normal: 40, category: 'Fluids' },
    { name: 'Cabin Filter', sku: 'CF-220', quantity: 42, unit: 'pcs', minimum: 20, normal: 80, category: 'Filters' },
    { name: 'Timing Belt', sku: 'TB-998', quantity: 6, unit: 'pcs', minimum: 8, normal: 30, category: 'Engine' },
    { name: 'Brake Fluid DOT4', sku: 'BF-DOT4', quantity: 14, unit: 'L', minimum: 12, normal: 40, category: 'Fluids' },
    { name: 'Power Steering Fluid', sku: 'PSF-100', quantity: 16, unit: 'L', minimum: 15, normal: 50, category: 'Fluids' },
    { name: 'Radiator Cap', sku: 'RC-15', quantity: 11, unit: 'pcs', minimum: 10, normal: 35, category: 'Cooling' },
    { name: 'Fuel Filter', sku: 'FF-890', quantity: 19, unit: 'pcs', minimum: 18, normal: 60, category: 'Filters' },
    { name: 'Serpentine Belt', sku: 'SB-456', quantity: 13, unit: 'pcs', minimum: 12, normal: 40, category: 'Engine' },
    { name: 'Motor Oil 10W-40', sku: 'MO-1040', quantity: 68, unit: 'L', minimum: 20, normal: 70, category: 'Fluids' },
    { name: 'Windshield Washer', sku: 'WW-500', quantity: 52, unit: 'L', minimum: 15, normal: 60, category: 'Fluids' },
    { name: 'Tire Pressure Gauge', sku: 'TPG-20', quantity: 48, unit: 'pcs', minimum: 10, normal: 50, category: 'Tools' },
    { name: 'Oil Drain Plug', sku: 'ODP-88', quantity: 95, unit: 'pcs', minimum: 30, normal: 100, category: 'Engine' },
    { name: 'Fuse Assortment', sku: 'FA-MIX', quantity: 180, unit: 'pcs', minimum: 50, normal: 200, category: 'Electrical' },
    { name: 'Zip Ties Pack', sku: 'ZT-100', quantity: 420, unit: 'pcs', minimum: 100, normal: 500, category: 'Accessories' },
  ];

  const getStatus = (item: InventoryItem): Status => {
    if (item.quantity <= item.minimum) return 'Critical';
    if (item.quantity < item.minimum * 1.5) return 'Low';
    return 'Healthy';
  };

  const getProgressPercentage = (item: InventoryItem) => {
    return Math.min((item.quantity / item.normal) * 100, 100);
  };

  const getProgressColor = (percentage: number) => {
    if (percentage <= 20) return 'from-red-600 to-red-700';
    if (percentage <= 30) return 'from-red-500 to-red-600';
    if (percentage <= 40) return 'from-orange-500 to-red-500';
    if (percentage <= 50) return 'from-yellow-500 to-orange-500';
    if (percentage <= 60) return 'from-yellow-400 to-yellow-500';
    if (percentage <= 70) return 'from-lime-400 to-yellow-400';
    if (percentage <= 80) return 'from-green-400 to-lime-400';
    return 'from-green-500 to-green-600';
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
      const percentA = (a.quantity / a.normal) * 100;
      const percentB = (b.quantity / b.normal) * 100;
      return percentA - percentB; // Sort from lowest to highest percentage (most critical first)
    });

  const statusCounts = {
    healthy: inventoryData.filter(item => getStatus(item) === 'Healthy').length,
    low: inventoryData.filter(item => getStatus(item) === 'Low').length,
    critical: inventoryData.filter(item => getStatus(item) === 'Critical').length,
  };

  const categories = ['all', ...Array.from(new Set(inventoryData.map(item => item.category)))];

  return (
    <div className="space-y-2">
      {/* Compact Header Row */}
      <div className="flex items-center justify-between gap-4">
        {/* Toggle */}
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

        {/* Summary Counters - Inline */}
        <div className="flex items-center gap-2">
          <div className="bg-white rounded-lg border border-gray-200 px-3 py-1.5 flex items-center gap-2">
            <span className="text-sm font-semibold text-green-600" style={{ fontFamily: 'Poppins, sans-serif' }}>
              {statusCounts.healthy}
            </span>
            <span className="text-xs text-gray-500" style={{ fontFamily: 'Inter, sans-serif' }}>Healthy</span>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 px-3 py-1.5 flex items-center gap-2">
            <span className="text-sm font-semibold text-yellow-600" style={{ fontFamily: 'Poppins, sans-serif' }}>
              {statusCounts.low}
            </span>
            <span className="text-xs text-gray-500" style={{ fontFamily: 'Inter, sans-serif' }}>Low</span>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 px-3 py-1.5 flex items-center gap-2">
            <span className="text-sm font-semibold text-red-600" style={{ fontFamily: 'Poppins, sans-serif' }}>
              {statusCounts.critical}
            </span>
            <span className="text-xs text-gray-500" style={{ fontFamily: 'Inter, sans-serif' }}>Critical</span>
          </div>
        </div>
      </div>

      {/* Compact Filter Bar */}
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

      {/* Card View */}
      {viewMode === 'card' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
          {filteredData.map((item, idx) => {
            const status = getStatus(item);
            const progress = getProgressPercentage(item);
            const isLowOrCritical = status === 'Low' || status === 'Critical';
            
            return (
              <div
                key={idx}
                className={`relative bg-white rounded-2xl border-2 p-6 hover:shadow-xl transition-all duration-200 cursor-pointer group ${
                  status === 'Critical' ? 'border-red-400 shadow-red-100' : 
                  status === 'Low' ? 'border-yellow-400 shadow-yellow-100' : 
                  'border-gray-200 hover:border-[#348ADC]'
                }`}
                title={`${item.name} (${item.sku})`}
              >
                {/* Status Badge */}
                <div className={`absolute top-3 right-3 px-2 py-0.5 rounded-full text-xs font-bold ${
                  status === 'Critical' ? 'bg-red-100 text-red-700' :
                  status === 'Low' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-green-100 text-green-700'
                }`} style={{ fontFamily: 'Inter, sans-serif' }}>
                  {status}
                </div>

                {/* Item Name */}
                <div className="mb-4 pr-16 h-12">
                  <h3 className="text-base font-bold text-[#072741] mb-1 leading-tight line-clamp-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    {item.name}
                  </h3>
                  <p className="text-xs text-gray-400 font-mono">{item.sku}</p>
                </div>

                {/* Quantity Display */}
                <div className="mb-4">
                  <div className="flex items-baseline gap-1 mb-2">
                    <span className={`text-3xl font-bold ${
                      status === 'Critical' ? 'text-red-600' :
                      status === 'Low' ? 'text-yellow-600' :
                      'text-[#348ADC]'
                    }`} style={{ fontFamily: 'Poppins, sans-serif' }}>
                      {item.quantity}
                    </span>
                    <span className="text-sm text-gray-400 font-medium">{item.unit}</span>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="relative w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                    <div
                      className={`absolute top-0 left-0 h-full rounded-full transition-all duration-500 bg-gradient-to-r ${
                        getProgressColor(progress)
                      }`}
                      style={{ width: `${progress}%` }}
                    >
                      <div className="absolute inset-0 bg-white/20"></div>
                    </div>
                  </div>
                </div>

                {/* Stock Levels */}
                <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                  <div className="text-center">
                    <div className="text-xs text-gray-400 mb-0.5" style={{ fontFamily: 'Inter, sans-serif' }}>Min</div>
                    <div className="text-sm font-bold text-gray-700" style={{ fontFamily: 'Poppins, sans-serif' }}>{item.minimum}</div>
                  </div>
                  <div className="w-px h-8 bg-gray-200"></div>
                  <div className="text-center">
                    <div className="text-xs text-gray-400 mb-0.5" style={{ fontFamily: 'Inter, sans-serif' }}>Normal</div>
                    <div className="text-sm font-bold text-gray-700" style={{ fontFamily: 'Poppins, sans-serif' }}>{item.normal}</div>
                  </div>
                </div>

                {/* Alert Indicator */}
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

      {/* Table View */}
      {viewMode === 'table' && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-auto">
          <table className="w-full" style={{ fontFamily: 'Inter, sans-serif' }}>
            <thead className="sticky top-0 bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left text-xs font-semibold text-gray-600 px-4 py-3">Item Name</th>
                <th className="text-left text-xs font-semibold text-gray-600 px-4 py-3">SKU</th>
                <th className="text-left text-xs font-semibold text-gray-600 px-4 py-3">Quantity</th>
                <th className="text-left text-xs font-semibold text-gray-600 px-4 py-3">Unit</th>
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
                    <td className="px-4 py-3 text-xs text-gray-600">{item.unit}</td>
                    <td className="px-4 py-3 text-xs text-gray-600">{item.minimum}</td>
                    <td className="px-4 py-3 text-xs text-gray-600">{item.normal}</td>
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
