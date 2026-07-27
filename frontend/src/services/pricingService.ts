import api from './api';
import { ApiResponse } from '../types';

export interface PricingPolicyData {
  carHourlyRate: number;
  bikeHourlyRate: number;
  truckHourlyRate: number;
  peakMultiplier: number;
  weekendMultiplier: number;
  lostTicketFee: number;
  peakStartHour: number;
  peakEndHour: number;
}

export const pricingService = {
  getPolicy: async (): Promise<PricingPolicyData> => {
    const response = await api.get<ApiResponse<PricingPolicyData>>('/pricing');
    return response.data.data;
  },

  updatePolicy: async (dto: Partial<PricingPolicyData>): Promise<PricingPolicyData> => {
    const response = await api.put<ApiResponse<PricingPolicyData>>('/pricing', dto);
    return response.data.data;
  },
};
