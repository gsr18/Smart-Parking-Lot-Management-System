import React, { useMemo } from 'react';
import { ParkingSlot } from '../../types';
import { Badge } from '../common/Badge';
import { Car, Bike, Truck } from 'lucide-react';
import { useParkingStore } from '../../store/useParkingStore';
import { clsx } from 'clsx';
import { FLOOR_TEMPLATES } from '../../services/companyService';

interface ParkingFloorMapProps {
  slots: ParkingSlot[] | any;
  onSelectSlot: (slot: ParkingSlot) => void;
  layoutConfig?: string | null; // JSON string from company
}

/** Derive how many columns to display based on slot count & saved template */
function getGridCols(slotCount: number, layoutConfig: string | null | undefined, floor: number): number {
  if (layoutConfig) {
    try {
      const cfg = JSON.parse(layoutConfig);
      const tmplId: string | undefined = cfg.floorTemplates?.[floor];
      if (tmplId) {
        const found = FLOOR_TEMPLATES.find(t => t.id === tmplId);
        if (found) return found.cols;
        // manual template e.g. "6x8"
        const parts = tmplId.toLowerCase().split('x');
        if (parts.length === 2) {
          const c = parseInt(parts[1]);
          if (!isNaN(c)) return c;
        }
      }
    } catch {}
  }
  // Fallback: best-fit cols from slot count
  if (slotCount <= 12) return 4;
  if (slotCount <= 25) return 5;
  if (slotCount <= 48) return 8;
  if (slotCount <= 80) return 10;
  return 12;
}

