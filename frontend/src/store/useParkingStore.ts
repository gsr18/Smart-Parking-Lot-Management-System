import { create } from 'zustand';

export type AppTheme = 'light' | 'dark';

interface ParkingState {
  selectedFloor: number;
  setSelectedFloor: (floor: number) => void;
  isAiDrawerOpen: boolean;
  toggleAiDrawer: () => void;
  selectedSlotNumber: string | null;
  setSelectedSlotNumber: (slotNumber: string | null) => void;
  viewMode: '3d' | '2d';
  toggleViewMode: () => void;
  theme: AppTheme;
  toggleTheme: () => void;
  setTheme: (theme: AppTheme) => void;
}

const initialTheme = (localStorage.getItem('app_theme') as AppTheme) || 'light';

if (initialTheme === 'dark') {
  document.documentElement.classList.add('dark');
} else {
  document.documentElement.classList.remove('dark');
}

export const useParkingStore = create<ParkingState>((set) => ({
  selectedFloor: 1,
  setSelectedFloor: (floor) => set({ selectedFloor: floor }),
  isAiDrawerOpen: false,
  toggleAiDrawer: () => set((state) => ({ isAiDrawerOpen: !state.isAiDrawerOpen })),
  selectedSlotNumber: null,
  setSelectedSlotNumber: (slotNumber) => set({ selectedSlotNumber: slotNumber }),
  viewMode: '2d',
  toggleViewMode: () => set((state) => ({ viewMode: state.viewMode === '3d' ? '2d' : '3d' })),
  theme: initialTheme,
  toggleTheme: () =>
    set((state) => {
      const nextTheme = state.theme === 'light' ? 'dark' : 'light';
      localStorage.setItem('app_theme', nextTheme);
      if (nextTheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      return { theme: nextTheme };
    }),
  setTheme: (theme) => {
    localStorage.setItem('app_theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    set({ theme });
  },
}));
