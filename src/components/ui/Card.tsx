import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'bordered' | 'glass';
  hoverEffect?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  hoverEffect = false,
  className = '',
  ...props
}) => {
  const baseStyles = 'rounded-xl p-6 transition-all duration-300';
  
  const variants = {
    default: 'bg-zinc-900 border border-zinc-800/80 shadow-xl',
    bordered: 'bg-zinc-950 border border-zinc-700/80 shadow-md',
    glass: 'bg-zinc-900/60 backdrop-blur-md border border-zinc-800 shadow-2xl',
  };

  const hoverStyles = hoverEffect ? 'hover:border-zinc-700 hover:shadow-2xl hover:-translate-y-0.5' : '';

  return (
    <div className={`${baseStyles} ${variants[variant]} ${hoverStyles} ${className}`} {...props}>
      {children}
    </div>
  );
};
