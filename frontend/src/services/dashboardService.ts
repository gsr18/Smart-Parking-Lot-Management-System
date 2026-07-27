import api from './api';
import { ApiResponse, DashboardSummary, RecentActivity, VehicleDistribution } from '../types';

export const dashboardService = {
  getSummary: async (): Promise<DashboardSummary> => {
    const response = await api.get<ApiResponse<DashboardSummary>>('/dashboard');
    return response.data.data;
  },

  getRecentActivity: async (): Promise<RecentActivity[]> => {
    const response = await api.get<ApiResponse<RecentActivity[]>>('/dashboard/recent-activity');
    return response.data.data;
  },

  getVehicleDistribution: async (): Promise<VehicleDistribution> => {
    const response = await api.get<ApiResponse<VehicleDistribution>>('/dashboard/vehicle-distribution');
    return response.data.data;
  },
};
