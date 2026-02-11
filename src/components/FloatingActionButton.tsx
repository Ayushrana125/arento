import { useState, useEffect } from 'react';
import { SalePanel } from './SalePanel';
import { PurchasePanel } from './PurchasePanel';
import { StockAdjustmentPanel } from './StockAdjustmentPanel';

export function FloatingActionButton() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSalePanelOpen, setIsSalePanelOpen] = useState(false);
  const [isPurchasePanelOpen, setIsPurchasePanelOpen] = useState(false);
  const [isStockAdjustmentPanelOpen, setIsStockAdjustmentPanelOpen] = useState(false);
  const [isPulsing, setIsPulsing] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsPulsing(true);
      setTimeout(() => setIsPulsing(false), 2000);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsSalePanelOpen(false);
        setIsPurchasePanelOpen(false);
        setIsStockAdjustmentPanelOpen(false);
        return;
      }
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
        return;
      }
      if (e.key.toLowerCase() === 's') {
        e.preventDefault();
        setIsSalePanelOpen(true);
        setIsPurchasePanelOpen(false);
        setIsStockAdjustmentPanelOpen(false);
      }
      if (e.key.toLowerCase() === 'p') {
        e.preventDefault();
        setIsPurchasePanelOpen(true);
        setIsSalePanelOpen(false);
        setIsStockAdjustmentPanelOpen(false);
      }
      if (e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsStockAdjustmentPanelOpen(true);
        setIsSalePanelOpen(false);
        setIsPurchasePanelOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      {/* Dark Fade Background - Only on hover */}
      <div className={`fixed bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/50 to-transparent pointer-events-none z-40 transition-opacity duration-300 ${
        isExpanded ? 'opacity-100' : 'opacity-0'
      }`}></div>

      <div 
        className="fixed bottom-8 right-8 z-50 flex items-end gap-3"
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
      >
        {/* Action Buttons */}
        <div className={`flex items-center gap-2 transition-all duration-300 ${
          isExpanded ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4 pointer-events-none'
        }`}>
          <button
            onClick={() => {
              setIsSalePanelOpen(true);
              setIsPurchasePanelOpen(false);
              setIsStockAdjustmentPanelOpen(false);
            }}
            className="bg-white text-[#072741] px-5 py-3 rounded-xl shadow-xl hover:shadow-2xl hover:bg-gray-50 transition-all duration-200 text-sm font-semibold border-2 border-gray-200"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            Add <span className="underline">S</span>ale <span className="text-xs text-gray-500 ml-1">(S)</span>
          </button>

          <button
            onClick={() => {
              setIsPurchasePanelOpen(true);
              setIsSalePanelOpen(false);
              setIsStockAdjustmentPanelOpen(false);
            }}
            className="bg-white text-[#072741] px-5 py-3 rounded-xl shadow-xl hover:shadow-2xl hover:bg-gray-50 transition-all duration-200 text-sm font-semibold border-2 border-gray-200"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            Add <span className="underline">P</span>urchase <span className="text-xs text-gray-500 ml-1">(P)</span>
          </button>

          <button
            onClick={() => {
              setIsStockAdjustmentPanelOpen(true);
              setIsSalePanelOpen(false);
              setIsPurchasePanelOpen(false);
            }}
            className="bg-white text-[#072741] px-5 py-3 rounded-xl shadow-xl hover:shadow-2xl hover:bg-gray-50 transition-all duration-200 text-sm font-semibold border-2 border-gray-200"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            Stoc<span className="underline">k</span> Adjustment <span className="text-xs text-gray-500 ml-1">(K)</span>
          </button>
        </div>

        {/* Main FAB */}
        <button
          className={`w-16 h-16 bg-[#348ADC] text-white rounded-full shadow-2xl hover:shadow-3xl hover:scale-110 transition-all duration-200 flex items-center justify-center flex-shrink-0 ${
            isPulsing ? 'animate-scale' : ''
          }`}
        >
          <span className={`text-5xl font-light leading-none -mt-1 transition-all duration-300 inline-block ${
            isExpanded ? 'rotate-45 scale-110' : 'rotate-0 scale-100'
          }`}>
            +
          </span>
        </button>
      </div>

      <SalePanel isOpen={isSalePanelOpen} onClose={() => setIsSalePanelOpen(false)} />
      <PurchasePanel isOpen={isPurchasePanelOpen} onClose={() => setIsPurchasePanelOpen(false)} />
      <StockAdjustmentPanel isOpen={isStockAdjustmentPanelOpen} onClose={() => setIsStockAdjustmentPanelOpen(false)} />
    </>
  );
}
