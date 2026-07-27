import { create } from 'zustand';
import { AuthResponse } from '../types';
import { authService } from '../services/authService';

interface AuthState {
  user: AuthResponse | null;
  isAuthenticated: boolean;
  activeRole: 'ROLE_ADMIN' | 'ROLE_STAFF';
  setUser: (user: AuthResponse | null) => void;
  switchRole: (role: 'ROLE_ADMIN' | 'ROLE_STAFF') => void;
  logout: () => void;
  initialize: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => {
  const storedUser = authService.getStoredUser();
  const initialRole = storedUser && storedUser.roles.includes('ROLE_ADMIN') ? 'ROLE_ADMIN' : 'ROLE_STAFF';

  return {
    user: storedUser,
    isAuthenticated: !!storedUser,
    activeRole: (localStorage.getItem('active_role') as any) || initialRole,

    setUser: (user) => {
      if (user) {
        authService.saveUser(user);
        const role = user.roles.includes('ROLE_ADMIN') ? 'ROLE_ADMIN' : 'ROLE_STAFF';
        localStorage.setItem('active_role', role);
        set({ user, isAuthenticated: true, activeRole: role });
      } else {
        authService.logout();
        set({ user: null, isAuthenticated: false, activeRole: 'ROLE_STAFF' });
      }
    },

    switchRole: (newRole) => {
      const { user } = get();
      if (!user) return;
      // STRICT RESTRICTION: Staff can NEVER switch to ROLE_ADMIN
      if (newRole === 'ROLE_ADMIN' && !user.roles.includes('ROLE_ADMIN')) {
        return;
      }
      localStorage.setItem('active_role', newRole);
      set({ activeRole: newRole });
    },

    logout: () => {
      authService.logout();
      set({ user: null, isAuthenticated: false, activeRole: 'ROLE_STAFF' });
    },

    initialize: () => {
      const user = authService.getStoredUser();
      if (user) {
        const role = (localStorage.getItem('active_role') as any) || (user.roles.includes('ROLE_ADMIN') ? 'ROLE_ADMIN' : 'ROLE_STAFF');
        set({ user, isAuthenticated: true, activeRole: role });
      } else {
        set({ user: null, isAuthenticated: false, activeRole: 'ROLE_STAFF' });
      }
    },
  };
});
