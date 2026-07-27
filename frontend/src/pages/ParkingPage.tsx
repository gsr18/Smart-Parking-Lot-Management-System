import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Plus, CheckSquare, RefreshCw, FileText } from 'lucide-react';
import { parkingService } from '../services/parkingService';
import { DataTable, Column } from '../components/common/DataTable';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { CheckInModal } from '../components/parking/CheckInModal';
import { CheckOutModal } from '../components/parking/CheckOutModal';
import { ReceiptModal } from '../components/parking/ReceiptModal';
import { CheckOutResponse, ParkingSession } from '../types';

import { useAuthStore } from '../store/useAuthStore';

export const ParkingPage: React.FC = () => {
  const { activeRole } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'active' | 'history'>('active');
  const [isCheckInOpen, setIsCheckInOpen] = useState(false);
  const [isCheckOutOpen, setIsCheckOutOpen] = useState(false);
  const [activeReceipt, setActiveReceipt] = useState<CheckOutResponse | null>(null);

  const { data: activeSessions, isLoading: isActiveLoading, refetch: refetchActive } = useQuery({
    queryKey: ['parking-active-sessions'],
    queryFn: parkingService.getActiveSessions,
    refetchInterval: 5000,
  });

  const { data: historySessions, isLoading: isHistoryLoading, refetch: refetchHistory } = useQuery({
    queryKey: ['parking-session-history'],
    queryFn: () => parkingService.getParkingHistory(),
    refetchInterval: 5000,
  });

  const handleRefresh = () => {
    refetchActive();
    refetchHistory();
  };

  const columns: Column<any>[] = [
    {
      key: 'id',
      header: 'Session ID',
      width: '100px',
      sortable: true,
      render: (item) => <span className="font-mono font-bold text-[#0f172a] dark:text-white">#{item.id || item.sessionId}</span>,
    },
    {
      key: 'vehicleNumber',
      header: 'Vehicle Plate',
      sortable: true,
      render: (item) => (
        <span className="font-mono font-extrabold text-[#0891b2] dark:text-[#38bdf8]">
          {item.vehicle?.registrationNumber || item.vehicleNumber || 'N/A'}
        </span>
      ),
    },
    {
      key: 'ownerName',
      header: 'Owner / Contact',
      render: (item) => (
        <div>
          <div className="font-bold text-[#0f172a] dark:text-white">{item.ownerName || 'Guest Owner'}</div>
          <div className="text-[10px] font-mono text-slate-500 dark:text-slate-400">{item.ownerContact || 'N/A'}</div>
        </div>
      ),
    },
    {
      key: 'slotNumber',
      header: 'Slot ID',
      sortable: true,
      render: (item) => (
        <span className="font-mono text-[#0f172a] dark:text-[#f5d0fe] font-black">{item.slot?.slotNumber || item.slotNumber || 'A-101'}</span>
      ),
    },
    {
      key: 'vehicleType',
      header: 'Vehicle Type',
      render: (item) => <Badge variant={item.vehicle?.vehicleType || item.vehicleType || 'CAR'} />,
    },
    {
      key: 'staffName',
      header: 'Performed By Staff',
      sortable: true,
      render: (item) => (
        <div>
          <div className="font-bold text-[#0f172a] dark:text-white">
            {item.staffName || (activeRole === 'ROLE_ADMIN' ? 'Admin / System' : 'Shift Staff')}
          </div>
          {item.staffId && (
            <div className="text-[10px] font-mono text-[#0891b2] dark:text-[#38bdf8] font-bold">
              ID: #{item.staffId}
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'entryTime',
      header: 'Entry Time',
      sortable: true,
      render: (item) => (
        <span className="font-mono text-xs text-slate-600 dark:text-slate-300">
          {item.entryTime ? new Date(item.entryTime).toLocaleTimeString() : 'N/A'}
        </span>
      ),
    },
    ...(activeTab === 'history'
      ? [
          {
            key: 'exitTime',
            header: 'Exit Time',
            sortable: true,
            render: (item: any) => (
              <span className="font-mono text-xs text-slate-600 dark:text-slate-300">
                {item.exitTime ? new Date(item.exitTime).toLocaleTimeString() : 'N/A'}
              </span>
            ),
          },
          {
            key: 'parkingFee',
            header: 'Fee Collected',
            sortable: true,
            render: (item: any) => (
              <span className="font-mono font-extrabold text-emerald-600 dark:text-emerald-400">
                {item.parkingFee != null ? `₹${item.parkingFee.toFixed(2)}` : '₹0.00'}
              </span>
            ),
          },
        ]
      : []),
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      render: (item) => <Badge variant={item.status || (activeTab === 'history' ? 'COMPLETED' : 'ACTIVE')} />,
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right',
      render: (item) =>
        item.status === 'ACTIVE' ? (
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setIsCheckOutOpen(true)}
          >
            Check Out ➔
          </Button>
        ) : (
          <Button
            variant="outline"
            size="sm"
            icon={FileText}
            onClick={() => {
              setActiveReceipt({
                receiptNumber: `RCPT-${10000 + item.id}`,
                vehicleNumber: item.vehicle?.registrationNumber || 'N/A',
                slotNumber: item.slot?.slotNumber || 'A-101',
                ownerName: item.ownerName || 'Guest',
                ownerContact: item.ownerContact || 'N/A',
                entryTime: item.entryTime,
                exitTime: item.exitTime || new Date().toISOString(),
                durationMinutes: item.durationMinutes || 120,
                parkingFee: item.parkingFee || 100.0,
              });
            }}
          >
            Receipt
          </Button>
        ),
    },
  ];

  return (
    <div className="space-y-4">
      {/* Header Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 glass-panel p-3.5 rounded-3xl shadow-sm dark:shadow-[#080b38]/50 border border-[#9ed9db]/50 dark:border-[#522377]/40 bg-white/90 dark:bg-[#133155]/60">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-[#f3f9fc] dark:bg-[#080b38] p-1 rounded-2xl border border-[#9ed9db]/40 dark:border-[#522377]/50 select-none">
            <button
              onClick={() => setActiveTab('active')}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-xl font-mono transition-all ${
                activeTab === 'active'
                  ? 'bg-[#0891b2] dark:bg-[#522377] text-white shadow-sm dark:shadow-[#080b38]/50 font-black'
                  : 'text-[#0e7490] dark:text-slate-300 hover:text-[#0f172a] dark:text-white dark:hover:text-white'
              }`}
            >
              Active Sessions ({activeSessions?.length || 0})
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-xl font-mono transition-all ${
                activeTab === 'history'
                  ? 'bg-[#0891b2] dark:bg-[#522377] text-white shadow-sm dark:shadow-[#080b38]/50 font-black'
                  : 'text-[#0e7490] dark:text-slate-300 hover:text-[#0f172a] dark:text-white dark:hover:text-white'
              }`}
            >
              Completed History
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" icon={RefreshCw} onClick={handleRefresh}>
            Refresh
          </Button>
          <Button variant="primary" size="sm" icon={Plus} onClick={() => setIsCheckInOpen(true)}>
            Check In <kbd className="ml-1 text-[10px] opacity-75 font-mono">N</kbd>
          </Button>
          <Button variant="outline" size="sm" icon={CheckSquare} onClick={() => setIsCheckOutOpen(true)}>
            Check Out <kbd className="ml-1 text-[10px] opacity-75 font-mono">C</kbd>
          </Button>
        </div>
      </div>

      {/* Main Table */}
      <DataTable
        columns={columns}
        data={activeTab === 'active' ? activeSessions || [] : historySessions || []}
        keyExtractor={(item) => item.id}
        isLoading={activeTab === 'active' ? isActiveLoading : isHistoryLoading}
        searchPlaceholder="Filter sessions by vehicle plate, slot, owner..."
        exportable={activeTab === 'history'}
        onExport={() => alert('Exporting sessions CSV...')}
        emptyMessage={
          activeTab === 'active'
            ? 'No active parking sessions'
            : 'No completed session history'
        }
      />

      {/* Modals */}
      <CheckInModal
        isOpen={isCheckInOpen}
        onClose={() => setIsCheckInOpen(false)}
        onSuccess={handleRefresh}
      />

      <CheckOutModal
        isOpen={isCheckOutOpen}
        onClose={() => setIsCheckOutOpen(false)}
        onSuccess={(receipt) => {
          handleRefresh();
          setActiveReceipt(receipt);
        }}
      />

      <ReceiptModal
        isOpen={!!activeReceipt}
        onClose={() => setActiveReceipt(null)}
        receipt={activeReceipt}
      />
    </div>
  );
};
