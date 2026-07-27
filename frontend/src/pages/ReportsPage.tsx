import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { BarChart3, DollarSign, Calendar, RefreshCw } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { reportService } from '../services/reportService';
import { MetricTile } from '../components/common/MetricTile';
import { DataTable, Column } from '../components/common/DataTable';
import { Button } from '../components/common/Button';

export const ReportsPage: React.FC = () => {
  const [range, setRange] = useState<'today' | 'week' | 'month'>('today');

  const { data: reportData, isLoading, refetch } = useQuery({
    queryKey: ['report-data', range],
    queryFn: () => {
      if (range === 'week') return reportService.getWeeklyReport();
      if (range === 'month') return reportService.getMonthlyReport();
      return reportService.getDailyReport();
    },
    refetchInterval: 10000,
  });

  const dist = reportData?.vehicleDistribution;

  const revenueByVehicleData = [
    { type: 'CAR', count: dist?.totalCars || 0 },
    { type: 'BIKE', count: dist?.totalBikes || 0 },
    { type: 'TRUCK', count: dist?.totalTrucks || 0 },
  ];

  const reportTableData = [
    {
      category: 'CAR (Sedan / SUV / EV)',
      sessions: dist?.totalCars || 0,
      type: 'CAR',
      revenue: reportData?.carRevenue !== undefined && reportData?.carRevenue !== null ? reportData.carRevenue : (dist?.totalCars ? dist.totalCars * 50 : 0),
    },
    {
      category: 'BIKE (Two-Wheeler / Scooter)',
      sessions: dist?.totalBikes || 0,
      type: 'BIKE',
      revenue: reportData?.bikeRevenue !== undefined && reportData?.bikeRevenue !== null ? reportData.bikeRevenue : (dist?.totalBikes ? dist.totalBikes * 20 : 0),
    },
    {
      category: 'TRUCK (Logistics / Commercial)',
      sessions: dist?.totalTrucks || 0,
      type: 'TRUCK',
      revenue: reportData?.truckRevenue !== undefined && reportData?.truckRevenue !== null ? reportData.truckRevenue : (dist?.totalTrucks ? dist.totalTrucks * 120 : 0),
    },
  ];

  const columns: Column<any>[] = [
    { key: 'category', header: 'Vehicle Category', render: (item) => <span className="font-bold text-[#0f172a] dark:text-white">{item.category}</span> },
    { key: 'sessions', header: 'Total Sessions', align: 'center', render: (item) => <span className="font-mono text-slate-700 dark:text-slate-200 font-bold">{item.sessions}</span> },
    { key: 'revenue', header: 'Revenue Share', align: 'right', render: (item) => <span className="font-mono font-black text-[#0891b2] dark:text-[#38bdf8]">₹{Number(item.revenue || 0).toFixed(2)}</span> },
  ];

  return (
    <div className="space-y-4">
      {/* Date Range Selector Toolbar */}
      <div className="flex items-center justify-between gap-3 glass-panel p-3.5 rounded-3xl shadow-sm dark:shadow-[#080b38]/50 border border-[#9ed9db]/50 dark:border-[#522377]/40 bg-white/90 dark:bg-[#133155]/60">
        <div className="flex items-center gap-1 bg-[#f3f9fc] dark:bg-[#080b38] p-1 rounded-2xl border border-[#9ed9db]/40 dark:border-[#522377]/50 font-mono text-xs">
          {(['today', 'week', 'month'] as const).map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-3.5 py-1.5 rounded-xl capitalize transition-all font-bold ${
                range === r ? 'bg-[#0891b2] dark:bg-[#522377] text-white shadow-sm dark:shadow-[#080b38]/50 font-black' : 'text-[#0e7490] dark:text-slate-300 hover:text-[#0f172a] dark:text-white dark:hover:text-white'
              }`}
            >
              {r}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" icon={RefreshCw} onClick={() => refetch()}>
            Refresh Report
          </Button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <MetricTile
          label="Total Period Revenue"
          value={`₹${reportData?.totalRevenue != null ? reportData.totalRevenue.toFixed(2) : '0.00'}`}
          subtext="Current period total"
          icon={DollarSign}
        />
        <MetricTile
          label="Total Completed Sessions"
          value={reportData?.totalParkedVehicles ?? 0}
          subtext="Processed vehicles"
          icon={BarChart3}
        />
        <MetricTile
          label="Exited Vehicles"
          value={reportData?.totalExitedVehicles ?? 0}
          subtext="Completed sessions"
          icon={Calendar}
        />
      </div>

      {/* Chart & Table Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 glass-panel p-6 rounded-3xl border border-[#9ed9db]/50 dark:border-[#522377]/40 bg-white/90 dark:bg-[#133155]/60 shadow-sm dark:shadow-[#080b38]/50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-black text-[#0f172a] dark:text-white uppercase tracking-wider">Vehicle Mix Breakdown</h3>
            <span className="text-[11px] font-mono text-[#0891b2] dark:text-[#38bdf8] font-bold">Total Revenue: ₹{reportData?.totalRevenue != null ? reportData.totalRevenue.toFixed(2) : '0.00'}</span>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueByVehicleData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="type" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#080b38', borderColor: '#522377', fontSize: '11px', borderRadius: '16px', color: '#ffffff' }}
                />
                <Bar dataKey="count" fill="#522377" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="text-xs font-bold text-[#0f172a] dark:text-white mb-2">Category Financial Metrics</div>
          <DataTable
            columns={columns}
            data={reportTableData}
            keyExtractor={(item) => item.category}
            isLoading={isLoading}
            searchPlaceholder="Filter category..."
          />
        </div>
      </div>
    </div>
  );
};
