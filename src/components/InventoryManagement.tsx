import { useState } from 'react';
import { Plus, Upload } from 'lucide-react';
import { BulkUploadModal } from './BulkUploadModal';

type ViewMode = 'card' | 'table';

interface InventoryItem {
  sku_code: string;
  item_name: string;
  category: string;
  current_quantity: number;
  min_stock: number;
  normal_stock: number;
  cost_price: number;
  selling_price: number;
  vendor_name: string;
  created_at: string;
  updated_at: string;
}

export function InventoryManagement() {
  const [viewMode, setViewMode] = useState<ViewMode>('table');
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [isBulkUploadModalOpen, setIsBulkUploadModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 25;

  const handleAddItemClick = () => {
    const event = new KeyboardEvent('keydown', { key: 'N' });
    window.dispatchEvent(event);
  };

  const inventoryData: InventoryItem[] = [
    { sku_code: 'BP-2024', item_name: 'Brake Pad Set', category: 'Brakes', current_quantity: 45, min_stock: 10, normal_stock: 50, cost_price: 450, selling_price: 600, vendor_name: 'Auto Parts Co.', created_at: '2024-01-15', updated_at: '2024-01-20' },
    { sku_code: 'EO-530', item_name: 'Engine Oil 5W-30', category: 'Fluids', current_quantity: 120, min_stock: 20, normal_stock: 80, cost_price: 350, selling_price: 500, vendor_name: 'Oil Suppliers Ltd.', created_at: '2024-01-10', updated_at: '2024-01-18' },
    { sku_code: 'AF-332', item_name: 'Air Filter', category: 'Filters', current_quantity: 32, min_stock: 15, normal_stock: 50, cost_price: 280, selling_price: 400, vendor_name: 'Filter World', created_at: '2024-01-12', updated_at: '2024-01-19' },
    { sku_code: 'SP-890', item_name: 'Spark Plug', category: 'Ignition', current_quantity: 65, min_stock: 20, normal_stock: 80, cost_price: 120, selling_price: 150, vendor_name: 'Spark Co.', created_at: '2024-01-14', updated_at: '2024-01-21' },
    { sku_code: 'WB-101', item_name: 'Wiper Blade', category: 'Accessories', current_quantity: 28, min_stock: 25, normal_stock: 100, cost_price: 150, selling_price: 200, vendor_name: 'Wiper World', created_at: '2024-01-16', updated_at: '2024-01-22' },
    { sku_code: 'BAT-12V', item_name: 'Battery 12V', category: 'Electrical', current_quantity: 15, min_stock: 5, normal_stock: 20, cost_price: 3500, selling_price: 4500, vendor_name: 'Battery Plus', created_at: '2024-01-11', updated_at: '2024-01-17' },
    { sku_code: 'HB-H7', item_name: 'Headlight Bulb H7', category: 'Lighting', current_quantity: 42, min_stock: 30, normal_stock: 100, cost_price: 80, selling_price: 120, vendor_name: 'Light House', created_at: '2024-01-13', updated_at: '2024-01-19' },
    { sku_code: 'TF-ATF', item_name: 'Transmission Fluid', category: 'Fluids', current_quantity: 55, min_stock: 10, normal_stock: 40, cost_price: 420, selling_price: 580, vendor_name: 'Oil Suppliers Ltd.', created_at: '2024-01-15', updated_at: '2024-01-20' },
    { sku_code: 'CF-220', item_name: 'Cabin Filter', category: 'Filters', current_quantity: 38, min_stock: 20, normal_stock: 80, cost_price: 250, selling_price: 350, vendor_name: 'Filter World', created_at: '2024-01-12', updated_at: '2024-01-18' },
    { sku_code: 'TB-998', item_name: 'Timing Belt', category: 'Engine', current_quantity: 22, min_stock: 8, normal_stock: 30, cost_price: 850, selling_price: 1200, vendor_name: 'Engine Parts Ltd.', created_at: '2024-01-14', updated_at: '2024-01-21' },
    { sku_code: 'BF-DOT4', item_name: 'Brake Fluid DOT4', category: 'Fluids', current_quantity: 48, min_stock: 12, normal_stock: 40, cost_price: 180, selling_price: 250, vendor_name: 'Oil Suppliers Ltd.', created_at: '2024-01-16', updated_at: '2024-01-22' },
    { sku_code: 'PSF-100', item_name: 'Power Steering Fluid', category: 'Fluids', current_quantity: 35, min_stock: 15, normal_stock: 50, cost_price: 220, selling_price: 320, vendor_name: 'Oil Suppliers Ltd.', created_at: '2024-01-11', updated_at: '2024-01-17' },
    { sku_code: 'RC-15', item_name: 'Radiator Cap', category: 'Cooling', current_quantity: 18, min_stock: 10, normal_stock: 35, cost_price: 95, selling_price: 150, vendor_name: 'Cooling Systems', created_at: '2024-01-13', updated_at: '2024-01-19' },
    { sku_code: 'FF-890', item_name: 'Fuel Filter', category: 'Filters', current_quantity: 44, min_stock: 18, normal_stock: 60, cost_price: 310, selling_price: 450, vendor_name: 'Filter World', created_at: '2024-01-15', updated_at: '2024-01-20' },
    { sku_code: 'SB-456', item_name: 'Serpentine Belt', category: 'Engine', current_quantity: 27, min_stock: 12, normal_stock: 40, cost_price: 380, selling_price: 550, vendor_name: 'Engine Parts Ltd.', created_at: '2024-01-12', updated_at: '2024-01-18' },
    { sku_code: 'MO-1040', item_name: 'Motor Oil 10W-40', category: 'Fluids', current_quantity: 95, min_stock: 20, normal_stock: 70, cost_price: 340, selling_price: 480, vendor_name: 'Oil Suppliers Ltd.', created_at: '2024-01-14', updated_at: '2024-01-21' },
    { sku_code: 'WW-500', item_name: 'Windshield Washer', category: 'Fluids', current_quantity: 68, min_stock: 15, normal_stock: 60, cost_price: 85, selling_price: 130, vendor_name: 'Fluid Masters', created_at: '2024-01-16', updated_at: '2024-01-22' },
    { sku_code: 'TPG-20', item_name: 'Tire Pressure Gauge', category: 'Tools', current_quantity: 52, min_stock: 10, normal_stock: 50, cost_price: 120, selling_price: 180, vendor_name: 'Tool Depot', created_at: '2024-01-11', updated_at: '2024-01-17' },
    { sku_code: 'ODP-88', item_name: 'Oil Drain Plug', category: 'Engine', current_quantity: 110, min_stock: 30, normal_stock: 100, cost_price: 45, selling_price: 75, vendor_name: 'Engine Parts Ltd.', created_at: '2024-01-13', updated_at: '2024-01-19' },
    { sku_code: 'FA-MIX', item_name: 'Fuse Assortment', category: 'Electrical', current_quantity: 205, min_stock: 50, normal_stock: 200, cost_price: 180, selling_price: 280, vendor_name: 'Electrical Supply', created_at: '2024-01-15', updated_at: '2024-01-20' },
    { sku_code: 'ZT-100', item_name: 'Zip Ties Pack', category: 'Accessories', current_quantity: 450, min_stock: 100, normal_stock: 500, cost_price: 65, selling_price: 110, vendor_name: 'Hardware Plus', created_at: '2024-01-12', updated_at: '2024-01-18' },
    { sku_code: 'CL-1L', item_name: 'Coolant 1L', category: 'Fluids', current_quantity: 72, min_stock: 15, normal_stock: 60, cost_price: 195, selling_price: 300, vendor_name: 'Cooling Systems', created_at: '2024-01-14', updated_at: '2024-01-21' },
    { sku_code: 'GS-500', item_name: 'Gasket Set', category: 'Engine', current_quantity: 18, min_stock: 10, normal_stock: 30, cost_price: 680, selling_price: 950, vendor_name: 'Engine Parts Ltd.', created_at: '2024-01-16', updated_at: '2024-01-22' },
    { sku_code: 'WP-200', item_name: 'Water Pump', category: 'Cooling', current_quantity: 12, min_stock: 5, normal_stock: 20, cost_price: 1850, selling_price: 2500, vendor_name: 'Cooling Systems', created_at: '2024-01-11', updated_at: '2024-01-17' },
    { sku_code: 'AL-360', item_name: 'Alternator', category: 'Electrical', current_quantity: 8, min_stock: 3, normal_stock: 15, cost_price: 4200, selling_price: 5800, vendor_name: 'Electrical Supply', created_at: '2024-01-13', updated_at: '2024-01-19' },
    { sku_code: 'ST-450', item_name: 'Starter Motor', category: 'Electrical', current_quantity: 6, min_stock: 3, normal_stock: 12, cost_price: 3800, selling_price: 5200, vendor_name: 'Electrical Supply', created_at: '2024-01-15', updated_at: '2024-01-20' },
    { sku_code: 'CV-BOOT', item_name: 'CV Boot Kit', category: 'Suspension', current_quantity: 24, min_stock: 15, normal_stock: 50, cost_price: 320, selling_price: 480, vendor_name: 'Suspension Pro', created_at: '2024-01-12', updated_at: '2024-01-18' },
    { sku_code: 'SA-200', item_name: 'Shock Absorber', category: 'Suspension', current_quantity: 16, min_stock: 8, normal_stock: 30, cost_price: 1450, selling_price: 2100, vendor_name: 'Suspension Pro', created_at: '2024-01-14', updated_at: '2024-01-21' },
    { sku_code: 'BR-DISC', item_name: 'Brake Disc', category: 'Brakes', current_quantity: 28, min_stock: 12, normal_stock: 40, cost_price: 980, selling_price: 1400, vendor_name: 'Auto Parts Co.', created_at: '2024-01-16', updated_at: '2024-01-22' },
    { sku_code: 'BC-SET', item_name: 'Brake Caliper', category: 'Brakes', current_quantity: 14, min_stock: 6, normal_stock: 25, cost_price: 2200, selling_price: 3100, vendor_name: 'Auto Parts Co.', created_at: '2024-01-11', updated_at: '2024-01-17' },
    { sku_code: 'TRE-45', item_name: 'Tie Rod End', category: 'Suspension', current_quantity: 32, min_stock: 15, normal_stock: 50, cost_price: 420, selling_price: 620, vendor_name: 'Suspension Pro', created_at: '2024-01-13', updated_at: '2024-01-19' },
    { sku_code: 'BJ-200', item_name: 'Ball Joint', category: 'Suspension', current_quantity: 26, min_stock: 12, normal_stock: 45, cost_price: 580, selling_price: 850, vendor_name: 'Suspension Pro', created_at: '2024-01-15', updated_at: '2024-01-20' },
    { sku_code: 'WH-BRG', item_name: 'Wheel Bearing', category: 'Suspension', current_quantity: 38, min_stock: 20, normal_stock: 60, cost_price: 650, selling_price: 950, vendor_name: 'Bearing World', created_at: '2024-01-12', updated_at: '2024-01-18' },
    { sku_code: 'CL-ASSY', item_name: 'Clutch Assembly', category: 'Transmission', current_quantity: 9, min_stock: 5, normal_stock: 20, cost_price: 3200, selling_price: 4500, vendor_name: 'Transmission Parts', created_at: '2024-01-14', updated_at: '2024-01-21' },
    { sku_code: 'CL-DISC', item_name: 'Clutch Disc', category: 'Transmission', current_quantity: 15, min_stock: 8, normal_stock: 30, cost_price: 1100, selling_price: 1600, vendor_name: 'Transmission Parts', created_at: '2024-01-16', updated_at: '2024-01-22' },
    { sku_code: 'PR-PLATE', item_name: 'Pressure Plate', category: 'Transmission', current_quantity: 12, min_stock: 6, normal_stock: 25, cost_price: 1350, selling_price: 1950, vendor_name: 'Transmission Parts', created_at: '2024-01-11', updated_at: '2024-01-17' },
    { sku_code: 'FL-WHEEL', item_name: 'Flywheel', category: 'Transmission', current_quantity: 7, min_stock: 4, normal_stock: 15, cost_price: 2800, selling_price: 3900, vendor_name: 'Transmission Parts', created_at: '2024-01-13', updated_at: '2024-01-19' },
    { sku_code: 'IG-COIL', item_name: 'Ignition Coil', category: 'Ignition', current_quantity: 42, min_stock: 20, normal_stock: 70, cost_price: 580, selling_price: 850, vendor_name: 'Spark Co.', created_at: '2024-01-15', updated_at: '2024-01-20' },
    { sku_code: 'IG-WIRE', item_name: 'Ignition Wire Set', category: 'Ignition', current_quantity: 28, min_stock: 15, normal_stock: 50, cost_price: 420, selling_price: 650, vendor_name: 'Spark Co.', created_at: '2024-01-12', updated_at: '2024-01-18' },
    { sku_code: 'TH-STAT', item_name: 'Thermostat', category: 'Cooling', current_quantity: 48, min_stock: 25, normal_stock: 80, cost_price: 180, selling_price: 280, vendor_name: 'Cooling Systems', created_at: '2024-01-14', updated_at: '2024-01-21' },
    { sku_code: 'RD-HOSE', item_name: 'Radiator Hose', category: 'Cooling', current_quantity: 36, min_stock: 20, normal_stock: 60, cost_price: 220, selling_price: 350, vendor_name: 'Cooling Systems', created_at: '2024-01-16', updated_at: '2024-01-22' },
    { sku_code: 'FN-BELT', item_name: 'Fan Belt', category: 'Engine', current_quantity: 52, min_stock: 25, normal_stock: 75, cost_price: 180, selling_price: 280, vendor_name: 'Engine Parts Ltd.', created_at: '2024-01-11', updated_at: '2024-01-17' },
    { sku_code: 'TN-CHAIN', item_name: 'Timing Chain', category: 'Engine', current_quantity: 18, min_stock: 10, normal_stock: 35, cost_price: 1200, selling_price: 1750, vendor_name: 'Engine Parts Ltd.', created_at: '2024-01-13', updated_at: '2024-01-19' },
    { sku_code: 'PS-RING', item_name: 'Piston Ring Set', category: 'Engine', current_quantity: 22, min_stock: 12, normal_stock: 40, cost_price: 850, selling_price: 1250, vendor_name: 'Engine Parts Ltd.', created_at: '2024-01-15', updated_at: '2024-01-20' },
    { sku_code: 'VL-COVER', item_name: 'Valve Cover Gasket', category: 'Engine', current_quantity: 34, min_stock: 18, normal_stock: 55, cost_price: 280, selling_price: 420, vendor_name: 'Engine Parts Ltd.', created_at: '2024-01-12', updated_at: '2024-01-18' },
    { sku_code: 'OL-PAN', item_name: 'Oil Pan', category: 'Engine', current_quantity: 16, min_stock: 8, normal_stock: 30, cost_price: 980, selling_price: 1450, vendor_name: 'Engine Parts Ltd.', created_at: '2024-01-14', updated_at: '2024-01-21' },
    { sku_code: 'OL-PUMP', item_name: 'Oil Pump', category: 'Engine', current_quantity: 11, min_stock: 6, normal_stock: 20, cost_price: 1650, selling_price: 2350, vendor_name: 'Engine Parts Ltd.', created_at: '2024-01-16', updated_at: '2024-01-22' },
    { sku_code: 'FP-ASSY', item_name: 'Fuel Pump', category: 'Fuel System', current_quantity: 14, min_stock: 7, normal_stock: 25, cost_price: 2100, selling_price: 2950, vendor_name: 'Fuel Systems Inc.', created_at: '2024-01-11', updated_at: '2024-01-17' },
    { sku_code: 'FI-KIT', item_name: 'Fuel Injector', category: 'Fuel System', current_quantity: 32, min_stock: 16, normal_stock: 50, cost_price: 1450, selling_price: 2100, vendor_name: 'Fuel Systems Inc.', created_at: '2024-01-13', updated_at: '2024-01-19' },
    { sku_code: 'FR-REG', item_name: 'Fuel Regulator', category: 'Fuel System', current_quantity: 24, min_stock: 12, normal_stock: 40, cost_price: 680, selling_price: 980, vendor_name: 'Fuel Systems Inc.', created_at: '2024-01-15', updated_at: '2024-01-20' },
    { sku_code: 'EX-MAN', item_name: 'Exhaust Manifold', category: 'Exhaust', current_quantity: 8, min_stock: 4, normal_stock: 15, cost_price: 3200, selling_price: 4500, vendor_name: 'Exhaust Pro', created_at: '2024-01-12', updated_at: '2024-01-18' },
    { sku_code: 'CT-CONV', item_name: 'Catalytic Converter', category: 'Exhaust', current_quantity: 6, min_stock: 3, normal_stock: 12, cost_price: 8500, selling_price: 12000, vendor_name: 'Exhaust Pro', created_at: '2024-01-14', updated_at: '2024-01-21' },
    { sku_code: 'MF-ASSY', item_name: 'Muffler', category: 'Exhaust', current_quantity: 12, min_stock: 6, normal_stock: 20, cost_price: 1850, selling_price: 2650, vendor_name: 'Exhaust Pro', created_at: '2024-01-16', updated_at: '2024-01-22' },
    { sku_code: 'O2-SENS', item_name: 'Oxygen Sensor', category: 'Exhaust', current_quantity: 28, min_stock: 15, normal_stock: 50, cost_price: 980, selling_price: 1450, vendor_name: 'Exhaust Pro', created_at: '2024-01-11', updated_at: '2024-01-17' },
    { sku_code: 'EX-PIPE', item_name: 'Exhaust Pipe', category: 'Exhaust', current_quantity: 18, min_stock: 10, normal_stock: 30, cost_price: 650, selling_price: 950, vendor_name: 'Exhaust Pro', created_at: '2024-01-13', updated_at: '2024-01-19' },
    { sku_code: 'AC-COMP', item_name: 'AC Compressor', category: 'AC System', current_quantity: 7, min_stock: 3, normal_stock: 15, cost_price: 5200, selling_price: 7500, vendor_name: 'AC Parts Ltd.', created_at: '2024-01-15', updated_at: '2024-01-20' },
    { sku_code: 'AC-COND', item_name: 'AC Condenser', category: 'AC System', current_quantity: 9, min_stock: 4, normal_stock: 18, cost_price: 3800, selling_price: 5400, vendor_name: 'AC Parts Ltd.', created_at: '2024-01-12', updated_at: '2024-01-18' },
    { sku_code: 'AC-EVAP', item_name: 'AC Evaporator', category: 'AC System', current_quantity: 6, min_stock: 3, normal_stock: 12, cost_price: 4200, selling_price: 6000, vendor_name: 'AC Parts Ltd.', created_at: '2024-01-14', updated_at: '2024-01-21' },
    { sku_code: 'AC-FILT', item_name: 'AC Filter', category: 'AC System', current_quantity: 45, min_stock: 20, normal_stock: 70, cost_price: 180, selling_price: 280, vendor_name: 'AC Parts Ltd.', created_at: '2024-01-16', updated_at: '2024-01-22' },
    { sku_code: 'BL-MOTOR', item_name: 'Blower Motor', category: 'AC System', current_quantity: 14, min_stock: 7, normal_stock: 25, cost_price: 1650, selling_price: 2400, vendor_name: 'AC Parts Ltd.', created_at: '2024-01-11', updated_at: '2024-01-17' },
    { sku_code: 'HT-CORE', item_name: 'Heater Core', category: 'AC System', current_quantity: 10, min_stock: 5, normal_stock: 20, cost_price: 2200, selling_price: 3200, vendor_name: 'AC Parts Ltd.', created_at: '2024-01-13', updated_at: '2024-01-19' },
    { sku_code: 'WS-MOTOR', item_name: 'Wiper Motor', category: 'Accessories', current_quantity: 16, min_stock: 8, normal_stock: 30, cost_price: 1450, selling_price: 2100, vendor_name: 'Wiper World', created_at: '2024-01-15', updated_at: '2024-01-20' },
    { sku_code: 'WS-PUMP', item_name: 'Washer Pump', category: 'Accessories', current_quantity: 32, min_stock: 15, normal_stock: 50, cost_price: 320, selling_price: 480, vendor_name: 'Wiper World', created_at: '2024-01-12', updated_at: '2024-01-18' },
    { sku_code: 'HN-ASSY', item_name: 'Horn', category: 'Accessories', current_quantity: 38, min_stock: 20, normal_stock: 60, cost_price: 280, selling_price: 420, vendor_name: 'Sound Systems', created_at: '2024-01-14', updated_at: '2024-01-21' },
    { sku_code: 'MR-ASSY', item_name: 'Side Mirror', category: 'Accessories', current_quantity: 22, min_stock: 12, normal_stock: 40, cost_price: 980, selling_price: 1450, vendor_name: 'Mirror World', created_at: '2024-01-16', updated_at: '2024-01-22' },
    { sku_code: 'HL-ASSY', item_name: 'Headlight Assembly', category: 'Lighting', current_quantity: 18, min_stock: 10, normal_stock: 35, cost_price: 2200, selling_price: 3200, vendor_name: 'Light House', created_at: '2024-01-11', updated_at: '2024-01-17' },
    { sku_code: 'TL-ASSY', item_name: 'Tail Light Assembly', category: 'Lighting', current_quantity: 24, min_stock: 12, normal_stock: 40, cost_price: 1650, selling_price: 2400, vendor_name: 'Light House', created_at: '2024-01-13', updated_at: '2024-01-19' },
    { sku_code: 'FG-LAMP', item_name: 'Fog Lamp', category: 'Lighting', current_quantity: 28, min_stock: 15, normal_stock: 50, cost_price: 850, selling_price: 1250, vendor_name: 'Light House', created_at: '2024-01-15', updated_at: '2024-01-20' },
    { sku_code: 'IN-LAMP', item_name: 'Interior Light', category: 'Lighting', current_quantity: 52, min_stock: 25, normal_stock: 75, cost_price: 120, selling_price: 180, vendor_name: 'Light House', created_at: '2024-01-12', updated_at: '2024-01-18' },
    { sku_code: 'LB-H4', item_name: 'Headlight Bulb H4', category: 'Lighting', current_quantity: 48, min_stock: 30, normal_stock: 100, cost_price: 95, selling_price: 150, vendor_name: 'Light House', created_at: '2024-01-14', updated_at: '2024-01-21' },
    { sku_code: 'LB-H11', item_name: 'Headlight Bulb H11', category: 'Lighting', current_quantity: 36, min_stock: 25, normal_stock: 80, cost_price: 110, selling_price: 170, vendor_name: 'Light House', created_at: '2024-01-16', updated_at: '2024-01-22' },
    { sku_code: 'PW-MOTOR', item_name: 'Power Window Motor', category: 'Electrical', current_quantity: 12, min_stock: 6, normal_stock: 25, cost_price: 1850, selling_price: 2650, vendor_name: 'Electrical Supply', created_at: '2024-01-11', updated_at: '2024-01-17' },
    { sku_code: 'PW-SWITCH', item_name: 'Power Window Switch', category: 'Electrical', current_quantity: 28, min_stock: 15, normal_stock: 50, cost_price: 420, selling_price: 650, vendor_name: 'Electrical Supply', created_at: '2024-01-13', updated_at: '2024-01-19' },
    { sku_code: 'DL-MOTOR', item_name: 'Door Lock Motor', category: 'Electrical', current_quantity: 18, min_stock: 10, normal_stock: 35, cost_price: 980, selling_price: 1450, vendor_name: 'Electrical Supply', created_at: '2024-01-15', updated_at: '2024-01-20' },
    { sku_code: 'IG-SWITCH', item_name: 'Ignition Switch', category: 'Electrical', current_quantity: 22, min_stock: 12, normal_stock: 40, cost_price: 650, selling_price: 950, vendor_name: 'Electrical Supply', created_at: '2024-01-12', updated_at: '2024-01-18' },
    { sku_code: 'RL-ASSY', item_name: 'Relay Set', category: 'Electrical', current_quantity: 85, min_stock: 40, normal_stock: 100, cost_price: 180, selling_price: 280, vendor_name: 'Electrical Supply', created_at: '2024-01-14', updated_at: '2024-01-21' },
    { sku_code: 'WR-HARN', item_name: 'Wiring Harness', category: 'Electrical', current_quantity: 14, min_stock: 8, normal_stock: 25, cost_price: 2200, selling_price: 3200, vendor_name: 'Electrical Supply', created_at: '2024-01-16', updated_at: '2024-01-22' },
    { sku_code: 'SN-HORN', item_name: 'Horn Button', category: 'Accessories', current_quantity: 42, min_stock: 20, normal_stock: 65, cost_price: 95, selling_price: 150, vendor_name: 'Sound Systems', created_at: '2024-01-11', updated_at: '2024-01-17' },
    { sku_code: 'ST-WHEEL', item_name: 'Steering Wheel', category: 'Accessories', current_quantity: 8, min_stock: 4, normal_stock: 15, cost_price: 3200, selling_price: 4500, vendor_name: 'Interior Parts', created_at: '2024-01-13', updated_at: '2024-01-19' },
    { sku_code: 'ST-PUMP', item_name: 'Steering Pump', category: 'Steering', current_quantity: 11, min_stock: 6, normal_stock: 20, cost_price: 2800, selling_price: 3900, vendor_name: 'Steering Pro', created_at: '2024-01-15', updated_at: '2024-01-20' },
    { sku_code: 'ST-RACK', item_name: 'Steering Rack', category: 'Steering', current_quantity: 7, min_stock: 3, normal_stock: 12, cost_price: 4500, selling_price: 6500, vendor_name: 'Steering Pro', created_at: '2024-01-12', updated_at: '2024-01-18' },
    { sku_code: 'ST-HOSE', item_name: 'Steering Hose', category: 'Steering', current_quantity: 24, min_stock: 12, normal_stock: 40, cost_price: 580, selling_price: 850, vendor_name: 'Steering Pro', created_at: '2024-01-14', updated_at: '2024-01-21' },
    { sku_code: 'AX-BOOT', item_name: 'Axle Boot', category: 'Transmission', current_quantity: 36, min_stock: 18, normal_stock: 55, cost_price: 220, selling_price: 350, vendor_name: 'Transmission Parts', created_at: '2024-01-16', updated_at: '2024-01-22' },
    { sku_code: 'AX-SHAFT', item_name: 'Axle Shaft', category: 'Transmission', current_quantity: 16, min_stock: 8, normal_stock: 30, cost_price: 1850, selling_price: 2650, vendor_name: 'Transmission Parts', created_at: '2024-01-11', updated_at: '2024-01-17' },
    { sku_code: 'DF-SEAL', item_name: 'Differential Seal', category: 'Transmission', current_quantity: 28, min_stock: 15, normal_stock: 50, cost_price: 180, selling_price: 280, vendor_name: 'Transmission Parts', created_at: '2024-01-13', updated_at: '2024-01-19' },
    { sku_code: 'TR-MOUNT', item_name: 'Transmission Mount', category: 'Transmission', current_quantity: 22, min_stock: 12, normal_stock: 40, cost_price: 650, selling_price: 950, vendor_name: 'Transmission Parts', created_at: '2024-01-15', updated_at: '2024-01-20' },
    { sku_code: 'EN-MOUNT', item_name: 'Engine Mount', category: 'Engine', current_quantity: 26, min_stock: 14, normal_stock: 45, cost_price: 850, selling_price: 1250, vendor_name: 'Engine Parts Ltd.', created_at: '2024-01-12', updated_at: '2024-01-18' },
    { sku_code: 'EX-VALVE', item_name: 'Exhaust Valve', category: 'Engine', current_quantity: 48, min_stock: 25, normal_stock: 75, cost_price: 320, selling_price: 480, vendor_name: 'Engine Parts Ltd.', created_at: '2024-01-14', updated_at: '2024-01-21' },
    { sku_code: 'IN-VALVE', item_name: 'Intake Valve', category: 'Engine', current_quantity: 52, min_stock: 28, normal_stock: 80, cost_price: 280, selling_price: 420, vendor_name: 'Engine Parts Ltd.', created_at: '2024-01-16', updated_at: '2024-01-22' },
    { sku_code: 'CM-SEAL', item_name: 'Camshaft Seal', category: 'Engine', current_quantity: 38, min_stock: 20, normal_stock: 60, cost_price: 150, selling_price: 230, vendor_name: 'Engine Parts Ltd.', created_at: '2024-01-11', updated_at: '2024-01-17' },
    { sku_code: 'CR-SEAL', item_name: 'Crankshaft Seal', category: 'Engine', current_quantity: 42, min_stock: 22, normal_stock: 65, cost_price: 180, selling_price: 280, vendor_name: 'Engine Parts Ltd.', created_at: '2024-01-13', updated_at: '2024-01-19' },
    { sku_code: 'HD-GSKT', item_name: 'Head Gasket', category: 'Engine', current_quantity: 18, min_stock: 10, normal_stock: 35, cost_price: 980, selling_price: 1450, vendor_name: 'Engine Parts Ltd.', created_at: '2024-01-15', updated_at: '2024-01-20' },
    { sku_code: 'MF-GSKT', item_name: 'Manifold Gasket', category: 'Engine', current_quantity: 32, min_stock: 18, normal_stock: 55, cost_price: 220, selling_price: 350, vendor_name: 'Engine Parts Ltd.', created_at: '2024-01-12', updated_at: '2024-01-18' },
    { sku_code: 'TB-TENS', item_name: 'Timing Belt Tensioner', category: 'Engine', current_quantity: 24, min_stock: 12, normal_stock: 40, cost_price: 680, selling_price: 980, vendor_name: 'Engine Parts Ltd.', created_at: '2024-01-14', updated_at: '2024-01-21' },
    { sku_code: 'ID-PULLEY', item_name: 'Idler Pulley', category: 'Engine', current_quantity: 36, min_stock: 20, normal_stock: 60, cost_price: 420, selling_price: 620, vendor_name: 'Engine Parts Ltd.', created_at: '2024-01-16', updated_at: '2024-01-22' },
    { sku_code: 'WP-SEAL', item_name: 'Water Pump Seal', category: 'Cooling', current_quantity: 45, min_stock: 25, normal_stock: 70, cost_price: 95, selling_price: 150, vendor_name: 'Cooling Systems', created_at: '2024-01-11', updated_at: '2024-01-17' },
  ];

  const filteredData = inventoryData.filter(item => {
    const matchesSearch = item.item_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         item.sku_code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  const categories = ['all', ...Array.from(new Set(inventoryData.map(item => item.category)))];

  return (
    <div className="space-y-2">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setIsBulkUploadModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-[#072741] to-[#0a3d5c] text-white rounded-lg hover:shadow-lg transition-all text-sm font-semibold border border-[#348ADC]/30"
          >
            <Upload size={16} />
            Bulk Upload
          </button>
          <button 
            onClick={handleAddItemClick}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#348ADC] text-white rounded-lg hover:bg-[#2a6fb0] hover:shadow-lg transition-all text-sm font-semibold"
          >
            <Plus size={16} />
            Add Item
          </button>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between gap-4">
        {/* Toggle */}
        <div className="bg-white border border-gray-200 rounded-full p-0.5 flex gap-0.5 shadow-sm">
          <button
            onClick={() => setViewMode('card')}
            className={`rounded-full px-2.5 py-1 text-xs font-medium transition ${
              viewMode === 'card'
                ? 'bg-[#348ADC] text-white shadow-sm'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            Card
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`rounded-full px-2.5 py-1 text-xs font-medium transition ${
              viewMode === 'table'
                ? 'bg-[#348ADC] text-white shadow-sm'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            Table
          </button>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Search items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#348ADC] focus:border-transparent"
            style={{ fontFamily: 'Inter, sans-serif' }}
          />

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#348ADC] focus:border-transparent"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>
                {cat === 'all' ? 'All Categories' : cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Card View */}
      {viewMode === 'card' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {paginatedData.map((item, idx) => (
            <div
              key={idx}
              className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-lg hover:border-[#348ADC] transition cursor-pointer"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-base font-bold text-[#072741] mb-1" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    {item.item_name}
                  </h3>
                  <p className="text-xs text-gray-400 font-mono">{item.sku_code}</p>
                </div>
                <span className="text-xs px-2 py-1 bg-blue-50 text-[#348ADC] rounded font-medium">
                  {item.category}
                </span>
              </div>

              <div className="space-y-2 text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
                <div className="flex justify-between">
                  <span className="text-gray-500">Quantity:</span>
                  <span className="font-semibold text-[#072741]">{item.current_quantity}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Cost Price:</span>
                  <span className="font-semibold text-gray-700">₹{item.cost_price}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Selling Price:</span>
                  <span className="font-semibold text-green-600">₹{item.selling_price}</span>
                </div>
                <div className="pt-2 border-t border-gray-100">
                  <span className="text-xs text-gray-400">Vendor: {item.vendor_name}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Table View */}
      {viewMode === 'table' && (
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="overflow-auto max-h-[340px] rounded-xl">
            <table className="w-full" style={{ fontFamily: 'Inter, sans-serif' }}>
            <thead className="bg-[#072741] border-b border-gray-200 sticky top-0 z-10">
              <tr>
                <th className="text-left text-xs font-semibold text-white px-4 py-2">SKU Code</th>
                <th className="text-left text-xs font-semibold text-white px-4 py-2">Item Name</th>
                <th className="text-left text-xs font-semibold text-white px-4 py-2">Category</th>
                <th className="text-right text-xs font-semibold text-white px-4 py-2">Quantity</th>
                <th className="text-right text-xs font-semibold text-white px-4 py-2">Min Stock</th>
                <th className="text-right text-xs font-semibold text-white px-4 py-2">Normal Stock</th>
                <th className="text-right text-xs font-semibold text-white px-4 py-2">Cost Price</th>
                <th className="text-right text-xs font-semibold text-white px-4 py-2">Selling Price</th>
                <th className="text-left text-xs font-semibold text-white px-4 py-2">Vendor</th>
                <th className="text-center text-xs font-semibold text-white px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((item, idx) => (
                <tr
                  key={idx}
                  className="border-b border-gray-200 hover:bg-gray-50 transition"
                >
                  <td className="px-4 py-2 text-xs font-mono text-[#348ADC]">{item.sku_code}</td>
                  <td className="px-4 py-2 text-xs text-[#072741] font-medium">{item.item_name}</td>
                  <td className="px-4 py-2">
                    <span className="text-xs px-2 py-1 bg-blue-50 text-[#348ADC] rounded font-medium">
                      {item.category}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-xs text-right font-semibold text-[#072741]">{item.current_quantity}</td>
                  <td className="px-4 py-2 text-xs text-right text-gray-600">{item.min_stock}</td>
                  <td className="px-4 py-2 text-xs text-right text-gray-600">{item.normal_stock}</td>
                  <td className="px-4 py-2 text-xs text-right text-gray-700">₹{item.cost_price}</td>
                  <td className="px-4 py-2 text-xs text-right font-semibold text-green-600">₹{item.selling_price}</td>
                  <td className="px-4 py-2 text-xs text-gray-600">{item.vendor_name}</td>
                  <td className="px-4 py-2 text-center">
                    <button className="text-xs text-[#348ADC] hover:text-[#2a6fb0] font-medium">
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-start gap-4 bg-white rounded-lg border border-gray-200 px-4 py-3">
          <div className="text-xs text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>
            Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredData.length)} of {filteredData.length} items
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="px-1.5 py-0.5 border border-gray-300 rounded text-xs font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-1.5 py-0.5 border rounded text-xs font-medium ${
                  currentPage === page
                    ? 'bg-[#348ADC] text-white border-[#348ADC]'
                    : 'border-gray-300 hover:bg-gray-50'
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="px-1.5 py-0.5 border border-gray-300 rounded text-xs font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Next
            </button>
          </div>
        </div>
      )}

      <BulkUploadModal isOpen={isBulkUploadModalOpen} onClose={() => setIsBulkUploadModalOpen(false)} />
    </div>
  );
}
