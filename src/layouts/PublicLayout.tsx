import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export const PublicLayout: React.FC = () => {
  const { isAuthenticated } = useAuthStore();

  return (
    <div className="min-h-screen flex flex-col bg-[#060e20] text-[#dae2fd] font-body selection:bg-[#22ff92] selection:text-[#00723d] relative overflow-x-hidden">
      {/* TopNavBar */}
      <nav className="fixed top-0 w-full z-50 bg-[#0b1326]/80 backdrop-blur-xl border-b border-[#3b4b3e]/30 shadow-sm transition-all duration-300" id="global-nav">
        <div className="flex justify-between items-center h-20 px-6 md:px-12 max-w-[1280px] mx-auto">
          {/* Brand */}
          <Link to="/" className="font-display text-2xl font-bold text-[#dae2fd] flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#22ff92] to-[#ffdbc9] flex items-center justify-center text-[#060e20] shadow-md group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined font-bold text-xl" style={{ fontVariationSettings: '"FILL" 1' }}>fitness_center</span>
            </div>
            <span>VersaGym</span>
            <span className="text-[#22ff92] text-xs font-mono tracking-widest uppercase ml-1 opacity-90 border border-[#22ff92]/30 px-1.5 py-0.5 rounded bg-[#22ff92]/10">Versátil</span>
          </Link>

          {/* Desktop Navigation */}
          <ul className="hidden md:flex items-center gap-8">
            <li>
              <a className="text-[#b9cbba] font-semibold text-sm hover:text-[#22ff92] transition-colors duration-200" href="#caracteristicas">
                Características
              </a>
            </li>
            <li>
              <a className="text-[#b9cbba] font-semibold text-sm hover:text-[#22ff92] transition-colors duration-200" href="#planes">
                Planes & Precios
              </a>
            </li>
            <li>
              <a className="text-[#b9cbba] font-semibold text-sm hover:text-[#22ff92] transition-colors duration-200" href="#faq">
                Preguntas Frecuentes
              </a>
            </li>
          </ul>

          {/* Actions */}
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <Link
                to="/dashboard"
                className="inline-flex items-center justify-center h-10 px-6 rounded-full bg-gradient-to-r from-[#22ff92] to-[#5dff9e] text-[#00723d] font-semibold text-sm button-glow transition-all scale-95 hover:scale-105 duration-150 ease-in-out shadow-lg"
              >
                <span className="material-symbols-outlined mr-1.5 text-lg" style={{ fontVariationSettings: '"FILL" 1' }}>dashboard</span>
                Ir al Dashboard
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="hidden md:inline-flex text-[#b9cbba] font-semibold text-sm hover:text-[#22ff92] transition-colors duration-200 scale-95 hover:scale-100 ease-in-out"
                >
                  Iniciar Sesión
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center h-10 px-6 rounded-full bg-gradient-to-r from-[#22ff92] to-[#5dff9e] text-[#00723d] font-semibold text-sm button-glow transition-all scale-95 hover:scale-105 duration-150 ease-in-out shadow-lg"
                >
                  Prueba Gratis
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content Canvas */}
      <main className="flex-grow pt-20 relative z-10">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="w-full py-12 border-t border-[#3b4b3e]/40 bg-[#0b1326] mt-auto relative z-10">
        <div className="max-w-[1280px] mx-auto px-6 md:px-12 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col items-center md:items-start gap-2">
            <Link to="/" className="font-display text-xl font-bold text-[#dae2fd] flex items-center gap-2">
              <span className="material-symbols-outlined text-[#22ff92]" style={{ fontVariationSettings: '"FILL" 1' }}>fitness_center</span>
              VersaGym SaaS
            </Link>
            <p className="font-mono text-xs text-[#b9cbba] tracking-wider">
              © {new Date().getFullYear()} VersaGym SaaS Management. Todos los derechos reservados.
            </p>
          </div>
          <ul className="flex flex-wrap justify-center gap-6 font-mono text-xs text-[#b9cbba]">
            <li><a className="hover:text-[#ffb68d] transition-colors opacity-80 hover:opacity-100" href="#">Privacidad</a></li>
            <li><a className="hover:text-[#ffb68d] transition-colors opacity-80 hover:opacity-100" href="#">Términos</a></li>
            <li><a className="hover:text-[#ffb68d] transition-colors opacity-80 hover:opacity-100" href="#">Soporte</a></li>
            <li><a className="hover:text-[#ffb68d] transition-colors opacity-80 hover:opacity-100" href="#">Contacto</a></li>
          </ul>
        </div>
      </footer>
    </div>
  );
};
