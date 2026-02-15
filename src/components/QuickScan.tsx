import { useState, useEffect, useRef, useCallback } from 'react';
import { X, Search, Minus, Plus, Check, Trash2, ScanLine } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useNotification } from '../contexts/NotificationContext';

interface QuickScanProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ScannedItem {
  inventory_item_id: string;
  sku: string;
  name: string;
  quantity: number;
  selling_price: number;
  cost_price: number;
}

interface CartItem extends ScannedItem {
  cartQuantity: number;
}

export function QuickScan({ isOpen, onClose }: QuickScanProps) {
  const [mode, setMode] = useState<'sale' | 'purchase'>('sale');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<ScannedItem[]>([]);
  const [companyName, setCompanyName] = useState('');
  const [userName, setUserName] = useState('');
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [successMessage, setSuccessMessage] = useState({ title: '', details: '' });
  const [billAddMode, setBillAddMode] = useState<'scan' | 'search' | null>(null);
  const scannerRef = useRef<any>(null);
  const { addNotification } = useNotification();

  useEffect(() => {
    const userData = localStorage.getItem('arento_user');
    if (userData) {
      const { company_name, user_fullname } = JSON.parse(userData);
      if (company_name) setCompanyName(company_name);
      if (user_fullname) setUserName(user_fullname);
    }
  }, []);

  const fetchItemBySKU = useCallback(async (sku: string) => {
    if (!supabase) return;
    const userData = localStorage.getItem('arento_user');
    if (!userData) return;
    const { client_id } = JSON.parse(userData);

    const { data, error } = await supabase
      .from('inventory_items')
      .select('*')
      .eq('client_id', client_id)
      .eq('sku', sku)
      .single();

    if (data && !error) {
      addToCart(data);
      if (navigator.vibrate) navigator.vibrate(100);
    } else {
      addNotification('Item Not Found', `SKU ${sku} not found`);
    }
  }, [addNotification]);

  const startScanner = useCallback(async () => {
    try {
      const { Html5Qrcode } = await import('html5-qrcode');
      const scanner = new Html5Qrcode('qr-reader');
      scannerRef.current = scanner;

      await scanner.start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        (decodedText: string) => fetchItemBySKU(decodedText),
        () => {}
      );
    } catch (err) {
      console.error('Scanner error:', err);
    }
  }, [fetchItemBySKU]);

  const stopScanner = useCallback(async () => {
    if (scannerRef.current?.isScanning) {
      try {
        await scannerRef.current.stop();
      } catch {}
    }
  }, []);

  useEffect(() => {
    if (isOpen && billAddMode === 'scan') {
      startScanner();
    } else {
      stopScanner();
    }
    return () => { stopScanner(); };
  }, [isOpen, billAddMode, startScanner, stopScanner]);

  const handleSearch = async (term: string) => {
    if (!supabase) return;
    setSearchTerm(term);
    if (term.length < 2) {
      setSearchResults([]);
      return;
    }

    const userData = localStorage.getItem('arento_user');
    if (!userData) return;
    const { client_id } = JSON.parse(userData);

    const { data } = await supabase
      .from('inventory_items')
      .select('*')
      .eq('client_id', client_id)
      .or(`name.ilike.%${term}%,sku.ilike.%${term}%`)
      .limit(10);

    if (data) setSearchResults(data);
  };

  const addToCart = (item: ScannedItem) => {
    setCart(prevCart => {
      const existing = prevCart.find(i => i.inventory_item_id === item.inventory_item_id);
      if (existing) {
        return prevCart.map(i =>
          i.inventory_item_id === item.inventory_item_id
            ? { ...i, cartQuantity: i.cartQuantity + 1 }
            : i
        );
      }
      return [...prevCart, { ...item, cartQuantity: 1 }];
    });
    setSearchTerm('');
    setSearchResults([]);
    setBillAddMode(null);
    if (navigator.vibrate) navigator.vibrate(100);
  };

  const updateCartQuantity = (itemId: string, newQty: number) => {
    if (newQty < 1) {
      removeFromCart(itemId);
      return;
    }
    setCart(prevCart =>
      prevCart.map(i =>
        i.inventory_item_id === itemId ? { ...i, cartQuantity: newQty } : i
      )
    );
  };

  const removeFromCart = (itemId: string) => {
    setCart(prevCart => prevCart.filter(i => i.inventory_item_id !== itemId));
  };

  const totalAmount = cart.reduce((sum, item) => 
    sum + (mode === 'sale' ? item.selling_price : item.cost_price) * item.cartQuantity, 0
  );

  const totalItems = cart.reduce((sum, item) => sum + item.cartQuantity, 0);

  const handleConfirmSale = async () => {
    if (!supabase) {
      addNotification('Error', 'Database connection not available');
      return;
    }
    if (cart.length === 0) {
      addNotification('Error', 'Cart is empty');
      return;
    }

    const userData = localStorage.getItem('arento_user');
    if (!userData) {
      addNotification('Error', 'User not logged in');
      return;
    }
    const { client_id } = JSON.parse(userData);

    try {
      for (const item of cart) {
        if (mode === 'sale' && item.quantity < item.cartQuantity) {
          addNotification('Insufficient Stock', `Only ${item.quantity} units of ${item.name} available`);
          return;
        }
      }

      for (const item of cart) {
        const newQuantity = mode === 'sale'
          ? item.quantity - item.cartQuantity
          : item.quantity + item.cartQuantity;

        await supabase
          .from('inventory_items')
          .update({ quantity: newQuantity })
          .eq('inventory_item_id', item.inventory_item_id);
      }

      const invoiceNumber = mode === 'sale' 
        ? `INV-${Date.now().toString().slice(-6)}`
        : `PUR-${Date.now().toString().slice(-6)}`;

      const message = `Invoice: ${invoiceNumber}\nItems: ${totalItems}\nTotal: ₹${totalAmount.toFixed(2)}`;

      if (navigator.vibrate) navigator.vibrate([200, 100, 200]);

      setSuccessMessage({
        title: mode === 'sale' ? 'Sale Created Successfully!' : 'Purchase Created Successfully!',
        details: message
      });
      setShowSuccessPopup(true);

      setTimeout(() => {
        setShowSuccessPopup(false);
        window.dispatchEvent(new Event('inventoryUpdated'));
        setCart([]);
        setBillAddMode(null);
      }, 2000);
    } catch (error) {
      addNotification('Error', `Failed to process transaction: ${error}`);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="h-full bg-white dark:bg-[#1a1a1a] flex flex-col">
      {/* Success Popup */}
      {showSuccessPopup && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50">
          <div className="bg-white dark:bg-[#2d2d2d] rounded-2xl p-8 mx-4 max-w-sm w-full shadow-2xl animate-bounce">
            <div className="text-center">
              <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check size={48} className="text-white" />
              </div>
              <h3 className="text-2xl font-bold text-[#072741] dark:text-white mb-3">{successMessage.title}</h3>
              <p className="text-gray-600 dark:text-gray-400 whitespace-pre-line text-sm">{successMessage.details}</p>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-[#6366f1] p-5">
        <div>
          <h1 className="text-2xl font-bold text-white">Arento</h1>
          <p className="text-sm text-white/90 mt-0.5">{companyName}</p>
          <p className="text-xs text-white/70 mt-0.5">{userName}</p>
        </div>
      </div>

      {/* Mode Toggle */}
      <div className="p-4 bg-white dark:bg-[#1a1a1a]">
        <div className="flex gap-3 bg-gray-100 dark:bg-[#2d2d2d] p-1.5 rounded-2xl">
          <button
            onClick={() => setMode('sale')}
            className={`flex-1 py-3 rounded-xl font-semibold text-base transition-all ${
              mode === 'sale' ? 'bg-green-500 text-white shadow-md' : 'text-gray-600 dark:text-gray-400'
            }`}
          >
            Sale
          </button>
          <button
            onClick={() => setMode('purchase')}
            className={`flex-1 py-3 rounded-xl font-semibold text-base transition-all ${
              mode === 'purchase' ? 'bg-blue-500 text-white shadow-md' : 'text-gray-600 dark:text-gray-400'
            }`}
          >
            Purchase
          </button>
        </div>
      </div>

      {/* Bill Page - Main Content */}
      <div className="flex-1 overflow-auto p-4 bg-gray-50 dark:bg-[#0d0d0d]">
        {/* Cart Items */}
        {cart.map((item) => (
          <div key={item.inventory_item_id} className="bg-white dark:bg-[#1e1e1e] p-4 rounded-2xl mb-3 shadow-sm border border-gray-100 dark:border-gray-800">
            <div className="flex justify-between items-start mb-3">
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 dark:text-white text-base">{item.name}</h4>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">SKU: {item.sku}</p>
              </div>
              <button onClick={() => removeFromCart(item.inventory_item_id)} className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 p-2 rounded-full transition">
                <Trash2 size={16} />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => updateCartQuantity(item.inventory_item_id, item.cartQuantity - 1)}
                  className="w-9 h-9 bg-red-500 rounded-xl flex items-center justify-center text-white shadow-sm active:scale-95 transition"
                >
                  <Minus size={16} />
                </button>
                <span className="w-12 text-center font-bold text-gray-900 dark:text-white text-lg">{item.cartQuantity}</span>
                <button
                  onClick={() => updateCartQuantity(item.inventory_item_id, item.cartQuantity + 1)}
                  className="w-9 h-9 bg-green-500 rounded-xl flex items-center justify-center text-white shadow-sm active:scale-95 transition"
                >
                  <Plus size={16} />
                </button>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-400 dark:text-gray-500">₹{mode === 'sale' ? item.selling_price : item.cost_price} × {item.cartQuantity}</p>
                <p className="font-bold text-green-600 text-lg mt-0.5">₹{((mode === 'sale' ? item.selling_price : item.cost_price) * item.cartQuantity).toFixed(2)}</p>
              </div>
            </div>
          </div>
        ))}

        {/* Add Items Section */}
        {billAddMode === null && (
          <div className="mt-2 p-5 bg-white dark:bg-[#1e1e1e] rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700 shadow-sm">
            <p className="text-center text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">
              {cart.length === 0 ? 'Add Items to Bill' : 'Add More Items'}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setBillAddMode('search')}
                className="flex-1 py-4 bg-blue-500 text-white rounded-2xl font-semibold flex items-center justify-center gap-2 active:scale-95 transition shadow-md"
              >
                <Search size={20} />
                Search
              </button>
              <button
                onClick={() => setBillAddMode('scan')}
                className="flex-1 py-4 bg-green-500 text-white rounded-2xl font-semibold flex items-center justify-center gap-2 active:scale-95 transition shadow-md"
              >
                <ScanLine size={20} />
                Scan
              </button>
            </div>
          </div>
        )}

        {/* Scanner */}
        {billAddMode === 'scan' && (
          <div className="mt-2">
            <div id="qr-reader" className="rounded-2xl overflow-hidden shadow-lg border-2 border-green-200 dark:border-green-800" style={{ minHeight: '250px' }}></div>
            <button
              onClick={() => setBillAddMode(null)}
              className="w-full mt-4 py-3 bg-white dark:bg-[#2d2d2d] text-gray-700 dark:text-gray-300 rounded-2xl font-semibold border-2 border-gray-200 dark:border-gray-700 active:scale-95 transition"
            >
              Close Scanner
            </button>
          </div>
        )}

        {/* Search */}
        {billAddMode === 'search' && (
          <div className="mt-2">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search by name or SKU..."
                className="w-full pl-12 pr-4 py-4 border-2 border-blue-200 dark:border-blue-800 rounded-2xl mb-3 text-base focus:border-blue-500 dark:focus:border-blue-600 focus:outline-none bg-white dark:bg-[#1e1e1e] shadow-sm"
                autoFocus
              />
            </div>
            <div className="space-y-2 max-h-64 overflow-auto mb-3">
              {searchResults.map((item) => (
                <button
                  key={item.inventory_item_id}
                  onClick={() => addToCart(item)}
                  className="w-full p-4 bg-white dark:bg-[#1e1e1e] rounded-2xl text-left border border-gray-100 dark:border-gray-800 hover:border-blue-400 dark:hover:border-blue-600 transition active:scale-98 shadow-sm hover:shadow-md"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900 dark:text-white text-sm">{item.name}</div>
                      <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">SKU: {item.sku} • Stock: {item.quantity}</div>
                      <div className="text-sm font-bold text-green-600 mt-1">₹{item.selling_price}</div>
                    </div>
                    {cart.find(c => c.inventory_item_id === item.inventory_item_id) && (
                      <div className="ml-2 bg-green-500 text-white px-2.5 py-1 rounded-full text-xs font-bold shadow-sm">
                        {cart.find(c => c.inventory_item_id === item.inventory_item_id)?.cartQuantity}
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
            <button
              onClick={() => { setBillAddMode(null); setSearchTerm(''); setSearchResults([]); }}
              className="w-full py-3 bg-white dark:bg-[#2d2d2d] text-gray-700 dark:text-gray-300 rounded-2xl font-semibold border-2 border-gray-200 dark:border-gray-700 active:scale-95 transition"
            >
              Close Search
            </button>
          </div>
        )}
      </div>

      {/* Footer - Total & Confirm */}
      {cart.length > 0 && (
        <div className="p-5 bg-white dark:bg-[#1e1e1e] border-t border-gray-200 dark:border-gray-800 shadow-2xl">
          <div className="flex justify-between items-center mb-4">
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Total Amount</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">₹{totalAmount.toFixed(2)}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500 dark:text-gray-400">{totalItems} items</p>
            </div>
          </div>
          <button
            onClick={handleConfirmSale}
            className={`w-full py-4 rounded-2xl font-bold text-lg text-white active:scale-95 transition shadow-md ${
              mode === 'sale' ? 'bg-green-500' : 'bg-blue-500'
            }`}
          >
            Confirm {mode === 'sale' ? 'Sale' : 'Purchase'}
          </button>
        </div>
      )}
    </div>
  );
}
