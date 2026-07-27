import api from './api';
import { ApiResponse, PageResponse, Vehicle, VehicleType } from '../types';

export interface VehicleRegisterPayload {
  vehicleNumber: string;
  vehicleType: VehicleType;
  ownerName: string;
  ownerContact: string;
}

export const vehicleService = {
  registerVehicle: async (payload: VehicleRegisterPayload): Promise<Vehicle> => {
    const response = await api.post<ApiResponse<Vehicle>>('/vehicles', payload);
    return response.data.data;
  },

  getAllVehicles: async (page = 0, size = 10, sortBy = 'createdAt', sortDir = 'desc'): Promise<PageResponse<Vehicle>> => {
    const response = await api.get<ApiResponse<PageResponse<Vehicle>>>('/vehicles', {
      params: { page, size, sortBy, sortDir },
    });
    return response.data.data;
  },

  getVehicleByNumber: async (vehicleNumber: string): Promise<Vehicle> => {
    const response = await api.get<ApiResponse<Vehicle>>(`/vehicles/${vehicleNumber}`);
    return response.data.data;
  },

  searchVehicles: async (keyword: string, page = 0, size = 10): Promise<PageResponse<Vehicle>> => {
    const response = await api.get<ApiResponse<PageResponse<Vehicle>>>('/vehicles/search', {
      params: { keyword, page, size },
    });
    return response.data.data;
  },
};
