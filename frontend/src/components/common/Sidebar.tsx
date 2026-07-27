import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Car, ParkingSquare, BarChart3, Bot, LogOut, Layers } from 'lucide-react';
import { clsx } from 'clsx';
import { useAuthStore } from '../../store/useAuthStore';
import { useParkingStore } from '../../store/useParkingStore';

export const Sidebar: React.FC = () => {
  const { user, logout } = useAuthStore();
  const { toggleAiDrawer } = useParkingStore();

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Operations', path: '/parking', icon: ParkingSquare },
    { label: 'Parking Slots', path: '/slots', icon: Layers },
    { label: 'Vehicle Directory', path: '/vehicles', icon: Car },
    { label: 'Analytics & Reports', path: '/reports', icon: BarChart3 },
  ];

  return (
    <aside className="w-[220px] bg-slate-900 border-r border-slate-800 flex flex-col h-screen fixed left-0 top-0 z-30 select-none">
      {/* Brand Header */}
      <div className="h-14 px-4 border-b border-slate-800 flex items-center gap-2.5">
        <div className="w-7 h-7 rounded bg-indigo-600 flex items-center justify-center text-white">
          <ParkingSquare className="w-4 h-4" />
        </div>
        <div>
          <div className="font-bold text-xs text-white leading-none tracking-tight">SmartParking</div>
          <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">Enterprise v2.0</span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-2 space-y-0.5 overflow-y-auto">
        <div className="px-2 pt-2 pb-1 text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Navigation</div>
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              clsx(
                'flex items-center gap-2.5 px-2.5 py-2 rounded text-xs font-medium transition-colors relative',
                isActive
                  ? 'bg-slate-800 text-white font-semibold border-l-2 border-indigo-500'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50'
              )
            }
          >
            <item.icon className="w-4 h-4 text-slate-400" />
            <span>{item.label}</span>
          </NavLink>
        ))}

        <div className="pt-4 px-2 pb-1 text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">AI Intelligence</div>
        <button
          onClick={toggleAiDrawer}
          className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded text-xs font-medium text-emerald-400 hover:bg-slate-800/50 transition-colors text-left"
        >
          <Bot className="w-4 h-4 text-emerald-400" />
          <span>AI Assistant</span>
        </button>
      </nav>

      {/* Compact User Footer */}
      <div className="p-3 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between">
        <div className="truncate pr-2">
          <div className="text-xs font-semibold text-white truncate">{user?.fullName || 'Operator'}</div>
          <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono truncate">{user?.companyName || user?.username || 'admin'}</div>
        </div>
        <button
          onClick={logout}
          title="Sign Out"
          className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-rose-400 transition-colors"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
};
