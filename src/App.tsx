import { Routes, Route, useNavigate } from 'react-router-dom';
import { Hero } from './components/Hero';
import { Navbar } from './components/Navbar';
import { Waitlist } from "./components/Waitlist";
import { AppLayout } from './components/AppLayout';
import { DashboardPage } from './components/DashboardPage';
import { Sales } from './components/Sales';
import { Purchases } from './components/Purchases';
import { Inventory } from './components/Inventory';
import { InventoryAnalysis } from './components/InventoryAnalysis';
import { InventoryManagement } from './components/InventoryManagement';
import { Settings } from './components/Settings';

function App() {
  const navigate = useNavigate();

  const handleLoginSuccess = () => {
    navigate('/app/dashboard');
  };

  function HomePage() {
    return (
      <div className="min-h-screen bg-[#DADFE4] w-full max-w-full overflow-x-hidden">
        <Navbar onLoginSuccess={handleLoginSuccess} />
        <Hero />
        <Waitlist />
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/app" element={<AppLayout />}>
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="sales" element={<Sales />} />
        <Route path="purchases" element={<Purchases />} />
        <Route path="inventory" element={<InventoryManagement />} />
        <Route path="inventory-analysis" element={<InventoryAnalysis />} />
        <Route path="settings" element={<Settings />} />
      </Route>
    </Routes>
  );
}

console.log("dev environment working");

export default App;
