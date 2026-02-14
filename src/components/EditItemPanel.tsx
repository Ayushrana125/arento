import { X } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useNotification } from '../contexts/NotificationContext';
import { supabase } from '../lib/supabase';

interface EditItemPanelProps {
  isOpen: boolean;
  onClose: () => void;
  itemId: string;
}

export function EditItemPanel({ isOpen, onClose, itemId }: EditItemPanelProps) {
  const [skuCode, setSkuCode] = useState('');
  const [itemName, setItemName] = useState('');
  const [category, setCategory] = useState('');
  const [currentQuantity, setCurrentQuantity] = useState('');
  const [minStock, setMinStock] = useState('');
  const [normalStock, setNormalStock] = useState('');
  const [costPrice, setCostPrice] = useState('');
  const [sellingPrice, setSellingPrice] = useState('');
  const [vendorName, setVendorName] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const firstInputRef = useRef<HTMLInputElement>(null);
  const { addNotification } = useNotification();

  const categories = ['Brakes', 'Filters', 'Fluids', 'Engine', 'Electrical', 'Lighting', 'Cooling', 'Tools', 'Accessories', 'Ignition'];

  useEffect(() => {
    if (isOpen && itemId) {
      loadItemData();
      setTimeout(() => {
        setIsVisible(true);
        setTimeout(() => {
          if (firstInputRef.current) {
            firstInputRef.current.focus();
          }
        }, 100);
      }, 10);
    } else {
      setIsVisible(false);
    }
  }, [isOpen, itemId]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsVisible(false);
        setTimeout(() => {
          if (onClose) onClose();
        }, 300);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const loadItemData = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('inventory_items')
      .select('*')
      .eq('inventory_item_id', itemId)
      .single();

    if (error) {
      addNotification('Error', 'Failed to load item data.');
      onClose();
      return;
    }

    if (data) {
      setSkuCode(data.sku);
      setItemName(data.name);
      setCategory(data.category);
      setVendorName(data.vendor_name);
      setCurrentQuantity(data.quantity.toString());
      setMinStock(data.min_stock.toString());
      setNormalStock(data.normal_stock.toString());
      setCostPrice(data.cost_price.toString());
      setSellingPrice(data.selling_price.toString());
    }
    setIsLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('inventory_items')
        .update({
          sku: skuCode,
          name: itemName,
          category,
          vendor_name: vendorName,
          quantity: parseFloat(currentQuantity),
          min_stock: parseFloat(minStock),
          normal_stock: parseFloat(normalStock),
          cost_price: parseFloat(costPrice),
          selling_price: parseFloat(sellingPrice),
        })
        .eq('inventory_item_id', itemId);

      if (error) throw error;

      addNotification('Item Updated Successfully!', `${itemName} (${skuCode}) has been updated.`);
      onClose();
      window.dispatchEvent(new Event('inventoryUpdated'));
    } catch (error: any) {
      addNotification('Error Updating Item', 'Unable to update item. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-50" onClick={onClose}></div>
      <div className={`fixed top-0 right-0 h-full w-full bg-white shadow-2xl z-[60] transform transition-transform duration-300 ease-out overflow-y-auto ${
        isVisible ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
          <div>
            <h2 className="text-2xl font-semibold text-[#072741]" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Edit Item
            </h2>
            <p className="text-sm text-gray-500 mt-1" style={{ fontFamily: 'Inter, sans-serif' }}>
              Update inventory item details
            </p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-[#072741] transition-colors">
            <X size={24} />
          </button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-96">
            <div className="w-12 h-12 border-4 border-[#348ADC] border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6">
            <div className="p-6 max-w-7xl mx-auto">
              <div className="grid grid-cols-12 gap-6 mb-6">
                <div className="col-span-7">
                  <div className="bg-gradient-to-br from-blue-50 to-white rounded-xl p-4 border-2 border-blue-100 h-full">
                    <h3 className="text-lg font-bold text-[#072741] mb-4 flex items-center gap-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#348ADC" strokeWidth="2">
                          <path d="M20 7h-9"/><path d="M14 17H5"/><circle cx="17" cy="17" r="3"/><circle cx="7" cy="7" r="3"/>
                        </svg>
                      </div>
                      Basic Information
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1.5" style={{ fontFamily: 'Inter, sans-serif' }}>
                          SKU Code *
                        </label>
                        <input
                          ref={firstInputRef}
                          type="text"
                          value={skuCode}
                          onChange={(e) => setSkuCode(e.target.value)}
                          className="w-full px-3 py-2 border-2 border-[#348ADC] rounded-lg text-sm font-semibold text-[#072741] focus:ring-2 focus:ring-[#348ADC] focus:border-[#348ADC] bg-white"
                          placeholder="e.g., BP-2024"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1.5" style={{ fontFamily: 'Inter, sans-serif' }}>
                          Item Name *
                        </label>
                        <input
                          type="text"
                          value={itemName}
                          onChange={(e) => setItemName(e.target.value)}
                          className="w-full px-3 py-2 border-2 border-[#348ADC] rounded-lg text-sm font-semibold text-[#072741] focus:ring-2 focus:ring-[#348ADC] focus:border-[#348ADC] bg-white"
                          placeholder="e.g., Brake Pad Set"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1.5" style={{ fontFamily: 'Inter, sans-serif' }}>
                          Category *
                        </label>
                        <select
                          value={category}
                          onChange={(e) => setCategory(e.target.value)}
                          className="w-full px-3 py-2 border-2 border-[#348ADC] rounded-lg text-sm font-semibold text-[#072741] focus:ring-2 focus:ring-[#348ADC] focus:border-[#348ADC] bg-white"
                          required
                        >
                          <option value="">Select Category</option>
                          {categories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-span-5">
                  <div className="bg-gradient-to-br from-purple-50 to-white rounded-xl p-4 border-2 border-purple-100 h-full">
                    <h3 className="text-lg font-bold text-[#072741] mb-4 flex items-center gap-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9333ea" strokeWidth="2">
                          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                          <polyline points="9 22 9 12 15 12 15 22"/>
                        </svg>
                      </div>
                      Vendor Info
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1.5" style={{ fontFamily: 'Inter, sans-serif' }}>
                          Vendor Name *
                        </label>
                        <input
                          type="text"
                          value={vendorName}
                          onChange={(e) => setVendorName(e.target.value)}
                          className="w-full px-3 py-2 border-2 border-[#348ADC] rounded-lg text-sm font-semibold text-[#072741] focus:ring-2 focus:ring-[#348ADC] focus:border-[#348ADC] bg-white"
                          placeholder="e.g., Auto Parts Co."
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-12 gap-6">
                <div className="col-span-5">
                  <div className="bg-gradient-to-br from-orange-50 to-white rounded-xl p-4 border-2 border-orange-100 h-full">
                    <h3 className="text-lg font-bold text-[#072741] mb-4 flex items-center gap-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                      <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ea580c" strokeWidth="2">
                          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                        </svg>
                      </div>
                      Stock Info
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1.5" style={{ fontFamily: 'Inter, sans-serif' }}>
                          Current Qty *
                        </label>
                        <input
                          type="number"
                          value={currentQuantity}
                          onChange={(e) => setCurrentQuantity(e.target.value)}
                          className="w-full px-3 py-2 border-2 border-[#348ADC] rounded-lg text-sm font-semibold text-[#072741] focus:ring-2 focus:ring-[#348ADC] focus:border-[#348ADC] bg-white"
                          placeholder="0"
                          min="0"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1.5" style={{ fontFamily: 'Inter, sans-serif' }}>
                          Min Stock *
                        </label>
                        <input
                          type="number"
                          value={minStock}
                          onChange={(e) => setMinStock(e.target.value)}
                          className="w-full px-3 py-2 border-2 border-[#348ADC] rounded-lg text-sm font-semibold text-[#072741] focus:ring-2 focus:ring-[#348ADC] focus:border-[#348ADC] bg-white"
                          placeholder="0"
                          min="0"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1.5" style={{ fontFamily: 'Inter, sans-serif' }}>
                          Normal Stock *
                        </label>
                        <input
                          type="number"
                          value={normalStock}
                          onChange={(e) => setNormalStock(e.target.value)}
                          className="w-full px-3 py-2 border-2 border-[#348ADC] rounded-lg text-sm font-semibold text-[#072741] focus:ring-2 focus:ring-[#348ADC] focus:border-[#348ADC] bg-white"
                          placeholder="0"
                          min="0"
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-span-7">
                  <div className="bg-gradient-to-br from-green-50 to-white rounded-xl p-4 border-2 border-green-100 h-full">
                    <h3 className="text-lg font-bold text-[#072741] mb-4 flex items-center gap-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2">
                          <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                        </svg>
                      </div>
                      Pricing Info
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1.5" style={{ fontFamily: 'Inter, sans-serif' }}>
                          Cost Price *
                        </label>
                        <input
                          type="number"
                          value={costPrice}
                          onChange={(e) => setCostPrice(e.target.value)}
                          className="w-full px-3 py-2 border-2 border-[#348ADC] rounded-lg text-sm font-semibold text-[#072741] focus:ring-2 focus:ring-[#348ADC] focus:border-[#348ADC] bg-white"
                          placeholder="0.00"
                          min="0"
                          step="0.01"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1.5" style={{ fontFamily: 'Inter, sans-serif' }}>
                          Selling Price *
                        </label>
                        <input
                          type="number"
                          value={sellingPrice}
                          onChange={(e) => setSellingPrice(e.target.value)}
                          className="w-full px-3 py-2 border-2 border-[#348ADC] rounded-lg text-sm font-semibold text-[#072741] focus:ring-2 focus:ring-[#348ADC] focus:border-[#348ADC] bg-white"
                          placeholder="0.00"
                          min="0"
                          step="0.01"
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t-2 border-gray-200 pt-6 sticky bottom-0 bg-white mt-6">
              <div className="flex gap-4 max-w-md mx-auto">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 text-[#072741] rounded-lg hover:bg-gray-50 transition font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 px-6 py-3 bg-[#348ADC] text-white rounded-lg hover:bg-[#2a6fb0] transition font-semibold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Updating...' : 'Update Item'}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </>
  );
}
