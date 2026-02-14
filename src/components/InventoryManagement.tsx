import { useState, useEffect, useRef } from 'react';
import { Plus, Upload, Package, Trash2, AlertTriangle, Edit } from 'lucide-react';
import { BulkUploadPanel } from './BulkUploadPanel';
import { EditItemPanel } from './EditItemPanel';
import { supabase } from '../lib/supabase';
import { useNotification } from '../contexts/NotificationContext';

type ViewMode = 'card' | 'table';

interface InventoryItem {
  inventory_item_id: string;
  sku: string;
  name: string;
  category: string;
  quantity: number;
  min_stock: number;
  normal_stock: number;
  cost_price: number;
  selling_price: number;
  vendor_name: string;
  created_at: string;
  updated_at: string;
}

export function InventoryManagement() {
  const [viewMode, setViewMode] = useState<ViewMode>('table');
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [stockFilter, setStockFilter] = useState('all');
  const [sortBy, setSortBy] = useState('recent');
  const [isBulkUploadModalOpen, setIsBulkUploadModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [inventoryData, setInventoryData] = useState<InventoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditPanelOpen, setIsEditPanelOpen] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const itemsPerPage = 25;
  const { addNotification } = useNotification();
  const searchInputRef = useRef<HTMLInputElement>(null);

  const loadInventory = async () => {
    setIsLoading(true);
    const userData = localStorage.getItem('arento_user');
    if (!userData) {
      setIsLoading(false);
      return;
    }

    const { client_id: clientId } = JSON.parse(userData);

    const { data, error } = await supabase
      .from('inventory_items')
      .select('*')
      .eq('client_id', clientId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error loading inventory:', error);
    }
    
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
    if (!isLoading && inventoryData.length > 0 && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isLoading, inventoryData.length]);

  const handleAddItemClick = () => {
    const event = new KeyboardEvent('keydown', { key: 'N' });
    window.dispatchEvent(event);
  };

  const toggleSelectItem = (id: string) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedItems(newSelected);
  };

  const toggleSelectAll = () => {
    if (selectedItems.size === filteredData.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(filteredData.map(item => item.inventory_item_id)));
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedItems.size > 10 && deleteConfirmText !== 'I am confirming the deletion of inventory data') return;
    
    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from('inventory_items')
        .delete()
        .in('inventory_item_id', Array.from(selectedItems));

      if (error) throw error;

      addNotification('Items Deleted', `${selectedItems.size} item(s) deleted successfully.`);
      setSelectedItems(new Set());
      setShowDeleteConfirm(false);
      setDeleteConfirmText('');
      loadInventory();
    } catch (error) {
      addNotification('Error', 'Failed to delete items. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredData = inventoryData.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         item.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    const matchesStock = stockFilter === 'all' || 
                        (stockFilter === 'low' && item.quantity <= item.min_stock) ||
                        (stockFilter === 'normal' && item.quantity > item.min_stock);
    return matchesSearch && matchesCategory && matchesStock;
  }).sort((a, b) => {
    if (sortBy === 'recent') return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    if (sortBy === 'oldest') return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
    if (sortBy === 'updated') return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    if (sortBy === 'quantity') return b.quantity - a.quantity;
    return 0;
  });

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  const categories = ['all', ...Array.from(new Set(inventoryData.map(item => item.category)))];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#348ADC] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-semibold">Loading inventory...</p>
        </div>
      </div>
    );
  }

  if (inventoryData.length === 0) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center max-w-md">
          <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <Package className="text-[#348ADC]" size={48} />
          </div>
          <h3 className="text-2xl font-bold text-[#072741] mb-3" style={{ fontFamily: 'Poppins, sans-serif' }}>
            No Inventory Items Yet
          </h3>
          <p className="text-gray-600 mb-6" style={{ fontFamily: 'Inter, sans-serif' }}>
            Start building your inventory by adding items individually or upload multiple items at once.
          </p>
          <div className="flex items-center justify-center gap-3">
            <button 
              onClick={handleAddItemClick}
              className="flex items-center gap-2 px-6 py-3 bg-[#348ADC] text-white rounded-lg hover:bg-[#2a6fb0] hover:shadow-lg transition-all font-semibold"
            >
              <Plus size={20} />
              Add First Item
            </button>
            <button 
              onClick={() => setIsBulkUploadModalOpen(true)}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#072741] to-[#0a3d5c] text-white rounded-lg hover:shadow-lg transition-all font-semibold"
            >
              <Upload size={20} />
              Bulk Upload
            </button>
          </div>
        </div>
        <BulkUploadPanel isOpen={isBulkUploadModalOpen} onClose={() => setIsBulkUploadModalOpen(false)} />
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setIsBulkUploadModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-[#072741] to-[#0a3d5c] text-white rounded-lg hover:shadow-lg transition-all text-sm font-semibold border border-[#348ADC]/30"
          >
            <Upload size={16} />
            Bulk Upload
          </button>
          <button 
            onClick={handleAddItemClick}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#348ADC] text-white rounded-lg hover:bg-[#2a6fb0] hover:shadow-lg transition-all text-sm font-semibold"
          >
            <Plus size={16} />
            Add Item
          </button>
        </div>
        <div className="flex items-center gap-2">
          {selectedItems.size === 1 && (
            <button
              onClick={() => setIsEditPanelOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#348ADC] text-white rounded-lg hover:bg-[#2a6fb0] transition-all text-sm font-semibold"
            >
              <Edit size={16} />
              Edit
            </button>
          )}
          {selectedItems.size > 0 && (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-all text-sm font-medium border border-gray-300"
            >
              <Trash2 size={16} />
              Delete ({selectedItems.size})
            </button>
          )}
        </div>
      </div>

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
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#348ADC] focus:border-transparent"
            style={{ fontFamily: 'Inter, sans-serif' }}
          />

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#348ADC] focus:border-transparent"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>
                {cat === 'all' ? 'All Categories' : cat}
              </option>
            ))}
          </select>

          <select
            value={stockFilter}
            onChange={(e) => setStockFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#348ADC] focus:border-transparent"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            <option value="all">All Stock</option>
            <option value="low">Low Stock</option>
            <option value="normal">Normal Stock</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#348ADC] focus:border-transparent"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            <option value="recent">Recently Added</option>
            <option value="oldest">Oldest First</option>
            <option value="updated">Recently Updated</option>
            <option value="name">Name (A-Z)</option>
            <option value="quantity">Quantity (High-Low)</option>
          </select>
        </div>
      </div>

      {viewMode === 'card' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {paginatedData.map((item) => (
            <div
              key={item.inventory_item_id}
              className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-lg hover:border-[#348ADC] transition cursor-pointer"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-base font-bold text-[#072741] mb-1" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    {item.name}
                  </h3>
                  <p className="text-xs text-gray-400 font-mono">{item.sku}</p>
                </div>
                <span className="text-xs px-2 py-1 bg-blue-50 text-[#348ADC] rounded font-medium">
                  {item.category}
                </span>
              </div>

              <div className="space-y-2 text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
                <div className="flex justify-between">
                  <span className="text-gray-500">Quantity:</span>
                  <span className="font-semibold text-[#072741]">{item.quantity}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Cost Price:</span>
                  <span className="font-semibold text-gray-700">₹{item.cost_price}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Selling Price:</span>
                  <span className="font-semibold text-green-600">₹{item.selling_price}</span>
                </div>
                <div className="pt-2 border-t border-gray-100">
                  <span className="text-xs text-gray-400">Vendor: {item.vendor_name}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {viewMode === 'table' && (
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="overflow-auto rounded-xl" style={{ maxHeight: 'calc(100vh - 280px)' }}>
            <table className="w-full" style={{ fontFamily: 'Inter, sans-serif' }}>
            <thead className="bg-[#072741] border-b border-gray-200 sticky top-0 z-10">
              <tr>
                <th className="text-center text-xs font-semibold text-white px-4 py-2">
                  <input
                    type="checkbox"
                    checked={selectedItems.size === filteredData.length && filteredData.length > 0}
                    onChange={toggleSelectAll}
                    className="w-4 h-4 rounded border-gray-300 cursor-pointer"
                  />
                </th>
                <th className="text-left text-xs font-semibold text-white px-4 py-2">SKU Code</th>
                <th className="text-left text-xs font-semibold text-white px-4 py-2">Item Name</th>
                <th className="text-left text-xs font-semibold text-white px-4 py-2">Category</th>
                <th className="text-right text-xs font-semibold text-white px-4 py-2">Quantity</th>
                <th className="text-right text-xs font-semibold text-white px-4 py-2">Min Stock</th>
                <th className="text-right text-xs font-semibold text-white px-4 py-2">Normal Stock</th>
                <th className="text-right text-xs font-semibold text-white px-4 py-2">Cost Price</th>
                <th className="text-right text-xs font-semibold text-white px-4 py-2">Selling Price</th>
                <th className="text-left text-xs font-semibold text-white px-4 py-2">Vendor</th>
                <th className="text-center text-xs font-semibold text-white px-4 py-2">Created</th>
                <th className="text-center text-xs font-semibold text-white px-4 py-2">Updated</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((item) => (
                <tr
                  key={item.inventory_item_id}
                  className="border-b border-gray-200 hover:bg-gray-50 transition"
                >
                  <td className="px-4 py-2 text-center">
                    <input
                      type="checkbox"
                      checked={selectedItems.has(item.inventory_item_id)}
                      onChange={() => toggleSelectItem(item.inventory_item_id)}
                      className="w-4 h-4 rounded border-gray-300 cursor-pointer"
                    />
                  </td>
                  <td className="px-4 py-2 text-xs font-mono text-[#348ADC]">{item.sku}</td>
                  <td className="px-4 py-2 text-xs text-[#072741] font-medium">{item.name}</td>
                  <td className="px-4 py-2">
                    <span className="text-xs px-2 py-1 bg-blue-50 text-[#348ADC] rounded font-medium">
                      {item.category}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-xs text-right font-semibold text-[#072741]">{item.quantity}</td>
                  <td className="px-4 py-2 text-xs text-right text-gray-600">{item.min_stock}</td>
                  <td className="px-4 py-2 text-xs text-right text-gray-600">{item.normal_stock}</td>
                  <td className="px-4 py-2 text-xs text-right text-gray-700">₹{item.cost_price}</td>
                  <td className="px-4 py-2 text-xs text-right font-semibold text-green-600">₹{item.selling_price}</td>
                  <td className="px-4 py-2 text-xs text-gray-600">{item.vendor_name}</td>
                  <td className="px-4 py-2 text-xs text-center text-gray-600">{new Date(item.created_at).toLocaleDateString('en-GB')}</td>
                  <td className="px-4 py-2 text-xs text-center text-gray-600">{new Date(item.updated_at).toLocaleDateString('en-GB')}</td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-start gap-4 bg-white rounded-lg border border-gray-200 px-4 py-3">
          <div className="text-xs text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>
            Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredData.length)} of {filteredData.length} items
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
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
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="px-1.5 py-0.5 border border-gray-300 rounded text-xs font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Next
            </button>
          </div>
        </div>
      )}

      <BulkUploadPanel isOpen={isBulkUploadModalOpen} onClose={() => setIsBulkUploadModalOpen(false)} />
      <EditItemPanel 
        isOpen={isEditPanelOpen} 
        onClose={() => {
          setIsEditPanelOpen(false);
          setSelectedItems(new Set());
        }} 
        itemId={Array.from(selectedItems)[0] || ''} 
      />

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="text-red-600" size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#072741]" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  Delete Items?
                </h3>
                <p className="text-sm text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>
                  {selectedItems.size} item(s) selected
                </p>
              </div>
            </div>
            <p className="text-sm text-gray-700 mb-4" style={{ fontFamily: 'Inter, sans-serif' }}>
              This action cannot be undone. The selected inventory items will be permanently deleted from your database.
            </p>
            {selectedItems.size > 10 && (
              <div className="mb-4">
                <label className="block text-xs font-semibold text-gray-700 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Type the following to confirm:
                </label>
                <p className="text-xs text-gray-500 mb-2 font-mono bg-gray-50 p-2 rounded border border-gray-200" style={{ fontFamily: 'Inter, sans-serif' }}>
                  I am confirming the deletion of inventory data
                </p>
                <input
                  type="text"
                  value={deleteConfirmText}
                  onChange={(e) => setDeleteConfirmText(e.target.value)}
                  onCopy={(e) => e.preventDefault()}
                  onPaste={(e) => e.preventDefault()}
                  onCut={(e) => e.preventDefault()}
                  className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="Type here..."
                  style={{ fontFamily: 'Inter, sans-serif' }}
                />
              </div>
            )}
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setDeleteConfirmText('');
                }}
                className="flex-1 px-4 py-2 border-2 border-gray-300 text-[#072741] rounded-lg hover:bg-gray-50 transition font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteSelected}
                disabled={isDeleting || (selectedItems.size > 10 && deleteConfirmText !== 'I am confirming the deletion of inventory data')}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
