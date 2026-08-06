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
    <div className="min-h-screen bg-[#060e20] flex flex-col md:flex-row text-[#dae2fd] font-body">
      {/* Mobile Topbar */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 bg-[#0b1326] border-b border-[#3b4b3e]/40">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#22ff92] to-[#ffdbc9] flex items-center justify-center text-[#060e20]">
            <Dumbbell className="w-5 h-5 text-[#060e20] stroke-[2.5]" />
          </div>
          <span className="font-display font-bold text-white tracking-tight">VERSAGYM</span>
        </Link>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 text-[#b9cbba] hover:text-white rounded-lg bg-[#171f33]"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`${
          mobileMenuOpen ? 'block' : 'hidden'
        } md:flex flex-col w-full md:w-64 bg-[#0b1326] border-r border-[#3b4b3e]/30 p-6 justify-between shrink-0 transition-all`}
      >
        <div className="space-y-8">
          {/* Logo */}
          <Link to="/" className="hidden md:flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#22ff92] to-[#713fdb] flex items-center justify-center shadow-lg shadow-[#22ff92]/20 group-hover:scale-105 transition-transform">
              <Dumbbell className="w-6 h-6 text-[#060e20] stroke-[2.5]" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-display font-bold tracking-tight text-white flex items-center gap-1">
                VERSA<span className="text-[#22ff92] font-extrabold">GYM</span>
              </span>
              <span className="text-[10px] text-[#b9cbba] font-mono tracking-wider uppercase">Dueño de Gimnasio</span>
            </div>
          </Link>

          {/* User Profile Summary */}
          <div className="bg-[#171f33]/80 border border-[#3b4b3e]/40 p-3.5 rounded-xl flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#22ff92]/10 text-[#22ff92] flex items-center justify-center font-semibold text-sm">
              <User className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-white truncate">{user?.name || 'Usuario'}</p>
              <p className="text-xs text-[#b9cbba] truncate">{user?.gym_name || user?.email}</p>
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
                      ? 'bg-[#22ff92]/10 text-[#22ff92] border border-[#22ff92]/30 shadow-sm font-semibold'
                      : 'text-[#b9cbba] hover:text-white hover:bg-[#171f33]'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-[#22ff92]' : 'text-[#b9cbba]'}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer Actions */}
        <div className="pt-6 border-t border-[#3b4b3e]/30 space-y-3">
          {user?.role === 'super_admin' && (
            <Link to="/admin">
              <Button
                variant="emerald"
                size="sm"
                className="w-full justify-start text-xs font-bold mb-2 bg-[#713fdb] hover:bg-[#5516be] text-white border-none shadow-md"
                leftIcon={<KeyRound className="w-4 h-4" />}
              >
                Panel Super Admin 👑
              </Button>
            </Link>
          )}

          {subscription && (
            <div className="flex items-center justify-between px-2 text-xs">
              <span className="text-[#b9cbba]">Estado Licencia:</span>
              <Badge variant={subscription.status}>{subscription.status.toUpperCase()}</Badge>
            </div>
          )}

          <Button
            variant="ghost"
            className="w-full justify-start text-[#b9cbba] hover:text-rose-400 hover:bg-rose-500/10"
            onClick={logout}
            leftIcon={<LogOut className="w-4 h-4" />}
          >
            Cerrar Sesión
          </Button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto bg-[#060e20]">
        <main className="flex-1 p-6 md:p-10 max-w-7xl w-full mx-auto space-y-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
