import api from './api';
import { ApiResponse, ParkingSlot, SlotStatus, SlotType } from '../types';

export interface SlotPayload {
  slotNumber: string;
  slotType: SlotType;
  floorNumber: number;
  status?: SlotStatus;
}

export const slotService = {
  createSlot: async (payload: SlotPayload): Promise<ParkingSlot> => {
    const response = await api.post<ApiResponse<ParkingSlot>>('/slots', payload);
    return response.data.data;
  },

  updateSlot: async (id: number, payload: SlotPayload): Promise<ParkingSlot> => {
    const response = await api.put<ApiResponse<ParkingSlot>>(`/slots/${id}`, payload);
    return response.data.data;
  },

  disableSlot: async (id: number): Promise<ParkingSlot> => {
    const response = await api.patch<ApiResponse<ParkingSlot>>(`/slots/${id}/disable`);
    return response.data.data;
  },

  enableSlot: async (id: number): Promise<ParkingSlot> => {
    const response = await api.patch<ApiResponse<ParkingSlot>>(`/slots/${id}/enable`);
    return response.data.data;
  },

  getAllSlots: async (): Promise<ParkingSlot[]> => {
    const response = await api.get<ApiResponse<ParkingSlot[]>>('/slots');
    return response.data.data;
  },

  getAvailableSlots: async (slotType?: SlotType): Promise<ParkingSlot[]> => {
    const response = await api.get<ApiResponse<ParkingSlot[]>>('/slots/available', {
      params: { slotType },
    });
    return response.data.data;
  },

  getSlotsByFloor: async (floorNumber: number): Promise<ParkingSlot[]> => {
    const response = await api.get<ApiResponse<ParkingSlot[]>>(`/slots/floor/${floorNumber}`);
    return response.data.data;
  },

  getFloorNumbers: async (): Promise<number[]> => {
    const response = await api.get<ApiResponse<number[]>>('/slots/floors');
    return response.data.data;
  },
};
