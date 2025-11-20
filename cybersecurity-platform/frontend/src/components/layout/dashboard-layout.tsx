'use client';

import { useState } from 'react';
import { Breadcrumb } from './breadcrumb';
import { Footer } from './footer';
import { Header } from './header';
import Sidebar from './sidebar';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [_sidebarOpen, _setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />

      <div className="flex flex-1 flex-col overflow-hidden">
        <Header onMenuClick={() => _setSidebarOpen(true)} />

        <main className="flex-1 overflow-y-auto bg-muted/10">
          <div className="container mx-auto px-4 py-6">
            <Breadcrumb />
            <div className="mt-4">{children}</div>
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
}
