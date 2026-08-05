import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { PublicLayout } from './layouts/PublicLayout';
import { AuthLayout } from './layouts/AuthLayout';
import { DashboardLayout } from './layouts/DashboardLayout';
import { AdminLayout } from './layouts/AdminLayout';
import { ToastContainer } from './components/ui/ToastContainer';

// Lazy Loaded Route Components for Code Splitting & Faster Initial Bundle Loading
const Home = lazy(() => import('./pages/Home').then((m) => ({ default: m.Home })));
const Login = lazy(() => import('./pages/auth/Login').then((m) => ({ default: m.Login })));
const Register = lazy(() => import('./pages/auth/Register').then((m) => ({ default: m.Register })));

const Overview = lazy(() => import('./pages/dashboard/Overview').then((m) => ({ default: m.Overview })));
const Subscription = lazy(() => import('./pages/dashboard/Subscription').then((m) => ({ default: m.Subscription })));
const PaymentHistory = lazy(() => import('./pages/dashboard/PaymentHistory').then((m) => ({ default: m.PaymentHistory })));
const Backups = lazy(() => import('./pages/dashboard/Backups').then((m) => ({ default: m.Backups })));
const PublicMemberPayment = lazy(() => import('./pages/PublicMemberPayment').then((m) => ({ default: m.PublicMemberPayment })));

const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard').then((m) => ({ default: m.AdminDashboard })));
const AdminPlans = lazy(() => import('./pages/admin/AdminPlans').then((m) => ({ default: m.AdminPlans })));
const AdminPayments = lazy(() => import('./pages/admin/AdminPayments').then((m) => ({ default: m.AdminPayments })));
const AdminGymOwners = lazy(() => import('./pages/admin/AdminGymOwners').then((m) => ({ default: m.AdminGymOwners })));
const AdminCompanyPaymentSettings = lazy(() => import('./pages/admin/AdminCompanyPaymentSettings').then((m) => ({ default: m.AdminCompanyPaymentSettings })));

// Subtle Loading Fallback
const PageFallback: React.FC = () => (
  <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-3">
    <div className="w-9 h-9 rounded-full border-3 border-emerald-500 border-t-transparent animate-spin"></div>
    <span className="text-xs font-semibold text-zinc-400 tracking-wider uppercase">Cargando VersaGym...</span>
  </div>
);

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageFallback />}>
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
            <Route path="/dashboard/payments" element={<PaymentHistory />} />
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
      </Suspense>

      {/* Global Toast Notifications */}
      <ToastContainer />
    </BrowserRouter>
  );
};

export default App;
