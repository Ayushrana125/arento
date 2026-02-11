import { X, Plus, Trash2 } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

interface SalePanelProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SaleItem {
  id: string;
  sku: string;
  quantity: number;
  price: number;
  subtotal: number;
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
  const [items, setItems] = useState<SaleItem[]>([
    { id: '1', sku: '', quantity: 1, price: 0, subtotal: 0 },
    { id: '2', sku: '', quantity: 1, price: 0, subtotal: 0 },
    { id: '3', sku: '', quantity: 1, price: 0, subtotal: 0 },
  ]);
  const [searchResults, setSearchResults] = useState<{ [key: string]: typeof mockInventory }>({});
  const [activeSearch, setActiveSearch] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const firstSkuInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setInvoiceNumber(`INV-${Date.now().toString().slice(-6)}`);
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
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const addItem = () => {
    setItems([...items, {
      id: Date.now().toString(),
      sku: '',
      quantity: 1,
      price: 0,
      subtotal: 0
    }]);
  };

  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id));
    } else {
      setItems([{ id: Date.now().toString(), sku: '', quantity: 1, price: 0, subtotal: 0 }]);
    }
  };

  const handleSkuSearch = (id: string, value: string) => {
    updateItem(id, 'sku', value);
    if (value.length > 0) {
      const results = mockInventory.filter(item => 
        item.sku.toLowerCase().includes(value.toLowerCase()) ||
        item.name.toLowerCase().includes(value.toLowerCase())
      );
      setSearchResults({ ...searchResults, [id]: results });
      setActiveSearch(id);
    } else {
      setSearchResults({ ...searchResults, [id]: [] });
      setActiveSearch(null);
    }
  };

  const selectItem = (id: string, item: typeof mockInventory[0]) => {
    const updatedItems = items.map(i => {
      if (i.id === id) {
        const updated = { ...i, sku: item.sku, price: item.price };
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
      if (qtyInput) qtyInput.focus();
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({
      type: 'sale',
      invoice_number: invoiceNumber,
      total_amount: totalAmount,
      notes,
      items
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-50" onClick={onClose}></div>
      <div className={`fixed top-0 right-0 h-full w-full md:w-[700px] bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-out overflow-y-auto ${
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
          <div>
            <div className="flex items-center justify-between mb-4">
              <label className="block text-base font-semibold text-[#072741]" style={{ fontFamily: 'Poppins, sans-serif' }}>
                Sale Items
              </label>
              <button
                type="button"
                onClick={addItem}
                className="flex items-center gap-1 text-sm text-[#348ADC] hover:text-[#2a6fb0] font-medium px-3 py-1.5 border border-[#348ADC] rounded-lg hover:bg-blue-50 transition"
              >
                <Plus size={16} /> Add More
              </button>
            </div>

            <div className="space-y-4">
              {items.map((item, index) => (
                <div key={item.id} className="bg-gray-50 rounded-xl p-4 border-2 border-gray-200 hover:border-[#348ADC] transition">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-[#348ADC] text-white rounded-full flex items-center justify-center font-semibold text-sm">
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
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              const qtyInput = e.currentTarget.closest('.space-y-3')?.querySelector('input[type="number"]') as HTMLInputElement;
                              if (qtyInput) qtyInput.focus();
                            }
                          }}
                          onClick={() => {
                            if (item.sku.length === 0) {
                              setSearchResults({ ...searchResults, [item.id]: mockInventory });
                              setActiveSearch(item.id);
                            }
                          }}
                          onFocus={() => {
                            if (item.sku.length === 0) {
                              setSearchResults({ ...searchResults, [item.id]: mockInventory });
                              setActiveSearch(item.id);
                            }
                          }}
                          className="w-full px-4 py-3 border-2 border-[#348ADC] rounded-lg text-base font-semibold text-[#072741] focus:ring-2 focus:ring-[#348ADC] focus:border-[#348ADC] bg-white"
                          placeholder="Type SKU or item name..."
                          required
                        />
                        {activeSearch === item.id && searchResults[item.id]?.length > 0 && (
                          <div className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                            {searchResults[item.id].map((result) => (
                              <button
                                key={result.sku}
                                type="button"
                                onClick={() => selectItem(item.id, result)}
                                className="w-full px-4 py-2 text-left hover:bg-blue-50 border-b border-gray-100 last:border-b-0"
                              >
                                <div className="font-semibold text-sm text-[#072741]">{result.sku}</div>
                                <div className="text-xs text-gray-600">{result.name} - ₹{result.price}</div>
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
                            className="w-full px-4 py-3 border-2 border-[#348ADC] rounded-lg text-base font-semibold text-[#072741] focus:ring-2 focus:ring-[#348ADC] focus:border-[#348ADC] bg-white"
                            min="1"
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
                            className="w-full px-3 py-3 border border-gray-300 rounded-lg text-sm text-gray-700 focus:ring-2 focus:ring-[#348ADC] focus:border-transparent"
                            min="0"
                            step="0.01"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1.5" style={{ fontFamily: 'Inter, sans-serif' }}>
                            Subtotal
                          </label>
                          <div className="px-3 py-3 bg-green-50 border border-green-200 rounded-lg text-sm font-semibold text-green-700">
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
            <div className="flex justify-between items-center mb-6 bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-xl border-2 border-green-300">
              <span className="text-lg font-semibold text-[#072741]" style={{ fontFamily: 'Poppins, sans-serif' }}>
                Total Amount
              </span>
              <span className="text-3xl font-bold text-green-600" style={{ fontFamily: 'Poppins, sans-serif' }}>
                ₹ {totalAmount.toFixed(2)}
              </span>
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
                type="submit"
                className="flex-1 px-6 py-3 bg-[#348ADC] text-white rounded-lg hover:bg-[#2a6fb0] transition font-semibold text-lg shadow-lg"
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
