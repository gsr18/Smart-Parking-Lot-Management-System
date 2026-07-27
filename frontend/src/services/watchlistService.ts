import api from './api';
import { ApiResponse } from '../types';

export interface WatchlistData {
  id: number;
  vehicleNumber: string;
  category: 'BLACK_LISTED' | 'VIP' | 'OUTSTANDING_DUES' | 'FREQUENT_VISITOR';
  reason: string;
  outstandingDues: number;
}

export const watchlistService = {
  addToWatchlist: async (dto: Partial<WatchlistData>): Promise<WatchlistData> => {
    const response = await api.post<ApiResponse<WatchlistData>>('/watchlist', dto);
    return response.data.data;
  },

  checkWatchlist: async (vehicleNumber: string): Promise<WatchlistData | null> => {
    const response = await api.get<ApiResponse<WatchlistData>>('/watchlist/check', {
      params: { vehicleNumber },
    });
    return response.data.data;
  },

  getCompanyWatchlist: async (): Promise<WatchlistData[]> => {
    const response = await api.get<ApiResponse<WatchlistData[]>>('/watchlist');
    return response.data.data;
  },

  removeFromWatchlist: async (id: number): Promise<void> => {
    await api.delete(`/watchlist/${id}`);
  },
};
