import React from 'react';
import { clsx } from 'clsx';

interface SkeletonProps {
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className }) => {
  return (
    <div
      className={clsx(
        'animate-pulse rounded-xl bg-slate-800/60 border border-slate-700/40',
        className
      )}
    />
  );
};
