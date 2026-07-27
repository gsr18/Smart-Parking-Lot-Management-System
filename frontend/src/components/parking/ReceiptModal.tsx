import React from 'react';
import { FileText, Printer, CheckCircle, X } from 'lucide-react';
import { CheckOutResponse } from '../../types';
import { Button } from '../common/Button';

interface ReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  receipt: CheckOutResponse | null;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({ isOpen, onClose, receipt }) => {
  if (!isOpen || !receipt) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 dark:bg-black/70 backdrop-blur-md animate-fade-in select-none">
      <div className="bg-white dark:bg-[#080b38] w-full max-w-sm rounded-3xl p-6 relative border border-[#9ed9db] dark:border-[#522377] shadow-2xl space-y-4">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:text-slate-300 dark:hover:text-white rounded-lg transition-colors font-bold print:hidden"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-1 border-b border-slate-200 dark:border-white/10 pb-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-500/40 text-emerald-800 dark:text-emerald-200 flex items-center justify-center mx-auto">
            <CheckCircle className="w-6 h-6" />
          </div>
          <h3 className="text-base font-black text-[#0f172a] dark:text-white">SmartParking Gate Slip</h3>
          <p className="text-[11px] font-mono text-slate-500 dark:text-slate-300">{receipt.receiptNumber}</p>
        </div>

        <div className="space-y-2 text-xs font-mono">
          <div className="flex justify-between py-1 border-b border-slate-100 dark:border-white/5">
            <span className="text-slate-500 dark:text-slate-400">Vehicle Plate</span>
            <span className="font-bold text-[#0891b2] dark:text-[#38bdf8]">{receipt.vehicleNumber}</span>
          </div>

          <div className="flex justify-between py-1 border-b border-slate-100 dark:border-white/5">
            <span className="text-slate-500 dark:text-slate-400">Owner Name</span>
            <span className="font-bold text-[#0f172a] dark:text-white">{receipt.ownerName || 'Guest'}</span>
          </div>

          <div className="flex justify-between py-1 border-b border-slate-100 dark:border-white/5">
            <span className="text-slate-500 dark:text-slate-400">Parking Slot</span>
            <span className="font-bold text-[#0f172a] dark:text-[#f5d0fe]">{receipt.slotNumber}</span>
          </div>

          <div className="flex justify-between py-1 border-b border-slate-100 dark:border-white/5">
            <span className="text-slate-500 dark:text-slate-400">Duration</span>
            <span className="font-bold text-[#0f172a] dark:text-white">{receipt.durationMinutes} mins</span>
          </div>

          <div className="flex justify-between py-2 bg-[#f3f9fc] dark:bg-[#133155]/60 px-3 rounded-2xl border border-slate-200 dark:border-[#254d70] mt-3">
            <span className="font-bold text-[#0f172a] dark:text-white">Total Paid Fee</span>
            <span className="font-black text-[#0891b2] dark:text-[#38bdf8] text-sm">₹{receipt.parkingFee.toFixed(2)}</span>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 pt-2 print:hidden">
          <Button variant="outline" size="sm" icon={Printer} onClick={handlePrint}>
            Print Slip
          </Button>
          <Button variant="primary" size="sm" onClick={onClose}>
            Done
          </Button>
        </div>
      </div>
    </div>
  );
};
