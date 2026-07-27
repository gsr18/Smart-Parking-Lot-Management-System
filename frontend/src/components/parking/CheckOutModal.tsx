import React, { useState, useEffect } from 'react';
import { CreditCard, CheckSquare, X, Car, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';
import { CheckOutResponse, PaymentMethod, ParkingSlot } from '../../types';
import { parkingService } from '../../services/parkingService';

interface CheckOutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (receipt: CheckOutResponse) => void;
  initialSlotNumber?: string;
  initialVehicleNumber?: string;
  slots?: ParkingSlot[];
}

export const CheckOutModal: React.FC<CheckOutModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  initialSlotNumber = '',
  initialVehicleNumber = '',
  slots = [],
}) => {
  const [searchMode, setSearchMode] = useState<'SLOT' | 'VEHICLE'>('SLOT');
  const [selectedSlotNumber, setSelectedSlotNumber] = useState('');
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('CASH');
  const [isLoading, setIsLoading] = useState(false);

  // Filter list of occupied slots for slot mapping dropdown
  const occupiedSlots = (slots || []).filter((s) => s.status === 'OCCUPIED');

  useEffect(() => {
    if (isOpen) {
      if (initialSlotNumber) {
        setSelectedSlotNumber(initialSlotNumber);
        setVehicleNumber(initialVehicleNumber || '');
        setSearchMode('SLOT');
      } else if (initialVehicleNumber) {
        setVehicleNumber(initialVehicleNumber);
        setSelectedSlotNumber('');
        setSearchMode('VEHICLE');
      } else {
        const firstSlot = occupiedSlots.length > 0 ? occupiedSlots[0] : null;
        setSelectedSlotNumber(firstSlot ? firstSlot.slotNumber : '');
        setVehicleNumber(firstSlot && firstSlot.occupiedByVehicleNumber ? firstSlot.occupiedByVehicleNumber : '');
        setSearchMode(firstSlot ? 'SLOT' : 'VEHICLE');
      }
    }
  }, [isOpen, initialSlotNumber, initialVehicleNumber]);

  if (!isOpen) return null;

  const handleSlotSelect = (slotNum: string) => {
    setSelectedSlotNumber(slotNum);
    const matchedSlot = occupiedSlots.find((s) => s.slotNumber === slotNum);
    if (matchedSlot && matchedSlot.occupiedByVehicleNumber) {
      setVehicleNumber(matchedSlot.occupiedByVehicleNumber);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (searchMode === 'VEHICLE' && !vehicleNumber.trim()) {
      toast.error('Please enter vehicle plate number');
      return;
    }

    if (searchMode === 'SLOT' && !selectedSlotNumber.trim()) {
      toast.error('Please select or enter a parking slot');
      return;
    }

    setIsLoading(true);
    try {
      const receipt = await parkingService.checkOut({
        slotNumber: searchMode === 'SLOT' ? selectedSlotNumber.trim() : undefined,
        vehicleNumber: vehicleNumber.trim().toUpperCase() || undefined,
        paymentMethod,
      });

      toast.success(`Check-Out completed! Total Fee: ₹${receipt.parkingFee.toFixed(2)}`);
      onSuccess(receipt);
      onClose();
      setVehicleNumber('');
      setSelectedSlotNumber('');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Check-Out failed. Ensure slot/vehicle is active.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 dark:bg-black/70 backdrop-blur-md animate-fade-in select-none">
      <div className="bg-white dark:bg-[#080b38] w-full max-w-md rounded-3xl p-6 relative border border-[#9ed9db] dark:border-[#522377] shadow-2xl space-y-4">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:text-slate-300 dark:hover:text-white rounded-lg transition-colors font-bold"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 border-b border-slate-200 dark:border-white/10 pb-3">
          <div className="p-3 rounded-2xl bg-[#fedeef] dark:bg-[#522377]/40 border border-pink-300 dark:border-[#522377] text-[#9d174d] dark:text-[#f5d0fe]">
            <CheckSquare className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-black text-[#0f172a] dark:text-white">Vehicle Gate Check-Out</h2>
            <p className="text-xs text-[#0e7490] dark:text-purple-300 font-mono">Select slot mapping or vehicle plate number</p>
          </div>
        </div>

        {/* Tab Selection: Slot Mapping vs Vehicle Plate */}
        <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-100 dark:bg-[#133155]/60 rounded-2xl border border-slate-200 dark:border-[#254d70] font-mono text-xs">
          <button
            type="button"
            onClick={() => setSearchMode('SLOT')}
            className={`py-2 rounded-xl transition-all font-bold flex items-center justify-center gap-1.5 ${
              searchMode === 'SLOT'
                ? 'bg-[#0891b2] dark:bg-[#522377] text-white shadow-sm font-black'
                : 'text-slate-600 dark:text-slate-300 hover:text-[#0f172a] dark:hover:text-white'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>By Slot Mapping</span>
          </button>
          <button
            type="button"
            onClick={() => setSearchMode('VEHICLE')}
            className={`py-2 rounded-xl transition-all font-bold flex items-center justify-center gap-1.5 ${
              searchMode === 'VEHICLE'
                ? 'bg-[#0891b2] dark:bg-[#522377] text-white shadow-sm font-black'
                : 'text-slate-600 dark:text-slate-300 hover:text-[#0f172a] dark:hover:text-white'
            }`}
          >
            <Car className="w-3.5 h-3.5" />
            <span>By Vehicle Plate</span>
          </button>
        </div>

        {/* Layout Selection Alert Badge if selected via layout */}
        {initialSlotNumber && (
          <div className="p-2.5 bg-indigo-950/40 border border-indigo-500/40 rounded-2xl text-[11px] text-indigo-300 font-mono flex items-center gap-2">
            <MapPin className="w-4 h-4 text-indigo-400 shrink-0" />
            <span>Selected from Layout Map: <strong>{initialSlotNumber}</strong> {initialVehicleNumber ? `(${initialVehicleNumber})` : ''}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {searchMode === 'SLOT' ? (
            <div>
              <label className="block font-bold text-[#0f172a] dark:text-white mb-1">
                Select Parked Slot Mapping *
              </label>
              {occupiedSlots.length > 0 ? (
                <select
                  value={selectedSlotNumber}
                  onChange={(e) => handleSlotSelect(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-white dark:bg-[#133155]/80 border border-slate-300 dark:border-[#254d70] text-[#0f172a] dark:text-white text-xs focus:outline-none focus:border-[#0891b2] dark:focus:border-[#522377] font-mono font-bold"
                  required
                >
                  <option value="">-- Select Occupied Slot --</option>
                  {occupiedSlots.map((slot) => (
                    <option key={slot.id} value={slot.slotNumber}>
                      Slot {slot.slotNumber} {slot.occupiedByVehicleNumber ? `(${slot.occupiedByVehicleNumber})` : ''} [Floor {slot.floorNumber}]
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  value={selectedSlotNumber}
                  onChange={(e) => setSelectedSlotNumber(e.target.value)}
                  placeholder="e.g. C2-A-F1-01"
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-white dark:bg-[#133155]/80 border border-slate-300 dark:border-[#254d70] text-[#0f172a] dark:text-white text-xs focus:outline-none focus:border-[#0891b2] dark:focus:border-[#522377] font-mono uppercase"
                  required
                />
              )}

              {vehicleNumber && (
                <p className="mt-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-mono font-bold">
                  ✓ Vehicle Plate: {vehicleNumber}
                </p>
              )}
            </div>
          ) : (
            <div>
              <label className="block font-bold text-[#0f172a] dark:text-white mb-1">Vehicle Plate Number *</label>
              <input
                type="text"
                value={vehicleNumber}
                onChange={(e) => setVehicleNumber(e.target.value.toUpperCase())}
                placeholder="e.g. KA01AB1234"
                className="w-full px-3.5 py-2.5 rounded-2xl bg-white dark:bg-[#133155]/80 border border-slate-300 dark:border-[#254d70] text-[#0f172a] dark:text-white text-xs focus:outline-none focus:border-[#0891b2] dark:focus:border-[#522377] font-mono uppercase"
                required
              />
            </div>
          )}

          <div>
            <label className="block font-bold text-[#0f172a] dark:text-white mb-2">Payment Method</label>
            <div className="grid grid-cols-3 gap-2">
              {(['CASH', 'CARD', 'UPI'] as PaymentMethod[]).map((method) => (
                <button
                  key={method}
                  type="button"
                  onClick={() => setPaymentMethod(method)}
                  className={`py-2 rounded-2xl border text-xs font-mono font-bold transition-all ${
                    paymentMethod === method
                      ? 'bg-[#0891b2] dark:bg-[#522377] border-[#0891b2] dark:border-[#522377] text-white shadow-md font-black'
                      : 'bg-white dark:bg-[#133155]/60 border-slate-200 dark:border-[#254d70] text-[#0f172a] dark:text-slate-200'
                  }`}
                >
                  {method}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200 dark:border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-[#0f172a] dark:text-slate-400 dark:hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2 rounded-xl text-xs font-bold bg-[#db2777] dark:bg-[#522377] hover:bg-pink-700 text-white shadow-md transition-all disabled:opacity-50"
            >
              {isLoading ? 'Processing...' : 'Complete Check-Out'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
