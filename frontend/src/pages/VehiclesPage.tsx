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
    queryFn: vehicleService.getAllVehicles,
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
      render: (item) => <span className="font-bold text-[#0f172a] dark:text-white">{item.ownerName || 'Guest'}</span>,
    },
    {
      key: 'ownerContact',
      header: 'Contact Number',
      render: (item) => <span className="font-mono text-slate-600 dark:text-slate-300">{item.ownerContact || '—'}</span>,
    },
    {
      key: 'status',
      header: 'Current Status',
      sortable: true,
      render: (item) =>
        item.currentlyParked ? (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold font-mono bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700">
            PARKED {item.activeSlotNumber ? `(${item.activeSlotNumber})` : ''}
          </span>
        ) : (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold font-mono bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-300 dark:border-slate-700">
            CHECKED OUT
          </span>
        ),
    },
    {
      key: 'createdAt',
      header: 'Registered Date',
      sortable: true,
      render: (item) => (
        <span className="font-mono text-[11px] text-slate-500 dark:text-slate-400">
          {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'N/A'}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Action',
      align: 'right',
      render: (item) =>
        item.currentlyParked ? (
          <Button
            variant="outline"
            size="sm"
            icon={CheckSquare}
            className="border-pink-300 dark:border-pink-500/40 text-pink-700 dark:text-pink-300 hover:bg-pink-50 dark:hover:bg-pink-950/40"
            onClick={() => {
              setPrefilledPlate(item.vehicleNumber || item.registrationNumber || '');
              setPrefilledSlot(item.activeSlotNumber || '');
              setIsCheckOutOpen(true);
            }}
          >
            Check Out
          </Button>
        ) : (
          <Button
            variant="secondary"
            size="sm"
            icon={ParkingSquare}
            onClick={() => {
              setPrefilledPlate(item.vehicleNumber || item.registrationNumber || '');
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
          <span>Registered Vehicles Count: <strong className="text-[#0f172a] dark:text-white font-black">{vehicles?.length || 0}</strong></span>
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
        data={vehicles || []}
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
