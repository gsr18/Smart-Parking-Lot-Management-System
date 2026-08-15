import React, { useState, useEffect } from 'react';
import { Sparkles, Car, Bike, Truck, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { VehicleType } from '../../types';
import { parkingService } from '../../services/parkingService';
import { aiService } from '../../services/aiService';

interface CheckInModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialSlotNumber?: string;
  initialVehicleNumber?: string;
}

export const CheckInModal: React.FC<CheckInModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  initialSlotNumber = '',
  initialVehicleNumber = '',
}) => {
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [vehicleType, setVehicleType] = useState<VehicleType>('CAR');
  const [ownerName, setOwnerName] = useState('');
  const [ownerContact, setOwnerContact] = useState('');
  const [preferredSlot, setPreferredSlot] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isAiRecommending, setIsAiRecommending] = useState(false);
  const [aiReason, setAiReason] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      if (initialSlotNumber) setPreferredSlot(initialSlotNumber);
      if (initialVehicleNumber) setVehicleNumber(initialVehicleNumber);
    } else {
      setVehicleNumber('');
      setOwnerName('');
      setOwnerContact('');
      setPreferredSlot('');
      setAiReason(null);
    }
  }, [isOpen, initialSlotNumber, initialVehicleNumber]);

  if (!isOpen) return null;

  const handleAiRecommend = async () => {
    setIsAiRecommending(true);
    setAiReason(null);
    try {
      const rec = await aiService.recommendSlot(vehicleType);
      if (rec.slotNumber) {
        setPreferredSlot(rec.slotNumber);
        setAiReason(rec.reason || rec.aiRecommendationSummary || null);
        toast.success(`AI Recommended Slot ${rec.slotNumber}!`);
      } else {
        toast.error("AI couldn't find an available slot for this vehicle type.");
      }
    } catch {
      toast.error('Failed to fetch AI slot recommendation.');
    } finally {
      setIsAiRecommending(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!vehicleNumber.trim() || !ownerName.trim() || !ownerContact.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (!/^[0-9]{10}$/.test(ownerContact.trim())) {
      toast.error('Contact number must be exactly 10 digits');
      return;
    }

    setIsLoading(true);
    try {
      const resp = await parkingService.checkIn({
        vehicleNumber: vehicleNumber.trim().toUpperCase(),
        vehicleType,
        ownerName: ownerName.trim(),
        ownerContact: ownerContact.trim(),
        preferredSlotNumber: preferredSlot.trim() || undefined,
      });

      toast.success(`Vehicle ${resp.vehicleNumber} checked in successfully to Slot ${resp.slotNumber}!`);
      onSuccess();
      onClose();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Check-in failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 dark:bg-black/70 backdrop-blur-md animate-fade-in select-none">
      <div className="bg-white dark:bg-[#080b38] w-full max-w-lg rounded-3xl p-6 relative border border-[#9ed9db] dark:border-[#522377] shadow-2xl space-y-4">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:text-slate-300 dark:hover:text-white rounded-lg transition-colors font-bold"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 border-b border-slate-200 dark:border-white/10 pb-3">
          <div className="p-3 rounded-2xl bg-[#cfeef1] dark:bg-[#522377]/40 border border-[#9ed9db] dark:border-[#522377] text-[#0891b2] dark:text-[#38bdf8]">
            <Car className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-black text-[#0f172a] dark:text-white">Vehicle Gate Check-In</h2>
            <p className="text-xs text-[#0e7490] dark:text-purple-300 font-mono">Allocate a parking slot & initialize session</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Vehicle Type Selection */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#0f172a] dark:text-white mb-2">Vehicle Category</label>
            <div className="grid grid-cols-3 gap-3">
              {(['CAR', 'BIKE', 'TRUCK'] as VehicleType[]).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setVehicleType(type)}
                  className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-xs font-bold transition-all ${
                    vehicleType === type
                      ? 'bg-[#0891b2] dark:bg-[#522377] border-[#0891b2] dark:border-[#522377] text-white shadow-md font-black'
                      : 'bg-white dark:bg-[#133155]/60 border-slate-20-[#9ed9db] dark:border-[#254d70] text-[#0f172a] dark:text-slate-200 hover:bg-[#cfeef1]/30 dark:hover:bg-[#133155]'
                  }`}
                >
                  {type === 'CAR' && <Car className="w-5 h-5 mb-1" />}
                  {type === 'BIKE' && <Bike className="w-5 h-5 mb-1" />}
                  {type === 'TRUCK' && <Truck className="w-5 h-5 mb-1" />}
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Vehicle Number & Owner Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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
            <div>
              <label className="block font-bold text-[#0f172a] dark:text-white mb-1">Owner Name *</label>
              <input
                type="text"
                value={ownerName}
                onChange={(e) => setOwnerName(e.target.value)}
                placeholder="e.g. Rahul Sharma"
                className="w-full px-3.5 py-2.5 rounded-2xl bg-white dark:bg-[#133155]/80 border border-slate-300 dark:border-[#254d70] text-[#0f172a] dark:text-white text-xs focus:outline-none focus:border-[#0891b2] dark:focus:border-[#522377]"
                required
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-[#0f172a] dark:text-white mb-1">Owner Contact Number (10 Digits) *</label>
            <input
              type="tel"
              value={ownerContact}
              onChange={(e) => setOwnerContact(e.target.value)}
              placeholder="e.g. 9876543210"
              maxLength={10}
              className="w-full px-3.5 py-2.5 rounded-2xl bg-white dark:bg-[#133155]/80 border border-slate-300 dark:border-[#254d70] text-[#0f172a] dark:text-white text-xs focus:outline-none focus:border-[#0891b2] dark:focus:border-[#522377] font-mono"
              required
            />
          </div>

          {/* Slot Allocation & AI Recommendation */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block font-bold text-[#0f172a] dark:text-white">Preferred Slot (Optional)</label>
              <button
                type="button"
                onClick={handleAiRecommend}
                disabled={isAiRecommending}
                className="inline-flex items-center gap-1.5 text-xs text-[#0891b2] dark:text-[#38bdf8] hover:text-[#0e7490] font-bold transition-colors disabled:opacity-50"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                {isAiRecommending ? 'AI Recommending...' : 'AI Recommend Slot'}
              </button>
            </div>
            <input
              type="text"
              value={preferredSlot}
              onChange={(e) => setPreferredSlot(e.target.value.toUpperCase())}
              placeholder="Leave empty for auto-allocation (e.g. A-101)"
              className="w-full px-3.5 py-2.5 rounded-2xl bg-white dark:bg-[#133155]/80 border border-slate-300 dark:border-[#254d70] text-[#0f172a] dark:text-white text-xs focus:outline-none focus:border-[#0891b2] dark:focus:border-[#522377] font-mono uppercase"
            />
            {aiReason && (
              <p className="mt-1.5 text-[11px] text-[#0891b2] dark:text-[#38bdf8] bg-[#cfeef1]/60 dark:bg-[#133155] p-2.5 rounded-xl border border-[#9ed9db] dark:border-[#254d70]">
                🤖 <strong>AI Insight:</strong> {aiReason}
              </p>
            )}
          </div>

          {/* Submit & Cancel */}
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
              className="px-6 py-2 rounded-xl text-xs font-bold bg-[#0891b2] dark:bg-[#522377] hover:bg-[#0e7490] text-white shadow-md transition-all disabled:opacity-50"
            >
              {isLoading ? 'Processing...' : 'Confirm Check-In'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
