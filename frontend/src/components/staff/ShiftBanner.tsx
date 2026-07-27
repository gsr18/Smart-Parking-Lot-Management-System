import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Clock, Play, Square, UserCheck, ShieldCheck } from 'lucide-react';
import { shiftService } from '../../services/shiftService';
import { Button } from '../common/Button';
import { useAuthStore } from '../../store/useAuthStore';
import toast from 'react-hot-toast';

export const ShiftBanner: React.FC = () => {
  const { activeRole, user } = useAuthStore();
  const queryClient = useQueryClient();
  const [isEndModalOpen, setIsEndModalOpen] = useState(false);
  const [shiftNotes, setShiftNotes] = useState('');
  const [now, setNow] = useState<number>(Date.now());

  // Ticking timer for real-time live duration counter
  useEffect(() => {
    const timer = setInterval(() => {
      setNow(Date.now());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const { data: activeShift, isLoading } = useQuery({
    queryKey: ['shift-active'],
    queryFn: shiftService.getActiveShift,
    refetchInterval: 3000,
  });

  const startShiftMutation = useMutation({
    mutationFn: () => shiftService.startShift('Started gate shift'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shift-active'] });
      toast.success('Shift started successfully! Gate statistics are now tracking.');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to start shift');
    },
  });

  const endShiftMutation = useMutation({
    mutationFn: () => shiftService.endShift(shiftNotes),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['shift-active'] });
      setIsEndModalOpen(false);
      toast.success(`Shift ended! Duration: ${calculateDuration(data.startTime, data.endTime)}. Revenue: ₹${data.revenueCollected.toFixed(2)}`);
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to end shift');
    },
  });

  const calculateDuration = (start?: string, end?: string) => {
    if (!start) return '0h 0m 0s';
    const startTime = new Date(start).getTime();
    const endTime = end ? new Date(end).getTime() : now;
    const diffSecs = Math.max(0, Math.floor((endTime - startTime) / 1000));
    const hours = Math.floor(diffSecs / 3600);
    const mins = Math.floor((diffSecs % 3600) / 60);
    const secs = diffSecs % 60;
    return `${hours}h ${mins}m ${secs}s`;
  };

  if (isLoading) return null;

  const isAdmin = activeRole === 'ROLE_ADMIN';

  return (
    <>
      <div className="w-full glass-panel rounded-3xl p-4.5 flex flex-wrap items-center justify-between gap-3 shadow-md border border-[#9ed9db]/50 dark:border-[#522377]/40 bg-white/90 dark:bg-[#133155]/60">
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 rounded-2xl flex items-center justify-center font-black text-xs border ${
            isAdmin
              ? 'bg-indigo-100 dark:bg-indigo-950/80 text-indigo-800 dark:text-indigo-200 border-indigo-300 dark:border-indigo-500/40'
              : activeShift
              ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-200 border-emerald-300 dark:border-emerald-500/40'
              : 'bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-200 border-amber-300 dark:border-amber-500/40'
          }`}>
            {isAdmin ? <ShieldCheck className="w-5 h-5" /> : <UserCheck className="w-5 h-5" />}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-[#0f172a] dark:text-white tracking-wide">
                {isAdmin ? 'Administrator Status:' : 'Staff Shift Status:'}
              </span>
              <span className={`text-xs font-mono font-extrabold px-2.5 py-0.5 rounded-full border shadow-sm dark:shadow-[#080b38]/50 ${
                isAdmin
                  ? 'bg-indigo-100 dark:bg-indigo-950/80 text-indigo-800 dark:text-indigo-200 border-indigo-300 dark:border-indigo-500/40'
                  : activeShift
                  ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-200 border-emerald-300 dark:border-emerald-500/40'
                  : 'bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-200 border-amber-300 dark:border-amber-500/40'
              }`}>
                {isAdmin ? `● ADMIN CONSOLE ACTIVE (${user?.username || 'Admin'})` : activeShift ? '● SHIFT ACTIVE' : '○ SHIFT INACTIVE'}
              </span>
            </div>

            {activeShift && (
              <div className="flex flex-wrap items-center gap-2 sm:gap-4 mt-1 text-[10px] sm:text-[11px] font-mono text-[#0e7490] dark:text-purple-300">
                <span>Live: <strong className="text-[#0f172a] dark:text-white">{calculateDuration(activeShift.startTime)}</strong></span>
                <span>In: <strong className="text-[#0891b2] dark:text-[#38bdf8]">{activeShift.checkinsCount}</strong></span>
                <span>Out: <strong className="text-[#db2777] dark:text-pink-300">{activeShift.checkoutsCount}</strong></span>
                <span>Rev: <strong className="text-emerald-700 dark:text-emerald-300 font-black">₹{activeShift.revenueCollected.toFixed(2)}</strong></span>
              </div>
            )}

            {!activeShift && !isAdmin && (
              <div className="text-[11px] font-mono text-amber-700 dark:text-amber-300 mt-0.5">
                Click "Start Shift" to begin gate attendance & track shift revenue.
              </div>
            )}
          </div>
        </div>

        <div>
          {activeShift ? (
            <Button
              variant="outline"
              size="sm"
              icon={Square}
              onClick={() => setIsEndModalOpen(true)}
              className="border-rose-300 dark:border-rose-500/40 text-rose-700 dark:text-rose-300 hover:bg-rose-50 dark:hover:bg-rose-950/50"
            >
              End Shift Summary
            </Button>
          ) : (
            <Button
              variant="primary"
              size="sm"
              icon={Play}
              onClick={() => startShiftMutation.mutate()}
              isLoading={startShiftMutation.isPending}
            >
              Start Shift
            </Button>
          )}
        </div>
      </div>

      {/* END SHIFT SUMMARY MODAL */}
      {isEndModalOpen && activeShift && (
        <div className="fixed inset-0 bg-slate-900/40 dark:bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#080b38] border border-[#9ed9db] dark:border-[#522377] rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center gap-2 border-b border-slate-200 dark:border-white/10 pb-3">
              <Clock className="w-5 h-5 text-[#0891b2] dark:text-[#38bdf8]" />
              <h3 className="text-base font-black text-[#0f172a] dark:text-white">Shift Summary & End Confirmation</h3>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs font-mono">
              <div className="bg-[#f3f9fc] dark:bg-[#133155]/60 p-3 rounded-2xl border border-slate-200 dark:border-[#254d70]">
                <span className="text-slate-500 dark:text-slate-300 block">Shift Duration</span>
                <span className="text-base font-black text-[#0f172a] dark:text-white">{calculateDuration(activeShift.startTime)}</span>
              </div>
              <div className="bg-[#f3f9fc] dark:bg-[#133155]/60 p-3 rounded-2xl border border-slate-200 dark:border-[#254d70]">
                <span className="text-slate-500 dark:text-slate-300 block">Revenue Collected</span>
                <span className="text-base font-black text-emerald-700 dark:text-emerald-300">₹{activeShift.revenueCollected.toFixed(2)}</span>
              </div>
              <div className="bg-[#f3f9fc] dark:bg-[#133155]/60 p-3 rounded-2xl border border-slate-200 dark:border-[#254d70]">
                <span className="text-slate-500 dark:text-slate-300 block">Vehicles Checked In</span>
                <span className="text-base font-black text-[#0891b2] dark:text-[#38bdf8]">{activeShift.checkinsCount}</span>
              </div>
              <div className="bg-[#f3f9fc] dark:bg-[#133155]/60 p-3 rounded-2xl border border-slate-200 dark:border-[#254d70]">
                <span className="text-slate-500 dark:text-slate-300 block">Vehicles Checked Out</span>
                <span className="text-base font-black text-[#db2777] dark:text-pink-300">{activeShift.checkoutsCount}</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#0f172a] dark:text-white mb-1">Shift Handover Notes (Optional)</label>
              <textarea
                value={shiftNotes}
                onChange={(e) => setShiftNotes(e.target.value)}
                placeholder="Enter gate notes, issue handover, cash summary..."
                className="w-full bg-white dark:bg-[#133155]/80 border border-slate-300 dark:border-[#254d70] rounded-2xl p-3 text-xs text-[#0f172a] dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-[#0891b2] dark:focus:border-[#522377] font-sans"
                rows={3}
              />
            </div>

            <div className="flex items-center justify-end gap-2 border-t border-slate-200 dark:border-white/10 pt-3">
              <Button variant="outline" size="sm" onClick={() => setIsEndModalOpen(false)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => endShiftMutation.mutate()}
                isLoading={endShiftMutation.isPending}
                className="bg-rose-600 hover:bg-rose-700 text-white font-bold"
              >
                Confirm & End Shift
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
