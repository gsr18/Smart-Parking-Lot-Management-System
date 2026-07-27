import React, { useEffect, useState } from 'react';
import { UserCheck, CheckCircle2, XCircle, Clock, X, ShieldAlert } from 'lucide-react';
import toast from 'react-hot-toast';
import { authService } from '../../services/authService';
import { PendingRegistration } from '../../types';
import { Button } from '../common/Button';

interface PendingStaffModalProps {
  isOpen: boolean;
  onClose: () => void;
  companyId: number;
  onUpdate?: () => void;
}

export const PendingStaffModal: React.FC<PendingStaffModalProps> = ({
  isOpen,
  onClose,
  companyId,
  onUpdate,
}) => {
  const [requests, setRequests] = useState<PendingRegistration[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState<number | null>(null);

  const fetchPendingRequests = async () => {
    if (!companyId) return;
    setIsLoading(true);
    try {
      const data = await authService.getPendingStaffRequests(companyId);
      setRequests(data || []);
    } catch (err: any) {
      toast.error('Failed to fetch pending staff requests');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && companyId) {
      fetchPendingRequests();
    }
  }, [isOpen, companyId]);

  const handleApprove = async (id: number, email: string) => {
    setActionLoadingId(id);
    try {
      await authService.approveStaffRequest(id);
      toast.success(`Staff request approved! 6-digit OTP dispatched to ${email}`);
      await fetchPendingRequests();
      if (onUpdate) onUpdate();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to approve staff request');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleReject = async (id: number) => {
    setActionLoadingId(id);
    try {
      await authService.rejectStaffRequest(id, 'Rejected by Administrator from Portal');
      toast.success('Staff request rejected.');
      await fetchPendingRequests();
      if (onUpdate) onUpdate();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to reject staff request');
    } finally {
      setActionLoadingId(null);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Pending Staff Approval Requests</h2>
              <p className="text-xs text-slate-400">Review and authorize staff access for your organization</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="py-12 text-center text-slate-400 font-mono text-xs">
            Loading pending requests...
          </div>
        ) : requests.length === 0 ? (
          <div className="py-12 text-center space-y-2">
            <ShieldAlert className="w-10 h-10 text-slate-600 mx-auto" />
            <p className="text-sm font-semibold text-slate-300">No Pending Staff Requests</p>
            <p className="text-xs text-slate-500">All registration requests have been reviewed.</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
            {requests.map((req) => (
              <div
                key={req.id}
                className="p-4 bg-slate-950 border border-slate-800 rounded-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white">{req.fullName}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-indigo-950 text-indigo-300 border border-indigo-800">
                      @{req.username}
                    </span>
                  </div>
                  <p className="text-xs font-mono text-slate-400">{req.email}</p>
                  <p className="text-[11px] text-slate-500 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> Requested: {new Date(req.createdAt).toLocaleString()}
                  </p>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <Button
                    variant="danger"
                    size="sm"
                    isLoading={actionLoadingId === req.id}
                    onClick={() => handleReject(req.id)}
                    className="flex-1 sm:flex-initial bg-rose-600 hover:bg-rose-700 text-white border-none"
                  >
                    <XCircle className="w-3.5 h-3.5 mr-1 inline" />
                    Reject
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    isLoading={actionLoadingId === req.id}
                    onClick={() => handleApprove(req.id, req.email)}
                    className="flex-1 sm:flex-initial bg-emerald-600 hover:bg-emerald-700 text-white border-none"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 mr-1 inline" />
                    Approve & Send OTP
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="border-t border-slate-800 pt-3 flex justify-end">
          <Button variant="outline" size="sm" onClick={onClose}>
            Close Window
          </Button>
        </div>
      </div>
    </div>
  );
};
