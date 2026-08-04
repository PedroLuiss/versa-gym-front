import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { PublicLayout } from './layouts/PublicLayout';
import { AuthLayout } from './layouts/AuthLayout';
import { DashboardLayout } from './layouts/DashboardLayout';
import { AdminLayout } from './layouts/AdminLayout';

import { Home } from './pages/Home';
import { Login } from './pages/auth/Login';
import { Register } from './pages/auth/Register';
import { Overview } from './pages/dashboard/Overview';
import { Subscription } from './pages/dashboard/Subscription';
import { Backups } from './pages/dashboard/Backups';
import { MemberPayments } from './pages/dashboard/MemberPayments';
import { PublicMemberPayment } from './pages/PublicMemberPayment';

import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminPlans } from './pages/admin/AdminPlans';
import { AdminPayments } from './pages/admin/AdminPayments';
import { AdminGymOwners } from './pages/admin/AdminGymOwners';
import { AdminCompanyPaymentSettings } from './pages/admin/AdminCompanyPaymentSettings';

import { ToastContainer } from './components/ui/ToastContainer';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Landing Zone */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
        </Route>

        {/* Public Member Payment Route (No Sidebar/Navbar) */}
        <Route path="/reportar-pago/:token" element={<PublicMemberPayment />} />

        {/* Authentication Zone */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        {/* Gym Owner Dashboard Zone */}
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<Overview />} />
          <Route path="/dashboard/subscription" element={<Subscription />} />
          <Route path="/dashboard/backups" element={<Backups />} />
        </Route>

        {/* Super Admin Zone */}
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/plans" element={<AdminPlans />} />
          <Route path="/admin/payments" element={<AdminPayments />} />
          <Route path="/admin/gyms" element={<AdminGymOwners />} />
          <Route path="/admin/company-payment" element={<AdminCompanyPaymentSettings />} />
        </Route>

        {/* Catch-all Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {/* Global Toast Notifications */}
      <ToastContainer />
    </BrowserRouter>
  );
};

export default App;
