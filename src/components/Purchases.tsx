import { useState } from 'react';

export function Purchases() {
  const [showAllPurchases, setShowAllPurchases] = useState(false);
  const [timeFilter, setTimeFilter] = useState('month');
  const [performanceFilter, setPerformanceFilter] = useState('30');

  const monthPurchases = 142;
  const monthSpend = 685420;
  const avgPurchaseValue = 4827;
  const topCategory = 'Engine Parts';

  const recentPurchases = [
    { invoice: 'PO-001234', vendor: 'Auto Parts Co.', items: 8, quantity: 45, amount: 28500, date: '2024-01-20 14:30', status: 'Paid' },
    { invoice: 'PO-001233', vendor: 'Oil Suppliers Ltd.', items: 5, quantity: 120, amount: 42000, date: '2024-01-20 11:15', status: 'Paid' },
    { invoice: 'PO-001232', vendor: 'Filter World', items: 6, quantity: 85, amount: 23800, date: '2024-01-19 16:45', status: 'Pending' },
    { invoice: 'PO-001231', vendor: 'Battery Plus', items: 3, quantity: 15, amount: 67500, date: '2024-01-19 10:20', status: 'Paid' },
    { invoice: 'PO-001230', vendor: 'Engine Parts Ltd.', items: 12, quantity: 95, amount: 54200, date: '2024-01-18 14:30', status: 'Paid' },
  ];

  const purchaseData = {
    month: {
      quantity: [
        { name: 'Engine Oil 5W-30', qty: 450, spend: 157500, percentage: 100 },
        { name: 'Brake Pad Set', qty: 380, spend: 171000, percentage: 84 },
        { name: 'Air Filter', qty: 320, spend: 89600, percentage: 71 },
        { name: 'Battery 12V', qty: 180, spend: 630000, percentage: 40 },
        { name: 'Spark Plug', qty: 280, spend: 33600, percentage: 62 },
      ],
      spend: [
        { name: 'Battery 12V', qty: 180, spend: 630000, percentage: 100 },
        { name: 'Brake Pad Set', qty: 380, spend: 171000, percentage: 27 },
        { name: 'Engine Oil 5W-30', qty: 450, spend: 157500, percentage: 25 },
        { name: 'Air Filter', qty: 320, spend: 89600, percentage: 14 },
        { name: 'Spark Plug', qty: 280, spend: 33600, percentage: 5 },
      ],
    },
  };

  const vendorData = {
    '30': [
      { name: 'Auto Parts Co.', purchases: 28, spend: 156800, lastPurchase: '2024-01-20' },
      { name: 'Oil Suppliers Ltd.', purchases: 24, spend: 142000, lastPurchase: '2024-01-20' },
      { name: 'Battery Plus', purchases: 18, spend: 189000, lastPurchase: '2024-01-19' },
      { name: 'Filter World', purchases: 22, spend: 98400, lastPurchase: '2024-01-19' },
      { name: 'Engine Parts Ltd.', purchases: 20, spend: 124500, lastPurchase: '2024-01-18' },
    ],
    '60': [
      { name: 'Battery Plus', purchases: 42, spend: 398000, lastPurchase: '2024-01-19' },
      { name: 'Auto Parts Co.', purchases: 58, spend: 312000, lastPurchase: '2024-01-20' },
      { name: 'Oil Suppliers Ltd.', purchases: 48, spend: 284000, lastPurchase: '2024-01-20' },
      { name: 'Filter World', purchases: 44, spend: 196800, lastPurchase: '2024-01-19' },
      { name: 'Engine Parts Ltd.', purchases: 40, spend: 249000, lastPurchase: '2024-01-18' },
    ],
    '90': [
      { name: 'Battery Plus', purchases: 68, spend: 612000, lastPurchase: '2024-01-19' },
      { name: 'Auto Parts Co.', purchases: 92, spend: 498000, lastPurchase: '2024-01-20' },
      { name: 'Oil Suppliers Ltd.', purchases: 78, spend: 456000, lastPurchase: '2024-01-20' },
      { name: 'Engine Parts Ltd.', purchases: 65, spend: 398000, lastPurchase: '2024-01-18' },
      { name: 'Filter World', purchases: 72, spend: 312000, lastPurchase: '2024-01-19' },
    ],
  };

  const costAlerts = [
    { name: 'Battery 12V', prevCost: 3200, currentCost: 3500, increase: 9.4 },
    { name: 'Brake Pad Set', prevCost: 420, currentCost: 450, increase: 7.1 },
    { name: 'Engine Oil 5W-30', prevCost: 320, currentCost: 350, increase: 9.4 },
  ];

  const currentPurchaseData = purchaseData[timeFilter as keyof typeof purchaseData] || purchaseData.month;
  const topPurchasedByQty = currentPurchaseData.quantity;
  const topPurchasedBySpend = currentPurchaseData.spend;
  const vendors = vendorData[performanceFilter as keyof typeof vendorData];
  const topVendor = vendors[0];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-purple-100 to-purple-50 rounded-xl border border-purple-200 p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="text-sm text-gray-700 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>Total Purchases</div>
          <div className="text-3xl font-bold text-[#072741]" style={{ fontFamily: 'Poppins, sans-serif' }}>{monthPurchases}</div>
          <div className="mt-3 pt-3 border-t border-purple-200"><span className="text-xs text-gray-600">This Month</span></div>
        </div>
        <div className="bg-gradient-to-br from-red-100 to-red-50 rounded-xl border border-red-200 p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="text-sm text-gray-700 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>Total Spend</div>
          <div className="text-3xl font-bold text-[#072741]" style={{ fontFamily: 'Poppins, sans-serif' }}>₹{monthSpend.toLocaleString()}</div>
          <div className="mt-3 pt-3 border-t border-red-200"><span className="text-xs text-red-600 font-medium">↑ 15% from last month</span></div>
        </div>
        <div className="bg-gradient-to-br from-cyan-100 to-cyan-50 rounded-xl border border-cyan-200 p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="text-sm text-gray-700 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>Avg Purchase Value</div>
          <div className="text-3xl font-bold text-[#072741]" style={{ fontFamily: 'Poppins, sans-serif' }}>₹{avgPurchaseValue.toLocaleString()}</div>
          <div className="mt-3 pt-3 border-t border-cyan-200"><span className="text-xs text-gray-600">Per order</span></div>
        </div>
        <div className="bg-gradient-to-br from-pink-100 to-pink-50 rounded-xl border border-pink-200 p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="text-sm text-gray-700 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>Top Category</div>
          <div className="text-3xl font-bold text-[#072741]" style={{ fontFamily: 'Poppins, sans-serif' }}>{topCategory}</div>
          <div className="mt-3 pt-3 border-t border-pink-200"><span className="text-xs text-gray-600">Most purchased</span></div>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-[#072741] mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>Recent Purchases</h2>
        <div className="bg-gradient-to-br from-purple-50 to-white rounded-xl border-2 border-purple-200 p-6 shadow-md">
          <div className="overflow-x-auto">
            <table className="w-full" style={{ fontFamily: 'Inter, sans-serif' }}>
              <thead className="border-b border-gray-200">
                <tr>
                  <th className="text-left text-xs font-semibold text-gray-600 pb-3">Invoice #</th>
                  <th className="text-left text-xs font-semibold text-gray-600 pb-3">Vendor</th>
                  <th className="text-center text-xs font-semibold text-gray-600 pb-3">Items</th>
                  <th className="text-center text-xs font-semibold text-gray-600 pb-3">Quantity</th>
                  <th className="text-right text-xs font-semibold text-gray-600 pb-3">Amount</th>
                  <th className="text-center text-xs font-semibold text-gray-600 pb-3">Date</th>
                  <th className="text-center text-xs font-semibold text-gray-600 pb-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentPurchases.map((purchase, idx) => (
                  <tr key={idx} className="border-b border-gray-100 last:border-0 hover:bg-purple-50/50 cursor-pointer transition">
                    <td className="py-3 text-xs font-mono text-[#348ADC]">{purchase.invoice}</td>
                    <td className="py-3 text-xs text-gray-700">{purchase.vendor}</td>
                    <td className="py-3 text-xs text-center text-gray-700">{purchase.items}</td>
                    <td className="py-3 text-xs text-center text-gray-700">{purchase.quantity}</td>
                    <td className="py-3 text-xs text-right font-semibold text-[#072741]">₹{purchase.amount.toLocaleString()}</td>
                    <td className="py-3 text-xs text-center text-gray-600">
                      {new Date(purchase.date).toLocaleDateString('en-GB')} {new Date(purchase.date).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="py-3 text-xs text-center">
                      <span className={`font-medium ${purchase.status === 'Paid' ? 'text-green-600' : 'text-yellow-600'}`}>{purchase.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 text-right">
            <button onClick={() => setShowAllPurchases(true)} className="px-4 py-2 bg-[#348ADC] hover:bg-[#2a6fb0] text-white rounded-lg text-xs font-medium transition shadow-sm hover:shadow-md" style={{ fontFamily: 'Inter, sans-serif' }}>
              View All Purchases →
            </button>
          </div>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-[#072741]" style={{ fontFamily: 'Poppins, sans-serif' }}>Purchase Insights</h2>
          <select value={timeFilter} onChange={(e) => setTimeFilter(e.target.value)} className="px-3 py-1.5 border border-gray-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#348ADC] focus:border-transparent" style={{ fontFamily: 'Inter, sans-serif' }}>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
          </select>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h3 className="text-sm font-semibold text-[#072741] mb-5" style={{ fontFamily: 'Poppins, sans-serif' }}>Top Purchased Items (Quantity)</h3>
            <div className="space-y-5">
              {topPurchasedByQty.map((item, idx) => (
                <div key={idx}>
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#348ADC]/10 flex items-center justify-center">
                        <span className="text-sm font-bold text-[#348ADC]" style={{ fontFamily: 'Poppins, sans-serif' }}>{idx + 1}</span>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-[#072741]" style={{ fontFamily: 'Inter, sans-serif' }}>{item.name}</div>
                        <div className="text-xs text-gray-500 mt-0.5" style={{ fontFamily: 'Inter, sans-serif' }}>{item.qty} units • ₹{item.spend.toLocaleString()}</div>
                      </div>
                    </div>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div className="bg-[#348ADC] h-2 rounded-full transition-all" style={{ width: `${item.percentage}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h3 className="text-sm font-semibold text-[#072741] mb-5" style={{ fontFamily: 'Poppins, sans-serif' }}>Highest Spend Items</h3>
            <div className="space-y-5">
              {topPurchasedBySpend.map((item, idx) => (
                <div key={idx}>
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center">
                        <span className="text-sm font-bold text-red-600" style={{ fontFamily: 'Poppins, sans-serif' }}>{idx + 1}</span>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-[#072741]" style={{ fontFamily: 'Inter, sans-serif' }}>{item.name}</div>
                        <div className="text-xs text-gray-500 mt-0.5" style={{ fontFamily: 'Inter, sans-serif' }}>₹{item.spend.toLocaleString()} • {item.qty} units</div>
                      </div>
                    </div>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div className="bg-red-400 h-2 rounded-full transition-all" style={{ width: `${item.percentage}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-[#072741]" style={{ fontFamily: 'Poppins, sans-serif' }}>Vendor Overview</h2>
            <select value={performanceFilter} onChange={(e) => setPerformanceFilter(e.target.value)} className="px-3 py-1.5 border border-gray-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#348ADC] focus:border-transparent" style={{ fontFamily: 'Inter, sans-serif' }}>
              <option value="30">Last 30 Days</option>
              <option value="60">Last 60 Days</option>
              <option value="90">Last 90 Days</option>
            </select>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <table className="w-full" style={{ fontFamily: 'Inter, sans-serif' }}>
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left text-xs font-semibold text-gray-600 px-4 py-3">Vendor</th>
                  <th className="text-center text-xs font-semibold text-gray-600 px-4 py-3">Orders</th>
                  <th className="text-right text-xs font-semibold text-gray-600 px-4 py-3">Spend</th>
                  <th className="text-center text-xs font-semibold text-gray-600 px-4 py-3">Last Order</th>
                </tr>
              </thead>
              <tbody>
                {vendors.map((vendor, idx) => (
                  <tr key={idx} className={`border-b border-gray-100 last:border-0 ${vendor.name === topVendor.name ? 'bg-[#348ADC]/5' : ''}`}>
                    <td className="px-4 py-3 text-xs font-medium text-[#072741]">{vendor.name}</td>
                    <td className="px-4 py-3 text-xs text-center text-gray-700">{vendor.purchases}</td>
                    <td className="px-4 py-3 text-xs text-right font-semibold text-[#072741]">₹{vendor.spend.toLocaleString()}</td>
                    <td className="px-4 py-3 text-xs text-center text-gray-600">{new Date(vendor.lastPurchase).toLocaleDateString('en-GB')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div>
          <h2 className="text-lg font-semibold text-[#072741] mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>Cost Alerts</h2>
          <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-xl border border-red-200 p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-red-500"></div>
              <span className="text-xs font-medium text-red-700" style={{ fontFamily: 'Inter, sans-serif' }}>Price increases detected</span>
            </div>
            <div className="space-y-4">
              {costAlerts.map((alert, idx) => (
                <div key={idx} className="pb-4 border-b border-red-200 last:border-0 last:pb-0">
                  <div className="text-sm font-medium text-[#072741] mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>{alert.name}</div>
                  <div className="flex items-center justify-between text-xs" style={{ fontFamily: 'Inter, sans-serif' }}>
                    <div className="text-gray-600">
                      <span className="line-through">₹{alert.prevCost}</span>
                      <span className="mx-2">→</span>
                      <span className="font-semibold text-[#072741]">₹{alert.currentCost}</span>
                    </div>
                    <span className="font-bold text-red-600">+{alert.increase}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
