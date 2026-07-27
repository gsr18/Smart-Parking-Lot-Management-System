import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, LayoutDashboard, ParkingSquare, Layers, Car, BarChart3, Bot, LogOut, X, ArrowRight } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { useParkingStore } from '../../store/useParkingStore';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenCheckIn: () => void;
  onOpenCheckOut: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onOpenCheckIn,
  onOpenCheckOut,
}) => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const { logout } = useAuthStore();
  const { toggleAiDrawer } = useParkingStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else setQuery('');
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const actions = [
    { id: 'checkin', title: 'Check In Vehicle', category: 'Actions', icon: ParkingSquare, run: () => { onClose(); onOpenCheckIn(); } },
    { id: 'checkout', title: 'Check Out Vehicle', category: 'Actions', icon: Car, run: () => { onClose(); onOpenCheckOut(); } },
    { id: 'ai', title: 'Ask AI Assistant', category: 'Actions', icon: Bot, run: () => { onClose(); toggleAiDrawer(); } },
    { id: 'dash', title: 'Go to Dashboard', category: 'Navigation', icon: LayoutDashboard, run: () => { onClose(); navigate('/'); } },
    { id: 'ops', title: 'Go to Operations Terminal', category: 'Navigation', icon: ParkingSquare, run: () => { onClose(); navigate('/parking'); } },
    { id: 'slots', title: 'Go to Parking Slots', category: 'Navigation', icon: Layers, run: () => { onClose(); navigate('/slots'); } },
    { id: 'vehicles', title: 'Go to Vehicle Directory', category: 'Navigation', icon: Car, run: () => { onClose(); navigate('/vehicles'); } },
    { id: 'reports', title: 'Go to Analytics Reports', category: 'Navigation', icon: BarChart3, run: () => { onClose(); navigate('/reports'); } },
    { id: 'logout', title: 'Sign Out of Enterprise System', category: 'Account', icon: LogOut, run: () => { onClose(); logout(); } },
  ];

  const filteredActions = actions.filter((act) =>
    act.title.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-start justify-center pt-20 p-4">
      <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-xl shadow-2xl overflow-hidden">
        {/* Search Header */}
        <div className="p-3 border-b border-slate-800 flex items-center gap-3">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command or search..."
            className="flex-1 bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none"
          />
          <button onClick={onClose} className="text-slate-500 dark:text-slate-400 hover:text-slate-300 p-1">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Command Options List */}
        <div className="max-h-80 overflow-y-auto p-2 space-y-1 divide-y divide-slate-800/40">
          {filteredActions.length === 0 ? (
            <div className="p-4 text-center text-xs text-slate-500 dark:text-slate-400 font-mono">No matching commands found</div>
          ) : (
            filteredActions.map((action) => (
              <button
                key={action.id}
                onClick={action.run}
                className="w-full flex items-center justify-between px-3 py-2 rounded-md text-xs text-slate-300 hover:bg-slate-800 hover:text-white transition-colors duration-150 group text-left"
              >
                <div className="flex items-center gap-2.5">
                  <action.icon className="w-4 h-4 text-slate-400 group-hover:text-indigo-400" />
                  <span>{action.title}</span>
                </div>
                <div className="flex items-center gap-2 text-[10px] text-slate-500 dark:text-slate-400">
                  <span className="uppercase tracking-wider font-mono">{action.category}</span>
                  <ArrowRight className="w-3 h-3 text-slate-600 dark:text-slate-300 group-hover:text-indigo-400" />
                </div>
              </button>
            ))
          )}
        </div>

        {/* Keyboard Hints Footer */}
        <div className="px-3 py-2 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 select-none">
          <span>SmartParking Quick Commands</span>
          <div className="flex items-center gap-2 font-mono text-[10px]">
            <span><kbd className="bg-slate-900 border border-slate-800 px-1 py-0.5 rounded text-slate-400">ESC</kbd> Close</span>
          </div>
        </div>
      </div>
    </div>
  );
};
