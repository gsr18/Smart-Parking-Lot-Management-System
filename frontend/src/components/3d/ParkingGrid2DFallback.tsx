import React from 'react';
import { ParkingSlot } from '../../types';
import { Badge } from '../common/Badge';

interface ParkingGrid2DFallbackProps {
  slots: ParkingSlot[];
  onSelectSlot: (slot: ParkingSlot) => void;
}

export const ParkingGrid2DFallback: React.FC<ParkingGrid2DFallbackProps> = ({ slots, onSelectSlot }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 p-4">
      {slots.map((slot) => (
        <button
          key={slot.id}
          onClick={() => onSelectSlot(slot)}
          className={`p-4 rounded-xl border flex flex-col items-center justify-between min-h-[110px] transition-all duration-200 hover:scale-105 ${
            slot.status === 'AVAILABLE'
              ? 'bg-emerald-500/10 border-emerald-500/30 hover:border-emerald-500/60'
              : slot.status === 'OCCUPIED'
              ? 'bg-indigo-500/10 border-indigo-500/30 hover:border-indigo-500/60'
              : 'bg-rose-500/10 border-rose-500/30 opacity-60'
          }`}
        >
          <div className="flex items-center justify-between w-full">
            <span className="text-xs font-mono font-bold text-white">{slot.slotNumber}</span>
            <Badge variant={slot.slotType} />
          </div>

          <div className="my-2 text-center">
            {slot.status === 'OCCUPIED' ? (
              <span className="text-xs font-mono font-extrabold text-indigo-300 block truncate">
                {slot.occupiedByVehicleNumber || 'PARKED'}
              </span>
            ) : (
              <span className="text-xs text-slate-400 block">{slot.status}</span>
            )}
          </div>

          <span className="text-[10px] text-slate-400 font-mono">Floor {slot.floorNumber}</span>
        </button>
      ))}
    </div>
  );
};
