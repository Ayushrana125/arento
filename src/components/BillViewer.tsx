import { Download, Printer, X } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { useEffect } from 'react';

interface BillViewerProps {
  isOpen: boolean;
  onClose: () => void;
  invoiceNumber: string;
  items: Array<{ name: string; sku: string; quantity: number; price: number; subtotal: number }>;
  totalAmount: number;
  date: string;
  mobile?: string;
  vehicleNo?: string;
  msName?: string;
}

export function BillViewer({ isOpen, onClose, invoiceNumber, items, totalAmount, date, mobile, vehicleNo, msName }: BillViewerProps) {
  const user = JSON.parse(localStorage.getItem('arento_user') || '{}');
  const companyName = user.company || 'Shree Ram Auto Parts';

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  const handleDownloadPDF = async () => {
    const printContent = document.getElementById('bill-viewer-content');
    if (!printContent) return;
    
    const canvas = await html2canvas(printContent, {
      scale: 2,
      backgroundColor: '#fffef8',
      logging: false,
    });
    
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`${invoiceNumber}.pdf`);
  };

  const handlePrint = () => {
    const printContent = document.getElementById('bill-viewer-content');
    if (!printContent) return;
    
    const printWindow = window.open('', '', 'width=800,height=600');
    if (!printWindow) return;
    
    printWindow.document.write(`
      <html>
        <head>
          <title>Invoice ${invoiceNumber}</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: 'Inter', sans-serif; background: #fffef8; padding: 40px; }
            .bill-container { max-width: 800px; margin: 0 auto; background: #fffef8; padding: 40px; }
            .blessing { text-align: center; font-size: 16px; font-weight: 600; color: #072741; margin-bottom: 20px; }
            .header { display: flex; justify-content: space-between; margin-bottom: 40px; padding-bottom: 30px; border-bottom: 2px solid #e5e7eb; }
            .company-name { font-size: 24px; font-weight: bold; color: #072741; }
            .company-info { font-size: 12px; color: #6b7280; margin-top: 8px; line-height: 1.5; }
            .invoice-number { font-size: 20px; font-weight: bold; color: #348ADC; }
            table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            th { padding: 12px 0; font-size: 14px; font-weight: 600; color: #374151; text-align: left; border-bottom: 2px solid #d1d5db; }
            td { padding: 12px 0; font-size: 14px; border-bottom: 1px solid #e5e7eb; }
            .total-section { display: flex; justify-content: flex-end; margin: 20px 0; }
            .total-amount { font-size: 24px; font-weight: bold; color: #16a34a; }
            .footer { text-align: center; padding-top: 30px; border-top: 1px solid #e5e7eb; color: #6b7280; }
          </style>
        </head>
        <body>${printContent.innerHTML}</body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-black/50 z-[60]" onClick={onClose} />}
      <div className={`fixed top-0 right-0 h-full w-full md:w-1/2 bg-[#f5f3ed] z-[70] transform transition-transform duration-300 ease-out overflow-y-auto ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="p-8">
          {/* Header Actions */}
          <div className="flex items-center justify-between mb-6 max-w-3xl mx-auto">
            <button
              onClick={onClose}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition text-sm font-medium"
            >
              <X size={16} />
              Close
            </button>
            <div className="flex gap-3">
              <button
                onClick={handleDownloadPDF}
                className="flex items-center gap-2 px-4 py-2 bg-[#348ADC] text-white rounded-lg hover:bg-[#2a6fb0] transition font-semibold shadow-sm"
              >
                <Download size={18} />
                Download
              </button>
              <button
                onClick={handlePrint}
                className="flex items-center gap-2 px-4 py-2 bg-[#072741] text-white rounded-lg hover:bg-[#0a3a5c] transition font-semibold shadow-sm"
              >
                <Printer size={18} />
                Print
              </button>
            </div>
          </div>

          {/* Bill Content */}
          <div className="bg-[#fffef8] rounded-lg shadow-lg p-8 max-w-3xl mx-auto" id="bill-viewer-content">
            <div className="text-center text-base font-semibold text-[#072741] mb-6" style={{ fontFamily: 'Poppins, sans-serif' }}>
              || श्री गणेशाय नमः ||
            </div>

            <div className="flex items-start justify-between mb-8 pb-6 border-b-2 border-gray-200">
              <div>
                <img src="/client_logo.png" alt="Logo" className="h-16 mb-3" />
                <h1 className="text-2xl font-bold text-[#072741]" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  {companyName}
                </h1>
                <div className="text-xs text-gray-600 mt-2 max-w-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
                  <div>Mobile: 9324641323</div>
                  <div className="mt-1">Shop No. 3, Vishnu Niwas, Haridas Nagar, R.M. Bhattad Road,</div>
                  <div>Opp. Pulse Hospital, Borivali (W), Mumbai - 400092</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-600 mb-1">Invoice Number</div>
                <div className="text-xl font-bold text-[#348ADC]" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  {invoiceNumber}
                </div>
                <div className="text-sm text-gray-500 mt-2">
                  {new Date(date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                </div>
                {(mobile || vehicleNo || msName) && (
                  <div className="text-left mt-4 text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
                    {mobile && <div><span className="font-semibold">Mobile:</span> {mobile}</div>}
                    {vehicleNo && <div><span className="font-semibold">Vehicle No:</span> {vehicleNo}</div>}
                    {msName && <div><span className="font-semibold">M/S:</span> {msName}</div>}
                  </div>
                )}
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-lg font-semibold text-[#072741] mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
                Items
              </h2>
              <table className="w-full" style={{ fontFamily: 'Inter, sans-serif' }}>
                <thead>
                  <tr className="border-b-2 border-gray-300">
                    <th className="text-left py-3 text-sm font-semibold text-gray-700">Item</th>
                    <th className="text-center py-3 text-sm font-semibold text-gray-700">Qty</th>
                    <th className="text-right py-3 text-sm font-semibold text-gray-700">Price</th>
                    <th className="text-right py-3 text-sm font-semibold text-gray-700">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, index) => (
                    <tr key={index} className="border-b border-gray-200">
                      <td className="py-3 text-sm">
                        <div className="font-medium text-[#072741]">{item.name}</div>
                        <div className="text-xs text-gray-500">{item.sku}</div>
                      </td>
                      <td className="text-center py-3 text-sm text-gray-700">{item.quantity}</td>
                      <td className="text-right py-3 text-sm text-gray-700">₹{item.price.toFixed(2)}</td>
                      <td className="text-right py-3 text-sm font-semibold text-[#072741]">₹{item.subtotal.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end mb-8">
              <div className="w-64 py-4 border-t-2 border-gray-300">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-[#072741]" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    Total Amount
                  </span>
                  <span className="text-2xl font-bold text-green-600" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    ₹{totalAmount.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            <div className="text-center pt-6 border-t border-gray-200">
              <div className="text-sm text-gray-500 mb-4">Thank you for your business!</div>
              <div className="text-xs text-gray-400">Bill generated from Arento</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
