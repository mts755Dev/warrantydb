import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui';
import { 
  Shield, 
  LogOut, 
  User, 
  Settings,
  Menu,
  X
} from 'lucide-react';

export function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getPortalName = () => {
    if (location.pathname.startsWith('/admin')) return 'Admin Portal';
    if (location.pathname.startsWith('/installer')) return 'Installer Portal';
    if (location.pathname.startsWith('/customer')) return 'Customer Portal';
    return '';
  };

  return (
    <nav className="bg-white border-b border-surface-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center shadow-glow group-hover:shadow-lg transition-shadow">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div className="hidden sm:block">
                <span className="font-display font-bold text-xl text-surface-900">WarrantyDB</span>
                {getPortalName() && (
                  <span className="ml-2 text-sm text-surface-500">| {getPortalName()}</span>
                )}
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-4">
            {!isAuthenticated ? (
              <>
                <Link to="/installer">
                  <Button variant="ghost">Installer Login</Button>
                </Link>
                <Link to="/customer">
                  <Button variant="ghost">Activate Warranty</Button>
                </Link>
                <Link to="/admin">
                  <Button variant="primary">Admin Portal</Button>
                </Link>
              </>
            ) : (
              <>
                <div className="flex items-center gap-3 px-3 py-1.5 bg-surface-50 rounded-lg">
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-primary-600" />
                  </div>
                  <div className="text-sm">
                    <p className="font-medium text-surface-900">{user?.name}</p>
                    <p className="text-surface-500 capitalize">{user?.role}</p>
                  </div>
                </div>
                
                {user?.role === 'admin' && (
                  <Link to="/admin/settings">
                    <Button variant="ghost" size="sm">
                      <Settings className="w-4 h-4" />
                    </Button>
                  </Link>
                )}
                
                <Button variant="outline" size="sm" onClick={handleLogout} leftIcon={<LogOut className="w-4 h-4" />}>
                  Logout
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-surface-600 hover:bg-surface-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-surface-200 bg-white animate-slide-down">
          <div className="px-4 py-4 space-y-2">
            {!isAuthenticated ? (
              <>
                <Link to="/installer" onClick={() => setMobileMenuOpen(false)} className="block">
                  <Button variant="ghost" className="w-full justify-start">Installer Login</Button>
                </Link>
                <Link to="/customer" onClick={() => setMobileMenuOpen(false)} className="block">
                  <Button variant="ghost" className="w-full justify-start">Activate Warranty</Button>
                </Link>
                <Link to="/admin" onClick={() => setMobileMenuOpen(false)} className="block">
                  <Button variant="primary" className="w-full">Admin Portal</Button>
                </Link>
              </>
            ) : (
              <>
                <div className="flex items-center gap-3 px-3 py-2 bg-surface-50 rounded-lg mb-4">
                  <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <p className="font-medium text-surface-900">{user?.name}</p>
                    <p className="text-sm text-surface-500 capitalize">{user?.role}</p>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  className="w-full" 
                  onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                  leftIcon={<LogOut className="w-4 h-4" />}
                >
                  Logout
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

