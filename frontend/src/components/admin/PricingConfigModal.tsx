import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { DollarSign, X } from 'lucide-react';
import { pricingService, PricingPolicyData } from '../../services/pricingService';
import { Button } from '../common/Button';
import toast from 'react-hot-toast';

interface PricingConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PricingConfigModal: React.FC<PricingConfigModalProps> = ({ isOpen, onClose }) => {
  const queryClient = useQueryClient();
  const [carRate, setCarRate] = useState<number>(50);
  const [bikeRate, setBikeRate] = useState<number>(20);
  const [truckRate, setTruckRate] = useState<number>(120);
  const [peakMultiplier, setPeakMultiplier] = useState<number>(1.20);
  const [weekendMultiplier, setWeekendMultiplier] = useState<number>(1.15);
  const [lostTicketFee, setLostTicketFee] = useState<number>(500);

  const { data: policy } = useQuery({
    queryKey: ['pricing-policy'],
    queryFn: pricingService.getPolicy,
    enabled: isOpen,
  });

  useEffect(() => {
    if (policy) {
      setCarRate(policy.carHourlyRate || 50);
      setBikeRate(policy.bikeHourlyRate || 20);
      setTruckRate(policy.truckHourlyRate || 120);
      setPeakMultiplier(policy.peakMultiplier || 1.20);
      setWeekendMultiplier(policy.weekendMultiplier || 1.15);
      setLostTicketFee(policy.lostTicketFee || 500);
    }
  }, [policy]);

  const updateMutation = useMutation({
    mutationFn: (dto: Partial<PricingPolicyData>) => pricingService.updatePolicy(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pricing-policy'] });
      toast.success('Dynamic pricing policy updated successfully!');
      onClose();
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to update pricing policy');
    },
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate({
      carHourlyRate: carRate,
      bikeHourlyRate: bikeRate,
      truckHourlyRate: truckRate,
      peakMultiplier,
      weekendMultiplier,
      lostTicketFee,
    });
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-md w-full p-6 space-y-4 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-bold text-white">Dynamic Pricing Policy Config</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Car Rate (₹/hr)</label>
              <input
                type="number"
                value={carRate}
                onChange={(e) => setCarRate(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-white font-mono"
                required
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Bike Rate (₹/hr)</label>
              <input
                type="number"
                value={bikeRate}
                onChange={(e) => setBikeRate(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-white font-mono"
                required
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Truck Rate (₹/hr)</label>
              <input
                type="number"
                value={truckRate}
                onChange={(e) => setTruckRate(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-white font-mono"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Peak Hours (1.20 = +20%)</label>
              <input
                type="number"
                step="0.05"
                value={peakMultiplier}
                onChange={(e) => setPeakMultiplier(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-white font-mono"
                required
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Weekend (1.15 = +15%)</label>
              <input
                type="number"
                step="0.05"
                value={weekendMultiplier}
                onChange={(e) => setWeekendMultiplier(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-white font-mono"
                required
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1">Lost Parking Ticket Flat Penalty (₹)</label>
            <input
              type="number"
              value={lostTicketFee}
              onChange={(e) => setLostTicketFee(Number(e.target.value))}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-white font-mono"
              required
            />
          </div>

          <div className="flex items-center justify-end gap-2 border-t border-slate-800 pt-3">
            <Button variant="outline" size="sm" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit" isLoading={updateMutation.isPending}>
              Save Pricing Policy
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
