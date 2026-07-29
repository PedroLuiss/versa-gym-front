import React, { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, leftIcon, className = '', ...props }, ref) => {
    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label className="block text-xs font-medium text-zinc-300">
            {label}
          </label>
        )}
        <div className="relative rounded-lg shadow-sm">
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-400">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            className={`w-full bg-zinc-900 border ${
              error ? 'border-red-500 focus:ring-red-500' : 'border-zinc-800 focus:border-emerald-500 focus:ring-emerald-500/20'
            } ${
              leftIcon ? 'pl-10' : 'pl-3.5'
            } pr-3.5 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 ${className}`}
            {...props}
          />
        </div>
        {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
