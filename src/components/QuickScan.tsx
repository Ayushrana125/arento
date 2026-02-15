import { useState, useEffect, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
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
  vendor_name: string;
}

export function QuickScan({ isOpen, onClose }: QuickScanProps) {
  const [mode, setMode] = useState<'sale' | 'purchase'>('sale');
  const [scannedItem, setScannedItem] = useState<ScannedItem | null>(null);
  const [itemQuantity, setItemQuantity] = useState(1);
  const [isScanning, setIsScanning] = useState(true);
  const [searchMode, setSearchMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<ScannedItem[]>([]);
  const [vendors, setVendors] = useState<string[]>([]);
  const [selectedVendor, setSelectedVendor] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const { addNotification } = useNotification();

  useEffect(() => {
    if (isOpen) {
      loadVendors();
      startScanner();
    } else {
      stopScanner();
    }
    return () => stopScanner();
  }, [isOpen]);

  const loadVendors = async () => {
    const userData = localStorage.getItem('arento_user');
    if (!userData) return;
    const { client_id } = JSON.parse(userData);

    const { data } = await supabase
      .from('inventory_items')
      .select('vendor_name')
      .eq('client_id', client_id)
      .not('vendor_name', 'is', null);

    if (data) {
      const uniqueVendors = [...new Set(data.map(item => item.vendor_name))];
      setVendors(uniqueVendors);
      if (uniqueVendors.length > 0) setSelectedVendor(uniqueVendors[0]);
    }
  };

  const startScanner = async () => {
    try {
      const scanner = new Html5Qrcode('qr-reader');
      scannerRef.current = scanner;

      await scanner.start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        onScanSuccess,
        () => {}
      );
    } catch (err) {
      console.error('Scanner error:', err);
    }
  };

  const stopScanner = async () => {
    if (scannerRef.current?.isScanning) {
      await scannerRef.current.stop();
    }
  };

  const onScanSuccess = async (decodedText: string) => {
    await fetchItemBySKU(decodedText);
  };

  const fetchItemBySKU = async (sku: string) => {
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
      setItemQuantity(1);
      navigator.vibrate?.(200);
    } else {
      addNotification('Item Not Found', `SKU ${sku} not found in inventory`);
    }
  };

  const handleSearch = async (term: string) => {
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
    setItemQuantity(1);
  };

  const handleConfirm = async () => {
    if (!scannedItem) return;
    setIsProcessing(true);

    const userData = localStorage.getItem('arento_user');
    if (!userData) return;
    const { client_id, user_id } = JSON.parse(userData);

    try {
      if (mode === 'sale') {
        const newQuantity = scannedItem.quantity - itemQuantity;
        if (newQuantity < 0) {
          addNotification('Insufficient Stock', `Only ${scannedItem.quantity} units available`);
          setIsProcessing(false);
          return;
        }

        await supabase
          .from('inventory_items')
          .update({ quantity: newQuantity })
          .eq('inventory_item_id', scannedItem.inventory_item_id);

        addNotification('Sale Recorded', `${itemQuantity}x ${scannedItem.name} sold`);
      } else {
        const newQuantity = scannedItem.quantity + itemQuantity;

        await supabase
          .from('inventory_items')
          .update({ quantity: newQuantity })
          .eq('inventory_item_id', scannedItem.inventory_item_id);

        addNotification('Purchase Recorded', `${itemQuantity}x ${scannedItem.name} added`);
      }

      window.dispatchEvent(new Event('inventoryUpdated'));
      resetScan();
    } catch (error) {
      addNotification('Error', 'Failed to process transaction');
    } finally {
      setIsProcessing(false);
    }
  };

  const resetScan = () => {
    setScannedItem(null);
    setItemQuantity(1);
    setIsScanning(true);
    setSearchMode(false);
    setSearchTerm('');
    setSearchResults([]);
    startScanner();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[#072741] z-[100] flex flex-col">
      {/* Header */}
      <div className="bg-white p-4 flex items-center justify-between shadow-lg">
        <h2 className="text-xl font-bold text-[#072741]" style={{ fontFamily: 'Poppins, sans-serif' }}>
          Quick Scan
        </h2>
        <button onClick={onClose} className="text-gray-600 hover:text-[#072741]">
          <X size={28} />
        </button>
      </div>

      {/* Mode Toggle */}
      <div className="bg-white px-4 pb-4 shadow-md">
        <div className="flex gap-2">
          <button
            onClick={() => setMode('sale')}
            className={`flex-1 py-3 rounded-lg font-bold text-lg transition ${
              mode === 'sale'
                ? 'bg-green-500 text-white'
                : 'bg-gray-200 text-gray-600'
            }`}
          >
            SALE
          </button>
          <button
            onClick={() => setMode('purchase')}
            className={`flex-1 py-3 rounded-lg font-bold text-lg transition ${
              mode === 'purchase'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-600'
            }`}
          >
            PURCHASE
          </button>
        </div>
      </div>

      {/* Scanner or Item Details */}
      <div className="flex-1 overflow-auto">
        {isScanning && !searchMode ? (
          <div className="flex flex-col h-full">
            <div id="qr-reader" className="flex-1"></div>
            <div className="p-4 bg-white">
              <button
                onClick={() => {
                  setSearchMode(true);
                  setIsScanning(false);
                  stopScanner();
                }}
                className="w-full py-4 bg-[#348ADC] text-white rounded-lg font-bold text-lg flex items-center justify-center gap-2"
              >
                <Search size={24} />
                Search Manually
              </button>
            </div>
          </div>
        ) : searchMode ? (
          <div className="p-4 bg-white h-full">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search by name or SKU..."
              className="w-full px-4 py-4 border-2 border-[#348ADC] rounded-lg text-lg mb-4"
              autoFocus
            />
            <div className="space-y-2">
              {searchResults.map((item) => (
                <button
                  key={item.inventory_item_id}
                  onClick={() => selectItem(item)}
                  className="w-full p-4 bg-gray-50 rounded-lg text-left border-2 border-gray-200 hover:border-[#348ADC] transition"
                >
                  <div className="font-bold text-[#072741]">{item.name}</div>
                  <div className="text-sm text-gray-600">SKU: {item.sku} | Stock: {item.quantity}</div>
                  <div className="text-sm font-semibold text-green-600">₹{item.selling_price}</div>
                </button>
              ))}
            </div>
            <button
              onClick={resetScan}
              className="w-full mt-4 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold"
            >
              Back to Scanner
            </button>
          </div>
        ) : scannedItem ? (
          <div className="p-6 bg-white h-full flex flex-col">
            <div className="flex-1">
              <div className="bg-blue-50 rounded-xl p-6 mb-6">
                <h3 className="text-2xl font-bold text-[#072741] mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  {scannedItem.name}
                </h3>
                <p className="text-gray-600 font-mono text-lg">SKU: {scannedItem.sku}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-green-50 rounded-lg p-4">
                  <div className="text-sm text-gray-600 mb-1">Current Stock</div>
                  <div className="text-3xl font-bold text-green-600">{scannedItem.quantity}</div>
                </div>
                <div className="bg-orange-50 rounded-lg p-4">
                  <div className="text-sm text-gray-600 mb-1">Price</div>
                  <div className="text-3xl font-bold text-orange-600">₹{mode === 'sale' ? scannedItem.selling_price : scannedItem.cost_price}</div>
                </div>
              </div>

              {mode === 'purchase' && (
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Vendor</label>
                  <select
                    value={selectedVendor}
                    onChange={(e) => setSelectedVendor(e.target.value)}
                    className="w-full px-4 py-4 border-2 border-[#348ADC] rounded-lg text-lg"
                  >
                    {vendors.map(vendor => (
                      <option key={vendor} value={vendor}>{vendor}</option>
                    ))}
                  </select>
                </div>
              )}

              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Quantity</label>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setItemQuantity(Math.max(1, itemQuantity - 1))}
                    className="w-16 h-16 bg-red-500 text-white rounded-xl font-bold text-2xl flex items-center justify-center"
                  >
                    <Minus size={32} />
                  </button>
                  <div className="flex-1 text-center">
                    <div className="text-5xl font-bold text-[#072741]">{itemQuantity}</div>
                  </div>
                  <button
                    onClick={() => setItemQuantity(itemQuantity + 1)}
                    className="w-16 h-16 bg-green-500 text-white rounded-xl font-bold text-2xl flex items-center justify-center"
                  >
                    <Plus size={32} />
                  </button>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-gray-700">Total Amount</span>
                  <span className="text-3xl font-bold text-[#348ADC]">
                    ₹{(itemQuantity * (mode === 'sale' ? scannedItem.selling_price : scannedItem.cost_price)).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleConfirm}
                disabled={isProcessing}
                className={`w-full py-5 rounded-xl font-bold text-xl flex items-center justify-center gap-3 ${
                  mode === 'sale'
                    ? 'bg-green-500 hover:bg-green-600 text-white'
                    : 'bg-blue-500 hover:bg-blue-600 text-white'
                } disabled:opacity-50`}
              >
                <Check size={28} />
                {isProcessing ? 'Processing...' : `CONFIRM ${mode.toUpperCase()}`}
              </button>
              <button
                onClick={resetScan}
                className="w-full py-4 bg-gray-200 text-gray-700 rounded-xl font-semibold text-lg"
              >
                Scan Next Item
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
