import { X, Download, Upload, FileSpreadsheet, CheckCircle2, AlertCircle, Info } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useNotification } from '../contexts/NotificationContext';

interface BulkUploadPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

interface AnalysisData {
  totalRows: number;
  validRows: number;
  invalidRows: number;
  duplicates: number;
  errors: string[];
}

export function BulkUploadPanel({ isOpen, onClose }: BulkUploadPanelProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { addNotification } = useNotification();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => setIsVisible(true), 10);
    } else {
      setIsVisible(false);
      setSelectedFile(null);
      setAnalysisData(null);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsVisible(false);
        setTimeout(() => onClose(), 300);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleDownloadTemplate = () => {
    const csvContent = 'SKU Code,Item Name,Category,Vendor Name,Current Quantity,Min Stock,Normal Stock,Cost Price,Selling Price\nBP-2024,Brake Pad Set,Brakes,Auto Parts Co.,50,10,30,150.00,250.00\nOF-2024,Oil Filter,Filters,Filter Supplies Inc.,100,20,50,25.00,45.00';
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'inventory_template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
    addNotification('Template Downloaded', 'CSV template has been downloaded successfully.');
  };

  const handleFileSelect = (file: File) => {
    if (!file.name.endsWith('.csv') && !file.name.endsWith('.xlsx')) {
      addNotification('Invalid File', 'Please upload a CSV or Excel file.');
      return;
    }
    setSelectedFile(file);
    analyzeFile(file);
  };

  const analyzeFile = (file: File) => {
    setIsAnalyzing(true);
    // Simulate file analysis
    setTimeout(() => {
      setAnalysisData({
        totalRows: 150,
        validRows: 142,
        invalidRows: 8,
        duplicates: 3,
        errors: [
          'Row 15: Missing SKU Code',
          'Row 23: Invalid price format',
          'Row 45: Category not found',
          'Row 67: Duplicate SKU Code',
          'Row 89: Missing Item Name',
          'Row 102: Invalid quantity',
          'Row 118: Duplicate SKU Code',
          'Row 134: Missing vendor name'
        ]
      });
      setIsAnalyzing(false);
    }, 1500);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  };

  const handleProcessImport = () => {
    if (!analysisData || analysisData.validRows === 0) return;
    
    addNotification('Import Started', `Processing ${analysisData.validRows} items...`);
    setTimeout(() => {
      addNotification('Import Completed', `${analysisData.validRows} items imported successfully!`);
      onClose();
    }, 2000);
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-50" onClick={onClose}></div>
      <div className={`fixed top-0 right-0 h-full w-full bg-white shadow-2xl z-[60] transform transition-transform duration-300 ease-out overflow-y-auto ${
        isVisible ? 'translate-x-0' : 'translate-x-full'
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
          <div>
            <h2 className="text-2xl font-semibold text-[#072741]" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Bulk Upload Items
            </h2>
            <p className="text-sm text-gray-500 mt-1" style={{ fontFamily: 'Inter, sans-serif' }}>
              Upload multiple inventory items at once using CSV or Excel
            </p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-[#072741] transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Main Content - Split Layout */}
        <div className="grid grid-cols-2 gap-6 p-6 h-[calc(100vh-120px)]">
          {/* Left Side - Instructions & Upload */}
          <div className="flex flex-col gap-6">
            {/* Instructions Card */}
            <div className="bg-gradient-to-br from-blue-50 to-white rounded-xl p-6 border-2 border-blue-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Info className="text-[#348ADC]" size={20} />
                </div>
                <h3 className="text-lg font-bold text-[#072741]" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  How to Upload
                </h3>
              </div>
              
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="w-6 h-6 bg-[#348ADC] text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">1</div>
                  <div>
                    <p className="text-sm font-semibold text-[#072741]">Download Template</p>
                    <p className="text-xs text-gray-600 mt-1">Get the CSV template with correct format and sample data</p>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <div className="w-6 h-6 bg-[#348ADC] text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">2</div>
                  <div>
                    <p className="text-sm font-semibold text-[#072741]">Fill Your Data</p>
                    <p className="text-xs text-gray-600 mt-1">Add your inventory items following the template structure</p>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <div className="w-6 h-6 bg-[#348ADC] text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">3</div>
                  <div>
                    <p className="text-sm font-semibold text-[#072741]">Upload & Review</p>
                    <p className="text-xs text-gray-600 mt-1">Upload your file and review the analysis before importing</p>
                  </div>
                </div>
              </div>

              <button
                onClick={handleDownloadTemplate}
                className="w-full mt-6 px-4 py-3 bg-white border-2 border-[#348ADC] text-[#348ADC] rounded-lg hover:bg-blue-50 transition font-semibold flex items-center justify-center gap-2"
              >
                <Download size={18} />
                Download CSV Template
              </button>
            </div>

            {/* Upload Area */}
            <div className="flex-1 bg-gradient-to-br from-purple-50 to-white rounded-xl p-6 border-2 border-purple-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <Upload className="text-purple-600" size={20} />
                </div>
                <h3 className="text-lg font-bold text-[#072741]" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  Upload File
                </h3>
              </div>

              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
                  isDragging 
                    ? 'border-[#348ADC] bg-blue-50' 
                    : 'border-gray-300 hover:border-[#348ADC] hover:bg-gray-50'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv,.xlsx"
                  onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
                  className="hidden"
                />
                
                <FileSpreadsheet className="mx-auto text-gray-400 mb-4" size={48} />
                
                {selectedFile ? (
                  <div className="space-y-2">
                    <p className="text-sm font-semibold text-[#072741]">{selectedFile.name}</p>
                    <p className="text-xs text-gray-500">{(selectedFile.size / 1024).toFixed(2)} KB</p>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="text-sm text-[#348ADC] hover:underline font-semibold"
                    >
                      Change File
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <p className="text-sm font-semibold text-[#072741]">Drag & drop your file here</p>
                    <p className="text-xs text-gray-500">or</p>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="px-6 py-2 bg-[#348ADC] text-white rounded-lg hover:bg-[#2a6fb0] transition font-semibold text-sm"
                    >
                      Browse Files
                    </button>
                    <p className="text-xs text-gray-400 mt-3">Supports CSV and Excel files</p>
                  </div>
                )}
              </div>

              {isAnalyzing && (
                <div className="mt-4 flex items-center justify-center gap-2 text-[#348ADC]">
                  <div className="w-4 h-4 border-2 border-[#348ADC] border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-sm font-semibold">Analyzing file...</span>
                </div>
              )}
            </div>
          </div>

          {/* Right Side - Analysis & Actions */}
          <div className="flex flex-col gap-6">
            {analysisData ? (
              <>
                {/* Summary Cards */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gradient-to-br from-green-50 to-white rounded-xl p-4 border-2 border-green-100">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle2 className="text-green-600" size={20} />
                      <p className="text-xs font-semibold text-gray-600">Valid Rows</p>
                    </div>
                    <p className="text-3xl font-bold text-green-600">{analysisData.validRows}</p>
                    <p className="text-xs text-gray-500 mt-1">Ready to import</p>
                  </div>

                  <div className="bg-gradient-to-br from-red-50 to-white rounded-xl p-4 border-2 border-red-100">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertCircle className="text-red-600" size={20} />
                      <p className="text-xs font-semibold text-gray-600">Invalid Rows</p>
                    </div>
                    <p className="text-3xl font-bold text-red-600">{analysisData.invalidRows}</p>
                    <p className="text-xs text-gray-500 mt-1">Need correction</p>
                  </div>
                </div>

                {/* Detailed Stats */}
                <div className="bg-gradient-to-br from-orange-50 to-white rounded-xl p-6 border-2 border-orange-100">
                  <h3 className="text-lg font-bold text-[#072741] mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    Analysis Summary
                  </h3>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Total Rows</span>
                      <span className="text-sm font-bold text-[#072741]">{analysisData.totalRows}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Valid Rows</span>
                      <span className="text-sm font-bold text-green-600">{analysisData.validRows}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Invalid Rows</span>
                      <span className="text-sm font-bold text-red-600">{analysisData.invalidRows}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Duplicates Found</span>
                      <span className="text-sm font-bold text-orange-600">{analysisData.duplicates}</span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-4">
                    <div className="flex justify-between text-xs text-gray-600 mb-1">
                      <span>Success Rate</span>
                      <span>{((analysisData.validRows / analysisData.totalRows) * 100).toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${(analysisData.validRows / analysisData.totalRows) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Errors List */}
                {analysisData.errors.length > 0 && (
                  <div className="flex-1 bg-gradient-to-br from-red-50 to-white rounded-xl p-6 border-2 border-red-100 overflow-hidden flex flex-col">
                    <h3 className="text-lg font-bold text-[#072741] mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
                      Errors Found ({analysisData.errors.length})
                    </h3>
                    
                    <div className="flex-1 overflow-y-auto space-y-2 pr-2">
                      {analysisData.errors.map((error, index) => (
                        <div key={index} className="flex gap-2 text-xs bg-white p-3 rounded-lg border border-red-200">
                          <AlertCircle className="text-red-500 flex-shrink-0" size={14} />
                          <span className="text-gray-700">{error}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Button */}
                <button
                  onClick={handleProcessImport}
                  disabled={analysisData.validRows === 0}
                  className={`w-full px-6 py-4 rounded-lg font-bold text-lg shadow-lg transition ${
                    analysisData.validRows > 0
                      ? 'bg-[#348ADC] text-white hover:bg-[#2a6fb0]'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {analysisData.validRows > 0 
                    ? `Import ${analysisData.validRows} Items` 
                    : 'No Valid Items to Import'}
                </button>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center text-gray-400">
                  <FileSpreadsheet size={64} className="mx-auto mb-4 opacity-50" />
                  <p className="text-sm font-semibold">No file uploaded yet</p>
                  <p className="text-xs mt-2">Upload a file to see analysis</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
