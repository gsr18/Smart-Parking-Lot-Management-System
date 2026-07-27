import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate, NavLink } from 'react-router-dom';
import {
  ParkingSquare, Search, Bot, Shield, UserCheck, Building2, LayoutDashboard, Layers, Car, BarChart3, LogOut, ChevronDown, Menu, X, ShieldAlert, Sun, Moon
} from 'lucide-react';
import { useParkingStore } from '../../store/useParkingStore';
import { useAuthStore } from '../../store/useAuthStore';

interface HeaderProps {
  onOpenCommandPalette: () => void;
  onOpenCheckIn: () => void;
  onOpenCheckOut: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenCommandPalette,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toggleAiDrawer, theme, toggleTheme } = useParkingStore();
  const { user, activeRole, switchRole, logout } = useAuthStore();

  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const isAdminUser = user?.roles.includes('ROLE_ADMIN');

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const adminNavItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Operations', path: '/parking', icon: ParkingSquare },
    { label: 'Slots', path: '/slots', icon: Layers },
    { label: 'Vehicles', path: '/vehicles', icon: Car },
    { label: 'Reports', path: '/reports', icon: BarChart3 },
    { label: 'Watchlist', path: '/watchlist', icon: ShieldAlert },
  ];

  const staffNavItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Operations', path: '/parking', icon: ParkingSquare },
    { label: 'Slots', path: '/slots', icon: Layers },
    { label: 'Vehicles', path: '/vehicles', icon: Car },
  ];

  const currentNavItems = activeRole === 'ROLE_ADMIN' ? adminNavItems : staffNavItems;

  return (
    <header className="h-16 glass-panel border-b flex items-center justify-between px-4 xl:px-6 sticky top-0 z-40 select-none shadow-sm dark:shadow-[#080b38]/50 transition-all duration-300">
      {/* 1. BRAND LOGO WITH RIGHT DIVIDER */}
      <div className="flex items-center shrink-0 pr-2 sm:pr-4 xl:pr-6 border-r border-slate-200 dark:border-[#522377]/50 mr-1 sm:mr-2 xl:mr-4">
        <div
          className="flex items-center gap-2 cursor-pointer group"
          onClick={() => navigate('/dashboard')}
        >
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-[#0891b2] via-[#06b6d4] to-pink-500 dark:from-[#522377] dark:via-[#36195b] dark:to-[#254d70] flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-all duration-300 border border-white/30">
            <ParkingSquare className="w-5 h-5 font-black" />
          </div>
          <span className="hidden sm:inline font-black text-base tracking-tight text-[#0f172a] dark:text-white">SmartParking</span>
        </div>
      </div>

      {/* 2. EVENLY CENTERED COMPACT NAVIGATION LINKS */}
      <nav className="hidden lg:flex items-center justify-center gap-1 xl:gap-2 flex-1 mx-1 xl:mx-2 min-w-0">
        {currentNavItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={`whitespace-nowrap px-2.5 xl:px-3.5 py-1.5 xl:py-2 rounded-2xl text-xs font-bold flex items-center gap-1.5 xl:gap-2 transition-all duration-200 ${
                isActive
                  ? 'bg-gradient-to-r from-[#0891b2] to-[#06b6d4] dark:from-[#522377] dark:to-[#36195b] text-white font-extrabold shadow-md scale-[1.02]'
                  : 'text-slate-600 dark:text-slate-200 hover:text-slate-900 dark:text-white dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 border border-transparent'
              }`}
            >
              <item.icon className={`w-3.5 h-3.5 xl:w-4 xl:h-4 ${isActive ? 'text-white' : 'text-[#0891b2] dark:text-[#38bdf8]'}`} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* 3. RIGHT ACTIONS WITH LIGHT/DARK THEME SWITCHER & AI LOGO */}
      <div className="flex items-center gap-2 shrink-0 pl-2 xl:pl-4 border-l border-slate-200 dark:border-[#522377]/50 ml-1 xl:ml-2">
        {/* LIGHT / DARK THEME TOGGLE BUTTON */}
        <button
          onClick={toggleTheme}
          title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
          aria-label="Toggle Theme"
          className="p-2 rounded-2xl bg-slate-100 dark:bg-[#133155]/80 border border-slate-200 dark:border-[#254d70] text-slate-700 dark:text-[#38bdf8] hover:bg-slate-200 dark:hover:bg-[#133155] transition-all duration-200 shadow-sm dark:shadow-[#080b38]/50 shrink-0"
        >
          {theme === 'light' ? (
            <Moon className="w-4 h-4 text-purple-600" />
          ) : (
            <Sun className="w-4 h-4 text-amber-400" />
          )}
        </button>

        {/* AI Assistant Understandable Logo Button */}
        <button
          onClick={toggleAiDrawer}
          title="AI Assistant - Smart Parking Helper"
          aria-label="AI Assistant"
          className="relative p-2 rounded-2xl bg-[#cfeef1]/60 dark:bg-[#133155]/80 border border-[#9ed9db] dark:border-[#254d70] text-[#0891b2] dark:text-[#38bdf8] hover:bg-[#cfeef1] dark:hover:bg-[#133155] hover:scale-105 transition-all duration-200 shadow-sm dark:shadow-[#080b38]/50 group shrink-0 backdrop-blur-md"
        >
          <Bot className="w-4 h-4" />
          <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-cyan-500" />
        </button>

        {/* User Profile Circle */}
        <div className="relative shrink-0" ref={menuRef}>
          <button
            onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white dark:bg-[#133155]/90 border border-slate-200 dark:border-[#254d70] text-xs text-slate-900 dark:text-white transition-all duration-200 shadow-sm dark:shadow-[#080b38]/50 shrink-0 backdrop-blur-md hover:border-[#0891b2] dark:hover:border-[#38bdf8]"
          >
            <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#0891b2] to-[#06b6d4] dark:from-[#522377] dark:to-[#36195b] text-white flex items-center justify-center font-black text-xs shadow-inner shrink-0">
              {user?.username ? user.username.charAt(0).toUpperCase() : 'U'}
            </div>
            <span className="hidden sm:inline font-mono font-bold text-[#0f172a] dark:text-white max-w-[80px] xl:max-w-[120px] truncate">
              @{user?.username || 'user'}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          </button>

          {/* Floating Profile Menu */}
          {isProfileMenuOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-[#080b38] border border-slate-200 dark:border-[#522377]/60 backdrop-blur-2xl rounded-2xl shadow-2xl p-3 z-50 text-xs space-y-2">
              <div className="px-3 py-2 bg-slate-50 dark:bg-[#133155]/50 rounded-xl border border-slate-200 dark:border-[#254d70]/60">
                <div className="font-bold text-[#0f172a] dark:text-white truncate">{user?.fullName || 'Operator'}</div>
                <div className="text-[11px] text-[#0891b2] dark:text-[#38bdf8] font-mono font-bold truncate">@{user?.username}</div>
                <div className="mt-1.5 flex items-center justify-between">
                  <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-cyan-50 dark:bg-[#36195b]/60 border border-cyan-200 dark:border-[#522377]/50 text-[10px] text-[#0e7490] dark:text-[#f5d0fe] font-mono">
                    <Building2 className="w-3 h-3 text-[#0891b2] dark:text-purple-300" />
                    <span className="truncate">{user?.companyName || 'Organization'}</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded-lg font-mono text-[10px] font-bold ${
                    activeRole === 'ROLE_ADMIN' ? 'bg-[#fedeef] text-[#9d174d] dark:bg-[#522377] dark:text-white border border-pink-300 dark:border-[#522377]' : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-500/40'
                  }`}>
                    {activeRole === 'ROLE_ADMIN' ? 'ADMIN' : 'STAFF'}
                  </span>
                </div>
              </div>

              {/* Admin Role Switcher inside Profile Dropdown */}
              {isAdminUser && (
                <div className="px-1 py-1 space-y-1">
                  <div className="text-[10px] font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider px-1">Switch Operating Role</div>
                  <div className="grid grid-cols-2 gap-1 bg-slate-100 dark:bg-[#080b38] p-1 rounded-xl border border-slate-200 dark:border-[#522377]/40">
                    <button
                      onClick={() => {
                        switchRole('ROLE_ADMIN');
                        setIsProfileMenuOpen(false);
                        navigate('/dashboard');
                      }}
                      className={`flex items-center justify-center gap-1 py-1.5 rounded-lg text-[11px] font-bold transition-all ${
                        activeRole === 'ROLE_ADMIN'
                          ? 'bg-[#0891b2] dark:bg-[#522377] text-white shadow-sm dark:shadow-[#080b38]/50 font-black'
                          : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:text-white dark:hover:text-white'
                      }`}
                    >
                      <Shield className="w-3.5 h-3.5" />
                      <span>Admin</span>
                    </button>
                    <button
                      onClick={() => {
                        switchRole('ROLE_STAFF');
                        setIsProfileMenuOpen(false);
                        navigate('/dashboard');
                      }}
                      className={`flex items-center justify-center gap-1 py-1.5 rounded-lg text-[11px] font-bold transition-all ${
                        activeRole === 'ROLE_STAFF'
                          ? 'bg-emerald-600 text-white shadow-sm dark:shadow-[#080b38]/50 font-black'
                          : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:text-white dark:hover:text-white'
                      }`}
                    >
                      <UserCheck className="w-3.5 h-3.5" />
                      <span>Staff</span>
                    </button>
                  </div>
                </div>
              )}

              <div className="border-t border-slate-200 dark:border-[#522377]/40 pt-1 space-y-0.5">
                <button
                  onClick={() => {
                    setIsProfileMenuOpen(false);
                    onOpenCommandPalette();
                  }}
                  className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl hover:bg-slate-100 dark:bg-[#133155]/80 dark:hover:bg-[#522377]/30 text-slate-700 dark:text-slate-200 transition-colors font-medium"
                >
                  <span className="flex items-center gap-2">
                    <Search className="w-3.5 h-3.5 text-slate-400" />
                    <span>Command Palette</span>
                  </span>
                  <kbd className="px-1 py-0.2 rounded-md bg-slate-100 dark:bg-[#080b38] border border-slate-200 dark:border-[#522377]/40 text-[10px] text-slate-500 dark:text-slate-400 font-mono">⌘K</kbd>
                </button>

                <button
                  onClick={() => {
                    setIsProfileMenuOpen(false);
                    logout();
                  }}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/50 text-rose-600 dark:text-rose-300 transition-colors font-bold"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="lg:hidden p-1.5 rounded-xl bg-white dark:bg-[#133155] border border-slate-200 dark:border-[#254d70] text-slate-600 dark:text-white"
        >
          {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed top-16 left-0 right-0 bg-white dark:bg-[#080b38] border-b border-slate-200 dark:border-[#522377]/50 p-4 space-y-2 z-50 text-xs select-none shadow-xl">
          {currentNavItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setIsMobileMenuOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl font-bold transition-all ${
                  isActive ? 'bg-[#0891b2] dark:bg-[#522377] text-white font-black shadow-md' : 'text-slate-600 dark:text-slate-200'
                }`
              }
            >
              <item.icon className="w-4 h-4" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </div>
      )}
    </header>
  );
};
