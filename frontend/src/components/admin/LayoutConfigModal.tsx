import React, { useState, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { X, Building2, Layers, CheckCircle, AlertTriangle, ChevronRight, Sparkles, Grid3X3 } from 'lucide-react';
import { clsx } from 'clsx';
import toast from 'react-hot-toast';
import { useParkingStore } from '../../store/useParkingStore';
import {
  companyService,
  FLOOR_TEMPLATES,
  FloorTemplate,
  LayoutConfigDTO,
} from '../../services/companyService';

interface LayoutConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const FLOOR_COLORS = [
  { bg: 'from-[#0891b2] to-[#06b6d4]', dark: 'dark:from-[#522377] dark:to-[#36195b]', ring: 'ring-[#0891b2] dark:ring-[#522377]', text: 'text-[#0891b2] dark:text-[#c084fc]' },
  { bg: 'from-[#7c3aed] to-[#6d28d9]', dark: 'dark:from-[#1e1b4b] dark:to-[#312e81]', ring: 'ring-purple-500 dark:ring-purple-400', text: 'text-purple-600 dark:text-purple-300' },
  { bg: 'from-[#059669] to-[#047857]', dark: 'dark:from-[#064e3b] dark:to-[#065f46]', ring: 'ring-emerald-500 dark:ring-emerald-400', text: 'text-emerald-600 dark:text-emerald-300' },
  { bg: 'from-[#d97706] to-[#b45309]', dark: 'dark:from-[#78350f] dark:to-[#92400e]', ring: 'ring-amber-500 dark:ring-amber-400', text: 'text-amber-600 dark:text-amber-300' },
];

export const LayoutConfigModal: React.FC<LayoutConfigModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { theme } = useParkingStore();
  const queryClient = useQueryClient();

  const [totalFloors, setTotalFloors] = useState(3);
  const [floorTemplates, setFloorTemplates] = useState<Record<number, string>>({ 1: '5x5', 2: '5x5', 3: '5x5' });
  const [step, setStep] = useState<'floors' | 'templates' | 'confirm'>('floors');

  // Load current layout
  const { data: currentLayout } = useQuery({
    queryKey: ['company-layout'],
    queryFn: companyService.getMyCompanyLayout,
    enabled: isOpen,
  });

  // Pre-populate from saved config
  useEffect(() => {
    if (currentLayout?.layoutConfig) {
      try {
        const parsed: LayoutConfigDTO = JSON.parse(currentLayout.layoutConfig);
        setTotalFloors(parsed.totalFloors);
        setFloorTemplates(parsed.floorTemplates);
      } catch {}
    }
  }, [currentLayout]);

  // When floor count changes, ensure all floors have a template
  useEffect(() => {
    setFloorTemplates(prev => {
      const updated = { ...prev };
      for (let i = 1; i <= totalFloors; i++) {
        if (!updated[i]) updated[i] = '5x5';
      }
      // Remove floors beyond totalFloors
      Object.keys(updated).forEach(k => {
        if (Number(k) > totalFloors) delete updated[Number(k)];
      });
      return updated;
    });
  }, [totalFloors]);

  const applyMutation = useMutation({
    mutationFn: () => companyService.applyLayoutConfig({ totalFloors, floorTemplates }),
    onSuccess: () => {
      toast.success('✅ Layout applied! Parking slots regenerated.');
      queryClient.invalidateQueries({ queryKey: ['slots'] });
      queryClient.invalidateQueries({ queryKey: ['company-layout'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      onSuccess();
      onClose();
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || 'Failed to apply layout.');
    },
  });

  const totalSlots = Object.entries(floorTemplates)
    .filter(([k]) => Number(k) <= totalFloors)
    .reduce((sum, [, tmpl]) => {
      const t = FLOOR_TEMPLATES.find(f => f.id === tmpl);
      return sum + (t ? t.rows * t.cols : 0);
    }, 0);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-2xl glass-panel rounded-3xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#0891b2] to-[#06b6d4] dark:from-[#522377] dark:to-[#36195b] p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-base font-black text-white tracking-tight">Configure Parking Layout</h2>
                <p className="text-xs text-white/70">Select floors and grid templates for your facility</p>
              </div>
            </div>
            <button onClick={onClose} className="w-8 h-8 rounded-xl bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors">
              <X className="w-4 h-4 text-white" />
            </button>
          </div>

          {/* Step indicator */}
          <div className="flex items-center gap-2 mt-4">
            {(['floors', 'templates', 'confirm'] as const).map((s, i) => (
              <React.Fragment key={s}>
                <button
                  onClick={() => setStep(s)}
                  className={clsx(
                    'flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold transition-all',
                    step === s ? 'bg-white text-[#0891b2] dark:text-[#522377]' : 'bg-white/20 text-white/70 hover:bg-white/30 hover:text-white'
                  )}
                >
                  <span className="w-4 h-4 rounded-full bg-current/20 flex items-center justify-center text-[9px]">{i + 1}</span>
                  {s === 'floors' ? 'Floors' : s === 'templates' ? 'Templates' : 'Review'}
                </button>
                {i < 2 && <ChevronRight className="w-3 h-3 text-white/40" />}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          {/* STEP 1: Select number of floors */}
          {step === 'floors' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-black text-[#0f172a] dark:text-white mb-1">How many floors does your facility have?</h3>
                <p className="text-xs text-[#475569] dark:text-slate-400">Choose 1 to 4 floors. Each floor can have its own parking grid template.</p>
              </div>
              <div className="grid grid-cols-4 gap-3">
                {[1, 2, 3, 4].map(n => (
                  <button
                    key={n}
                    onClick={() => setTotalFloors(n)}
                    className={clsx(
                      'group relative p-4 rounded-2xl border-2 transition-all duration-200 flex flex-col items-center gap-2',
                      totalFloors === n
                        ? 'border-[#0891b2] dark:border-[#c084fc] bg-[#cfeef1]/60 dark:bg-[#522377]/20 shadow-md'
                        : 'border-slate-200 dark:border-white/10 hover:border-[#9ed9db] dark:hover:border-white/20'
                    )}
                  >
                    {/* Mini floor stack visualization */}
                    <div className="flex flex-col-reverse gap-0.5">
                      {Array.from({ length: n }).map((_, i) => (
                        <div
                          key={i}
                          className={clsx(
                            'h-2 rounded-sm transition-all',
                            totalFloors === n
                              ? 'bg-[#0891b2] dark:bg-[#c084fc]'
                              : 'bg-slate-300 dark:bg-slate-600',
                          )}
                          style={{ width: `${28 - i * 3}px` }}
                        />
                      ))}
                    </div>
                    <span className={clsx('text-lg font-black', totalFloors === n ? 'text-[#0891b2] dark:text-[#c084fc]' : 'text-[#0f172a] dark:text-white')}>{n}</span>
                    <span className="text-[10px] text-[#475569] dark:text-slate-400 font-medium">{n === 1 ? 'Floor' : 'Floors'}</span>
                    {totalFloors === n && (
                      <CheckCircle className="absolute top-2 right-2 w-3.5 h-3.5 text-[#0891b2] dark:text-[#c084fc]" />
                    )}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setStep('templates')}
                className="w-full py-2.5 rounded-2xl bg-gradient-to-r from-[#0891b2] to-[#06b6d4] dark:from-[#522377] dark:to-[#36195b] text-white font-black text-sm shadow-md hover:opacity-90 transition-opacity"
              >
                Next: Configure Floor Templates →
              </button>
            </div>
          )}

          {/* STEP 2: Select template per floor */}
          {step === 'templates' && (
            <div className="space-y-4 max-h-[420px] overflow-y-auto pr-1">
              {Array.from({ length: totalFloors }, (_, i) => i + 1).map(floor => {
                const color = FLOOR_COLORS[(floor - 1) % FLOOR_COLORS.length];
                return (
                  <div key={floor} className="border border-slate-200 dark:border-white/10 rounded-2xl p-4 space-y-3">
                    <div className="flex items-center gap-2.5">
                      <div className={clsx('w-7 h-7 rounded-xl flex items-center justify-center bg-gradient-to-br text-white text-xs font-black', color.bg, color.dark)}>
                        {floor}
                      </div>
                      <span className="text-sm font-black text-[#0f172a] dark:text-white">Floor {floor}</span>
                      {floorTemplates[floor] && (() => {
                        const t = FLOOR_TEMPLATES.find(f => f.id === floorTemplates[floor]);
                        return t ? (
                          <span className={clsx('ml-auto text-[10px] font-bold font-mono px-2 py-0.5 rounded-full bg-[#cfeef1] dark:bg-[#133155] border border-[#9ed9db] dark:border-[#254d70]', color.text)}>
                            {t.rows * t.cols} slots
                          </span>
                        ) : null;
                      })()}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {FLOOR_TEMPLATES.map(tmpl => {
                        const isSelected = floorTemplates[floor] === tmpl.id;
                        return (
                          <button
                            key={tmpl.id}
                            onClick={() => setFloorTemplates(prev => ({ ...prev, [floor]: tmpl.id }))}
                            className={clsx(
                              'flex items-start gap-2.5 p-3 rounded-xl border transition-all duration-150 text-left',
                              isSelected
                                ? `border-[#0891b2] dark:border-[#c084fc] bg-[#cfeef1]/50 dark:bg-[#522377]/15 shadow-sm`
                                : 'border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20'
                            )}
                          >
                            {/* Grid preview */}
                            <div className="shrink-0 mt-0.5">
                              <div
                                className={clsx('grid gap-px', isSelected ? 'opacity-100' : 'opacity-40')}
                                style={{
                                  gridTemplateColumns: `repeat(${Math.min(tmpl.cols, 8)}, ${Math.min(6, Math.floor(48 / Math.min(tmpl.cols, 8)))}px)`,
                                  width: `${Math.min(tmpl.cols, 8) * Math.min(6, Math.floor(48 / Math.min(tmpl.cols, 8))) + (Math.min(tmpl.cols, 8) - 1)}px`
                                }}
                              >
                                {Array.from({ length: Math.min(tmpl.rows, 6) * Math.min(tmpl.cols, 8) }).map((_, idx) => (
                                  <div
                                    key={idx}
                                    className={clsx('rounded-[1px]', isSelected ? 'bg-[#0891b2] dark:bg-[#c084fc]' : 'bg-slate-300 dark:bg-slate-600')}
                                    style={{ height: `${Math.min(6, Math.floor(48 / Math.min(tmpl.cols, 8)))}px` }}
                                  />
                                ))}
                              </div>
                            </div>

                            <div className="min-w-0">
                              <p className={clsx('text-xs font-black', isSelected ? 'text-[#0891b2] dark:text-[#c084fc]' : 'text-[#0f172a] dark:text-white')}>{tmpl.label}</p>
                              <p className="text-[10px] text-[#475569] dark:text-slate-400 mt-0.5 leading-tight">{tmpl.description}</p>
                            </div>
                            {isSelected && <CheckCircle className="w-3.5 h-3.5 shrink-0 text-[#0891b2] dark:text-[#c084fc] ml-auto mt-0.5" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}

              <button
                onClick={() => setStep('confirm')}
                className="w-full py-2.5 rounded-2xl bg-gradient-to-r from-[#0891b2] to-[#06b6d4] dark:from-[#522377] dark:to-[#36195b] text-white font-black text-sm shadow-md hover:opacity-90 transition-opacity"
              >
                Next: Review & Confirm →
              </button>
            </div>
          )}

          {/* STEP 3: Confirm */}
          {step === 'confirm' && (
            <div className="space-y-4">
              <div className="glass-card rounded-2xl p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#0891b2] dark:text-[#c084fc]" />
                  <h3 className="text-sm font-black text-[#0f172a] dark:text-white">Layout Summary</h3>
                  <span className="ml-auto text-xs font-black font-mono text-[#0891b2] dark:text-[#c084fc]">{totalSlots} total slots</span>
                </div>

                <div className="space-y-2">
                  {Array.from({ length: totalFloors }, (_, i) => i + 1).map(floor => {
                    const tmpl = FLOOR_TEMPLATES.find(t => t.id === floorTemplates[floor]);
                    const color = FLOOR_COLORS[(floor - 1) % FLOOR_COLORS.length];
                    return (
                      <div key={floor} className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-50 dark:bg-white/5">
                        <div className={clsx('w-6 h-6 rounded-lg flex items-center justify-center bg-gradient-to-br text-white text-[10px] font-black shrink-0', color.bg, color.dark)}>
                          {floor}
                        </div>
                        <div className="flex-1">
                          <span className="text-xs font-bold text-[#0f172a] dark:text-white">Floor {floor}</span>
                          <span className="mx-2 text-slate-400">·</span>
                          <span className="text-xs text-[#475569] dark:text-slate-400">{tmpl?.label}</span>
                        </div>
                        <span className="text-xs font-black font-mono text-[#0891b2] dark:text-[#c084fc]">{tmpl ? tmpl.rows * tmpl.cols : 0} slots</span>
                        <Grid3X3 className={clsx('w-3.5 h-3.5', color.text)} />
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-500/30">
                <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <div className="text-xs text-amber-800 dark:text-amber-200">
                  <p className="font-black mb-0.5">This will reset all parking slots</p>
                  <p className="opacity-80">All existing slots will be deleted and recreated. This requires zero active parking sessions. Historical session data will be preserved.</p>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep('templates')}
                  className="flex-1 py-2.5 rounded-2xl border-2 border-slate-200 dark:border-white/10 text-[#0f172a] dark:text-white font-bold text-sm hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
                >
                  ← Back
                </button>
                <button
                  onClick={() => applyMutation.mutate()}
                  disabled={applyMutation.isPending}
                  className="flex-2 flex-1 py-2.5 rounded-2xl bg-gradient-to-r from-[#0891b2] to-[#06b6d4] dark:from-[#522377] dark:to-[#36195b] text-white font-black text-sm shadow-md hover:opacity-90 disabled:opacity-50 transition-all"
                >
                  {applyMutation.isPending ? '⟳ Applying...' : '✓ Apply Layout'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
