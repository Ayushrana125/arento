import { useState } from 'react';
import { SalesTransactions } from './SalesTransactions';

export function Sales() {
  const [showAllTransactions, setShowAllTransactions] = useState(false);
  const [timeFilter, setTimeFilter] = useState('today');
  const [modeToggle, setModeToggle] = useState('quantity');
  const [performanceFilter, setPerformanceFilter] = useState('15');

  // Mock data
  const todayRevenue = 45280;
  const monthRevenue = 892450;
  const todayTransactions = 23;
  const avgBillValue = 1969;

  const recentTransactions = [
    { invoice: 'INV-001234', items: 5, amount: 2450, date: '2024-01-20 14:30', payment: 'Cash' },
    { invoice: 'INV-001233', items: 3, amount: 1890, date: '2024-01-20 13:15', payment: 'UPI' },
    { invoice: 'INV-001232', items: 7, amount: 3200, date: '2024-01-20 12:45', payment: 'Card' },
    { invoice: 'INV-001231', items: 2, amount: 980, date: '2024-01-20 11:20', payment: 'Cash' },
    { invoice: 'INV-001230', items: 4, amount: 2150, date: '2024-01-20 10:30', payment: 'UPI' },
  ];

  // Data for different time periods
  const salesData = {
    today: {
      quantity: [
        { name: 'Engine Oil 5W-30', qty: 45, revenue: 22500, percentage: 100 },
        { name: 'Brake Pad Set', qty: 38, revenue: 22800, percentage: 84 },
        { name: 'Air Filter', qty: 32, revenue: 12800, percentage: 71 },
        { name: 'Spark Plug', qty: 28, revenue: 4200, percentage: 62 },
        { name: 'Wiper Blade', qty: 24, revenue: 4800, percentage: 53 },
      ],
      revenue: [
        { name: 'Brake Pad Set', qty: 38, revenue: 22800, percentage: 100 },
        { name: 'Engine Oil 5W-30', qty: 45, revenue: 22500, percentage: 99 },
        { name: 'Air Filter', qty: 32, revenue: 12800, percentage: 56 },
        { name: 'Wiper Blade', qty: 24, revenue: 4800, percentage: 21 },
        { name: 'Spark Plug', qty: 28, revenue: 4200, percentage: 18 },
      ],
    },
    '7days': {
      quantity: [
        { name: 'Engine Oil 5W-30', qty: 285, revenue: 142500, percentage: 100 },
        { name: 'Brake Pad Set', qty: 245, revenue: 147000, percentage: 86 },
        { name: 'Air Filter', qty: 198, revenue: 79200, percentage: 69 },
        { name: 'Spark Plug', qty: 165, revenue: 24750, percentage: 58 },
        { name: 'Battery 12V', qty: 142, revenue: 639000, percentage: 50 },
      ],
      revenue: [
        { name: 'Battery 12V', qty: 142, revenue: 639000, percentage: 100 },
        { name: 'Brake Pad Set', qty: 245, revenue: 147000, percentage: 23 },
        { name: 'Engine Oil 5W-30', qty: 285, revenue: 142500, percentage: 22 },
        { name: 'Air Filter', qty: 198, revenue: 79200, percentage: 12 },
        { name: 'Spark Plug', qty: 165, revenue: 24750, percentage: 4 },
      ],
    },
    month: {
      quantity: [
        { name: 'Engine Oil 5W-30', qty: 1250, revenue: 625000, percentage: 100 },
        { name: 'Brake Pad Set', qty: 980, revenue: 588000, percentage: 78 },
        { name: 'Air Filter', qty: 845, revenue: 338000, percentage: 68 },
        { name: 'Spark Plug', qty: 720, revenue: 108000, percentage: 58 },
        { name: 'Battery 12V', qty: 580, revenue: 2610000, percentage: 46 },
      ],
      revenue: [
        { name: 'Battery 12V', qty: 580, revenue: 2610000, percentage: 100 },
        { name: 'Engine Oil 5W-30', qty: 1250, revenue: 625000, percentage: 24 },
        { name: 'Brake Pad Set', qty: 980, revenue: 588000, percentage: 23 },
        { name: 'Air Filter', qty: 845, revenue: 338000, percentage: 13 },
        { name: 'Spark Plug', qty: 720, revenue: 108000, percentage: 4 },
      ],
    },
  };

  // Performance data for different periods
  const performanceData = {
    '15': {
      fastMoving: [
        { name: 'Engine Oil 5W-30', qty: 145, stock: 120 },
        { name: 'Brake Pad Set', qty: 118, stock: 45 },
        { name: 'Air Filter', qty: 98, stock: 32 },
      ],
      slowMoving: [
        { name: 'Catalytic Converter', qty: 1, lastSold: '12 days ago' },
        { name: 'Alternator', qty: 2, lastSold: '10 days ago' },
        { name: 'Starter Motor', qty: 2, lastSold: '8 days ago' },
      ],
      highMargin: [
        { name: 'Brake Pad Set', margin: 150, marginPercent: 25 },
        { name: 'Air Filter', margin: 120, marginPercent: 30 },
        { name: 'Battery 12V', margin: 1000, marginPercent: 22 },
      ],
    },
    '30': {
      fastMoving: [
        { name: 'Engine Oil 5W-30', qty: 320, stock: 120 },
        { name: 'Brake Pad Set', qty: 265, stock: 45 },
        { name: 'Air Filter', qty: 225, stock: 32 },
      ],
      slowMoving: [
        { name: 'Catalytic Converter', qty: 2, lastSold: '28 days ago' },
        { name: 'Flywheel', qty: 3, lastSold: '25 days ago' },
        { name: 'Alternator', qty: 4, lastSold: '22 days ago' },
      ],
      highMargin: [
        { name: 'Battery 12V', margin: 1000, marginPercent: 22 },
        { name: 'Brake Pad Set', margin: 150, marginPercent: 25 },
        { name: 'Air Filter', margin: 120, marginPercent: 30 },
      ],
    },
    '45': {
      fastMoving: [
        { name: 'Engine Oil 5W-30', qty: 485, stock: 120 },
        { name: 'Brake Pad Set', qty: 398, stock: 45 },
        { name: 'Air Filter', qty: 342, stock: 32 },
      ],
      slowMoving: [
        { name: 'Catalytic Converter', qty: 3, lastSold: '42 days ago' },
        { name: 'Flywheel', qty: 4, lastSold: '38 days ago' },
        { name: 'Muffler', qty: 5, lastSold: '35 days ago' },
      ],
      highMargin: [
        { name: 'Battery 12V', margin: 1000, marginPercent: 22 },
        { name: 'Clutch Assembly', margin: 1300, marginPercent: 29 },
        { name: 'Brake Pad Set', margin: 150, marginPercent: 25 },
      ],
    },
  };

  const currentSalesData = salesData[timeFilter as keyof typeof salesData] || salesData.today;
  const topSellingByQty = currentSalesData.quantity;
  const topSellingByRevenue = currentSalesData.revenue;

  const currentPerformanceData = performanceData[performanceFilter as keyof typeof performanceData];
  const fastMoving = currentPerformanceData.fastMoving;
  const slowMoving = currentPerformanceData.slowMoving;
  const highMargin = currentPerformanceData.highMargin;

  return (
    <>
      {showAllTransactions && <SalesTransactions onClose={() => setShowAllTransactions(false)} />}
      <div className="space-y-6">
      {/* Sales Summary Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-100 to-blue-50 rounded-xl border border-blue-200 p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="text-sm text-gray-700 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
            Today's Revenue
          </div>
          <div className="text-3xl font-bold text-[#072741]" style={{ fontFamily: 'Poppins, sans-serif' }}>
            ₹{todayRevenue.toLocaleString()}
          </div>
          <div className="mt-3 pt-3 border-t border-blue-200">
            <span className="text-xs text-blue-600 font-medium">↑ 12% from yesterday</span>
          </div>
        </div>
        <div className="bg-gradient-to-br from-emerald-100 to-emerald-50 rounded-xl border border-emerald-200 p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="text-sm text-gray-700 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
            This Month Revenue
          </div>
          <div className="text-3xl font-bold text-[#072741]" style={{ fontFamily: 'Poppins, sans-serif' }}>
            ₹{monthRevenue.toLocaleString()}
          </div>
          <div className="mt-3 pt-3 border-t border-emerald-200">
            <span className="text-xs text-emerald-600 font-medium">↑ 8% from last month</span>
          </div>
        </div>
        <div className="bg-gradient-to-br from-violet-100 to-violet-50 rounded-xl border border-violet-200 p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="text-sm text-gray-700 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
            Total Transactions
          </div>
          <div className="text-3xl font-bold text-[#072741]" style={{ fontFamily: 'Poppins, sans-serif' }}>
            {todayTransactions}
          </div>
          <div className="mt-3 pt-3 border-t border-violet-200">
            <span className="text-xs text-gray-600">Today</span>
          </div>
        </div>
        <div className="bg-gradient-to-br from-amber-100 to-amber-50 rounded-xl border border-amber-200 p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="text-sm text-gray-700 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
            Average Bill Value
          </div>
          <div className="text-3xl font-bold text-[#072741]" style={{ fontFamily: 'Poppins, sans-serif' }}>
            ₹{avgBillValue.toLocaleString()}
          </div>
          <div className="mt-3 pt-3 border-t border-amber-200">
            <span className="text-xs text-gray-600">Per transaction</span>
          </div>
        </div>
      </div>

      {/* Recent Transactions - Prominent */}
      <div>
        <h2 className="text-lg font-semibold text-[#072741] mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
          Recent Transactions
        </h2>
        <div className="bg-gradient-to-br from-blue-50 to-white rounded-xl border-2 border-blue-200 p-6 shadow-md">
          <div className="overflow-x-auto">
            <table className="w-full" style={{ fontFamily: 'Inter, sans-serif' }}>
              <thead className="border-b border-gray-200">
                <tr>
                  <th className="text-left text-xs font-semibold text-gray-600 pb-3">Invoice #</th>
                  <th className="text-center text-xs font-semibold text-gray-600 pb-3">Items Count</th>
                  <th className="text-right text-xs font-semibold text-gray-600 pb-3">Total Amount</th>
                  <th className="text-center text-xs font-semibold text-gray-600 pb-3">Date</th>
                  <th className="text-center text-xs font-semibold text-gray-600 pb-3">Payment Mode</th>
                </tr>
              </thead>
              <tbody>
                {recentTransactions.map((txn, idx) => (
                  <tr key={idx} className="border-b border-gray-100 last:border-0">
                    <td className="py-3 text-xs font-mono text-[#348ADC]">{txn.invoice}</td>
                    <td className="py-3 text-xs text-center text-gray-700">{txn.items}</td>
                    <td className="py-3 text-xs text-right font-semibold text-[#072741]">₹{txn.amount.toLocaleString()}</td>
                    <td className="py-3 text-xs text-center text-gray-600">{txn.date}</td>
                    <td className="py-3 text-xs text-center text-gray-600">{txn.payment}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 text-right">
            <button
              onClick={() => setShowAllTransactions(true)}
              className="px-4 py-2 bg-[#348ADC] hover:bg-[#2a6fb0] text-white rounded-lg text-xs font-medium transition shadow-sm hover:shadow-md"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              View All Transactions →
            </button>
          </div>
        </div>
      </div>

      {/* Sales Intelligence */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-[#072741]" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Top Selling Items
          </h2>
          <div className="flex items-center gap-3">
            <select
              value={timeFilter}
              onChange={(e) => setTimeFilter(e.target.value)}
              className="px-3 py-1.5 border border-gray-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#348ADC] focus:border-transparent"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              <option value="today">Today</option>
              <option value="7days">Last 7 Days</option>
              <option value="month">This Month</option>
              <option value="custom">Custom</option>
            </select>
            <div className="bg-white border border-gray-200 rounded-full p-0.5 flex gap-0.5">
              <button
                onClick={() => setModeToggle('quantity')}
                className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                  modeToggle === 'quantity'
                    ? 'bg-[#348ADC] text-white'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                Quantity Wise
              </button>
              <button
                onClick={() => setModeToggle('revenue')}
                className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                  modeToggle === 'revenue'
                    ? 'bg-[#348ADC] text-white'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                Revenue Wise
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top 5 Products by Quantity */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h3 className="text-sm font-semibold text-[#072741] mb-5" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Top 5 Products (Quantity)
            </h3>
            <div className="space-y-5">
              {topSellingByQty.map((item, idx) => (
                <div key={idx}>
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#348ADC]/10 flex items-center justify-center">
                        <span className="text-sm font-bold text-[#348ADC]" style={{ fontFamily: 'Poppins, sans-serif' }}>
                          {idx + 1}
                        </span>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-[#072741]" style={{ fontFamily: 'Inter, sans-serif' }}>
                          {item.name}
                        </div>
                        <div className="text-xs text-gray-500 mt-0.5" style={{ fontFamily: 'Inter, sans-serif' }}>
                          {item.qty} units • ₹{item.revenue.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div
                      className="bg-[#348ADC] h-2 rounded-full transition-all"
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top 5 Products by Revenue */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h3 className="text-sm font-semibold text-[#072741] mb-5" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Most Revenue Generating
            </h3>
            <div className="space-y-5">
              {topSellingByRevenue.map((item, idx) => (
                <div key={idx}>
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#072741]/10 flex items-center justify-center">
                        <span className="text-sm font-bold text-[#072741]" style={{ fontFamily: 'Poppins, sans-serif' }}>
                          {idx + 1}
                        </span>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-[#072741]" style={{ fontFamily: 'Inter, sans-serif' }}>
                          {item.name}
                        </div>
                        <div className="text-xs text-gray-500 mt-0.5" style={{ fontFamily: 'Inter, sans-serif' }}>
                          ₹{item.revenue.toLocaleString()} • {item.qty} units
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div
                      className="bg-[#072741] h-2 rounded-full transition-all"
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Performance Insights */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-[#072741]" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Performance Insights
          </h2>
          <select
            value={performanceFilter}
            onChange={(e) => setPerformanceFilter(e.target.value)}
            className="px-3 py-1.5 border border-gray-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#348ADC] focus:border-transparent"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            <option value="15">Last 15 Days</option>
            <option value="30">Last 30 Days</option>
            <option value="45">Last 45 Days</option>
          </select>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Fast Moving */}
          <div className="bg-gradient-to-br from-teal-100 to-teal-50 rounded-xl border border-teal-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-[#072741]" style={{ fontFamily: 'Poppins, sans-serif' }}>
                Fast Moving
              </h3>
              <div className="w-2 h-2 rounded-full bg-teal-600"></div>
            </div>
            <div className="space-y-4">
              {fastMoving.map((item, idx) => (
                <div key={idx} className="pb-4 border-b border-teal-200 last:border-0 last:pb-0">
                  <div className="text-sm font-medium text-[#072741] mb-1" style={{ fontFamily: 'Inter, sans-serif' }}>
                    {item.name}
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-700" style={{ fontFamily: 'Inter, sans-serif' }}>
                    <span>{item.qty} sold</span>
                    <span className="text-teal-700 font-medium">{item.stock} in stock</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Slow Moving */}
          <div className="bg-gradient-to-br from-orange-100 to-orange-50 rounded-xl border border-orange-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-[#072741]" style={{ fontFamily: 'Poppins, sans-serif' }}>
                Slow Moving
              </h3>
              <div className="w-2 h-2 rounded-full bg-orange-500"></div>
            </div>
            <div className="space-y-4">
              {slowMoving.map((item, idx) => (
                <div key={idx} className="pb-4 border-b border-orange-200 last:border-0 last:pb-0">
                  <div className="text-sm font-medium text-[#072741] mb-1" style={{ fontFamily: 'Inter, sans-serif' }}>
                    {item.name}
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-700" style={{ fontFamily: 'Inter, sans-serif' }}>
                    <span>{item.qty} sold</span>
                    <span className="text-orange-700">Last: {item.lastSold}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* High Margin */}
          <div className="bg-gradient-to-br from-indigo-100 to-indigo-50 rounded-xl border border-indigo-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-[#072741]" style={{ fontFamily: 'Poppins, sans-serif' }}>
                Highest Margin
              </h3>
              <div className="w-2 h-2 rounded-full bg-indigo-600"></div>
            </div>
            <div className="space-y-4">
              {highMargin.map((item, idx) => (
                <div key={idx} className="pb-4 border-b border-indigo-200 last:border-0 last:pb-0">
                  <div className="text-sm font-medium text-[#072741] mb-1" style={{ fontFamily: 'Inter, sans-serif' }}>
                    {item.name}
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-700" style={{ fontFamily: 'Inter, sans-serif' }}>
                    <span>₹{item.margin} margin</span>
                    <span className="text-indigo-700 font-medium">{item.marginPercent}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
