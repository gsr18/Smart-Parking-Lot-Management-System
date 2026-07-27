import api from './api';
import { ApiResponse, ReportData, RevenueSummary } from '../types';

export const reportService = {
  getDailyReport: async (date?: string): Promise<ReportData> => {
    const response = await api.get<ApiResponse<ReportData>>('/reports/daily', {
      params: { date },
    });
    return response.data.data;
  },

  getWeeklyReport: async (date?: string): Promise<ReportData> => {
    const response = await api.get<ApiResponse<ReportData>>('/reports/weekly', {
      params: { date },
    });
    return response.data.data;
  },

  getMonthlyReport: async (year = 2026, month = 7): Promise<ReportData> => {
    const response = await api.get<ApiResponse<ReportData>>('/reports/monthly', {
      params: { year, month },
    });
    return response.data.data;
  },

  getRevenueSummary: async (): Promise<RevenueSummary> => {
    const response = await api.get<ApiResponse<RevenueSummary>>('/reports/revenue');
    return response.data.data;
  },
};
