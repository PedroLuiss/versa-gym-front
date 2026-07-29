import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Dumbbell } from 'lucide-react';

export const AuthLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Orbs Effect */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-indigo-600/10 blur-[100px] rounded-full pointer-events-none" />

      {/* Header Logo */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center z-10">
        <Link to="/" className="inline-flex items-center gap-3 group">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-indigo-600 flex items-center justify-center shadow-xl shadow-emerald-500/20 group-hover:scale-105 transition-transform duration-200">
            <Dumbbell className="w-7 h-7 text-zinc-950 stroke-[2.5]" />
          </div>
          <div className="flex flex-col text-left">
            <span className="text-2xl font-bold tracking-tight text-white flex items-center gap-1">
              VERSA<span className="text-emerald-400 font-extrabold">GYM</span>
            </span>
            <span className="text-xs text-zinc-400 font-medium tracking-wider uppercase">SaaS Owner Portal</span>
          </div>
        </Link>
      </div>

      {/* Card Content */}
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md z-10">
        <div className="bg-zinc-900 border border-zinc-800 py-8 px-4 shadow-2xl rounded-2xl sm:px-10 backdrop-blur-sm">
          <Outlet />
        </div>
      </div>
    </div>
  );
};
