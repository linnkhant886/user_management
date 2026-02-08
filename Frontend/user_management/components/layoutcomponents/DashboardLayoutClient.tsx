'use client';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import Sidebar from './Sidebar';
import { Header } from './Header';

export default function DashboardLayoutClient({ children }: { children: React.ReactNode }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Sidebar 
        collapsed={sidebarCollapsed} 
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} 
      />
      <Header sidebarCollapsed={sidebarCollapsed} />
      
      <main
        className={cn(
          'pt-16 min-h-screen transition-all duration-300',
          sidebarCollapsed ? 'ml-16' : 'ml-64'
        )}
      >
        <div className="p-6 bg-blue-100">
          {children}
        </div>
      </main>
    </div>
  );
}
