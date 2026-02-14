import { X, AlertCircle, TrendingUp, CheckCircle, BookOpen, Square, Palette, BarChart3, ArrowUpDown } from 'lucide-react';

interface InventoryCardGuideProps {
  onClose: () => void;
}

export function InventoryCardGuide({ onClose }: InventoryCardGuideProps) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-20">
          <h2 className="text-xl font-bold text-[#072741]" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Understanding Inventory Cards
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition">
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <div className="p-6 space-y-8">
          {/* Introduction */}
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-5">
            <h3 className="text-base font-bold text-[#072741] mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Quick Overview
            </h3>
            <p className="text-sm text-gray-700 leading-relaxed" style={{ fontFamily: 'Inter, sans-serif' }}>
              Inventory cards provide instant visual feedback on stock levels. Colors and status badges help you quickly identify which items need attention without reading detailed numbers.
            </p>
          </div>

          {/* Card Status Explanation */}
          <div>
            <h3 className="text-lg font-bold text-[#072741] mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Card Status Levels
            </h3>
            
            <div className="space-y-4">
              {/* Critical Example */}
              <div className="border border-red-300 rounded-xl p-4 bg-red-50/50">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-36 h-44 bg-red-100 border-2 border-red-400 rounded-xl p-3 relative shadow-sm z-0">
                    <div className="absolute top-2 right-2 bg-red-100 text-red-700 px-2 py-0.5 rounded-full text-xs font-bold">Critical</div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                      <div className="text-3xl font-bold text-red-600">15</div>
                    </div>
                    <div className="absolute bottom-8 left-3 right-3">
                      <div className="w-full bg-white/50 rounded-full h-1.5 overflow-hidden">
                        <div className="h-full bg-red-500 rounded-full" style={{ width: '15%' }}></div>
                      </div>
                    </div>
                    <div className="absolute bottom-2 left-0 right-0 px-3">
                      <div className="flex justify-between text-xs">
                        <div><div className="text-gray-500 text-[10px]">Min</div><div className="font-bold text-xs">20</div></div>
                        <div><div className="text-gray-500 text-[10px]">Normal</div><div className="font-bold text-xs">100</div></div>
                      </div>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-red-700 text-base mb-2 flex items-center gap-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                      <AlertCircle className="w-4 h-4" />
                      Critical - Order Now
                    </h4>
                    <p className="text-gray-700 text-sm mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                      Stock is at or below minimum safe level.
                    </p>
                    <div className="bg-white rounded-lg p-3 text-xs border border-red-200" style={{ fontFamily: 'Inter, sans-serif' }}>
                      <strong>Example:</strong> Engine Oil<br/>
                      Current: <strong>15 units</strong> | Min: <strong>20 units</strong><br/>
                      Ratio: 15 ÷ 20 = <strong>0.75</strong> (below 1.0)<br/>
                      <span className="text-red-600 font-semibold mt-1 block">Action: Order immediately</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Low Example */}
              <div className="border border-yellow-300 rounded-xl p-4 bg-yellow-50/50">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-36 h-44 bg-yellow-100 border-2 border-yellow-400 rounded-xl p-3 relative shadow-sm z-0">
                    <div className="absolute top-2 right-2 bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full text-xs font-bold">Low</div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                      <div className="text-3xl font-bold text-yellow-600">25</div>
                    </div>
                    <div className="absolute bottom-8 left-3 right-3">
                      <div className="w-full bg-white/50 rounded-full h-1.5 overflow-hidden">
                        <div className="h-full bg-yellow-400 rounded-full" style={{ width: '25%' }}></div>
                      </div>
                    </div>
                    <div className="absolute bottom-2 left-0 right-0 px-3">
                      <div className="flex justify-between text-xs">
                        <div><div className="text-gray-500 text-[10px]">Min</div><div className="font-bold text-xs">20</div></div>
                        <div><div className="text-gray-500 text-[10px]">Normal</div><div className="font-bold text-xs">100</div></div>
                      </div>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-yellow-700 text-base mb-2 flex items-center gap-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                      <TrendingUp className="w-4 h-4" />
                      Low - Plan to Reorder
                    </h4>
                    <p className="text-gray-700 text-sm mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                      Stock is above minimum but still low.
                    </p>
                    <div className="bg-white rounded-lg p-3 text-xs border border-yellow-200" style={{ fontFamily: 'Inter, sans-serif' }}>
                      <strong>Example:</strong> Brake Pads<br/>
                      Current: <strong>25 units</strong> | Min: <strong>20 units</strong><br/>
                      Ratio: 25 ÷ 20 = <strong>1.25</strong> (between 1.0 and 1.5)<br/>
                      <span className="text-yellow-600 font-semibold mt-1 block">Action: Add to next order</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Healthy Example */}
              <div className="border border-green-300 rounded-xl p-4 bg-green-50/50">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-36 h-44 bg-green-100 border-2 border-gray-200 rounded-xl p-3 relative shadow-sm z-0">
                    <div className="absolute top-2 right-2 bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs font-bold">Healthy</div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                      <div className="text-3xl font-bold text-[#348ADC]">85</div>
                    </div>
                    <div className="absolute bottom-8 left-3 right-3">
                      <div className="w-full bg-white/50 rounded-full h-1.5 overflow-hidden">
                        <div className="h-full bg-green-500 rounded-full" style={{ width: '85%' }}></div>
                      </div>
                    </div>
                    <div className="absolute bottom-2 left-0 right-0 px-3">
                      <div className="flex justify-between text-xs">
                        <div><div className="text-gray-500 text-[10px]">Min</div><div className="font-bold text-xs">20</div></div>
                        <div><div className="text-gray-500 text-[10px]">Normal</div><div className="font-bold text-xs">100</div></div>
                      </div>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-green-700 text-base mb-2 flex items-center gap-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                      <CheckCircle className="w-4 h-4" />
                      Healthy - All Good
                    </h4>
                    <p className="text-gray-700 text-sm mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                      Plenty of stock available.
                    </p>
                    <div className="bg-white rounded-lg p-3 text-xs border border-green-200" style={{ fontFamily: 'Inter, sans-serif' }}>
                      <strong>Example:</strong> Air Filters<br/>
                      Current: <strong>85 units</strong> | Min: <strong>20 units</strong><br/>
                      Ratio: 85 ÷ 20 = <strong>4.25</strong> (above 1.5)<br/>
                      <span className="text-green-600 font-semibold mt-1 block">Action: No action needed</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Visual Elements Explanation */}
          <div>
            <h3 className="text-lg font-bold text-[#072741] mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Card Visual Elements
            </h3>
            
            {/* Border Colors */}
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 mb-4">
              <div className="flex items-center gap-2 mb-3">
                <Square className="w-4 h-4 text-[#348ADC]" />
                <h4 className="font-bold text-[#072741] text-sm" style={{ fontFamily: 'Poppins, sans-serif' }}>Card Border</h4>
              </div>
              <p className="text-gray-700 text-xs mb-3" style={{ fontFamily: 'Inter, sans-serif' }}>
                Border color indicates urgency based on Minimum Stock:
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-16 h-12 border-2 border-red-400 rounded bg-white"></div>
                  <div className="text-xs" style={{ fontFamily: 'Inter, sans-serif' }}>
                    <strong className="text-red-600">Red Border:</strong> Critical (≤ Min Stock)
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-16 h-12 border-2 border-yellow-400 rounded bg-white"></div>
                  <div className="text-xs" style={{ fontFamily: 'Inter, sans-serif' }}>
                    <strong className="text-yellow-600">Yellow Border:</strong> Low (1-1.5x Min Stock)
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-16 h-12 border-2 border-gray-200 rounded bg-white"></div>
                  <div className="text-xs" style={{ fontFamily: 'Inter, sans-serif' }}>
                    <strong className="text-gray-600">Gray Border:</strong> Healthy (&gt;1.5x Min Stock)
                  </div>
                </div>
              </div>
            </div>

            {/* Background Colors */}
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 mb-4">
              <div className="flex items-center gap-2 mb-3">
                <Palette className="w-4 h-4 text-[#348ADC]" />
                <h4 className="font-bold text-[#072741] text-sm" style={{ fontFamily: 'Poppins, sans-serif' }}>Background Color</h4>
              </div>
              <p className="text-gray-700 text-xs mb-3" style={{ fontFamily: 'Inter, sans-serif' }}>
                Background shows progress toward Normal Stock level:
              </p>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-red-100 border border-red-300 rounded"></div>
                  <div className="text-xs" style={{ fontFamily: 'Inter, sans-serif' }}>
                    <strong>Red</strong><br/>0-30%
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-orange-100 border border-orange-300 rounded"></div>
                  <div className="text-xs" style={{ fontFamily: 'Inter, sans-serif' }}>
                    <strong>Orange</strong><br/>30-40%
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-yellow-100 border border-yellow-300 rounded"></div>
                  <div className="text-xs" style={{ fontFamily: 'Inter, sans-serif' }}>
                    <strong>Yellow</strong><br/>40-60%
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-lime-100 border border-lime-300 rounded"></div>
                  <div className="text-xs" style={{ fontFamily: 'Inter, sans-serif' }}>
                    <strong>Lime</strong><br/>60-80%
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-green-100 border border-green-300 rounded"></div>
                  <div className="text-xs" style={{ fontFamily: 'Inter, sans-serif' }}>
                    <strong>Green</strong><br/>80-100%
                  </div>
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <BarChart3 className="w-4 h-4 text-[#348ADC]" />
                <h4 className="font-bold text-[#072741] text-sm" style={{ fontFamily: 'Poppins, sans-serif' }}>Progress Bar</h4>
              </div>
              <p className="text-gray-700 text-xs mb-3" style={{ fontFamily: 'Inter, sans-serif' }}>
                Visual indicator of stock level relative to Normal Stock:
              </p>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs mb-1" style={{ fontFamily: 'Inter, sans-serif' }}>
                    <span>15 / 100 units (15%)</span>
                    <span className="text-red-600 font-semibold">Critical</span>
                  </div>
                  <div className="w-full bg-white/50 rounded-full h-2 overflow-hidden border border-gray-200">
                    <div className="h-full bg-red-500 rounded-full" style={{ width: '15%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1" style={{ fontFamily: 'Inter, sans-serif' }}>
                    <span>45 / 100 units (45%)</span>
                    <span className="text-yellow-600 font-semibold">Low</span>
                  </div>
                  <div className="w-full bg-white/50 rounded-full h-2 overflow-hidden border border-gray-200">
                    <div className="h-full bg-yellow-400 rounded-full" style={{ width: '45%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1" style={{ fontFamily: 'Inter, sans-serif' }}>
                    <span>85 / 100 units (85%)</span>
                    <span className="text-green-600 font-semibold">Healthy</span>
                  </div>
                  <div className="w-full bg-white/50 rounded-full h-2 overflow-hidden border border-gray-200">
                    <div className="h-full bg-green-500 rounded-full" style={{ width: '85%' }}></div>
                  </div>
                </div>
              </div>
              <p className="text-gray-600 text-xs mt-3 italic" style={{ fontFamily: 'Inter, sans-serif' }}>
                Formula: (Current Stock ÷ Normal Stock) × 100
              </p>
            </div>
          </div>

          {/* Quick Tips */}
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-5">
            <h3 className="text-lg font-bold text-[#072741] mb-3" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Best Practices
            </h3>
            <ul className="space-y-2 text-sm text-gray-700" style={{ fontFamily: 'Inter, sans-serif' }}>
              <li className="flex items-start gap-2">
                <span className="text-[#348ADC] font-bold">1.</span>
                <span>Check Critical items daily - immediate ordering required</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#348ADC] font-bold">2.</span>
                <span>Review Low items weekly - plan bulk orders</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#348ADC] font-bold">3.</span>
                <span>Set realistic minimum levels based on average daily sales</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#348ADC] font-bold">4.</span>
                <span>Use sort toggle to switch between Critical and Healthy views</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#348ADC] font-bold">5.</span>
                <span>Hover over cards for detailed information</span>
              </li>
            </ul>
          </div>

          {/* Sort Functionality */}
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <ArrowUpDown className="w-4 h-4 text-[#348ADC]" />
              <h3 className="text-lg font-bold text-[#072741]" style={{ fontFamily: 'Poppins, sans-serif' }}>
                Sort Functionality
              </h3>
            </div>
            <div className="space-y-3">
              <div className="bg-white border border-blue-200 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-2">
                  <div className="bg-white border border-gray-300 rounded px-2 py-1 text-xs font-medium text-gray-600">
                    ↑ Most Critical
                  </div>
                  <span className="text-xs text-gray-500">(Default)</span>
                </div>
                <p className="text-xs text-gray-700 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Shows items with lowest stock ratio first. Items closest to or below minimum stock appear at the top.
                </p>
                <div className="bg-gray-50 rounded p-2 text-xs" style={{ fontFamily: 'Inter, sans-serif' }}>
                  <strong>Example Order:</strong><br/>
                  1. Engine Oil (15/20 = 0.75) - Critical<br/>
                  2. Brake Pads (25/20 = 1.25) - Low<br/>
                  3. Air Filters (85/20 = 4.25) - Healthy
                </div>
              </div>
              <div className="bg-white border border-green-200 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-2">
                  <div className="bg-white border border-gray-300 rounded px-2 py-1 text-xs font-medium text-gray-600">
                    ↓ Healthiest
                  </div>
                </div>
                <p className="text-xs text-gray-700 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Shows items with highest stock ratio first. Items with most stock relative to minimum appear at the top.
                </p>
                <div className="bg-gray-50 rounded p-2 text-xs" style={{ fontFamily: 'Inter, sans-serif' }}>
                  <strong>Example Order:</strong><br/>
                  1. Air Filters (85/20 = 4.25) - Healthy<br/>
                  2. Brake Pads (25/20 = 1.25) - Low<br/>
                  3. Engine Oil (15/20 = 0.75) - Critical
                </div>
              </div>
              <p className="text-xs text-gray-600 italic" style={{ fontFamily: 'Inter, sans-serif' }}>
                Formula: Current Stock ÷ Minimum Stock = Ratio<br/>
                Lower ratio = More critical | Higher ratio = More healthy
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
