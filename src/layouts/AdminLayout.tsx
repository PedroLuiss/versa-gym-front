import React, { useState } from 'react';
import { Outlet, Link, useLocation, Navigate } from 'react-router-dom';
import {
  ShieldCheck,
  LayoutDashboard,
  Package,
  CreditCard,
  Users,
  Wallet,
  LogOut,
  User as UserIcon,
  Menu,
  X,
  ArrowLeft,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { Button } from '../components/ui/Button';

export const AdminLayout: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Restringir acceso solo a usuarios con rol super_admin
  if (user?.role !== 'super_admin') {
    return <Navigate to="/dashboard" replace />;
  }

  const navItems = [
    { label: 'Panel General', path: '/admin', icon: LayoutDashboard },
    { label: 'Planes SaaS', path: '/admin/plans', icon: Package },
    { label: 'Aprobación de Pagos', path: '/admin/payments', icon: CreditCard },
    { label: 'Gimnasios Afiliados', path: '/admin/gyms', icon: Users },
    { label: 'Cuentas de Pago VersaGym', path: '/admin/company-payment', icon: Wallet },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col md:flex-row text-zinc-100">
      {/* Mobile Topbar */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 bg-zinc-900 border-b border-indigo-500/20">
        <Link to="/admin" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5 text-white" />
          </div>
          <span className="font-extrabold text-white tracking-tight">SUPER ADMIN</span>
        </Link>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 text-zinc-400 hover:text-white rounded-lg bg-zinc-800"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`${
          mobileMenuOpen ? 'block' : 'hidden'
        } md:flex flex-col w-full md:w-64 bg-zinc-900 border-r border-indigo-500/20 p-6 justify-between shrink-0 transition-all`}
      >
        <div className="space-y-8">
          {/* Logo */}
          <Link to="/admin" className="hidden md:flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-emerald-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold tracking-tight text-white flex items-center gap-1">
                VERSA<span className="text-indigo-400 font-extrabold">ADMIN</span>
              </span>
              <span className="text-[10px] text-indigo-400 font-bold tracking-wider uppercase">Super Admin SaaS</span>
            </div>
          </Link>

          {/* Super Admin Profile Card */}
          <div className="bg-indigo-950/40 border border-indigo-500/30 p-3.5 rounded-xl flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-semibold text-sm">
              <UserIcon className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-white truncate">{user?.name || 'Super Admin'}</p>
              <p className="text-xs text-indigo-300 truncate">Propietario VersaGym</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 shadow-sm font-semibold'
                      : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/60'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-indigo-400' : 'text-zinc-400'}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer Actions */}
        <div className="pt-6 border-t border-zinc-800/80 space-y-2">
          <Link to="/dashboard">
            <Button variant="outline" size="sm" className="w-full justify-start text-xs" leftIcon={<ArrowLeft className="w-3.5 h-3.5" />}>
              Vista Gym Owner
            </Button>
          </Link>

          <Button
            variant="ghost"
            className="w-full justify-start text-zinc-400 hover:text-rose-400 hover:bg-rose-500/10"
            onClick={logout}
            leftIcon={<LogOut className="w-4 h-4" />}
          >
            Cerrar Sesión
          </Button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <main className="flex-1 p-6 md:p-10 max-w-7xl w-full mx-auto space-y-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
