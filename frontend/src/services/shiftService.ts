import api from './api';
import { ApiResponse } from '../types';

export interface ShiftData {
  id: number;
  userId: number;
  staffUsername: string;
  staffFullName: string;
  startTime: string;
  endTime?: string;
  status: 'ACTIVE' | 'ENDED';
  checkinsCount: number;
  checkoutsCount: number;
  revenueCollected: number;
  notes?: string;
}

export const shiftService = {
  startShift: async (notes?: string): Promise<ShiftData> => {
    const response = await api.post<ApiResponse<ShiftData>>('/shifts/start', { notes });
    return response.data.data;
  },

  endShift: async (notes?: string): Promise<ShiftData> => {
    const response = await api.post<ApiResponse<ShiftData>>('/shifts/end', { notes });
    return response.data.data;
  },

  getActiveShift: async (): Promise<ShiftData | null> => {
    const response = await api.get<ApiResponse<ShiftData>>('/shifts/active');
    return response.data.data;
  },

  getCompanyShifts: async (): Promise<ShiftData[]> => {
    const response = await api.get<ApiResponse<ShiftData[]>>('/shifts');
    return response.data.data;
  },
};
