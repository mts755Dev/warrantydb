import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Layout } from './components/layout';
import { ProtectedRoute } from './components/auth';

// Pages
import { HomePage } from './pages/HomePage';

// Installer Pages
import {
  InstallerLogin,
  InstallerSignup,
  InstallerDashboard,
  WarrantyRegistration,
  InstallerWarranties,
  WarrantyDetail,
  LogInspection,
  InstallerSearch,
} from './pages/installer';

// Customer Pages
import { CustomerPortal, CustomerLogin } from './pages/customer';

// Admin Pages
import {
  AdminLogin,
  AdminSignup,
  AdminDashboard,
  AdminWarranties,
  AdminWarrantyDetail,
  AdminInstallers,
  AdminInspections,
  AdminSearch,
  AdminEmails,
  AdminSettings,
} from './pages/admin';

// Auth wrapper for installer routes
function InstallerAuthRoute({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <InstallerLogin />;
  }
  
  if (user?.role !== 'installer' && user?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
}

// Auth wrapper for admin routes
function AdminAuthRoute({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <AdminLogin />;
  }
  
  if (user?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Layout showSidebar={false} />}>
        <Route index element={<HomePage />} />
      </Route>

      {/* Customer Routes */}
      <Route path="/customer" element={<Layout showSidebar={false} />}>
        <Route index element={<CustomerLogin />} />
        <Route path="activate" element={<CustomerPortal />} />
      </Route>

      {/* Installer Routes */}
      <Route path="/installer" element={<Layout />}>
        <Route index element={
          <InstallerAuthRoute>
            <InstallerDashboard />
          </InstallerAuthRoute>
        } />
        <Route path="login" element={<InstallerLogin />} />
        <Route path="signup" element={<InstallerSignup />} />
        <Route path="register" element={
          <InstallerAuthRoute>
            <WarrantyRegistration />
          </InstallerAuthRoute>
        } />
        <Route path="warranties" element={
          <InstallerAuthRoute>
            <InstallerWarranties />
          </InstallerAuthRoute>
        } />
        <Route path="warranties/:id" element={
          <InstallerAuthRoute>
            <WarrantyDetail />
          </InstallerAuthRoute>
        } />
        <Route path="inspection" element={
          <InstallerAuthRoute>
            <LogInspection />
          </InstallerAuthRoute>
        } />
        <Route path="search" element={
          <InstallerAuthRoute>
            <InstallerSearch />
          </InstallerAuthRoute>
        } />
      </Route>

      {/* Admin Routes */}
      <Route path="/admin" element={<Layout />}>
        <Route index element={
          <AdminAuthRoute>
            <AdminDashboard />
          </AdminAuthRoute>
        } />
        <Route path="login" element={<AdminLogin />} />
        <Route path="signup" element={<AdminSignup />} />
        <Route path="warranties" element={
          <AdminAuthRoute>
            <AdminWarranties />
          </AdminAuthRoute>
        } />
        <Route path="warranties/:id" element={
          <AdminAuthRoute>
            <AdminWarrantyDetail />
          </AdminAuthRoute>
        } />
        <Route path="installers" element={
          <AdminAuthRoute>
            <AdminInstallers />
          </AdminAuthRoute>
        } />
        <Route path="inspections" element={
          <AdminAuthRoute>
            <AdminInspections />
          </AdminAuthRoute>
        } />
        <Route path="search" element={
          <AdminAuthRoute>
            <AdminSearch />
          </AdminAuthRoute>
        } />
        <Route path="emails" element={
          <AdminAuthRoute>
            <AdminEmails />
          </AdminAuthRoute>
        } />
        <Route path="settings" element={
          <AdminAuthRoute>
            <AdminSettings />
          </AdminAuthRoute>
        } />
      </Route>

      {/* Catch-all redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

export default App;

