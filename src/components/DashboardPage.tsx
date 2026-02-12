import React from 'react';
import { SalePanel } from './SalePanel';
import { PurchasePanel } from './PurchasePanel';
import { StockAdjustmentPanel } from './StockAdjustmentPanel';

export function DashboardPage() {
  const [showAmounts, setShowAmounts] = React.useState(true);
  const [isSalePanelOpen, setIsSalePanelOpen] = React.useState(false);
  const [isPurchasePanelOpen, setIsPurchasePanelOpen] = React.useState(false);
  const [isStockAdjustmentPanelOpen, setIsStockAdjustmentPanelOpen] = React.useState(false);

  const dummyLowStock = [
    { name: 'Brake Pad Set', sku: 'BP-2024', qty: 3, min: 10, status: 'Critical' },
    { name: 'Engine Oil Filter', sku: 'EOF-445', qty: 8, min: 15, status: 'Critical' },
    { name: 'Spark Plug', sku: 'SP-890', qty: 18, min: 20, status: 'Low' },
    { name: 'Air Filter', sku: 'AF-332', qty: 12, min: 15, status: 'Low' },
    { name: 'Wiper Blade', sku: 'WB-101', qty: 22, min: 25, status: 'Low' },
  ];

  const dummyTransactions = [
    { invoice: 'INV-1024', items: 5, amount: '₹ 3,450', date: 'Today, 2:30 PM' },
    { invoice: 'INV-1023', items: 2, amount: '₹ 1,200', date: 'Today, 1:15 PM' },
    { invoice: 'INV-1022', items: 8, amount: '₹ 5,800', date: 'Today, 11:45 AM' },
    { invoice: 'INV-1021', items: 3, amount: '₹ 2,100', date: 'Today, 10:20 AM' },
  ];

  const topSoldItems = [
    { name: 'Engine Oil 5W-30', sku: 'EO-530', sold: 145, revenue: '₹ 72,500' },
    { name: 'Brake Pad Set', sku: 'BP-2024', sold: 98, revenue: '₹ 58,800' },
    { name: 'Air Filter', sku: 'AF-332', sold: 87, revenue: '₹ 34,800' },
  ];

  const leastSoldItems = [
    { name: 'Headlight Bulb H7', sku: 'HB-H7', sold: 3, revenue: '₹ 450' },
    { name: 'Cabin Filter', sku: 'CF-220', sold: 5, revenue: '₹ 1,250' },
    { name: 'Coolant 1L', sku: 'CL-1L', sold: 8, revenue: '₹ 2,400' },
  ];

  return (
    <div className="space-y-6">
      {/* INVENTORY SECTION */}
      <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-[#072741] mb-1" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Inventory Overview
            </h2>
            <p className="text-sm text-gray-500" style={{ fontFamily: 'Inter, sans-serif' }}>Real-time stock monitoring</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 text-xs text-gray-500" style={{ fontFamily: 'Inter, sans-serif' }}>
              <div className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-white border border-gray-300 rounded text-xs font-semibold">S</kbd>
                <span>Sale</span>
              </div>
              <div className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-white border border-gray-300 rounded text-xs font-semibold">P</kbd>
                <span>Purchase</span>
              </div>
              <div className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-white border border-gray-300 rounded text-xs font-semibold">K</kbd>
                <span>Stock</span>
              </div>
            </div>
            <button
              onClick={() => setShowAmounts(!showAmounts)}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition"
              title={showAmounts ? 'Hide amounts' : 'Show amounts'}
            >
              {showAmounts ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                  <line x1="1" y1="1" x2="23" y2="23"/>
                </svg>
              )}
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-gradient-to-br from-blue-50 to-white rounded-xl border-2 border-blue-100 shadow-sm p-5 hover:shadow-lg hover:scale-105 transition-all duration-200">
            <div className="flex items-center justify-between mb-2">
              <div className="text-3xl font-bold text-[#072741]" style={{ fontFamily: 'Poppins, sans-serif' }}>
                248
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#348ADC" strokeWidth="2">
                  <path d="M20 7h-9"/><path d="M14 17H5"/><circle cx="17" cy="17" r="3"/><circle cx="7" cy="7" r="3"/>
                </svg>
              </div>
            </div>
            <div className="text-sm text-gray-600 font-medium" style={{ fontFamily: 'Inter, sans-serif' }}>
              Total Active SKUs
            </div>
          </div>

          <div className="bg-gradient-to-br from-red-50 to-white rounded-xl border-2 border-red-100 shadow-sm p-5 hover:shadow-lg hover:scale-105 transition-all duration-200">
            <div className="flex items-center justify-between mb-2">
              <div className="text-3xl font-bold text-red-600" style={{ fontFamily: 'Poppins, sans-serif' }}>
                12
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2">
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                  <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
                </svg>
              </div>
            </div>
            <div className="text-sm text-gray-600 font-medium" style={{ fontFamily: 'Inter, sans-serif' }}>
              Low Stock Items
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-white rounded-xl border-2 border-green-100 shadow-sm p-5 hover:shadow-lg hover:scale-105 transition-all duration-200">
            <div className="flex items-center justify-between mb-2">
              <div className="text-3xl font-bold text-[#072741]" style={{ fontFamily: 'Poppins, sans-serif' }}>
                {showAmounts ? '₹ 4,20,000' : '•••••'}
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2">
                  <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                </svg>
              </div>
            </div>
            <div className="text-sm text-gray-600 font-medium" style={{ fontFamily: 'Inter, sans-serif' }}>
              Total Stock Value
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-base font-semibold text-[#072741] mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Low Stock Items
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full" style={{ fontFamily: 'Inter, sans-serif' }}>
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left text-xs font-semibold text-gray-600 pb-3">Item Name</th>
                  <th className="text-left text-xs font-semibold text-gray-600 pb-3">SKU</th>
                  <th className="text-left text-xs font-semibold text-gray-600 pb-3">Quantity</th>
                  <th className="text-left text-xs font-semibold text-gray-600 pb-3">Minimum Required</th>
                  <th className="text-left text-xs font-semibold text-gray-600 pb-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {dummyLowStock.map((item, idx) => (
                  <tr key={idx} className={`border-b border-gray-100 ${
                    item.status === 'Critical' ? 'bg-red-50' : item.status === 'Low' ? 'bg-yellow-50' : ''
                  }`}>
                    <td className="py-3 text-sm text-[#072741]">{item.name}</td>
                    <td className="py-3 text-sm text-gray-600">{item.sku}</td>
                    <td className="py-3 text-sm text-[#072741] font-medium">{item.qty}</td>
                    <td className="py-3 text-sm text-gray-600">{item.min}</td>
                    <td className="py-3">
                      <span className={`text-xs font-medium ${
                        item.status === 'Critical' ? 'text-red-600' : 'text-yellow-600'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 text-right">
            <button className="text-sm text-[#348ADC] hover:text-[#2a6fb0] font-medium" style={{ fontFamily: 'Inter, sans-serif' }}>
              View All
            </button>
          </div>
        </div>
      </div>

      {/* REVENUE SECTION */}
      <div className="bg-gradient-to-br from-green-50 via-white to-green-50 rounded-2xl p-6 border border-green-200 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#348ADC" strokeWidth="2">
              <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
              <polyline points="17 6 23 6 23 12"/>
            </svg>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-[#072741]" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Revenue Overview
            </h2>
            <p className="text-sm text-gray-500" style={{ fontFamily: 'Inter, sans-serif' }}>Sales performance metrics</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 hover:shadow-md transition">
            <div className="text-2xl font-semibold text-green-600" style={{ fontFamily: 'Poppins, sans-serif' }}>
              {showAmounts ? '₹ 18,450' : '•••••'}
            </div>
            <div className="text-xs text-gray-500 mt-1" style={{ fontFamily: 'Inter, sans-serif' }}>
              Today's Sales
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 hover:shadow-md transition">
            <div className="text-2xl font-semibold text-green-600" style={{ fontFamily: 'Poppins, sans-serif' }}>
              {showAmounts ? '₹ 1,24,300' : '•••••'}
            </div>
            <div className="text-xs text-gray-500 mt-1" style={{ fontFamily: 'Inter, sans-serif' }}>
              This Week's Sales
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 hover:shadow-md transition">
            <div className="text-2xl font-semibold text-green-600" style={{ fontFamily: 'Poppins, sans-serif' }}>
              {showAmounts ? '₹ 4,85,200' : '•••••'}
            </div>
            <div className="text-xs text-gray-500 mt-1" style={{ fontFamily: 'Inter, sans-serif' }}>
              This Month's Sales
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 hover:shadow-md transition">
            <div className="text-2xl font-semibold text-green-600" style={{ fontFamily: 'Poppins, sans-serif' }}>
              {showAmounts ? '₹ 58,42,000' : '•••••'}
            </div>
            <div className="text-xs text-gray-500 mt-1" style={{ fontFamily: 'Inter, sans-serif' }}>
              All Time Sales
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="text-base font-semibold text-[#072741] mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Top Sold Items
            </h3>
            <div className="space-y-3">
              {topSoldItems.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center pb-3 border-b border-gray-100">
                  <div>
                    <div className="text-sm font-medium text-[#072741]" style={{ fontFamily: 'Inter, sans-serif' }}>
                      {item.name}
                    </div>
                    <div className="text-xs text-gray-500">{item.sku}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-green-600" style={{ fontFamily: 'Inter, sans-serif' }}>
                      {item.revenue}
                    </div>
                    <div className="text-xs text-gray-500">{item.sold} sold</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="text-base font-semibold text-[#072741] mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Least Sold Items
            </h3>
            <div className="space-y-3">
              {leastSoldItems.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center pb-3 border-b border-gray-100">
                  <div>
                    <div className="text-sm font-medium text-[#072741]" style={{ fontFamily: 'Inter, sans-serif' }}>
                      {item.name}
                    </div>
                    <div className="text-xs text-gray-500">{item.sku}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-orange-600" style={{ fontFamily: 'Inter, sans-serif' }}>
                      {item.revenue}
                    </div>
                    <div className="text-xs text-gray-500">{item.sold} sold</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-base font-semibold text-[#072741] mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Recent Transactions
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full" style={{ fontFamily: 'Inter, sans-serif' }}>
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left text-xs font-semibold text-gray-600 pb-3">Invoice #</th>
                  <th className="text-left text-xs font-semibold text-gray-600 pb-3">Items Count</th>
                  <th className="text-left text-xs font-semibold text-gray-600 pb-3">Total Amount</th>
                  <th className="text-left text-xs font-semibold text-gray-600 pb-3">Date</th>
                </tr>
              </thead>
              <tbody>
                {dummyTransactions.map((txn, idx) => (
                  <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50 transition">
                    <td className="py-3 text-sm text-[#348ADC] font-medium">{txn.invoice}</td>
                    <td className="py-3 text-sm text-gray-600">{txn.items}</td>
                    <td className="py-3 text-sm text-green-600 font-semibold">{txn.amount}</td>
                    <td className="py-3 text-sm text-gray-500">{txn.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 text-right">
            <button className="text-sm text-[#348ADC] hover:text-[#2a6fb0] font-medium" style={{ fontFamily: 'Inter, sans-serif' }}>
              View All Sales
            </button>
          </div>
        </div>
      </div>

      {/* COST SECTION */}
      <div className="bg-gradient-to-br from-orange-50 via-white to-orange-50 rounded-2xl p-6 border border-orange-200 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#348ADC" strokeWidth="2">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
            </svg>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-[#072741]" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Cost Overview
            </h2>
            <p className="text-sm text-gray-500" style={{ fontFamily: 'Inter, sans-serif' }}>Purchase tracking</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 hover:shadow-md transition">
            <div className="text-2xl font-semibold text-orange-600" style={{ fontFamily: 'Poppins, sans-serif' }}>
              {showAmounts ? '₹ 12,800' : '•••••'}
            </div>
            <div className="text-xs text-gray-500 mt-1" style={{ fontFamily: 'Inter, sans-serif' }}>
              Today's Purchases
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 hover:shadow-md transition">
            <div className="text-2xl font-semibold text-orange-600" style={{ fontFamily: 'Poppins, sans-serif' }}>
              {showAmounts ? '₹ 78,400' : '•••••'}
            </div>
            <div className="text-xs text-gray-500 mt-1" style={{ fontFamily: 'Inter, sans-serif' }}>
              This Week's Purchases
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 hover:shadow-md transition">
            <div className="text-2xl font-semibold text-orange-600" style={{ fontFamily: 'Poppins, sans-serif' }}>
              {showAmounts ? '₹ 3,12,500' : '•••••'}
            </div>
            <div className="text-xs text-gray-500 mt-1" style={{ fontFamily: 'Inter, sans-serif' }}>
              This Month's Purchases
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 hover:shadow-md transition">
            <div className="text-2xl font-semibold text-orange-600" style={{ fontFamily: 'Poppins, sans-serif' }}>
              {showAmounts ? '₹ 38,45,000' : '•••••'}
            </div>
            <div className="text-xs text-gray-500 mt-1" style={{ fontFamily: 'Inter, sans-serif' }}>
              All Time Purchases
            </div>
          </div>
        </div>
      </div>

      <SalePanel isOpen={isSalePanelOpen} onClose={() => setIsSalePanelOpen(false)} />
      <PurchasePanel isOpen={isPurchasePanelOpen} onClose={() => setIsPurchasePanelOpen(false)} />
      <StockAdjustmentPanel isOpen={isStockAdjustmentPanelOpen} onClose={() => setIsStockAdjustmentPanelOpen(false)} />
    </div>
  );
}
