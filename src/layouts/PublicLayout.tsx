import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Dumbbell, ShieldCheck, ArrowRight, User } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useAuthStore } from '../store/authStore';

export const PublicLayout: React.FC = () => {
  const { isAuthenticated } = useAuthStore();

  return (
    <div className="min-h-screen flex flex-col bg-zinc-950 text-zinc-100 selection:bg-emerald-500 selection:text-zinc-950">
      {/* Header / Navbar */}
      <header className="sticky top-0 z-40 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform duration-200">
              <Dumbbell className="w-6 h-6 text-zinc-950 stroke-[2.5]" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight text-white flex items-center gap-1">
                VERSA<span className="text-emerald-400 font-extrabold">GYM</span>
              </span>
              <span className="text-[10px] text-zinc-400 font-medium tracking-wider uppercase">SaaS Management</span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400">
            <a href="#features" className="hover:text-zinc-100 transition-colors">Características</a>
            <a href="#plans" className="hover:text-zinc-100 transition-colors">Planes & Precios</a>
            <a href="#faq" className="hover:text-zinc-100 transition-colors">Preguntas Frecuentes</a>
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <Link to="/dashboard">
                <Button variant="emerald" leftIcon={<User className="w-4 h-4" />}>
                  Ir al Dashboard
                </Button>
              </Link>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" size="sm">
                    Iniciar Sesión
                  </Button>
                </Link>
                <Link to="/register">
                  <Button variant="emerald" size="sm" rightIcon={<ArrowRight className="w-4 h-4" />}>
                    Prueba Gratis
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-zinc-900 border-t border-zinc-800/80 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-zinc-500">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <span>VersaGym SaaS &copy; {new Date().getFullYear()} - Todos los derechos reservados.</span>
          </div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-zinc-300 transition-colors">Términos de servicio</a>
            <a href="#" className="hover:text-zinc-300 transition-colors">Política de privacidad</a>
            <a href="#" className="hover:text-zinc-300 transition-colors">Soporte técnico</a>
          </div>
        </div>
      </footer>
    </div>
  );
};
