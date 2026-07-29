import React from 'react';

export type BadgeVariant = 'active' | 'trial' | 'pending' | 'expired' | 'approved' | 'rejected' | 'default';

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ variant = 'default', children, className = '' }) => {
  const styles: Record<BadgeVariant, string> = {
    active: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    approved: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    trial: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
    pending: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    expired: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    rejected: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    default: 'bg-zinc-800 text-zinc-300 border-zinc-700',
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[variant]} ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full mr-1.5 bg-current opacity-75 animate-pulse" />
      {children}
    </span>
  );
};