export const ParkingFloorMap: React.FC<ParkingFloorMapProps> = ({ slots, onSelectSlot, layoutConfig }) => {
  const { selectedFloor, setSelectedFloor } = useParkingStore();

  const safeSlots: ParkingSlot[] = Array.isArray(slots)
    ? slots
    : slots && Array.isArray((slots as any).content)
    ? (slots as any).content
    : [];

  // Derive available floors from actual slot data
  const availableFloors = useMemo(() => {
    const floors = [...new Set(safeSlots.map(s => s.floorNumber))].sort((a, b) => a - b);
    return floors.length > 0 ? floors : [1, 2, 3];
  }, [safeSlots]);

  // Ensure selectedFloor is valid
  const activeFloor = availableFloors.includes(selectedFloor) ? selectedFloor : availableFloors[0] ?? 1;

  const floorSlots = safeSlots.filter((s) => s.floorNumber === activeFloor);
  const availableCount = floorSlots.filter((s) => s.status === 'AVAILABLE').length;
  const occupiedCount = floorSlots.filter((s) => s.status === 'OCCUPIED').length;

  const gridCols = getGridCols(floorSlots.length, layoutConfig, activeFloor);

  const getVehicleIcon = (type: string) => {
    switch ((type || 'CAR').toUpperCase()) {
      case 'BIKE': return Bike;
      case 'TRUCK': return Truck;
      default: return Car;
    }
  };

  return (
    <div className="bg-white/80 dark:bg-[#080b38]/70 border border-[#9ed9db]/50 dark:border-[#522377]/40 backdrop-blur-md rounded-2xl p-4 flex flex-col space-y-4 shadow-sm dark:shadow-[#080b38]/50">
      {/* Map Control Bar & Floor Selector Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 dark:border-white/10 pb-3">
        <div className="flex items-center gap-1.5 bg-[#f3f9fc] dark:bg-[#133155]/60 p-1 rounded-xl border border-[#9ed9db]/40 dark:border-[#254d70]/60 select-none">
          {availableFloors.map((floor) => (
            <button
              key={floor}
              onClick={() => setSelectedFloor(floor)}
              className={clsx(
                'px-3.5 py-1.5 text-xs font-bold rounded-lg font-mono transition-all',
                activeFloor === floor
                  ? 'bg-gradient-to-r from-[#0891b2] to-[#06b6d4] dark:from-[#522377] dark:to-[#36195b] text-white shadow-sm dark:shadow-[#080b38]/50 font-black'
                  : 'text-[#0e7490] dark:text-slate-300 hover:text-[#0f172a] dark:hover:text-white hover:bg-white/50'
              )}
            >
              Floor {floor}
            </button>
          ))}
        </div>

        {/* Floor Status Legend */}
        <div className="flex items-center gap-4 text-xs font-bold select-none">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#0891b2] dark:bg-[#38bdf8]" />
            <span className="text-[#0e7490] dark:text-[#38bdf8] font-mono">Available ({availableCount})</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#db2777] dark:bg-[#f5d0fe]" />
            <span className="text-[#9d174d] dark:text-[#f5d0fe] font-mono">Occupied ({occupiedCount})</span>
          </div>
          <div className="flex items-center gap-1.5 text-[#475569] dark:text-slate-400 font-mono">
            <span className="text-[10px]">Grid {gridCols} cols · {floorSlots.length} slots</span>
          </div>
        </div>
      </div>

      {/* Driving Aisle Layout & Parking Bay Cards */}
      {floorSlots.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="w-12 h-12 rounded-2xl bg-[#cfeef1] dark:bg-[#133155]/60 flex items-center justify-center mb-3">
            <Car className="w-6 h-6 text-[#0891b2] dark:text-[#38bdf8]" />
          </div>
          <p className="text-sm font-bold text-[#0f172a] dark:text-white">No slots on Floor {activeFloor}</p>
          <p className="text-xs text-[#475569] dark:text-slate-400 mt-1">Use "Configure Layout" to set up your facility's parking grid.</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="text-[11px] font-mono font-extrabold text-[#0891b2] dark:text-purple-300 uppercase tracking-wider flex items-center justify-between">
            <span>── AISLE A (MAIN ENTRY) ──</span>
            <span className="hidden sm:inline">DRIVEWAY CLEARANCE 4.5M</span>
          </div>

          <div className="overflow-x-auto pb-2">
            <div
              className="grid gap-2.5 min-w-[680px] md:min-w-full"
              style={{ gridTemplateColumns: `repeat(${gridCols}, minmax(110px, 1fr))` }}
            >
            {floorSlots.map((slot) => {
              const VehicleIcon = getVehicleIcon(slot.slotType);
              const isOccupied = slot.status === 'OCCUPIED';

              return (
                <button
                  key={slot.id}
                  onClick={() => onSelectSlot(slot)}
                  className={clsx(
                    'p-2.5 rounded-xl border text-left flex flex-col justify-between transition-all relative group select-none backdrop-blur-md shadow-sm dark:shadow-[#080b38]/50',
                    // Dynamic height based on grid density
                    gridCols <= 5 ? 'min-h-[105px]' : gridCols <= 8 ? 'min-h-[88px]' : 'min-h-[72px]',
                    slot.status === 'AVAILABLE' &&
                      'bg-[#cfeef1]/40 dark:bg-[#133155]/50 border-[#9ed9db] dark:border-[#254d70] hover:border-[#0891b2] dark:hover:border-[#38bdf8] hover:bg-[#cfeef1] dark:hover:bg-[#133155]',
                    isOccupied &&
                      'bg-[#fedeef]/60 dark:bg-[#522377]/40 border-pink-300 dark:border-[#522377] hover:border-pink-400 dark:hover:border-[#522377] hover:bg-[#fedeef] dark:hover:bg-[#522377]/60',
                    slot.status === 'MAINTENANCE' &&
                      'bg-amber-100/60 dark:bg-amber-950/40 border-amber-300 dark:border-amber-500/40 opacity-60'
                  )}
                >
                  {/* Slot Top Header */}
                  <div className="flex items-center justify-between w-full">
                    <span className={clsx(
                      'font-mono font-black text-[#0f172a] dark:text-white tracking-tight',
                      gridCols > 8 ? 'text-[9px]' : 'text-xs'
                    )}>
                      {slot.slotNumber}
                    </span>
                    <Badge variant={slot.slotType} />
                  </div>

                  {/* Slot Middle Content */}
                  <div className="my-1.5 flex items-center gap-1.5">
                    <VehicleIcon
                      className={clsx(
                        'shrink-0',
                        gridCols > 8 ? 'w-3 h-3' : 'w-4 h-4',
                        isOccupied ? 'text-[#9d174d] dark:text-[#f5d0fe]' : 'text-[#0891b2] dark:text-[#38bdf8]'
                      )}
                    />
                    {isOccupied ? (
                      <span className={clsx('font-mono font-bold text-[#9d174d] dark:text-[#f5d0fe] truncate', gridCols > 8 ? 'text-[9px]' : 'text-xs')}>
                        {slot.occupiedByVehicleNumber || 'PARKED'}
                      </span>
                    ) : (
                      <span className={clsx('text-[#0e7490] dark:text-[#38bdf8] font-mono font-bold', gridCols > 8 ? 'text-[9px]' : 'text-xs')}>FREE</span>
                    )}
                  </div>

                  {/* Slot Bottom Action Indicator */}
                  <div className={clsx('flex items-center justify-between w-full font-mono border-t border-slate-200 dark:border-white/10 pt-1', gridCols > 8 ? 'text-[8px]' : 'text-[10px]', 'text-slate-500 dark:text-slate-400')}>
                    <span>F{slot.floorNumber}</span>
                    <span className="group-hover:text-[#0891b2] dark:group-hover:text-[#f5d0fe] font-bold transition-colors">
                      {isOccupied ? 'Out ➔' : '+ In'}
                    </span>
                  </div>
                </button>
              );
            })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
