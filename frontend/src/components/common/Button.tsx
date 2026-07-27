import React from 'react';
import { clsx } from 'clsx';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  icon?: React.ElementType;
  shortcut?: string;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  icon: Icon,
  shortcut,
  className,
  disabled,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-bold rounded-2xl transition-all focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed select-none shadow-sm dark:shadow-[#080b38]/50 backdrop-blur-md';

  const variantStyles = {
    primary: 'bg-gradient-to-r from-[#0891b2] via-[#06b6d4] to-[#0284c7] hover:from-[#0e7490] hover:to-[#0369a1] text-white font-extrabold shadow-md shadow-cyan-600/20 border border-cyan-400/30 dark:bg-gradient-to-r dark:from-[#522377] dark:via-[#36195b] dark:to-[#254d70] dark:hover:from-[#652a93] dark:hover:to-[#2d5d88] dark:border-[#522377]/60 dark:shadow-purple-950/40',
    secondary: 'bg-[#fedeef] hover:bg-[#fbcfe8] text-[#9d174d] font-bold border border-pink-300/60 shadow-sm dark:shadow-[#080b38]/50 dark:bg-[#133155] dark:hover:bg-[#1b4372] dark:text-[#f5d0fe] dark:border-[#254d70]/60',
    outline: 'bg-white/80 dark:bg-[#133155]/60 hover:bg-[#cfeef1]/40 text-[#0f172a] dark:text-white border border-cyan-600/30 hover:border-[#0891b2] dark:bg-[#080b38]/60 dark:hover:bg-[#522377]/30 dark:text-[#f5d0fe] dark:border-[#522377]/50 dark:hover:border-[#522377]',
    ghost: 'bg-transparent hover:bg-cyan-50 text-[#0891b2] hover:text-[#0e7490] dark:hover:bg-white/10 dark:text-[#f5d0fe]',
    danger: 'bg-rose-100 hover:bg-rose-200 text-rose-700 border border-rose-300 dark:bg-rose-950/80 dark:hover:bg-rose-900 dark:text-rose-200 dark:border-rose-500/40',
  };

  const sizeStyles = {
    sm: 'px-3.5 py-1.5 text-xs gap-1.5 h-8',
    md: 'px-4 py-2 text-xs gap-2 h-9',
    lg: 'px-5 py-2.5 text-sm gap-2 h-10',
  };

  return (
    <button
      className={clsx(baseStyles, variantStyles[variant], sizeStyles[size], className)}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-3.5 h-3.5 animate-spin text-current" />
      ) : Icon ? (
        <Icon className="w-3.5 h-3.5" />
      ) : null}
      <span>{children}</span>
      {shortcut && (
        <kbd className="ml-1.5 px-1.5 py-0.5 text-[10px] font-mono font-bold bg-white/60 dark:bg-black/40 text-[#0f172a] dark:text-[#f5d0fe] rounded-md border border-slate-300 dark:border-white/10">
          {shortcut}
        </kbd>
      )}
    </button>
  );
};
