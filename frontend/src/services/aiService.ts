import api from './api';
import { ApiResponse, AiChatResponse, ReportData, SlotRecommendation, VehicleType } from '../types';

export const aiService = {
  chatQuery: async (message: string, conversationContext?: string): Promise<AiChatResponse> => {
    const response = await api.post<ApiResponse<AiChatResponse>>('/ai/chat', {
      message,
      conversationContext,
    });
    return response.data.data;
  },

  recommendSlot: async (vehicleType: VehicleType = 'CAR'): Promise<SlotRecommendation> => {
    const response = await api.get<ApiResponse<SlotRecommendation>>('/ai/recommend-slot', {
      params: { vehicleType },
    });
    return response.data.data;
  },

  explainReport: async (report: ReportData): Promise<string> => {
    const response = await api.post<ApiResponse<string>>('/ai/explain-report', report);
    return response.data.data;
  },
};
