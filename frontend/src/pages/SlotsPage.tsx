import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { RefreshCw, Wrench } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { slotService } from '../services/slotService';
import { companyService } from '../services/companyService';
import { DataTable, Column } from '../components/common/DataTable';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { ParkingSlot } from '../types';
import toast from 'react-hot-toast';

export const SlotsPage: React.FC = () => {
  const { activeRole } = useAuthStore();
  const [selectedFloor, setSelectedFloor] = useState<number | 'ALL'>('ALL');
  const [selectedType, setSelectedType] = useState<string>('ALL');
  const queryClient = useQueryClient();

  const { data: slots, isLoading, refetch } = useQuery({
    queryKey: ['slots-all'],
    queryFn: slotService.getAllSlots,
  });

  const { data: companyLayout } = useQuery({
    queryKey: ['company-layout'],
    queryFn: companyService.getMyCompanyLayout,
  });

  const toggleStatusMutation = useMutation({
    mutationFn: ({ slotId, currentStatus }: { slotId: number; currentStatus: string }) => {
      const nextStatus = currentStatus === 'MAINTENANCE' ? 'AVAILABLE' : 'MAINTENANCE';
      return slotService.updateSlotStatus(slotId, nextStatus);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['slots-all'] });
      toast.success('Slot status updated successfully');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to update slot status');
    },
  });

  const rawSlots: ParkingSlot[] = Array.isArray(slots)
    ? slots
    : slots && Array.isArray((slots as any).content)
    ? (slots as any).content
    : [];

  // Dynamically compute floor numbers based on company layout & slots
  const slotFloors = Array.from(new Set(rawSlots.map((s) => s.floorNumber))).filter(Boolean);
  const totalFloorsFromConfig = companyLayout?.totalFloors || (slotFloors.length > 0 ? Math.max(...slotFloors) : 1);
  const floorNumbers = Array.from({ length: Math.max(totalFloorsFromConfig, slotFloors.length > 0 ? Math.max(...slotFloors) : 1) }, (_, i) => i + 1);

  const filteredSlots = rawSlots.filter((s) => {
    const floorMatch = selectedFloor === 'ALL' || s.floorNumber === selectedFloor;
    const typeMatch = selectedType === 'ALL' || s.slotType === selectedType;
    return floorMatch && typeMatch;
  });

  const columns: Column<ParkingSlot>[] = [
    {
      key: 'slotNumber',
      header: 'Slot ID',
      sortable: true,
      render: (item) => <span className="font-mono font-bold text-[#0f172a] dark:text-white">{item.slotNumber}</span>,
    },
    {
      key: 'floorNumber',
      header: 'Floor',
      sortable: true,
      render: (item) => <span className="font-mono text-slate-700 dark:text-slate-300">Floor {item.floorNumber}</span>,
    },
    {
      key: 'slotType',
      header: 'Vehicle Type',
      sortable: true,
      render: (item) => <Badge variant={item.slotType} />,
    },
    {
      key: 'hourlyRate',
      header: 'Hourly Rate',
      sortable: true,
      render: (item) => (
        <span className="font-mono font-bold text-emerald-700 dark:text-emerald-300">
          ₹{item.hourlyRate ? item.hourlyRate.toFixed(2) : '50.00'}/hr
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Current Status',
      sortable: true,
      render: (item) => <Badge variant={item.status} />,
    },
    {
      key: 'occupiedByVehicleNumber',
      header: 'Occupied Vehicle',
      render: (item) => (
        <span className="font-mono text-[#0891b2] dark:text-[#38bdf8] font-extrabold">
          {item.occupiedByVehicleNumber || '—'}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Management',
      align: 'right',
      render: (item) =>
        activeRole === 'ROLE_ADMIN' ? (
          <Button
            variant={item.status === 'MAINTENANCE' ? 'primary' : 'outline'}
            size="sm"
            icon={Wrench}
            disabled={item.status === 'OCCUPIED'}
            onClick={() => toggleStatusMutation.mutate({ slotId: item.id, currentStatus: item.status })}
          >
            {item.status === 'MAINTENANCE' ? 'Set Available' : 'Set Maintenance'}
          </Button>
        ) : (
          <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">View Only</span>
        ),
    },
  ];

  return (
    <div className="space-y-4">
      {/* Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 glass-panel p-3.5 rounded-3xl shadow-sm dark:shadow-[#080b38]/50 border border-[#9ed9db]/50 dark:border-[#522377]/40 bg-white/90 dark:bg-[#133155]/60">
        <div className="flex flex-wrap items-center gap-2">
          {/* Dynamic Floor Dropdown Filter */}
          <select
            value={selectedFloor}
            onChange={(e) => setSelectedFloor(e.target.value === 'ALL' ? 'ALL' : Number(e.target.value))}
            className="bg-white dark:bg-[#080b38] border border-[#9ed9db] dark:border-[#522377]/50 rounded-2xl px-3 py-1.5 text-xs text-[#0f172a] dark:text-white font-mono focus:outline-none focus:border-[#0891b2] dark:focus:border-[#522377]"
          >
            <option value="ALL">All Floors</option>
            {floorNumbers.map((flr) => (
              <option key={flr} value={flr}>
                Floor {flr}
              </option>
            ))}
          </select>

          {/* Vehicle Type Dropdown Filter */}
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="bg-white dark:bg-[#080b38] border border-[#9ed9db] dark:border-[#522377]/50 rounded-2xl px-3 py-1.5 text-xs text-[#0f172a] dark:text-white font-mono focus:outline-none focus:border-[#0891b2] dark:focus:border-[#522377]"
          >
            <option value="ALL">All Vehicle Types</option>
            <option value="CAR">CAR</option>
            <option value="BIKE">BIKE</option>
            <option value="TRUCK">TRUCK</option>
          </select>
        </div>

        <Button variant="outline" size="sm" icon={RefreshCw} onClick={() => refetch()}>
          Refresh Slots
        </Button>
      </div>

      {/* Slots Table */}
      <DataTable
        columns={columns}
        data={filteredSlots}
        keyExtractor={(item) => item.id}
        isLoading={isLoading}
        searchPlaceholder="Search slot ID..."
        emptyMessage="No parking slots match the selected filters"
      />
    </div>
  );
};
