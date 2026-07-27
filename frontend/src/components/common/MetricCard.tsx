import React from 'react';
import { LucideIcon } from 'lucide-react';
import { clsx } from 'clsx';
import { motion } from 'framer-motion';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  accentColor?: 'emerald' | 'indigo' | 'amber' | 'cyan' | 'purple';
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  accentColor = 'indigo',
}) => {
  const getGlow = () => {
    switch (accentColor) {
      case 'emerald': return 'border-emerald-500/20 hover:border-emerald-500/40 text-emerald-400 bg-emerald-500/10';
      case 'amber': return 'border-amber-500/20 hover:border-amber-500/40 text-amber-400 bg-amber-500/10';
      case 'cyan': return 'border-cyan-500/20 hover:border-cyan-500/40 text-cyan-400 bg-cyan-500/10';
      case 'purple': return 'border-purple-500/20 hover:border-purple-500/40 text-purple-400 bg-purple-500/10';
      default: return 'border-indigo-500/20 hover:border-indigo-500/40 text-indigo-400 bg-indigo-500/10';
    }
  };

  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      className="glass-card rounded-2xl p-6 relative overflow-hidden group transition-all duration-300"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-slate-400">{title}</p>
          <h3 className="text-2xl lg:text-3xl font-bold text-white mt-2 tracking-tight">{value}</h3>
          {subtitle && <p className="text-xs text-slate-400 mt-1">{subtitle}</p>}
        </div>
        <div className={clsx('p-3.5 rounded-xl border transition-transform duration-300 group-hover:scale-110', getGlow())}>
          <Icon className="w-6 h-6" />
        </div>
      </div>

      {trend && (
        <div className="mt-4 flex items-center gap-1.5 text-xs font-medium">
          <span className={trend.isPositive ? 'text-emerald-400' : 'text-rose-400'}>
            {trend.isPositive ? '↑' : '↓'} {trend.value}
          </span>
          <span className="text-slate-500 dark:text-slate-400">vs previous period</span>
        </div>
      )}
    </motion.div>
  );
};
