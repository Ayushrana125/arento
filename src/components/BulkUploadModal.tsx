import { X, Upload, Download } from 'lucide-react';
import { useState } from 'react';

interface BulkUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function BulkUploadModal({ isOpen, onClose }: BulkUploadModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleDownloadTemplate = () => {
    const headers = ['SKU Code', 'Item Name', 'Category', 'Current Quantity', 'Min Stock', 'Normal Stock', 'Cost Price', 'Selling Price', 'Vendor Name'];
    const csvContent = headers.join(',') + '\n';
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'inventory_template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (selectedFile) {
      console.log('Uploading file:', selectedFile.name);
      // Handle file upload logic here
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-50" onClick={onClose}></div>
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-white rounded-2xl shadow-2xl z-[60] p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-[#072741]" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Bulk Upload Items
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-[#072741] transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="space-y-6">
          {/* Download Template */}
          <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
            <p className="text-sm text-gray-700 mb-3" style={{ fontFamily: 'Inter, sans-serif' }}>
              Download the template file, fill in your inventory data, and upload it back.
            </p>
            <button
              onClick={handleDownloadTemplate}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white border-2 border-[#348ADC] text-[#348ADC] rounded-lg hover:bg-blue-50 transition font-semibold"
            >
              <Download size={18} />
              Download Template
            </button>
          </div>

          {/* File Upload */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3" style={{ fontFamily: 'Inter, sans-serif' }}>
              Upload Excel/CSV File
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-[#348ADC] transition">
              <input
                type="file"
                accept=".csv,.xlsx,.xls"
                onChange={handleFileChange}
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                <Upload size={48} className="mx-auto text-gray-400 mb-3" />
                <p className="text-sm text-gray-600 mb-1" style={{ fontFamily: 'Inter, sans-serif' }}>
                  {selectedFile ? selectedFile.name : 'Click to upload or drag and drop'}
                </p>
                <p className="text-xs text-gray-400" style={{ fontFamily: 'Inter, sans-serif' }}>
                  CSV, XLSX, or XLS files only
                </p>
              </label>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 border-2 border-gray-300 text-[#072741] rounded-lg hover:bg-gray-50 transition font-semibold"
            >
              Cancel
            </button>
            <button
              onClick={handleUpload}
              disabled={!selectedFile}
              className={`flex-1 px-6 py-3 rounded-lg transition font-semibold ${
                selectedFile
                  ? 'bg-[#348ADC] text-white hover:bg-[#2a6fb0]'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              Upload
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
