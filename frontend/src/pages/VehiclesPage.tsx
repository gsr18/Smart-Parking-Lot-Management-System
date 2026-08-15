import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Plus, RefreshCw, ParkingSquare, CheckSquare } from 'lucide-react';
import { vehicleService } from '../services/vehicleService';
import { DataTable, Column } from '../components/common/DataTable';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { CheckOutResponse, Vehicle } from '../types';
import { CheckInModal } from '../components/parking/CheckInModal';
import { CheckOutModal } from '../components/parking/CheckOutModal';
import { ReceiptModal } from '../components/parking/ReceiptModal';

export const VehiclesPage: React.FC = () => {
  const [isCheckInOpen, setIsCheckInOpen] = useState(false);
  const [isCheckOutOpen, setIsCheckOutOpen] = useState(false);
  const [prefilledPlate, setPrefilledPlate] = useState('');
  const [prefilledSlot, setPrefilledSlot] = useState('');
  const [activeReceipt, setActiveReceipt] = useState<CheckOutResponse | null>(null);

  const { data: vehicles, isLoading, refetch } = useQuery({
    queryKey: ['vehicles-all'],
    queryFn: () => vehicleService.getAllVehicles(),
  });

  const columns: Column<Vehicle>[] = [
    {
      key: 'vehicleNumber',
      header: 'Vehicle Plate',
      sortable: true,
      render: (item) => (
        <span className="font-mono font-bold text-[#0891b2] dark:text-[#38bdf8]">
          {item.vehicleNumber || item.registrationNumber || 'N/A'}
        </span>
      ),
    },
    {
      key: 'vehicleType',
      header: 'Type',
      sortable: true,
      render: (item) => <Badge variant={item.vehicleType} />,
    },
    {
      key: 'ownerName',
      header: 'Owner Name',
      sortable: true,
      render: (item) => <span className="font-semibold text-slate-700 dark:text-slate-200">{item.ownerName}</span>,
    },
    {
      key: 'ownerContact',
      header: 'Owner Contact',
      render: (item) => <span className="font-mono text-slate-500 dark:text-slate-400">{item.ownerContact}</span>,
    },
    {
      key: 'currentlyParked',
      header: 'Status',
      sortable: true,
      render: (item) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-bold ${
            item.currentlyParked
              ? 'bg-[#ecfdf5] dark:bg-emerald-950/30 text-[#10b981] border border-[#10b981]/20'
              : 'bg-[#f8fafc] dark:bg-slate-900/30 text-slate-400 border border-slate-200 dark:border-slate-800'
          }`}
        >
          {item.currentlyParked ? 'PARKED' : 'EXITED'}
        </span>
      ),
    },
    {
      key: 'activeSlotNumber',
      header: 'Slot',
      render: (item) => (
        <span className="font-mono font-bold text-slate-700 dark:text-slate-300">
          {item.currentlyParked ? item.activeSlotNumber : '-'}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Quick Action',
      render: (item) =>
        item.currentlyParked ? (
          <Button
            variant="outline"
            size="sm"
            icon={CheckSquare}
            onClick={() => {
              setPrefilledPlate(item.vehicleNumber || '');
              setPrefilledSlot(item.activeSlotNumber || '');
              setIsCheckOutOpen(true);
            }}
          >
            Check Out
          </Button>
        ) : (
          <Button
            variant="primary"
            size="sm"
            icon={ParkingSquare}
            onClick={() => {
              setPrefilledPlate(item.vehicleNumber || '');
              setIsCheckInOpen(true);
            }}
          >
            Check In
          </Button>
        ),
    },
  ];

  return (
    <div className="space-y-4">
      {/* Control Bar */}
      <div className="flex items-center justify-between gap-3 glass-panel p-3.5 rounded-3xl shadow-sm dark:shadow-[#080b38]/50 border border-[#9ed9db]/50 dark:border-[#522377]/40 bg-white/90 dark:bg-[#133155]/60">
        <div className="flex items-center gap-2 font-mono text-xs text-[#0e7490] dark:text-purple-300">
          <span>Registered Vehicles Count: <strong className="text-[#0f172a] dark:text-white font-black">{vehicles?.content?.length || 0}</strong></span>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" icon={RefreshCw} onClick={() => refetch()}>
            Refresh
          </Button>
          <Button variant="primary" size="sm" icon={Plus} onClick={() => setIsCheckInOpen(true)}>
            Register & Check-In
          </Button>
        </div>
      </div>

      {/* Directory Data Table */}
      <DataTable
        columns={columns}
        data={vehicles?.content || []}
        keyExtractor={(item) => item.id}
        isLoading={isLoading}
        searchPlaceholder="Search by vehicle plate, owner name, contact..."
        exportable={true}
        emptyMessage="No registered vehicles found"
      />

      <CheckInModal
        isOpen={isCheckInOpen}
        onClose={() => {
          setIsCheckInOpen(false);
          setPrefilledPlate('');
        }}
        onSuccess={() => refetch()}
        initialVehicleNumber={prefilledPlate}
      />

      <CheckOutModal
        isOpen={isCheckOutOpen}
        onClose={() => {
          setIsCheckOutOpen(false);
          setPrefilledPlate('');
          setPrefilledSlot('');
        }}
        initialVehicleNumber={prefilledPlate}
        initialSlotNumber={prefilledSlot}
        onSuccess={(receipt) => {
          refetch();
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
