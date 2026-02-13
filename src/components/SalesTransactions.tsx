import { useState } from 'react';

interface Transaction {
  sales_transaction_id: number;
  invoice_number: string;
  client_name: string;
  inventory_items: string;
  total_amount: number;
  notes: string;
  created_at: string;
}

export function SalesTransactions({ onClose }: { onClose: () => void }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  // Mock data - will be replaced with API call
  const mockTransactions: Transaction[] = Array.from({ length: 50 }, (_, i) => ({
    sales_transaction_id: i + 1,
    invoice_number: `INV-${String(1234 + i).padStart(6, '0')}`,
    client_name: ['Rajesh Kumar', 'Priya Sharma', 'Amit Patel', 'Sneha Reddy', 'Vikram Singh'][i % 5],
    inventory_items: ['Engine Oil 5W-30, Brake Pad Set', 'Air Filter, Spark Plug', 'Battery 12V', 'Wiper Blade, Engine Oil', 'Brake Pad Set, Air Filter, Spark Plug'][i % 5],
    total_amount: Math.floor(Math.random() * 5000) + 1000,
    notes: i % 3 === 0 ? 'Urgent delivery' : '',
    created_at: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
  }));

  const filteredTransactions = mockTransactions.filter(txn =>
    txn.invoice_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    txn.client_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    txn.inventory_items.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTransactions = filteredTransactions.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4">
      <div className="bg-white rounded-xl w-full max-w-7xl h-[90vh] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-[#072741]" style={{ fontFamily: 'Poppins, sans-serif' }}>
              All Sales Transactions
            </h2>
            <p className="text-xs text-gray-600 mt-1" style={{ fontFamily: 'Inter, sans-serif' }}>
              Complete transaction history
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-600 hover:text-[#072741] transition"
          >
            ✕
          </button>
        </div>

        {/* Search and Filters */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center gap-4">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search by invoice, client, or items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#348ADC] focus:border-transparent"
              style={{ fontFamily: 'Inter, sans-serif' }}
            />
            <svg className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
          </div>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-auto px-6 py-4">
          <table className="w-full" style={{ fontFamily: 'Inter, sans-serif' }}>
            <thead className="sticky top-0 bg-gray-50 z-10">
              <tr className="border-b border-gray-200">
                <th className="text-left text-xs font-semibold text-gray-600 py-3 px-4">Invoice #</th>
                <th className="text-left text-xs font-semibold text-gray-600 py-3 px-4">Client Name</th>
                <th className="text-left text-xs font-semibold text-gray-600 py-3 px-4">Items</th>
                <th className="text-right text-xs font-semibold text-gray-600 py-3 px-4">Amount</th>
                <th className="text-left text-xs font-semibold text-gray-600 py-3 px-4">Notes</th>
                <th className="text-center text-xs font-semibold text-gray-600 py-3 px-4">Date</th>
              </tr>
            </thead>
            <tbody>
              {paginatedTransactions.map((txn) => (
                <tr key={txn.sales_transaction_id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                  <td className="py-3 px-4 text-xs font-mono text-[#348ADC]">{txn.invoice_number}</td>
                  <td className="py-3 px-4 text-xs text-gray-700">{txn.client_name}</td>
                  <td className="py-3 px-4 text-xs text-gray-600 max-w-xs truncate">{txn.inventory_items}</td>
                  <td className="py-3 px-4 text-xs text-right font-semibold text-[#072741]">₹{txn.total_amount.toLocaleString()}</td>
                  <td className="py-3 px-4 text-xs text-gray-500">{txn.notes || '-'}</td>
                  <td className="py-3 px-4 text-xs text-center text-gray-600">
                    {new Date(txn.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <div className="text-xs text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>
            Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredTransactions.length)} of {filteredTransactions.length} transactions
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 border border-gray-300 rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              Previous
            </button>
            <span className="text-xs text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 border border-gray-300 rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
