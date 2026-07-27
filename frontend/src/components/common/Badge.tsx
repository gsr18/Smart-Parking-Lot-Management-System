import React from 'react';
import { clsx } from 'clsx';

interface BadgeProps {
  variant: string;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ variant, className }) => {
  const getStyles = (type: string) => {
    switch (type.toUpperCase()) {
      case 'AVAILABLE':
        return 'bg-[#cfeef1] text-[#0e7490] border-[#9ed9db] dark:bg-[#133155] dark:text-[#38bdf8] dark:border-[#254d70] shadow-sm dark:shadow-[#080b38]/50';
      case 'OCCUPIED':
        return 'bg-[#fedeef] text-[#9d174d] border-pink-300 dark:bg-[#522377]/60 dark:text-[#f5d0fe] dark:border-[#522377] shadow-sm dark:shadow-[#080b38]/50';
      case 'MAINTENANCE':
      case 'OUT_OF_SERVICE':
        return 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950/80 dark:text-amber-200 dark:border-amber-500/40';
      case 'ACTIVE':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950/80 dark:text-emerald-200 dark:border-emerald-500/40';
      case 'COMPLETED':
        return 'bg-cyan-50 text-cyan-800 border-cyan-200 dark:bg-[#36195b]/60 dark:text-[#f5d0fe] dark:border-[#522377]';
      case 'CANCELLED':
        return 'bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-950/80 dark:text-rose-200 dark:border-rose-500/40';
      case 'CAR':
        return 'bg-[#fedeef] text-[#9d174d] border-pink-300 dark:bg-[#522377]/60 dark:text-[#f5d0fe] dark:border-[#522377]';
      case 'BIKE':
        return 'bg-[#cfeef1] text-[#0e7490] border-[#9ed9db] dark:bg-[#133155] dark:text-[#38bdf8] dark:border-[#254d70]';
      case 'TRUCK':
        return 'bg-sky-100 text-sky-800 border-sky-300 dark:bg-[#254d70]/60 dark:text-[#f5d0fe] dark:border-[#254d70]';
      default:
        return 'bg-slate-100 dark:bg-[#133155]/80 text-slate-800 dark:text-slate-200 border-slate-300 dark:bg-[#133155] dark:text-slate-200 dark:border-[#254d70]';
    }
  };

  return (
    <span
      className={clsx(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-mono font-extrabold uppercase tracking-wider border select-none backdrop-blur-md',
        getStyles(variant),
        className
      )}
    >
      {variant}
    </span>
  );
};
