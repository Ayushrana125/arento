import { Outlet, useNavigate } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { TopNavbar } from './TopNavbar';
import { FloatingActionButton } from './FloatingActionButton';
import { MobileDashboard } from './MobileDashboard';
import { AddItemPanel } from './AddItemPanel';
import { useState, useEffect } from 'react';

export function AppLayout() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isAddItemPanelOpen, setIsAddItemPanelOpen] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT') {
        return;
      }
      if (e.key === 'n' || e.key === 'N') {
        setIsAddItemPanelOpen(true);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  if (isMobile) {
    return <MobileDashboard />;
  }

  return (
    <div className="flex min-h-screen bg-[#F5F7FA] dark:bg-[#1a1a1a]">
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      <div className={`flex-1 flex flex-col transition-all duration-300 ${isCollapsed ? 'ml-16' : 'ml-64'}`}>
        <TopNavbar />
        <main className="px-6 py-3 overflow-auto dark:bg-[#1a1a1a]" style={{ marginTop: '130px' }}>
          <Outlet />
        </main>
      </div>
      <FloatingActionButton />
      <AddItemPanel isOpen={isAddItemPanelOpen} onClose={() => setIsAddItemPanelOpen(false)} />
    </div>
  );
}
