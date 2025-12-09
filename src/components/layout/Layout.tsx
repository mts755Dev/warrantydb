import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { useAuth } from '../../contexts/AuthContext';

interface LayoutProps {
  showSidebar?: boolean;
}

export function Layout({ showSidebar = true }: LayoutProps) {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-surface-50 via-white to-primary-50/30">
      <Navbar />
      <div className="flex">
        {showSidebar && isAuthenticated && <Sidebar />}
        <main className={`flex-1 p-6 ${isAuthenticated ? '' : 'max-w-7xl mx-auto'}`}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}

