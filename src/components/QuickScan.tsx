import { useState, useEffect, useRef, useCallback } from 'react';
import { X, Search, Minus, Plus, Check, ShoppingCart, Trash2 } from 'lucide-react';
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
  const [isScanning, setIsScanning] = useState(true);
  const [searchMode, setSearchMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<ScannedItem[]>([]);
  const [companyName, setCompanyName] = useState('Arento');
  const [showBillPreview, setShowBillPreview] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [successMessage, setSuccessMessage] = useState({ title: '', details: '' });
  const scannerRef = useRef<any>(null);
  const { addNotification } = useNotification();

  useEffect(() => {
    const userData = localStorage.getItem('arento_user');
    if (userData) {
      const { company_name } = JSON.parse(userData);
      if (company_name) setCompanyName(company_name);
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
    if (isOpen && isScanning && !searchMode && !showBillPreview) {
      startScanner();
    } else {
      stopScanner();
    }
    return () => { stopScanner(); };
  }, [isOpen, isScanning, searchMode, showBillPreview, startScanner, stopScanner]);

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
    // Don't close search mode - let user keep adding items
    setSearchTerm('');
    setSearchResults([]);
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
    console.log('Confirm button clicked');
    if (!supabase) {
      console.error('Supabase not initialized');
      addNotification('Error', 'Database connection not available');
      return;
    }
    if (cart.length === 0) {
      console.error('Cart is empty');
      addNotification('Error', 'Cart is empty');
      return;
    }

    const userData = localStorage.getItem('arento_user');
    if (!userData) {
      console.error('User data not found');
      addNotification('Error', 'User not logged in');
      return;
    }
    const { client_id, user_id } = JSON.parse(userData);
    console.log('User data:', { client_id, user_id });

    try {
      // Check stock availability
      for (const item of cart) {
        if (mode === 'sale' && item.quantity < item.cartQuantity) {
          addNotification('Insufficient Stock', `Only ${item.quantity} units of ${item.name} available`);
          return;
        }
      }

      console.log('Updating inventory...');
      // Update inventory
      for (const item of cart) {
        const newQuantity = mode === 'sale'
          ? item.quantity - item.cartQuantity
          : item.quantity + item.cartQuantity;

        await supabase
          .from('inventory_items')
          .update({ quantity: newQuantity })
          .eq('inventory_item_id', item.inventory_item_id);
      }

      console.log('Creating transaction...');
      // Create transaction
      const invoiceNumber = mode === 'sale' 
        ? `INV-${Date.now().toString().slice(-6)}`
        : `PUR-${Date.now().toString().slice(-6)}`;

      const transactionTable = mode === 'sale' ? 'sales_transactions' : 'purchase_transactions';
      const itemsTable = mode === 'sale' ? 'sales_transaction_items' : 'purchase_transaction_items';
      const transactionIdField = mode === 'sale' ? 'sales_transaction_id' : 'purchase_transaction_id';

      const { data: transaction, error: transError } = await supabase
        .from(transactionTable)
        .insert({
          client_id,
          user_id,
          invoice_number: invoiceNumber,
          total_amount: totalAmount,
          transaction_date: new Date().toISOString()
        })
        .select()
        .single();

      if (transError) {
        console.error('Transaction error:', transError);
        throw transError;
      }

      console.log('Transaction created:', transaction);

      if (transaction) {
        console.log('Creating transaction items...');
        for (const item of cart) {
          await supabase
            .from(itemsTable)
            .insert({
              [transactionIdField]: transaction[transactionIdField],
              inventory_item_id: item.inventory_item_id,
              quantity: item.cartQuantity,
              unit_price: mode === 'sale' ? item.selling_price : item.cost_price,
              subtotal: (mode === 'sale' ? item.selling_price : item.cost_price) * item.cartQuantity
            });
        }
      }

      const message = `Invoice: ${invoiceNumber}\nItems: ${totalItems}\nTotal: ₹${totalAmount.toFixed(2)}`;

      if (navigator.vibrate) navigator.vibrate([200, 100, 200]);

      setSuccessMessage({
        title: mode === 'sale' ? 'Sale Created Successfully!' : 'Purchase Created Successfully!',
        details: message
      });
      setShowSuccessPopup(true);
      setShowBillPreview(false);

      console.log('Success! Resetting in 2 seconds...');
      setTimeout(() => {
        setShowSuccessPopup(false);
        window.dispatchEvent(new Event('inventoryUpdated'));
        setCart([]);
        setIsScanning(true);
      }, 2000);
    } catch (error) {
      console.error('Transaction error:', error);
      addNotification('Error', `Failed to process transaction: ${error}`);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-white dark:bg-[#1a1a1a] z-[100] flex flex-col">
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

      {/* Bill Preview Modal */}
      {showBillPreview && (
        <div className="fixed inset-0 z-[150] bg-white dark:bg-[#1a1a1a] flex flex-col">
          <div className="bg-[#072741] dark:bg-[#1e3a52] p-4 flex items-center justify-between">
            <button onClick={() => setShowBillPreview(false)} className="text-white">
              <X size={28} />
            </button>
            <h2 className="text-xl font-bold text-white">Bill Preview</h2>
            <button
              onClick={() => {
                setShowBillPreview(false);
                setSearchMode(true);
                setIsScanning(false);
              }}
              className="bg-white/20 text-white px-3 py-1.5 rounded-lg text-sm font-semibold"
            >
              + Add
            </button>
          </div>

          <div className="flex-1 overflow-auto p-4">
            {cart.map((item) => (
              <div key={item.inventory_item_id} className="bg-gray-50 dark:bg-[#2d2d2d] p-4 rounded-xl mb-3 border-2 border-gray-200 dark:border-gray-700">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <h4 className="font-bold text-[#072741] dark:text-white">{item.name}</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400">SKU: {item.sku}</p>
                  </div>
                  <button onClick={() => removeFromCart(item.inventory_item_id)} className="text-red-500 p-1">
                    <Trash2 size={18} />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateCartQuantity(item.inventory_item_id, item.cartQuantity - 1)}
                      className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="w-10 text-center font-bold text-[#072741] dark:text-white">{item.cartQuantity}</span>
                    <button
                      onClick={() => updateCartQuantity(item.inventory_item_id, item.cartQuantity + 1)}
                      className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500 dark:text-gray-400">₹{mode === 'sale' ? item.selling_price : item.cost_price} × {item.cartQuantity}</p>
                    <p className="font-bold text-green-600">₹{((mode === 'sale' ? item.selling_price : item.cost_price) * item.cartQuantity).toFixed(2)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 bg-gray-50 dark:bg-[#2d2d2d] border-t-2 border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-bold text-[#072741] dark:text-white">Total Amount</span>
              <span className="text-2xl font-bold text-green-600">₹{totalAmount.toFixed(2)}</span>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowBillPreview(false)}
                className="flex-1 py-4 rounded-2xl font-bold text-lg bg-gray-200 dark:bg-[#3d3d3d] text-gray-700 dark:text-gray-300"
              >
                Back
              </button>
              <button
                onClick={handleConfirmSale}
                className={`flex-1 py-4 rounded-2xl font-bold text-lg text-white ${
                  mode === 'sale' ? 'bg-green-500' : 'bg-blue-500'
                }`}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-[#072741] dark:bg-[#1e3a52] p-4 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">{companyName}</h2>
          <p className="text-xs text-white/70">Quick Scan</p>
        </div>
        <button onClick={onClose} className="text-white">
          <X size={28} />
        </button>
      </div>

      {/* Mode Toggle */}
      <div className="p-4 bg-gray-50 dark:bg-[#2d2d2d]">
        <div className="flex gap-2">
          <button
            onClick={() => setMode('sale')}
            className={`flex-1 py-4 rounded-xl font-bold text-lg transition ${
              mode === 'sale' ? 'bg-green-500 text-white' : 'bg-white dark:bg-[#3d3d3d] text-gray-600 dark:text-gray-300'
            }`}
          >
            SALE
          </button>
          <button
            onClick={() => setMode('purchase')}
            className={`flex-1 py-4 rounded-xl font-bold text-lg transition ${
              mode === 'purchase' ? 'bg-blue-500 text-white' : 'bg-white dark:bg-[#3d3d3d] text-gray-600 dark:text-gray-300'
            }`}
          >
            PURCHASE
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {isScanning && !searchMode ? (
          <div className="flex flex-col h-full">
            <div id="qr-reader" className="flex-1"></div>
            <div className="p-4 space-y-2">
              <button
                onClick={() => {
                  setSearchMode(true);
                  setIsScanning(false);
                }}
                className="w-full py-4 bg-[#348ADC] text-white rounded-xl font-bold text-lg flex items-center justify-center gap-2"
              >
                <Search size={24} />
                Search Manually
              </button>
            </div>
          </div>
        ) : searchMode ? (
          <div className="p-4 flex flex-col h-full">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search by name or SKU..."
              className="w-full px-4 py-4 border-2 border-[#348ADC] rounded-xl text-lg mb-4"
              autoFocus
            />
            <div className="flex-1 overflow-auto space-y-2 mb-4">
              {searchResults.map((item) => (
                <button
                  key={item.inventory_item_id}
                  onClick={() => addToCart(item)}
                  className="w-full p-4 bg-gray-50 dark:bg-[#2d2d2d] rounded-xl text-left border-2 border-gray-200 dark:border-gray-700 hover:border-[#348ADC] transition active:scale-95"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="font-bold text-[#072741] dark:text-white">{item.name}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">SKU: {item.sku} | Stock: {item.quantity}</div>
                      <div className="text-sm font-semibold text-green-600">₹{item.selling_price}</div>
                    </div>
                    {cart.find(c => c.inventory_item_id === item.inventory_item_id) && (
                      <div className="ml-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                        {cart.find(c => c.inventory_item_id === item.inventory_item_id)?.cartQuantity}
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
            <button
              onClick={() => {
                setSearchMode(false);
                setIsScanning(true);
              }}
              className="w-full py-3 bg-gray-200 dark:bg-[#3d3d3d] text-gray-700 dark:text-gray-300 rounded-xl font-semibold"
            >
              Back to Scanner
            </button>
          </div>
        ) : null}
      </div>

      {/* Bottom Cart Bar */}
      {cart.length > 0 && !showBillPreview && (
        <div className="bg-gradient-to-r from-green-500 to-green-600 p-4 flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-3 text-white">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <ShoppingCart size={20} />
            </div>
            <div>
              <p className="text-xs opacity-90">{totalItems} items</p>
              <p className="text-xl font-bold">₹{totalAmount.toFixed(2)}</p>
            </div>
          </div>
          <button
            onClick={() => setShowBillPreview(true)}
            className="bg-white text-green-600 px-6 py-3 rounded-xl font-bold shadow-lg active:scale-95 transition"
          >
            Preview Bill
          </button>
        </div>
      )}
    </div>
  );
}
