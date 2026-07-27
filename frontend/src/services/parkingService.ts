import api from './api';
import { ApiResponse, CheckInRequest, CheckInResponse, CheckOutRequest, CheckOutResponse, PageResponse, ParkingStatus } from '../types';

export const parkingService = {
  checkIn: async (payload: CheckInRequest): Promise<CheckInResponse> => {
    const response = await api.post<ApiResponse<CheckInResponse>>('/parking/checkin', payload);
    return response.data.data;
  },

  checkOut: async (payload: CheckOutRequest): Promise<CheckOutResponse> => {
    const response = await api.post<ApiResponse<CheckOutResponse>>('/parking/checkout', payload);
    return response.data.data;
  },

  getActiveSessions: async (page = 0, size = 10): Promise<PageResponse<CheckInResponse>> => {
    const response = await api.get<ApiResponse<PageResponse<CheckInResponse>>>('/parking/active', {
      params: { page, size },
    });
    return response.data.data;
  },

  getParkingHistory: async (
    vehicleNumber?: string,
    status?: ParkingStatus,
    startDate?: string,
    endDate?: string,
    page = 0,
    size = 10,
    sortBy = 'entryTime',
    sortDir = 'desc'
  ): Promise<PageResponse<CheckOutResponse>> => {
    const response = await api.get<ApiResponse<PageResponse<CheckOutResponse>>>('/parking/history', {
      params: { vehicleNumber, status, startDate, endDate, page, size, sortBy, sortDir },
    });
    return response.data.data;
  },

  getSessionDetails: async (sessionId: number): Promise<CheckOutResponse> => {
    const response = await api.get<ApiResponse<CheckOutResponse>>(`/parking/session/${sessionId}`);
    return response.data.data;
  },
};
