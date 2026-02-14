import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { InventoryCardGuide } from './InventoryCardGuide';
import { BookOpen } from 'lucide-react';

type ViewMode = 'card' | 'table';
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
  unit?: string;
  vendor_name?: string;
}

export function InventoryAnalysis() {
  const [viewMode, setViewMode] = useState<ViewMode>('card');
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [vendorFilter, setVendorFilter] = useState('all');
  const [sortOrder, setSortOrder] = useState<'critical' | 'healthy'>('critical');
  const [inventoryData, setInventoryData] = useState<InventoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [cardScale, setCardScale] = useState(100);
  const [showScaleDropdown, setShowScaleDropdown] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [clickedCard, setClickedCard] = useState<number | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState<{ horizontal: 'right' | 'left', vertical: 'top' | 'bottom' }>({ horizontal: 'right', vertical: 'top' });
  const [showGuide, setShowGuide] = useState(false);

  const minCardWidth = (160 * cardScale) / 100;
  const cardHeight = (192 * cardScale) / 100;

  const loadInventory = async () => {
    const userData = localStorage.getItem('arento_user');
    if (!userData) return;

    const { client_id: clientId } = JSON.parse(userData);

    const { data } = await supabase
      .from('inventory_items')
      .select('name, sku, quantity, min_stock, normal_stock, category, cost_price, selling_price, unit, vendor_name')
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

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Element;
      if (showScaleDropdown && !target.closest('[data-scale-control]')) {
        setShowScaleDropdown(false);
      }
      if (clickedCard !== null && !target.closest('[data-card]')) {
        setClickedCard(null);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [showScaleDropdown, clickedCard]);

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
      const matchesStatus = statusFilter === 'all' || 
                           (statusFilter === 'OutOfStock' && item.quantity === 0) ||
                           (statusFilter !== 'OutOfStock' && getStatus(item) === statusFilter);
      const matchesVendor = vendorFilter === 'all' || item.vendor_name === vendorFilter;
      return matchesSearch && matchesCategory && matchesStatus && matchesVendor;
    })
    .sort((a, b) => {
      const ratioA = a.quantity / a.min_stock;
      const ratioB = b.quantity / b.min_stock;
      return sortOrder === 'critical' ? ratioA - ratioB : ratioB - ratioA;
    });

  const statusCounts = {
    healthy: inventoryData.filter(item => getStatus(item) === 'Healthy').length,
    low: inventoryData.filter(item => getStatus(item) === 'Low').length,
    critical: inventoryData.filter(item => getStatus(item) === 'Critical' && item.quantity > 0).length,
    outOfStock: inventoryData.filter(item => item.quantity === 0).length,
  };

  const categories = ['all', ...Array.from(new Set(inventoryData.map(item => item.category)))];
  const vendors = ['all', ...Array.from(new Set(inventoryData.map(item => item.vendor_name).filter(Boolean)))];

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
      {showGuide && <InventoryCardGuide onClose={() => setShowGuide(false)} />}
      
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
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

        {viewMode === 'card' && (
          <div data-scale-control className="relative flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-1.5 shadow-sm">
            <button
              onClick={() => setCardScale(Math.max(50, cardScale - 10))}
              disabled={cardScale <= 50}
              className="w-6 h-6 flex items-center justify-center rounded hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition"
            >
              <span className="text-gray-600 font-bold text-lg">−</span>
            </button>
            <button
              onClick={() => setShowScaleDropdown(!showScaleDropdown)}
              className="text-xs font-semibold text-gray-600 min-w-[45px] text-center hover:bg-gray-50 rounded px-2 py-1 transition"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              {cardScale}%
            </button>
            <button
              onClick={() => setCardScale(Math.min(150, cardScale + 10))}
              disabled={cardScale >= 150}
              className="w-6 h-6 flex items-center justify-center rounded hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition"
            >
              <span className="text-gray-600 font-bold text-lg">+</span>
            </button>

            {showScaleDropdown && (
              <div className="absolute top-full mt-1 right-0 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-10 min-w-[100px]">
                {[50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150].map(scale => (
                  <button
                    key={scale}
                    onClick={() => {
                      setCardScale(scale);
                      setShowScaleDropdown(false);
                    }}
                    className={`w-full px-3 py-1.5 text-xs text-left hover:bg-gray-50 transition ${
                      cardScale === scale ? 'bg-blue-50 text-[#348ADC] font-semibold' : 'text-gray-600'
                    }`}
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  >
                    {scale}%
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        <button
          onClick={() => setSortOrder(sortOrder === 'critical' ? 'healthy' : 'critical')}
          className="bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 transition shadow-sm"
          style={{ fontFamily: 'Inter, sans-serif' }}
        >
          {sortOrder === 'critical' ? '↑ Most Critical' : '↓ Healthiest'}
        </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowGuide(true)}
            className="bg-[#348ADC] text-white px-4 py-1.5 rounded-lg text-xs font-semibold hover:bg-[#2a6fb0] transition shadow-sm flex items-center gap-2"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            <BookOpen className="w-3.5 h-3.5" />
            Understand Cards
          </button>
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

          <button
            onClick={() => setStatusFilter(statusFilter === 'OutOfStock' ? 'all' : 'OutOfStock')}
            className={`rounded-lg border px-3 py-1.5 flex items-center gap-2 transition-all ${
              statusFilter === 'OutOfStock' 
                ? 'bg-red-600 border-red-700 shadow-sm' 
                : 'bg-white border-gray-200 hover:border-red-600'
            }`}
          >
            <span className={`text-sm font-semibold ${
              statusFilter === 'OutOfStock' ? 'text-white' : 'text-red-600'
            }`} style={{ fontFamily: 'Poppins, sans-serif' }}>
              {statusCounts.outOfStock}
            </span>
            <span className={`text-xs ${
              statusFilter === 'OutOfStock' ? 'text-white' : 'text-gray-500'
            }`} style={{ fontFamily: 'Inter, sans-serif' }}>Out of Stock</span>
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
            <option value="all">All Status</option>
            <option value="Healthy">Healthy</option>
            <option value="Low">Low</option>
            <option value="Critical">Critical</option>
            <option value="OutOfStock">Out of Stock</option>
          </select>

          <select
            value={vendorFilter}
            onChange={(e) => setVendorFilter(e.target.value)}
            className="px-2.5 py-1.5 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-[#348ADC] focus:border-transparent"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            <option value="all">All Vendors</option>
            {vendors.slice(1).map(vendor => (
              <option key={vendor} value={vendor}>
                {vendor}
              </option>
            ))}
          </select>

          <button
            onClick={() => {
              setSearchTerm('');
              setCategoryFilter('all');
              setStatusFilter('all');
              setVendorFilter('all');
            }}
            className="px-2.5 py-1.5 border border-gray-300 text-gray-600 rounded text-xs hover:bg-gray-50 transition"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            Clear
          </button>
        </div>
      </div>

      {viewMode === 'card' && (
        <div className="flex flex-wrap gap-3 justify-start">
          {filteredData.map((item, idx) => {
            const status = getStatus(item);
            const progress = getProgressPercentage(item);
            const isLowOrCritical = status === 'Low' || status === 'Critical';
            
            return (
              <div
                key={idx}
                data-card
                className={`relative rounded-2xl border-2 hover:shadow-xl transition-all duration-200 cursor-pointer group flex flex-col max-w-[180px] ${
                  getCardBackground(progress)
                } ${
                  status === 'Critical' ? 'border-red-400 shadow-red-100' : 
                  status === 'Low' ? 'border-yellow-400 shadow-yellow-100' : 
                  'border-gray-200 hover:border-[#348ADC]'
                }`}
                style={{ height: `${cardHeight}px`, padding: `${(16 * cardScale) / 100}px`, width: `${minCardWidth}px` }}
                onClick={(e) => {
                  e.stopPropagation();
                  const rect = e.currentTarget.getBoundingClientRect();
                  const spaceOnRight = window.innerWidth - rect.right;
                  const spaceOnBottom = window.innerHeight - rect.bottom;
                  setTooltipPosition({
                    horizontal: spaceOnRight < 320 ? 'left' : 'right',
                    vertical: spaceOnBottom < 250 ? 'bottom' : 'top'
                  });
                  setClickedCard(clickedCard === idx ? null : idx);
                }}
                onMouseEnter={(e) => {
                  setHoveredCard(idx);
                  const rect = e.currentTarget.getBoundingClientRect();
                  const spaceOnRight = window.innerWidth - rect.right;
                  const spaceOnBottom = window.innerHeight - rect.bottom;
                  setTooltipPosition({
                    horizontal: spaceOnRight < 320 ? 'left' : 'right',
                    vertical: spaceOnBottom < 250 ? 'bottom' : 'top'
                  });
                }}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div className={`absolute rounded-full font-bold ${
                  item.quantity === 0 ? 'bg-red-600 text-white' :
                  status === 'Critical' ? 'bg-red-100 text-red-700' :
                  status === 'Low' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-green-100 text-green-700'
                }`} style={{ 
                  fontFamily: 'Inter, sans-serif',
                  fontSize: `${(10 * cardScale) / 100}px`,
                  padding: `${(2 * cardScale) / 100}px ${(6 * cardScale) / 100}px`,
                  top: `${(6 * cardScale) / 100}px`,
                  right: `${(6 * cardScale) / 100}px`
                }}>
                  {item.quantity === 0 ? 'Out of Stock' : status}
                </div>

                <div style={{ marginBottom: `${(10 * cardScale) / 100}px`, paddingRight: `${(38 * cardScale) / 100}px` }}>
                  <h3 className="font-bold text-[#072741] leading-tight line-clamp-2" style={{ fontFamily: 'Poppins, sans-serif', fontSize: `${(11 * cardScale) / 100}px`, marginBottom: `${(3 * cardScale) / 100}px` }}>
                    {item.name}
                  </h3>
                  <p className="text-gray-600 font-mono font-semibold" style={{ fontSize: `${(10 * cardScale) / 100}px` }}>{item.sku}</p>
                </div>

                <div className="flex-1 flex flex-col justify-center" style={{ marginBottom: `${(10 * cardScale) / 100}px` }}>
                  <div className="flex items-baseline justify-center" style={{ gap: `${(3 * cardScale) / 100}px`, marginBottom: `${(6 * cardScale) / 100}px` }}>
                    <span className={`font-bold ${
                      status === 'Critical' ? 'text-red-600' :
                      status === 'Low' ? 'text-yellow-600' :
                      'text-[#348ADC]'
                    }`} style={{ fontFamily: 'Poppins, sans-serif', fontSize: `${(24 * cardScale) / 100}px` }}>
                      {item.quantity}
                    </span>
                  </div>
                  
                  <div className="relative w-full bg-white/50 rounded-full overflow-hidden" style={{ height: `${(6 * cardScale) / 100}px` }}>
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

                <div className="flex justify-between items-center border-t border-gray-100" style={{ paddingTop: `${(6 * cardScale) / 100}px` }}>
                  <div className="text-center">
                    <div className="text-gray-400" style={{ fontFamily: 'Inter, sans-serif', fontSize: `${(10 * cardScale) / 100}px`, marginBottom: `${(2 * cardScale) / 100}px` }}>Min</div>
                    <div className="font-bold text-gray-700" style={{ fontFamily: 'Poppins, sans-serif', fontSize: `${(11 * cardScale) / 100}px` }}>{item.min_stock}</div>
                  </div>
                  <div className="bg-gray-200" style={{ width: '1px', height: `${(19 * cardScale) / 100}px` }}></div>
                  <div className="text-center">
                    <div className="text-gray-400" style={{ fontFamily: 'Inter, sans-serif', fontSize: `${(10 * cardScale) / 100}px`, marginBottom: `${(2 * cardScale) / 100}px` }}>Normal</div>
                    <div className="font-bold text-gray-700" style={{ fontFamily: 'Poppins, sans-serif', fontSize: `${(11 * cardScale) / 100}px` }}>{item.normal_stock}</div>
                  </div>
                </div>

                {isLowOrCritical && (
                  <div className={`absolute rounded-full animate-pulse ${
                    status === 'Critical' ? 'bg-red-500' : 'bg-yellow-500'
                  }`} style={{ width: `${(13 * cardScale) / 100}px`, height: `${(13 * cardScale) / 100}px`, top: `${(-3 * cardScale) / 100}px`, right: `${(-3 * cardScale) / 100}px` }}>
                    <div className={`absolute inset-0 rounded-full animate-ping ${
                      status === 'Critical' ? 'bg-red-500' : 'bg-yellow-500'
                    }`}></div>
                  </div>
                )}

                {(hoveredCard === idx || clickedCard === idx) && (
                  <div className={`fixed bg-white border-2 border-gray-200 rounded-xl shadow-2xl p-4 z-[100] w-[280px] ${
                    tooltipPosition.horizontal === 'right' ? 'ml-2' : 'mr-2'
                  }`} style={{ 
                    fontFamily: 'Inter, sans-serif',
                    left: tooltipPosition.horizontal === 'right' ? `${document.querySelector(`[data-card]:nth-child(${idx + 1})`)?.getBoundingClientRect().right || 0}px` : 'auto',
                    right: tooltipPosition.horizontal === 'left' ? `${window.innerWidth - (document.querySelector(`[data-card]:nth-child(${idx + 1})`)?.getBoundingClientRect().left || 0)}px` : 'auto',
                    top: tooltipPosition.vertical === 'top' ? `${document.querySelector(`[data-card]:nth-child(${idx + 1})`)?.getBoundingClientRect().top || 0}px` : 'auto',
                    bottom: tooltipPosition.vertical === 'bottom' ? `${window.innerHeight - (document.querySelector(`[data-card]:nth-child(${idx + 1})`)?.getBoundingClientRect().bottom || 0)}px` : 'auto'
                  }}>
                    <div className="space-y-2">
                      <div className="border-b border-gray-200 pb-2">
                        <h4 className="font-bold text-[#072741] text-sm mb-1" style={{ fontFamily: 'Poppins, sans-serif' }}>{item.name}</h4>
                        <p className="text-xs text-gray-500 font-mono">{item.sku}</p>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="text-gray-500">Category:</span>
                          <p className="font-semibold text-gray-700">{item.category}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Status:</span>
                          <p className={`font-semibold ${
                            status === 'Critical' ? 'text-red-600' :
                            status === 'Low' ? 'text-yellow-600' :
                            'text-green-600'
                          }`}>{status}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="text-gray-500">Quantity:</span>
                          <p className="font-semibold text-[#348ADC]">{item.quantity}{item.unit ? ' ' + item.unit : ''}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Min Stock:</span>
                          <p className="font-semibold text-gray-700">{item.min_stock}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="text-gray-500">Normal Stock:</span>
                          <p className="font-semibold text-gray-700">{item.normal_stock}</p>
                        </div>
                        {item.vendor_name && (
                          <div>
                            <span className="text-gray-500">Vendor:</span>
                            <p className="font-semibold text-gray-700">{item.vendor_name}</p>
                          </div>
                        )}
                      </div>

                      {(item.cost_price || item.selling_price) && (
                        <div className="border-t border-gray-200 pt-2 grid grid-cols-2 gap-2 text-xs">
                          {item.cost_price && (
                            <div>
                              <span className="text-gray-500">Cost Price:</span>
                              <p className="font-semibold text-gray-700">₹{item.cost_price}</p>
                            </div>
                          )}
                          {item.selling_price && (
                            <div>
                              <span className="text-gray-500">Selling Price:</span>
                              <p className="font-semibold text-green-600">₹{item.selling_price}</p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
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
