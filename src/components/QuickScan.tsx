import { useState, useEffect, useRef, useCallback } from 'react';
import { X, Search, Minus, Plus, Check } from 'lucide-react';
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

export function QuickScan({ isOpen, onClose }: QuickScanProps) {
  const [mode, setMode] = useState<'sale' | 'purchase'>('sale');
  const [scannedItem, setScannedItem] = useState<ScannedItem | null>(null);
  const [itemQuantity, setItemQuantity] = useState(1);
  const [isScanning, setIsScanning] = useState(true);
  const [searchMode, setSearchMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<ScannedItem[]>([]);
  const scannerRef = useRef<any>(null);
  const { addNotification } = useNotification();

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
      setScannedItem(data);
      setIsScanning(false);
      if (navigator.vibrate) navigator.vibrate(200);
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
    if (isOpen && isScanning && !searchMode) {
      startScanner();
    } else {
      stopScanner();
    }
    return () => { stopScanner(); };
  }, [isOpen, isScanning, searchMode, startScanner, stopScanner]);

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

  const selectItem = (item: ScannedItem) => {
    setScannedItem(item);
    setIsScanning(false);
    setSearchMode(false);
  };

  const handleConfirm = async () => {
    if (!supabase || !scannedItem) return;

    const userData = localStorage.getItem('arento_user');
    if (!userData) return;
    const { client_id } = JSON.parse(userData);

    const newQuantity = mode === 'sale' 
      ? scannedItem.quantity - itemQuantity 
      : scannedItem.quantity + itemQuantity;

    if (mode === 'sale' && newQuantity < 0) {
      addNotification('Insufficient Stock', `Only ${scannedItem.quantity} units available`);
      return;
    }

    await supabase
      .from('inventory_items')
      .update({ quantity: newQuantity })
      .eq('inventory_item_id', scannedItem.inventory_item_id);

    addNotification(
      mode === 'sale' ? 'Sale Recorded' : 'Purchase Recorded',
      `${itemQuantity}x ${scannedItem.name}`
    );

    window.dispatchEvent(new Event('inventoryUpdated'));
    resetScan();
  };

  const resetScan = () => {
    setScannedItem(null);
    setItemQuantity(1);
    setIsScanning(true);
    setSearchMode(false);
    setSearchTerm('');
    setSearchResults([]);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-white dark:bg-[#1a1a1a] z-[100] flex flex-col">
      {/* Header */}
      <div className="bg-[#072741] dark:bg-[#1e3a52] p-4 flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">Quick Scan</h2>
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
        {isScanning && !searchMode && !scannedItem ? (
          <div className="flex flex-col h-full">
            <div id="qr-reader" className="flex-1"></div>
            <div className="p-4">
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
          <div className="p-4">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search by name or SKU..."
              className="w-full px-4 py-4 border-2 border-[#348ADC] rounded-xl text-lg mb-4"
              autoFocus
            />
            <div className="space-y-2">
              {searchResults.map((item) => (
                <button
                  key={item.inventory_item_id}
                  onClick={() => selectItem(item)}
                  className="w-full p-4 bg-gray-50 dark:bg-[#2d2d2d] rounded-xl text-left border-2 border-gray-200 dark:border-gray-700 hover:border-[#348ADC] transition"
                >
                  <div className="font-bold text-[#072741] dark:text-white">{item.name}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">SKU: {item.sku} | Stock: {item.quantity}</div>
                  <div className="text-sm font-semibold text-green-600">₹{item.selling_price}</div>
                </button>
              ))}
            </div>
            <button 
              onClick={resetScan} 
              className="w-full mt-4 py-3 bg-gray-200 dark:bg-[#3d3d3d] text-gray-700 dark:text-gray-300 rounded-xl font-semibold"
            >
              Back to Scanner
            </button>
          </div>
        ) : scannedItem ? (
          <div className="p-6 flex flex-col h-full">
            <div className="flex-1">
              <div className="bg-gray-50 dark:bg-[#2d2d2d] p-6 rounded-2xl mb-6">
                <h3 className="text-2xl font-bold text-[#072741] dark:text-white mb-2">{scannedItem.name}</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-1">SKU: {scannedItem.sku}</p>
                <p className="text-gray-600 dark:text-gray-400 mb-1">Current Stock: {scannedItem.quantity}</p>
                <p className="text-2xl font-bold text-green-600 mt-3">₹{scannedItem.selling_price}</p>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Quantity</label>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setItemQuantity(Math.max(1, itemQuantity - 1))}
                    className="w-16 h-16 bg-gray-200 dark:bg-[#3d3d3d] rounded-xl flex items-center justify-center"
                  >
                    <Minus size={24} />
                  </button>
                  <input
                    type="number"
                    value={itemQuantity}
                    onChange={(e) => setItemQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="flex-1 text-center text-3xl font-bold py-4 border-2 border-gray-300 dark:border-gray-600 rounded-xl"
                  />
                  <button
                    onClick={() => setItemQuantity(itemQuantity + 1)}
                    className="w-16 h-16 bg-gray-200 dark:bg-[#3d3d3d] rounded-xl flex items-center justify-center"
                  >
                    <Plus size={24} />
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleConfirm}
                className={`w-full py-5 rounded-xl font-bold text-xl text-white flex items-center justify-center gap-2 ${
                  mode === 'sale' ? 'bg-green-500' : 'bg-blue-500'
                }`}
              >
                <Check size={24} />
                Confirm {mode === 'sale' ? 'Sale' : 'Purchase'}
              </button>
              <button
                onClick={resetScan}
                className="w-full py-4 bg-gray-200 dark:bg-[#3d3d3d] text-gray-700 dark:text-gray-300 rounded-xl font-semibold"
              >
                Scan Another Item
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
