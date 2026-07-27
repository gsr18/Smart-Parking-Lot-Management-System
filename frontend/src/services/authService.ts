import api from './api';
import { ApiResponse, AuthResponse, Company, PendingRegistration } from '../types';

export const authService = {
  login: async (usernameOrEmail: string, password: string): Promise<AuthResponse> => {
    const response = await api.post<ApiResponse<AuthResponse>>('/auth/login', {
      usernameOrEmail,
      password,
    });
    const authData = response.data.data;
    if (authData.accessToken) {
      authService.saveUser(authData);
    }
    return authData;
  },

  getCurrentUser: async (): Promise<AuthResponse> => {
    const response = await api.get<ApiResponse<AuthResponse>>('/auth/me');
    return response.data.data;
  },

  getPublicCompanies: async (): Promise<Company[]> => {
    const response = await api.get<ApiResponse<Company[]>>('/companies/public');
    return response.data.data;
  },

  initiateAdminSignup: async (data: {
    fullName: string;
    email: string;
    username: string;
    password: string;
    companyName: string;
  }) => {
    const response = await api.post<ApiResponse<{ message: string; email: string }>>(
      '/auth/signup/admin/initiate',
      data
    );
    return response.data.data;
  },

  verifyAdminOtp: async (email: string, otpCode: string): Promise<AuthResponse> => {
    const response = await api.post<ApiResponse<AuthResponse>>('/auth/signup/admin/verify', {
      email,
      otpCode,
    });
    const authData = response.data.data;
    if (authData.accessToken) {
      authService.saveUser(authData);
    }
    return authData;
  },

  requestStaffSignup: async (data: {
    fullName: string;
    email: string;
    username: string;
    password: string;
    companyId: number;
  }) => {
    const response = await api.post<ApiResponse<{ message: string; email: string }>>(
      '/auth/signup/staff/request',
      data
    );
    return response.data.data;
  },

  getPendingStaffRequests: async (companyId: number): Promise<PendingRegistration[]> => {
    const response = await api.get<ApiResponse<PendingRegistration[]>>(
      `/auth/pending-staff/${companyId}`
    );
    return response.data.data;
  },

  approveStaffRequest: async (pendingId: number) => {
    const response = await api.post<ApiResponse<{ message: string; otpCode?: string }>>(
      `/auth/signup/staff/approve/${pendingId}`
    );
    return response.data.data;
  },

  rejectStaffRequest: async (pendingId: number, reason?: string) => {
    const response = await api.post<ApiResponse<{ message: string }>>(
      `/auth/signup/staff/reject/${pendingId}`,
      { reason }
    );
    return response.data.data;
  },

  getStaffSignupStatus: async (email: string) => {
    const response = await api.get<ApiResponse<Record<string, string>>>(
      `/auth/signup/staff/status?email=${encodeURIComponent(email)}`
    );
    return response.data.data;
  },

  verifyStaffOtp: async (email: string, otpCode: string): Promise<AuthResponse> => {
    const response = await api.post<ApiResponse<AuthResponse>>('/auth/signup/staff/verify', {
      email,
      otpCode,
    });
    const authData = response.data.data;
    if (authData.accessToken) {
      authService.saveUser(authData);
    }
    return authData;
  },

  logout: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_info');
    localStorage.removeItem('active_role');
  },

  saveUser: (authData: AuthResponse) => {
    if (authData.accessToken) {
      localStorage.setItem('access_token', authData.accessToken);
    }
    localStorage.setItem('user_info', JSON.stringify(authData));
  },

  getStoredUser: (): AuthResponse | null => {
    const userStr = localStorage.getItem('user_info');
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  },
};
