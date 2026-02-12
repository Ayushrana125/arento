import { Download, Printer } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { useEffect } from 'react';

interface BillPreviewProps {
  invoiceNumber: string;
  items: Array<{
    sku: string;
    quantity: number;
    price: number;
    subtotal: number;
  }>;
  totalAmount: number;
  isVisible: boolean;
}

const mockInventory = [
  { sku: 'EO-530', name: 'Engine Oil 5W-30', price: 500 },
  { sku: 'BP-2024', name: 'Brake Pad Set', price: 600 },
  { sku: 'AF-332', name: 'Air Filter', price: 400 },
  { sku: 'SP-890', name: 'Spark Plug', price: 150 },
  { sku: 'WB-101', name: 'Wiper Blade', price: 200 },
  { sku: 'EOF-445', name: 'Engine Oil Filter', price: 350 },
];

export function BillPreview({ invoiceNumber, items, totalAmount, isVisible }: BillPreviewProps) {
  const user = JSON.parse(localStorage.getItem('arento_user') || '{}');
  const companyName = user.company || 'Shree Ram Auto Parts';

  const getItemName = (sku: string) => {
    return mockInventory.find(item => item.sku === sku)?.name || sku;
  };

  useEffect(() => {
    const handleBillAction = (e: CustomEvent) => {
      const { autoDownloadPdf, autoPrintBill } = e.detail;
      if (autoDownloadPdf) {
        handleDownloadPDF();
      }
      if (autoPrintBill) {
        handlePrint();
      }
    };

    window.addEventListener('triggerBillAction', handleBillAction as EventListener);
    return () => window.removeEventListener('triggerBillAction', handleBillAction as EventListener);
  }, [invoiceNumber, items, totalAmount]);

  const handleDownloadPDF = async () => {
    const printContent = document.getElementById('bill-content');
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
    const printContent = document.getElementById('bill-content');
    if (!printContent) return;
    
    const printWindow = window.open('', '', 'width=800,height=600');
    if (!printWindow) return;
    
    printWindow.document.write(`
      <html>
        <head>
          <title>Invoice ${invoiceNumber}</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { 
              font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
              background: #fffef8;
              padding: 40px;
            }
            .bill-container {
              max-width: 800px;
              margin: 0 auto;
              background: #fffef8;
              padding: 40px;
            }
            .header {
              display: flex;
              justify-content: space-between;
              align-items: start;
              margin-bottom: 40px;
              padding-bottom: 30px;
              border-bottom: 2px solid #e5e7eb;
            }
            .logo { height: 64px; margin-bottom: 12px; }
            .company-name {
              font-size: 24px;
              font-weight: bold;
              color: #072741;
              font-family: 'Poppins', sans-serif;
            }
            .invoice-info { text-align: right; }
            .invoice-label { font-size: 14px; color: #6b7280; margin-bottom: 4px; }
            .invoice-number {
              font-size: 20px;
              font-weight: bold;
              color: #348ADC;
              font-family: 'Poppins', sans-serif;
            }
            .invoice-date { font-size: 14px; color: #6b7280; margin-top: 8px; }
            .items-section { margin-bottom: 40px; }
            .items-title {
              font-size: 18px;
              font-weight: 600;
              color: #072741;
              margin-bottom: 16px;
              font-family: 'Poppins', sans-serif;
            }
            table { width: 100%; border-collapse: collapse; }
            thead tr { border-bottom: 2px solid #d1d5db; }
            th {
              padding: 12px 0;
              font-size: 14px;
              font-weight: 600;
              color: #374151;
              text-align: left;
            }
            th:nth-child(2) { text-align: center; }
            th:nth-child(3), th:nth-child(4) { text-align: right; }
            tbody tr { border-bottom: 1px solid #e5e7eb; }
            td { padding: 12px 0; font-size: 14px; }
            td:nth-child(2) { text-align: center; color: #374151; }
            td:nth-child(3), td:nth-child(4) { text-align: right; color: #374151; }
            .item-name { font-weight: 500; color: #072741; }
            .item-sku { font-size: 12px; color: #6b7280; }
            .amount { font-weight: 600; color: #072741; }
            .total-section {
              display: flex;
              justify-content: flex-end;
              margin-bottom: 40px;
            }
            .total-box {
              width: 320px;
              padding: 20px 0;
              border-top: 2px solid #d1d5db;
            }
            .total-box > div {
              display: flex;
              justify-content: space-between;
              align-items: center;
            }
            .total-label {
              font-size: 18px;
              font-weight: bold;
              color: #072741;
              font-family: 'Poppins', sans-serif;
            }
            .total-amount {
              font-size: 24px;
              font-weight: bold;
              color: #16a34a;
              font-family: 'Poppins', sans-serif;
            }
            .footer {
              text-align: center;
              padding-top: 30px;
              border-top: 1px solid #e5e7eb;
            }
            .thank-you {
              font-size: 14px;
              color: #6b7280;
              margin-bottom: 16px;
            }
            .branding {
              display: flex;
              align-items: center;
              justify-content: center;
              gap: 8px;
              font-size: 12px;
              color: #9ca3af;
            }
            .branding img { height: 16px; }
            .branding-text { font-weight: 600; }
            @media print {
              body { padding: 0; }
              .bill-container { padding: 20px; }
            }
          </style>
        </head>
        <body>
          ${printContent.innerHTML}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div className={`fixed md:top-0 md:left-0 bottom-0 left-0 right-0 md:h-full md:w-1/2 bg-[#f5f3ed] z-[55] transform transition-transform duration-300 ease-out overflow-y-auto print:static print:w-full ${
      isVisible ? 'md:translate-x-0 translate-y-0' : 'md:-translate-x-full translate-y-full'
    }`}>
      <div className="p-8">
        {/* Action Buttons */}
        <div className="flex gap-4 mb-6 max-w-3xl mx-auto print:hidden">
          <button
            onClick={handleDownloadPDF}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-[#348ADC] text-white rounded-lg hover:bg-[#2a6fb0] transition font-semibold shadow-lg"
          >
            <Download size={20} />
            Download PDF
          </button>
          <button
            onClick={handlePrint}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-[#072741] text-white rounded-lg hover:bg-[#0a3a5c] transition font-semibold shadow-lg"
          >
            <Printer size={20} />
            Print
          </button>
        </div>

        <div className="bg-[#fffef8] rounded-lg shadow-lg p-8 max-w-3xl mx-auto bill-container" id="bill-content">
          {/* Header */}
          <div className="flex items-start justify-between mb-8 pb-6 border-b-2 border-gray-200 header">
            <div>
              <img src="/client_logo.png" alt="Logo" className="h-16 mb-3 logo" />
              <h1 className="text-2xl font-bold text-[#072741] company-name" style={{ fontFamily: 'Poppins, sans-serif' }}>
                {companyName}
              </h1>
            </div>
            <div className="text-right invoice-info">
              <div className="text-sm text-gray-600 mb-1 invoice-label">Invoice Number</div>
              <div className="text-xl font-bold text-[#348ADC] invoice-number" style={{ fontFamily: 'Poppins, sans-serif' }}>
                {invoiceNumber}
              </div>
              <div className="text-sm text-gray-500 mt-2 invoice-date">
                {new Date().toLocaleDateString('en-IN', { 
                  day: '2-digit', 
                  month: 'short', 
                  year: 'numeric' 
                })}
              </div>
            </div>
          </div>

          {/* Items Table */}
          <div className="mb-8 items-section">
            <h2 className="text-lg font-semibold text-[#072741] mb-4 items-title" style={{ fontFamily: 'Poppins, sans-serif' }}>
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
                {items.filter(item => item.sku && item.quantity > 0).map((item, index) => (
                  <tr key={index} className="border-b border-gray-200">
                    <td className="py-3 text-sm">
                      <div className="font-medium text-[#072741] item-name">{getItemName(item.sku)}</div>
                      <div className="text-xs text-gray-500 item-sku">{item.sku}</div>
                    </td>
                    <td className="text-center py-3 text-sm text-gray-700">{item.quantity}</td>
                    <td className="text-right py-3 text-sm text-gray-700">₹{item.price.toFixed(2)}</td>
                    <td className="text-right py-3 text-sm font-semibold text-[#072741] amount">₹{item.subtotal.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Total */}
          <div className="flex justify-end mb-8 total-section">
            <div className="w-64 total-box">
              <div className="flex justify-between items-center py-4 border-t-2 border-gray-300">
                <span className="text-lg font-bold text-[#072741] total-label" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  Total Amount
                </span>
                <span className="text-2xl font-bold text-green-600 total-amount" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  ₹{totalAmount.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center pt-6 border-t border-gray-200 footer">
            <div className="text-sm text-gray-500 mb-4 thank-you">
              Thank you for your business!
            </div>
            <div className="flex items-center justify-center gap-2 text-xs text-gray-400 branding">
              <span>Bill generated from</span>
              <img src="/logo.png" alt="Arento" className="h-4" />
              <span className="font-semibold branding-text">Arento</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
