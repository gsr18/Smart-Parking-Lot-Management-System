import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, RefreshCw, Trash2, ShieldAlert } from 'lucide-react';
import { watchlistService, WatchlistData } from '../services/watchlistService';
import { DataTable, Column } from '../components/common/DataTable';
import { Button } from '../components/common/Button';
import toast from 'react-hot-toast';

export const WatchlistPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [category, setCategory] = useState<'BLACK_LISTED' | 'VIP' | 'OUTSTANDING_DUES' | 'FREQUENT_VISITOR'>('BLACK_LISTED');
  const [reason, setReason] = useState('');
  const [dues, setDues] = useState<number>(0);

  const { data: watchlist, isLoading, refetch } = useQuery({
    queryKey: ['watchlist-company'],
    queryFn: watchlistService.getCompanyWatchlist,
  });

  const addMutation = useMutation({
    mutationFn: (dto: Partial<WatchlistData>) => watchlistService.addToWatchlist(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['watchlist-company'] });
      toast.success('Vehicle added to watchlist');
      setIsAddModalOpen(false);
      setVehicleNumber('');
      setReason('');
      setDues(0);
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to add vehicle to watchlist');
    },
  });

  const removeMutation = useMutation({
    mutationFn: (id: number) => watchlistService.removeFromWatchlist(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['watchlist-company'] });
      toast.success('Vehicle removed from watchlist');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to remove vehicle');
    },
  });

  const columns: Column<WatchlistData>[] = [
    {
      key: 'vehicleNumber',
      header: 'Vehicle Plate',
      sortable: true,
      render: (item) => <span className="font-mono font-bold text-[#0891b2] dark:text-[#38bdf8]">{item.vehicleNumber}</span>,
    },
    {
      key: 'category',
      header: 'Category Flag',
      sortable: true,
      render: (item) => (
        <span className={`px-2.5 py-0.5 rounded-full font-mono text-xs font-black uppercase tracking-wider ${
          item.category === 'BLACK_LISTED' ? 'bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-200 border border-rose-300 dark:border-rose-500/40' :
          item.category === 'VIP' ? 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-200 border border-amber-300 dark:border-amber-500/40' :
          item.category === 'OUTSTANDING_DUES' ? 'bg-orange-100 dark:bg-orange-950 text-orange-800 dark:text-orange-200 border border-orange-300 dark:border-orange-500/40' :
          'bg-[#cfeef1] dark:bg-[#133155] text-[#0e7490] dark:text-[#38bdf8] border border-[#9ed9db] dark:border-[#254d70]'
        }`}>
          {item.category}
        </span>
      ),
    },
    {
      key: 'reason',
      header: 'Watchlist Reason',
      render: (item) => <span className="text-[#0f172a] dark:text-white font-medium">{item.reason}</span>,
    },
    {
      key: 'outstandingDues',
      header: 'Outstanding Dues',
      align: 'right',
      render: (item) => (
        <span className="font-mono font-black text-rose-600 dark:text-rose-300">
          ₹{item.outstandingDues ? item.outstandingDues.toFixed(2) : '0.00'}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Action',
      align: 'right',
      render: (item) => (
        <Button
          variant="outline"
          size="sm"
          icon={Trash2}
          onClick={() => removeMutation.mutate(item.id)}
          className="border-rose-300 dark:border-rose-500/40 text-rose-700 dark:text-rose-300 hover:bg-rose-50 dark:hover:bg-rose-950/40"
        >
          Remove
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      {/* Controls Bar */}
      <div className="flex items-center justify-between gap-3 glass-panel p-3.5 rounded-3xl shadow-sm dark:shadow-[#080b38]/50 border border-[#9ed9db]/50 dark:border-[#522377]/40 bg-white/90 dark:bg-[#133155]/60">
        <div className="flex items-center gap-2 font-mono text-xs text-[#0e7490] dark:text-purple-300">
          <ShieldAlert className="w-4 h-4 text-amber-600 dark:text-amber-300" />
          <span>Flagged Vehicles Directory: <strong className="text-[#0f172a] dark:text-white font-black">{watchlist?.length || 0}</strong></span>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" icon={RefreshCw} onClick={() => refetch()}>
            Refresh
          </Button>
          <Button variant="primary" size="sm" icon={Plus} onClick={() => setIsAddModalOpen(true)}>
            Add to Watchlist
          </Button>
        </div>
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={watchlist || []}
        keyExtractor={(item) => item.id}
        isLoading={isLoading}
        searchPlaceholder="Search flagged plate number, reason..."
        emptyMessage="No vehicles on watchlist"
      />

      {/* ADD MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 dark:bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#080b38] border border-[#9ed9db] dark:border-[#522377] rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-3">
              <h3 className="text-base font-black text-[#0f172a] dark:text-white">Flag Vehicle on Watchlist</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:text-slate-300 dark:hover:text-white font-bold">✕</button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                addMutation.mutate({ vehicleNumber, category, reason, outstandingDues: dues });
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="block font-bold text-[#0f172a] dark:text-white mb-1">Vehicle Plate Number *</label>
                <input
                  type="text"
                  value={vehicleNumber}
                  onChange={(e) => setVehicleNumber(e.target.value.toUpperCase())}
                  placeholder="e.g. KA01AB1234"
                  className="w-full bg-white dark:bg-[#133155]/80 border border-slate-300 dark:border-[#254d70] rounded-2xl p-2.5 text-xs text-[#0f172a] dark:text-white focus:outline-none focus:border-[#0891b2] dark:focus:border-[#522377] font-mono uppercase"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-[#0f172a] dark:text-white mb-1">Watchlist Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full bg-white dark:bg-[#133155]/80 border border-slate-300 dark:border-[#254d70] rounded-2xl p-2.5 text-xs text-[#0f172a] dark:text-white focus:outline-none focus:border-[#0891b2] dark:focus:border-[#522377] font-mono"
                >
                  <option value="BLACK_LISTED">BLACK_LISTED (Deny Entry)</option>
                  <option value="OUTSTANDING_DUES">OUTSTANDING_DUES (Unpaid Dues)</option>
                  <option value="VIP">VIP (Priority Service)</option>
                  <option value="FREQUENT_VISITOR">FREQUENT_VISITOR (Loyalty)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-[#0f172a] dark:text-white mb-1">Outstanding Dues (₹)</label>
                <input
                  type="number"
                  value={dues}
                  onChange={(e) => setDues(Number(e.target.value))}
                  className="w-full bg-white dark:bg-[#133155]/80 border border-slate-300 dark:border-[#254d70] rounded-2xl p-2.5 text-xs text-[#0f172a] dark:text-white font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-[#0f172a] dark:text-white mb-1">Reason / Notes *</label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Explain why vehicle is flagged..."
                  className="w-full bg-white dark:bg-[#133155]/80 border border-slate-300 dark:border-[#254d70] rounded-2xl p-2.5 text-xs text-[#0f172a] dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-[#0891b2] dark:focus:border-[#522377]"
                  rows={3}
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 border-t border-slate-200 dark:border-white/10 pt-3">
                <Button variant="outline" size="sm" type="button" onClick={() => setIsAddModalOpen(false)}>
                  Cancel
                </Button>
                <Button variant="primary" size="sm" type="submit" isLoading={addMutation.isPending}>
                  Flag Vehicle
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
