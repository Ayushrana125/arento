import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { BillViewer } from './BillViewer';

interface Transaction {
  sales_transaction_id: number;
  invoice_number: string;
  inventory_items: string;
  itemsList: Array<{ name: string; sku: string; quantity: number; price: number; subtotal: number }>;
  total_amount: number;
  notes: string;
  created_at: string;
}

export function SalesTransactions({ onClose }: { onClose: () => void }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedInvoice, setSelectedInvoice] = useState<Transaction | null>(null);
  const itemsPerPage = 25;

  // Mock data - will be replaced with API call
  const mockTransactions: Transaction[] = Array.from({ length: 50 }, (_, i) => ({
    sales_transaction_id: i + 1,
    invoice_number: `INV-${String(1234 + i).padStart(6, '0')}`,
    inventory_items: ['Engine Oil 5W-30, Brake Pad Set', 'Air Filter, Spark Plug', 'Battery 12V', 'Wiper Blade, Engine Oil', 'Brake Pad Set, Air Filter, Spark Plug'][i % 5],
    itemsList: [
      { name: 'Engine Oil 5W-30', sku: 'EO-530', quantity: 2, price: 500, subtotal: 1000 },
      { name: 'Brake Pad Set', sku: 'BP-2024', quantity: 1, price: 600, subtotal: 600 }
    ],
    total_amount: Math.floor(Math.random() * 5000) + 1000,
    notes: i % 3 === 0 ? 'Urgent delivery' : '',
    created_at: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
  }));

  const filteredTransactions = mockTransactions.filter(txn =>
    txn.invoice_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    txn.inventory_items.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTransactions = filteredTransactions.slice(startIndex, startIndex + itemsPerPage);

  return (
    <>
      <BillViewer
        isOpen={!!selectedInvoice}
        onClose={() => setSelectedInvoice(null)}
        invoiceNumber={selectedInvoice?.invoice_number || ''}
        items={selectedInvoice?.itemsList || []}
        totalAmount={selectedInvoice?.total_amount || 0}
        date={selectedInvoice?.created_at || ''}
      />
    <div className="space-y-2">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onClose}
          className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition text-sm font-medium text-gray-700"
          style={{ fontFamily: 'Inter, sans-serif' }}
        >
          <ArrowLeft size={16} />
          Back to Sales
        </button>
      </div>

      {/* Search */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Search by invoice or items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#348ADC] focus:border-transparent"
            style={{ fontFamily: 'Inter, sans-serif' }}
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="overflow-auto rounded-xl" style={{ maxHeight: 'calc(100vh - 280px)' }}>
          <table className="w-full" style={{ fontFamily: 'Inter, sans-serif' }}>
            <thead className="bg-[#072741] border-b border-gray-200 sticky top-0 z-10">
              <tr>
                <th className="text-left text-xs font-semibold text-white px-4 py-2">Invoice #</th>
                <th className="text-left text-xs font-semibold text-white px-4 py-2">Items</th>
                <th className="text-right text-xs font-semibold text-white px-4 py-2">Amount</th>
                <th className="text-left text-xs font-semibold text-white px-4 py-2">Notes</th>
                <th className="text-center text-xs font-semibold text-white px-4 py-2">Date</th>
                <th className="text-center text-xs font-semibold text-white px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedTransactions.map((txn) => (
                <tr key={txn.sales_transaction_id} className="border-b border-gray-200 hover:bg-gray-50 transition cursor-pointer" onClick={() => setSelectedInvoice(txn)}>
                  <td className="px-4 py-2 text-xs font-mono text-[#348ADC]">{txn.invoice_number}</td>
                  <td className="px-4 py-2 text-xs text-gray-600 max-w-md truncate">{txn.inventory_items}</td>
                  <td className="px-4 py-2 text-xs text-right font-semibold text-[#072741]">₹{txn.total_amount.toLocaleString()}</td>
                  <td className="px-4 py-2 text-xs text-gray-500">{txn.notes || '-'}</td>
                  <td className="px-4 py-2 text-xs text-center text-gray-600">
                    {new Date(txn.created_at).toLocaleDateString('en-GB')} {new Date(txn.created_at).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td className="px-4 py-2 text-center">
                    <button 
                      onClick={(e) => { e.stopPropagation(); setSelectedInvoice(txn); }}
                      className="text-xs text-[#348ADC] hover:text-[#2a6fb0] font-medium"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-start gap-4 bg-white rounded-lg border border-gray-200 px-4 py-3">
          <div className="text-xs text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>
            Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredTransactions.length)} of {filteredTransactions.length} transactions
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-1.5 py-0.5 border border-gray-300 rounded text-xs font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-1.5 py-0.5 border rounded text-xs font-medium ${
                  currentPage === page
                    ? 'bg-[#348ADC] text-white border-[#348ADC]'
                    : 'border-gray-300 hover:bg-gray-50'
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-1.5 py-0.5 border border-gray-300 rounded text-xs font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
    </>
  );
}
