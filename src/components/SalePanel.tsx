import { X, Plus, Trash2 } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useNotification } from '../contexts/NotificationContext';
import { BillPreview } from './BillPreview';
import { getUserPermissions } from '../lib/permissions';
import { supabase } from '../lib/supabase';

interface SalePanelProps {
  isOpen: boolean;
  onClose: () => void;
}

interface InventoryItem {
  sku: string;
  name: string;
  selling_price: number;
  quantity: number;
}

interface SaleItem {
  id: string;
  sku: string;
  quantity: number;
  price: number;
  subtotal: number;
  availableStock?: number;
}

const mockInventory = [
  { sku: 'EO-530', name: 'Engine Oil 5W-30', price: 500 },
  { sku: 'BP-2024', name: 'Brake Pad Set', price: 600 },
  { sku: 'AF-332', name: 'Air Filter', price: 400 },
  { sku: 'SP-890', name: 'Spark Plug', price: 150 },
  { sku: 'WB-101', name: 'Wiper Blade', price: 200 },
  { sku: 'EOF-445', name: 'Engine Oil Filter', price: 350 },
];

export function SalePanel({ isOpen, onClose }: SalePanelProps) {
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [notes, setNotes] = useState('');
  const [mobile, setMobile] = useState('');
  const [vehicleNo, setVehicleNo] = useState('');
  const [msName, setMsName] = useState('');
  const [items, setItems] = useState<SaleItem[]>([
    { id: '1', sku: '', quantity: 1, price: 0, subtotal: 0 },
  ]);
  const [searchResults, setSearchResults] = useState<{ [key: string]: InventoryItem[] }>({});
  const [activeSearch, setActiveSearch] = useState<string | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<{ [key: string]: number }>({});
  const [isVisible, setIsVisible] = useState(false);
  const [autoDownloadPdf, setAutoDownloadPdf] = useState(false);
  const [autoPrintBill, setAutoPrintBill] = useState(false);
  const [canCreateSale, setCanCreateSale] = useState(false);
  const firstSkuInputRef = useRef<HTMLInputElement>(null);
  const addMoreButtonRef = useRef<HTMLButtonElement>(null);
  const submitButtonRef = useRef<HTMLButtonElement>(null);
  const { addNotification } = useNotification();

  useEffect(() => {
    getUserPermissions().then(permissions => {
      setCanCreateSale(permissions.addSalesPurchase);
    });
  }, []);

  useEffect(() => {
    if (isOpen) {
      setInvoiceNumber(`INV-${Date.now().toString().slice(-6)}`);
      setItems([{ id: '1', sku: '', quantity: 1, price: 0, subtotal: 0 }]);
      setNotes('');
      setMobile('');
      setVehicleNo('');
      setMsName('');
      setSearchResults({});
      setActiveSearch(null);
      setSelectedIndex({});
      setAutoDownloadPdf(false);
      setAutoPrintBill(false);
      setTimeout(() => {
        setIsVisible(true);
        setTimeout(() => {
          if (firstSkuInputRef.current) {
            firstSkuInputRef.current.focus();
            firstSkuInputRef.current.click();
          }
        }, 100);
      }, 10);
    } else {
      setIsVisible(false);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsVisible(false);
        setTimeout(() => {
          if (onClose) onClose();
        }, 300);
        return;
      }
      if (e.key === '+' || e.key === '=') {
        e.preventDefault();
        addItem();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const addItem = () => {
    const newItem = {
      id: Date.now().toString(),
      sku: '',
      quantity: 1,
      price: 0,
      subtotal: 0
    };
    setItems([...items, newItem]);
    setTimeout(() => {
      const newItemElement = document.querySelector(`[data-item-id="${newItem.id}"]`);
      const skuInput = newItemElement?.querySelector('input[type="text"]') as HTMLInputElement;
      if (skuInput) skuInput.focus();
    }, 50);
  };

  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id));
    } else {
      setItems([{ id: Date.now().toString(), sku: '', quantity: 1, price: 0, subtotal: 0 }]);
    }
  };

  const handleSkuSearch = async (id: string, value: string) => {
    updateItem(id, 'sku', value);
    setSelectedIndex({ ...selectedIndex, [id]: 0 });
    if (value.length > 0) {
      const userData = localStorage.getItem('arento_user');
      if (!userData) return;

      const { client_id: clientId } = JSON.parse(userData);

      const { data } = await supabase
        .from('inventory_items')
        .select('sku, name, selling_price, quantity')
        .eq('client_id', clientId)
        .or(`sku.ilike.%${value}%,name.ilike.%${value}%`)
        .limit(10);

      if (data) {
        setSearchResults({ ...searchResults, [id]: data });
        setActiveSearch(id);
      }
    } else {
      setSearchResults({ ...searchResults, [id]: [] });
      setActiveSearch(null);
    }
  };

  const selectItem = (id: string, item: InventoryItem) => {
    if (item.quantity === 0) {
      addNotification('Out of Stock', `${item.name} (${item.sku}) is currently out of stock.`, 'error');
      return;
    }
    const updatedItems = items.map(i => {
      if (i.id === id) {
        const updated = { ...i, sku: item.sku, price: item.selling_price, availableStock: item.quantity };
        updated.subtotal = updated.quantity * updated.price;
        return updated;
      }
      return i;
    });
    setItems(updatedItems);
    setSearchResults({ ...searchResults, [id]: [] });
    setActiveSearch(null);
    setTimeout(() => {
      const itemElement = document.querySelector(`[data-item-id="${id}"]`);
      const qtyInput = itemElement?.querySelector('input[type="number"]') as HTMLInputElement;
      if (qtyInput) {
        qtyInput.focus();
        qtyInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 50);
  };

  const updateItem = (id: string, field: keyof SaleItem, value: any) => {
    setItems(items.map(item => {
      if (item.id === id) {
        const updated = { ...item, [field]: value };
        if (field === 'quantity' || field === 'price') {
          updated.subtotal = updated.quantity * updated.price;
        }
        return updated;
      }
      return item;
    }));
  };

  const totalAmount = items.reduce((sum, item) => sum + item.subtotal, 0);
  const hasOutOfStockItems = items.some(item => item.availableStock === 0 && item.sku);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!canCreateSale) {
      addNotification('Access Denied', 'You do not have permission to create sales.', 'error');
      return;
    }
    
    const outOfStockItems = items.filter(item => item.availableStock === 0 && item.sku);
    if (outOfStockItems.length > 0) {
      addNotification('Cannot Create Sale', 'Some items are out of stock. Please remove them to continue.', 'error');
      return;
    }
    
    // Verify stock availability from database
    const userData = localStorage.getItem('arento_user');
    if (!userData) return;
    const { client_id: clientId } = JSON.parse(userData);
    
    const itemsWithSku = items.filter(item => item.sku && item.quantity > 0);
    const skus = itemsWithSku.map(item => item.sku);
    
    const { data: stockData } = await supabase
      .from('inventory_items')
      .select('sku, quantity')
      .eq('client_id', clientId)
      .in('sku', skus);
    
    if (stockData) {
      const insufficientStock = itemsWithSku.filter(item => {
        const dbItem = stockData.find(s => s.sku === item.sku);
        return !dbItem || dbItem.quantity < item.quantity;
      });
      
      if (insufficientStock.length > 0) {
        const itemsList = insufficientStock.map(item => item.sku).join(', ');
        addNotification('Insufficient Stock', `Not enough stock for: ${itemsList}`, 'error');
        return;
      }
    }
    
    // Update inventory quantities
    for (const item of itemsWithSku) {
      const currentStock = stockData?.find(s => s.sku === item.sku);
      if (currentStock) {
        const newQuantity = currentStock.quantity - item.quantity;
        await supabase
          .from('inventory_items')
          .update({ quantity: newQuantity })
          .eq('client_id', clientId)
          .eq('sku', item.sku);
      }
    }
    
    const itemsList = itemsWithSku
      .map(item => `${item.sku} (Qty: ${item.quantity})`)
      .join(', ');
    
    const message = `Invoice: ${invoiceNumber}\nItems: ${itemsList}\nTotal: ₹${totalAmount.toFixed(2)}`;
    
    console.log({
      type: 'sale',
      invoice_number: invoiceNumber,
      total_amount: totalAmount,
      notes,
      items
    });

    if (autoDownloadPdf || autoPrintBill) {
      const event = new CustomEvent('triggerBillAction', {
        detail: { autoDownloadPdf, autoPrintBill }
      });
      window.dispatchEvent(event);
    }
    
    onClose();
    
    // Trigger inventory refresh event
    window.dispatchEvent(new CustomEvent('inventoryUpdated'));
    
    setTimeout(() => {
      addNotification('Sale Created Successfully!', message);
    }, 400);
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-50" onClick={onClose}></div>
      <BillPreview 
        invoiceNumber={invoiceNumber}
        items={items}
        totalAmount={totalAmount}
        isVisible={isVisible}
        mobile={mobile}
        vehicleNo={vehicleNo}
        msName={msName}
      />
      <div className={`fixed top-0 right-0 h-full w-full md:w-1/2 bg-white shadow-2xl z-[60] transform transition-transform duration-300 ease-out overflow-y-auto ${
        isVisible ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
          <div>
            <h2 className="text-2xl font-semibold text-[#072741]" style={{ fontFamily: 'Poppins, sans-serif' }}>
              New Sale
            </h2>
            <p className="text-sm text-gray-500 mt-1" style={{ fontFamily: 'Inter, sans-serif' }}>
              Invoice: <span className="font-medium text-[#348ADC]">{invoiceNumber}</span> <span className="text-xs text-gray-400">(Auto-generated)</span>
            </p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-[#072741] transition-colors">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6" onClick={() => setActiveSearch(null)}>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                Mobile
              </label>
              <input
                type="tel"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#348ADC] focus:border-transparent text-sm"
                placeholder="Customer mobile"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                Vehicle No.
              </label>
              <input
                type="text"
                value={vehicleNo}
                onChange={(e) => setVehicleNo(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#348ADC] focus:border-transparent text-sm"
                placeholder="MH-01-AB-1234"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                M/S
              </label>
              <input
                type="text"
                value={msName}
                onChange={(e) => setMsName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#348ADC] focus:border-transparent text-sm"
                placeholder="Company name"
              />
            </div>
          </div>

          <div>
            <label className="block text-base font-semibold text-[#072741] mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Sale Items
            </label>

            <div className="space-y-4">
              {items.map((item, index) => (
                <div key={item.id} className={`rounded-xl p-4 border-2 transition ${
                  item.availableStock === 0 && item.sku ? 'bg-red-50 border-red-400' : 'bg-gray-50 border-gray-200 hover:border-[#348ADC]'
                }`}>
                  <div className="flex items-start gap-3">
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm ${
                      item.availableStock === 0 && item.sku ? 'bg-red-500 text-white' : 'bg-[#348ADC] text-white'
                    }`}>
                      {index + 1}
                    </div>
                    <div className="flex-1 space-y-3" data-item-id={item.id}>
                      <div className="relative" onClick={(e) => e.stopPropagation()}>
                        <label className="block text-xs font-semibold text-[#072741] mb-1.5" style={{ fontFamily: 'Inter, sans-serif' }}>
                          SKU CODE *
                        </label>
                        <input
                          ref={index === 0 ? firstSkuInputRef : null}
                          type="text"
                          value={item.sku}
                          onChange={(e) => handleSkuSearch(item.id, e.target.value)}
                          onKeyDown={(e) => {
                            const results = searchResults[item.id] || [];
                            const currentIndex = selectedIndex[item.id] || 0;
                            
                            if (e.key === 'ArrowDown') {
                              e.preventDefault();
                              if (results.length > 0) {
                                const newIndex = Math.min(currentIndex + 1, results.length - 1);
                                setSelectedIndex({ ...selectedIndex, [item.id]: newIndex });
                                setTimeout(() => {
                                  const dropdown = document.querySelector(`[data-dropdown-id="${item.id}"]`);
                                  const selectedItem = dropdown?.children[newIndex] as HTMLElement;
                                  if (selectedItem) selectedItem.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
                                }, 0);
                              }
                            } else if (e.key === 'ArrowUp') {
                              e.preventDefault();
                              if (results.length > 0) {
                                const newIndex = Math.max(currentIndex - 1, 0);
                                setSelectedIndex({ ...selectedIndex, [item.id]: newIndex });
                                setTimeout(() => {
                                  const dropdown = document.querySelector(`[data-dropdown-id="${item.id}"]`);
                                  const selectedItem = dropdown?.children[newIndex] as HTMLElement;
                                  if (selectedItem) selectedItem.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
                                }, 0);
                              }
                            } else if (e.key === 'Enter') {
                              e.preventDefault();
                              if (results.length > 0 && activeSearch === item.id) {
                                selectItem(item.id, results[currentIndex]);
                              } else {
                                const qtyInput = e.currentTarget.closest('.space-y-3')?.querySelector('input[type="number"]') as HTMLInputElement;
                                if (qtyInput) qtyInput.focus();
                              }
                            }
                          }}
                          onClick={() => {
                            if (item.sku.length === 0) {
                              handleSkuSearch(item.id, '');
                            }
                          }}
                          onFocus={() => {
                            if (item.sku.length === 0) {
                              handleSkuSearch(item.id, '');
                            }
                          }}
                          className="w-full px-4 py-3 border-2 border-[#348ADC] rounded-lg text-base font-semibold text-[#072741] focus:ring-2 focus:ring-[#348ADC] focus:border-[#348ADC] bg-white"
                          placeholder="Type SKU or item name..."
                          required
                        />
                        {activeSearch === item.id && searchResults[item.id]?.length > 0 && (
                          <div data-dropdown-id={item.id} className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                            {searchResults[item.id].map((result, idx) => (
                              <button
                                key={result.sku}
                                type="button"
                                onClick={() => selectItem(item.id, result)}
                                className={`w-full px-4 py-2 text-left border-b border-gray-100 last:border-b-0 ${
                                  idx === (selectedIndex[item.id] || 0) ? 'bg-blue-100' : 'hover:bg-blue-50'
                                }`}
                              >
                                <div className="flex items-center justify-between">
                                  <div>
                                    <div className="font-semibold text-sm text-[#072741]">{result.sku}</div>
                                    <div className="text-xs text-gray-600">{result.name} - ₹{result.selling_price}</div>
                                  </div>
                                  <div className={`text-xs font-semibold ${
                                    result.quantity === 0 ? 'text-red-600' : result.quantity <= 10 ? 'text-orange-600' : 'text-green-600'
                                  }`}>
                                    {result.quantity === 0 ? 'Out of Stock' : `Stock: ${result.quantity}`}
                                  </div>
                                </div>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <label className="block text-xs font-semibold text-[#072741] mb-1.5" style={{ fontFamily: 'Inter, sans-serif' }}>
                            QUANTITY *
                          </label>
                          <input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => updateItem(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                const priceInput = e.currentTarget.closest('.grid')?.querySelectorAll('input[type="number"]')[1] as HTMLInputElement;
                                if (priceInput) {
                                  priceInput.focus();
                                  priceInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                }
                              }
                            }}
                            className="w-full px-4 py-3 border-2 border-[#348ADC] rounded-lg text-base font-semibold text-[#072741] focus:ring-2 focus:ring-[#348ADC] focus:border-[#348ADC] bg-white"
                            min="1"
                            disabled={item.availableStock === 0 && !!item.sku}
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1.5" style={{ fontFamily: 'Inter, sans-serif' }}>
                            Price
                          </label>
                          <input
                            type="number"
                            value={item.price}
                            onChange={(e) => updateItem(item.id, 'price', parseFloat(e.target.value) || 0)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                if (addMoreButtonRef.current) {
                                  addMoreButtonRef.current.focus();
                                  addMoreButtonRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                }
                              }
                            }}
                            className="w-full px-3 py-3 border border-gray-300 rounded-lg text-sm text-gray-700 focus:ring-2 focus:ring-[#348ADC] focus:border-transparent"
                            min="0"
                            step="0.01"
                            disabled={item.availableStock === 0 && !!item.sku}
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1.5" style={{ fontFamily: 'Inter, sans-serif' }}>
                            Subtotal
                          </label>
                          <div className={`px-3 py-3 border rounded-lg text-sm font-semibold ${
                            item.availableStock === 0 && item.sku ? 'bg-red-50 border-red-200 text-red-700' : 'bg-green-50 border-green-200 text-green-700'
                          }`}>
                            ₹{item.subtotal.toFixed(2)}
                          </div>
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <button
              ref={addMoreButtonRef}
              type="button"
              onClick={addItem}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  if (submitButtonRef.current) submitButtonRef.current.click();
                } else if (e.key === '+' || e.key === '=') {
                  e.preventDefault();
                  addItem();
                }
              }}
              className="w-full mt-3 flex items-center justify-center gap-1 text-sm text-[#348ADC] hover:text-[#2a6fb0] font-medium px-3 py-2.5 border-2 border-dashed border-[#348ADC] rounded-lg hover:bg-blue-50 transition"
            >
              <Plus size={16} /> Add More Items
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
              Notes (Optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#348ADC] focus:border-transparent text-sm"
              rows={2}
              placeholder="Add any notes..."
            />
          </div>

          <div className="border-t-2 border-gray-200 pt-6 sticky bottom-0 bg-white">
            <div className="flex justify-between items-center mb-4 bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-xl border-2 border-green-300">
              <span className="text-lg font-semibold text-[#072741]" style={{ fontFamily: 'Poppins, sans-serif' }}>
                Total Amount
              </span>
              <span className="text-3xl font-bold text-green-600" style={{ fontFamily: 'Poppins, sans-serif' }}>
                ₹ {totalAmount.toFixed(2)}
              </span>
            </div>

            <div className="flex gap-2 mb-4">
              <label className="flex items-center gap-2 text-xs text-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoDownloadPdf}
                  onChange={(e) => setAutoDownloadPdf(e.target.checked)}
                  className="w-3.5 h-3.5 text-[#348ADC] border-gray-300 rounded focus:ring-[#348ADC]"
                />
                <span style={{ fontFamily: 'Inter, sans-serif' }}>Auto Download PDF</span>
              </label>
              <label className="flex items-center gap-2 text-xs text-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoPrintBill}
                  onChange={(e) => setAutoPrintBill(e.target.checked)}
                  className="w-3.5 h-3.5 text-[#348ADC] border-gray-300 rounded focus:ring-[#348ADC]"
                />
                <span style={{ fontFamily: 'Inter, sans-serif' }}>Auto Print Bill</span>
              </label>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-3 border-2 border-gray-300 text-[#072741] rounded-lg hover:bg-gray-50 transition font-semibold"
              >
                Cancel
              </button>
              <button
                ref={submitButtonRef}
                type="submit"
                disabled={!canCreateSale || hasOutOfStockItems}
                className={`flex-1 px-6 py-3 rounded-lg transition font-semibold text-lg shadow-lg ${
                  canCreateSale && !hasOutOfStockItems
                    ? 'bg-[#348ADC] text-white hover:bg-[#2a6fb0]'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
                title={!canCreateSale ? 'You do not have permission to create sales' : hasOutOfStockItems ? 'Remove out of stock items to continue' : ''}
              >
                Create Sale
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}
