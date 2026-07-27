import { create } from 'zustand';

interface ThemeState {
  theme: 'dark' | 'light';
  toggleTheme: () => void;
}

export const useThemeStore = create<ThemeState>((set) => ({
  theme: (localStorage.getItem('app_theme') as 'dark' | 'light') || 'dark',

  toggleTheme: () => {
    set((state) => {
      const nextTheme = state.theme === 'dark' ? 'light' : 'dark';
      localStorage.setItem('app_theme', nextTheme);
      if (nextTheme === 'dark') {
        document.documentElement.classList.add('dark');
        document.documentElement.classList.remove('light');
      } else {
        document.documentElement.classList.add('light');
        document.documentElement.classList.remove('dark');
      }
      return { theme: nextTheme };
    });
  },
}));
