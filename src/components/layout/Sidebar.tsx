import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  LayoutDashboard,
  FileText,
  Users,
  Search,
  ClipboardCheck,
  Mail,
  Settings,
  PlusCircle,
  History,
  Shield,
} from 'lucide-react';

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
}

export function Sidebar() {
  const { user } = useAuth();
  const location = useLocation();

  const getNavItems = (): NavItem[] => {
    if (user?.role === 'admin') {
      return [
        { label: 'Dashboard', path: '/admin', icon: <LayoutDashboard className="w-5 h-5" /> },
        { label: 'Warranties', path: '/admin/warranties', icon: <FileText className="w-5 h-5" /> },
        { label: 'Inspections', path: '/admin/inspections', icon: <ClipboardCheck className="w-5 h-5" /> },
        { label: 'Installers', path: '/admin/installers', icon: <Users className="w-5 h-5" /> },
        { label: 'Search', path: '/admin/search', icon: <Search className="w-5 h-5" /> },
        { label: 'Email Templates', path: '/admin/emails', icon: <Mail className="w-5 h-5" /> },
        { label: 'Settings', path: '/admin/settings', icon: <Settings className="w-5 h-5" /> },
      ];
    }
    
    if (user?.role === 'installer') {
      return [
        { label: 'Dashboard', path: '/installer', icon: <LayoutDashboard className="w-5 h-5" /> },
        { label: 'New Warranty', path: '/installer/register', icon: <PlusCircle className="w-5 h-5" /> },
        { label: 'My Warranties', path: '/installer/warranties', icon: <FileText className="w-5 h-5" /> },
        { label: 'Log Inspection', path: '/installer/inspection', icon: <ClipboardCheck className="w-5 h-5" /> },
        { label: 'Search', path: '/installer/search', icon: <Search className="w-5 h-5" /> },
      ];
    }
    
    if (user?.role === 'customer') {
      return [
        { label: 'My Warranty', path: '/customer/warranty', icon: <Shield className="w-5 h-5" /> },
        { label: 'Inspection History', path: '/customer/inspections', icon: <History className="w-5 h-5" /> },
      ];
    }
    
    return [];
  };

  const navItems = getNavItems();
  
  if (navItems.length === 0) return null;

  const isBasePath = (itemPath: string) => {
    const basePaths = ['/admin', '/installer', '/customer'];
    return basePaths.includes(itemPath) && itemPath === location.pathname;
  };

  return (
    <aside className="w-64 bg-white border-r border-surface-200 min-h-[calc(100vh-64px)] hidden lg:block">
      <nav className="p-4 space-y-1">
        {navItems.map(item => (
          <NavLink
            key={item.path}
            to={item.path}
            end={isBasePath(item.path)}
            className={({ isActive }) => `
              flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium
              transition-all duration-200
              ${isActive 
                ? 'bg-primary-50 text-primary-700 shadow-sm' 
                : 'text-surface-600 hover:bg-surface-50 hover:text-surface-900'
              }
            `}
          >
            {item.icon}
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

