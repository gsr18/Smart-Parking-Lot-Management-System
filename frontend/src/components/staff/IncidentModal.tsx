import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AlertTriangle, X } from 'lucide-react';
import { incidentService, IncidentRequest } from '../../services/incidentService';
import { Button } from '../common/Button';
import toast from 'react-hot-toast';

interface IncidentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const IncidentModal: React.FC<IncidentModalProps> = ({ isOpen, onClose }) => {
  const queryClient = useQueryClient();
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [type, setType] = useState('Vehicle Damage');
  const [priority, setPriority] = useState<'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'>('MEDIUM');
  const [notes, setNotes] = useState('');

  const reportMutation = useMutation({
    mutationFn: (req: IncidentRequest) => incidentService.reportIncident(req),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['incidents-company'] });
      toast.success(`Incident ${data.incidentNumber} reported successfully!`);
      onClose();
      setVehicleNumber('');
      setNotes('');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to report incident');
    },
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!notes.trim()) {
      toast.error('Please enter incident description');
      return;
    }

    reportMutation.mutate({
      vehicleNumber: vehicleNumber.trim() || undefined,
      type,
      priority,
      notes,
    });
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-md w-full p-6 space-y-4 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-bold text-white">Report Gate Incident</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div>
            <label className="block font-semibold text-slate-300 mb-1">Incident Category</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
            >
              <option value="Vehicle Damage">Vehicle Damage / Scratch</option>
              <option value="Wrong Parking">Wrong Parking / Line Crossing</option>
              <option value="Blocked Slot">Blocked Slot / Obstruction</option>
              <option value="Unauthorized Parking">Unauthorized Entry</option>
              <option value="Customer Complaint">Customer Complaint</option>
              <option value="Barrier Failure">Barrier / Gate Failure</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1">Vehicle Plate (Optional)</label>
            <input
              type="text"
              value={vehicleNumber}
              onChange={(e) => setVehicleNumber(e.target.value.toUpperCase())}
              placeholder="e.g. KA01AB1234"
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 font-mono uppercase"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1">Priority Level</label>
            <div className="grid grid-cols-4 gap-1.5 font-mono">
              {(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'] as const).map((p) => (
                <button
                  type="button"
                  key={p}
                  onClick={() => setPriority(p)}
                  className={`py-1.5 rounded text-[11px] font-bold border transition-colors ${
                    priority === p
                      ? 'bg-amber-600 text-white border-amber-400 shadow-sm dark:shadow-[#080b38]/50'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1">Incident Notes / Description *</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Describe what happened, exact location, driver response..."
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
              rows={3}
              required
            />
          </div>

          <div className="flex items-center justify-end gap-2 border-t border-slate-800 pt-3">
            <Button variant="outline" size="sm" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit" isLoading={reportMutation.isPending}>
              Submit Incident Report
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
