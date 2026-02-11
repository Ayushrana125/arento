import { X, Plus, Trash2 } from 'lucide-react';
import { useState, useEffect } from 'react';

interface StockAdjustmentPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

interface AdjustmentItem {
  id: string;
  inventory_item_id: string;
  name: string;
  adjustment_type: 'add' | 'remove';
  quantity: number;
}

export function StockAdjustmentPanel({ isOpen, onClose }: StockAdjustmentPanelProps) {
  const [notes, setNotes] = useState('');
  const [items, setItems] = useState<AdjustmentItem[]>([]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => setIsVisible(true), 10);
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
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const addItem = () => {
    setItems([...items, {
      id: Date.now().toString(),
      inventory_item_id: '',
      name: '',
      adjustment_type: 'add',
      quantity: 0
    }]);
  };

  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const updateItem = (id: string, field: keyof AdjustmentItem, value: any) => {
    setItems(items.map(item => {
      if (item.id === id) {
        return { ...item, [field]: value };
      }
      return item;
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Submit to database
    console.log({
      type: 'adjustment',
      notes,
      items
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-50" onClick={onClose}></div>
      <div className={`fixed top-0 right-0 h-full w-full md:w-[600px] bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-out overflow-y-auto ${
        isVisible ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
          <h2 className="text-2xl font-semibold text-[#072741]" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Stock Adjustment
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-[#072741] transition-colors">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-medium text-[#072741]" style={{ fontFamily: 'Inter, sans-serif' }}>
                Items to Adjust
              </label>
              <button
                type="button"
                onClick={addItem}
                className="flex items-center gap-1 text-sm text-[#348ADC] hover:text-[#2a6fb0] font-medium"
              >
                <Plus size={16} /> Add Item
              </button>
            </div>

            <div className="space-y-3">
              {items.map((item) => (
                <div key={item.id} className="border border-gray-200 rounded-lg p-4 space-y-3">
                  <div className="flex items-start gap-2">
                    <div className="flex-1 space-y-3">
                      <input
                        type="text"
                        value={item.name}
                        onChange={(e) => updateItem(item.id, 'name', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        placeholder="Item name"
                        required
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <select
                          value={item.adjustment_type}
                          onChange={(e) => updateItem(item.id, 'adjustment_type', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                          required
                        >
                          <option value="add">Add Stock</option>
                          <option value="remove">Remove Stock</option>
                        </select>
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => updateItem(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                          placeholder="Quantity"
                          min="1"
                          required
                        />
                      </div>
                      <div className={`text-sm font-medium ${item.adjustment_type === 'add' ? 'text-green-600' : 'text-red-600'}`}>
                        {item.adjustment_type === 'add' ? '+' : '-'} {item.quantity} units
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      className="text-red-500 hover:text-red-700 p-1"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#072741] mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
              Reason for Adjustment
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#348ADC] focus:border-transparent"
              rows={3}
              placeholder="Damaged goods, stock count correction, etc."
              required
            />
          </div>

          <div className="border-t border-gray-200 pt-4">
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-3 border border-gray-300 text-[#072741] rounded-lg hover:bg-gray-50 transition font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-3 bg-[#348ADC] text-white rounded-lg hover:bg-[#2a6fb0] transition font-medium"
              >
                Apply Adjustment
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}
