import React from 'react';
import { clsx } from 'clsx';

interface MetricTileProps {
  label: string;
  value: string | number;
  subtext?: string;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon?: React.ElementType;
  className?: string;
}

export const MetricTile: React.FC<MetricTileProps> = ({
  label,
  value,
  subtext,
  change,
  changeType = 'neutral',
  icon: Icon,
  className,
}) => {
  return (
    <div className={clsx('glass-panel glass-panel-hover rounded-2xl sm:rounded-3xl p-3 sm:p-5 flex flex-col justify-between shadow-md border border-[#9ed9db]/40 dark:border-[#522377]/40 bg-white/90 dark:bg-[#133155]/60', className)}>
      <div className="flex items-center justify-between gap-2">
        <span className="text-[10px] sm:text-[11px] font-black text-[#0e7490] dark:text-[#38bdf8] uppercase tracking-wider leading-tight">{label}</span>
        {Icon && (
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-[#cfeef1] dark:bg-[#522377]/40 border border-[#9ed9db] dark:border-[#522377] flex items-center justify-center text-[#0891b2] dark:text-[#f5d0fe] shrink-0">
            <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </div>
        )}
      </div>

      <div className="mt-2 sm:mt-3 flex items-baseline justify-between gap-2">
        <div className="text-xl sm:text-2xl font-black font-mono text-[#0f172a] dark:text-white tracking-tight drop-shadow-sm">{value}</div>

        {change && (
          <span
            className={clsx(
              'text-[10px] sm:text-[11px] font-bold font-mono px-1.5 sm:px-2 py-0.5 rounded-full border shadow-sm',
              changeType === 'positive' && 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-200 border-emerald-300 dark:border-emerald-500/40',
              changeType === 'negative' && 'bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-200 border-rose-300 dark:border-rose-500/40',
              changeType === 'neutral' && 'bg-[#cfeef1] dark:bg-[#36195b]/60 text-[#0e7490] dark:text-[#f5d0fe] border-[#9ed9db] dark:border-[#522377]'
            )}
          >
            {change}
          </span>
        )}
      </div>

      {subtext && <div className="mt-1 text-[10px] sm:text-[11px] text-[#475569] dark:text-slate-300 font-medium">{subtext}</div>}
    </div>
  );
};
