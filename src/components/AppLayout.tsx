import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { TopNavbar } from './TopNavbar';
import { FloatingActionButton } from './FloatingActionButton';
import { useState } from 'react';

export function AppLayout() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#F5F7FA]">
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      <div className={`flex-1 flex flex-col transition-all duration-300 ${isCollapsed ? 'ml-16' : 'ml-64'}`}>
        <TopNavbar />
        <main className="flex-1 px-6 py-3 overflow-auto">
          <Outlet />
        </main>
      </div>
      <FloatingActionButton />
    </div>
  );
}
