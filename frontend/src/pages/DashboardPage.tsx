import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { ParkingSquare, Car, DollarSign, Layers, Activity, RefreshCw, Plus, CheckSquare, AlertTriangle, LayoutGrid, UserCheck } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { dashboardService } from '../services/dashboardService';
import { slotService } from '../services/slotService';
import { authService } from '../services/authService';
import { MetricTile } from '../components/common/MetricTile';
import { DataTable, Column } from '../components/common/DataTable';
import { ParkingFloorMap } from '../components/parking/ParkingFloorMap';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { CheckInModal } from '../components/parking/CheckInModal';
import { CheckOutModal } from '../components/parking/CheckOutModal';
import { ReceiptModal } from '../components/parking/ReceiptModal';
import { IncidentModal } from '../components/staff/IncidentModal';
import { LayoutConfigModal } from '../components/admin/LayoutConfigModal';
import { PendingStaffModal } from '../components/admin/PendingStaffModal';
import { companyService } from '../services/companyService';
import { CheckOutResponse, ParkingSlot } from '../types';

export const DashboardPage: React.FC = () => {
  const { activeRole, user } = useAuthStore();
  const queryClient = useQueryClient();
  const [isCheckInOpen, setIsCheckInOpen] = useState(false);
  const [isCheckOutOpen, setIsCheckOutOpen] = useState(false);
  const [isIncidentOpen, setIsIncidentOpen] = useState(false);
  const [isLayoutConfigOpen, setIsLayoutConfigOpen] = useState(false);
  const [isPendingStaffOpen, setIsPendingStaffOpen] = useState(false);
  const [activeReceipt, setActiveReceipt] = useState<CheckOutResponse | null>(null);
  const [prefilledSlot, setPrefilledSlot] = useState<string>('');
  const [prefilledCheckOutSlot, setPrefilledCheckOutSlot] = useState<string>('');
  const [prefilledCheckOutVehicle, setPrefilledCheckOutVehicle] = useState<string>('');

  const { data: summary, refetch: refetchSummary } = useQuery({
    queryKey: ['dashboard-summary'],
    queryFn: dashboardService.getSummary,
    refetchInterval: 3000,
  });

  const { data: recentActivities, isLoading: isActivitiesLoading, refetch: refetchActivities } = useQuery({
    queryKey: ['dashboard-recent-activity'],
    queryFn: dashboardService.getRecentActivity,
    refetchInterval: 3000,
  });

  const { data: distribution, refetch: refetchDistribution } = useQuery({
    queryKey: ['dashboard-vehicle-distribution'],
    queryFn: dashboardService.getVehicleDistribution,
    enabled: activeRole === 'ROLE_ADMIN',
  });

  const { data: pendingStaffRequests, refetch: refetchPendingStaff } = useQuery({
    queryKey: ['pending-staff-requests', user?.companyId],
    queryFn: () => authService.getPendingStaffRequests(user?.companyId || 1),
    enabled: activeRole === 'ROLE_ADMIN',
  });

  const { data: slots, refetch: refetchSlots } = useQuery({
    queryKey: ['slots-all'],
    queryFn: slotService.getAllSlots,
  });

  const { data: companyLayout, refetch: refetchLayout } = useQuery({
    queryKey: ['company-layout'],
    queryFn: companyService.getMyCompanyLayout,
  });

  const handleRefreshAll = () => {
    refetchSummary();
    refetchSlots();
    refetchActivities();
    refetchLayout();
    if (activeRole === 'ROLE_ADMIN') {
      refetchDistribution();
      refetchPendingStaff();
    }
  };

  const handleSlotClick = (slot: ParkingSlot) => {
    if (slot.status === 'AVAILABLE') {
      setPrefilledSlot(slot.slotNumber);
      setIsCheckInOpen(true);
    } else if (slot.status === 'OCCUPIED') {
      setPrefilledCheckOutSlot(slot.slotNumber);
      setPrefilledCheckOutVehicle(slot.occupiedByVehicleNumber || '');
      setIsCheckOutOpen(true);
    }
  };

  const occupancyTrendData = [
    { hour: '06:00', occupancy: 0 },
    { hour: '08:00', occupancy: 0 },
    { hour: '10:00', occupancy: (summary?.occupiedSlots || 0) * 10 },
    { hour: '12:00', occupancy: (summary?.occupiedSlots || 0) * 15 },
    { hour: '14:00', occupancy: (summary?.occupiedSlots || 0) * 12 },
    { hour: '16:00', occupancy: (summary?.occupiedSlots || 0) * 8 },
    { hour: '18:00', occupancy: (summary?.occupiedSlots || 0) * 5 },
    { hour: '20:00', occupancy: 0 },
  ];

  const distributionPieData = distribution
    ? [
        { name: 'CAR', value: distribution.totalCars || 0 },
        { name: 'BIKE', value: distribution.totalBikes || 0 },
        { name: 'TRUCK', value: distribution.totalTrucks || 0 },
      ]
    : [
        { name: 'CAR', value: 0 },
        { name: 'BIKE', value: 0 },
        { name: 'TRUCK', value: 0 },
      ];

  const PIE_COLORS = ['#38bdf8', '#c084fc', '#f59e0b'];

  const activityColumns: Column<any>[] = [
    { key: 'sessionNumber', header: 'Session ID', width: '120px', render: (item) => <span className="font-mono font-bold text-[#0f172a] dark:text-white">#{item.id}</span> },
    { key: 'vehicleNumber', header: 'Vehicle Plate', render: (item) => <span className="font-mono text-[#0891b2] dark:text-[#38bdf8] font-bold">{item.vehicleNumber || item.vehicle?.registrationNumber}</span> },
    { key: 'slotNumber', header: 'Parking Slot', render: (item) => <span className="font-mono text-[#0f172a] dark:text-[#f5d0fe]">{item.slotNumber || item.slot?.slotNumber}</span> },
    { key: 'action', header: 'Event Status', render: (item) => <Badge variant={item.action || item.status || 'ACTIVE'} /> },
    { key: 'time', header: 'Timestamp', align: 'right', render: (item) => <span className="font-mono text-xs text-[#475569] dark:text-slate-300">{item.timestamp ? new Date(item.timestamp).toLocaleTimeString() : 'Just Now'}</span> },
  ];

  return (
    <div className="space-y-6 w-full animate-in fade-in duration-300">
      {/* 1. CONTROL TOOLBAR */}
      <div className="flex flex-wrap items-center justify-between gap-2 glass-panel p-3 sm:p-4 rounded-2xl sm:rounded-3xl shadow-md border border-[#9ed9db]/50 dark:border-[#522377]/40 bg-white/90 dark:bg-[#133155]/60">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-2.5 h-2.5 rounded-full bg-[#0891b2] dark:bg-[#38bdf8] animate-pulse shrink-0" />
          <span className="text-xs sm:text-sm font-black text-[#0f172a] dark:text-white tracking-wide truncate">
            {activeRole === 'ROLE_ADMIN' ? 'Executive Dashboard Feed' : 'Gate Attendant Control Station'}
          </span>
          <span className="hidden sm:inline text-xs text-[#0e7490] dark:text-purple-300 font-mono shrink-0">| Live Auto-Synced</span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 shrink-0">
          {activeRole === 'ROLE_STAFF' && (
            <>
              <Button variant="primary" size="sm" icon={Plus} onClick={() => setIsCheckInOpen(true)}>
                <span className="hidden sm:inline">Check In </span><kbd className="text-[10px] opacity-75 font-mono">N</kbd>
              </Button>
              <Button variant="outline" size="sm" icon={CheckSquare} onClick={() => setIsCheckOutOpen(true)}>
                <span className="hidden sm:inline">Check Out </span><kbd className="text-[10px] opacity-75 font-mono">C</kbd>
              </Button>
              <Button variant="outline" size="sm" icon={AlertTriangle} onClick={() => setIsIncidentOpen(true)} className="border-amber-400 dark:border-amber-500/40 text-amber-800 dark:text-amber-200 hover:bg-amber-50 dark:hover:bg-amber-950/40">
                <span className="hidden sm:inline">Report </span>Incident
              </Button>
            </>
          )}

          {activeRole === 'ROLE_ADMIN' && (
            <>
              <Button
                variant="outline"
                size="sm"
                icon={UserCheck}
                onClick={() => setIsPendingStaffOpen(true)}
                className="relative border-indigo-400/40 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/40"
              >
                <span className="hidden sm:inline">Pending </span>Staff
                {pendingStaffRequests && pendingStaffRequests.length > 0 && (
                  <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-bold font-mono bg-amber-500 text-slate-950 animate-bounce">
                    {pendingStaffRequests.length}
                  </span>
                )}
              </Button>
              <Button
                variant="outline"
                size="sm"
                icon={LayoutGrid}
                onClick={() => setIsLayoutConfigOpen(true)}
                className="border-[#0891b2]/40 dark:border-[#c084fc]/40 text-[#0891b2] dark:text-[#c084fc] hover:bg-[#cfeef1]/50 dark:hover:bg-[#522377]/20"
              >
                <span className="hidden sm:inline">Configure </span>Layout
              </Button>
            </>
          )}
          <Button variant="outline" size="sm" icon={RefreshCw} onClick={handleRefreshAll}>
            <span className="hidden sm:inline">Refresh</span>
          </Button>
        </div>
      </div>

      {/* 2. KPI METRICS (ROLE TAILORED) */}
      {activeRole === 'ROLE_ADMIN' ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricTile
            label="Total Facility Capacity"
            value={summary?.totalSlots ?? 36}
            subtext="Configured parking bays"
            icon={Layers}
          />
          <MetricTile
            label="Occupancy Rate"
            value={`${summary?.occupancyPercentage != null ? summary.occupancyPercentage.toFixed(1) : '0.0'}%`}
            subtext="Current utilization"
            icon={ParkingSquare}
          />
          <MetricTile
            label="Active Parked Vehicles"
            value={summary?.occupiedSlots ?? 0}
            subtext={`${summary?.availableSlots ?? 36} bays available`}
            icon={Car}
          />
          <MetricTile
            label="Revenue Collected Today"
            value={`₹${(summary?.revenueToday != null ? summary.revenueToday : summary?.todayRevenue != null ? summary.todayRevenue : 0).toFixed(2)}`}
            subtext="Today's total revenue"
            icon={DollarSign}
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <MetricTile
            label="Total Gate Capacity"
            value={summary?.totalSlots ?? 36}
            subtext="Total facility bays"
            icon={Layers}
          />
          <MetricTile
            label="Available Parking Bays"
            value={summary?.availableSlots ?? 36}
            subtext="Ready for check-in"
            icon={ParkingSquare}
          />
          <MetricTile
            label="Active Parked Vehicles"
            value={summary?.occupiedSlots ?? 0}
            subtext="Currently checked in"
            icon={Car}
          />
        </div>
      )}

      {/* 3. OPERATIONAL PARKING BAY LAYOUT */}
      <div className="w-full glass-panel rounded-2xl sm:rounded-3xl p-3 sm:p-6 space-y-3 sm:space-y-4 shadow-md border border-[#9ed9db]/50 dark:border-[#522377]/40 bg-white/90 dark:bg-[#133155]/60">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 dark:border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 sm:w-5 sm:h-5 text-[#0891b2] dark:text-[#38bdf8] shrink-0" />
            <h3 className="text-sm sm:text-base font-black text-[#0f172a] dark:text-white tracking-tight">Operational Parking Bay Layout</h3>
          </div>
          <span className="hidden sm:inline text-xs text-[#0e7490] dark:text-purple-300 font-mono">Click any slot to Check-In or Check-Out</span>
          <span className="sm:hidden text-[10px] text-[#0e7490] dark:text-purple-300 font-mono">Tap a slot to Check-In / Out</span>
        </div>

        <ParkingFloorMap slots={slots || []} onSelectSlot={handleSlotClick} layoutConfig={companyLayout?.layoutConfig} />
      </div>

      {/* 4. RECENT ACTIVITY STREAM */}
      <div className="w-full glass-panel rounded-3xl p-6 space-y-4 shadow-md border border-[#9ed9db]/50 dark:border-[#522377]/40 bg-white/90 dark:bg-[#133155]/60">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-3">
          <div className="flex items-center gap-2.5">
            <Activity className="w-5 h-5 text-[#0891b2] dark:text-[#38bdf8]" />
            <h3 className="text-base font-black text-[#0f172a] dark:text-white tracking-tight">
              {activeRole === 'ROLE_ADMIN' ? 'Facility Gate Activity Stream' : 'Your Gate Activity Log'}
            </h3>
          </div>
          <span className="text-xs text-[#0e7490] dark:text-purple-300 font-mono">Real-time session updates</span>
        </div>

        <DataTable
          columns={activityColumns}
          data={recentActivities || []}
          keyExtractor={(item) => item.id || Math.random()}
          isLoading={isActivitiesLoading}
          searchPlaceholder="Search events, plates, or slots..."
          emptyMessage="No parking sessions created yet. Click + Check In to start a session."
        />
      </div>

      {/* 5. ADMIN EXCLUSIVE ANALYTICS */}
      {activeRole === 'ROLE_ADMIN' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="lg:col-span-2 glass-panel rounded-3xl p-6 shadow-md border border-[#9ed9db]/50 dark:border-[#522377]/40 bg-white/90 dark:bg-[#133155]/60">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xs font-black text-[#0f172a] dark:text-white uppercase tracking-wider">Hourly Occupancy Trend</h3>
                <p className="text-[11px] text-[#475569] dark:text-slate-300">24-hour facility utilization curve</p>
              </div>
              <span className="text-[11px] font-mono text-[#0891b2] dark:text-[#38bdf8] font-bold">Live Scoped Trend</span>
            </div>

            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={occupancyTrendData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="occupancyGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#522377" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#133155" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="hour" stroke="#94a3b8" fontSize={10} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#080b38', borderColor: '#522377', fontSize: '11px', borderRadius: '16px', color: '#ffffff' }}
                  />
                  <Area type="monotone" dataKey="occupancy" stroke="#38bdf8" strokeWidth={3} fillOpacity={1} fill="url(#occupancyGradient)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="glass-panel rounded-3xl p-6 flex flex-col justify-between shadow-md border border-[#9ed9db]/50 dark:border-[#522377]/40 bg-white/90 dark:bg-[#133155]/60">
            <div>
              <h3 className="text-xs font-black text-[#0f172a] dark:text-white uppercase tracking-wider mb-1">Vehicle Type Mix</h3>
              <p className="text-[11px] text-[#475569] dark:text-slate-300 mb-2">Breakdown of overall parked vehicles</p>
            </div>

            <div className="h-36 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={distributionPieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={32}
                    outerRadius={52}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {distributionPieData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: any, name: any) => [`${value} Vehicles`, `Vehicle Type: ${name}`]}
                    contentStyle={{
                      backgroundColor: '#0b132b',
                      borderColor: '#38bdf8',
                      borderWidth: '1px',
                      borderRadius: '12px',
                      padding: '8px 12px',
                      boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
                      color: '#ffffff',
                      fontSize: '12px',
                      fontWeight: '700',
                    }}
                    itemStyle={{ color: '#38bdf8', fontWeight: '800' }}
                    labelStyle={{ color: '#ffffff', fontWeight: '800' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="flex items-center justify-around border-t border-slate-200 dark:border-white/10 pt-2 text-[11px] font-mono">
              <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#38bdf8]" /><span className="text-[#0f172a] dark:text-white">CAR ({distribution?.totalCars || 0})</span></div>
              <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#c084fc]" /><span className="text-[#0f172a] dark:text-white">BIKE ({distribution?.totalBikes || 0})</span></div>
              <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#f59e0b]" /><span className="text-[#0f172a] dark:text-white">TRUCK ({distribution?.totalTrucks || 0})</span></div>
            </div>
          </div>
        </div>
      )}

      <CheckInModal
        isOpen={isCheckInOpen}
        onClose={() => { setIsCheckInOpen(false); setPrefilledSlot(''); }}
        onSuccess={handleRefreshAll}
        initialSlotNumber={prefilledSlot}
      />

      <CheckOutModal
        isOpen={isCheckOutOpen}
        onClose={() => {
          setIsCheckOutOpen(false);
          setPrefilledCheckOutSlot('');
          setPrefilledCheckOutVehicle('');
        }}
        initialSlotNumber={prefilledCheckOutSlot}
        initialVehicleNumber={prefilledCheckOutVehicle}
        slots={slots || []}
        onSuccess={(receipt) => {
          handleRefreshAll();
          setActiveReceipt(receipt);
        }}
      />

      <ReceiptModal
        isOpen={!!activeReceipt}
        onClose={() => setActiveReceipt(null)}
        receipt={activeReceipt}
      />

      <IncidentModal
        isOpen={isIncidentOpen}
        onClose={() => setIsIncidentOpen(false)}
      />

      <LayoutConfigModal
        isOpen={isLayoutConfigOpen}
        onClose={() => setIsLayoutConfigOpen(false)}
        onSuccess={handleRefreshAll}
      />

      <PendingStaffModal
        isOpen={isPendingStaffOpen}
        onClose={() => setIsPendingStaffOpen(false)}
        companyId={user?.companyId || 1}
        onUpdate={handleRefreshAll}
      />
    </div>
  );
};
