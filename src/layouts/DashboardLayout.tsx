import React, { useState } from 'react';
import { Outlet, Link, useLocation, Navigate } from 'react-router-dom';
import {
  Dumbbell,
  LayoutDashboard,
  CreditCard,
  Clock,
  Database,
  Users,
  LogOut,
  User,
  Menu,
  X,
  KeyRound,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';

const NAV_ITEMS = [
  { label: 'Panel de Inicio', path: '/dashboard', icon: LayoutDashboard },
  { label: 'Gestión de Suscripción', path: '/dashboard/subscription', icon: CreditCard },
  { label: 'Historial de Pagos', path: '/dashboard/payments', icon: Clock },
  { label: 'Mis Backups', path: '/dashboard/backups', icon: Database },
];

export const DashboardLayout: React.FC = () => {
  const { user, subscription, isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col md:flex-row text-zinc-100">
      {/* Mobile Topbar */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 bg-zinc-900 border-b border-zinc-800">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center">
            <Dumbbell className="w-5 h-5 text-zinc-950 stroke-[2.5]" />
          </div>
          <span className="font-bold text-white tracking-tight">VERSAGYM</span>
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
        } md:flex flex-col w-full md:w-64 bg-zinc-900 border-r border-zinc-800/80 p-6 justify-between shrink-0 transition-all`}
      >
        <div className="space-y-8">
          {/* Logo */}
          <Link to="/" className="hidden md:flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <Dumbbell className="w-6 h-6 text-zinc-950 stroke-[2.5]" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold tracking-tight text-white flex items-center gap-1">
                VERSA<span className="text-emerald-400 font-extrabold">GYM</span>
              </span>
              <span className="text-[10px] text-zinc-400 font-medium tracking-wider uppercase">Dueño de Gimnasio</span>
            </div>
          </Link>

          {/* User Profile Summary */}
          <div className="bg-zinc-950/60 border border-zinc-800 p-3.5 rounded-xl flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-indigo-600/20 text-indigo-400 flex items-center justify-center font-semibold text-sm">
              <User className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-zinc-100 truncate">{user?.name || 'Usuario'}</p>
              <p className="text-xs text-zinc-400 truncate">{user?.gym_name || user?.email}</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-sm'
                      : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/60'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-emerald-400' : 'text-zinc-400'}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer Actions */}
        <div className="pt-6 border-t border-zinc-800/80 space-y-3">
          {user?.role === 'super_admin' && (
            <Link to="/admin">
              <Button
                variant="emerald"
                size="sm"
                className="w-full justify-start text-xs font-bold mb-2 bg-indigo-600 hover:bg-indigo-500 text-white"
                leftIcon={<KeyRound className="w-4 h-4" />}
              >
                Panel Super Admin 👑
              </Button>
            </Link>
          )}

          {subscription && (
            <div className="flex items-center justify-between px-2">
              <span className="text-xs text-zinc-400">Estado Licencia:</span>
              <Badge variant={subscription.status}>{subscription.status.toUpperCase()}</Badge>
            </div>
          )}

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
